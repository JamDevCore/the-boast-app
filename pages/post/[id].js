import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/navbar';
import { connectToDatabase } from '../../utils/mongodb';
import { signIn, signOut, getSession, jwt } from 'next-auth/client'
import { ObjectId } from 'bson';
import { useRouter } from 'next/router'
import axios from 'axios';
import { PlusIcon as PlusIconSolid, XIcon } from '@heroicons/react/solid';
import { PlusIcon as PlusIconOutline } from '@heroicons/react/outline'

const apiKey = process.env.GATSBY_DOOPOLLAPI;

const editPost = async(post) => {
    console.log(post)
    await axios.put('/api/posts', { post, status:'updatePost' });
}

const NewPost = ({ className , user, post }) => {
  const router = useRouter()
  const [heading, setHeading] = useState(post.title);
  const [headingFocused, setHeadingFocused] = useState(false);
  const [link, setLink] = useState(post.link);
  const [linkFocused, setLinkFocused] = useState(false);
  const [text, setText] = useState(post.text);
  const [textFocused, setTextFocused] = useState(false);
  const [type, setType] = useState(post.type);
  const [questionFocused, setQuestionFocused] = useState(false);
  const [questionStyle, setQuestionStyle] = useState(post.questionStyle);
  const [isLoading, setLoading] = useState(false);
  const [options, setOptions] = useState({})
  const [optionNumber, setOptionNumber] = useState(post.options.length);
  useEffect(() => {
    const opObject = {};
    post.options.forEach((op,index) => {
      opObject[`option${index}`] = {label: op.label, _id: op._id };
    });
    setOptions(opObject)
  }, [])
  // Sending the post
  useEffect(() => {

  }, [optionNumber])
  return(
      <div className={className}>
          <div className="Container">
              <Navbar userId={user.user.id} />
<div className="m-4 p-8 sm:w-full lg:w-2/3">

    <form className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Your post</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create & edit your post
            </p>
          </div>
          <div className="pt-2">

<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">


  <div className="col-span-6 w-full">
    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
      Type
    </label>
    <div className="mt-1 w-full">
      <select
        className="shadow-sm p-2 w-full focus:ring-indigo-500 focus:border-indigo-500 block border border-gray-300 w-full sm:text-sm border-gray-300 rounded-md"
               defaultValue={post.type}
               onChange={(e) => setType(e.target.value)}
               >
               {type !== 'question' && 'post' && (
                   <>
               <option value="feature">Feature</option>
               <option value="news">News</option>
               </>)}
               <option value="question">Question</option>
      

      </select>
    </div>
  </div>



</div>
</div>


          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="col-span-6" >
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <div className="mt-1 flex rounded-md shadow-sm border-gray-300 border p-2">
                <input
                    type="text"
                    name="title"
                    defaultValue={heading}
                    onBlur={() => setHeadingFocused(false)}
                    onFocus={() => setHeadingFocused(true)}
                    onChange={(e) => setHeading(e.target.value)}
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                />
              </div>
            </div>

            <div className="col-span-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Link
              </label>
              <div className="mt-1 flex rounded-md shadow-sm border-gray-300 border p-2">
                <input
                type="text"
                    placeholder={!linkFocused ? "Link your users to a blog post or specific page" : ''}
                    defaultValue={post.link}
                    onFocus={() => setLinkFocused(true)}
                    onBlur={() => setLinkFocused(false)}
                    onChange={(e) => setLink(e.target.value)}
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                />
              </div>
            </div>

            {type !== 'question' ? 
            <div className="flex flex-col col-span-6">
            <label htmlFor="about" className="block text-sm font-medium text-gray-700">
              Text
            </label>
            <div className="mt-1">
              <textarea
              rows={5}
                  placeholder={!textFocused ? "Add the main text in here" : ''}
                  defaultValue={""}
                  onBlur={() => setTextFocused(false)}
                  onFocus={() => setTextFocused(true)}
                  onChange={(e) => setText(e.target.value)}
                className="shadow-sm p-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              />
            </div>
            </div> : 
            <div className="col-span-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Options
            </label>
            {Object.keys(options).map((op, index) => (<div className="my-4 flex rounded-md shadow-sm border-gray-300 border p-2">
              <input
                  type="text"
                  name="title"
                  data-value={index}
                  defaultValue={options[op].label}
                  onChange={(e) => {
                      let currentOp = options;  
                      const newOp = `option${e.target.getAttribute('data-value')}`
                      currentOp[`option${e.target.getAttribute('data-value')}`].label = e.target.value
                      setOptions(options)
                  }}
                  onBlur={() => setHeadingFocused(false)}
                  onFocus={() => setHeadingFocused(true)}
                className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
              />
              {index !== 0 && <button id={`${index}-cancel-button`} type="button" data-value={index} onClick={(e) => {
                const target = document.getElementById(e.currentTarget.id)
                const newOptions = options;
                delete newOptions[`option${e.target.getAttribute('data-value')}`];
                setOptions(newOptions)
                setOptionNumber(Object.keys(newOptions).length)
              }}><XIcon  className="h-5 w-5" aria-hidden="true"/></button>}
            </div>))}
            <button
              type="button"
              onClick={async () => {
                const newOptions = JSON.parse(JSON.stringify(options));
                console.log(newOptions, Object.keys(newOptions).length)
                newOptions[`option${Object.keys(options).length}`] = { label : '' }
                console.log(newOptions, newOptions.length)
                await setOptions(newOptions);
                await setOptionNumber(Object.keys(newOptions).length)
              }}
              className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIconSolid className="h-5 w-5" aria-hidden="true" />
            </button>
            </div>}

          </div>
        </div>



      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
               editPost({
                title: heading,
                text,
                _id: post._id,
                link,
                type,
                questionStyle,
                userId: user.user.id,
                options: Object.keys(options).map(op => options[op]),
               });
               router.push('/dashboard');
            }}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </form>
    </div>

                </div>

            </div>
);
}


export async function getServerSideProps(ctx) {
    const session = await getSession(ctx)
    console.log('session', session)
    if (!session) {
      ctx.res.writeHead(302, { Location: '/' })
      ctx.res.end()
      return {}
    }
    const { db } = await connectToDatabase();
    const post = await db.collection('posts').findOne({ _id: ObjectId(ctx.query.id )})
    console.log(post)
    return {
      props: {
        user: session,
        post: JSON.parse(JSON.stringify(post)),
      },
    }
  }


export default styled(NewPost)`

`;
