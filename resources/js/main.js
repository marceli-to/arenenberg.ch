// import './bootstrap';

// Initialize IndexedDB and cache audio files on homepage load
initDB().then(async () => {
  showStatus('Loading audio files...', 'info');
  try {
    // Preload both audio files
    await preloadAudioFiles(['station1.mp3', 'station2.mp3']);
    showStatus('All audio files cached for offline use', 'success');
  } catch (error) {
    showStatus(`Error caching audio files: ${error}`, 'error');
  }
}).catch(error => {
  showStatus(`Database error: ${error}`, 'error');
});

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('ServiceWorker registration successful');
      showStatus('App ready for offline use', 'success');
    })
    .catch(err => console.log('ServiceWorker registration failed: ', err));
}

async function preloadAudioFiles(fileNames) {
  for (const fileName of fileNames) {
    try {
      // Check if audio is already in IndexedDB
      const existingAudio = await getAsset(fileName);
      if (!existingAudio) {
        // If not in IndexedDB, fetch and store it
        const response = await fetch(fileName);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Verify content type
        const contentType = response.headers.get('content-type');
        console.log(`Content-Type for ${fileName}:`, contentType);
        
        const audioData = await response.arrayBuffer();
        console.log(`Received ${audioData.byteLength} bytes for ${fileName}`);
        
        // Log the first few bytes to verify the data
        const dataView = new DataView(audioData);
        const firstBytes = [];
        for (let i = 0; i < Math.min(4, audioData.byteLength); i++) {
          firstBytes.push(dataView.getUint8(i).toString(16).padStart(2, '0'));
        }
        console.log(`First bytes of ${fileName}: ${firstBytes.join(' ')}`);
        
        await storeAudio(fileName, audioData);
        console.log(`Cached ${fileName}`);
      }
    } catch (error) {
      console.error(`Error preloading ${fileName}:`, error);
      throw error;
    }
  }
}

function showStatus(message, type = 'info') {
  const statusElement = document.getElementById('status');
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.className = `status ${type}`;
  }
}