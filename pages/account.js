import React, { useEffect } from "react";
import styled from 'styled-components';
import { signIn, signOut, getSession, jwt } from 'next-auth/client'
import axios from 'axios';
import Link from 'next/link'
import Navbar from '../components/navbar.js';
import Image from 'next/image'
import { connectToDatabase } from "../utils/mongodb";
// import NewPost from './new-post';
import Layout from '../components/layout';
import Posts from '../components/posts';
import { ObjectId } from "bson";
import Stripe from 'stripe';
import Alert, { openAlert} from 'simple-react-alert'
// import styled from 'styled-components';
// import Snippet from './snippet';
// import SEO from './seo';




function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


// const Menu = styled.div`
//   max-width: 250px;
// `

const redeemCode = async ({ voucher, userId, updateVouchers }) => {
  try {
    console.log(voucher, userId)
    const res = await axios.post('/api/codes', {
        userId,
        voucher,
  });
  openAlert({ message: "Success. Your voucher has been redeemed", type:"success" })
  return res
} catch(err) {
  openAlert({ message: "There was a problem submitting that voucher", type:"danger" })
  }
}

const createCheckoutSession = function(priceId, userId) {
  return axios.post("/api/create-checkout-session", {
      priceId,
      userId,
  }).then(function(result) {
    console.log(result)
    return result
  });
};

const updateBilling = (customerId) => {
    axios.post('/api/customer-portal', {
      customerId,
    })
      .then(function(response) {
        console.log('response', response.data)
        window.location.href = response.data.url;
      })
      .catch(function(error) {
        console.error('Error:', error);
      });
  }



const Account = ({ className, user, userObject, vouchers }) => {
  console.log(user)
  const checkout = ({ priceId }) => {
    let stripe = window.Stripe(process.env.PRIVATE_STRIPE_KEY);
    console.log(priceId)
    createCheckoutSession(priceId, user.user.id).then(function(result) {
       console.log('dwdqdwd', result)
      // Call Stripe.js method to redirect to the new Checkout page
      stripe
        .redirectToCheckout({
          sessionId: result.data.sessionId
        })
        .then((res) => {
        });
    });
  }
  useEffect(() => {

  })
  console.log(vouchers)
      return (
    <div>
      <Navbar userId={user.user.id} />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="w-2/3 m-4 bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Account settings</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Update your settings and redeem voucher codes</p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        {userObject&& userObject.plan ? <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Manage your billing</dt>
            <dd className="mt-1 text-sm text-gray-900">

     <dt className="text-sm font-medium text-gray-500">             {`You're currently on a ${userObject.plan ? userObject.plan : 'free'} plan`}</dt>
            <button
            onClick={() => updateBilling(userObject.customerId)}
        type="button"
        className="mt-4 inline-flex mr-2 items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Update billing
      </button>
            </dd>
          </div>
          : <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Manage your billing</dt>
            <dd className="mt-1 text-sm text-gray-900">
                <form>
     <dt className="text-sm font-medium text-gray-500">             {`You're currently on a free plan`}</dt>
            <button
            onClick={() => checkout({ priceId: 'price_1J7gNfETToi486WgGBLjy8g5'})}
        type="button"
        className="mt-4 inline-flex mr-2 items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            5000 views p/m
      </button>
      <button
        type="button"
        onClick={() => checkout({ priceId: 'price_1J7gODETToi486WgfELgV1KC'})}
        className="mt-4 inline-flex mr-2 items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            10,000 views p/m
      </button>
      <button
         onClick={() => checkout({ priceId: 'price_1J7gOYETToi486WgxSW0Yazm'})}
        type="button"
        className="mt-4 inline-flex mr-2 items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Unlimited
      </button>
        </form>
            </dd>
          </div>}
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Add one code in at a time to redeem</dt>
            <dd className="mt-1 text-sm mr-2text-gray-900">
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  await redeemCode({ voucher: document.querySelector('#voucher').value, userId: user.user.id  })}}>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Voucher codes
              </label>
              <div className="my-3 flex rounded-md shadow-sm border-gray-300 border p-2">
                <input
                   id="voucher"
                    type="text"
                    name="voucher"
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                />
              </div>
            <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Redeem
      </button>
        </form>
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <ul className="p-2 divide-y divide-gray-200">
      {vouchers.map((voucher) => (
        <li
          key={voucher.id}
          className="relative bg-white py-5 px-4 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
        >
          <div className="flex justify-between space-x-3">
            <div className="min-w-0 flex-1">
              <a href="#" className="block focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900 truncate">{voucher.deal || "AppSumo"}</p>
                <p className="text-sm text-gray-500 truncate">{voucher.summary || "You can have unlimited views"}</p>
              </a>
            </div>
            <time dateTime={voucher.timestamp || new Date()} className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500">
              {voucher.timestamp || new Date().toString()}
            </time>
          </div>
          <div className="mt-1">
            <p className="line-clamp-2 text-sm text-gray-600">{voucher.other || "Other info"}</p>
          </div>
        </li>
      ))}
    </ul>
        </div>
      </main>
      <Alert />
    </div>
      );
    }

    

export default styled(Account)`
width: 100%;
height: 100%;
margin: 0;
padding: 0;
body {
    width: 100%;
}
  background-image: url('/cool-background.svg');
  .Page {
    max-width: 900px;
    margin: 0 auto;
    h1 {
      margin: 30px;
      margin-left: 0;
      text-align:center;
    }
    @media(min-width:720px) {
      h1 {
        text-align:left;
      }
    }
  }
  
  .accredit {
    margin-top: 20px;
    font-size: 12px;
    text-align: center;
  }
  .icon {
    height: 30px;
    margin: 0;
    padding: 0;
  }
`;


export async function getServerSideProps(ctx) {
    const session = await getSession(ctx)
    console.log('session', session)
    if (!session) {
      ctx.res.writeHead(302, { Location: '/' })
      ctx.res.end()
      return {}
    }
    const { db } = await connectToDatabase();
    const vouchers = await db
      .collection("vouchers")
      .find({ userId: session.user.id })
      .toArray();
      const userObject = await db
      .collection("users")
      .findOne({ _id: ObjectId(session.user.id)})
      console.log(userObject)
    return {
      props: {
        userObject: JSON.parse(JSON.stringify(userObject)),
        user: session,
        vouchers: JSON.parse(JSON.stringify(vouchers)),
      },
    }
  }