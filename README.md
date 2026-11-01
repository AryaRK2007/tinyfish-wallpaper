# 🌌 TinyFish Dynamic Live Wallpaper

An automated, dynamic live video wallpaper engine for Ubuntu powered by **TinyFish Search API**, **mpv**, and **xwinwrap**, featuring a native Lua real-time clock and date overlay.

---

## ✨ Features

- **🌐 Dynamic Web Extraction:** Queries TinyFish Search API to discover and parse fresh dark aesthetic MP4/WebM video loops across the web.
- **🖥️ Root Desktop Rendering:** Embeds high-performance video loops directly onto the desktop window via `xwinwrap` and `mpv`.
- **⏰ Low-Overhead Lua Clock:** Renders a 12-hour system time and date OSD directly inside `mpv` with zero extra CPU usage.
- **⚡ Power-Aware:** Automatically pauses live background downloads and playback when running on battery power.
- **🔔 Desktop Notifications:** Sends Linux desktop alerts via `notify-send` detailing the currently active wallpaper aesthetic.

---

## 🛠️ Prerequisites

Ensure the following system dependencies are installed on Ubuntu:

```bash
sudo apt update
sudo apt install -y mpv xwinwrap curl notify-send fonts-dejavu-core ffmpeg
