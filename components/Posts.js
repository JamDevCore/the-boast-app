import React from 'react';
import styled from 'styled-components';
// import Loading from './loading';


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
  font-family: canada-type-gibson;
  width: 100%;
  height: 40px;
  position: relative;
  background: #CDDFFE;
  margin: 0px 0 20px 0;
  span {
    p {
      position: absolute;
      font-family: canada-type-gibson;
      right: ${({ score }) => score < 25 ? '-50px' : '10px'};
      color: ${({ score }) => score < 25 ? 'black' : 'white'};
      top: -15px;
      font-size: 18px;
      font-weight: 900;
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
class Posts extends React.Component {
  constructor() {
    super()
    this.state = {
      posts: [],
      isLoading: false,
      isDeleting: false,
    }
  }

  renderPollResults(post) {
    console.log('ere')
    return (
        <div className="Options">
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
                <OptionScore score={Math.floor(option.averageScore)}>
                  <span><p>{`${Math.floor(option.averageScore)}%`}</p></span>
                </OptionScore>
              </div>
            )
          })}
        </div>)
  }



  render() {
    const { className, setEditing, updateView, posts} = this.props;
    const { isLoading, confirmDialog, isDeleting } = this.state;
    console.log(',yfriend', posts)
    return (
      <div key={posts.length} className={className}>
      {!isLoading ? posts.length > 0 ? posts.map((post, index) => {
        return (
      <div className="Post" key={`${post._id} - ${index} - ${post.question && post.question._id}`}>
        <div className="PostHeader">
          <h3>{post.title}</h3>
          <Badge type={post.type}>{post.type[0].toUpperCase().concat(post.type.substring(1))}</Badge>
        </div>
        <p className="date">{new Date(post.date).toDateString()}</p>
        <a href={post.link}>{post.link}</a>
         <HeartBadge>
          {post.type !== 'question' ? `${post.hearts || 0} hearts` : `${post.question && post.question.responses || 0} responses`}
        </HeartBadge>
        <p>{post.text && post.text}</p>
        {post.type === 'question' && this.renderPollResults(post)}
        <a href={`/posts/${post._id}`}><Button
          onClick={() => {
            return;
          }}
          >Edit</Button></a>
        <Button
          isDelete
          onBlur={() => this.setState({ isDeleting: false })}
          onClick={() => {
            this.deleteRecord(post._id)
          }}
          >{isDeleting === post._id ? 'Really? Click to confirm' : 'Delete'}</Button>
      </div>)}) :
        <>
          <div className="noPosts">
            <h3>You don't currently have any posts</h3>
            <p>Add a new post to begin an open dialog with users. Tell them about your features
            and start generating insights on what they think of them!</p>
          </div>
        </>
        : null}
      </div>
      )
  }
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
    margin: 10px 0 40px 0;
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
