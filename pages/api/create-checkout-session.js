import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from "bson";
import Stripe from 'stripe';
const stripe = Stripe(process.env.STRIPE_SK)


export default async function handler(req, res) {
    const { body } = req;
    const { db  }= await connectToDatabase();
    const { priceId, userId } = req.body;
    if(req.method === 'POST') {
    // See https://stripe.com/docs/api/checkout/sessions/create
    // for additional parameters to pass.
    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            // For metered billing, do not pass quantity
            quantity: 1,
          },
        ],
        // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
        // the actual Session ID is returned in the query parameter when your customer
        // is redirected to the success page.
        client_reference_id: userId,
        success_url: `${process.env.URL}/account?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.URL}/account`,
      });
      console.log(session)
      res.send({
        sessionId: session.id,
      });
    } catch (e) {
      console.log(e)
      res.status(400);
      return res.send({
        error: {
          message: e.message,
        }
      });
    }
  }
  res.end();
  }