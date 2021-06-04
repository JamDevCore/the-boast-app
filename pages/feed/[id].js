import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/navbar';
import { useRouter } from 'next/router'
import { connectToDatabase } from '../../utils/mongodb';
import { signIn, signOut, getSession, jwt } from 'next-auth/client'
import { ObjectId } from 'bson';
import {
  AcademicCapIcon,
  BadgeCheckIcon,
  CashIcon,
  ClockIcon,
  HeartIcon,
  ReceiptRefundIcon,
  UsersIcon,
  CogIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/outline'
import axios from 'axios';

     
const icons = {
    question: () => <QuestionMarkCircleIcon className="w-6"/>,
    feature: () => <CogIcon className="w-6"/>,
    news: () => <AcademicCapIcon className="w-6" />,

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



const Question = (post) => {
    console.log(post)
    return(
        <div className="my-5 flex flex-col">
            {post.post.options.map(op => {
                return  <button
                type="button"
                onClick={() => submitResponse(op._id, post.post._id)}
                className="cursor-pointer inline-flex max-w-md flex justify-center my-2 items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {op.label}
              </button>
            })}
        </div>
    );
}


const Feed = ({ className , user, posts }) => {
  // Sending the post
    console.log(posts)
  return(  
      <div className={className}>
    <header className="p-4  border-b-2 bg-indigo-600 text-white">What's new</header>
    <div className="rounded-lg bg-gray-200 overflow-hidden shadow divide-y divide-gray-200">
      {posts.map((post, actionIdx) => (
        <div
          key={post.title}
          className={classNames(
            actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
            actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
            actionIdx === posts.length - 2 ? 'sm:rounded-bl-lg' : '',
            actionIdx === posts.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '',
            'relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
          )}
        >
          <div>
            <span
              className={classNames(
                'text-teal-700 bg-teal-50',
                'rounded-lg inline-flex ring-4 ring-white'
              )}
            >
                 {icons[post.type]()}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium">
                {/* Extend touch target to entire panel */}
                {post.title}
            </h3>
            {post.type !== 'question' ? <p className="mt-2 text-sm text-gray-500">
              {post.text}
            </p> : <div><Question post={post}/></div>}
            <button onClick={() => likePost(post._id)}className="border-0 bg-white"><HeartIcon className="mt-5 h-6"/></button>
          </div>
            <a href={post.link} className="focus:outline-none cursor-pointer">
          <span
            className="absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
            aria-hidden="true"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
            </svg>
            
          </span>
          </a>
        </div>
      ))}
    </div>

  </div>
);
}


export async function getServerSideProps(ctx) {
    const { db } = await connectToDatabase();
    console.group()
    const post = await db.collection('posts').find({ userId: ObjectId(ctx.query.id )})
    console.log(await post.toArray())
    return {
      props: {
        posts: JSON.parse(JSON.stringify(await post.toArray())),
      },
    }
  }


export default Feed