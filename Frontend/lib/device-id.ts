/**
 * Generates a persistent device ID using IndexedDB (more secure than localStorage)
 * Falls back to localStorage if IndexedDB is not available
 */

const DB_NAME = 'CreditJamboDB';
const DB_VERSION = 1;
const STORE_NAME = 'deviceData';
const DEVICE_ID_KEY = 'deviceId';
const FALLBACK_KEY = 'credit-jambo-device-id';

function generateFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.platform,
    navigator.cookieEnabled,
    canvas.toDataURL(),
  ].join('|');
  
  return fingerprint;
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

async function getFromIndexedDB(): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(DEVICE_ID_KEY);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  } catch {
    return null;
  }
}

async function saveToIndexedDB(deviceId: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(deviceId, DEVICE_ID_KEY);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch {
    // Fallback to localStorage if IndexedDB fails
    localStorage.setItem(FALLBACK_KEY, deviceId);
  }
}

export async function getDeviceId(): Promise<string> {
  // Try IndexedDB first
  let deviceId = await getFromIndexedDB();
  
  // Fallback to localStorage
  if (!deviceId) {
    deviceId = localStorage.getItem(FALLBACK_KEY);
  }
  
  if (!deviceId) {
    // Generate new device ID
    const fingerprint = generateFingerprint();
    const hash = hashString(fingerprint);
    const timestamp = Date.now().toString(36);
    
    deviceId = `device-${hash}-${timestamp}-${Math.random().toString(36).substr(2, 6)}`;
    
    // Store in both IndexedDB and localStorage
    await saveToIndexedDB(deviceId);
    localStorage.setItem(FALLBACK_KEY, deviceId);
  }
  
  return deviceId;
}

export async function resetDeviceId(): Promise<string> {
  // Clear from both storages
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(DEVICE_ID_KEY);
  } catch {}
  
  localStorage.removeItem(FALLBACK_KEY);
  return await getDeviceId();
}