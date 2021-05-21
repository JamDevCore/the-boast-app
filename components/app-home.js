import React from "react";
import { navigate } from 'gatsby';
import { logout } from "../utils/auth"
import NewPost from './new-post';
import Posts from './posts';
import styled from 'styled-components';
import Snippet from './snippet';
import SEO from './seo';
import pencil from '../images/pencil.svg';
import html from '../images/html.svg';
import exit from '../images/exit.svg';
import folder from '../images/folder.svg';

const Menu = styled.div`
  max-width: 250px;
`

class AppHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentView: 'posts',
      editingPost: {},
    }
    this.updateView = this.updateView.bind(this);
    this.setEditing = this.setEditing.bind(this);
  }

  setEditing(post) {
    this.setState({
      editingPost: post,
    })
  }

  updateView(view) {
    this.setState({
      currentView: view,
    })
  }

  getCurrentView() {
    const { currentView } = this.state;
    const views = {
      posts: this.renderPostView(),
      newPost:  this.renderNewPostView(),
      editPost: this.renderEditPostView(),
      snippet: this.renderSnippetView(),
    }
    return views[currentView];
    }

  renderPostView() {
    const { user } = this.props;
    return <Posts updateView={this.updateView} setEditing={this.setEditing} userId={user.sub}/>
  }

  renderSnippetView() {
    const { user } = this.props;
    return <Snippet
      userId={user.sub}
      />
  }

  renderEditPostView() {
    const { user } = this.props;
    const { editingPost } = this.state;
    return <NewPost
        setEditing={this.setEditing}
        post={editingPost}
        postId={editingPost && editingPost._id}
        userId={user.sub}
        updateView={this.updateView}
      />
  }

  renderNewPostView() {
    const { user } = this.props;
    const { editingPost } = this.state;
    return <NewPost post={editingPost} userId={user.sub} updateView={this.updateView}/>
  }

    render() {
      const { className, user } = this.props;
      const { currentView } = this.state;
      return (
        <div key={this.state.currentView} className={className}>
          <SEO
            title="Boast | Get insights into your latest features"
            showBoast={true}
            userId={user.sub}
            />
          <div className="Page">
            <h1>Boast</h1>
              <div className="Layout">
                <div className="Toolbar">
                <button className={currentView === 'posts' ? 'active-button' : ''} onClick={() => this.setState({ currentView: 'posts' })}><img className="icon" src={folder}/></button>
                <button className={currentView === 'newPost' || currentView === 'editPost' ? 'active-button' : ''} onClick={() => this.setState({ currentView: 'newPost'})}><img className="icon" src={pencil}/></button>
                <button className={currentView === 'snippet' ? 'active-button' : ''} onClick={() => this.setState({ currentView: 'snippet' })}><img className="icon" src={html}/></button>
                <button
                    onClick={e => {
                      logout()
                      navigate('/')
                      e.preventDefault()
                    }}
                  >
                  <img className="icon" src={exit}/>
                </button>
              </div>
              {this.getCurrentView()}
          </div>
          </div>
          <div className="accredit">Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/"     title="Flaticon">www.flaticon.com</a> messages.attribution.is_licensed_by <a href="http://creativecommons.org/licenses/by/3.0/"     title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
        </div>
      );
    }
  };

export default styled(AppHome)`

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
  .Toolbar {
    background: white;
    display: flex;
    flex-direction: row;
    justify-content: center
    width: 100%;
    box-shadow: 0px 3px 10px rgba(0,0,0,0.2);
    button {
      margin: 0 0px;
      font-family: canada-type-gibson;
      font-weight: 500;
      background: transparent;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      font-size: 16px;
      width: 25%;
    }
    .active-button {
      background: #e8f4f8;
    }
    @media(min-width: 480px) {
      button {
        min-width: 100px;
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
