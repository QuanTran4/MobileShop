const router = require("express").Router();
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.get("/config", (req, res) => {
  res.status(200).send({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});
router.get("/retrieve/:id", async (req, res) => {
  try {
    console.log(req);
    const session = await stripe.checkout.sessions.retrieve(req.params.id);
    res.status(200).send(session);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.post("/create-payment-intent", async (req, res) => {
  const { user, cart, payment } = req.body;
  const line_items = cart.cartItems.map((item) => {
    return {
      price_data: {
        currency: "VND",
        product_data: {
          name: item.name + item.color,
          images: [item.thumbnail],
          metadata: {
            id: item._id,
          },
        },
        unit_amount: item.price,
      },
      quantity: item.cartQuantity,
    };
  });
  try {
    const session = await stripe.checkout.sessions.create({
      line_items,
      payment_method_types: ["card"],
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ["VN"],
      },
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });
    res.status(200).send({ url: session.url });
  } catch (e) {
    console.log(e);
    return res.status(400).send(e);
  }
});

module.exports = router;
