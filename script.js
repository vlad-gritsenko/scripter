// ============================================
// SCRIPTER — Niche-Based Script Generation
// ============================================

// ============================================
// 1. STATE MANAGEMENT
// ============================================

const state = {
    currentNiche: null,     // Active niche ID
    niches: [],             // Schemas from /api/niches
    formValues: {},         // { WEAPON_NAME: "katana", ... }
    viewingDraft: false,    // Whether viewing draft (true) or final (false)
    settings: {
        apiEndpoint: '',    // Base URL — empty means relative paths (Pages deployment)
        writeTemp: 0.8,
        cleanTemp: 0.3,
    },
    generated: {
        draft: '',          // Stage 1 output (Opus 4.6)
        final: '',          // Stage 2 output (Sonnet 4.6 polished)
    },
    isGenerating: false,
    theme: 'dark',
};

// ============================================
// 2. THEME MANAGEMENT
// ============================================

function loadTheme() {
    const saved = localStorage.getItem('scripter_theme');
    if (saved) state.theme = saved;
    applyTheme();
}

function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('scripter_theme', state.theme);
    applyTheme();
}

function applyTheme() {
    const body = document.body;
    const iconDark = document.getElementById('themeIconDark');
    const iconLight = document.getElementById('themeIconLight');

    if (state.theme === 'light') {
        body.classList.add('light-theme');
        iconDark?.classList.add('hidden');
        iconLight?.classList.remove('hidden');
    } else {
        body.classList.remove('light-theme');
        iconDark?.classList.remove('hidden');
        iconLight?.classList.add('hidden');
    }
}

// ============================================
// 3. INITIALIZATION
// ============================================

async function init() {
    migrateOldData();
    loadTheme();
    loadSettings();
    await fetchNiches();

    const lastNiche = localStorage.getItem('scripter_currentNiche');
    if (lastNiche && state.niches.find(n => n.id === lastNiche)) {
        selectNiche(lastNiche);
    }

    bindEventListeners();
}

function migrateOldData() {
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('scriptBuilder_')) toRemove.push(key);
    }
    toRemove.forEach(k => localStorage.removeItem(k));
}

function loadSettings() {
    const saved = localStorage.getItem('scripter_settings');
    if (saved) {
        try {
            state.settings = { ...state.settings, ...JSON.parse(saved) };
        } catch { /* ignore parse errors */ }
    }

    const el = (id) => document.getElementById(id);
    if (el('apiEndpointInput')) el('apiEndpointInput').value = state.settings.apiEndpoint;
    if (el('writeTempSlider')) el('writeTempSlider').value = state.settings.writeTemp;
    if (el('cleanTempSlider')) el('cleanTempSlider').value = state.settings.cleanTemp;
    if (el('writeTempValue')) el('writeTempValue').textContent = state.settings.writeTemp;
    if (el('cleanTempValue')) el('cleanTempValue').textContent = state.settings.cleanTemp;
}

function saveSettings() {
    state.settings.apiEndpoint = document.getElementById('apiEndpointInput').value.trim().replace(/\/$/, '');
    state.settings.writeTemp = parseFloat(document.getElementById('writeTempSlider').value);
    state.settings.cleanTemp = parseFloat(document.getElementById('cleanTempSlider').value);
    localStorage.setItem('scripter_settings', JSON.stringify(state.settings));
}

function bindEventListeners() {
    const on = (id, event, fn) => document.getElementById(id)?.addEventListener(event, fn);

    on('themeToggleBtn', 'click', toggleTheme);
    on('generateBtn', 'click', generate);
    on('regenerateBtn', 'click', generate);
    on('copyBtn', 'click', copyContent);
    on('downloadBtn', 'click', downloadContent);
    on('viewDraftBtn', 'click', toggleDraftView);

    on('settingsBtn', 'click', () => document.getElementById('settingsModal').classList.remove('hidden'));
    on('closeSettings', 'click', () => document.getElementById('settingsModal').classList.add('hidden'));
    on('saveSettings', 'click', () => {
        saveSettings();
        document.getElementById('settingsModal').classList.add('hidden');
    });

    document.getElementById('settingsModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'settingsModal') document.getElementById('settingsModal').classList.add('hidden');
    });

    on('writeTempSlider', 'input', (e) => { document.getElementById('writeTempValue').textContent = e.target.value; });
    on('cleanTempSlider', 'input', (e) => { document.getElementById('cleanTempValue').textContent = e.target.value; });
}

// ============================================
// 4. NICHE SYSTEM & SIDEBAR
// ============================================

async function fetchNiches() {
    try {
        const base = state.settings.apiEndpoint;
        const res = await fetch(base ? `${base}/api/niches` : '/api/niches');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        state.niches = await res.json();
        renderSidebar();
    } catch (err) {
        console.error('Failed to fetch niches:', err);
        document.getElementById('nicheList').innerHTML =
            `<p class="px-3 py-2 text-xs text-red-400">Failed to load niches.<br>Check API endpoint in Settings.</p>`;
    }
}

function renderSidebar() {
    const list = document.getElementById('nicheList');

    if (!state.niches.length) {
        list.innerHTML = '<p class="px-3 py-2 text-sm text-gray-600">No niches available.</p>';
        return;
    }

    list.innerHTML = state.niches.map(niche => `
        <button
            id="niche-btn-${niche.id}"
            onclick="selectNiche('${niche.id}')"
            class="niche-btn w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:bg-gray-800 hover:text-gray-300 rounded-lg transition-all text-left">
            <span class="text-base leading-none shrink-0">${niche.icon}</span>
            <span>${niche.name}</span>
        </button>
    `).join('');
}

function selectNiche(nicheId) {
    const niche = state.niches.find(n => n.id === nicheId);
    if (!niche) return;

    state.currentNiche = nicheId;
    localStorage.setItem('scripter_currentNiche', nicheId);

    // Restore saved form values
    const saved = localStorage.getItem(`scripter_formValues_${nicheId}`);
    state.formValues = saved ? JSON.parse(saved) : {};

    // Update sidebar active states
    document.querySelectorAll('.niche-btn').forEach(btn => {
        btn.classList.remove('bg-gray-800', 'text-indigo-400', 'font-medium');
        btn.classList.add('text-gray-500');
    });
    const activeBtn = document.getElementById(`niche-btn-${nicheId}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-gray-500');
        activeBtn.classList.add('bg-gray-800', 'text-indigo-400', 'font-medium');
    }

    // Show form, hide welcome
    document.getElementById('welcomeState').classList.add('hidden');
    document.getElementById('nicheForm').classList.remove('hidden');

    // Set niche title
    document.getElementById('nicheIconEl').textContent = niche.icon;
    document.getElementById('nicheTitleEl').textContent = niche.name;

    // Render form controls
    renderFormControls(niche.placeholders);

    // Reset output when switching niches
    resetOutput();

    // Close mobile sidebar if open
    const sidebar = document.getElementById('sidebar');
    if (!sidebar.classList.contains('-translate-x-full')) {
        toggleMobileSidebar();
    }
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const isOpen = !sidebar.classList.contains('-translate-x-full');

    sidebar.classList.toggle('-translate-x-full', isOpen);
    overlay.classList.toggle('hidden', isOpen);
}

// ============================================
// 5. DYNAMIC FORM
// ============================================

function renderFormControls(placeholders) {
    const container = document.getElementById('dynamicFormControls');
    container.innerHTML = '';

    const entries = Object.entries(placeholders).sort(([, a], [, b]) => (a.order || 99) - (b.order || 99));
    const baseClass = 'w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all';

    for (const [key, config] of entries) {
        const wrapper = document.createElement('div');

        const label = document.createElement('label');
        label.className = 'block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5';
        label.textContent = config.label;
        label.setAttribute('for', `form_${key}`);
        wrapper.appendChild(label);

        let input;

        if (config.type === 'dropdown') {
            input = document.createElement('select');
            input.className = baseClass + ' cursor-pointer';
            config.options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt;
                input.appendChild(option);
            });

        } else if (config.type === 'links') {
            input = document.createElement('textarea');
            input.rows = 3;
            input.placeholder = config.placeholder || 'Paste comma-separated URLs';
            input.className = baseClass + ' resize-none';

        } else {
            input = document.createElement('input');
            input.type = 'text';
            input.placeholder = config.placeholder || '';
            input.className = baseClass;
        }

        input.id = `form_${key}`;
        input.dataset.placeholderKey = key;

        if (state.formValues[key] !== undefined) input.value = state.formValues[key];

        input.addEventListener('input', () => {
            state.formValues[key] = input.value;
            localStorage.setItem(`scripter_formValues_${state.currentNiche}`, JSON.stringify(state.formValues));
        });

        wrapper.appendChild(input);
        container.appendChild(wrapper);
    }
}

function collectFormValues() {
    const values = {};
    document.querySelectorAll('[data-placeholder-key]').forEach(el => {
        values[el.dataset.placeholderKey] = el.value;
    });
    return values;
}

// ============================================
// 6. API INTEGRATION
// ============================================

function apiUrl(path) {
    return state.settings.apiEndpoint ? `${state.settings.apiEndpoint}${path}` : path;
}

async function callGenerate(payload) {
    const res = await fetch(apiUrl('/api/generate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        let message = `HTTP ${res.status}`;
        try {
            const data = await res.json();
            message = data.error || message;
        } catch { /* ignore */ }
        throw new Error(message);
    }

    return res;
}

async function readStream(response, onChunk) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (data === '[DONE]') return;

            try {
                const json = JSON.parse(data);
                const chunk = json.choices?.[0]?.delta?.content;
                if (chunk) onChunk(chunk);
            } catch { /* skip malformed SSE */ }
        }
    }
}

// ============================================
// 7. GENERATION PIPELINE
// ============================================

async function generate() {
    if (state.isGenerating) return;
    if (!state.currentNiche) {
        alert('Please select a niche first.');
        return;
    }

    state.formValues = collectFormValues();
    localStorage.setItem(`scripter_formValues_${state.currentNiche}`, JSON.stringify(state.formValues));

    state.isGenerating = true;
    state.generated.draft = '';
    state.generated.final = '';
    state.viewingDraft = false;

    const generateBtn = document.getElementById('generateBtn');
    const actionBar = document.getElementById('actionBar');
    const viewDraftBtn = document.getElementById('viewDraftBtn');
    const contentText = document.getElementById('contentText');
    const outputSection = document.getElementById('outputSection');
    const progressSection = document.getElementById('progressSection');

    generateBtn.disabled = true;
    actionBar.classList.add('hidden');
    viewDraftBtn.classList.add('hidden');
    viewDraftBtn.textContent = 'View Draft';

    progressSection.classList.remove('hidden');
    resetProgress();

    contentText.textContent = '';
    contentText.className = 'text-gray-200 leading-relaxed whitespace-pre-wrap text-sm min-h-16';
    outputSection.classList.remove('hidden');

    // Scroll the progress into view
    progressSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    try {
        // === STAGE 1: WRITE (Claude Opus 4.6) ===
        updateProgress(1, 'Writing script with Claude Opus 4.6...');

        const writeRes = await callGenerate({
            niche: state.currentNiche,
            placeholders: state.formValues,
            stage: 'write',
            temperature: state.settings.writeTemp,
        });

        await readStream(writeRes, (chunk) => {
            state.generated.draft += chunk;
            contentText.textContent = state.generated.draft;
        });

        // === STAGE 2: POLISH (Claude Sonnet 4.6) ===
        updateProgress(2, 'Polishing with Claude Sonnet 4.6...');
        contentText.textContent = '';

        const cleanRes = await callGenerate({
            draft: state.generated.draft,
            stage: 'clean',
            temperature: state.settings.cleanTemp,
        });

        await readStream(cleanRes, (chunk) => {
            state.generated.final += chunk;
            contentText.textContent = state.generated.final;
        });

        // === DONE ===
        markAllComplete();
        document.getElementById('progressStatus').textContent = 'Done.';

        contentText.innerHTML = formatScriptText(state.generated.final);
        contentText.className = 'text-gray-200 leading-relaxed script-content';

        actionBar.classList.remove('hidden');
        viewDraftBtn.classList.remove('hidden');
        updateWordCount();

    } catch (err) {
        console.error('Generation error:', err);
        document.getElementById('progressStatus').textContent = `Error: ${err.message}`;
        contentText.className = 'text-red-400 text-sm whitespace-pre-wrap';
        contentText.textContent = `Generation failed:\n${err.message}`;

    } finally {
        state.isGenerating = false;
        generateBtn.disabled = false;
    }
}

// ============================================
// 8. PROGRESS VISUALIZATION
// ============================================

function resetProgress() {
    for (let i = 1; i <= 2; i++) {
        const circle = document.getElementById(`step${i}Circle`);
        circle.className = 'w-10 h-10 rounded-full border-2 border-gray-700 flex items-center justify-center transition-all';
        circle.innerHTML = '';
    }
    const line = document.getElementById('step1Line');
    if (line) line.className = 'w-20 h-px bg-gray-700 mx-1 transition-all';
    document.getElementById('progressStatus').textContent = 'Starting...';
}

function updateProgress(activeStep, statusText) {
    document.getElementById('progressStatus').textContent = statusText;

    for (let i = 1; i <= 2; i++) {
        const circle = document.getElementById(`step${i}Circle`);

        if (i < activeStep) {
            circle.className = 'w-10 h-10 rounded-full bg-green-700 flex items-center justify-center transition-all';
            circle.innerHTML = '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>';
            if (i === 1) {
                const line = document.getElementById('step1Line');
                if (line) line.className = 'w-20 h-0.5 bg-green-600 mx-1 transition-all';
            }
        } else if (i === activeStep) {
            circle.className = 'w-10 h-10 rounded-full border-2 border-indigo-500 flex items-center justify-center transition-all';
            circle.innerHTML = '<div class="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin"></div>';
        } else {
            circle.className = 'w-10 h-10 rounded-full border-2 border-gray-700 flex items-center justify-center transition-all';
            circle.innerHTML = '';
        }
    }
}

function markAllComplete() {
    for (let i = 1; i <= 2; i++) {
        const circle = document.getElementById(`step${i}Circle`);
        circle.className = 'w-10 h-10 rounded-full bg-green-700 flex items-center justify-center transition-all';
        circle.innerHTML = '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>';
    }
    const line = document.getElementById('step1Line');
    if (line) line.className = 'w-20 h-0.5 bg-green-600 mx-1 transition-all';
}

// ============================================
// 9. CONTENT DISPLAY
// ============================================

function resetOutput() {
    state.generated = { draft: '', final: '' };
    state.viewingDraft = false;
    document.getElementById('progressSection').classList.add('hidden');
    document.getElementById('outputSection').classList.add('hidden');
    document.getElementById('actionBar').classList.add('hidden');
}

function formatScriptText(text) {
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    return paragraphs.map((p, i) => {
        const content = p.replace(/\n/g, '<br>');
        return i === 0 ? `<p class="first-paragraph">${content}</p>` : `<p>${content}</p>`;
    }).join('');
}

function updateWordCount() {
    const text = state.viewingDraft ? state.generated.draft : state.generated.final;
    const count = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    document.getElementById('wordCount').textContent = `${count} words`;
}

function toggleDraftView() {
    state.viewingDraft = !state.viewingDraft;
    const contentText = document.getElementById('contentText');
    const viewDraftBtn = document.getElementById('viewDraftBtn');
    const text = state.viewingDraft ? state.generated.draft : state.generated.final;

    contentText.innerHTML = formatScriptText(text);
    contentText.className = state.viewingDraft
        ? 'text-gray-400 leading-relaxed script-content'
        : 'text-gray-200 leading-relaxed script-content';

    viewDraftBtn.textContent = state.viewingDraft ? 'View Final' : 'View Draft';
    updateWordCount();
}

function copyContent() {
    const text = state.viewingDraft ? state.generated.draft : state.generated.final;
    navigator.clipboard.writeText(text);

    const btn = document.getElementById('copyBtn');
    const original = btn.innerHTML;
    btn.innerHTML = '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied!';
    btn.classList.add('bg-green-700', 'border-green-700');
    setTimeout(() => {
        btn.innerHTML = original;
        btn.classList.remove('bg-green-700', 'border-green-700');
    }, 2000);
}

function downloadContent() {
    const text = state.viewingDraft ? state.generated.draft : state.generated.final;
    if (!text) return;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script-${state.currentNiche}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const btn = document.getElementById('downloadBtn');
    const original = btn.innerHTML;
    btn.innerHTML = '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Downloaded!';
    btn.classList.add('bg-green-700', 'border-green-700');
    setTimeout(() => {
        btn.innerHTML = original;
        btn.classList.remove('bg-green-700', 'border-green-700');
    }, 2000);
}

// ============================================
// 10. STARTUP
// ============================================

document.addEventListener('DOMContentLoaded', init);
