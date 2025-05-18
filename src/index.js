// index.js
import { App } from './modules/app.js';
import { initI18n } from './modules/i18n.js';
import { loadNextPrompt } from './modules/prompts.js';
import { initSettings } from './modules/settings.js';

document.addEventListener('DOMContentLoaded', async function () {
  try {

    App.getInstance();

    // 初始化设置模块
    initSettings();    

    // 初始化多语言模块
    await initI18n();

    // 加载问题
    await loadNextPrompt();
  } catch (error) {
    console.error('初始化出错:', error);
  }
});