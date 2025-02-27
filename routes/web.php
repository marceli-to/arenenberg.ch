<?php
use Illuminate\Support\Facades\Route;

Route::view('/', 'pages.home')->name('page.home');
Route::view('/stationen', 'pages.stations.index')->name('page.stations');
Route::view('/stationen/kapelle', 'pages.stations.chapel')->name('page.station.chapel');
Route::view('/stationen/stall-der-zukunft', 'pages.stations.stable')->name('page.station.stable');
Route::view('/stationen/gartenbaukunst', 'pages.stations.gardening')->name('page.station.gardening');