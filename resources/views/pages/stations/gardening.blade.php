@extends('app')
@section('page_description', '')
@section('content')
  <h1>Gartenbaukunst</h1>
  <div class="mt-20">
    <audio controls id="audioPlayer">
      <source src="/audio/gartenbaukunst.mp3" type="audio/mpeg">
    </audio>
    <div id="status" class="status"></div>
  </div>
@endsection