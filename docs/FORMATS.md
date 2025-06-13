# 🎧 Supported Audio File Formats in Viola

Viola is a self-hosted, user-first music platform. Since **all audio files are uploaded by users**, we support a wide range of formats and **transcode them to optimal formats** for browser and mobile playback. This document serves as a foundational reference for understanding audio formats, their characteristics, and Viola's handling strategy.

---

## 📋 Summary Table of Formats

| Format | Full Name                     | Compression | Quality         | File Size | Browser Support   | Mobile PWA    | Typical Source   | Transcoding Target   |
| ------ | ----------------------------- | ----------- | --------------- | --------- | ----------------- | ------------- | ---------------- | -------------------- |
| MP3    | MPEG-1 Audio Layer 3          | Lossy       | Good            | Small     | ✅ All            | ✅ All        | Internet, CDs    | ✅ Universal         |
| WAV    | Waveform Audio File Format    | None (PCM)  | Studio-quality  | Huge      | ✅ Most           | ✅ Most       | DAWs, Recordings | ✅ Lossless fallback |
| FLAC   | Free Lossless Audio Codec     | Lossless    | CD-quality      | Medium    | ⚠️ Partial        | ❌ iOS        | Audiophile rips  | ✅ MP3/WAV           |
| AAC    | Advanced Audio Coding         | Lossy       | Better than MP3 | Small     | ✅ Most           | ✅ iOS-native | iTunes, iPhones  | ✅ iOS primary       |
| OGG    | Ogg Vorbis                    | Lossy       | Comparable      | Small     | ✅ Chrome/Firefox | ❌ Safari     | Podcasts, Linux  | ✅ MP3 fallback      |
| ALAC   | Apple Lossless Audio Codec    | Lossless    | CD-quality      | Medium    | ❌ Browser        | ✅ iOS        | Apple ecosystem  | ✅ FLAC/WAV          |
| AIFF   | Audio Interchange File Format | None (PCM)  | Studio-quality  | Huge      | ⚠️ Safari only    | ✅ iOS        | Logic Pro, DAWs  | ✅ WAV equivalent    |
| DSD    | Direct Stream Digital         | Lossless    | Ultra High Res  | Very Huge | ❌ Not supported  | ❌            | SACD rips        | ✅ FLAC/MP3 downmix  |

---

## 🔍 Format Details & Origins

### 1. **MP3** (MPEG-1 Audio Layer III)

- **Type**: Lossy compression
- **Origin**: Fraunhofer Society, 1993
- **Pros**: Universally supported, small size
- **Cons**: Loss of quality due to compression
- **Use Cases**: Web streaming, mobile music, podcasts

### 2. **WAV** (Waveform Audio File Format)

- **Type**: Uncompressed PCM
- **Origin**: Microsoft + IBM, 1991
- **Pros**: Highest quality, accurate
- **Cons**: Huge file sizes
- **Use Cases**: Studio recording, production

### 3. **FLAC** (Free Lossless Audio Codec)

- **Type**: Lossless compression
- **Origin**: Xiph.Org Foundation
- **Pros**: CD-quality without file bloat
- **Cons**: Limited support on Apple platforms
- **Use Cases**: Audiophile libraries, archival

### 4. **AAC** (Advanced Audio Coding)

- **Type**: Lossy
- **Origin**: MPEG-4 (Fraunhofer, Dolby, Sony)
- **Pros**: Better compression and quality than MP3
- **Cons**: Less open, more tied to Apple
- **Use Cases**: iTunes, Apple Music, YouTube

### 5. **OGG Vorbis**

- **Type**: Lossy
- **Origin**: Xiph.Org Foundation
- **Pros**: Open-source, MP3-like quality
- **Cons**: Not supported on Safari/iOS
- **Use Cases**: Open games, podcasts

### 6. **ALAC** (Apple Lossless Audio Codec)

- **Type**: Lossless
- **Origin**: Apple Inc.
- **Pros**: Great quality, iOS-native
- **Cons**: No support outside Apple ecosystem
- **Use Cases**: iTunes libraries, iOS music apps

### 7. **AIFF** (Audio Interchange File Format)

- **Type**: Uncompressed
- **Origin**: Apple Inc., 1988
- **Pros**: CD-quality for Mac users
- **Cons**: Large size, poor browser support
- **Use Cases**: Studio/DAW export (GarageBand, Logic)

### 8. **DSD** (Direct Stream Digital)

- **Type**: High-res lossless (1-bit sampling)
- **Origin**: Sony & Philips (SACD)
- **Pros**: Very high fidelity
- **Cons**: Not supported in browsers, massive size
- **Use Cases**: Audiophile SACDs, high-end stores

---

## 🎯 Viola’s Strategy

### ✅ Upload Support

- We **accept all major audio file formats** for upload.
- We **do not restrict** users based on format type.
- Uploaded originals are stored in `/uploads/originals/`.

### 🔄 Transcoding & Compatibility

- On upload, we transcode to one or more of:
    - ✅ **MP3** → universal playback
    - ✅ **AAC** → Apple/iOS compatibility
    - ✅ **WAV** → lossless (desktop, archive)
- Transcoding is powered by [`ffmpeg`](https://ffmpeg.org/).

### ⚙️ Playback Format Selection

- Users always stream transcoded formats.
- Based on device/browser, we serve:
    - **MP3** → all users (safe default)
    - **AAC** → iOS/Safari
    - **WAV** → lossless mode (WiFi/desktop only)

---

## 🛠 FFmpeg Conversion Examples

```bash
# Convert to MP3
ffmpeg -i input.wav -codec:a libmp3lame -qscale:a 2 output.mp3

# Convert to AAC
ffmpeg -i input.flac -c:a aac -b:a 192k output.aac

# Convert to WAV
ffmpeg -i input.flac -c:a pcm_s16le output.wav
```

---

## 📁 Upload Folder Structure

```
/uploads/originals/{uuid}.flac
/uploads/converted/mp3/{uuid}.mp3
/uploads/converted/aac/{uuid}.aac
/uploads/converted/wav/{uuid}.wav
```

---

## 🚫 Unsupported or Edge Formats

| Format | Why Not Natively Supported      |
| ------ | ------------------------------- |
| ALAC   | Apple-only; convert to FLAC/AAC |
| AIFF   | Large, Safari-only              |
| DSD    | Not playable in browsers        |

We support these **for upload only** and transcode to a compatible format on the server.

---

## 📘 Use Cases for Each Format in Viola

| User Type      | Likely Upload Format | Viola Action          |
| -------------- | -------------------- | --------------------- |
| Bedroom Artist | WAV, AIFF            | Convert to MP3 + WAV  |
| Audiophile     | FLAC, DSD            | Convert to FLAC + MP3 |
| Podcaster      | MP3, OGG             | Use MP3 directly      |
| Apple User     | AAC, ALAC            | Convert to AAC + MP3  |

---

## ✅ Conclusion

Viola supports **maximum flexibility** by accepting all common audio formats and transcoding them for modern browser and mobile compatibility. This document serves as the foundation for developers, contributors, and users to understand how Viola handles music files internally.

For more technical details, see `/upload/+page.svelte` and `+page.server.ts` in the codebase.
