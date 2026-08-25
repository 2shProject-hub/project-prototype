const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const PORT = 8085;
const APP_URL = `http://localhost:${PORT}/?recording=true`;
const TEMP_DIR = path.join(__dirname, 'temp_frames');
const PROJECT_ROOT = path.resolve(__dirname, '..');
const RESULTS_DIR = path.resolve(PROJECT_ROOT, '../results');
const OUTPUT_MP4 = path.join(RESULTS_DIR, '260814_bridge_animation_extended_v1.0.mp4');

// 폴더 정리 및 생성
if (fs.existsSync(TEMP_DIR)) {
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}
fs.mkdirSync(TEMP_DIR, { recursive: true });
fs.mkdirSync(RESULTS_DIR, { recursive: true });

async function waitPort(port, timeout = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await new Promise((resolve, reject) => {
        const socket = require('net').createConnection(port, 'localhost');
        socket.on('connect', () => { socket.end(); resolve(); });
        socket.on('error', reject);
      });
      return;
    } catch (e) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw new Error(`Timeout waiting for port ${port}`);
}

async function main() {
  console.log('Starting Expo Web Server on port', PORT);
  const expoProcess = spawn('npx', ['expo', 'start', '--web', '--port', String(PORT)], {
    cwd: PROJECT_ROOT,
    shell: true,
    stdio: 'ignore' // 백그라운드 출력을 무시하여 노이즈 차단
  });

  try {
    console.log('Waiting for Expo Web Server to be ready...');
    await waitPort(PORT);
    console.log('Expo Web Server is ready. Launching Puppeteer...');

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    // 아이폰 15 크기에 맞춰 뷰포트 설정
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

    console.log('Navigating to', APP_URL);
    await page.goto(APP_URL, { waitUntil: 'networkidle2' });

    // 번개 표시 및 하단 개발 오버레이 제거
    await page.evaluate(() => {
      const hideFloatingDevTools = () => {
        const all = document.querySelectorAll('*');
        for (const el of all) {
          try {
            const style = window.getComputedStyle(el);
            if (style.position === 'fixed') {
              const bottom = parseInt(style.bottom);
              // 화면 하단에 고정된 플로팅 개발 UI 숨김
              if (!isNaN(bottom) && bottom < 100) {
                el.style.setProperty('display', 'none', 'important');
              }
            }
          } catch (e) {}
        }
      };
      hideFloatingDevTools();
      setTimeout(hideFloatingDevTools, 500);
      setTimeout(hideFloatingDevTools, 1500);
    });

    console.log('Page loaded. Starting screencast...');
    const client = await page.target().createCDPSession();
    await client.send('Page.startScreencast', {
      format: 'png',
      everyNthFrame: 1
    });

    let frameNum = 0;
    client.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
      const buffer = Buffer.from(data, 'base64');
      const filename = path.join(TEMP_DIR, `frame_${String(frameNum++).padStart(4, '0')}.png`);
      fs.writeFileSync(filename, buffer);
      await client.send('Page.screencastFrameAck', { sessionId });
    });

    // 애니메이션이 전개되는 시간 동안 대기 (22초)
    console.log('Recording animation frames...');
    await new Promise(resolve => setTimeout(resolve, 22000));

    console.log('Stopping screencast...');
    await client.send('Page.stopScreencast');
    await browser.close();

    console.log(`Captured ${frameNum} frames. Encoding video with ffmpeg...`);
    // 프레임 레이트 30fps로 설정하여 mp4 인코딩
    const ffmpegCmd = `"${ffmpegPath}" -y -framerate 30 -i "${path.join(TEMP_DIR, 'frame_%04d.png')}" -c:v libx264 -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${OUTPUT_MP4}"`;
    execSync(ffmpegCmd);
    console.log(`Video saved to: ${OUTPUT_MP4}`);

  } catch (error) {
    console.error('Error during recording:', error);
  } finally {
    console.log('Shutting down Expo Web Server...');
    if (process.platform === 'win32') {
      execSync(`taskkill /pid ${expoProcess.pid} /t /f`);
    } else {
      expoProcess.kill('SIGINT');
    }
    // 임시 폴더 삭제
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }
    console.log('Done.');
    process.exit(0);
  }
}

main();
