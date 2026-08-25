const fs = require('fs');
const https = require('https');
const path = require('path');
const { execSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const RESULTS_DIR = path.resolve(PROJECT_ROOT, '../results');

const INPUT_VIDEO = path.join(RESULTS_DIR, '0814_bridge_fix.mp4');
const SRT_FILE = path.join(RESULTS_DIR, '260814_bridge_animation_vi.srt');

const KO_OUTPUT = path.join(RESULTS_DIR, '260814_bridge_ko_voice_vi_sub.mp4');
const VI_OUTPUT = path.join(RESULTS_DIR, '260814_bridge_vi_voice_vi_sub.mp4');

const koScripts = [
  { id: 1, delayMs: 0, text: "방금 배운 단어로 문법을 배워볼까요?" },
  { id: 2, delayMs: 3800, text: "우리가 배운 단어들이에요. 베트남 사람, 한국 사람, 기자." },
  { id: 3, delayMs: 9900, text: "베트남 사람에 이에요를 붙여서 저는 베트남 사람이에요 라고 말할 수 있어요." },
  { id: 4, delayMs: 16800, text: "이제 이에요와 예요를 자세히 공부해봐요!" }
];

const viScripts = [
  { id: 1, delayMs: 0, text: "Hãy cùng học ngữ pháp bằng những từ vựng vừa học nhé!" },
  { id: 2, delayMs: 3800, text: "Đây là những từ vựng chúng ta đã học. người Việt Nam, người Hàn Quốc, phóng viên" },
  { id: 3, delayMs: 9900, text: "Kết hợp '베트남 사람' với '이에요', chúng ta có thể nói là '저-는 베트남 사람이에요'." },
  { id: 4, delayMs: 16800, text: "Bây giờ, hãy cùng tìm hiểu kỹ hơn về cấu trúc '이에요/예요' nhé!" }
];

async function downloadTTS(text, lang, filePath) {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(text)}`;
  const file = fs.createWriteStream(filePath);
  
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
      }
    };
    https.get(url, options, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download TTS for ${lang}, code: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

async function buildVideo(scripts, lang, outputVideoPath) {
  const tempFiles = [];
  
  try {
    console.log(`[${lang.toUpperCase()}] Downloading TTS files...`);
    for (const item of scripts) {
      const tempPath = path.join(__dirname, `temp_${lang}_voice_${item.id}.mp3`);
      tempFiles.push(tempPath);
      await downloadTTS(item.text, lang, tempPath);
    }

    console.log(`[${lang.toUpperCase()}] Merging audio, video and embedding subtitles...`);
    const inputs = tempFiles.map(f => `-i "${f}"`).join(' ');
    
    // 오디오 딜레이 필터 구성
    const filterComplex = scripts
      .map((item, index) => `[${index + 1}:a]adelay=${item.delayMs}|${item.delayMs}[a${index + 1}]`)
      .join('; ') + `; ` + 
      scripts.map((_, index) => `[a${index + 1}]`).join('') + `amix=inputs=${scripts.length}:duration=first:dropout_transition=2[outa]`;

    // 윈도우 환경 자막 경로 포매팅 (백슬래시 이스케이프)
    const srtPathEscaped = SRT_FILE.replace(/\\/g, '/').replace('C:', 'C\\:');
    const videoFilter = `subtitles='${srtPathEscaped}'`;

    // ffmpeg 실행
    const ffmpegCmd = `"${ffmpegPath}" -y -i "${INPUT_VIDEO}" ${inputs} -filter_complex "${filterComplex}" -vf "${videoFilter}" -map 0:v -map "[outa]" -c:v libx264 -c:a aac -shortest "${outputVideoPath}"`;
    
    console.log(`[${lang.toUpperCase()}] Executing ffmpeg...`);
    execSync(ffmpegCmd);
    console.log(`[${lang.toUpperCase()}] Created: ${outputVideoPath}`);

  } catch (error) {
    console.error(`Error building ${lang} video:`, error);
  } finally {
    tempFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
  }
}

async function main() {
  if (!fs.existsSync(INPUT_VIDEO)) {
    console.error(`Input video not found: ${INPUT_VIDEO}`);
    process.exit(1);
  }

  // 한국어 음성 + 베트남어 자막 빌드
  await buildVideo(koScripts, 'ko', KO_OUTPUT);
  
  // 베트남어 음성 + 베트남어 자막 빌드
  await buildVideo(viScripts, 'vi', VI_OUTPUT);
  
  console.log('All builds completed.');
}

main();
