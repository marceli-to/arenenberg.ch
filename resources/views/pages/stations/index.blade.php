@extends('app')
@section('page_description', '')
@section('content')
  <h1>Stationen</h1>
  <nav class="mt-20">
    <ul class="flex flex-col gap-y-5">
      <li>
        <a href="{{ route('page.station.chapel') }}">Kapelle</a>
      </li>
      <li>
        <a href="{{ route('page.station.stable') }}">Stall der Zukunft</a>
      </li>
      <li>
        <a href="{{ route('page.station.gardening') }}">Gartenbaukunst</a>
      </li>
    </ul>
  </nav>
@endsection