import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from "bson";
import getPlan from '../../utils/get-plan';

const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handler(req, res) {
    const { body } = req;
    const { db  }= await connectToDatabase();
  let data;
  let eventType;
  // Check if webhook signing is configured.
  if (process.env.webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];
    console.log(signature)
    try {
      event = await stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.WEBHOOK_SECRET
      );
    } catch (err) {
        console.log(err)
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.send(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }
  try {

  switch (eventType) {
      case 'checkout.session.completed':
        console.log(data, eventType)
            // Payment is successful and the subscription is created.
            // You should provision the subscription and save the customer ID to your database.
        const customerId = data.object.customer;
           const email = data.object.customer_details.email;
           await db.collection('users').updateOne({ _id: ObjectId(data.object.client_reference_id) }, {
            $set: {
              billingEmail: email,
              customerId: customerId,
              subscriptionId: data.object.subscription,
            },
           })
        break;
      case 'customer.subscription.created':
        console.log('eeeeeeerrtt4etqe', data)
        await db.collection('users').updateOne({ customerId: data.object.customer }, {
         $set: {
           plan: getPlan(data.object.plan.id),
           subscriptionStartDate: new Date(),
           subscriptionPeriodStart: new Date(),
         },
        })

        break;
        case 'customer.subscription.updated':
          await db.collection('users').updateOne({ customerId: data.object.customer }, {
           $set: {
             plan: getPlan(data.object.plan.id),
           },
          })
  
          break;
          case 'customer.subscription.deleted':
            await db.collection('users').updateOne({ customerId: data.object.customer }, {
             $set: {
               plan: '',
               subscriptionStartDate:'',
               subscriptionPeriodStart: '',
             },
            })
    
            break;

      case 'invoice.paid':
        // Continue to provision the subscription as payments continue to be made.
        // Store the status in your database and check when a user accesses your service.
        // This approach helps you avoid hitting rate limits.
        break;
      case 'invoice.payment_failed':
        // The payment failed or the customer does not have a valid payment method.
        // The subscription becomes past_due. Notify your customer and send them to the
        // customer portal to update their payment information.
        break;
      default:
      // Unhandled event type
    }
  } catch (err) {
    console.log(err)
  }
  res.send(200);
}