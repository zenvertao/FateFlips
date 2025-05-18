// 导入AI提示请求模块
import { fetchBilingualPrompts } from './ai-prompts.js';
import { getText, getCurrentLanguage, setTemporaryTranslation } from './i18n.js';
import BasePrompts from './base.js';
import defaultPrompts from './default.js';
import { openSettingsModal } from './settings.js';

// 多语言提示数据
const defaultData = defaultPrompts.formatedData;

// 本地存储键名
const AI_PROMPTS_STORAGE_KEY = 'aiGeneratedPrompts';

// 缓冲池配置
const MAX_STORAGE_SIZE = 100; // 最大存储数量，防止本地存储过大

// 标记是否正在请求AI提示
let isRequestingAIPrompts = false;

// 显示全局Loading
function showGlobalLoading() {
  const loadingElement = document.getElementById('global-loading');
  if (loadingElement) {
    loadingElement.style.display = 'flex';
  }
}

// 隐藏全局Loading
function hideGlobalLoading() {
  const loadingElement = document.getElementById('global-loading');
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
}

// 本地提示池
let localPromptPool = defaultPrompts.shuffle();

// 当前提示池
let currentPromptPool = new BasePrompts();

// 从本地存储加载提示到本地池
function loadAIPromptsFromStorage() {
  try {
    const storedPrompts = localStorage.getItem(AI_PROMPTS_STORAGE_KEY);
    if (storedPrompts) {
      const parsedPrompts = JSON.parse(storedPrompts);
      if (parsedPrompts.length) {
        localPromptPool = new BasePrompts(parsedPrompts).shuffle();
      }
    } else {
      // 将默认提示保存到本地存储
      saveAIPromptsToStorage();
    }
  } catch (error) {
    console.error('从本地存储加载提示失败:', error);
  }
}

// 保存本地池提示到本地存储
function saveAIPromptsToStorage() {
  try {
    localPromptPool.dedupe();
    if (localPromptPool.length > 0) {
      // 保存去重后的提示数据
      localStorage.setItem(AI_PROMPTS_STORAGE_KEY, JSON.stringify(localPromptPool.data));
    }
  } catch (error) {
    console.error('保存提示到本地存储失败:', error);
  }
}

// 页面加载时初始化
loadAIPromptsFromStorage();

// 异步请求AI提示
async function requestAIPrompts(savedSettings) {
  if (!savedSettings?.apiKey || !savedSettings?.apiUrl || !savedSettings?.model) {
    console.error('API设置不完整，请检查设置');
    return;
  }

  if (isRequestingAIPrompts) {
    return;
  }

  isRequestingAIPrompts = true;
  showGlobalLoading(); // 显示全局 Loading

  try {
    const bilingualPrompts = await fetchBilingualPrompts(
      savedSettings.apiKey,
      savedSettings.apiUrl,
      savedSettings.model,
      localPromptPool.data
    );

    if (bilingualPrompts && bilingualPrompts.length > 0) {
      // 先对新获取的提示进行自身去重
      const deduped = new BasePrompts(bilingualPrompts).dedupe();
      
      // 过滤掉与本地池重复的提示
      const rawPrompts = deduped.data.filter(newPrompt => 
        !localPromptPool.data.some(existingPrompt => 
          existingPrompt[0][0] === newPrompt[0][0]
        )
      );

      // 更新本地池
      if (localPromptPool.length + rawPrompts.length > MAX_STORAGE_SIZE) {
        // 如果超出最大限制，保留最新的数据
        const keepCount = MAX_STORAGE_SIZE - rawPrompts.length;
        const newData = keepCount > 0 ?
          [...localPromptPool.data.slice(-keepCount), ...rawPrompts] :
          rawPrompts.slice(-MAX_STORAGE_SIZE);
        localPromptPool = new BasePrompts(newData);
      } else {
        localPromptPool = new BasePrompts([...localPromptPool.data, ...rawPrompts]);
      }

      // 更新当前提示池
      currentPromptPool = new BasePrompts(rawPrompts).shuffle();

      // 保存到本地存储
      saveAIPromptsToStorage();
    }
  } catch (error) {
    console.error('请求提示失败:', error);
  } finally {
    isRequestingAIPrompts = false;
    hideGlobalLoading(); // 隐藏全局Loading
  }
}

// 获取API设置
function getApiSettings() {
  try {
    // 获取当前选中的模型
    const currentModelSettings = localStorage.getItem('aiSettings');
    if (!currentModelSettings) {
      console.error('未找到当前模型设置');
      return null;
    }

    const { model } = JSON.parse(currentModelSettings);
    if (!model) {
      console.error('当前模型名称未指定');
      return null;
    }

    // 获取该模型的详细设置
    const allSettings = JSON.parse(localStorage.getItem('allAiSettings')) || {};
    const modelSettings = allSettings[model];

    if (!modelSettings?.apiKey || !modelSettings?.apiUrl) {
      console.error(`模型 ${model} 的API设置不完整`);
      return null;
    }

    // 返回完整的设置对象
    return {
      model,
      apiKey: modelSettings.apiKey,
      apiUrl: modelSettings.apiUrl
    };
  } catch (error) {
    console.error('获取API设置失败:', error);
    return null;
  }
}

async function handlePromptUpdate() {
  if (confirm(getText('updateConfirm'))) {
    const settings = getApiSettings();
    if (settings?.apiKey) {
      try {
        await requestAIPrompts(settings);
        return currentPromptPool;
      } catch (error) {
        console.error('请求新数据失败:', error);
        return localPromptPool.shuffle();
      }
    } else {
      // 弹出设置窗口
      alert(getText('settings.needApiKey')); 
      openSettingsModal();
      return localPromptPool.shuffle();
    }
  } else {
    return localPromptPool.shuffle();
  }
}

// 获取当前语言的提示
async function getCurrentPrompts() {
  try {
    if (isRequestingAIPrompts) {
      return null;
    }

    if (!currentPromptPool.needReShuffle()) {
      return currentPromptPool;
    }

    if (!localPromptPool.needReShuffle()) {
      return localPromptPool;
    } else {
      return await handlePromptUpdate();
    }

  } catch (error) {
    console.error('获取提示数据时发生错误:', error);
    return defaultPrompts;
  }
}

// 获取随机提示
async function getRandomPrompt() {
  try {
    let currentPool = await getCurrentPrompts();
    if (!currentPool) {
      return null;
    }
    let currentRandomPrompt = currentPool.getRandomItem();
    if (!currentRandomPrompt) {
      console.error('当前池为空，尝试请求新数据');
      return null;
    }
    // 更新临时翻译资源
    Object.keys(currentRandomPrompt.zh).forEach(key => {
      setTemporaryTranslation(`prompt.${key}`, {
        zh: currentRandomPrompt.zh[key],
        en: currentRandomPrompt.en[key]
      });
    });

    return currentRandomPrompt;
  } catch (error) {
    console.error('获取随机提示失败:', error);
    return null;
  }
}

// 加载下一个提示
async function loadNextPrompt() {
  try {
    const currentPrompt = await getRandomPrompt();
    if (currentPrompt) {
      document.getElementById('prompt').textContent = getText('prompt.question');
      document.getElementById('yesBtn').textContent = getText('prompt.yes');
      document.getElementById('noBtn').textContent = getText('prompt.no');
    }
  } catch (error) {
    console.error('加载下一个提示时出错:', error);
  }
}

// 导出所有需要的函数和变量
export {
  getCurrentPrompts,
  loadAIPromptsFromStorage,
  requestAIPrompts,
  loadNextPrompt
};