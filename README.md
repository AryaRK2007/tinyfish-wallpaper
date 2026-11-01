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
sudo apt install -y mpv xwinwrap curl notify-send fonts-dejavu-core ffmpeg```
```




- **🔔 Installation**
Clone the repository:

Bash
git clone [https://github.com/AryaRK2007/tinyfish-wallpaper.git](https://github.com/AryaRK2007/tinyfish-wallpaper.git)
cd tinyfish-wallpaper
Install Node.js dependencies:

```Bash
npm install
Set up environment variables:
Create a .env file in the root directory:
```

Code snippet
```
TINYFISH_API_KEY=your_tinyfish_api_key_here
```
🎮 Usage
Run the main script to fetch a new background loop and start desktop playback:
```
Bash
node app.js
```
⏲️ Automation & Shortcuts
1. Hourly Auto-Refresh (Cron)
To automatically update your live wallpaper every hour, edit your crontab:
```
Bash
crontab -e
Add the following line:

Bash
0 * * * * DISPLAY=:0 DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus /usr/bin/node /home/YOUR_USERNAME/path-to-repo/app.js > /dev/null 2>&1
```


2. Global Hotkey (One-Click Reroll)
Assign a custom shortcut in Settings → Keyboard → Custom Shortcuts:

Name: Reroll Live Wallpaper

Command: node /home/YOUR_USERNAME/path-to-repo/app.js

Shortcut: Super + Shift + W


---

### Add It to Your Repository

Run these commands in your project terminal to push the README live:

```bash
git add README.md
git commit -m "docs: add repository README"
git push
