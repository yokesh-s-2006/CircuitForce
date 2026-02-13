# FloraSoul - Emotional Support Plant Companion 🌿💚

An intelligent environmental companion with real-time sensor monitoring and emotional support features, featuring Flora, your compassionate AI plant.

## Features

- **Real-time Sensor Monitoring**: Track air quality, soil moisture, temperature, humidity, and more
- **Emotional Intelligence**: Flora responds to environmental conditions with different moods and supportive messages
- **Interactive Dashboard**: Beautiful, responsive UI with real-time data visualization using Recharts
- **Soul Sessions**: Text and voice-based emotional support conversations
- **AI-Powered Insights**: Google Gemini API integration for intelligent plant analysis
- **Camera Health Scan**: Capture and analyze plant images for comprehensive health assessment

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI Integration**: Google Generative AI (Gemini)

## Installation

1. Clone or extract the project to your local machine
2. Install dependencies:
```bash
npm install
```

## Configuration

### Setting up Google Generative AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Create a `.env.local` file in the project root:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

## Development

Start the development server:
```bash
npm run dev
```

The app will open automatically at `http://localhost:5173/`

## Building for Production

Build the optimized production bundle:
```bash
npm run build
```

The build output will be in the `dist/` directory.

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
.
├── app.tsx                 # Main App component with Dashboard
├── index.tsx              # React entry point
├── index.html             # HTML template
├── types.ts               # TypeScript type definitions
├── constants.ts           # App constants and configurations
├── metadata.json          # App metadata
├── components/
│   ├── sensorcard.tsx     # Sensor data display card
│   ├── plantvisual.tsx    # Plant visual representation
│   └── soulsession.tsx    # Soul Session interaction component
├── services/
│   └── geminiservice.ts   # Google Gemini AI integration
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── dist/                  # Production build output
```

## How to Use

### Dashboard Tab
- View real-time sensor readings
- See Flora's emotional state based on environmental conditions
- Use **HEALTH SCAN** button to analyze plant images
- **TUNE IN** to get AI-powered insights about your plant's environment

### Soul Session Tab
- **Text Message**: Type your thoughts and Flora will respond
- **Voice Memo**: Record a voice message (up to 10 seconds) for Flora to understand your feelings

## Sensor Thresholds

Flora responds to the following conditions:
- **Soil Dry** (Moisture < 30%): Thirsty mood
- **Harmful Gas** (> 150 ppm): Scared mood
- **Air Polluted** (AQI > 60): Sick mood
- **Vibration/Stress** (> 7): Stressed mood
- **Clean Air & Moist Soil**: Happy mood
- **Optimal Conditions**: Calm mood

## Environment Variables

Create a `.env.local` file with:
```
VITE_GEMINI_API_KEY=your_google_api_key
```

## Browser Requirements

- Modern browsers with WebGL support (Chrome, Firefox, Safari, Edge)
- Microphone and camera permissions (for Soul Session and Health Scan)

## Known Limitations

- Voice memos are recorded but transcription requires additional setup
- Camera Health Scan requires camera permissions
- All API calls require internet connection
- Voice responses currently support text output

## Future Enhancements

- Real sensor hardware integration
- Voice transcription for voice memos
- Audio playback for AI-generated responses
- Multi-language support
- Plant species-specific monitoring
- Community sharing features

## License

Created with ❤️ for plant lovers and emotional wellness

## Support

For issues or questions, please check the configuration and ensure:
- API key is correctly set in `.env.local`
- Node.js version is 16+ 
- All dependencies are installed with `npm install`

---

**Flora says**: "I'm here for you, and so is your environment. Let's grow together! 🌿✨"
