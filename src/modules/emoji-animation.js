// emoji-animation.js
export class EmojiAnimation {
    constructor() {
      this.emojis = {
        happy: ['😄', '🩷', '🎉', '🌟', '👍'],
        sad: ['💀', '💣', '😢', '😭', '👎']
      };
      this.emojiInterval = null;
      this.cleanupFunctions = [];
    }
  
    popEmoji(button, type) {
      const isMobile = window.innerWidth <= 768;
      const { startX, startY } = this.getStartPosition(button, isMobile);
      const emoji = this.createEmojiElement(startX, startY, isMobile, type);
      const animation = this.createAnimation(emoji, isMobile);
      
      requestAnimationFrame(animation.animate);
      return animation.cleanup;
    }
  
    getStartPosition(button, isMobile) {
      if (isMobile) {
        const faceRect = document.getElementById('face').getBoundingClientRect();
        return {
          startX: faceRect.left + faceRect.width / 2,
          startY: faceRect.top + 100
        };
      }
      const rect = button.getBoundingClientRect();
      return {
        startX: rect.left + rect.width / 2,
        startY: rect.top
      };
    }
  
    createEmojiElement(startX, startY, isMobile, type) {
      const emoji = document.createElement('div');
      emoji.classList.add('emoji', isMobile && 'mobile-emoji');
      emoji.textContent = this.emojis[type][Math.floor(Math.random() * this.emojis[type].length)];
      emoji.style.cssText = `left:${startX}px;top:${startY}px;opacity:0`;
      
      (isMobile ? document.body : document.getElementById('emojiContainer')).appendChild(emoji);
      return emoji;
    }
  
    createAnimation(emoji, isMobile) {
      const config = {
        gravity: isMobile ? 0.12 + Math.random() * 0.08 : 0.15 + Math.random() * 0.1,
        velocityY: isMobile ? -(3 + Math.random() * 2) : -(4 + Math.random() * 3),
        velocityX: isMobile ? (Math.random() - 0.5) * 3 : (Math.random() - 0.5) * 5,
        rotationSpeed: isMobile ? (Math.random() - 0.5) * 5 : (Math.random() - 0.5) * 8,
        maxHeight: isMobile ? 50 + Math.random() * 20 : 100 + Math.random() * 40,
        duration: isMobile ? 500 + Math.random() * 300 : 900 + Math.random() * 300
      };
  
      let state = {
        velocityY: config.velocityY,
        velocityX: config.velocityX,
        posX: 0,
        posY: 0,
        rotation: 0,
        scale: 0.8,
        opacity: 0,
        animationFrame: null
      };
  
      const startTime = performance.now();
  
      const animate = (timestamp) => {
        const progress = Math.min((timestamp - startTime) / config.duration, 1);
        const { scale, opacity } = this.calculateScaleAndOpacity(progress);
  
        state.velocityY += config.gravity;
        state.posY += state.velocityY;
        state.posX += state.velocityX;
  
        if (state.posY < -config.maxHeight) {
          state.posY = -config.maxHeight;
          state.velocityY = Math.abs(state.velocityY) * 0.6;
        }
  
        state.rotation += config.rotationSpeed;
        this.updateEmojiStyle(emoji, state, scale, opacity);
  
        if (progress < 1) {
          state.animationFrame = requestAnimationFrame(animate);
        } else {
          emoji.remove();
        }
      };
  
      return {
        animate,
        cleanup: () => {
          if (state.animationFrame) {
            cancelAnimationFrame(state.animationFrame);
          }
          emoji.remove();
        }
      };
    }
  
    calculateScaleAndOpacity(progress) {
      if (progress < 0.1) {
        return {
          opacity: progress * 10,
          scale: 0.5 + progress * 5
        };
      }
      if (progress > 0.7) {
        return {
          opacity: 1 - ((progress - 0.7) / 0.3),
          scale: 1 - ((progress - 0.7) / 0.3) * 0.5
        };
      }
      return { opacity: 1, scale: 1 };
    }
  
    updateEmojiStyle(emoji, state, scale, opacity) {
      emoji.style.transform = `translate(${state.posX}px, ${state.posY}px) rotate(${state.rotation}deg) scale(${scale})`;
      emoji.style.opacity = opacity.toString();
    }
  
    clearAllEmojiAnimations() {
      if (this.emojiInterval) {
        clearInterval(this.emojiInterval);
        this.emojiInterval = null;
      }
      
      this.cleanupFunctions.forEach(cleanup => cleanup());
      this.cleanupFunctions = [];
  
      const containers = [
        document.getElementById('emojiContainer'),
        ...document.querySelectorAll('.mobile-emoji')
      ];
      
      containers.forEach(container => {
        if (container) {
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
        }
      });
    }
  }