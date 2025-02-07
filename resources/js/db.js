// IndexedDB setup and operations
const DB_NAME = 'ArenenbergPWA';
const DB_VERSION = 1;
const STORE_NAME = 'arenenbergAssets';

let db;

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'fileName' });
        store.createIndex('type', 'type', { unique: false });
      }
    };
  });
};

const storeAsset = async (fileName, arrayBuffer, type) => {
  if (!db) {
    await initDB();
  }
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ 
      fileName, 
      data: arrayBuffer,
      type, // 'audio' or 'image'
      timestamp: new Date().toISOString()
    });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const getAsset = async (fileName) => {
  if (!db) {
    await initDB();
  }
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(fileName);

    request.onsuccess = () => resolve(request.result?.data);
    request.onerror = () => reject(request.error);
  });
};

// Helper function to store audio specifically
const storeAudio = (fileName, arrayBuffer) => storeAsset(fileName, arrayBuffer, 'audio');

// Helper function to store image specifically
const storeImage = (fileName, arrayBuffer) => storeAsset(fileName, arrayBuffer, 'image');

// Export the functions
window.initDB = initDB;
window.storeAudio = storeAudio;
window.storeImage = storeImage;
window.getAsset = getAsset;