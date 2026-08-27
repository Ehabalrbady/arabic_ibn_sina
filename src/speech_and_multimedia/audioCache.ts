/**
 * Persistent Human Voice Audio Cache DB for Ibn Sina Arabic Learning Applet
 * Uses IndexedDB to store generated AI audio clips (PCM/WAV) from Gemini TTS.
 * Supports offline replay and instantaneous 0ms playback without network latency.
 */

const DB_NAME = "IbnSinaiHumanVoiceCache_v3";
const STORE_NAME = "audio_tracks";

// Auto cleanup legacy test databases that had oscillator buzzers
if (typeof window !== 'undefined' && window.indexedDB) {
  try {
    ['IbnSinaiAudioCache_v1', 'IbnSinaiAudioCache_v2'].forEach(oldName => {
      try { window.indexedDB.deleteDatabase(oldName); } catch (e) {}
    });
  } catch (e) {}
}

export interface CachedAudioRecord {
  key: string;            // e.g. "teacher_std_كِتَابٌ" or "child_seg_مَدْرَسَةٌ"
  text: string;           // The Arabic word or sentence
  persona: 'teacher' | 'child'; // 'teacher' (warm maternal) or 'child' (cheerful child)
  segmented: boolean;     // Whether syllables were split
  audioBase64: string;    // Base64 audio stream (WAV / PCM)
  mimeType: string;       // e.g. "audio/pcm;rate=24000" or "audio/wav"
  sampleRate: number;     // Usually 24000
  timestamp: number;
  source?: 'gemini_tts' | 'speech_capture';
}

let dbPromise: Promise<IDBDatabase> | null = null;
const memoryIndexSet = new Set<string>();
let isMemoryIndexLoaded = false;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this environment"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, 2);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "key" });
        store.createIndex("text", "text", { unique: false });
        store.createIndex("persona", "persona", { unique: false });
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

  return dbPromise;
}

/**
 * Builds a deterministic, normalized key for an audio track
 */
export function getAudioCacheKey(text: string, persona: 'teacher' | 'child', segmented: boolean = false): string {
  const clean = text.replace(/[\s\u200B\uFEFF]+/g, ' ').trim();
  return `${persona}_${segmented ? 'seg' : 'std'}_${clean}`;
}

/**
 * Fast in-memory / localStorage check if audio is cached
 */
export async function hasCachedAudio(
  text: string, 
  persona: 'teacher' | 'child', 
  segmented: boolean = false
): Promise<boolean> {
  const key = getAudioCacheKey(text, persona, segmented);
  if (memoryIndexSet.has(key)) return true;

  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.count(key);

      req.onsuccess = () => {
        const exists = req.result > 0;
        if (exists) memoryIndexSet.add(key);
        resolve(exists);
      };
      req.onerror = () => resolve(false);
    });
  } catch (e) {
    return false;
  }
}

/**
 * Retrieves a cached audio record from IndexedDB
 */
export async function getCachedAudio(
  text: string, 
  persona: 'teacher' | 'child', 
  segmented: boolean = false
): Promise<CachedAudioRecord | null> {
  try {
    const db = await getDB();
    const key = getAudioCacheKey(text, persona, segmented);

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => {
        const record = req.result as CachedAudioRecord | undefined;
        if (record) {
          memoryIndexSet.add(key);
          resolve(record);
        } else {
          resolve(null);
        }
      };

      req.onerror = () => {
        resolve(null);
      };
    });
  } catch (e) {
    return null;
  }
}

/**
 * Saves a generated audio record to IndexedDB and updates the memory index
 */
export async function saveCachedAudio(
  text: string,
  persona: 'teacher' | 'child',
  segmented: boolean,
  audioBase64: string,
  mimeType: string = "audio/wav",
  sampleRate: number = 24000,
  source: 'gemini_tts' | 'speech_capture' = 'gemini_tts'
): Promise<boolean> {
  try {
    const db = await getDB();
    const key = getAudioCacheKey(text, persona, segmented);

    const record: CachedAudioRecord = {
      key,
      text: text.trim(),
      persona,
      segmented,
      audioBase64,
      mimeType,
      sampleRate,
      source,
      timestamp: Date.now()
    };

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);

      req.onsuccess = () => {
        memoryIndexSet.add(key);
        resolve(true);
      };
      req.onerror = () => resolve(false);
    });
  } catch (e) {
    return false;
  }
}

/**
 * Retrieves comprehensive statistics about stored cached audio
 */
export async function getAudioCacheStats(): Promise<{ 
  count: number; 
  teacherCount: number;
  childCount: number;
  estimatedSizeKb: number;
  cachedKeys: string[];
}> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const records: CachedAudioRecord[] = req.result || [];
        const count = records.length;
        let teacherCount = 0;
        let childCount = 0;
        let totalBytes = 0;
        const cachedKeys: string[] = [];

        for (const r of records) {
          cachedKeys.push(r.key);
          memoryIndexSet.add(r.key);
          if (r.persona === 'child') childCount++;
          else teacherCount++;

          if (r.audioBase64) {
            totalBytes += r.audioBase64.length * 0.75;
          }
        }
        isMemoryIndexLoaded = true;

        resolve({
          count,
          teacherCount,
          childCount,
          estimatedSizeKb: Math.round(totalBytes / 1024),
          cachedKeys
        });
      };

      req.onerror = () => {
        resolve({ count: 0, teacherCount: 0, childCount: 0, estimatedSizeKb: 0, cachedKeys: [] });
      };
    });
  } catch (e) {
    return { count: 0, teacherCount: 0, childCount: 0, estimatedSizeKb: 0, cachedKeys: [] };
  }
}

/**
 * Clears all cached audio records from IndexedDB
 */
export async function clearAudioCache(): Promise<boolean> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();

      req.onsuccess = () => {
        memoryIndexSet.clear();
        resolve(true);
      };
      req.onerror = () => resolve(false);
    });
  } catch (e) {
    return false;
  }
}
