const fs = require('fs');
const https = require('https');
const path = require('path');

const text = "방금 배운 단어로 문법을 배워볼까요? 우리가 배운 단어들이에요. 베트남 사람, 한국 사람, 기자. 베트남 사람에 이에요를 붙여서, 저는 베트남 사람이에요 라고 말할 수 있어요. 이제 이에요와 예요를 자세히 공부해봐요!";
const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ko&client=tw-ob&q=${encodeURIComponent(text)}`;
const outputPath = path.resolve(__dirname, '../../results/260814_bridge_tts_ko.mp3');

console.log('Requesting TTS from Google...');
const file = fs.createWriteStream(outputPath);

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
  }
};

https.get(url, options, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to get TTS, status code: ${response.statusCode}`);
    return;
  }
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('TTS MP3 file created successfully at:', outputPath);
  });
}).on('error', (err) => {
  fs.unlink(outputPath, () => {});
  console.error('Error downloading TTS:', err.message);
});
