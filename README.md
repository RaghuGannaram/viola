# 🎵 Viola

> _A soulful, self-hosted music player built for privacy, control, and joy._

Viola is a progressive, intelligent, and elegant music player that puts **you** at the center. It’s designed to be a beautiful alternative to algorithm-heavy platforms like Spotify or YouTube Music — allowing you to play, stream, organize, and feel your music without distractions.

---

## 🚧 Feature Roadmap

A phase-by-phase breakdown of what Viola offers and will evolve into:

### 🏁 Phase 1: Minimum Viable Product (MVP)

- 🎧 Local playback for MP3, WAV, OGG, FLAC
- 🔊 Controls: play, pause, seek, volume
- 🎨 Responsive UI with light/dark mode
- 🎼 Playlist creation and metadata display

✅ _Offline-ready, intuitive music player_

---

### 🌐 Phase 2: Online Streaming & User Accounts

- 🔐 Signup/Login with OAuth
- ☁️ Private S3 bucket support for streaming
- 📁 User-specific playlists, metadata sync
- 🔎 Search and filter music by tags, genres

✅ _Cloud playback with personalized storage_

---

### 🎨 Phase 3: Advanced Playback Experience

- 🔁 Repeat, shuffle, queue
- 🌈 Visualizer and waveform UI
- 🧠 Equalizer, normalization, speed control
- 🎤 Synchronized lyrics and background themes

✅ _Deeply immersive and rich playback UX_

---

### 📱 Phase 4: Offline & PWA

- 📲 Installable PWA (desktop/mobile)
- 📴 Offline song caching via IndexedDB
- 🔈 Lock-screen playback with MediaSession API

✅ _True mobile-first native-like experience_

---

### 💬 Phase 5: Social & Community Layer

- 🔗 Shareable and collaborative playlists
- 💬 Reactions, comments, and activity feeds
- 🧭 Discover public playlists and curators

✅ _Music becomes social again, without ads_

---

### 🤖 Phase 6: AI & Smart Experience

- 🧠 Recommendations by time, mood, weather
- 🛠 Smart playlist generation (e.g. focus/gym)
- 📊 Listening heatmaps, mood tagging, insights

✅ _Viola becomes your intelligent sound companion_

---

### 🚀 Phase 7: Viola-First Innovations

- 🧠 Emotion-driven themes and ambient layers
- 📅 Playlist Memory Lane (seasonal throwbacks)
- 🧘 Intentional Listening Mode (no skip)
- 🔍 Whistle-to-Search (experimental)

✅ _New listening paradigms never seen before_

---

## 📦 Tech Stack

### 🧰 Frontend (Web & PWA)

| Layer        | Technology                |
| ------------ | ------------------------- |
| UI Framework | SvelteKit                 |
| Styling      | Tailwind CSS              |
| Audio API    | HTML5 + Howler.js         |
| State Mgmt   | Svelte Store              |
| PWA          | Vite Plugin PWA / Workbox |
| Animations   | Framer Motion / CSS       |
| Visuals      | Canvas-based waveform     |

---

### 🧰 Backend (API + Streaming)

| Layer          | Technology           |
| -------------- | -------------------- |
| Language       | Node.js (Express.js) |
| API/Auth       | JWT, OAuth (Google)  |
| Storage        | Amazon S3, FFmpeg    |
| File Parsing   | music-metadata       |
| Database       | PostgreSQL / MongoDB |
| Optional Cache | Redis                |

---

### 🚀 DevOps & Delivery

| Component     | Technology                |
| ------------- | ------------------------- |
| CI/CD         | GitHub Actions            |
| Hosting (FE)  | Vercel / Netlify          |
| Hosting (API) | Render / Railway / Fly.io |
| DB Hosting    | Upstash / Neon            |
| SSL/DNS       | AWS Cloudfront            |

---

### 📱 Native App & Device Targets

| Platform   | Tool       | Notes                          |
| ---------- | ---------- | ------------------------------ |
| Mobile     | Capacitor  | Wrap web app into native shell |
| Desktop    | Tauri      | Lightweight native wrapper     |
| Smart Home | Alexa, TVs | (Future experimental R&D)      |

---

### 🧠 AI & Advanced Features

| Feature              | Technology / Idea              |
| -------------------- | ------------------------------ |
| Recommendation       | Embeddings, mood vector graphs |
| Smart Playlists      | BPM + genre tag-based grouping |
| Listening Insights   | Custom D3 dashboards           |
| Emotion Detection    | Audio fingerprint + ML         |
| Voice/Whistle Search | Whisper / Web Speech API       |

---

## 🗂️ Monorepo Structure (TurboRepo + pnpm)

```bash
viola/
├── apps/
│   ├── theater/         # SvelteKit frontend app
│   └── engine/          # ExpressJS backend
├── packages/
│   ├── utils/           # Shared utility functions
│   ├── ui/              # Shared UI components (future)
│   └── config/          # Shared ESLint/TS configs
├── tsconfig.base.json   # Shared TS config
└── turbo.json           # Turbo pipeline config
```
