@extends('app')
@section('page_description', '')
@section('content')
  <h1>Stall der Zukunft</h1>
  <div class="mt-20">
    <audio controls id="audioPlayer">
      <source src="/audio/stall-der-zukunft.mp3" type="audio/mpeg">
    </audio>
    <div id="status" class="status"></div>
  </div>
@endsection