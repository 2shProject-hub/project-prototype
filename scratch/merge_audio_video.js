const fs = require('fs');
const https = require('https');
const path = require('path');
const { execSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const RESULTS_DIR = path.resolve(PROJECT_ROOT, '../results');
const INPUT_VIDEO = path.join(RESULTS_DIR, '260814_bridge_animation_extended_v1.0.mp4');
const OUTPUT_VIDEO = path.join(RESULTS_DIR, '260814_bridge_final_extended_v1.0.mp4');

const scripts = [
  { id: 1, delayMs: 0, text: "방금 배운 단어로 문법을 배워볼까요?" },
  { id: 2, delayMs: 3800, text: "우리가 배운 단어들이에요. 베트남 사람, 한국 사람, 기자." },
  { id: 3, delayMs: 9900, text: "베트남 사람에 이에요를 붙여서 저는 베트남 사람이에요 라고 말할 수 있어요." },
  { id: 4, delayMs: 16800, text: "이제 이에요와 예요를 자세히 공부해봐요!" }
];

async function downloadTTS(text, filePath) {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ko&client=tw-ob&q=${encodeURIComponent(text)}`;
  const file = fs.createWriteStream(filePath);
  
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
      }
    };
    https.get(url, options, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download TTS, code: ${response.statusCode}`));
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

async function main() {
  const tempFiles = [];
  
  try {
    console.log('Downloading individual TTS files...');
    for (const item of scripts) {
      const tempPath = path.join(__dirname, `temp_voice_${item.id}.mp3`);
      tempFiles.push(tempPath);
      console.log(`Downloading TTS ${item.id}: "${item.text}"`);
      await downloadTTS(item.text, tempPath);
    }

    console.log('Merging audio and video using ffmpeg...');
    // ffmpeg filter_complex 구성
    // 각 오디오 트랙을 해당 delayMs에 맞춰 delay 시킨 후 amix로 병합
    const inputs = tempFiles.map(f => `-i "${f}"`).join(' ');
    
    // adelay 필터는 밀리초 단위로 딜레이를 주며, 스테레오/모노 채널에 맞춰 지정해야 하므로 `delay|delay` 형식으로 사용합니다.
    const filterComplex = scripts
      .map((item, index) => `[${index + 1}:a]adelay=${item.delayMs}|${item.delayMs}[a${index + 1}]`)
      .join('; ') + `; ` + 
      scripts.map((_, index) => `[a${index + 1}]`).join('') + `amix=inputs=${scripts.length}:duration=first:dropout_transition=2[outa]`;

    // ffmpeg 명령어 실행
    // -i 비디오 -i 오디오1 -i 오디오2...
    const ffmpegCmd = `"${ffmpegPath}" -y -i "${INPUT_VIDEO}" ${inputs} -filter_complex "${filterComplex}" -map 0:v -map "[outa]" -c:v copy -c:a aac -shortest "${OUTPUT_VIDEO}"`;
    
    console.log('Executing ffmpeg command...');
    execSync(ffmpegCmd);
    console.log(`Final video generated successfully at: ${OUTPUT_VIDEO}`);

  } catch (error) {
    console.error('Error merging audio and video:', error);
  } finally {
    // 임시 오디오 파일 삭제
    tempFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
    console.log('Cleanup completed.');
  }
}

main();
