let i18next;

// 支持的语言列表
const supportedLanguages = ['zh', 'en'];

// 获取当前语言
function getCurrentLanguage() {
  return document.documentElement.lang || 'zh';
}

// 初始化默认语言
function initLanguage() {
  const urlLang = new URLSearchParams(location.search).get('lng');
  const storedLang = localStorage.getItem('i18nextLng');

  if (urlLang && supportedLanguages.includes(urlLang)) {
    switchLanguage(urlLang);
  } else if (storedLang && supportedLanguages.includes(storedLang)) {
    switchLanguage(storedLang);
  } else {
    switchLanguage('zh'); // 默认语言
  }
}

function initLanguageToggle() {
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    const currentLang = getCurrentLanguage();
    langToggle.textContent = currentLang === 'zh' ? 'EN' : '中';

    langToggle.addEventListener('click', async function () {
      const currentLang = getCurrentLanguage();
      const newLang = currentLang === 'zh' ? 'en' : 'zh';

      await switchLanguage(newLang);
      langToggle.textContent = newLang === 'zh' ? 'EN' : '中';
    });
  }
}

// 切换语言
async function switchLanguage(lang) {
  if (supportedLanguages.includes(lang)) {
    document.documentElement.lang = lang;

    if (i18next) {
      await i18next.changeLanguage(lang);
      // 写入localStorage（键名保持i18next标准键'i18nextLng'）
      localStorage.setItem('i18nextLng', lang);
    }
    return true;
  }
  return false;
}

// 动态导入i18next和相关插件
async function initI18n() {
  if (!i18next) {
    // 使用全局变量中的 i18next
    i18next = window.i18next;

    // 初始化i18next
    await i18next.init({
      fallbackLng: 'zh',
      ns: ['translation'],
      defaultNS: 'translation',
      interpolation: {
        escapeValue: false // 不转义HTML
      }
    });

    // 加载语言资源
    const [zhResource, enResource] = await Promise.all([
      fetch('./src/locales/zh.json').then(res => res.json()),
      fetch('./src/locales/en.json').then(res => res.json())
    ]);

    // 添加语言资源
    i18next.addResourceBundle('zh', 'translation', zhResource.translation);
    i18next.addResourceBundle('en', 'translation', enResource.translation);

    // 监听语言变化，自动更新 DOM
    i18next.on('languageChanged', () => {
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = i18next.t(key);
      });

      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.setAttribute('placeholder', i18next.t(key));
      });
    });

    initLanguage();
    initLanguageToggle();
  }
}

// 获取翻译文本的函数
function getText(key) {
  return i18next.t(key);
}

// 添加或更新临时翻译资源
function setTemporaryTranslation(key, translations) {
  supportedLanguages.forEach(lang => {
    // addResource 会自动处理更新，不需要额外的 exists 检查
    i18next.addResource(lang, 'translation', key, translations[lang]);
  });
}

export {
  initI18n,
  getText,
  getCurrentLanguage,
  switchLanguage,
  setTemporaryTranslation,
  supportedLanguages
};