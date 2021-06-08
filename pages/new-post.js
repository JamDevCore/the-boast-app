import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../components/navbar';
import { useRouter } from 'next/router'
import { signIn, signOut, getSession, jwt } from 'next-auth/client'
import axios from 'axios';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';

const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid grey;
  background: white;
  margin: 0 auto 10px 0;
  border-radius: 3px;
  padding: 10px;
  font-family: Quicksand;
  box-sizing: border-box;
`
const Textarea = styled.textarea`
  width: 100%;
  height: 200px;
  border: 1px solid grey;
  background: white;
  margin: 0 auto 10px 0;
  border-radius: 3px;
  padding: 10px;
  font-family: Quicksand;
  box-sizing: border-box;
`

const Select = styled.select`
  min-width: 200px;
  max-width: 310px;
  height: 40px;
  border: 1px solid grey;
  background: white;
  margin: 0 auto 10px 0;
  border-radius: 3px;
  padding: 10px 5px;
  font-family: Quicksand;
  box-sizing: border-box;
`

const Button = styled.button`
  border: none;
  background-color:#4bb543;
  padding: 5px 10px;
  font-family: Quicksand;
  border-radius: 6px;
  min-width: 120px;
  max-width: 300px;
  color: white;
  margin-top: 30px;
  box-sizing: border-box;
`
const apiKey = process.env.GATSBY_DOOPOLLAPI;

const createNewPost = async(post) => {
    await axios.post('/api/posts', { post })
    return
}


const NewPost = ({ className , user, post }) => {
  const router = useRouter()
  const [heading, setHeading] = useState();
  const [headingFocused, setHeadingFocused] = useState(false);
  const [link, setLink] = useState('');
  const [linkFocused, setLinkFocused] = useState(false);
  const [text, setText] = useState('');
  const [textFocused, setTextFocused] = useState(false);
  const [type, setType] = useState('feature');
  const [questionFocused, setQuestionFocused] = useState(false);
  const [questionStyle, setQuestionStyle] = useState();
  const [isLoading, setLoading] = useState(false);
  // Sending the post
 
                   
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
             defaultValue={"feature"}
             onChange={(e) => setType(e.target.value)}
             >
             <option value="feature">Feature</option>
             <option value="news">News</option>
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
                  defaultValue={""}
                  onFocus={() => setLinkFocused(true)}
                  onBlur={() => setLinkFocused(false)}
                  onChange={(e) => setLink(e.target.value)}
                className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
              />
            </div>
          </div>

          <div className="col-span-6">
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
          </div>

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
          type="submit"
          onClick={async () => {
            console.log(questionStyle)
           await createNewPost({
             "title": heading,
             text,
             link,
             type,
             questionStyle,
             userId: user.user.id,
             options: Array.from(document.querySelectorAll('.options')).filter(op => op.value).map(op => op.value),
            });
            console.log('here')
            router.replace('/dashboard');
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
    return {
      props: {
        user: session,
      },
    }
  }


export default styled(NewPost)`
.Container {
    margin: 0 auto;
}
    width: 100%;
    height: 100%;
    .NewPost{
    display: flex;
    flex-direction: column;
    max-width: 800px;
    background:white;
    padding: 20px;
    margin-top: 20px;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
    margin-bottom: 50px;
    h4 {
        margin: 20px 0 10px 0;
    }
    .GroupedInput {
        display: flex;
        flex-direction: column;
        width: 100%;
        box-sizing: border-box;
    }
    .GroupedInput-item {
        display:flex;
        flex-direction: column;
        width: 100%;
        box-sizing: border-box;
    }
    @media(min-width: 480px) {
        .GroupedInput {
        display: flex;
        flex-direction: row;
        }
        .GroupedInput-item {
        display:flex;
        flex-direction: column;
        width: 50%;
        margin: 0 20px 0 0;
        }
    }
    .option {
        margin: 0 0 20px 0;
    }
    .OptionContainer {
        margin-top: 30px;
    }
    }
`;
