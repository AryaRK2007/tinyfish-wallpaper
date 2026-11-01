require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

// 1. Automatic Pinterest Link Resolver
async function resolveMediaUrl(url) {
  // If it's a Pinterest page link, extract the raw video URL automatically
  if (url.includes('pinterest.com/pin/')) {
    console.log("   📌 Detected Pinterest page link! Extracting raw MP4 stream...");
    try {
      const pageRes = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0' },
        timeout: 5000
      });
      const rawHtml = pageRes.data.replace(/\\\/|\\x2F/gi, '/');
      const matches = rawHtml.match(/https?:\/\/v[0-9]*\.pinimg\.com\/videos\/[^\s"'`<>]+?\.(?:mp4|webm)/gi);
      
      if (matches && matches.length > 0) {
        console.log(`   ✨ Pinterest MP4 Extracted: ${matches[0]}`);
        return matches[0];
      }
    } catch (e) {
      console.log("   Failed to resolve Pinterest video link, trying raw URL...");
    }
  }
  return url;
}

// 2. Desktop Toast Notification
function sendNotification(title, message, icon = 'video-x-generic') {
  try {
    const cleanTitle = title.replace(/"/g, '\\"');
    const cleanMsg = message.replace(/"/g, '\\"');
    exec(`notify-send -i "${icon}" "${cleanTitle}" "${cleanMsg}"`);
  } catch (e) {}
}

// 3. Power Guard
function isPluggedIn() {
  try {
    const status = execSync('cat /sys/class/power_supply/AC*/online 2>/dev/null || echo 1').toString().trim();
    return status.includes('1');
  } catch (e) {
    return true;
  }
}

// 4. Dynamic Query Generator
function generateDynamicQuery() {
  const aesthetics = [
    'dark aesthetic', 'cyberpunk neon', 'moody anime night', 'dark space queen', 
    'rainy cityscape dark', 'vaporwave aesthetic', 'dark fantasy forest', 'gothic architecture',
    'gothic', 'tokyo night rain', 'rainy lofi city', 'vaporwave sunset'
  ];
  const formats = [
    'mp4 loop wallpaper 16:9', 'mp4 loop wallpaper 1920x1080'
  ];

  const aesthetic = aesthetics[Math.floor(Math.random() * aesthetics.length)];
  const format = formats[Math.floor(Math.random() * formats.length)];

  return { vibe: aesthetic, query: `${aesthetic} ${format}` };
}

// 5. Deep Media Parser
async function fetchDynamicWebVideoUrl(queryObj) {
  console.log(`1. Querying TinyFish Search for: "${queryObj.query}"...`);

  if (!process.env.TINYFISH_API_KEY) {
    throw new Error("TINYFISH_API_KEY is missing in your .env file!");
  }

  const response = await axios.get('https://api.search.tinyfish.ai', {
    params: { query: queryObj.query },
    headers: { 'X-API-Key': process.env.TINYFISH_API_KEY },
    timeout: 8000
  });

  const results = response.data?.results || [];

  for (const item of results) {
    const url = item.url || item.link || item.media_url || item.download_url;
    if (url && (url.endsWith('.mp4') || url.endsWith('.webm'))) {
      return url;
    }
  }

  for (const item of results.slice(0, 4)) {
    if (!item.url) continue;
    try {
      const pageRes = await axios.get(item.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0' },
        timeout: 5000
      });
      const rawHtml = pageRes.data.replace(/\\\/|\\x2F/gi, '/');
      const matches = rawHtml.match(/https?:\/\/[^\s"'`<>]+?\.(?:mp4|webm)(?:\?[^\s"'`<>]*?)?/gi);
      if (matches && matches.length > 0) return matches[0];
    } catch (e) {}
  }

  throw new Error("No direct MP4 streams extracted.");
}

// 6. System Curl Downloader
function downloadWithCurl(url, outputPath) {
  const userAgent = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0";
  const command = `curl -sL -m 20 -A "${userAgent}" -e "https://google.com" -o "${outputPath}" "${url}"`;
  execSync(command, { stdio: 'ignore' });
}

// 7. Video File Validation
function isValidVideo(filePath) {
  if (!fs.existsSync(filePath) || fs.statSync(filePath).size < 20000) return false;
  try {
    execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1 "${filePath}"`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return fs.statSync(filePath).size > 50000;
  }
}

// 8. Download & Overwrite wallpaper.mp4
async function downloadLiveWallpaper() {
  const videoPath = path.join(__dirname, 'wallpaper.mp4');
  let attempts = 0;

  while (attempts < 3) {
    attempts++;
    const queryObj = generateDynamicQuery();

    try {
      const videoUrl = await fetchDynamicWebVideoUrl(queryObj);
      console.log(`2. Downloading video stream (Attempt ${attempts}/3)...`);

      const finalUrl = await resolveMediaUrl(videoUrl);
      downloadWithCurl(finalUrl, videoPath);

      if (isValidVideo(videoPath)) return { videoPath, vibe: queryObj.vibe };
    } catch (err) {
      console.log(`   Attempt ${attempts} note: ${err.message}`);
    }
  }

  // Fallbacks: YOU CAN NOW PASTE ANY PINTEREST PIN LINK HERE DIRECTLY!
  console.log("⚠️ Applying custom video fallbacks...");
  const fallbacks = [
    { vibe: "PINTEREST DARK VIBE", url: "https://in.pinterest.com/pin/612982199329731417/" }, // Direct Pinterest pin URL!
    { vibe: "DARK RAIN CITY", url: "https://in.pinterest.com/pin/1069816086498885180/" }
  ];

  const selectedFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
  const resolvedFallbackUrl = await resolveMediaUrl(selectedFallback.url);
  downloadWithCurl(resolvedFallbackUrl, videoPath);

  return { videoPath, vibe: selectedFallback.vibe };
}

// 9. Launch Live Background Process with Clock Overlay
function setLiveWallpaper(filePath, vibe) {
  const absolutePath = path.resolve(filePath);
  const clockScriptPath = path.resolve(__dirname, 'clock.lua');

  exec('pkill -9 -f xwinwrap; pkill -9 -f mpv; sleep 0.5;', () => {
    const command = `xwinwrap -ov -fs -ni -b -nf -- mpv -wid WID --loop-file=inf --no-audio --panscan=1.0 --osd-level=1 --sub-visibility=yes --script="${clockScriptPath}" "${absolutePath}" > /dev/null 2>&1 &`;

    exec(command, (err) => {
      if (err) {
        console.error("Error setting live wallpaper:", err.message);
      } else {
        console.log("✅ Live wallpaper updated with time & date theme!");
        sendNotification("Live Wallpaper Updated", `Vibe: ${vibe.toUpperCase()}`);
      }
    });
  });
}

// 10. Main Function
async function run() {
  try {
    if (!isPluggedIn()) {
      console.log("⚡ On battery power: Skipping live wallpaper refresh.");
      return;
    }

    const result = await downloadLiveWallpaper();
    console.log("3. Overwritten wallpaper.mp4!");

    // Comment out setLiveWallpaper so it only updates wallpaper.mp4 on disk
    // setLiveWallpaper(result.videoPath, result.vibe);

    sendNotification("Live Wallpaper Downloaded", `Updated wallpaper.mp4 (${result.vibe.toUpperCase()})`);
  } catch (error) {
    console.error("Execution failed:", error.message);
  }
}

run();