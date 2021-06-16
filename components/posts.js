import React,{ useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router'

import {
  HeartIcon,
} from '@heroicons/react/outline'
import axios from 'axios';

const Button = styled.button`
  border: none;
  background-color: ${({ isDelete }) => isDelete ?  '#FF3144' : '#4bb543' };
  padding: 5px 10px;
  font-family: Quicksand;
  border-radius: 6px;
  min-width: 80px;
  max-width: 300px;
  color: white;
  cursor: poiner;
  margin-right: 10px;
  font-size: 12px;
  @media(min-width: 480px) {
    font-size: 16px;
  }
`

const Badge = styled.span`
  line-height: 10px;
  margin: auto 10px;
  font-size: 12px;
  color: white;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: 600;
  background-color: ${({ type }) => type === 'feature' ? '#CD557B' :  type === 'question' ? '#429F75' : '#F5CA61'};
  font-family: canada-type-gibson;
`;

const HeartBadge = styled.span`
  line-height: 10px;
  margin: auto 5px 0 0;
  font-size: 12px;
  background-color: #FF3144;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  font-family: canada-type-gibson;
`;

const Modal = styled.div`
  display: block;
  postion: fixed;
  z-index: 1000;
  margin: 50px auto;
  max-width: 400px;
  min-width: 300px;
  height: 300px;
  background: white;
  box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
`

const OptionScore = styled.div`
  width: 100%;
  height: 40px;
  position: relative;
  background: #CDDFFE;
  margin: 0px 0 20px 0;
  span {
    p {
      position: absolute;
      right: ${({ score }) => score < 25 ? '-50px' : '10px'};
      color: ${({ score }) => score < 25 ? 'black' : 'white'};
      top: 7px;
      font-size: 16px;
      font-weight: 600;
      margin: 0 5px 0 auto;
    }
    position: absolute;
    height: 40px;
    background: #1167FA;
    left: 0;
    top: 0;
    width: ${({ score }) => `${score}%`}
  }
`


const PollResults = ({ post }) => {
  console.log('ere')
  return (
      <div className="Options my-8">
        {post.options.map(option => {
          return (
            <div key={option._id}>
              {post.questionStyle === 'singleSlider' ?
                (<div className="rangeLabels">
                  <p>{post.minLabel || 'Min'}</p>
                  <p>{post.maxLabel || "Max"}</p>
                </div>)
                 :
                 (<label>{option.label}</label>)}
              <OptionScore score={Math.floor(((option.score / post.responses) * 100))}>
                <span><p>{`${Math.floor(((option.score / post.responses * 100)))}%`}</p></span>
              </OptionScore>
            </div>
          )
        })}
      </div>)
}

const Posts = ({
  className, setEditing, updateView, posts
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


    const orderedPosts = posts && posts.length >0 && posts.sort((a,b) => new Date(b.date) - new Date(a.date));
    return  (
    <div>
      {!isLoading && orderedPosts && orderedPosts.length ? orderedPosts.map((post, index) => <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      <div className="-ml-4 -mt-4  items-center justify-center flex-wrap sm:flex-nowrap">
        <div className="ml-4 w-full mt-4">
          <div className="flex w-full justify-between">
            <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">{post.title}</h3>
          <p className="mt-2 text-sm leading-4 font-medium text-gray-600">{new Date(post.date).toDateString()}</p>
          </div>
          <div className="ml-4 mt-4 flex-shrink-0">
          <a
            type="button"
            href={`/post/${post._id}/`}
            className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit post
          </a>
          <button
           className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          isDelete
          onBlur={() => this.setState({ isDeleting: false })}
          onClick={async () => {
            console.log('hellothere', post._id, post.title)
            setIsLoading(true)
            await axios.delete('/api/posts', {
              data: {
                post: post._id,
              },
            })    
            router.reload();

            
          }}
          >{isLoading ? 'Deleting..' : 'Delete'}</button>
        </div>
        </div>
          <div className="Post w-full mt-5" key={`${post._id} - ${index} - ${post.question && post.question._id}`}>
        <div className="PostHeader">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800">
        {post.type[0].toUpperCase().concat(post.type.substring(1))}
      </span>
      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-pink-100 text-pink-800">
       {post.type !== 'question' ? `${post.hearts || 0} likes` : `${post.responses || 0} responses`}      </span>
    
        </div>
        <a className="my-4 block" href={post.link}>{post.link}</a>
        <p className="my-8">{post.text && post.text}</p>
        {post.type === 'question' && <PollResults post={post} />}
 
      </div>
        </div>

      </div>
    </div>) : (<div className="w-2/3 m-4 bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Create a new post to get started</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Start communicating with your web users</p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="my-4 text-sm font-medium text-gray-500">Communicating with your web visitors can increase engagement and conversion, whilst reducing churn and time spent on support</dt>
            <dt className="my-4 text-sm font-medium text-gray-500">Try sharing news, your latest features, or getting your visitors opinion on what your planning</dt>
            <dd className="mt-4 text-sm text-gray-900">
            <button
        type="button"
        onClick={() => {
          router.push('/new-post');
        }}
        className="inline-flex items-center px-4 py-2 mt-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Create a post
      </button>
            </dd>
          </div>
        </dl>
      </div>
    </div>)}
  </div>);
}

export default styled(Posts)`
  h3 {
    margin: 20px 0;
  }

  .noPosts {
    background: white;
    padding: 20px;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
    margin-top: 30px;
  }
  .Post {
    background: white;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
    padding: 20px;
    margin: 20px auto;
    border-radius: 3px;
    h3 {
      margin: auto 0 !important;
    }
    p {
      margin: 20px 0;
    }
    .date {
      text-decoration: none;
      font-size: 14px;
      display: block;
      margin-top: 0;
      margin-bottom: 5px;
    }
    a {
      text-decoration: none;
      font-size: 14px;
      display: inline-block !important;
      margin-top: 0;
      margin-bottom: 30px !important;
    }
  }
  .PostHeader {
    display: flex;
    flex-direction: row;
    margin: 10px 0;
    h4 {
      margin: auto 0px;
    }
  }
  .Options {
    margin: 20px 0 40px 0;
    label {
      margin: 0;
      font-family: Quicksand;
    }
  }
  .rangeLabels {
    display: flex;
    justify-content: space-between;
    p {
      margin: 5px 0;
    }
  }

`;
