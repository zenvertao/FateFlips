// mobile-adapter.js
export class MobileAdapter {
  constructor() {
    this.initializeMobileElements();
    this.adjustMobileLayout();
    this.initCursorPosition()
  }

  initializeMobileElements() {
    const elements = {
      cursor: 'mobile-cursor',
      tip: 'mobile-tip',
      yesBtn: 'yesBtn',
      noBtn: 'noBtn',
      container: '.container',
      buttons: '.buttons',
      prompt: 'prompt'
    };

    Object.entries(elements).forEach(([key, selector]) => {
      this[key] = selector.startsWith('.') ?
        document.querySelector(selector) :
        document.getElementById(selector);
    });

    // 验证必要元素是否存在
    if (!this.container || !this.buttons || !this.yesBtn || !this.noBtn || !this.prompt) {
      return;
    }

  }

  adjustMobileLayout() {
    if (!this.container || !this.buttons) return;

    const isMobile = window.innerWidth <= 768;
    isMobile ? this.setMobileLayout() : this.setDesktopLayout();
  }

  setMobileLayout() {
    if (!this.container || !this.buttons || !this.yesBtn || !this.noBtn || !this.prompt) return;

    const face = document.getElementById('face');
    if (!face) return;

    // 调整按钮位置
    this.container.insertBefore(this.yesBtn, face);
    this.container.appendChild(this.noBtn);
    this.container.appendChild(this.tip);

    // 设置按钮样式
    const buttonStyle = {
      display: 'block',
      width: '80%',
      margin: '0.5rem auto'
    };
    [this.yesBtn, this.noBtn].forEach(btn => {
      if (btn) Object.assign(btn.style, buttonStyle);
    });

    // 设置标题样式
    if (this.prompt) {
      Object.assign(this.prompt.style, {
        width: '100%',
        textAlign: 'center'
      });
    }

    if (this.buttons) {
      this.buttons.style.display = 'none';
    }
  }

  setDesktopLayout() {
    if (!this.container || !this.buttons || !this.yesBtn || !this.noBtn || !this.prompt) return;

    // 恢复按钮位置
    this.buttons.style.display = 'flex';
    this.buttons.appendChild(this.yesBtn);
    this.buttons.appendChild(this.noBtn);
    this.container.appendChild(this.buttons);

    // 重置样式
    [this.yesBtn, this.noBtn, this.prompt].forEach(el => {
      if (el) el.style = '';
    });

    if (this.tip) {
      this.container.appendChild(this.tip);
    }
  }

  initCursorPosition(targetButton = 'no') {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile || !this.cursor) return;

    const face = document.getElementById('face');
    if (!face) return;

    const faceRect = face.getBoundingClientRect();
    const button = targetButton === 'yes' ? this.yesBtn : this.noBtn;
    const buttonRect = button.getBoundingClientRect();

    // 根据目标按钮设置光标位置
    this.cursorX = buttonRect.left + buttonRect.width / 2;
    this.cursorY = buttonRect.top + (targetButton === 'yes' ? buttonRect.height + 20 : -20);
    this.updateCursor(this.cursorX, this.cursorY);
  }

  updateCursor(x, y) {
    if (!this.cursor) return;

    const now = Date.now();
    if (now - this.lastUpdate <= 16) return;

    const bounds = {
      x: { min: 10, max: window.innerWidth - 10 },
      y: { min: 10, max: window.innerHeight - 10 }
    };

    x = Math.max(bounds.x.min, Math.min(bounds.x.max, x));
    y = Math.max(bounds.y.min, Math.min(bounds.y.max, y));

    this.cursor.style.transform = `translate(${x - 12}px, ${y - 12}px)`;
    this.lastUpdate = now;
  }
}