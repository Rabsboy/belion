<?php

namespace App\Policies;

use App\Models\User;
use App\Features\Orders\Models\Order;

class OrderPolicy
{
    public function view(User $user, Order $order): bool
    {
        return $order->user_id === $user->id;
    }

    public function viewAny(User $user): bool
    {
        return in_array($user->role, [User::ROLE_CUSTOMER, User::ROLE_ADMIN, User::ROLE_STAFF]);
    }
}
