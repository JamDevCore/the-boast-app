import React, { useState } from 'react';
import { signIn, signOut, getSession, jwt } from 'next-auth/client'
import styled from 'styled-components';

const Button = styled.button`
  border: none;
  background-color: ${({ isDelete }) => isDelete ?  '#FF3144' : '#4bb543' };
  padding: 5px 10px;
  font-family: Quicksand;
  border-radius: 6px;
  min-width: 120px;
  max-width: 300px;
  color: white;
  cursor: poiner;
  margin-right: 10px;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid grey;
  background: white;
  margin: 0 auto 10px 0;
  border-radius: 3px;
  padding: 10px;
  font-family: Quicksand;
  font-weight: bold;
`;

const Snippet = ({ user, className }) => {
  const [defaultButton, setDefaultButton] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copy snippet')
  const copyText = () => {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('code'));
    selection.removeAllRanges();
    selection.addRange(range);
    try {
      document.execCommand('copy');
      selection.removeAllRanges();
      setCopyButtonText('Copied!');
      setTimeout(() => {
        setCopyButtonText('Copy snippet')
      }, 1500);
    } catch (exception) {
      console.log(exception)
    }
  }
  return (
    <div className={className}>
    <h3>Including Boast in your site</h3>
    <p>Copy the snippet below and paste it inside the head element of your page</p>
    <p>Check the box to include the Boast default launcher button, or leave it blank to add Boast functionality to your own button.
      If you are planning to use your own, there will need to be a button on the page where the snippet has been included
      with a class name of "boast-button-init".
    </p>
    <p>
      Boast can be included on almost any type of site including React sites and other SPA,
       get in touch
      with me at j.harding@doopoll.co for more detailed information specific to your setup
    </p>
    <div className="Checkbox">
      <label htmlFor="defaultButton">Use Boast's default launch button</label>
      <input onChange={() => setDefaultButton(!defaultButton)} name="defaultButton" type="checkbox"></input>
    </div>
    <pre>
      <code key={defaultButton}>
        &lt;script async data-userId={`"${user.user.id}"`} data-defaultButton={`${defaultButton ? '"true"' : '""'}`} src="https://unpkg.com/boast-init/umd/boast-init.min.js"&gt;&lt;/script&gt;
      </code>
      </pre>
      <Button onClick={(e) => copyText()}>{copyButtonText}</Button>
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


export default styled(Snippet)`
background: white;
padding: 20px;
box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
.Checkbox {
  display: flex;
  label {
    font-family: Quicksand;
    font-size: 16px;
    font-weight: bold;
  }
  input {
    margin: auto 20px;
  }
}
.Input {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  label {
    font-family: Quicksand;
    font-size: 16px;
    font-weight: bold;
  }
  input {
    width: 200px;
  }
}
margin: 30px 0;
width: 100%;
pre {
    line-height: 1.2em;
    font-family: monospace;
    margin-top: 20px;
    width: 100%;
    display: block;
    color: #555555;
    padding: 1em 1em;
    background: #f4f4f4;
    border: solid 1px #e1e1e1
}
code {
    line-height: 1.2em;
    font-family: monospace;

    color: #555555;
    padding: 1em 1em;
    background: #f4f4f4;
}
`;
