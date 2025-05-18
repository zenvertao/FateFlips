// app.js
import { FacialAnimation } from './facial-animation.js';
import { EmojiAnimation } from './emoji-animation.js';
import { ReactionManager } from './reaction-manager.js';
import { MobileAdapter } from './mobile-adapter.js';
import { getDistanceToButton, isPointInRect } from '../utils/utils.js';

export class App {
  static instance = null;

  static getInstance() {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  constructor() {
    this.facialAnimation = new FacialAnimation();
    this.emojiAnimation = new EmojiAnimation();
    this.reactionManager = new ReactionManager();
    this.mobileAdapter = new MobileAdapter();
    this.isDragging = false;
    this.state = {
      isHovering: false,
      yesHovering: false,
      noHovering: false
    };
    this.isMobile = window.innerWidth <= 768;
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');

    // 抽取按钮事件处理逻辑
    const handleButtonEvents = (button, type) => {
      const emojiType = type === 'yes' ? 'happy' : 'sad';
      const stateKey = `${type}Hovering`;

      if (!this.isMobile) {
        button.addEventListener('mouseenter', () => {
          this.state.isHovering = true;
          this.startEmojiAnimation(button, emojiType);
        });

        button.addEventListener('mouseleave', () => {
          this.state.isHovering = false;
          this.stopEmojiAnimation();
        });
      }

      button.addEventListener('click', async () => {
        if (this.reactionManager.isShowingReaction) return;
        this.emojiAnimation.clearAllEmojiAnimations();
        await this.reactionManager.showReaction(type);
      });
    };

    // 初始化按钮事件
    handleButtonEvents(yesBtn, 'yes');
    handleButtonEvents(noBtn, 'no');

    // 根据设备类型绑定事件
    if (!this.isMobile) {
      document.addEventListener('mousemove', (event) => {
        this.handleEmotionChange(event.clientX, event.clientY);
      });
    } else {
      this.initializeTouchEvents(yesBtn, noBtn);
    }

    window.addEventListener('resize', () => {
      location.reload();
    });
  }

  // 抽取表情动画相关方法
  startEmojiAnimation(button, emojiType) {
    this.emojiAnimation.cleanupFunctions.forEach(cleanup => cleanup());
    this.emojiAnimation.cleanupFunctions = [];

    this.emojiAnimation.emojiInterval = setInterval(() => {
      this.emojiAnimation.cleanupFunctions.push(
        this.emojiAnimation.popEmoji(button, emojiType)
      );
    }, 150);
  }

  stopEmojiAnimation() {
    clearInterval(this.emojiAnimation.emojiInterval);
  }

  // 抽取触摸事件处理逻辑
  initializeTouchEvents(yesBtn, noBtn) {
    document.addEventListener('touchstart', (e) => {
      if (this.reactionManager.isShowingReaction) return;

      const touch = e.touches[0];
      this.isDragging = true;
      this.mobileAdapter.updateCursor(touch.clientX, touch.clientY);
      this.mobileAdapter.tip.style.display = 'none';
      this.mobileAdapter.cursor.style.opacity = '1';

      this.handleEmotionChange(touch.clientX, touch.clientY);
    });

    document.addEventListener('touchmove', (e) => {
      if (!this.isDragging || this.reactionManager.isShowingReaction) return;

      const touch = e.touches[0];
      e.preventDefault();
      this.mobileAdapter.updateCursor(touch.clientX, touch.clientY);
      this.handleEmotionChange(touch.clientX, touch.clientY);

      this.handleTouchMoveEffects(touch, yesBtn, noBtn);
    }, { passive: false });

    document.addEventListener('touchend', async (e) => {
      if (!this.isDragging || this.reactionManager.isShowingReaction) {
        this.isDragging = false;
        return;
      }

      const lastTouch = e.changedTouches[0];
      this.cleanupTouchEffects(noBtn);
      this.emojiAnimation.clearAllEmojiAnimations();
      this.isDragging = false;

      await this.handleTouchEnd(lastTouch, yesBtn, noBtn);
    });
  }

  // 处理触摸移动效果
  handleTouchMoveEffects(touch, yesBtn, noBtn) {
    const yesBtnRect = yesBtn.getBoundingClientRect();
    const noBtnRect = noBtn.getBoundingClientRect();

    // 处理 no 按钮的 shake 效果
    if (isPointInRect(touch.clientX, touch.clientY, noBtnRect)) {
      this.handleNoButtonHover(noBtn);
    } else {
      this.handleNoButtonLeave(noBtn);
    }

    // 处理 yes 按钮的表情动画
    if (isPointInRect(touch.clientX, touch.clientY, yesBtnRect)) {
      this.handleYesButtonHover(yesBtn);
    } else {
      this.handleYesButtonLeave();
    }
  }

  handleEmotionChange(x, y) {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const yesBtnRect = yesBtn.getBoundingClientRect();
    const noBtnRect = noBtn.getBoundingClientRect();

    const distToYesBtn = getDistanceToButton(x, y, yesBtnRect);
    const distToNoBtn = getDistanceToButton(x, y, noBtnRect);

    const isMobile = window.innerWidth <= 768;
    const maxDist = isMobile ?
      Math.min(window.innerWidth, window.innerHeight) * 0.45 :
      Math.min(window.innerWidth, window.innerHeight) * 0.35;

    const normYesDist = Math.min(distToYesBtn / maxDist, 1);
    const normNoDist = Math.min(distToNoBtn / maxDist, 1);

    let factor;

    if (isPointInRect(x, y, yesBtnRect)) {
      factor = 1.0;
    } else if (isPointInRect(x, y, noBtnRect)) {
      factor = 0;
    } else if (distToYesBtn < distToNoBtn) {
      const intensity = isMobile ? 0.65 : 0.6;
      factor = 0.5 + (intensity * Math.pow(1 - normYesDist, 2));
    } else {
      const intensity = isMobile ? 0.65 : 0.6;
      const calculatedFactor = 0.5 - (intensity * Math.pow(1 - normNoDist, 2));
      factor = Math.max(0, calculatedFactor);
    }

    factor = Math.max(0, Math.min(1, factor));
    this.facialAnimation.updateFacialFeatures(factor, x, y);
  }

  // 处理 no 按钮的 hover 效果
  handleNoButtonHover(noBtn) {
    noBtn.classList.add('shake');
    noBtn.style.animation = 'panicShake 0.15s infinite';

    if (!this.state.isHovering) {
      this.state.isHovering = true;
      this.startEmojiAnimation(noBtn, 'sad');
    }
  }

  // 处理 no 按钮的离开效果
  handleNoButtonLeave(noBtn) {
    noBtn.classList.remove('shake');
    noBtn.style.animation = '';

    if (this.state.isHovering) {
      this.state.isHovering = false;
      this.stopEmojiAnimation();
    }
  }

  // 处理 yes 按钮的 hover 效果
  handleYesButtonHover(yesBtn) {
    if (!this.state.yesHovering) {
      this.state.yesHovering = true;
      this.startEmojiAnimation(yesBtn, 'happy');
    }
  }

  // 处理 yes 按钮的离开效果
  handleYesButtonLeave() {
    if (this.state.yesHovering) {
      this.state.yesHovering = false;
      this.stopEmojiAnimation();
    }
  }

  // 清理触摸效果
  cleanupTouchEffects(noBtn) {
    noBtn.classList.remove('shake');
    noBtn.style.animation = '';
  }

  // 处理触摸结束事件
  async handleTouchEnd(lastTouch, yesBtn, noBtn) {
    const yesBtnRect = yesBtn.getBoundingClientRect();
    const noBtnRect = noBtn.getBoundingClientRect();

    if (isPointInRect(lastTouch.clientX, lastTouch.clientY, yesBtnRect)) {
      await this.reactionManager.showReaction('yes');
      this.mobileAdapter.initCursorPosition('yes');
    } else if (isPointInRect(lastTouch.clientX, lastTouch.clientY, noBtnRect)) {
      await this.reactionManager.showReaction('no');
      this.mobileAdapter.initCursorPosition('no');
    }
  }
}