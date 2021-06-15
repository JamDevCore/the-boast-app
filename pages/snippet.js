import React, { useState } from 'react';
import { signIn, signOut, getSession, jwt } from 'next-auth/client'
import styled from 'styled-components';
import Navbar from '../components/navbar.js';
import { Switch } from '@headlessui/react'

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

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Snippet = ({ user, className }) => {
  const [enabled, setEnabled] = useState(false)
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
      <Navbar  userId={user.user.id} />
    <div className="w-2/3 m-4 bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Including Boast in your site</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Copy the snippet below and paste it inside the head element of your page</p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Instructions</dt>
            <dd className="mt-1 text-sm text-gray-900">
            <p className="my-6 max-w-2xl text-sm text-gray-500">
              Boast can be included on almost any type of site including React sites and other SPA,
              get in touch
              with me at j.harding@doopoll.co for more detailed information specific to your setup
            </p>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Check the box to include the Boast default launcher button, or leave it blank to add Boast functionality to your own button.
              If you are planning to use your own, there will need to be a button on the page where the snippet has been included
              with a class name of "boast-button-init".
            </p>

            <Switch.Group as="div" className="my-6 flex items-center justify-between">
      <Switch.Label as="span" className="flex-grow flex flex-col" passive>
        <span className="text-sm font-medium text-gray-900">Do you want to use the default launcher?</span>
        <span className="text-sm text-gray-500">If in doubt turn this on</span>
      </Switch.Label>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={classNames(
          enabled ? 'bg-indigo-600' : 'bg-gray-200',
          'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        )}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
          )}
        />
      </Switch>
    </Switch.Group>
          <pre>
            <code key={enabled}>
              &lt;script async data-userId={`"${user.user.id}"`} data-defaultButton={`${enabled ? '"true"' : '""'}`} src="https://unpkg.com/boast-init/umd/boast-init.min.js"&gt;&lt;/script&gt;
            </code>
            </pre>
            <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={(e) => copyText()}>{copyButtonText}

      </button>

            </dd>
          </div>
        </dl>
      </div>
    </div>
    </div>
  )
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

pre {
    overflow: scroll;
    line-height: 1.2em;
    font-family: monospace;
    margin: 20px 0;
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


//    <div className={className}>
{/* <h3>Including Boast in your site</h3>
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
</div> */}