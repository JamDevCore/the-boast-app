import React from "react";
import styled from 'styled-components';
import { signIn, signOut, getSession, jwt } from 'next-auth/client'
import Link from 'next/link'
import Navbar from '../components/Navbar';
import Image from 'next/image'
import { connectToDatabase } from "../utils/mongodb";
// import NewPost from './new-post';
import Layout from '../components/layout';
import Posts from '../components/posts';
import { ObjectId } from "bson";
// import styled from 'styled-components';
// import Snippet from './snippet';
// import SEO from './seo';

const Menu = styled.div`
  max-width: 250px;
`

const Dashboard = ({ className, user, posts }) => {
    console.log(user)
    console.log('posts', posts)
    // this.setEditing = this.setEditing.bind(this);

//   setEditing(post) {
//     this.setState({
//       editingPost: post,
//     })
//   }

//   updateView(view) {
//     this.setState({
//       currentView: view,
//     })
//   }
//   renderSnippetView() {
//     const { user } = this.props;
//     return <Snippet
//       userId={user.sub}
//       />
//   }

//   renderEditPostView() {
//     const { user } = this.props;
//     const { editingPost } = this.state;
//     return <NewPost
//         setEditing={this.setEditing}
//         post={editingPost}
//         postId={editingPost && editingPost._id}
//         userId={user.sub}
//         updateView={this.updateView}
//       />
//   }

//   renderNewPostView() {
//     const { user } = this.props;
//     const { editingPost } = this.state;
//     return <NewPost post={editingPost} userId={user.sub} updateView={this.updateView}/>
//   }
      return (
        <div className={className}>
          {/* <SEO
            title="Boast | Get insights into your latest features"
            showBoast={true}
            userId={user.sub}
            /> */}
          <div className="Page">
            <h1>Boast</h1>
              <div className="Layout">
               <Navbar />
              <Posts posts={posts} />
          </div>
          </div>
          <div className="accredit">Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/"     title="Flaticon">www.flaticon.com</a> messages.attribution.is_licensed_by <a href="http://creativecommons.org/licenses/by/3.0/"     title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
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
    console.log(session)
    if (!session) {
      ctx.res.writeHead(302, { Location: '/' })
      ctx.res.end()
      return {}
    }
    const { db } = await connectToDatabase();
    console.log(db)
    const posts = await db
      .collection("posts")
      .find({ userId: ObjectId(session.user.id)})
      .toArray();
    console.log(posts)
    return {
      props: {
        user: session,
        posts: JSON.parse(JSON.stringify(posts)),
      },
    }
  }