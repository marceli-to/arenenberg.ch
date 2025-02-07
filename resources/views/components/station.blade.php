<div class="mt-20">
  <audio controls id="audioPlayer">
    <source type="audio/mpeg">
  </audio>
  <div id="status" class="status"></div>
</div>
<script>
  async function loadStationAudio(fileName) {
    const audioElement = document.getElementById('audioPlayer');
    
    try {
      //showStatus('Loading audio...', 'info');
      await initDB(); // Ensure DB is initialized
      const audioData = await getAsset(fileName);
      
      if (audioData) {
        // Log the first few bytes to verify the data
        const dataView = new DataView(audioData);
        const firstBytes = [];
        for (let i = 0; i < Math.min(4, audioData.byteLength); i++) {
          firstBytes.push(dataView.getUint8(i).toString(16).padStart(2, '0'));
        }
        console.log(`First bytes of audio file: ${firstBytes.join(' ')}`);
  
        // Create blob with explicit MIME type
        const blob = new Blob([audioData], { type: 'audio/mpeg' });
        console.log('Blob size:', blob.size, 'bytes');
  
        // Revoke any existing object URL
        if (audioElement.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioElement.src);
        }
  
        const url = URL.createObjectURL(blob);
        audioElement.src = url;
        
        // Add event listeners to verify loading
        audioElement.addEventListener('loadeddata', () => {
          //showStatus('Audio loaded successfully', 'success');
          console.log('Audio loaded successfully');
        });
        
        audioElement.addEventListener('error', (e) => {
          const error = e.target.error;
          console.error('Audio error:', error);
          showStatus(`Audio loading error: ${error.message}`, 'error');
        });
  
        // Add canplay listener
        audioElement.addEventListener('canplay', () => {
          console.log('Audio can be played');
        });
      } 
      else {
        showStatus('Audio file not found in cache', 'error');
      }
    } 
    catch (error) {
      console.error('Error in loadStationAudio:', error);
      showStatus(`Error loading audio: ${error}`, 'error');
    }
  }
  
  function showStatus(message, type = 'info') {
    const statusElement = document.getElementById('status');
    if (statusElement) {
      statusElement.textContent = message;
      statusElement.className = `status ${type}`;
    }
  }
  </script>