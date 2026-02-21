const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Niche UI schemas — only structure and labels, never the actual prompts
const NICHES = [
  {
    id: 'weapons',
    name: 'Weapons',
    icon: '⚔️',
    placeholders: {
      WEAPON_NAME: {
        type: 'text',
        label: 'Weapon Name',
        placeholder: 'e.g., Katana, Gladius, Longbow, AK-47',
        order: 1,
      },
      ERA_OF_CONFLICT: {
        type: 'text',
        label: 'Era of Conflict',
        placeholder: 'e.g., Feudal Japan, World War II, Cold War',
        order: 2,
      },
      HOOK_TYPE: {
        type: 'dropdown',
        label: 'Hook Type',
        options: [
          'The Impossible Problem',
          'The Secret Weapon',
          'The Body Count',
          'The Desperate Gamble',
          'The Unintended Horror',
          'The Forgotten Prototype',
          "The Soldier's First Encounter",
          'The Race Against Time',
          'The Banned Weapon',
          'The What-If Scenario',
        ],
        order: 3,
      },
      STRUCTURE_TYPE: {
        type: 'dropdown',
        label: 'Script Structure',
        options: [
          'Problem → Solution → Consequence',
          'Before/During/After',
          'Design → Field Test → Legacy',
          'The Duel',
          'Timeline Cascade',
          'Myth → Reality',
          'Single Battle Focus',
          "Inventor's Journey",
          'Failure → Iteration → Success',
          'Comparative Analysis',
        ],
        order: 4,
      },
      SOURCE_LINKS: {
        type: 'links',
        label: 'Source Links',
        placeholder: 'Paste source URLs separated by commas',
        order: 5,
      },
    },
  },
];

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (context.request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  return Response.json(NICHES, { headers: corsHeaders });
}
