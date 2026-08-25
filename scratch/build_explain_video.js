const fs = require('fs');
const https = require('https');
const path = require('path');
const { execSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const RESULTS_DIR = path.resolve(PROJECT_ROOT, '../results');
const IMAGE_FILE = "C:\\Users\\sunhy\\.gemini\\antigravity\\brain\\6c8e9589-8799-4c4b-a318-fb46e6c7e1d8\\.user_uploaded\\media_1786693043164.png";

const scripts = {
  ko: [
    { id: 1, text: "안녕하세요! 오늘은 이름이나 신분을 소개할 때 쓰는 '이에요'와 '예요'를 알아볼게요. 받침이 있는 이름 '유진' 뒤에는 '이에요'를 붙여서 '저는 유진이에요'가 됩니다." },
    { id: 2, text: "대화를 볼까요? '한국 사람이에요?'라는 질문에, 받침이 있는 '사람' 뒤에는 '이에요'를 붙여 '저는 베트남 사람이에요'라고 답합니다. '타오예요?'라는 질문에는, 받침이 없는 '타오' 뒤에 '예요'를 붙여 '저는 타오예요'라고 답해요." },
    { id: 3, text: "요약하자면 명사 마지막 글자에 받침이 있으면 '이에요', 받침이 없으면 '예요'를 씁니다. 베트남 사람이에요, 기자예요처럼요. 꼭 기억해 두세요!" }
  ],
  vi: [
    { id: 1, text: "Xin chào! Hôm nay chúng ta sẽ học về cấu trúc '이에요/예요' dùng để giới thiệu tên hoặc thân phận. Sau tên '유진' có phụ âm cuối, chúng ta kết hợp với '이에요' thành '저는 유진이에요'." },
    { id: 2, text: "Cùng xem hội thoại nhé. Với câu hỏi '한국 사람이에요?', danh từ '사람' có phụ âm cuối nên kết hợp với '이에요' thành '저-는 베트남 사람이에요'. Với câu hỏi '타오예요?', '타오' không có phụ âm cuối nên đi với '예요' thành '저-는 타오예요'." },
    { id: 3, text: "Tóm lại, danh từ có phụ âm cuối sẽ đi với '이에요', không có phụ âm cuối sẽ đi với '예요'. Ví dụ như 베트남 사람이에요, 기자예요. Hãy ghi nhớ nhé!" }
  ]
};

// 자막 번역 텍스트 (모든 버전 공용 베트남어 자막)
const subTexts = [
  "Xin chào! Hôm nay chúng ta sẽ học về cấu trúc '이에요/예요' dùng để giới thiệu tên hoặc thân phận. Sau tên '유진' có phụ âm cuối, chúng ta kết hợp với '이에요' thành '저-는 유진이에요'.",
  "Cùng xem hội thoại nhé. Với câu hỏi '한국 사람이에요?', danh từ '사람' có phụ âm cuối nên kết hợp với '이에요' thành '저-는 베트남 사람이에요'. Với câu hỏi '타오예요?', '타오' không có phụ âm cuối nên đi với '예요' thành '저-는 타오예요'.",
  "Tóm lại, danh từ có phụ âm cuối sẽ đi với '이에요', không có phụ âm cuối sẽ đi với '예요'. Ví dụ như 베트남 사람이에요, 기자예요. Hãy ghi nhớ nhé!"
];

async function downloadTTSChunk(text, lang, filePath) {
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
        reject(new Error(`Failed to download TTS chunk, code: ${response.statusCode}`));
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

async function downloadTTS(text, lang, filePath) {
  const maxChunk = 45; // 45자 이내로 청킹하여 HTTP 400 에러 사전 차단
  const words = text.split(' ');
  const chunks = [];
  let current = "";
  
  for (const w of words) {
    if ((current + " " + w).length > maxChunk) {
      if (current) chunks.push(current.trim());
      current = w;
    } else {
      current += (current ? " " : "") + w;
    }
  }
  if (current) chunks.push(current.trim());

  if (chunks.length === 1) {
    return downloadTTSChunk(chunks[0], lang, filePath);
  }

  const tempFiles = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunkPath = filePath + `.chunk${i}.mp3`;
    tempFiles.push(chunkPath);
    await downloadTTSChunk(chunks[i], lang, chunkPath);
  }

  const inputs = tempFiles.map(f => `-i "${f}"`).join(' ');
  const filter = chunks.map((_, idx) => `[${idx}:a]`).join('') + `concat=n=${chunks.length}:v=0:a=1[outa]`;
  const mergeCmd = `"${ffmpegPath}" -y ${inputs} -filter_complex "${filter}" -map "[outa]" "${filePath}"`;
  execSync(mergeCmd);

  tempFiles.forEach(f => {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  });
}

// 오디오 파일의 길이를 초(second) 단위로 확인하는 함수
function getAudioDuration(filePath) {
  try {
    const info = execSync(`"${ffmpegPath}" -i "${filePath}" 2>&1`).toString();
    const match = info.match(/Duration: (\d{2}):(\d{2}):(\d{2})\.(\d{2})/);
    if (match) {
      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const seconds = parseInt(match[3]);
      const ms = parseInt(match[4]) / 100;
      return hours * 3600 + minutes * 60 + seconds + ms;
    }
  } catch (e) {}
  return 5.0; // 실패 시 기본 5초
}

function formatSrtTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const ms = Math.floor((totalSeconds % 1) * 1000);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

async function main() {
  if (!fs.existsSync(IMAGE_FILE)) {
    console.error("Source image not found:", IMAGE_FILE);
    process.exit(1);
  }

  // 1. 영역별 슬라이드 크롭 이미지 생성 (흰 배경의 1080x1920 모바일 규격)
  console.log("Generating cropped slides...");
  const crops = [
    { id: 1, cropFilter: "crop=in_w:in_h*0.45:0:0" },          // 상단
    { id: 2, cropFilter: "crop=in_w:in_h*0.35:0:in_h*0.35" },  // 중단
    { id: 3, cropFilter: "crop=in_w:in_h*0.32:0:in_h*0.68" }   // 하단
  ];

  for (const crop of crops) {
    const outImg = path.join(__dirname, `crop_${crop.id}.png`);
    // 크롭 후 1080x1920 비율의 흰색 배경에 중앙 배치
    const cropCmd = `"${ffmpegPath}" -y -i "${IMAGE_FILE}" -vf "${crop.cropFilter},scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(1080-iw)/2:(1920-ih)/2:white" "${outImg}"`;
    execSync(cropCmd);
  }

  const langs = ['ko', 'vi'];
  
  for (const lang of langs) {
    console.log(`\n--- Starting processing for ${lang.toUpperCase()} version ---`);
    const listFile = path.join(__dirname, `concat_${lang}.txt`);
    const tempClips = [];
    const durations = [];

    // 2. TTS 음성 다운로드 및 개별 비디오 클립 생성
    for (let i = 0; i < 3; i++) {
      const idx = i + 1;
      const voicePath = path.join(__dirname, `temp_${lang}_voice_${idx}.mp3`);
      const slideImg = path.join(__dirname, `crop_${idx}.png`);
      const clipPath = path.join(__dirname, `clip_${lang}_${idx}.mp4`);

      console.log(`Downloading TTS ${idx}...`);
      await downloadTTS(scripts[lang][i].text, lang, voicePath);

      const duration = getAudioDuration(voicePath);
      durations.push(duration);
      console.log(`Audio ${idx} duration: ${duration}s`);

      // 정지 이미지 + 오디오 클립 생성 (H.264 인코딩, 30fps)
      console.log(`Rendering clip ${idx}...`);
      const renderCmd = `"${ffmpegPath}" -y -loop 1 -i "${slideImg}" -i "${voicePath}" -c:v libx264 -tune stillimage -pix_fmt yuv420p -c:a aac -shortest -t ${duration} "${clipPath}"`;
      execSync(renderCmd);

      tempClips.push(clipPath);
    }

    // 3. 동적으로 자막 파일 생성 (실제 오디오 길이에 맞춤 싱크)
    const srtPath = path.join(RESULTS_DIR, `260814_grammar_explain_${lang}_vi.srt`);
    let srtContent = "";
    let currentTime = 0;
    for (let i = 0; i < 3; i++) {
      const startTime = formatSrtTime(currentTime);
      currentTime += durations[i];
      const endTime = formatSrtTime(currentTime);
      srtContent += `${i + 1}\n${startTime} --> ${endTime}\n${subTexts[i]}\n\n`;
    }
    fs.writeFileSync(srtPath, srtContent);
    console.log(`Generated dynamic SRT: ${srtPath}`);

    // 4. 비디오 클립 Concat 리스트 파일 작성
    let concatList = "";
    tempClips.forEach(clip => {
      // ffmpeg concat demuxer 경로 포맷 (백슬래시 처리)
      const formattedPath = clip.replace(/\\/g, '/');
      concatList += `file '${formattedPath}'\n`;
    });
    fs.writeFileSync(listFile, concatList);

    // 5. 비디오 Concat 실행
    const mergedNoSub = path.join(__dirname, `merged_${lang}_nosub.mp4`);
    console.log("Merging clips...");
    const concatCmd = `"${ffmpegPath}" -y -f concat -safe 0 -i "${listFile}" -c copy "${mergedNoSub}"`;
    execSync(concatCmd);

    // 6. 자막 하드코딩 (Burn-in) 및 최종 렌더링
    const finalOutput = path.join(RESULTS_DIR, `260814_grammar_explain_${lang === 'ko' ? 'ko_voice' : 'vi_voice'}_vi_sub.mp4`);
    const srtPathEscaped = srtPath.replace(/\\/g, '/').replace('C:', 'C\\:');
    
    console.log("Embedding subtitles...");
    const subtitleCmd = `"${ffmpegPath}" -y -i "${mergedNoSub}" -vf "subtitles='${srtPathEscaped}'" -c:v libx264 -c:a copy "${finalOutput}"`;
    execSync(subtitleCmd);
    console.log(`Final video created: ${finalOutput}`);

    // 임시 리소스 정리
    fs.unlinkSync(listFile);
    fs.unlinkSync(mergedNoSub);
    tempClips.forEach(f => fs.unlinkSync(f));
    scripts[lang].forEach(item => {
      const p = path.join(__dirname, `temp_${lang}_voice_${item.id}.mp3`);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    });
  }

  // 크롭 이미지 정리
  crops.forEach(crop => {
    const p = path.join(__dirname, `crop_${crop.id}.png`);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });

  console.log("All tasks completed.");
}

main();
