# AI Model Chat API

A NextJs chat application that allows users to interact with AI models including Google **Gemini 2.5 Flash** and **Mistral 3.2 Small**.

## Live Demo

The application is deployed and available at: https://nextjs-ai-models-chat-api.vercel.app

## Features

- **Multi-Model Support**: Switch between Google Gemini 2.5 Flash and Mistral 3.2 Small
- **File Upload**: Support for various file types including PDFs, documents, and images
- **Context Management**: Adjustable conversation context with slider control
- **Token Tracking**: Real-time token usage monitoring
- **Responsive Design**: UI built with shadcn/ui components
- **Persistent Storage**: Conversation history saved in localStorage
- **Multi-language Support**: Website available in various translations

## Supported AI Models

#### Google Gemini 2.5 Flash

- **Model ID**: `gemini-2.5-flash`
- **File Support**: Images (JPEG, PNG, GIF, WebP), PDFs, text files, and more

#### Mistral 3.2 Small

- **Model ID**: `mistral-small-2506`
- **File Support**: Depends on upload purpose (see File Upload section)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ai-model-chat-api
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (see Environment Variables section)

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_MISTRAL_API_KEY=your_mistral_api_key_here
```

The keys could be generated on the API providers dashboard.

## Configuration

The application behavior can be customized through the `settings.ts` file:

```typescript
// Mistral API settings
export const MISTRAL_MAX_TOKENS = 100000;
export const MISTRAL_TEMPERATURE = 0.7;
export const MISTRAL_FILE_PURPOSE = "ocr"; // Options: fine-tune, batch, ocr

// Gemini API settings
export const GEMINI_MAX_TOKENS = 100000;
export const GEMINI_TEMPERATURE = 1.0; // Between 0 and 2, default is 1.0
export const GEMINI_THINKING_BUDGET = 0; // If 0, then turned off
```

### Configuration Options

#### Model-Specific Settings

- **Temperature**: Controls response randomness (0 = deterministic, higher = more creative)
- **Max Tokens**: Maximum amount of tokens that could be spent on one response.
- **Thinking Budget** (Gemini only): Controls internal reasoning process

## File Upload Support

### Technical details

Gemini supports a maximum of **1,000 document pages** per upload. Supported document types must have one of the following MIME types:

**PDF** – `application/pdf`  
**JavaScript** – `application/x-javascript`, `text/javascript`  
**Python** – `application/x-python`, `text/x-python`  
**Text** – `text/plain`  
**HTML** – `text/html`  
**CSS** – `text/css`  
**Markdown** – `text/md`  
**CSV** – `text/csv`  
**XML** – `text/xml`  
**RTF** – `text/rtf`

See more detailed description here: https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash

### Mistral 3.2 Small

File support depends on the upload purpose setting:

#### OCR Purpose (`MISTRAL_FILE_PURPOSE = "ocr"`)

- **Supported**: PDF, DOCX, PPTX, EPUB, RTF, ODT, BibTeX, EndNote, Jupyter, LaTeX, OPML, Troff, DokuWiki
- **Use Case**: Document analysis

Fallback for types: **TXT, JSON, CSV, MARKDOWN, HTML**.<br>
Emergency fallback function implemented - if file upload fails - then the text is programmatically extracted and sent as next prompt. You'll be informed with message: _[File upload failed. Emergency fallback activated: file content was extracted programmatically and sent as prompt.]_

#### Batch Purpose (`MISTRAL_FILE_PURPOSE = "batch"`)

- **Supported**: JSONL files for batch processing
- **Use Case**: Bulk text processing tasks

#### Fine-tune Purpose (`MISTRAL_FILE_PURPOSE = "fine-tune"`)

- **Supported**: JSONL files with training data
- **Use Case**: Model customization and training

## User Interface

### Design System

- **Component Library**: [shadcn/ui](https://ui.shadcn.com/) - Modern, accessible React components
- **Icons**: [Lucide Icons](https://lucide.dev/) - Beautiful, customizable SVG icons
- **Styling**: Tailwind CSS
- **Language support**: Next-Intl

## Architecture

### Project Structure

```
nextjs-ai-models-chat-api/
├── app/
│    └──[locale]/
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx.tsx
├── components/
│   ├── ContextSlider/      # Slider for context size customization
│   ├── Conversation/       # Chat message display
│   ├── HeaderBar/          # Model selector and controls
│   ├── Input/              # Message input and file upload
│   ├── LanguageSelector/   # Dropdown to select language
│   ├── RootLayout/         # Main application layout
│   └── TokenInfo/          # Token usage display
│   └── ui/...          	# folder for shadcn components
├── hooks/
│   └── useChat.ts          # Chat state management
├── i18n/                   # Translation library files
│   ├── navigation.ts
│   ├── request.ts
│   └── routing.ts
├── lib/
│   ├── constants/          # Application constants
│   └── utils/              # Utility functions
├── messages/
│   ├── en.json             # File with English translation
│   └── pl.json             # File with Polish translation
├── public/
│   └── favicon.ico
├── services/
│   ├── geminiService.ts    # Google Gemini API integration
│   └── mistralService.ts   # Mistral AI API integration
├── types/
│   └── types.ts            # TypeScript type definitions
└── settings.ts             # Configuration settings
```

### Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Translation**: Next-Intl
- **AI APIs**: Google Gemini AI, Mistral AI

## Troubleshooting

### Common Issues

1. **API Key Errors**: Verify keys are correctly set in environment variables
2. **File Upload Failures**: Check file size and format compatibility
3. **Context Issues**: Adjust context slider if responses seem disconnected
