<?php

if (!function_exists('statusOrder')) {
    function statusOrder(?string $status): string
    {
        $key = 'messages.order.status.' . $status;

        $translated = __($key);

        if ($translated !== $key) {
            return $translated;
        }

        return $status ? ucfirst(str_replace('_', ' ', $status)) : '-';
    }
}

if (!function_exists('statusPembayaran')) {
    function statusPembayaran(?string $status): string
    {
        $key = 'messages.payment.status.' . $status;

        $translated = __($key);

        if ($translated !== $key) {
            return $translated;
        }

        return $status ? ucfirst(str_replace('_', ' ', $status)) : '-';
    }
}

if (!function_exists('statusOrderLabel')) {
    function statusOrderLabel(?string $status, ?string $fulfillmentType = 'delivery'): string
    {
        $type = $fulfillmentType ?? 'delivery';
        $key = "messages.fulfillment.{$type}.{$status}";

        $translated = __($key);

        if ($translated !== $key) {
            return $translated;
        }

        return statusOrder($status);
    }
}
