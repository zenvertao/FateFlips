// AI提示请求模块
import { AI_MODELS } from './ai-models.js';

/**
 * 检查网络连接状态
 * @returns {Promise<boolean>} 网络是否连接
 */
function checkNetworkConnection() {
  return navigator.onLine
}

/**
 * 同时获取中英文提示数据，确保中英文提示一一对应
 * @param {string} apiKey - API密钥
 * @param {string} apiUrl - API端点URL
 * @param {string} model - 模型名称
 * @returns {Promise<Object>} - 返回包含中英文提示的对象
 */
async function fetchBilingualPrompts(apiKey, apiUrl, model, history = []) {
  try {
    // 检查API参数是否完整
    if (!apiKey || !apiUrl || !model) {
      console.error('API参数不完整:', { apiKey: !!apiKey, apiUrl: !!apiUrl, model: !!model });
      throw new Error('API参数不完整，请检查设置');
    }

    // 使用单一请求获取双语提示，确保中英文提示一一对应
    const systemPrompt = `你是一个专门为互动类游戏设计双语提示内容的创意专家。
    你擅长写出让人发笑（有趣）、产生共鸣（现实中容易遇到）、充满想象力（有创意）的日常两难选择题。
    主题可涉及但不限于以下罗列的：
    家庭生活、工作、学习、娱乐、婚恋、社交、环保、教育、健康、科技、养老、美食、宠物、旅行、
    经济、文化、育儿、心理、未来科技等所有合理场景。

    规则要求：
    - 只返回纯 JSON 数组，不包含代码块、注释、前后缀、说明等；
    - 每组提示由两行组成，第一行为英文，第二行为对应的中文翻译；
    - 每行包含六项：[问题、肯定按钮、否定按钮、肯定反应、否定反应、阅读时间]；
    - 中英文阅读时间应分别评估，中文阅读时间基于中文内容长度，英文阅读时间基于英文内容长度；
    - 中文阅读时间基准：3~6秒（15字约3秒，每增减5字±1秒）；
    - 英文阅读时间基准：3~9秒（20词约5秒，每增减5词±1秒）；
    - 问题应尽量简洁明了避免冗长，确保玩家能快速理解并做出选择；
    - 问题尽量一整句话，能一眼阅读完，避免逗号打断；
    - 必须先生成简体中文版内容且中英文语义必须一致，英文版由中文翻译而来严禁单独创作；
    - 所有内容必须贴近日常工作、娱乐、生活等场景，让玩家容易产生共鸣，同时保持创意和幽默感；
    - 所有内容不能出现重复、模板化或含糊不清，所有问题必须有唯一是否两种答案；
    - 按钮需简洁有力，反应中可以使用表情，反应内容为意想不到但又合理的后果，要让玩家看完会心一笑。

    风格要求：
    - 所有问题使用轻松调侃的口吻；
    - 不使用严肃、书面或道德化语言；
    - 风格严格参考历史提问，所有生成内容应看起来像是“同一个有趣的人”写出来的！

    你的目标是生成高质量、富有一致风格和创意的双语互动提示内容。`;

    const historyQuestions = history?.map(item => `- ${item[1][0]}`).join('\n') || '';

    const userPrompt = `请根据以下要求生成 5 组符合结构规范、风格一致且内容不重复的双语互动提示：
    以下是你过去生成的中文问题，严禁生成与这些问题重复或过于相似的内容（包括语义和设定）：
    
    ${historyQuestions}

    再提供两套参考示例(仅供参考，严禁重复）：
    示例1:
      问题: 在电梯里放屁后假装是别人？
      肯定按钮: 栽赃给同事
      否定按钮: 坦然承认
      肯定反应: 👃 全公司都知道是谁了
      否定反应: 🧎 获得‘诚实但臭’奖
    示例2:
      问题: 在会议中假装听懂老板的术语？
      肯定按钮: 点头如捣蒜
      否定按钮: 举手问蠢问题
      肯定反应: 🤓 被点名解释时当场露馅
      否定反应: 👏 全办公室感谢你的勇敢    
      
    现在，请你生成 5 组符合以下格式的双语互动提示 JSON 数组：（必须严格遵循！）
    [
      [
        ["English Question", "English Yes Button", "English No Button", "English Yes Reaction", "English No Reaction", ReadingTime],
        ["简体中文问题", "中文肯定按钮", "中文否定按钮", "中文肯定反应", "中文否定反应", 阅读时间]
      ],
      [...第二组...],
      [...第三组...]
    ]

    注意：
    - 只能返回纯 JSON 数组，严禁添加代码块标记、注释或说明文字
    - 即使数据经过调整也仅返回最后 JSON 结果，严禁在内容中展示过程或描述
    - 保证创意新颖、内容幽默，中文问题严禁与上面列出的历史问题重复或相似
    - 英文问题必须根据中文问题进行合理翻译，英文翻译必须遵循 JSON 标准，严禁输出非法格式
    - 确保问题内容贴近日常工作、娱乐或生活等场景，让玩家感到熟悉且容易产生共鸣
    - 简体中文问题控制在 15-20 字以内，英文问题控制在 20-25 词以内（实在不能满足时可适当放宽）
    - 问题应简洁明了，避免冗长，确保玩家能迅速理解并做出选择！例如：“确认删除当前应用吗？” 或 “爱看喜剧还是动作片？” 这样的问题既简洁又贴近生活`;

    // 构建请求参数
    let requestData;
    let headers = {
      'Content-Type': 'application/json',
    };

    let runtimeModel = AI_MODELS[model];
    if (!runtimeModel) {
      console.error(`不支持的模型: ${model}`);
      throw new Error(`不支持的模型: ${model}`);
    }

    // 统一配置加载
    Object.assign(headers, runtimeModel.headers(apiKey));
    requestData = {
      ...runtimeModel.requestFormat,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 3000,
      stream: false
    };

    // 先检查网络连接
    const isNetworkConnected = await checkNetworkConnection();
    if (!isNetworkConnected) {
      throw new Error('网络连接不可用');
    }

    console.log('开始发送API请求...');
    // 发送请求
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert(`API请求失败: ${response.status}\n${errorText}`);
      throw new Error(`API请求失败: ${response.status} ${errorText}`);
    }

    console.log('API请求成功，正在等待响应...');
    const data = await response.json();

    // 解析不同API的响应格式
    let content = '';
    switch (model) {
      case 'chatgpt':
        content = data.choices[0].message.content;
        break;
      case 'claude':
        content = data.content[0].text;
        break;
      case 'deepseek':
        content = data.choices[0].message.content;
        break;
      default:
        console.error(`不支持的模型: ${model}`);
        throw new Error(`不支持的模型: ${model}`);
    }

    try {
      // 尝试提取 JSON 数组
      const jsonRegex = /\[\s*\[.*\]\s*\]/s;
      const jsonMatch = content.match(jsonRegex);
      if (jsonMatch) {
        const bilingualPrompts = JSON.parse(jsonMatch[0]);
        console.log(`成功解析双语提示: ${bilingualPrompts.length}个`);
        return bilingualPrompts;
      }

      // 尝试直接解析整个内容
      const parsedData = JSON.parse(content);
      return parsedData;
    } catch (parseError) {
      alert(`数据解析失败: ${parseError}`);
      console.error('数据解析失败:', parseError, '\n原始内容:', content);
      return [];
    }
  } catch (error) {
    alert(`获取 AI 提示数据失败: ${error}`);
    // 静默失败，返回空数组
    return [];
  }
}

export { fetchBilingualPrompts };