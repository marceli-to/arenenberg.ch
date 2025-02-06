@extends('app')
@section('page_description', '')
@section('content')
  <h1>Kapelle</h1>
  <div class="mt-20">
    <audio controls>
      <source src="/audio/kapelle.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
  </div>
@endsection