<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DeliveryFeeService
{
    const RATE_PER_KM = 3000;
    const MAX_DISTANCE_KM = 10;

    private string $osmBaseUrl;
    private float $storeLat;
    private float $storeLng;

    public function __construct()
    {
        $this->osmBaseUrl = rtrim((string) config('services.osm.base_url', 'https://nominatim.openstreetmap.org'), '/');
        $this->storeLat = (float) config('services.osm.store_lat', -6.2800);
        $this->storeLng = (float) config('services.osm.store_lng', 106.8700);
    }

    public function getStoreLocation(): array
    {
        return ['lat' => $this->storeLat, 'lng' => $this->storeLng];
    }

    public function geocodeAddress(string $address): array
    {
        $url = $this->osmBaseUrl . '/search';

        $response = Http::withHeaders([
            'User-Agent' => 'QuickFeast/1.0 (food-ordering-app)',
            'Accept-Language' => 'id',
        ])->get($url, [
            'q' => $address,
            'format' => 'json',
            'limit' => 1,
        ]);

        if ($response->failed()) {
            Log::error('OSM geocoding failed', ['status' => $response->status(), 'body' => $response->body()]);
            throw new \Exception('Gagal menghitung lokasi. Silakan periksa alamat Anda.');
        }

        $data = $response->json();

        if (empty($data)) {
            throw new \Exception('Alamat tidak ditemukan. Silakan periksa kembali alamat Anda.');
        }

        $location = $data[0];

        return [
            'lat' => (float) $location['lat'],
            'lng' => (float) $location['lon'],
            'display_name' => $location['display_name'] ?? $address,
        ];
    }

    public function calculateDistance(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earthRadius = 6371;

        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLng / 2) * sin($dLng / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    public function calculateDeliveryFee(string $address): array
    {
        $geocoded = $this->geocodeAddress($address);

        return $this->calculateFeeFromCoordinates($geocoded['lat'], $geocoded['lng'], $geocoded['display_name']);
    }

    public function calculateFeeFromCoordinates(float $lat, float $lng, ?string $displayName = null): array
    {
        $distanceKm = $this->calculateDistance(
            $this->storeLat, $this->storeLng,
            $lat, $lng
        );

        $roundedKm = (int) ceil($distanceKm);

        if ($roundedKm > self::MAX_DISTANCE_KM) {
            return [
                'within_range' => false,
                'distance_km' => round($distanceKm, 2),
                'rounded_km' => $roundedKm,
                'max_distance_km' => self::MAX_DISTANCE_KM,
                'delivery_fee' => 0,
                'lat' => $lat,
                'lng' => $lng,
                'display_name' => $displayName,
                'error' => 'Maaf, jarak pengiriman maksimal ' . self::MAX_DISTANCE_KM . ' KM. Jarak Anda ' . number_format($distanceKm, 1) . ' KM.',
            ];
        }

        $fee = $roundedKm * self::RATE_PER_KM;

        return [
            'within_range' => true,
            'distance_km' => round($distanceKm, 2),
            'rounded_km' => $roundedKm,
            'max_distance_km' => self::MAX_DISTANCE_KM,
            'delivery_fee' => $fee,
            'lat' => $lat,
            'lng' => $lng,
            'display_name' => $displayName,
            'error' => null,
        ];
    }

    public function searchAddress(string $query): array
    {
        $url = $this->osmBaseUrl . '/search';

        $response = Http::withHeaders([
            'User-Agent' => 'QuickFeast/1.0 (food-ordering-app)',
            'Accept-Language' => 'id',
        ])->get($url, [
            'q' => $query,
            'format' => 'json',
            'limit' => 5,
            'addressdetails' => 1,
        ]);

        if ($response->failed()) {
            Log::error('OSM address search failed', ['status' => $response->status()]);
            return [];
        }

        return collect($response->json())->map(fn ($item) => [
            'display_name' => $item['display_name'] ?? '',
            'lat' => (float) $item['lat'],
            'lon' => (float) $item['lon'],
        ])->toArray();
    }

    public function reverseGeocode(float $lat, float $lng): string
    {
        $url = $this->osmBaseUrl . '/reverse';

        $response = Http::withHeaders([
            'User-Agent' => 'QuickFeast/1.0 (food-ordering-app)',
            'Accept-Language' => 'id',
        ])->get($url, [
            'lat' => $lat,
            'lon' => $lng,
            'format' => 'json',
        ]);

        if ($response->failed()) {
            Log::error('OSM reverse geocoding failed', ['status' => $response->status()]);
            throw new \Exception('Gagal mendapatkan alamat. Silakan coba lagi.');
        }

        $data = $response->json();

        if (empty($data) || !isset($data['display_name'])) {
            throw new \Exception('Alamat tidak ditemukan untuk lokasi ini.');
        }

        return $data['display_name'];
    }
}
