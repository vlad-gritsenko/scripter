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
    { id: 'interview', name: 'Interview Transcript', description: 'Q&A format revealing insights' }
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
    { id: 'circular', name: 'Circular Narrative', description: 'Ends where it began, transformed' }
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
    { id: 'mysterious', name: 'Mysterious & Intriguing', description: 'Leaves questions, builds curiosity' }
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
    { id: 'sensory', name: 'Sensory Description', description: 'Immerse in physical experience first' }
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
    { id: 'tension-pacing', name: 'Build Tension', description: 'Deliberately control pacing for suspense' }
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
        constraint: null
    },
    storytellingPrompt: '',
    hookPrompt: '',
    settings: {
        apiKey: '',
        outlineModel: 'anthropic/claude-sonnet-4',
        scriptModel: 'anthropic/claude-sonnet-4',
        hookModel: 'anthropic/claude-sonnet-4',
        temperature: 0.8
    },
    generated: {
        outline: '',
        script: '',
        hook: '',
        final: ''
    },
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
        constraintSelect: state.parameters.constraint
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
    if (saved) {
        const parsed = JSON.parse(saved);
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

    // Apply to UI
    document.getElementById('apiKeyInput').value = state.settings.apiKey;
    document.getElementById('outlineModelSelect').value = state.settings.outlineModel;
    document.getElementById('scriptModelSelect').value = state.settings.scriptModel;
    document.getElementById('hookModelSelect').value = state.settings.hookModel;
    document.getElementById('temperatureSlider').value = state.settings.temperature;
    document.getElementById('tempValue').textContent = state.settings.temperature;

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
        { id: 'constraintSelect', options: SPECIAL_CONSTRAINTS, paramKey: 'constraint' }
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
        constraint: randomFrom(SPECIAL_CONSTRAINTS).id
    };

    // Update select elements
    document.getElementById('narrativeStyleSelect').value = state.parameters.narrativeStyle;
    document.getElementById('structureSelect').value = state.parameters.structure;
    document.getElementById('toneSelect').value = state.parameters.tone;
    document.getElementById('hookTypeSelect').value = state.parameters.hookType;
    document.getElementById('constraintSelect').value = state.parameters.constraint;

    saveParameters();
}

function saveParameters() {
    localStorage.setItem('scriptBuilder_parameters', JSON.stringify(state.parameters));
}

function saveParametersWithFeedback() {
    saveParameters();
    const btn = document.getElementById('saveParamsBtn');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Saved!';
    btn.classList.remove('text-green-400');
    btn.classList.add('text-emerald-300');
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('text-emerald-300');
        btn.classList.add('text-green-400');
    }, 2000);
}

function saveSettings() {
    state.settings.apiKey = document.getElementById('apiKeyInput').value;
    state.settings.outlineModel = document.getElementById('outlineModelSelect').value;
    state.settings.scriptModel = document.getElementById('scriptModelSelect').value;
    state.settings.hookModel = document.getElementById('hookModelSelect').value;
    state.settings.temperature = parseFloat(document.getElementById('temperatureSlider').value);

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

    // Save parameters button
    document.getElementById('saveParamsBtn').addEventListener('click', () => {
        saveParametersWithFeedback();
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

    // Temperature slider
    document.getElementById('temperatureSlider').addEventListener('input', (e) => {
        document.getElementById('tempValue').textContent = e.target.value;
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

async function callOpenRouter(prompt, model) {
    if (!state.settings.apiKey) {
        throw new Error('API key not configured. Click the settings icon to add your OpenRouter API key.');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.settings.apiKey}`,
            'HTTP-Referer': window.location.href,
            'X-Title': 'Script Builder'
        },
        body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            temperature: state.settings.temperature,
            max_tokens: 4000
        })
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
        constraint: SPECIAL_CONSTRAINTS.find(c => c.id === state.parameters.constraint)
    };
}

function buildOutlinePrompt() {
    const params = getParameterDetails();
    const storytellingContext = state.storytellingPrompt ?
        `\n\nUSE THESE STORYTELLING PRINCIPLES AS YOUR GUIDE:\n${state.storytellingPrompt}\n\n` : '';

    return `You are a professional script writer creating an outline for a compelling script.

NICHE/TOPIC:
${state.promptTemplate}

TARGET LENGTH: Approximately ${state.scriptLength} characters for the final script.

WRITING PARAMETERS TO FOLLOW:
- Narrative Style: ${params.narrativeStyle?.name} - ${params.narrativeStyle?.description}
- Structure: ${params.structure?.name} - ${params.structure?.description}
- Emotional Tone: ${params.tone?.name} - ${params.tone?.description}
- Special Constraint: ${params.constraint?.name} - ${params.constraint?.description}
${storytellingContext}
Create a detailed outline (master plan) for this script. Include:
1. A clear title concept
2. The main thesis/angle/unique perspective
3. Block-by-block breakdown with:
   - Main point of each block
   - Key insights or examples to include
   - How it connects to the overall narrative
4. The emotional arc and pacing notes
5. Overall tone of the narration

DO NOT write the full script yet. This is just the outline/blueprint.
Write in a clear, organized format that another writer could follow.`;
}

function buildScriptPrompt(outline) {
    const params = getParameterDetails();
    const storytellingContext = state.storytellingPrompt ?
        `\n\nSTORYTELLING PRINCIPLES TO APPLY:\n${state.storytellingPrompt}\n\n` : '';

    return `You are a professional script writer. Write a complete script based on this outline.

OUTLINE TO FOLLOW:
${outline}

NICHE/TOPIC:
${state.promptTemplate}

TARGET LENGTH: Approximately ${state.scriptLength} characters.

WRITING PARAMETERS:
- Narrative Style: ${params.narrativeStyle?.name} - ${params.narrativeStyle?.description}
- Structure: ${params.structure?.name} - ${params.structure?.description}
- Emotional Tone: ${params.tone?.name} - ${params.tone?.description}
- Special Constraint: ${params.constraint?.name} - ${params.constraint?.description}
${storytellingContext}
CRITICAL RULES:
- NO bullet points, numbered lists, or subheadings in the final script
- Write in flowing, conversational paragraphs
- Use specific, concrete details and examples
- Vary sentence length dramatically
- Show, don't tell
- DO NOT write a hook/opening - start directly with the main content after the intro setup
- The hook will be written separately

Write the complete script now. Make it compelling, unique, and impossible to template.`;
}

function buildHookPrompt(script) {
    const params = getParameterDetails();
    const hookContext = state.hookPrompt ?
        `\n\nHOOK WRITING SYSTEM - FOLLOW THESE PRINCIPLES:\n${state.hookPrompt}\n\n` : '';

    return `You are an expert at writing compelling hooks that grab attention immediately.

Read this completed script and write a powerful hook for it:

SCRIPT:
${script}

HOOK TYPE REQUESTED: ${params.hookType?.name} - ${params.hookType?.description}
${hookContext}
REQUIREMENTS:
1. The hook must provide immediate topic clarity (reader knows what this is about in first sentence)
2. Create on-target curiosity (reader believes this is for them and wants more)
3. Use the ${params.hookType?.name} technique
4. Keep it compressed - every word must earn its place
5. Use "you/your" language, not "I/me"
6. Include a pattern interrupt or contrast element
7. Maximum 4-6 sentences for the hook

Write ONLY the hook. No explanations or meta-commentary.`;
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

    // Update UI
    document.getElementById('generateBtn').disabled = true;
    document.getElementById('emptyState').classList.add('hidden');
    showProgress(true);
    resetProgress();

    try {
        // STAGE 1: Generate Outline
        updateProgress(1, 'Creating script outline...');
        switchTab('outline');
        const outlinePrompt = buildOutlinePrompt();
        state.generated.outline = await callOpenRouter(outlinePrompt, state.settings.outlineModel);
        document.getElementById('outlineText').textContent = state.generated.outline;
        document.getElementById('outlineContent').classList.remove('hidden');

        // STAGE 2: Generate Script
        updateProgress(2, 'Writing full script...');
        switchTab('script');
        const scriptPrompt = buildScriptPrompt(state.generated.outline);
        state.generated.script = await callOpenRouter(scriptPrompt, state.settings.scriptModel);
        document.getElementById('scriptText').innerHTML = formatScriptText(state.generated.script);
        document.getElementById('scriptContent').classList.remove('hidden');

        // STAGE 3: Generate Hook
        updateProgress(3, 'Crafting compelling hook...');
        switchTab('hook');
        const hookPrompt = buildHookPrompt(state.generated.script);
        state.generated.hook = await callOpenRouter(hookPrompt, state.settings.hookModel);
        document.getElementById('hookText').innerHTML = formatScriptText(state.generated.hook);
        document.getElementById('hookContent').classList.remove('hidden');

        // Combine into final script
        state.generated.final = state.generated.hook + '\n\n' + state.generated.script;
        document.getElementById('finalText').innerHTML = formatScriptText(state.generated.final);
        document.getElementById('finalContent').classList.remove('hidden');

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
