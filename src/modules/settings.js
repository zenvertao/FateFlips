// settings.js
// 设置窗口管理模块

import { getText } from './i18n.js';
import { AI_MODELS } from './ai-models.js';
import { requestAIPrompts, loadNextPrompt } from './prompts.js';

// 打开设置窗口
function openSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    const settingsBtn = document.querySelector('.settings-btn');

    if (settingsModal) {
        loadSettings();
        settingsModal.style.display = 'flex';
        if (settingsBtn) {
            settingsBtn.classList.add('active');
        }
    }
}

// 关闭设置窗口
function closeSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    const settingsBtn = document.querySelector('.settings-btn');

    if (settingsModal) {
        settingsModal.style.display = 'none';
        if (settingsBtn) {
            settingsBtn.classList.remove('active');
        }
    }
}

// 加载设置
function loadSettings() {
    const apiModel = document.getElementById('api-model');
    const apiUrlInput = document.getElementById('api-url');
    const apiTokenInput = document.getElementById('api-token');

    if (!apiModel || !apiUrlInput || !apiTokenInput) return;

    const savedSettings = localStorage.getItem('aiSettings');
    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            const allSettings = JSON.parse(localStorage.getItem('allAiSettings')) || {};

            if (settings.model && AI_MODELS[settings.model]) {
                apiModel.value = settings.model;
                const modelSettings = allSettings[settings.model] || {};
                apiUrlInput.value = modelSettings.apiUrl || AI_MODELS[settings.model].defaultUrl;
                apiTokenInput.value = modelSettings.apiKey || '';
            } else {
                const firstModel = Object.keys(AI_MODELS)[0];
                apiModel.value = firstModel;
                const modelSettings = allSettings[firstModel] || {};
                apiUrlInput.value = modelSettings.apiUrl || AI_MODELS[firstModel].defaultUrl;
                apiTokenInput.value = modelSettings.apiKey || '';
            }
        } catch (e) {
            console.error('加载设置出错:', e);
        }
    }
}

// 初始化模型选择器
function initModelSelector() {
    const apiModel = document.getElementById('api-model');
    const apiUrlInput = document.getElementById('api-url');
    const apiTokenInput = document.getElementById('api-token');

    if (!apiModel) return;

    apiModel.innerHTML = '';

    Object.entries(AI_MODELS).forEach(([value, model]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = model.name;
        apiModel.appendChild(option);
    });

    apiModel.addEventListener('change', function () {
        const selectedModel = AI_MODELS[this.value];
        if (selectedModel && apiUrlInput) {
            apiUrlInput.value = selectedModel.defaultUrl;
            const allSettings = JSON.parse(localStorage.getItem('allAiSettings')) || {};
            const modelSettings = allSettings[this.value];
            if (apiTokenInput) {
                apiTokenInput.value = modelSettings?.apiKey || '';
            }
        }
    });
}

// 保存设置
async function saveSettings() {
    const apiUrlInput = document.getElementById('api-url');
    const apiTokenInput = document.getElementById('api-token');
    const apiModel = document.getElementById('api-model');

    if (!apiUrlInput || !apiTokenInput || !apiModel) return;

    const apiUrl = apiUrlInput.value.trim();
    const apiKey = apiTokenInput.value.trim();
    let model = apiModel.value;

    if (!apiUrl) {
        alert(getText('settings.urlRequired'));
        apiUrlInput.focus();
        return false;
    }

    if (!apiKey) {
        alert(getText('settings.keyRequired'));
        apiTokenInput.focus();
        return false;
    }

    let allSettings = JSON.parse(localStorage.getItem('allAiSettings')) || {};
    const isFirstSave = !allSettings[model] || !allSettings[model].apiKey;

    allSettings[model] = {
        apiUrl: apiUrl,
        apiKey: apiKey
    };

    localStorage.setItem('allAiSettings', JSON.stringify(allSettings));
    localStorage.setItem('aiSettings', JSON.stringify({ model: model }));

    closeSettingsModal();

    if (isFirstSave) {
        if (confirm(getText('settings.updatePromptConfirm'))) {
            try {
                await requestAIPrompts({
                    apiKey: apiKey,
                    apiUrl: apiUrl,
                    model: model
                });
                await loadNextPrompt();
            } catch (error) {
                console.error('更新AI提示失败:', error);
                alert(getText('settings.updatePromptFailed') + error.message);
            }
        }
    }
}

// 清除API密钥
function clearApiKey() {
    const apiTokenInput = document.getElementById('api-token');
    const apiModel = document.getElementById('api-model');

    if (!apiTokenInput || !apiModel) return;

    if (confirm(getText('settings.clearKeyConfirm'))) {
        apiTokenInput.value = '';
        apiTokenInput.focus();

        const currentModel = apiModel.value;
        const allSettings = JSON.parse(localStorage.getItem('allAiSettings')) || {};
        if (allSettings[currentModel]) {
            allSettings[currentModel].apiKey = '';
            localStorage.setItem('allAiSettings', JSON.stringify(allSettings));
        }
    }
}

// 重置所有数据
function resetAllData() {
    if (confirm(getText('settings.resetDataConfirm'))) {
        localStorage.clear();
        location.reload();
    }
}

// 初始化所有设置相关的事件监听
function initSettings() {
    initModelSelector();

    const settingsBtn = document.querySelector('.settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', openSettingsModal);
    }

    const closeSettings = document.querySelector('.settings-close');
    if (closeSettings) {
        closeSettings.addEventListener('click', closeSettingsModal);
    }

    const cancelBtn = document.querySelector('.btn-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeSettingsModal);
    }

    const saveBtn = document.querySelector('.btn-save');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSettings);
    }

    const clearTokenBtn = document.getElementById('clear-token');
    if (clearTokenBtn) {
        clearTokenBtn.addEventListener('click', clearApiKey);
    }

    const moreBtn = document.querySelector('.settings-more-btn');
    const dropdown = document.querySelector('.settings-dropdown');
    
    if (moreBtn && dropdown) {
        moreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        document.getElementById('reset-data').addEventListener('click', () => {
            dropdown.style.display = 'none';
            resetAllData();
        });

        document.getElementById('about-author').addEventListener('click', () => {
            dropdown.style.display = 'none';
            window.open('https://zenver.vercel.app', '_blank');
        });

        document.addEventListener('click', () => {
            dropdown.style.display = 'none';
        });
    }
}

// 导出所有需要的函数
export {
    openSettingsModal,
    closeSettingsModal,
    initSettings,
    resetAllData
};