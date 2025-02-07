@extends('app')
@section('page_description', '')
@section('content')
<h1>Kapelle</h1>
<div class="mt-20">
  <audio controls id="audioPlayer">
    <source src="/audio/kapelle.mp3" type="audio/mpeg">
  </audio>
  <div id="status" class="status"></div>
</div>
@vite('resources/js/db.js')
@vite('resources/js/station.js')
<script>
  // add document ready listener with vanilla js
  document.addEventListener('DOMContentLoaded', function() {
    loadStationAudio('kapelle.mp3');
  });
</script>
@endsection