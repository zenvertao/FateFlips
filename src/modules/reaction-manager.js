// reaction-manager.js
import { getText } from './i18n.js';
import { loadNextPrompt } from './prompts.js';
import { isValidUrl } from '../utils/utils.js';

export class ReactionManager {
  constructor() {
    this.isShowingReaction = false;
    this.timeout = null;
    this.initializeElements();
  }

  initializeElements() {
    const elements = {
      alertBox: 'global-alert',
      alertProgress: 'global-alert-progress',
      yesBtn: 'yesBtn',
      noBtn: 'noBtn',
      yesMessage: 'global-alert-message-yes',
      noMessage: 'global-alert-message-no'
    };

    Object.entries(elements).forEach(([key, id]) => {
      this[key] = document.getElementById(id);
    });

    this.closeBtn = this.alertBox.querySelector('.close-btn');
  }

  async showReaction(type) {
    if (this.isShowingReaction) return;
    
    this.isShowingReaction = true;
    this.disableButtons();

    const messageKey = `prompt.${type}Reaction`;
    const message = getText(messageKey);

    if (isValidUrl(message)) {
      await this.handleUrlReaction(message);
      return;
    }

    await this.showMessageReaction(type, message);
  }

  async handleUrlReaction(url) {
    const confirmVisit = confirm(`${getText('leaveWarning')} ${url}`);
    this.resetState();
    await loadNextPrompt();

    if (confirmVisit) {
      window.open(url, '_blank');
    }
  }

  async showMessageReaction(type, message) {
    const duration = (getText('prompt.readTime') || 2) * 1000;
    
    this.updateMessageDisplay(type, message);
    this.startProgressAnimation(duration);
    this.setupTimeout(duration);
    this.setupCloseButton();
  }

  updateMessageDisplay(type, message) {
    const isYes = type === 'yes';
    this.yesMessage.style.display = isYes ? 'block' : 'none';
    this.noMessage.style.display = isYes ? 'none' : 'block';
    this[`${type}Message`].textContent = message;
    
    this.alertBox.className = `custom-alert ${isYes ? 'alert-success' : 'alert-danger'}`;
    this.alertBox.style.display = 'block';
  }

  startProgressAnimation(duration) {
    this.alertProgress.style.animation = 'none';
    void this.alertProgress.offsetWidth; // 触发重排
    this.alertProgress.style.animation = 'progress linear';
    this.alertProgress.style.animationDuration = `${duration}ms`;
  }

  setupTimeout(duration) {
    this.timeout = setTimeout(() => {
      this.resetState();
      loadNextPrompt();
    }, duration);
  }

  setupCloseButton() {
    this.closeBtn.onclick = () => {
      clearTimeout(this.timeout);
      this.resetState();
      loadNextPrompt();
    };
  }

  disableButtons() {
    [this.yesBtn, this.noBtn].forEach(btn => btn.classList.add('button-disabled'));
  }

  resetState() {
    this.alertBox.style.display = 'none';
    [this.yesBtn, this.noBtn].forEach(btn => btn.classList.remove('button-disabled'));
    this.isShowingReaction = false;
  }
}