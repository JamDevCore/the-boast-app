import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/navbar';
import { useRouter } from 'next/router'
import { connectToDatabase } from '../../utils/mongodb';
import { signIn, signOut, getSession, jwt } from 'next-auth/client'
import { ObjectId } from 'bson';
import {
  AcademicCapIcon,
  BadgeCheckIcon,
  SpeakerphoneIcon,
  LightBulbIcon,
  HeartIcon,
  ReceiptRefundIcon,
  UsersIcon,
  CogIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/solid'

import {

  HeartIcon as HeartIconO,
} from '@heroicons/react/outline'
import axios from 'axios';

     
const icons = {
    question: () => <QuestionMarkCircleIcon className="w-6"/>,
    feature: () => <LightBulbIcon className="w-6"/>,
    news: () => <SpeakerphoneIcon className="w-6" />,

}

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const submitResponse = async (op, post) => {
      console.log('here')
    await axios.put('/api/posts', { post, option: op });
  }

  const likePost = async (post) => {
    console.log('here')
  await axios.put('/api/posts', { isLike: true, post });
}



const Question = ({ post, setIsAnswered,  isAnswered }) => {
    console.log(post)
    return(
        <div className="my-5 flex flex-col focus:outline-none active:outline-none">
            {!isAnswered ? post.options.map(op => {
                return  <button
                type="button"
                onClick={() => {
                  setIsAnswered(true)
                  submitResponse(op._id, post._id)
                }}
                className="active:focus:outline-none focus:outline-none cursor-pointer inline-flex max-w-md flex justify-center my-2 items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-non"
              >
                {op.label}
              </button>
            }) : <div><p>Thanks, your response has been submitted</p></div>}
        </div>
    );
}


const Post = ({ post, actionIdx, posts }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  return (
<div
          key={post.title}
          className={classNames(
            actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
            actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
            actionIdx === posts.length - 2 ? 'sm:rounded-bl-lg' : '',
            actionIdx === posts.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '',
            'relative group bg-white p-6 focus:outline-none'
          )}
        >
          <div className="focus:outline-none">
            <span
              className={classNames(
                'text-teal-700 bg-teal-50',
                'rounded-lg inline-flex ring-4 ring-white'
              )}
            >
                 {icons[post.type]()}
            </span>
          </div>
          <div className="mt-4 p-0">
            <h3 className="text-lg font-medium">
                {/* Extend touch target to entire panel */}
                {post.title}
            </h3>
            {post.type !== 'question' ? <p className="my-2 text-sm text-gray-500">
              {post.text}
            </p> : <div classname="focus:outline-none"><Question post={post} setIsAnswered={setIsAnswered} isAnswered={isAnswered} /></div>}
          
          </div>
            {post.link && <a target="_blank" href={post.link} className="focus:outline-none cursor-pointer">
          <span
            className="absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
            aria-hidden="true"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
            </svg>
            
          </span>
          </a>}
          {post.link && <a target="_blank" href={post.link} className="focus:outline-none text-indigo-500 underline text-sm cursor-pointer">Read more</a>}
          <button onClick={() => {
              if(!isLiked) {
              setIsLiked(true)
              likePost(post._id)
              }
            }} className="block ml-auto mr-0 focus:outline-none border-0 bg-white">{isLiked ? <HeartIcon className="outline-none mt-2 h-6 text-red-500"/> : <HeartIconO className="outline-none mt-2 h-6 text-red-500"/>}</button>
        </div>
  )
}

const Feed = ({ className , user, posts, isTrial }) => {
  console.log('eeeeee', isTrial)
  const [isIframe, setIsIframe] = useState(false);
  const [isTrialling, setIsTrialling] = useState(false)
  useEffect(() => {
    if(typeof window !== 'undefined') {
      const url = (window.location != window.parent.location) ? document.referrer : document.location.href;
      console.log(url, window.location.url)
      if (window.location !== window.parent.location) {
        setIsTrialling(isTrial);
      }
    }
  });
  // Sending the post
    console.log(posts)
  return(  
      <div className={className}>
    <header className="p-4 border-b-2 bg-indigo-600 text-white">What's new</header>
    <div className="p-0 focus:outline-none shadow divide-y divide-gray-200">
      {!isTrialling ? posts.map((post, actionIdx) => (<Post post={post} actionIdx={actionIdx} posts={posts} />))
      : <div>
                    <h4 className="p-4 text-md font-medium">
                {/* Extend touch target to entire panel */}
                This is a trial account. To use Boast in your website or app, select a premium plan or add a voucher code
            </h4></div>}

    </div>

  </div>
);
}


export async function getServerSideProps(ctx) {
    const { db } = await connectToDatabase();
    console.log(ctx.query.id)
    const user = await db.collection('users').findOne({ _id: ObjectId(ctx.query.id) });
    console.log('hello', await user);

      const post = await db.collection('posts').find({ userId: ObjectId(ctx.query.id)})
      console.log(user)
      const isTrial = user.vouchers && user.vouchers.length > 0 ? false : true;
      console.log(await post.toArray())
      return {
        props: {
          posts: JSON.parse(JSON.stringify(await post.toArray())),
          isTrial,
        },
      }
  }


export default styled(Feed)`
height: 100vh;
background: white;
`