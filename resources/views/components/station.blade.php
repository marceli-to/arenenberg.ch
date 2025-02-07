<div class="mt-20">
  <audio controls id="audioPlayer">
    <source type="audio/mpeg">
  </audio>
  <div id="status" class="status"></div>
</div>
@vite('resources/js/station.js')
<script>
  loadStationAudio('kapelle.mp3');
</script>