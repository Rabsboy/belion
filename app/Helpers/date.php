<?php

use Carbon\Carbon;

if (!function_exists('formatTanggal')) {
    function formatTanggal(Carbon|string|null $date): string
    {
        if (!$date) return '-';

        Carbon::setLocale('id');

        $carbon = $date instanceof Carbon ? $date : Carbon::parse($date);

        return $carbon->translatedFormat('j F Y, H:i');
    }
}
