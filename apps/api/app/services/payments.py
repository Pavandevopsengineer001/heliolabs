import json
from typing import Any

import stripe

from app.core.config import settings
from app.models.order import Order, OrderItem

stripe.api_key = settings.stripe_secret_key


class PaymentService:
    def create_checkout_session(
        self,
        *,
        order: Order,
        items: list[OrderItem],
        success_url: str | None,
        cancel_url: str | None,
    ) -> Any:
        return stripe.checkout.Session.create(
            mode="payment",
            customer_email=order.email,
            client_reference_id=str(order.id),
            metadata={"order_id": str(order.id)},
            success_url=success_url or f"{settings.frontend_url}/checkout?status=success&session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=cancel_url or f"{settings.frontend_url}/checkout?status=cancelled",
            line_items=[
                {
                    "price_data": {
                        "currency": order.currency,
                        "unit_amount": item.unit_price_cents,
                        "product_data": {
                            "name": item.product_name,
                            "images": [item.image_url],
                        },
                    },
                    "quantity": item.quantity,
                }
                for item in items
            ],
        )

    def construct_event(self, payload: bytes, signature: str | None) -> dict[str, Any]:
        if signature and settings.stripe_webhook_secret not in {"", "whsec_placeholder"}:
            event = stripe.Webhook.construct_event(payload=payload, sig_header=signature, secret=settings.stripe_webhook_secret)
            return dict(event)
        return json.loads(payload.decode("utf-8"))

