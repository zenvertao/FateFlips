// 基础提示数据类
export default class BasePrompts {
  // 提示数据的头部字段
  static headers = ["question", "yes", "no", "yesReaction", "noReaction", "readTime"];

  // 支持的语言列表
  static languages = ["en", "zh"];

  constructor(data = []) {
    this.data = data;
    this.shuffledQueue = [];
    this.lastQuestion = null;  // 存储上一轮最后一个问题的中文文本
  }

  get length() {
    return this.data.length;
  }

  get formatedData() {
    return this.transform();
  }

  dedupe() {
    this.data = this.getDedupeData();
    return this;
  }

  getDedupeData(data = this.data) {
    const seen = new Set();
    return data.filter(item => {
      // 获取中文问题
      const zhQuestion = item[1][0];
      if (seen.has(zhQuestion)) return false;
      seen.add(zhQuestion);
      return true;
    });
  }
  
  // 洗牌方法
  shuffle() {
    this.shuffledQueue = [...this.data];
    for (let i = this.shuffledQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffledQueue[i], this.shuffledQueue[j]] = [this.shuffledQueue[j], this.shuffledQueue[i]];
    }

    // 检查新队列第一个元素的中文问题是否与上一轮最后一个相同
    const firstQuestion = this.shuffledQueue[0][1][0];
    if (this.lastQuestion && firstQuestion === this.lastQuestion) {
      this.shuffle();
    }
    
    // 更新 lastQuestion 为这一轮最后一个元素的中文问题
    this.lastQuestion = this.shuffledQueue[this.shuffledQueue.length - 1][1][0];
    return this;
  }

  needReShuffle() {
    return this.shuffledQueue.length === 0;
  }

  // 获取随机原始数据
  getRandomRawItem() {
    if (this.needReShuffle()) {
      return null;
    }
    return this.shuffledQueue.shift();
  }

  // 转换单个数据项
  transformItem(rawItem) {
    if (!rawItem) return null;
    
    const result = {};
    BasePrompts.languages.forEach((lang, index) => {
      result[lang] = {};
      BasePrompts.headers.forEach((header, headerIndex) => {
        if (header !== 'readTime' || headerIndex === BasePrompts.headers.length - 1) {
          result[lang][header] = rawItem[index][headerIndex];
        }
      });
    });
    return result;
  }

  // 获取随机格式化数据（便捷方法）
  getRandomItem() {
    const rawItem = this.getRandomRawItem();
    if (!rawItem) return null;
    return this.transformItem(rawItem);
  }  

  // 转换数据为按语言分组的对象数组
  transform(data = this.data) {
    // 如果数据已经是转换后的格式，直接返回
    if (data.length > 0 && data[0].zh && data[0].en) {
      return data;
    }

    return data.map(item => {
      return this.transformItem(item);
    });
  }
}