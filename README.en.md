# FateFlips - the drama grips

<div align="center">
  <img src="logo.png" alt="FateFlips Logo">
  <p><a href="README.md">中文</a> | English</p>
</div>

## 🌐 Online Demo

**Try it now:** [https://zenvertao.github.io/FateFlips/](https://zenvertao.github.io/FateFlips/)

## 📖 Project Overview

FateFlips is a light-hearted and engaging interactive dilemma game that offers numerous real-life dilemma scenarios. Players make choices and witness amusing and unexpected outcomes that bring a smile to their faces. The game supports both Chinese and English languages and features lively animated expressions.

This project is over 90% AI-powered! The entire process from coding to content creation was completed with AI assistance. The game was inspired by an interesting tweet showcasing a Windows uninstall dialog with facial expressions that follow mouse movements. What started as a curious attempt to recreate this simple animation effect with AI gradually evolved into this entertaining AI-interactive mini-game.

Due to limited personal time and resources, the code still has significant room for optimization.
Currently, this serves primarily as a personal technology exploration project, focusing on experimenting with the latest ES standard features, thus it's only compatible with modern browsers.

If you have better creative ideas or discover bugs, feel free to submit a PR to help improve the project!

## ✨ Key Features

- **Bilingual Support**: Full support for Chinese-English switching, with translations for all content
- **AI-Generated Content**: Support for generating new prompts through various AI models (ChatGPT, Claude, DeepSeek, etc.)
- **Facial Expressions**: Lively expression feedback enhances game interactivity and fun
- **Local Storage**: Automatically saves settings and generated prompt content, no need for repeated configuration
- **Responsive Design**: Adapts to various device sizes, including mobile touch support
- **Lightweight**: No complex dependencies, loads quickly, ready to play instantly

## 📁 Project Structure

```
├── index.html          # Main page
├── styles/             # Style files
│   ├── main.css        # Main styles
│   ├── animations.css  # Animation styles
│   ├── components.css  # Component styles
│   ├── responsive.css  # Responsive styles
│   └── settings.css    # Settings page styles
├── src/                # Source code
│   ├── index.js        # Entry file
│   ├── modules/        # Function modules
│   │   ├── ai-models.js       # AI model configuration
│   │   ├── ai-prompts.js      # AI prompt request module
│   │   ├── app.js             # Application core logic
│   │   ├── base.js            # Base classes
│   │   ├── default.js         # Default prompt data
│   │   ├── emoji-animation.js # Emoji animations
│   │   ├── facial-animation.js# Facial expression animations
│   │   ├── i18n.js            # Internationalization module
│   │   ├── mobile-adapter.js  # Mobile adaptation
│   │   ├── prompts.js         # Prompt management
│   │   ├── reaction-manager.js# Reaction management
│   │   └── settings.js        # Settings management
│   ├── locales/        # Language files
│   │   ├── en.json     # English translations
│   │   └── zh.json     # Chinese translations
│   ├── utils/          # Utility functions
│   │   └── utils.js    # Common utilities
│   └── vendor/         # Third-party libraries
│       └── i18next.min.js # Internationalization library
└── mock/               # Mock data
    ├── data.json       # Mock data
    └── mock_ai_api.py  # Mock AI API service
```

## 🚀 User Guide

### Basic Usage

1. Open the game page
2. Read the displayed dilemma question
3. Click the "Yes" or "No" button to make your choice
4. Watch the interesting reaction results and facial animations
5. Automatically load the next question

### AI Content Settings

1. Click the "AI" button in the top right corner to open settings
2. Select the AI model you want to use
3. Enter the corresponding API key and API endpoint
4. Click the "Save" button
5. Click the "Get New Prompts" button to generate new content

## 🔧 Developer Guide

### Local Setup

```bash
# Clone repository
git clone https://github.com/zenvertao/FateFlips.git
cd FateFlips

# Run using any HTTP server
python -m http.server
# Or
npx serve
```

### Mock API Service
For convenient local development and testing, the project provides a Python mock API server:
```bash
# Install dependencies
cd mock
pip install flask flask-cors

# Start the mock server
python mock_ai_api.py --port 8000
```
After starting the service, you can change the API endpoint to `http://localhost:8000` in the game settings for testing, without needing a real API key.

### Adding New AI Models

Add new model configurations in `src/modules/ai-models.js`:

```javascript
const AI_MODELS = {
  // Add new model
  'new-model': {
    headers: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
      // Other necessary header information
    }),
    requestFormat: {
      // Request format configuration
    }
  }
};
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

---

<div align="center">
  <p>Made with ❤️ by ZenverTao</p>
</div>