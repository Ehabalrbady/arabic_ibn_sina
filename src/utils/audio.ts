/**
 * Audio Speech Synthesis Engine for Arabic Learning
 * Provides reliable Arabic pronunciation with diacritics and fallback support.
 */

let synth: SpeechSynthesis | null = null;
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  synth = window.speechSynthesis;
}

export function playArabicAudio(
  text: string, 
  options: { rate?: number; pitch?: number; onEnd?: () => void } = {}
): Promise<boolean> {
  return new Promise((resolve) => {
    if (!synth) {
      resolve(false);
      return;
    }

    try {
      synth.cancel(); // Stop any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = options.rate || 0.78; // Measured pacing for elementary learners
      utterance.pitch = options.pitch || 1.0;

      // Select high quality Arabic voice if available
      const voices = synth.getVoices();
      const arabicVoices = voices.filter(v => v.lang.startsWith('ar'));
      if (arabicVoices.length > 0) {
        // Prefer local or natural sounding voice
        const preferred = arabicVoices.find(v => v.name.includes('Maged') || v.name.includes('Tariq') || v.name.includes('Laila') || v.name.includes('Arabic') || v.lang === 'ar-SA') || arabicVoices[0];
        utterance.voice = preferred;
      }

      utterance.onend = () => {
        if (options.onEnd) options.onEnd();
        resolve(true);
      };

      utterance.onerror = () => {
        resolve(false);
      };

      synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      resolve(false);
    }
  });
}

export function stopAudio() {
  if (synth) {
    synth.cancel();
  }
}
