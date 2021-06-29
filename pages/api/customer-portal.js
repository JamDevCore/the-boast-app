import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from "bson";
import getPlan from '../../utils/get-plan';

const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handler(req, res) {
    const { body } = req;
    const { db  }= await connectToDatabase();

    // This is the url to which the customer will be redirected when they are done
    // managing their billing with the portal.
    const returnUrl = process.env.URL;
  
    const portalsession = await stripe.billingPortal.sessions.create({
      customer: body.customerId,
      return_url: `${returnUrl}/account`,
    });
    console.log(portalsession)
    res.send({
      url: portalsession.url,
    });
  }