import React, { useState } from 'react';
import { navigate } from 'gatsby';
import styled from 'styled-components';
import sendToAirtable, { handleUpdateAirtable } from '../modules/send-to-airtable';
import Question from './question';
import axios from 'axios';

const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid grey;
  background: white;
  margin: 0 auto 10px 0;
  border-radius: 3px;
  padding: 10px;
  font-family: Quicksand;
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
`

const Select = styled.select`
  min-width: 200px;
  max-width: 300px;
  height: 40px;
  border: 1px solid grey;
  background: white;
  margin: 0 auto 10px 0;
  border-radius: 3px;
  padding: 10px;
  font-family: Quicksand;
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
`
const apiKey = process.env.GATSBY_DOOPOLLAPI;

const createNewQuestion = () => {

}

const NewPost = ({ className, userId, updateView, post, postId, setEditing }) => {
  const [heading, setHeading] = useState(post.title || '');
  const [headingFocused, setHeadingFocused] = useState(false);
  const [link, setLink] = useState(post.link || '');
  const [linkFocused, setLinkFocused] = useState(false);
  const [text, setText] = useState(post.notes || '');
  const [textFocused, setTextFocused] = useState(false);
  const [type, setType] = useState(post.tag || 'feature');
  const [questionFocused, setQuestionFocused] = useState(false);
  const [questionStyle, setQuestionStyle] = useState(post.question && post.question.type  || 'singleSlider');
  const [isLoading, setLoading] = useState(false);
  const createNewQuestionPost = () => {
    setLoading(true)
      // Create new question
      const poll = {
          name: heading,
        };
      const question = {
        label: heading,
      }
      if(questionStyle === 'singleSlider') {
        let labels = document.querySelectorAll('.rangeLabels');
        labels = Array.from(labels)
        question.minLabel = labels[0].value;
        question.maxLabel = labels[1].value;
      }
      if(!postId) question.type = questionStyle;
      let answers = document.querySelectorAll('.options');
      answers = Array.from(answers);
      const ops = {
        method: postId ? "PATCH" : "POST",
        headers: { 'x-api-key': apiKey },
        url: postId ? `https://api.doopoll.co/polls/${post.pollId}` : 'https://api.doopoll.co/polls/',
        data: {},
      };
      const pollOptions = ops;
      pollOptions.data = poll;
       axios(pollOptions)
      .then((res) => {

        if(res.data._id) {
          const questionOptions = ops;
          if(!postId) question.pollId = res.data._id;
          questionOptions.data = question;
          questionOptions.url = postId ? `https://api.doopoll.co/questions/${post.question._id}` : 'https://api.doopoll.co/questions/' ;
          axios(ops)
          .then((response) => {
            if(response.data._id) {
              if (questionStyle === 'singleSlider') {
                console.log('slider')
              } else {
                answers.forEach((option) => {
                  const newOption = {
                    label: option.value,
                  }
                  if(!postId) newOption.questionId = response.data._id;
                  const optionOptions = ops;
                  optionOptions.data = newOption;

                  optionOptions.url = postId ? `https://api.doopoll.co/options/${option.id}` : 'https://api.doopoll.co/options/'
                  axios(optionOptions).then(res => {
                  })
                  .catch(err => {
                  })
                })
              }
              const fields = {
                userId,
                title: heading,
                notes: text,
                link,
                tag: type,
                reactions: true,
                pollId: res.data._id,
              }
              if(postId) {
                handleUpdateAirtable({ id: postId, fields, table: 'User Posts', airBase: 'apppXyGCrN2Zt1wOI' })
                .then(() => {
                  setLoading(false)
                  updateView('posts')
                })
              } else {
                sendToAirtable({ fields, table: 'User Posts', airBase: 'apppXyGCrN2Zt1wOI' })
                .then(() => {
                  setLoading(false)
                  updateView('posts')
                })
              }
          }
          })
        }
      })
      .catch(err => console.log(err))
  }

  // Sending the post
  const sendPost = async () => {
    setLoading(true)
    const fields = {
      userId,
      title: heading,
      notes: text,
      link,
      tag: type,
      reactions: true,
    }
    if(postId) {
      handleUpdateAirtable({ id: postId, fields, table: 'User Posts', airBase: 'apppXyGCrN2Zt1wOI' })
      .then(res => {
        setLoading(false)
        setEditing({});
        updateView('posts')
      })
      .catch(err => {
        console.log(err)
      })
    } else {
      sendToAirtable({ fields, table: 'User Posts', airBase: 'apppXyGCrN2Zt1wOI' })
      .then(res => {
        setLoading(false)
        updateView('posts')
      })
      .catch(err => {
        setLoading(false)
      })
    }
  }


  return(
  <div className={className}>
    <h4>{type !== 'question' ? 'Heading (required)' : 'Question'}</h4>
    <Input
      placeholder={!headingFocused ? "Add a snappy heading" : ''}
      type="text"
      defaultValue={post.title || ''}
      onBlur={() => setHeadingFocused(false)}
      onFocus={() => setHeadingFocused(true)}
      onChange={(e) => setHeading(e.target.value)}
      />

    <div className="GroupedInput">
      <div className="GroupedInput-item">
        <h4>Link (optional)</h4>
        <Input
          placeholder={!linkFocused ? "Link your users to a blog post or specific page" : ''}
          defaultValue={post.link || ''}
          onFocus={() => setLinkFocused(true)}
          onBlur={() => setLinkFocused(false)}
          onChange={(e) => setLink(e.target.value)}
          />
        </div>
      <div className="GroupedInput-item">
        <h4>Type</h4>
        <Select
          defaultValue={post.tag || 'feature'}
          onChange={(e) => setType(e.target.value)}
          >
          {type !== 'question' && !post.pollId && (
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
      defaultValue={post.notes || ''}
      onBlur={() => setTextFocused(false)}
      onFocus={() => setTextFocused(true)}
      onChange={(e) => setText(e.target.value)}
      />
    </>}
    <div>
    {type === 'question' ? (
        <div>
        {type === 'question' && !post.pollId && (<div>
            <h4>Question style</h4>
            <Select
              defaultValue={post.question && post.question.type || 'singleSlider'}
              onChange={(e) => setQuestionStyle(e.target.value)}
              >
              <option value="singleSlider">Slider</option>
              <option value="multipleChoice">Multiple choice</option>
            </Select>
        </div>)}
        <div className="OptionContainer">
        {questionStyle !== 'singleSlider' && post.question && post.question.options && post.question.options.length > 0 ? post.question.options.map(option => (
          <React.Fragment key={option._id}>
            <Input
              key={option._id}
              defaultValue={option.label || ''}
              id={option._id}
              className="options"
              />
          </React.Fragment>)) :
          questionStyle === 'singleSlider' ?
          ( <div key={questionStyle}>
            <h4>Min label</h4>
            <Input className="rangeLabels" defaultValue={(post.question && post.question.minLabel) || 'Min'}/>
            <h4>Max label</h4>
            <Input className="rangeLabels" defaultValue={(post.question && post.question.maxLabel) || 'Max'}/>
            </div>
          ) : (
            <div key={questionStyle}>
              <h4>Options (Max 4)</h4>
              <Input defaultValue="" className="options"/>
              <Input defaultValue="" className="options"/>
              <Input defaultValue="" className="options"/>
              <Input defaultValue="" className="options"/>
            </div>)}
            </div>
          </div>) : null}
        <Button onClick={() => {
            if(type === 'question') return createNewQuestionPost()
            return sendPost();
          }}>{!isLoading ? 'Save' : 'Saving..'}</Button>
    </div>
  </div>
);
}


export default styled(NewPost)`
  display: flex;
  flex-direction: column;
  width: 100%;
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
  }
  .GroupedInput-item {
    display:flex;
    flex-direction: column;
    width: 100%;
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
`;
