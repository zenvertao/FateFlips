// utils.js
export function getDistanceToButton(x, y, btnRect) {
    if (x >= btnRect.left && x <= btnRect.right &&
      y >= btnRect.top && y <= btnRect.bottom) {
      return 0;
    }
  
    const distToLeft = x < btnRect.left ? btnRect.left - x : 0;
    const distToRight = x > btnRect.right ? x - btnRect.right : 0;
    const distToTop = y < btnRect.top ? btnRect.top - y : 0;
    const distToBottom = y > btnRect.bottom ? y - btnRect.bottom : 0;
  
    return Math.sqrt(
      Math.pow(Math.max(distToLeft, distToRight), 2) +
      Math.pow(Math.max(distToTop, distToBottom), 2)
    );
  }
  
  export function isPointInRect(x, y, rect) {
    return x >= rect.left && x <= rect.right &&
      y >= rect.top && y <= rect.bottom;
  }
  
  export function isValidUrl(str) {
    try {
      new URL(str);
      return true;
    } catch {
      return str.startsWith('https://') || str.startsWith('http://');
    }
  }