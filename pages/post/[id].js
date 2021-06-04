import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/navbar';
import { useRouter } from 'next/router'
import { connectToDatabase } from '../../utils/mongodb';
import { signIn, signOut, getSession, jwt } from 'next-auth/client'
import { ObjectId } from 'bson';

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

const editPost = async(post) => {
    await axios.put('/api/posts', { post })
}

const NewPost = ({ className , user, post }) => {
    console.log(post)
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
  // Sending the post

  return(
      <div className={className}>
          <div className="Container">
              <Navbar userId={user.user.id} />
            <div className='NewPost'>

                <h4>{type !== 'question' ? 'Heading (required)' : 'Question'}</h4>
                <Input
                placeholder={!headingFocused ? "Add a snappy heading" : ''}
                type="text"
                name="title"
                defaultValue={heading}
                onBlur={() => setHeadingFocused(false)}
                onFocus={() => setHeadingFocused(true)}
                onChange={(e) => setHeading(e.target.value)}
                />

                <div className="GroupedInput">
                <div className="GroupedInput-item">
                    <h4>Link (optional)</h4>
                    <Input
                    placeholder={!linkFocused ? "Link your users to a blog post or specific page" : ''}
                    defaultValue={post.link}
                    onFocus={() => setLinkFocused(true)}
                    onBlur={() => setLinkFocused(false)}
                    onChange={(e) => setLink(e.target.value)}
                    />
                    </div>
                <div className="GroupedInput-item">
                    <h4>Type</h4>
                    <Select
                    defaultValue={post.type}
                    onChange={(e) => setType(e.target.value)}
                    >
                    {type !== 'question' && 'post' && (
                        <>
                    <option value="feature">Feature</option>
                    <option value="news">News</option>
                    </>)}
                    <option value="question">Question</option>
                    </Select>
                </div>
                </div>
                {type !== 'question' &&
                <>
                <h4>Content (required)</h4>
                <Textarea
                placeholder={!textFocused ? "Add the main text in here" : ''}
                defaultValue={post.text}
                onBlur={() => setTextFocused(false)}
                onFocus={() => setTextFocused(true)}
                onChange={(e) => setText(e.target.value)}
                />
                </>}
                <div>
                {type === 'question' && (
                    <div>
                    {questionStyle === 'singleSlider' && (<div>
                        <h4>Question style</h4>
                        <Select
                        defaultValue={questionStyle || 'singleSlider'}
                        onChange={(e) => setQuestionStyle(e.target.value)}
                        >
                        <option value="singleSlider">Slider</option>
                        <option value="multipleChoice">Multiple choice</option>
                        </Select>
                    </div>)}
                    <div className="OptionContainer">
                        {questionStyle === 'singleSlider' ?
                    ( <div key={questionStyle}>
                        <h4>Min label</h4>
                        <Input className="rangeLabels" defaultValue={(post.question && post.question.minLabel) || 'Min'}/>
                        <h4>Max label</h4>
                        <Input className="rangeLabels" defaultValue={(post.question && post.question.maxLabel) || 'Max'}/>
                        </div>
                    ) : (
                        <div key={questionStyle}>
                        <h4>Options (Max 4)</h4>
                        {post.options.map(op => <Input defaultValue={(op.responses / op.score) || 0} className="options"/>)}
                        </div>)}
                        </div>
                    </div>)}
                    <Button onClick={() => {
                        console.log(questionStyle)
                       editPost({
                        "title": heading,
                        text,
                        link,
                        type,
                        questionStyle,
                        userId: user.user.id,
                        options: Array.from(document.querySelectorAll('.options')).filter(op => op.value).map(op => op.value),
                       });
                       const router = useRouter()
                       router.push('/dashboard');
                    }}>{!isLoading ? 'Save' : 'Saving..'}</Button>
                </div>
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
