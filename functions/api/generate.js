const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Maps niche IDs to their env var prompt keys
const NICHE_PROMPT_KEYS = {
  weapons: 'NICHE_WEAPONS_PROMPT',
};

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  const { niche, placeholders, draft, stage, temperature } = body;

  if (!stage || !['write', 'clean'].includes(stage)) {
    return jsonError('Invalid or missing stage. Must be "write" or "clean".', 400);
  }

  if (!env.OPENROUTER_API_KEY) {
    return jsonError('OPENROUTER_API_KEY is not configured on this server.', 500);
  }

  let messages;
  let model;
  const temp = parseFloat(temperature) || (stage === 'write' ? 0.8 : 0.3);

  if (stage === 'write') {
    if (!niche || !placeholders) {
      return jsonError('Missing niche or placeholders for write stage.', 400);
    }

    const promptKey = NICHE_PROMPT_KEYS[niche];
    if (!promptKey) {
      return jsonError(`Unknown niche: "${niche}"`, 400);
    }

    let masterPrompt = env[promptKey];
    if (!masterPrompt) {
      return jsonError(
        `Prompt for niche "${niche}" is not configured. Set the ${promptKey} environment variable.`,
        500
      );
    }

    // Replace all {{PLACEHOLDER}} tokens with provided values
    for (const [key, value] of Object.entries(placeholders)) {
      masterPrompt = masterPrompt.replaceAll(`{{${key}}}`, value || '');
    }

    // Build system context from optional supplementary prompts
    const systemParts = ['You are a professional video script writer.'];
    if (env.STORYTELLING_PROMPT) {
      systemParts.push('\n\n' + env.STORYTELLING_PROMPT);
    }
    if (env.HOOK_PROMPT) {
      systemParts.push('\n\n' + env.HOOK_PROMPT);
    }

    messages = [
      { role: 'system', content: systemParts.join('') },
      { role: 'user', content: masterPrompt },
    ];
    model = 'anthropic/claude-opus-4-6';

  } else {
    // stage === 'clean'
    if (!draft) {
      return jsonError('Missing draft for clean stage.', 400);
    }

    const antipatternPrompt = env.ANTIPATTERN_PROMPT ||
      'You are an editor. Review this script and remove all AI-sounding language, clichés, generic phrases, and hollow filler. Keep the meaning and structure intact. Make it sound specific, direct, and human. Return only the improved script with no commentary.';

    messages = [
      { role: 'system', content: antipatternPrompt },
      { role: 'user', content: draft },
    ];
    model = 'anthropic/claude-sonnet-4-6';
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://scripter.pages.dev',
        'X-Title': 'Scripter',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: temp,
        max_tokens: 8000,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return jsonError(`OpenRouter error (${response.status}): ${errText}`, response.status);
    }

    // Stream the response straight through to the client
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    });

  } catch (err) {
    return jsonError(`Server error: ${err.message}`, 500);
  }
}

function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
