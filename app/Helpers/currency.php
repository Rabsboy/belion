<?php

if (!function_exists('formatRupiah')) {
    function formatRupiah(int|float $amount): string
    {
        return 'Rp ' . number_format((float) $amount, 0, ',', '.');
    }
}
