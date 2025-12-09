import express from "express";
import Stripe from "stripe";

const router = express.Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a checkout session
router.post("/create-checkout-session", async (req, res) => {
  const { total_amount } = req.body;

  if (!total_amount) {
    return res.status(400).json({ error: "Missing order total" });
  }

  try {
    // Stripe wants amount in CENTS
    const amountInCents = Math.round(Number(total_amount) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Pops BBQ Order",
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url:
        "http://localhost:5173/order-confirmation?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/checkout?cancelled=true",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("STRIPE ERROR:", error);
    res.status(500).json({ error: "Stripe checkout failed" });
  }
});

export default router;
