export { playArabicAudio, stopAudio, getAudioSettings, saveAudioSettings } from './audio';
export type { AudioEngineSettings, VoicePersona } from './audio';
export { generateQRCodeSvgSync, generateQRCodeDataUrl } from './qrHelper';
export { getCachedAudio, saveCachedAudio, getAudioCacheStats, clearAudioCache, hasCachedAudio } from './audioCache';
export { precacheAllCurriculumAudio, cancelAudioPreload, isAudioPreloading, autoWarmupAudioCache } from './audioPreloader';
export { extractAllCurriculumVocabulary } from './curriculumVocabExtractor';
export { AudioCacheManagerModal } from './AudioCacheManagerModal';
export { QuickAudioBar } from './QuickAudioBar';
