# Spotify Web Player Clone 🎵

A responsive, modular **Vite + React.js** Spotify Web Player clone based on the dark aesthetic layout with interactive audio playback, local file uploads, search filtering, and playlist management.

![Spotify Web Player Clone](public/assets/logo.png)

---

## ✨ Features

- **🎧 HTML5 Audio Playback**:
  - Full play/pause toggling.
  - Previous and Next track controls.
  - Real-time seek bar scrubbing with synchronized `MM:SS` current time and total duration.
  - Interactive volume control slider and instant mute/unmute toggle.
  - Shuffle toggle and 3-stage Repeat mode (`Off` → `Repeat All` → `Repeat One`).
- **📁 Local MP3 Upload ("Add MP3")**:
  - Upload and immediately play any `.mp3` audio file directly from your computer using `URL.createObjectURL()`.
- **🔍 Live Real-time Search**:
  - Search tracks by title, artist, or keywords with instant live filtering.
- **❤️ Liked Songs & Custom Playlists**:
  - Heart icon to save/remove tracks from your personal "Liked Songs" library.
  - Create and name custom playlists on the fly with live track badges.
- **🛡️ Robust Dual Fallbacks**:
  - Every track in `src/data/songs.js` specifies both local paths (`/assets/...`, `/songs/...`) and working cloud fallbacks (Unsplash high-res artwork and SoundHelix royalty-free audio). If local assets are missing or offline, `<img onError>` and `<audio onError>` handlers seamlessly maintain full visual fidelity and continuous playback.

---

## 📂 Project Structure

```text
spotify-clone/
├── public/
│   ├── assets/              # Local album art, cards, and icons
│   │   ├── logo.png
│   │   ├── album_picture.jpeg
│   │   ├── card1img.jpeg ~ card6img.jpeg
│   │   └── ...
│   └── songs/               # Local .mp3 audio tracks
│       ├── daylight.mp3
│       ├── mahiye-jinna-sohna.mp3
│       ├── mere-pass-tum-ho.mp3
│       ├── naa-ready.mp3
│       ├── top-global.mp3
│       ├── top-india.mp3
│       └── viral-50.mp3
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx      # Navigation, Library, Liked Songs, and Custom Playlists
│   │   ├── StickyNav.jsx    # History controls, live search input, Add MP3 upload button
│   │   ├── MainContent.jsx  # Categorized card grids, search view, and footer
│   │   └── MusicPlayer.jsx  # Fixed bottom player with album art, scrubber, and volume controls
│   ├── data/
│   │   └── songs.js         # Track metadata, local URLs, and fallback handlers
│   ├── App.jsx              # Central state management & HTML5 Audio controller
│   ├── main.jsx             # React DOM root entry point
│   └── Project.css          # Dark-theme stylesheet preserving original class names
├── index.html               # Montserrat font & Font Awesome 6.5.2 CDN
├── vite.config.js           # Vite development server configuration
├── package.json             # React 18 & Vite dependencies
├── .gitignore               # Standard Git ignore rules
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Installation
Install the required dependencies:
```bash
npm install
```

### 2. Development Server
Start the local Vite development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` (or the port displayed in your terminal).

### 3. Production Build
To create an optimized production build:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 📤 Push to GitHub

To push this repository to GitHub:

```bash
git init
git add .
git commit -m "Initial commit: Modular Vite + React Spotify Clone"
git branch -M main
git remote add origin https://github.com/<your-username>/spotify-clone.git
git push -u origin main
```

---

## 🎨 Color Palette & Design Tokens

- Background Base: `#000000`
- Content & Card Surface: `#121212`, `#181818` (hover: `#282828`)
- Sidebar Library Boxes: `#232323`
- Spotify Brand Green: `#1bd760` / `#1ed760`
- Primary Typography: `"Montserrat", sans-serif`

---

## 📄 License
This project is for educational and portfolio demonstration purposes. All music and images belong to their respective copyright holders.
