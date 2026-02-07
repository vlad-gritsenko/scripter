// ============================================
// SCRIPT BUILDER - Multi-Stage Generation
// ============================================

// ============================================
// 1. PARAMETER OPTIONS
// ============================================

const NARRATIVE_STYLES = [
    { id: 'documentary', name: 'Documentary Investigation', description: 'Presents findings like an investigative piece' },
    { id: 'first-person', name: 'First-Person Narrative', description: 'Personal, experiential storytelling' },
    { id: 'dialogue', name: 'Expert Dialogue', description: 'Conversation between knowledgeable voices' },
    { id: 'monologue', name: 'Internal Monologue', description: 'Stream of inner thoughts and reflections' },
    { id: 'flashback', name: 'Flashback Sequence', description: 'Weaves past and present together' },
    { id: 'correspondence', name: 'Message/Letter Format', description: 'Written as personal correspondence' },
    { id: 'voiceover', name: 'Voiceover Narration', description: 'Like a documentary narrator observing' },
    { id: 'stream', name: 'Stream of Consciousness', description: 'Flowing, unfiltered thought process' },
    { id: 'case-study', name: 'Case Study Analysis', description: 'Examines a specific example in depth' },
    { id: 'interview', name: 'Interview Transcript', description: 'Q&A format revealing insights' },
    { id: 'unreliable', name: 'Unreliable Narrator', description: 'Narrator whose credibility is questionable, creating tension' },
    { id: 'second-person', name: 'Second Person', description: 'Addresses the audience as "you", immersing them directly' },
    { id: 'countdown', name: 'Countdown Narration', description: 'Counts down toward a critical moment or revelation' },
    { id: 'confessional', name: 'Confessional', description: 'Raw, diary-like admissions as if speaking privately' },
    { id: 'collected-documents', name: 'Collected Documents', description: 'Assembles evidence from multiple fictional sources' },
    { id: 'campfire', name: 'Campfire Storyteller', description: 'Oral tradition style, as if told around a fire' },
    { id: 'field-report', name: 'Field Report', description: 'Dispatches from the front lines of experience' },
    { id: 'myth-retelling', name: 'Myth Retelling', description: 'Frames modern topics through mythological patterns' },
    { id: 'debate', name: 'Internal Debate', description: 'Two opposing voices argue within the same narrator' },
    { id: 'time-traveler', name: 'Time Traveler Log', description: 'Observations from someone visiting from the future or past' }
];

const STRUCTURAL_TEMPLATES = [
    { id: 'climax-first', name: 'Climax First', description: 'Start with the peak moment, then explain' },
    { id: 'three-act', name: 'Three-Act Structure', description: 'Setup, confrontation, resolution' },
    { id: 'in-medias-res', name: 'In Medias Res', description: 'Begin in the middle of action' },
    { id: 'reverse', name: 'Reverse Chronology', description: 'Start at the end, work backward' },
    { id: 'parallel', name: 'Parallel Storylines', description: 'Two threads that eventually connect' },
    { id: 'problem-solution', name: 'Problem-Attempts-Solution', description: 'Show failed attempts before success' },
    { id: 'day-in-life', name: 'Day in the Life', description: 'Follow a timeline through one day' },
    { id: 'nested', name: 'Story Within Story', description: 'Frame narrative containing inner story' },
    { id: 'question-based', name: 'Question Progression', description: 'Each section answers a deeper question' },
    { id: 'circular', name: 'Circular Narrative', description: 'Ends where it began, transformed' },
    { id: 'russian-nesting', name: 'Russian Nesting', description: 'Each layer reveals a deeper, smaller story inside' },
    { id: 'mosaic', name: 'Mosaic / Collage', description: 'Fragments that form a complete picture when assembled' },
    { id: 'before-after', name: 'Before and After', description: 'Sharp contrast between two states divided by a pivot' },
    { id: 'spiral', name: 'Spiral Deepening', description: 'Returns to the same idea at increasing depth each time' },
    { id: 'telescope', name: 'Telescope', description: 'Zooms from cosmic scale down to intimate detail' },
    { id: 'trial', name: 'Trial Structure', description: 'Evidence, cross-examination, verdict format' },
    { id: 'journey-map', name: 'Journey Map', description: 'Follows a literal or metaphorical path with waypoints' },
    { id: 'cause-chain', name: 'Cause Chain', description: 'Each event directly triggers the next in a domino sequence' },
    { id: 'bookends', name: 'Bookends', description: 'Opens and closes with nearly identical scenes, changed by context' },
    { id: 'countdown-structure', name: 'Countdown Structure', description: 'Numbered segments counting toward a climactic zero' }
];

const EMOTIONAL_TONES = [
    { id: 'ironic', name: 'Light Irony', description: 'Self-aware with gentle humor' },
    { id: 'sincere', name: 'Sincere & Vulnerable', description: 'Open, honest, emotionally present' },
    { id: 'energetic', name: 'Energetic & Motivational', description: 'Uplifting and action-inspiring' },
    { id: 'contemplative', name: 'Contemplative', description: 'Thoughtful, philosophical depth' },
    { id: 'humorous', name: 'Humorous with Depth', description: 'Funny but meaningful underneath' },
    { id: 'provocative', name: 'Provocative', description: 'Challenges assumptions directly' },
    { id: 'warm', name: 'Warm & Friendly', description: 'Inviting, like talking to a friend' },
    { id: 'clinical', name: 'Clinical & Analytical', description: 'Detached, precise, objective' },
    { id: 'passionate', name: 'Passionate & Urgent', description: 'Intense conviction and energy' },
    { id: 'mysterious', name: 'Mysterious & Intriguing', description: 'Leaves questions, builds curiosity' },
    { id: 'darkly-comic', name: 'Darkly Comic', description: 'Finds dark humor in serious subjects' },
    { id: 'reverential', name: 'Reverential', description: 'Deep respect and awe for the subject' },
    { id: 'restless', name: 'Restless & Searching', description: 'Unsettled energy, actively seeking answers' },
    { id: 'nostalgic', name: 'Nostalgic', description: 'Bittersweet longing for what was or could have been' },
    { id: 'defiant', name: 'Defiant', description: 'Rebellious resistance against conventional thinking' },
    { id: 'intimate-whisper', name: 'Intimate Whisper', description: 'As if sharing secrets in a quiet room' },
    { id: 'epic-gravity', name: 'Epic Gravity', description: 'Treats the subject with grand, historical weight' },
    { id: 'playful-mischief', name: 'Playful Mischief', description: 'Gleeful subversion with a wink' },
    { id: 'raw-unfiltered', name: 'Raw & Unfiltered', description: 'Brutally honest, no polish or pleasantries' },
    { id: 'wonder', name: 'Childlike Wonder', description: 'Approaching everything with fresh amazement' }
];

const HOOK_TYPES = [
    { id: 'unexpected-fact', name: 'Unexpected Fact', description: 'Start with surprising information' },
    { id: 'rhetorical', name: 'Rhetorical Question', description: 'Open with a thought-provoking question' },
    { id: 'vivid-scene', name: 'Vivid Scene', description: 'Paint an immediate sensory picture' },
    { id: 'quote', name: 'Powerful Quote', description: 'Begin with words that resonate' },
    { id: 'confession', name: 'Confession/Revelation', description: 'Start with personal admission' },
    { id: 'challenge', name: 'Challenge Wisdom', description: 'Contradict what everyone believes' },
    { id: 'what-if', name: 'What If Scenario', description: 'Hypothetical that reframes everything' },
    { id: 'contradiction', name: 'Contradiction', description: 'Present a paradox immediately' },
    { id: 'bold-statement', name: 'Bold Statement', description: 'Make a claim that demands attention' },
    { id: 'sensory', name: 'Sensory Description', description: 'Immerse in physical experience first' },
    { id: 'micro-story', name: 'Micro Story', description: 'A complete tiny narrative in 2-3 sentences' },
    { id: 'future-flash', name: 'Future Flash', description: 'Jump to a future consequence, then rewind' },
    { id: 'number-anchor', name: 'Number Anchor', description: 'Lead with a specific, striking number or statistic' },
    { id: 'false-assumption', name: 'False Assumption', description: 'State what everyone assumes, then shatter it' },
    { id: 'direct-address', name: 'Direct Address', description: 'Speak directly to a specific type of person' },
    { id: 'sound-effect', name: 'Sound / Action', description: 'Open with an onomatopoeia or physical action' },
    { id: 'time-stamp', name: 'Time Stamp', description: 'Begin with a precise moment in time' },
    { id: 'confession-others', name: 'Others Confession', description: 'Start with what others secretly think but never say' },
    { id: 'impossible-choice', name: 'Impossible Choice', description: 'Present a dilemma with no easy answer' },
    { id: 'pattern-break', name: 'Pattern Break', description: 'Set up a rhythm then immediately disrupt it' }
];

const SPECIAL_CONSTRAINTS = [
    { id: 'extended-metaphor', name: 'Extended Metaphor', description: 'One metaphor woven throughout' },
    { id: 'mid-twist', name: 'Mid-Point Twist', description: 'Unexpected turn in the middle' },
    { id: 'personal-anecdote', name: 'Personal Anecdote', description: 'Include a specific personal story' },
    { id: 'opposite-direction', name: 'Argue from Opposite', description: 'Start from the opposing view' },
    { id: 'zoom-technique', name: 'Zoom Technique', description: 'Move from macro to micro or reverse' },
    { id: 'vulnerability', name: 'Moment of Doubt', description: 'Include authentic uncertainty' },
    { id: 'audience-question', name: 'Direct Question', description: 'Ask the reader something directly' },
    { id: 'contrasting-views', name: 'Contrasting Perspectives', description: 'Show multiple viewpoints' },
    { id: 'recurring-motif', name: 'Recurring Motif', description: 'A symbol or phrase that returns' },
    { id: 'tension-pacing', name: 'Build Tension', description: 'Deliberately control pacing for suspense' },
    { id: 'time-capsule', name: 'Time Capsule Perspective', description: 'Write as if preserving this for someone 100 years from now' },
    { id: 'rule-of-three-subversion', name: 'Rule of Three Subversion', description: 'Set up three examples, subvert the third' },
    { id: 'sensory-anchoring', name: 'Sensory Anchoring', description: 'Ground every section with a specific physical sensation' },
    { id: 'single-sentence-paragraph', name: 'Power Sentence', description: 'Include at least one standalone single-sentence paragraph for impact' },
    { id: 'unanswered-question', name: 'Unanswered Question', description: 'Leave one profound question deliberately unanswered' },
    { id: 'callback', name: 'Callback Loop', description: 'Reference the opening in the closing with new meaning' },
    { id: 'constraint-of-absence', name: 'Constraint of Absence', description: 'Never directly name the core subject, only describe around it' },
    { id: 'tempo-shift', name: 'Tempo Shift', description: 'Dramatically change pacing at least once mid-script' },
    { id: 'embedded-list', name: 'Embedded List', description: 'Weave a list naturally into narrative prose' },
    { id: 'emotional-pivot', name: 'Emotional Pivot', description: 'Shift emotional register sharply at a key moment' }
];

// ============================================
// 1.1 WRITER PERSONAS
// ============================================

const WRITER_PERSONAS = [
    { id: 'veteran-journalist', name: 'Veteran Journalist', systemDirective: 'You write like a seasoned investigative journalist. Your prose is lean, every sentence earns its place. You build credibility through specifics — names, dates, verified details. You distrust generalities and always ask "says who?"' },
    { id: 'poet-essayist', name: 'Poet Essayist', systemDirective: 'You write like a poet who wandered into nonfiction. Your sentences have rhythm and cadence. You reach for metaphor before explanation, and you believe the sound of language matters as much as its meaning. You linger on images.' },
    { id: 'standup-philosopher', name: 'Stand-Up Philosopher', systemDirective: 'You write like a comedian who reads too much philosophy. You find the absurd in the serious and the serious in the absurd. Your humor is a vehicle for genuine insight, never just decoration. You land punchlines that also land points.' },
    { id: 'war-correspondent', name: 'War Correspondent', systemDirective: 'You write with the urgency of someone reporting from the front lines. Short, punchy dispatches. You put the reader in the scene with sensory detail. Nothing is abstract — everything is ground-level, lived, witnessed.' },
    { id: 'museum-curator', name: 'Museum Curator', systemDirective: 'You write like someone who has spent decades with artifacts and their stories. You provide context in layers — historical, cultural, personal. You connect objects and ideas to their deeper significance. You reveal meaning through careful arrangement.' },
    { id: 'street-philosopher', name: 'Street Philosopher', systemDirective: 'You write like someone who learned wisdom from experience, not textbooks. Your language is direct, sometimes rough-edged. You use everyday analogies and speak uncomfortable truths. You have no patience for pretension.' },
    { id: 'nature-documentarian', name: 'Nature Documentarian', systemDirective: 'You write with the patient observation of someone who has spent years watching the natural world. You draw parallels between nature and human behavior. Your descriptions are vivid, precise, and carry quiet reverence.' },
    { id: 'noir-detective', name: 'Noir Detective', systemDirective: 'You write in the shadow-soaked style of classic noir. Short sentences. Cynical observations that cut deep. You see through surfaces to the uncomfortable machinery underneath. The world is complicated and you narrate it without flinching.' },
    { id: 'enthusiastic-teacher', name: 'Enthusiastic Teacher', systemDirective: 'You write like the teacher who made you love a subject. You build bridges between the unfamiliar and the familiar. You use "imagine this..." and "here is the thing..." You get genuinely excited and that excitement is contagious.' },
    { id: 'ancient-storyteller', name: 'Ancient Storyteller', systemDirective: 'You write as if you are passing down knowledge through oral tradition. Your prose has the weight and rhythm of stories told a thousand times. You use parables, proverbs, and the cadence of legend. Modern topics feel ancient and timeless.' },
    { id: 'gonzo-reporter', name: 'Gonzo Reporter', systemDirective: 'You write yourself into the story. Your observations are subjective, your reactions are part of the narrative. Rules of objectivity bore you. You are chaotic, vivid, and brutally honest about what you see and feel.' },
    { id: 'reluctant-expert', name: 'Reluctant Expert', systemDirective: 'You write like someone who knows more than they want to about a subject. Your expertise leaks through despite a casual, almost reluctant delivery. You undersell yourself while dropping insights that reveal deep knowledge.' }
];

// ============================================
// 1.2 PROMPT VARIATION ENGINE
// ============================================

const PROMPT_VARIANTS = {
    outlineOpeners: [
        'You are a professional script writer creating an outline for a compelling script.',
        'As an expert narrative architect, design the blueprint for a powerful script.',
        'You are a story strategist. Your task is to map out the skeleton of an unforgettable script.',
        'Think like a showrunner planning a pilot episode. Outline a script that hooks from the first line.',
        'You are a writing mentor helping a student plan their best work. Create a detailed script outline.'
    ],
    scriptInstructions: [
        'Write a complete script based on this outline.',
        'Transform this outline into a fully realized, flowing script.',
        'Bring this blueprint to life as a polished, complete script.',
        'Use this outline as your roadmap and write the definitive version of this script.',
        'Flesh out every section of this outline into vivid, compelling prose.'
    ],
    styleDirectives: [
        'Write in flowing, conversational paragraphs. Vary sentence length dramatically. Show, don\'t tell.',
        'Your prose should feel like a conversation — natural, surprising, and impossible to skim. Mix long flowing sentences with short punches.',
        'Write with the rhythm of spoken language. Let some sentences stretch. Let others stop dead. Make the reader feel the pacing in their body.',
        'Craft prose that reads aloud beautifully. Alternate between expansive descriptions and razor-sharp observations. Never lecture.',
        'Write like the best magazine longform — propulsive, detailed, human. Every paragraph should make the reader need the next one.'
    ],
    antiTemplateRules: [
        'Make it compelling, unique, and impossible to template.',
        'Avoid any structure that feels formulaic. If you catch yourself following a pattern, break it.',
        'This script must not read like any other script on this topic. Find the angle no one else found.',
        'Reject cliches, stock phrases, and predictable structures. Every choice should feel intentional and fresh.',
        'Write as if this is the only script on this topic that will ever matter. No filler, no autopilot.'
    ]
};

// ============================================
// 1.3 MICRO-INSTRUCTIONS
// ============================================

const MICRO_INSTRUCTIONS = [
    'Include one moment where the narrative zooms into an unexpected small detail.',
    'Use a callback — reference something from the first third in the final third.',
    'Include one sentence that is only three words long at a crucial moment.',
    'Use an analogy drawn from nature.',
    'Introduce a hypothetical person briefly to illustrate a point.',
    'Include a moment of deliberate silence or pause in the narrative.',
    'Use a question that you do NOT answer — let it hang.',
    'Describe a physical sensation to ground an abstract idea.',
    'Include one line that could work as a standalone quote.',
    'Use the word "but" to create a sharp reversal at a key moment.',
    'Embed a subtle contradiction that makes the reader think twice.',
    'Start one paragraph with a single concrete image before expanding.',
    'Include a specific number or measurement to anchor credibility.',
    'Use a comparison to something from everyday life that no one usually connects to this topic.',
    'Write one passage that accelerates — sentences getting shorter and faster.',
    'Include a moment where you acknowledge what you do NOT know.',
    'Use repetition of a key phrase for rhythmic emphasis.',
    'Describe something through the lens of time — how it looked 10 years ago vs. now.',
    'Include one moment of dark humor or irony.',
    'Create a moment where two seemingly unrelated ideas suddenly connect.',
    'Use a concrete before/after contrast to show change.',
    'Include a direct address to the reader that feels personal, not generic.',
    'Use synesthesia — describe one sense using the language of another.',
    'Include a brief, vivid character sketch in one or two sentences.',
    'Plant a detail early that pays off later in an unexpected way.',
    'Use the structure of a list disguised as flowing prose.',
    'Include a moment where the narrative contradicts itself and then resolves the contradiction.',
    'Reference a specific place — real or imagined — with enough detail to see it.',
    'Use an abrupt tonal shift to create emotional whiplash.',
    'Include one sentence that breaks the fourth wall without being jarring.',
    'Use an extended comparison that runs for at least three sentences.',
    'Include a moment of genuine tenderness in an otherwise tough narrative.',
    'End one paragraph on a cliffhanger that pulls into the next.'
];


// ============================================
// 2. STATE MANAGEMENT
// ============================================

const state = {
    currentTemplate: 'default',
    promptTemplate: '',
    scriptLength: 5000,
    parameters: {
        narrativeStyle: null,
        structure: null,
        tone: null,
        hookType: null,
        constraint: null,
        persona: null
    },
    storytellingPrompt: '',
    hookPrompt: '',
    settings: {
        apiKey: '',
        outlineModel: 'anthropic/claude-sonnet-4',
        scriptModel: 'anthropic/claude-sonnet-4',
        hookModel: 'anthropic/claude-sonnet-4',
        outlineTemp: 0.9,
        scriptTemp: 0.7,
        hookTemp: 0.85,
        frequencyPenalty: 0.3,
        presencePenalty: 0.2
    },
    generated: {
        outline: '',
        script: '',
        hook: '',
        final: ''
    },
    generationHistory: [],
    isGenerating: false,
    currentTab: 'final',
    theme: 'dark'
};

// ============================================
// 2.1 TEMPLATE MANAGEMENT
// ============================================

function getTemplates() {
    const saved = localStorage.getItem('scriptBuilder_templates');
    if (saved) {
        return JSON.parse(saved);
    }
    return { default: { name: 'Default Template' } };
}

function saveTemplates(templates) {
    localStorage.setItem('scriptBuilder_templates', JSON.stringify(templates));
}

function getTemplateData(templateId) {
    const key = `scriptBuilder_template_${templateId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
}

function saveTemplateData(templateId) {
    const key = `scriptBuilder_template_${templateId}`;
    const data = {
        promptTemplate: state.promptTemplate,
        scriptLength: state.scriptLength,
        parameters: { ...state.parameters },
        storytellingPrompt: state.storytellingPrompt,
        hookPrompt: state.hookPrompt
    };
    localStorage.setItem(key, JSON.stringify(data));
}

function loadTemplateData(templateId) {
    const data = getTemplateData(templateId);
    if (data) {
        state.promptTemplate = data.promptTemplate || '';
        state.scriptLength = data.scriptLength || 5000;
        state.parameters = { ...state.parameters, ...data.parameters };
        state.storytellingPrompt = data.storytellingPrompt || '';
        state.hookPrompt = data.hookPrompt || '';
    }

    // Update UI
    const promptEl = document.getElementById('promptTemplate');
    const lengthEl = document.getElementById('scriptLengthInput');
    const storytellingEl = document.getElementById('storytellingPromptInput');
    const hookEl = document.getElementById('hookPromptInput');

    if (promptEl) promptEl.value = state.promptTemplate;
    if (lengthEl) lengthEl.value = state.scriptLength;
    if (storytellingEl) storytellingEl.value = state.storytellingPrompt;
    if (hookEl) hookEl.value = state.hookPrompt;

    // Update select elements
    const selects = {
        narrativeStyleSelect: state.parameters.narrativeStyle,
        structureSelect: state.parameters.structure,
        toneSelect: state.parameters.tone,
        hookTypeSelect: state.parameters.hookType,
        constraintSelect: state.parameters.constraint,
        personaSelect: state.parameters.persona
    };

    for (const [id, value] of Object.entries(selects)) {
        const el = document.getElementById(id);
        if (el && value) el.value = value;
    }
}

function populateTemplateSelect() {
    const select = document.getElementById('templateSelect');
    const templates = getTemplates();

    select.innerHTML = Object.entries(templates)
        .map(([id, data]) => `<option value="${id}">${data.name}</option>`)
        .join('');

    select.value = state.currentTemplate;
}

function switchTemplate(templateId) {
    // Save current template data first
    saveTemplateData(state.currentTemplate);

    // Switch to new template
    state.currentTemplate = templateId;
    localStorage.setItem('scriptBuilder_currentTemplate', templateId);

    // Load new template data
    loadTemplateData(templateId);
}

async function createNewTemplate() {
    const name = prompt('Enter template name:');
    if (!name || !name.trim()) return;

    const templates = getTemplates();
    const id = 'template_' + Date.now();
    templates[id] = { name: name.trim() };
    saveTemplates(templates);

    // Save current template data
    saveTemplateData(state.currentTemplate);

    // Switch to new template
    state.currentTemplate = id;
    localStorage.setItem('scriptBuilder_currentTemplate', id);

    // Reset to defaults for new template
    state.promptTemplate = '';
    state.scriptLength = 5000;
    state.storytellingPrompt = '';
    state.hookPrompt = '';
    randomizeParameters();

    // Load default prompts from files
    try {
        const storytellingResp = await fetch('STORYTELLING.txt');
        if (storytellingResp.ok) {
            state.storytellingPrompt = await storytellingResp.text();
        }
    } catch (e) {}
    try {
        const hookResp = await fetch('HOOK.txt');
        if (hookResp.ok) {
            state.hookPrompt = await hookResp.text();
        }
    } catch (e) {}

    document.getElementById('promptTemplate').value = '';
    document.getElementById('scriptLengthInput').value = 5000;
    document.getElementById('storytellingPromptInput').value = state.storytellingPrompt;
    document.getElementById('hookPromptInput').value = state.hookPrompt;

    // Save new template data
    saveTemplateData(id);

    populateTemplateSelect();
}

function renameCurrentTemplate() {
    if (state.currentTemplate === 'default') {
        alert('Cannot rename the default template.');
        return;
    }

    const templates = getTemplates();
    const currentName = templates[state.currentTemplate]?.name || '';
    const newName = prompt('Enter new template name:', currentName);

    if (!newName || !newName.trim()) return;

    templates[state.currentTemplate].name = newName.trim();
    saveTemplates(templates);
    populateTemplateSelect();
}

function deleteCurrentTemplate() {
    if (state.currentTemplate === 'default') {
        alert('Cannot delete the default template.');
        return;
    }

    const templates = getTemplates();
    const templateName = templates[state.currentTemplate]?.name || state.currentTemplate;

    if (!confirm(`Are you sure you want to delete "${templateName}"?`)) return;

    // Remove template data
    localStorage.removeItem(`scriptBuilder_template_${state.currentTemplate}`);

    // Remove from templates list
    delete templates[state.currentTemplate];
    saveTemplates(templates);

    // Switch to default
    state.currentTemplate = 'default';
    localStorage.setItem('scriptBuilder_currentTemplate', 'default');
    loadTemplateData('default');

    populateTemplateSelect();
}

// ============================================
// 2.2 THEME MANAGEMENT
// ============================================

function loadTheme() {
    const savedTheme = localStorage.getItem('scriptBuilder_theme');
    if (savedTheme) {
        state.theme = savedTheme;
    }
    applyTheme();
}

function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('scriptBuilder_theme', state.theme);
    applyTheme();
}

function applyTheme() {
    const body = document.body;
    const themeIconDark = document.getElementById('themeIconDark');
    const themeIconLight = document.getElementById('themeIconLight');

    if (state.theme === 'light') {
        body.classList.remove('bg-gray-950', 'text-gray-100');
        body.classList.add('bg-gray-100', 'text-gray-900', 'light-theme');
        themeIconDark.classList.add('hidden');
        themeIconLight.classList.remove('hidden');
    } else {
        body.classList.remove('bg-gray-100', 'text-gray-900', 'light-theme');
        body.classList.add('bg-gray-950', 'text-gray-100');
        themeIconDark.classList.remove('hidden');
        themeIconLight.classList.add('hidden');
    }
}

// ============================================
// 2.3 COLLAPSIBLE SECTIONS
// ============================================

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const icon = document.getElementById(sectionId + 'Icon');

    if (section.classList.contains('hidden')) {
        section.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        section.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}

// ============================================
// 2.4 DOWNLOAD FUNCTIONALITY
// ============================================

function downloadCurrentContent() {
    let text = '';
    let filename = 'script';

    switch (state.currentTab) {
        case 'outline':
            text = state.generated.outline;
            filename = 'outline';
            break;
        case 'script':
            text = state.generated.script;
            filename = 'script';
            break;
        case 'hook':
            text = state.generated.hook;
            filename = 'hook';
            break;
        case 'final':
            text = state.generated.final;
            filename = 'final-script';
            break;
    }

    if (!text) {
        alert('No content to download.');
        return;
    }

    // Create blob and download
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show feedback
    const btn = document.getElementById('downloadBtn');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Downloaded!';
    btn.classList.add('bg-green-600');
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('bg-green-600');
    }, 2000);
}

// ============================================
// 3. INITIALIZATION
// ============================================

async function init() {
    // Load theme
    loadTheme();

    // Load current template
    const savedTemplate = localStorage.getItem('scriptBuilder_currentTemplate');
    if (savedTemplate) {
        state.currentTemplate = savedTemplate;
    }

    // Load settings from localStorage
    loadSettings();

    // Populate select dropdowns
    populateSelectOptions();

    // Populate template selector
    populateTemplateSelect();

    // Load template data first (or randomize if no data)
    const templateData = getTemplateData(state.currentTemplate);
    if (templateData) {
        loadTemplateData(state.currentTemplate);
    } else {
        // Randomize initial parameters for new templates
        randomizeParameters();
    }

    // Load prompts from files as fallback (only if template has no prompts)
    await loadPromptFiles();

    // Bind event listeners
    bindEventListeners();
}

function loadSettings() {
    const saved = localStorage.getItem('scriptBuilder_settings');
    let parsed = null;
    if (saved) {
        parsed = JSON.parse(saved);
        state.settings = { ...state.settings, ...parsed };
    }

    // Valid model options
    const validModels = [
        'anthropic/claude-sonnet-4.5',
        'anthropic/claude-opus-4.5',
        'anthropic/claude-opus-4.1',
        'google/gemini-3-pro-preview',
        'google/gemini-2.5-pro-preview',
        'google/gemini-2.5-flash-preview'
    ];

    // Reset to default if saved model is not in valid list
    if (!validModels.includes(state.settings.outlineModel)) {
        state.settings.outlineModel = 'anthropic/claude-sonnet-4.5';
    }
    if (!validModels.includes(state.settings.scriptModel)) {
        state.settings.scriptModel = 'anthropic/claude-opus-4.5';
    }
    if (!validModels.includes(state.settings.hookModel)) {
        state.settings.hookModel = 'anthropic/claude-sonnet-4.5';
    }

    // Migrate old single temperature to per-stage if needed
    if (parsed && parsed.temperature !== undefined && parsed.outlineTemp === undefined) {
        state.settings.outlineTemp = 0.9;
        state.settings.scriptTemp = 0.7;
        state.settings.hookTemp = 0.85;
        state.settings.frequencyPenalty = 0.3;
        state.settings.presencePenalty = 0.2;
    }

    // Apply to UI
    document.getElementById('apiKeyInput').value = state.settings.apiKey;
    document.getElementById('outlineModelSelect').value = state.settings.outlineModel;
    document.getElementById('scriptModelSelect').value = state.settings.scriptModel;
    document.getElementById('hookModelSelect').value = state.settings.hookModel;
    document.getElementById('outlineTempSlider').value = state.settings.outlineTemp;
    document.getElementById('outlineTempValue').textContent = state.settings.outlineTemp;
    document.getElementById('scriptTempSlider').value = state.settings.scriptTemp;
    document.getElementById('scriptTempValue').textContent = state.settings.scriptTemp;
    document.getElementById('hookTempSlider').value = state.settings.hookTemp;
    document.getElementById('hookTempValue').textContent = state.settings.hookTemp;
    document.getElementById('frequencyPenaltySlider').value = state.settings.frequencyPenalty;
    document.getElementById('frequencyPenaltyValue').textContent = state.settings.frequencyPenalty;
    document.getElementById('presencePenaltySlider').value = state.settings.presencePenalty;
    document.getElementById('presencePenaltyValue').textContent = state.settings.presencePenalty;

    // Load saved parameters
    const savedParams = localStorage.getItem('scriptBuilder_parameters');
    if (savedParams) {
        const params = JSON.parse(savedParams);
        state.parameters = { ...state.parameters, ...params };
    }

    // Load saved prompt template
    const savedPrompt = localStorage.getItem('scriptBuilder_promptTemplate');
    if (savedPrompt) {
        document.getElementById('promptTemplate').value = savedPrompt;
        state.promptTemplate = savedPrompt;
    }

    // Load saved script length
    const savedLength = localStorage.getItem('scriptBuilder_scriptLength');
    if (savedLength) {
        state.scriptLength = parseInt(savedLength);
        document.getElementById('scriptLengthInput').value = state.scriptLength;
    }
}

async function loadPromptFiles() {
    // Load default prompts from files if template prompts are empty
    try {
        const storytellingResp = await fetch('STORYTELLING.txt');
        if (storytellingResp.ok && !state.storytellingPrompt) {
            state.storytellingPrompt = await storytellingResp.text();
        }
    } catch (e) {
        console.log('Could not load STORYTELLING.txt');
    }

    try {
        const hookResp = await fetch('HOOK.txt');
        if (hookResp.ok && !state.hookPrompt) {
            state.hookPrompt = await hookResp.text();
        }
    } catch (e) {
        console.log('Could not load HOOK.txt');
    }

    // Update UI textareas
    document.getElementById('storytellingPromptInput').value = state.storytellingPrompt;
    document.getElementById('hookPromptInput').value = state.hookPrompt;
}

function populateSelectOptions() {
    const selects = [
        { id: 'narrativeStyleSelect', options: NARRATIVE_STYLES, paramKey: 'narrativeStyle' },
        { id: 'structureSelect', options: STRUCTURAL_TEMPLATES, paramKey: 'structure' },
        { id: 'toneSelect', options: EMOTIONAL_TONES, paramKey: 'tone' },
        { id: 'hookTypeSelect', options: HOOK_TYPES, paramKey: 'hookType' },
        { id: 'constraintSelect', options: SPECIAL_CONSTRAINTS, paramKey: 'constraint' },
        { id: 'personaSelect', options: WRITER_PERSONAS, paramKey: 'persona' }
    ];

    selects.forEach(({ id, options, paramKey }) => {
        const select = document.getElementById(id);
        select.innerHTML = options.map(opt =>
            `<option value="${opt.id}" title="${opt.description}">${opt.name}</option>`
        ).join('');

        // Set value if we have a saved parameter
        if (state.parameters[paramKey]) {
            select.value = state.parameters[paramKey];
        }

        // Listen for changes
        select.addEventListener('change', () => {
            state.parameters[paramKey] = select.value;
            saveParameters();
            saveTemplateData(state.currentTemplate);
        });
    });
}

function randomizeParameters() {
    const randomFrom = arr => arr[Math.floor(Math.random() * arr.length)];

    state.parameters = {
        narrativeStyle: randomFrom(NARRATIVE_STYLES).id,
        structure: randomFrom(STRUCTURAL_TEMPLATES).id,
        tone: randomFrom(EMOTIONAL_TONES).id,
        hookType: randomFrom(HOOK_TYPES).id,
        constraint: randomFrom(SPECIAL_CONSTRAINTS).id,
        persona: randomFrom(WRITER_PERSONAS).id
    };

    // Update select elements
    document.getElementById('narrativeStyleSelect').value = state.parameters.narrativeStyle;
    document.getElementById('structureSelect').value = state.parameters.structure;
    document.getElementById('toneSelect').value = state.parameters.tone;
    document.getElementById('hookTypeSelect').value = state.parameters.hookType;
    document.getElementById('constraintSelect').value = state.parameters.constraint;
    document.getElementById('personaSelect').value = state.parameters.persona;

    // Randomize temperature and penalty values
    const randRange = (min, max, step) => {
        const steps = Math.round((max - min) / step);
        return parseFloat((min + Math.floor(Math.random() * (steps + 1)) * step).toFixed(2));
    };

    state.settings.outlineTemp = randRange(0.6, 1.2, 0.05);
    state.settings.scriptTemp = randRange(0.5, 1.0, 0.05);
    state.settings.hookTemp = randRange(0.7, 1.1, 0.05);
    state.settings.frequencyPenalty = randRange(0, 0.8, 0.1);
    state.settings.presencePenalty = randRange(0, 0.6, 0.1);

    document.getElementById('outlineTempSlider').value = state.settings.outlineTemp;
    document.getElementById('outlineTempValue').textContent = state.settings.outlineTemp;
    document.getElementById('scriptTempSlider').value = state.settings.scriptTemp;
    document.getElementById('scriptTempValue').textContent = state.settings.scriptTemp;
    document.getElementById('hookTempSlider').value = state.settings.hookTemp;
    document.getElementById('hookTempValue').textContent = state.settings.hookTemp;
    document.getElementById('frequencyPenaltySlider').value = state.settings.frequencyPenalty;
    document.getElementById('frequencyPenaltyValue').textContent = state.settings.frequencyPenalty;
    document.getElementById('presencePenaltySlider').value = state.settings.presencePenalty;
    document.getElementById('presencePenaltyValue').textContent = state.settings.presencePenalty;

    localStorage.setItem('scriptBuilder_settings', JSON.stringify(state.settings));
    saveParameters();
}

function saveParameters() {
    localStorage.setItem('scriptBuilder_parameters', JSON.stringify(state.parameters));
}

function saveSettings() {
    state.settings.apiKey = document.getElementById('apiKeyInput').value;
    state.settings.outlineModel = document.getElementById('outlineModelSelect').value;
    state.settings.scriptModel = document.getElementById('scriptModelSelect').value;
    state.settings.hookModel = document.getElementById('hookModelSelect').value;
    state.settings.outlineTemp = parseFloat(document.getElementById('outlineTempSlider').value);
    state.settings.scriptTemp = parseFloat(document.getElementById('scriptTempSlider').value);
    state.settings.hookTemp = parseFloat(document.getElementById('hookTempSlider').value);
    state.settings.frequencyPenalty = parseFloat(document.getElementById('frequencyPenaltySlider').value);
    state.settings.presencePenalty = parseFloat(document.getElementById('presencePenaltySlider').value);

    localStorage.setItem('scriptBuilder_settings', JSON.stringify(state.settings));
}

function bindEventListeners() {
    // Niche prompt - auto-save to current template
    document.getElementById('promptTemplate').addEventListener('input', (e) => {
        state.promptTemplate = e.target.value;
        saveTemplateData(state.currentTemplate);
    });

    // Script length input - auto-save to current template
    document.getElementById('scriptLengthInput').addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 500) {
            state.scriptLength = value;
            saveTemplateData(state.currentTemplate);
        }
    });

    // Storytelling prompt - auto-save to current template
    document.getElementById('storytellingPromptInput').addEventListener('input', (e) => {
        state.storytellingPrompt = e.target.value;
        saveTemplateData(state.currentTemplate);
    });

    // Hook prompt - auto-save to current template
    document.getElementById('hookPromptInput').addEventListener('input', (e) => {
        state.hookPrompt = e.target.value;
        saveTemplateData(state.currentTemplate);
    });

    // Randomize button
    document.getElementById('randomizeParamsBtn').addEventListener('click', () => {
        randomizeParameters();
        saveTemplateData(state.currentTemplate);
    });

    // Template management
    document.getElementById('templateSelect').addEventListener('change', (e) => {
        switchTemplate(e.target.value);
    });
    document.getElementById('newTemplateBtn').addEventListener('click', createNewTemplate);
    document.getElementById('renameTemplateBtn').addEventListener('click', renameCurrentTemplate);
    document.getElementById('deleteTemplateBtn').addEventListener('click', deleteCurrentTemplate);

    // Theme toggle
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

    // Generate button
    document.getElementById('generateBtn').addEventListener('click', generateScript);
    document.getElementById('regenerateBtn').addEventListener('click', generateScript);

    // Settings modal
    document.getElementById('settingsBtn').addEventListener('click', () => {
        document.getElementById('settingsModal').classList.remove('hidden');
    });
    document.getElementById('closeSettings').addEventListener('click', () => {
        document.getElementById('settingsModal').classList.add('hidden');
    });
    document.getElementById('settingsModal').addEventListener('click', (e) => {
        if (e.target.id === 'settingsModal') {
            document.getElementById('settingsModal').classList.add('hidden');
        }
    });
    document.getElementById('saveSettings').addEventListener('click', () => {
        saveSettings();
        document.getElementById('settingsModal').classList.add('hidden');
    });

    // Temperature sliders - auto-save since they're in the sidebar now
    document.getElementById('outlineTempSlider').addEventListener('input', (e) => {
        document.getElementById('outlineTempValue').textContent = e.target.value;
        state.settings.outlineTemp = parseFloat(e.target.value);
        localStorage.setItem('scriptBuilder_settings', JSON.stringify(state.settings));
    });
    document.getElementById('scriptTempSlider').addEventListener('input', (e) => {
        document.getElementById('scriptTempValue').textContent = e.target.value;
        state.settings.scriptTemp = parseFloat(e.target.value);
        localStorage.setItem('scriptBuilder_settings', JSON.stringify(state.settings));
    });
    document.getElementById('hookTempSlider').addEventListener('input', (e) => {
        document.getElementById('hookTempValue').textContent = e.target.value;
        state.settings.hookTemp = parseFloat(e.target.value);
        localStorage.setItem('scriptBuilder_settings', JSON.stringify(state.settings));
    });
    document.getElementById('frequencyPenaltySlider').addEventListener('input', (e) => {
        document.getElementById('frequencyPenaltyValue').textContent = e.target.value;
        state.settings.frequencyPenalty = parseFloat(e.target.value);
        localStorage.setItem('scriptBuilder_settings', JSON.stringify(state.settings));
    });
    document.getElementById('presencePenaltySlider').addEventListener('input', (e) => {
        document.getElementById('presencePenaltyValue').textContent = e.target.value;
        state.settings.presencePenalty = parseFloat(e.target.value);
        localStorage.setItem('scriptBuilder_settings', JSON.stringify(state.settings));
    });

    // Tab switching
    document.getElementById('tabOutline').addEventListener('click', () => switchTab('outline'));
    document.getElementById('tabScript').addEventListener('click', () => switchTab('script'));
    document.getElementById('tabHook').addEventListener('click', () => switchTab('hook'));
    document.getElementById('tabFinal').addEventListener('click', () => switchTab('final'));

    // Copy button
    document.getElementById('copyBtn').addEventListener('click', copyCurrentContent);

    // Download button
    document.getElementById('downloadBtn').addEventListener('click', downloadCurrentContent);
}


// ============================================
// 4. TAB MANAGEMENT
// ============================================

function switchTab(tab) {
    state.currentTab = tab;

    // Update tab buttons
    const tabs = ['Outline', 'Script', 'Hook', 'Final'];
    tabs.forEach(t => {
        const btn = document.getElementById(`tab${t}`);
        const isActive = t.toLowerCase() === tab;
        btn.classList.toggle('text-indigo-400', isActive);
        btn.classList.toggle('border-indigo-400', isActive);
        btn.classList.toggle('text-gray-400', !isActive);
        btn.classList.toggle('border-transparent', !isActive);
    });

    // Show/hide content
    document.getElementById('outlineContent').classList.toggle('hidden', tab !== 'outline');
    document.getElementById('scriptContent').classList.toggle('hidden', tab !== 'script');
    document.getElementById('hookContent').classList.toggle('hidden', tab !== 'hook');
    document.getElementById('finalContent').classList.toggle('hidden', tab !== 'final');

    // Update word count
    updateWordCount();
}

function updateWordCount() {
    let text = '';
    switch (state.currentTab) {
        case 'outline': text = state.generated.outline; break;
        case 'script': text = state.generated.script; break;
        case 'hook': text = state.generated.hook; break;
        case 'final': text = state.generated.final; break;
    }
    const wordCount = text.split(/\s+/).filter(w => w).length;
    document.getElementById('wordCount').textContent = `${wordCount} words`;
}

function copyCurrentContent() {
    let text = '';
    switch (state.currentTab) {
        case 'outline': text = state.generated.outline; break;
        case 'script': text = state.generated.script; break;
        case 'hook': text = state.generated.hook; break;
        case 'final': text = state.generated.final; break;
    }

    navigator.clipboard.writeText(text);
    const btn = document.getElementById('copyBtn');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied!';
    btn.classList.add('bg-green-600');
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('bg-green-600');
    }, 2000);
}

// ============================================
// 5. PROGRESS VISUALIZATION
// ============================================

function showProgress(show) {
    document.getElementById('progressSection').classList.toggle('hidden', !show);
}

function updateProgress(step, status) {
    const progressBar = document.getElementById('progressBar');
    const statusText = document.getElementById('progressStatus');

    // Update status text
    statusText.textContent = status;

    // Update progress bar
    const progress = (step / 3) * 100;
    progressBar.style.width = `${progress}%`;

    // Update step circles
    for (let i = 1; i <= 3; i++) {
        const circle = document.getElementById(`step${i}Circle`);
        const icon = document.getElementById(`step${i}Icon`);
        const line = document.getElementById(`step${i}Line`);

        if (i < step) {
            // Completed
            circle.classList.remove('bg-gray-700', 'bg-blue-600');
            circle.classList.add('bg-green-600');
            icon.innerHTML = '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
            if (line) {
                line.classList.remove('bg-gray-700');
                line.classList.add('bg-green-600');
            }
        } else if (i === step) {
            // Active
            circle.classList.remove('bg-gray-700', 'bg-green-600');
            circle.classList.add('bg-blue-600');
            icon.innerHTML = '<div class="loading-spinner-small"></div>';
        } else {
            // Pending
            circle.classList.remove('bg-blue-600', 'bg-green-600');
            circle.classList.add('bg-gray-700');
            icon.innerHTML = i;
            icon.className = 'text-gray-400';
        }
    }
}

function resetProgress() {
    for (let i = 1; i <= 3; i++) {
        const circle = document.getElementById(`step${i}Circle`);
        const icon = document.getElementById(`step${i}Icon`);
        const line = document.getElementById(`step${i}Line`);

        circle.classList.remove('bg-blue-600', 'bg-green-600');
        circle.classList.add('bg-gray-700');
        icon.innerHTML = i;
        icon.className = 'text-gray-400';
        if (line) {
            line.classList.remove('bg-green-600');
            line.classList.add('bg-gray-700');
        }
    }
    document.getElementById('progressBar').style.width = '0%';
}

function markAllComplete() {
    for (let i = 1; i <= 3; i++) {
        const circle = document.getElementById(`step${i}Circle`);
        const icon = document.getElementById(`step${i}Icon`);
        const line = document.getElementById(`step${i}Line`);

        circle.classList.remove('bg-gray-700', 'bg-blue-600');
        circle.classList.add('bg-green-600');
        icon.innerHTML = '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
        if (line) {
            line.classList.remove('bg-gray-700');
            line.classList.add('bg-green-600');
        }
    }
    document.getElementById('progressBar').style.width = '100%';
}

// ============================================
// 6. API INTEGRATION
// ============================================

async function callOpenRouter(messages, model, options = {}) {
    if (!state.settings.apiKey) {
        throw new Error('API key not configured. Click the settings icon to add your OpenRouter API key.');
    }

    // Apply temperature jitter (±0.05)
    const baseTemp = options.temperature || 0.8;
    const jitter = (Math.random() - 0.5) * 0.1;
    const temperature = Math.max(0, Math.min(2, baseTemp + jitter));

    const body = {
        model: model,
        messages: messages,
        temperature: parseFloat(temperature.toFixed(3)),
        max_tokens: options.max_tokens || 4000,
        frequency_penalty: state.settings.frequencyPenalty,
        presence_penalty: state.settings.presencePenalty
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.settings.apiKey}`,
            'HTTP-Referer': window.location.href,
            'X-Title': 'Script Builder'
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// ============================================
// 7. PROMPT BUILDING
// ============================================

function getParameterDetails() {
    return {
        narrativeStyle: NARRATIVE_STYLES.find(n => n.id === state.parameters.narrativeStyle),
        structure: STRUCTURAL_TEMPLATES.find(s => s.id === state.parameters.structure),
        tone: EMOTIONAL_TONES.find(t => t.id === state.parameters.tone),
        hookType: HOOK_TYPES.find(h => h.id === state.parameters.hookType),
        constraint: SPECIAL_CONSTRAINTS.find(c => c.id === state.parameters.constraint),
        persona: WRITER_PERSONAS.find(p => p.id === state.parameters.persona)
    };
}

// Helper: pick random item from array
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Helper: pick N unique random items from array
function pickRandomN(arr, n) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
}

// Helper: get anti-repetition context for same-topic generations
function getAntiRepetitionContext() {
    if (!state.generationHistory.length) return '';

    const topicSnippet = state.promptTemplate.toLowerCase().trim().slice(0, 80);
    const relevant = state.generationHistory.filter(h =>
        h.topic.toLowerCase().includes(topicSnippet.slice(0, 30)) ||
        topicSnippet.includes(h.topic.toLowerCase().slice(0, 30))
    ).slice(-3);

    if (!relevant.length) return '';

    let context = '\n\nAVOID THESE PREVIOUS APPROACHES (you have already covered these angles):\n';
    relevant.forEach((h, i) => {
        context += `\nPrevious Generation ${i + 1}:\n`;
        context += `- Parameters: ${h.paramsUsed}\n`;
        if (h.fingerprint) {
            context += `- Approach: ${h.fingerprint}\n`;
        }
    });
    context += '\nFind a COMPLETELY DIFFERENT angle, structure, and set of examples. Do not repeat these approaches.\n';
    return context;
}

function buildOutlineMessages() {
    const params = getParameterDetails();
    const storytellingContext = state.storytellingPrompt ?
        `\n\nUSE THESE STORYTELLING PRINCIPLES AS YOUR GUIDE:\n${state.storytellingPrompt}\n\n` : '';
    const antiRepetition = getAntiRepetitionContext();

    // Persona system directive
    const personaDirective = params.persona ?
        `${params.persona.systemDirective}\n\n` : '';

    // Pick random prompt variants
    const opener = pickRandom(PROMPT_VARIANTS.outlineOpeners);
    const antiTemplate = pickRandom(PROMPT_VARIANTS.antiTemplateRules);

    // Pick a random structural template (4 arrangements)
    const structureVariant = Math.floor(Math.random() * 4);

    // Build system message
    const systemContent = `${personaDirective}${opener}${storytellingContext}`;

    // Build user message with structural variation
    let userContent;
    if (structureVariant === 0) {
        // Template A: Parameters first, then topic
        userContent = `WRITING PARAMETERS TO FOLLOW:
- Narrative Style: ${params.narrativeStyle?.name} - ${params.narrativeStyle?.description}
- Structure: ${params.structure?.name} - ${params.structure?.description}
- Emotional Tone: ${params.tone?.name} - ${params.tone?.description}
- Special Constraint: ${params.constraint?.name} - ${params.constraint?.description}

NICHE/TOPIC:
${state.promptTemplate}

TARGET LENGTH: Approximately ${state.scriptLength} characters for the final script.
${antiRepetition}
Create a detailed outline (master plan) for this script. Include:
1. A clear title concept
2. The main thesis/angle/unique perspective
3. Block-by-block breakdown with main points, key insights, and narrative connections
4. The emotional arc and pacing notes
5. Overall tone of the narration

DO NOT write the full script yet. This is just the outline/blueprint.
${antiTemplate}`;
    } else if (structureVariant === 1) {
        // Template B: Topic first, parameters woven in
        userContent = `NICHE/TOPIC:
${state.promptTemplate}

I need an outline for a script about this topic (approximately ${state.scriptLength} characters final).

The script should use ${params.narrativeStyle?.name} (${params.narrativeStyle?.description}) as its narrative approach, following a ${params.structure?.name} structure (${params.structure?.description}). The tone should be ${params.tone?.name} (${params.tone?.description}), and it must incorporate this constraint: ${params.constraint?.name} - ${params.constraint?.description}.
${antiRepetition}
Create a detailed outline including: title concept, main thesis, block-by-block breakdown with insights and connections, emotional arc notes, and overall tone direction.

This is just the blueprint — do not write the full script.
${antiTemplate}`;
    } else if (structureVariant === 2) {
        // Template C: Open with a challenge/question
        userContent = `Here is a challenge: take the topic below and find the most unexpected, compelling angle to build a script around it.

TOPIC: ${state.promptTemplate}

Your constraints are:
- Narrative Style: ${params.narrativeStyle?.name} — ${params.narrativeStyle?.description}
- Structure: ${params.structure?.name} — ${params.structure?.description}
- Tone: ${params.tone?.name} — ${params.tone?.description}
- Special Constraint: ${params.constraint?.name} — ${params.constraint?.description}
- Target length: ~${state.scriptLength} characters
${antiRepetition}
What outline would make a reader unable to look away? Plan it now — title, thesis, block-by-block breakdown, emotional arc, and tone notes.

Do NOT write the script. Only the outline.
${antiTemplate}`;
    } else {
        // Template D: Lead with the constraint
        userContent = `CONSTRAINT TO BUILD AROUND: ${params.constraint?.name} — ${params.constraint?.description}

Using this as your creative anchor, outline a script about:
${state.promptTemplate}

ADDITIONAL PARAMETERS:
- Tell it as: ${params.narrativeStyle?.name} (${params.narrativeStyle?.description})
- Structure it as: ${params.structure?.name} (${params.structure?.description})
- Emotional register: ${params.tone?.name} (${params.tone?.description})
- Target: ~${state.scriptLength} characters
${antiRepetition}
Create the outline: title, unique angle, block-by-block plan with key insights, emotional arc, tone notes.

Blueprint only — no full script.
${antiTemplate}`;
    }

    return [
        { role: 'system', content: systemContent },
        { role: 'user', content: userContent }
    ];
}

function buildScriptMessages(outline) {
    const params = getParameterDetails();
    const storytellingContext = state.storytellingPrompt ?
        `\n\nSTORYTELLING PRINCIPLES TO APPLY:\n${state.storytellingPrompt}\n\n` : '';

    // Persona system directive
    const personaDirective = params.persona ?
        `${params.persona.systemDirective}\n\n` : '';

    // Pick random prompt variants
    const instruction = pickRandom(PROMPT_VARIANTS.scriptInstructions);
    const styleDirective = pickRandom(PROMPT_VARIANTS.styleDirectives);
    const antiTemplate = pickRandom(PROMPT_VARIANTS.antiTemplateRules);

    // Pick 3 random micro-instructions
    const microInstructions = pickRandomN(MICRO_INSTRUCTIONS, 3);

    // Pick a random structural template
    const structureVariant = Math.floor(Math.random() * 4);

    // Build system message
    const systemContent = `${personaDirective}You are a professional script writer. ${instruction}${storytellingContext}`;

    let userContent;
    if (structureVariant === 0) {
        userContent = `OUTLINE TO FOLLOW:
${outline}

NICHE/TOPIC:
${state.promptTemplate}

TARGET LENGTH: Approximately ${state.scriptLength} characters.

WRITING PARAMETERS:
- Narrative Style: ${params.narrativeStyle?.name} - ${params.narrativeStyle?.description}
- Structure: ${params.structure?.name} - ${params.structure?.description}
- Emotional Tone: ${params.tone?.name} - ${params.tone?.description}
- Special Constraint: ${params.constraint?.name} - ${params.constraint?.description}

CRITICAL RULES:
- NO bullet points, numbered lists, or subheadings in the final script
- ${styleDirective}
- Use specific, concrete details and examples
- DO NOT write a hook/opening - start directly with the main content after the intro setup
- The hook will be written separately

ADDITIONAL CREATIVE DIRECTIVES (weave in naturally):
${microInstructions.map((m, i) => `${i + 1}. ${m}`).join('\n')}

Write the complete script now. ${antiTemplate}`;
    } else if (structureVariant === 1) {
        userContent = `Here is the topic: ${state.promptTemplate}

And here is the outline you must follow:
${outline}

Write a ${state.scriptLength}-character script using ${params.narrativeStyle?.name} narration in a ${params.structure?.name} structure. The tone is ${params.tone?.name}. Apply this constraint: ${params.constraint?.name} — ${params.constraint?.description}.

${styleDirective}

Rules: no bullet points, no lists, no subheadings. No hook — start with the main content. The hook comes later.

Creative directives to weave in:
${microInstructions.map((m, i) => `${i + 1}. ${m}`).join('\n')}

${antiTemplate}`;
    } else if (structureVariant === 2) {
        userContent = `TASK: Transform the outline below into a complete, flowing script.

${outline}

TOPIC: ${state.promptTemplate}
LENGTH: ~${state.scriptLength} characters

Your voice should embody ${params.tone?.name} (${params.tone?.description}). Use ${params.narrativeStyle?.name} as your narrative mode. Follow the ${params.structure?.name} structure. Honor this constraint: ${params.constraint?.name}.

${styleDirective}

No bullet points. No subheadings. No hook (it will be written separately). Start directly with content.

Weave these creative elements in naturally:
${microInstructions.map((m, i) => `- ${m}`).join('\n')}

${antiTemplate}`;
    } else {
        userContent = `The constraint that must shape this script: ${params.constraint?.name} — ${params.constraint?.description}

Using the outline below, write the full script (~${state.scriptLength} characters):
${outline}

Topic: ${state.promptTemplate}
Style: ${params.narrativeStyle?.name} | Structure: ${params.structure?.name} | Tone: ${params.tone?.name}

${styleDirective}

Creative fingerprint for this version:
${microInstructions.map((m, i) => `${i + 1}. ${m}`).join('\n')}

No lists, no subheadings, no hook (written separately). Pure flowing prose.
${antiTemplate}`;
    }

    return [
        { role: 'system', content: systemContent },
        { role: 'user', content: userContent }
    ];
}

function buildHookMessages(script) {
    const params = getParameterDetails();
    const hookContext = state.hookPrompt ?
        `\n\nHOOK WRITING SYSTEM - FOLLOW THESE PRINCIPLES:\n${state.hookPrompt}\n\n` : '';

    const systemContent = `You are an expert at writing compelling hooks that grab attention immediately.${hookContext}`;

    const userContent = `Read this completed script and write a powerful hook for it:

SCRIPT:
${script}

HOOK TYPE REQUESTED: ${params.hookType?.name} - ${params.hookType?.description}

REQUIREMENTS:
1. The hook must provide immediate topic clarity (reader knows what this is about in first sentence)
2. Create on-target curiosity (reader believes this is for them and wants more)
3. Use the ${params.hookType?.name} technique
4. Keep it compressed - every word must earn its place
5. Use "you/your" language, not "I/me"
6. Include a pattern interrupt or contrast element
7. Maximum 4-6 sentences for the hook

Write ONLY the hook. No explanations or meta-commentary.`;

    return [
        { role: 'system', content: systemContent },
        { role: 'user', content: userContent }
    ];
}

// ============================================
// 8. MAIN GENERATION FLOW
// ============================================

async function generateScript() {
    if (state.isGenerating) return;

    const prompt = document.getElementById('promptTemplate').value.trim();
    if (!prompt) {
        alert('Please enter a script prompt/topic first.');
        return;
    }

    state.promptTemplate = prompt;
    state.isGenerating = true;

    // Load generation history from localStorage
    const savedHistory = localStorage.getItem('scriptBuilder_generationHistory');
    if (savedHistory) {
        state.generationHistory = JSON.parse(savedHistory);
    }

    // Update UI
    document.getElementById('generateBtn').disabled = true;
    document.getElementById('emptyState').classList.add('hidden');
    showProgress(true);
    resetProgress();

    try {
        // STAGE 1: Generate Outline
        updateProgress(1, 'Creating script outline...');
        switchTab('outline');
        const outlineMessages = buildOutlineMessages();
        console.log('[ScriptBuilder] Outline system message:', outlineMessages[0].content.slice(0, 200) + '...');
        console.log('[ScriptBuilder] Anti-repetition active:', outlineMessages[1].content.includes('AVOID THESE'));
        state.generated.outline = await callOpenRouter(outlineMessages, state.settings.outlineModel, { temperature: state.settings.outlineTemp });
        document.getElementById('outlineText').textContent = state.generated.outline;
        document.getElementById('outlineContent').classList.remove('hidden');

        // STAGE 2: Generate Script
        updateProgress(2, 'Writing full script...');
        switchTab('script');
        const scriptMessages = buildScriptMessages(state.generated.outline);
        state.generated.script = await callOpenRouter(scriptMessages, state.settings.scriptModel, { temperature: state.settings.scriptTemp });
        document.getElementById('scriptText').innerHTML = formatScriptText(state.generated.script);
        document.getElementById('scriptContent').classList.remove('hidden');

        // STAGE 3: Generate Hook
        updateProgress(3, 'Crafting compelling hook...');
        switchTab('hook');
        const hookMessages = buildHookMessages(state.generated.script);
        state.generated.hook = await callOpenRouter(hookMessages, state.settings.hookModel, { temperature: state.settings.hookTemp });
        document.getElementById('hookText').innerHTML = formatScriptText(state.generated.hook);
        document.getElementById('hookContent').classList.remove('hidden');

        // Combine into final script
        state.generated.final = state.generated.hook + '\n\n' + state.generated.script;
        document.getElementById('finalText').innerHTML = formatScriptText(state.generated.final);
        document.getElementById('finalContent').classList.remove('hidden');

        // Save to generation history
        saveGenerationHistory();

        // Mark complete
        markAllComplete();
        document.getElementById('progressStatus').textContent = 'Script generation complete!';

        // Show action bar and switch to final tab
        document.getElementById('actionBar').classList.remove('hidden');
        switchTab('final');

    } catch (error) {
        console.error('Generation error:', error);
        alert('Error: ' + error.message);
        document.getElementById('progressStatus').textContent = 'Generation failed: ' + error.message;
    } finally {
        state.isGenerating = false;
        document.getElementById('generateBtn').disabled = false;
    }
}

function saveGenerationHistory() {
    // Extract fingerprint from first sentence of each paragraph
    const paragraphs = state.generated.script.split('\n\n').filter(p => p.trim());
    const fingerprint = paragraphs.slice(0, 5).map(p => {
        const firstSentence = p.split(/[.!?]/)[0]?.trim() || '';
        return firstSentence.slice(0, 60);
    }).join(' | ');

    const params = getParameterDetails();
    const entry = {
        topic: state.promptTemplate.slice(0, 80),
        timestamp: Date.now(),
        paramsUsed: `${params.narrativeStyle?.name}, ${params.structure?.name}, ${params.tone?.name}, ${params.constraint?.name}, ${params.persona?.name || 'none'}`,
        fingerprint: fingerprint
    };

    state.generationHistory.push(entry);

    // Keep only last 10
    if (state.generationHistory.length > 10) {
        state.generationHistory = state.generationHistory.slice(-10);
    }

    localStorage.setItem('scriptBuilder_generationHistory', JSON.stringify(state.generationHistory));
}

function formatScriptText(text) {
    // Convert paragraphs to HTML
    return text.split('\n\n')
        .filter(p => p.trim())
        .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
        .join('');
}

// ============================================
// 9. STARTUP
// ============================================

document.addEventListener('DOMContentLoaded', init);
