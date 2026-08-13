const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// mp4 video asset 지원 추가
config.resolver.assetExts.push('mp4');

module.exports = config;
