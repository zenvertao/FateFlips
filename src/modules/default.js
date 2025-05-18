import BasePrompts from './base.js';

// 导出提示数据
// 数据结构：二维数组 [ [英文提示, 中文提示], ... ]
// 每个提示格式：[question, yes, no, yesReaction, noReaction, readTime]
export const data = [
  [
      [
          "Delete all system32 files?",
          "I'm Feeling Lucky",
          "Call IT Support",
          "🖥️ Blue screen incoming... (3...2...1) lol lol",
          "👨💻 Sysadmin drafting termination...",
          4
      ],
      [
          "确认删除系统32文件？",
          "手气不错",
          "呼叫IT支持",
          "🖥️ 蓝屏即将来袭... (3...2...1) 哈哈哈哈",
          "👨💻 系统管理员正在起草解雇信...",
          3
      ]
  ],
  [
      [
          "Post childhood photo?",
          "YOLO",
          "Burn Evidence",
          "👶 Going viral in 3...2...1...",
          "🔥 Fire department alerted...",
          3
      ],
      [
          "发布童年照片？",
          "及时行乐",
          "销毁证据",
          "👶 即将走红 3...2...1...",
          "🔥 消防部门已收到警报...",
          2.5
      ]
  ],
  [
      [
          "Empty recycle bin?",
          "Shred Now (Irreversible)",
          "Misclicked",
          "🗑️ Permanently deleting 3.7TB of study materials...",
          "💾 You saved 3 years worth of collected content",
          4
      ],
      [
          "确认要清空回收站？",
          "立刻粉碎（无法恢复）",
          "我手滑了",
          "🗑️ 正在永久删除3.7TB学习资料...",
          "💾 您拯救了价值3年的收藏内容",
          3.2
      ]
  ],
  [
      [
          "Found hidden ending! Visit author's page?",
          "Teleport Now",
          "Continue Game",
          "https://zenver.vercel.app",
          "https://zenver.vercel.app",
          1
      ],
      [
          "发现隐藏结局！查看作者主页？",
          "立刻传送",
          "继续游戏",
          "https://zenver.vercel.app",
          "https://zenver.vercel.app",
          1
      ]
  ],
  [
      [
          "Reply 'ok' to your boss's long email?",
          "Send & Regret",
          "Type Properly",
          "💥 Career suicide speedrun complete!",
          "📈 Promotion incoming (maybe)",
          4.5
      ],
      [
          "用'哦'回复老板的长邮件？",
          "发送并后悔",
          "好好打字",
          "💥 职业自杀速通成就达成！",
          "📈 升职在望（大概）",
          3.5
      ]
  ],
  [
      [
          "Wear pajamas to video meeting?",
          "Home Comfort",
          "Button Up",
          "🎥 Muted but judging",
          "👔 Colleagues taking notes",
          3.7
      ],
      [
          "视频会议穿睡衣？",
          "居家舒适",
          "正经点",
          "🎥 静音但被默默打分",
          "👔 同事正在做笔记",
          3
      ]
  ],
  [
      [
          "Pretend to be a tech expert when your printer jams?",
          "Blame the WiFi",
          "Call IT crying",
          "🖨️ Colleagues bring you all their broken devices",
          "👨‍💻 IT guy knows your secret shame",
          3.7
      ],
      [
          "打印机卡纸时装成技术专家？",
          "怪罪WiFi",
          "哭着找IT部",
          "🖨️ 同事把所有坏设备都交给你修",
          "👨‍💻 IT小哥看穿你的伪装",
          3
      ]
  ],
  [
      [
          "Order spicy food before important client meeting?",
          "Extra chili oil!",
          "Plain congee ",
          "🔥 Slideshow becomes fire hazard ",
          "🍚 Client thinks you're boring but safe ",
          4
      ],
      [
          "见重要客户前吃超辣火锅？",
          "加双倍辣油！",
          "喝白粥保平安 ",
          "🔥 PPT演示变成消防演习 ",
          "🍚客户觉得你无趣但可靠 ",
          3
      ]
  ],
  [
      [
          "Use autocorrect as an excuse for sending weird texts?",
          "Blame the AI",
          "Own your typo",
          "🤖 Friends screenshot your 'ducking phone'",
          "😇  Earn 'typo confessor' badge",
          4
      ],
      [
          "把打字错误全怪罪于自动校正？",
          "让AI背锅",
          "承认手滑",
          "🤖 朋友截图你的‘该死的手机’发群聊",
          "😇 获得‘错别字坦白者’称号",
          3
      ]
  ],
  [
      [
          "Want to unlock more features?",
          "Mystery Link",
          "I'm Strong-willed",
          "https://zenver.vercel.app",
          "🧘 You successfully resisted internet temptation",
          4
      ],
      [
          "想要解锁更多玩法吗？",
          "神秘链接",
          "我定力很强",
          "https://zenver.vercel.app",
          "🧘 你成功抵御了互联网诱惑",
          3
      ]
  ],
  [
      [
          "Are you sure you want to uninstall?",
          "Keep",
          "Uninstall",
          "🎮 Wise choice! Your gaming journey continues...",
          "🗑️ Uninstallation complete. We'll miss you!",
          4
      ],
      [
          "确定要卸载吗？",
          "保留",
          "卸载",
          "🎮 明智的选择！您的游戏之旅继续...",
          "🗑️ 卸载完成。我们会想念您的！",
          3
      ]
  ],
];

// 创建提示数据类
export class DefaultPrompts extends BasePrompts {
  constructor() {
    super();
    this.data = data;
  }
}

// 默认导出
export default new DefaultPrompts();