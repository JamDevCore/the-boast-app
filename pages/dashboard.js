import React from "react";
import styled from 'styled-components';
import { signIn, signOut, getSession, jwt } from 'next-auth/client'
import Link from 'next/link'
import Navbar from '../components/navbar';
import Image from 'next/image'
import { connectToDatabase } from "../utils/mongodb";
// import NewPost from './new-post';
import Layout from '../components/layout';
import Posts from '../components/posts';
import { ObjectId } from "bson";
// import styled from 'styled-components';
// import Snippet from './snippet';
// import SEO from './seo';



function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


// const Menu = styled.div`
//   max-width: 250px;
// `

const Dashboard = ({ className, user, posts }) => {
    console.log(user)
    console.log('posts', posts)
      return (
    <div>
      <Navbar userId={user.user.id} />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <Posts posts={posts} />
          {/* /End replace */}
        </div>
      </main>
    </div>
      );
    }

    

export default styled(Dashboard)`
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
    const posts = await db
      .collection("posts")
      .find({ userId: ObjectId(session.user.id)})
      .toArray();
    return {
      props: {
        user: session,
        posts: JSON.parse(JSON.stringify(posts)),
      },
    }
  }