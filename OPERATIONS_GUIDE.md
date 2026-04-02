# Bahja - Business Operations Guide

This guide details the complex order fulfillment network occurring between the Customer and Administrator roles.

---

## The Appointment Flow Lifecycle

Every requested service triggers a multi-stage data state loop securely tracking the intention of both the Customer and the localized Service Provider (Admin).

### 1. `SUBMITTED`
When a customer discovers a provider via the cascading Daira Location Filter and books a service, an order is generated internally and stamped as `SUBMITTED`. 
*   **Customer View:** Waits for the business to establish availability.
*   **Admin View:** Shows directly in the "إدارة الحجوزات" (Order Management) dashboard. The Admin can verify their availability offline.

### 2. The Trigger mechanism -> `AWAITING_PAYMENT`
When the Admin proves availability, they press **"تأكيد الموعد وطلب الدفع" (Confirm Appointment & Request Payment)**.
This instantly alters the order state to `AWAITING_PAYMENT` via Supabase Realtime subscriptions.

---

## Payment Gateways & Cash Resolution

Upon entering the `AWAITING_PAYMENT` state, the Customer's interface pops a specialized **Pay Now** Button which initiates a secure Modal requesting a commitment layer.

### Flow A: The Edhahabia (Card) Gateway
If the customer selects to pay online via Edhahabia/CIB:
1. The app renders a 3-second animated processing UI mimicking a network gateway transaction securely communicating with backend validators.
2. Upon success, a crisp green `Lucide` Checkmark appears.
3. The Order definitively switches to `PAID`. (Revenue aggregates automatically adjust upwards dynamically on the Admin's analytics dashboard).

### Flow B: The "Cash at Arrival" Route
If the customer wishes to pay physically, they select Cash:
1. The app shifts the order into the special `CASH_PENDING` state.
2. The user sees a bold orange banner advising them to retain their cash for arrival.
3. **Admin Verification:** The Admin dashboard detects this `CASH_PENDING` state. Because actual revenue metrics shouldn't climb until the platform functionally nets the capital, the Admin order card transforms to display a secure green **"Confirm Receipt of Cash Verification"** action button.
4. Only when the Administrator physically completes the job, receives the cash context, and pushes that button does the transaction definitively conclude its lifecycle into `PAID`.
