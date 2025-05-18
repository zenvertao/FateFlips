// facial-animation.js
export class FacialAnimation {
    constructor() {
      this.initializeElements();
    }
  
    initializeElements() {
      this.leftEyebrow = document.getElementById('leftEyebrow');
      this.rightEyebrow = document.getElementById('rightEyebrow');
      this.mouthPath = document.getElementById('mouthPath');
      this.tongue = document.getElementById('tongue');
      this.tooth = document.getElementById('tooth');
      this.tearLeft = document.getElementById('tearLeft');
      this.tearRight = document.getElementById('tearRight');
      this.leftPupil = document.getElementById('leftPupil');
      this.rightPupil = document.getElementById('rightPupil');
      this.blushLeft = document.getElementById('blushLeft');
      this.blushRight = document.getElementById('blushRight');
    }
  
    updateFacialFeatures(factor, mouseX, mouseY) {
      this.updateEyebrows(factor);
      this.updateMouth(factor);
      this.updateEyes(factor, mouseX, mouseY);
      this.updateBlush(factor);
      this.updateFaceColor(factor);
    }
  
    updateEyebrows(factor) {
      const THRESHOLDS = { start: 0.3, full: 0.15 };
      const MAX_VALUES = { inward: 18, center: 8, vertical: 5, width: 1.5 };
      const BASE = { color: 12, width: 3 };
      
      if (factor >= THRESHOLDS.start) {
        [this.leftEyebrow, this.rightEyebrow].forEach(eyebrow => eyebrow.style.display = 'none');
        return;
      }
  
      const intensity = factor < THRESHOLDS.full ? 1 : 
        Math.pow((THRESHOLDS.start - factor) / (THRESHOLDS.start - THRESHOLDS.full), 1.2);
      const opacity = factor < THRESHOLDS.full ? 1 : intensity;
      
      const shifts = {
        inward: MAX_VALUES.inward * intensity,
        center: MAX_VALUES.center * intensity,
        vertical: MAX_VALUES.vertical * intensity
      };
      
      const color = Math.max(0, BASE.color - Math.round(intensity * 30));
      const width = BASE.width + (MAX_VALUES.width * intensity);
      
      const paths = {
        left: `M50,${58 + shifts.vertical} Q${70 + shifts.inward},${65 + shifts.center + shifts.vertical} ${85 + shifts.inward/2},${65 + shifts.vertical}`,
        right: `M${148 - shifts.inward/2},${58 + shifts.vertical} Q${130 - shifts.inward},${65 + shifts.center + shifts.vertical} 117,${65 + shifts.vertical}`
      };
      
      [this.leftEyebrow, this.rightEyebrow].forEach((eyebrow, i) => {
        eyebrow.style.display = 'block';
        eyebrow.style.opacity = opacity;
        eyebrow.setAttribute('d', paths[i ? 'right' : 'left']);
        eyebrow.setAttribute('stroke', `rgb(${color},${color},${color})`);
        eyebrow.setAttribute('stroke-width', width);
      });
    }
  
    updateMouth(factor) {
      const mouthStartY = 130;
      const intensity = Math.abs(factor - 0.5) * 2;
      const baseY = mouthStartY;
      const moodOffset = 60;
      let mouthPath, startY, controlY;
  
      if (factor > 0.4) {
        controlY = baseY + (factor > 0.5 ? moodOffset : -moodOffset) * intensity;
        startY = baseY + (factor > 0.5 ? -20 : 10) * intensity;
        mouthPath = `M${60},${startY} Q${100},${controlY} ${140},${startY}`;
      } else {
        const transitionIntensity = Math.abs(factor - 0.3) * 2;
        controlY = baseY - moodOffset * transitionIntensity;
        startY = baseY + 10 * transitionIntensity;
        mouthPath = `M${60},${startY} Q${100},${controlY} ${140},${startY}`;
      }
      this.mouthPath.setAttribute('d', mouthPath);
  
      // 舌头控制
      if (factor > 0.8) {
        const tongueIntensity = (factor - 0.4) * 5.3;
        this.tongue.style.display = 'block';
        this.tongue.style.opacity = Math.max(0.3, Math.min(1, tongueIntensity));
        const tongueOffset = 25;
        const tongueStartY = startY + tongueOffset;
        const tongueControlY = controlY - tongueOffset;
        const tongueMid = 100;
        const mouthWidth = 40;
        const tongueWidthFactor = Math.min(1, (factor - 0.7) * 2);
        const tongueWidth = mouthWidth * tongueWidthFactor;
        this.tongue.setAttribute('d', `M${tongueMid - tongueWidth},${tongueStartY} Q${tongueMid},${tongueControlY} ${tongueMid + tongueWidth},${tongueStartY}`);
      } else {
        this.tongue.style.display = 'none';
      }
  
      // 门牙控制
      if (factor > 0.4) {
        const toothIntensity = (factor - 0.45) * 4;
        this.tooth.style.display = 'block';
        this.tooth.style.opacity = toothIntensity;
        this.tooth.setAttribute('d', `M85,${startY} Q100,${startY + 19} 115, ${startY}`);
      } else {
        this.tooth.style.display = 'none';
      }
    }
  
    updateEyes(factor, mouseX, mouseY) {
      const TEAR = { threshold: 0.35, maxLength: 30, baseY: 88 };
      const EYE = { baseHeight: 22, minScale: 0.3, maxMove: 5 };
      
      const rect = document.getElementById('face').getBoundingClientRect();
      const mousePos = { x: mouseX - rect.left, y: mouseY - rect.top };
      
      // 处理眼泪
      if (factor < TEAR.threshold) {
        const intensity = Math.pow(1 - factor / TEAR.threshold, 1.5);
        const heightScale = 1 - (1 - EYE.minScale) * intensity;
        const tearLength = TEAR.maxLength * Math.pow(intensity, 1.2);
        
        ['left', 'right'].forEach((side, i) => {
          const x = i ? 140 : 60;
          const clip = document.querySelector(`#${side}EyeClip ellipse`);
          clip.setAttribute('ry', EYE.baseHeight * heightScale);
          
          const tear = this[`tear${side.charAt(0).toUpperCase() + side.slice(1)}`];
          tear.style.display = 'block';
          tear.setAttribute('opacity', Math.pow(intensity, 1.2));
          tear.setAttribute('d', `M${x},${TEAR.baseY} Q${x + (i ? 1 : -1)},${TEAR.baseY + tearLength/2} ${x + (i ? -1 : 1)},${TEAR.baseY + tearLength}`);
        });
      } else {
        ['left', 'right'].forEach(side => {
          document.querySelector(`#${side}EyeClip ellipse`).setAttribute('ry', EYE.baseHeight);
          this[`tear${side.charAt(0).toUpperCase() + side.slice(1)}`].style.display = 'none';
        });
      }
      
      // 处理瞳孔
      ['left', 'right'].forEach((side, i) => {
        const pos = this.limitEyeMovement(
          i ? 140 : 60, 
          80, 
          mousePos.x, 
          mousePos.y
        );
        this[`${side}Pupil`].setAttribute('cx', pos.x);
        this[`${side}Pupil`].setAttribute('cy', pos.y);
      });
    }
  
    limitEyeMovement(centerX, centerY, mouseX, mouseY) {
      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 5);
      return { x: centerX + Math.cos(angle) * distance, y: centerY + Math.sin(angle) * distance };
    }
  
    updateBlush(factor) {
      const blushOpacity = factor > 0.5 ? (factor - 0.5) * 2 : 0;
      const blushColor = `rgba(255, 182, 193, ${blushOpacity * 0.7})`;
      this.blushLeft.setAttribute('fill', `url(#blushGradient)`);
      this.blushRight.setAttribute('fill', `url(#blushGradient)`);
      document.querySelector('#blushGradient stop').setAttribute('style', `stop-color:${blushColor}`);
      this.blushLeft.style.opacity = blushOpacity;
      this.blushRight.style.opacity = blushOpacity;
    }
  
    updateFaceColor(factor) {
      const normalTopColor = 'rgb(255, 249, 230)';
      const normalColor = 'rgb(255,255,0)';
      if (factor < 0.5) {
        const intensity = 1 - (factor / 0.5);
        const startR = 255, startG = 249, startB = 230;
        const endR = 93, endG = 255, endB = 68;
        const r = startR - (startR - endR) * intensity;
        const g = startG + (endG - startG) * intensity;
        const b = startB - (startB - endB) * intensity;
        const topColor = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
        document.getElementById('topColor').style.stopColor = topColor;
        document.getElementById('bottomColor').style.stopColor = normalColor;
        const shadowOffset = (0.5 - factor) * 4;
        document.querySelector('#shadow feOffset').setAttribute('dx', shadowOffset);
      } else {
        document.getElementById('topColor').style.stopColor = normalTopColor;
        document.getElementById('bottomColor').style.stopColor = normalColor;
        const shadowOffset = (factor - 0.5) * -4;
        document.querySelector('#shadow feOffset').setAttribute('dx', shadowOffset);
      }
    }
  }