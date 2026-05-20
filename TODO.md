# Quick Feast - TODO

## Done
- Midtrans payment flow: created `MidtransPaymentController`, routes, and `midtrans-snap` view.
- Checkout controller updated to accept only `payment_method=midtrans`.

## Pending
1. Seeder test drive ordering
   - Ensure `CategorySeeder`, `ProductSeeder`, `CouponSeeder`, `SettingSeeder` are present.
   - Ensure `DatabaseSeeder` calls them.

2. Staff role + POS-like UI
   - Add `staff` role in seeders (and update roles/guard if needed).
   - Create staff pages/routes (e.g. staff dashboard showing orders for in-store service).
   - Build staff update status flow similar to admin orders.

3. Fix any missing email views if Pay success triggers them.

## Steps to test
- php artisan migrate:fresh --seed
- Login:
  - admin@example.com / password
  - customer@example.com / password
- Place order via checkout -> Midtrans

