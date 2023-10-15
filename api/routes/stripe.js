const router = require("express").Router();
const dotenv = require('dotenv');
dotenv.config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      receipt_email:req.body.email,
      // customer:req.body.user,
      amount: req.body.amount,
      currency: "vnd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        console.log('err122',stripeErr);
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;
