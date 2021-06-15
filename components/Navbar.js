import Image from 'next/image';
import {Link } from 'next/link'
import { signIn, signOut, getSession, jwt } from 'next-auth/client'
import React, { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import Head from "next/head";


import { BellIcon, MenuIcon, TemplateIcon, XIcon } from '@heroicons/react/outline'

const navigation = [{ label: 'Dashboard', page: '/' }, { label: 'Create a post', page: '/new-post' },  { label: 'Embed', page: '/snippet' }, { label: 'Preview', page: '', isPreview: true }, { label: 'Account', page: '/account'}]
const profile = ['Your Profile', 'Settings', 'Sign out']


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Navbar = ({ userId }) => {
  // useEffect(() => {
 
  // })
  return (<React.Fragment>
  <Disclosure as="nav" className="bg-indigo-600">
  {({ open }) => (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-8"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-300.svg"
                alt="Workflow"
              />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item, itemIdx) =>
                  itemIdx === 0 ? (
                    <Fragment key={item.label}>
                      {/* Current: "bg-indigo-700 text-white", Default: "text-white hover:bg-indigo-500 hover:bg-opacity-75" */}
                      <a href={item.page} className="bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium">
                        {item.label}
                      </a>
                    </Fragment>
                  ) : (
                    <a
                      key={item.page}
                      href={item.isPreview ? `/feed/${userId}` : item.page}
                      className="text-white hover:bg-indigo-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      {item.label}
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">

              {/* Profile dropdown */}
              
                <button onClick={() => signOut()} className="ml-10 bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium" >Logout</button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            {/* Mobile menu button */}
            <Disclosure.Button className="bg-indigo-600 inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white">
              <span className="sr-only">Open main menu</span>
              {open ? (
                <XIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </Disclosure.Button>
          </div>
        </div>
      </div>

      <Disclosure.Panel className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navigation.map((item, itemIdx) =>
            itemIdx === 0 ? (
              <Fragment key={item}>
                {/* Current: "bg-indigo-700 text-white", Default: "text-white hover:bg-indigo-500 hover:bg-opacity-75" */}
                <a href={item.page} className="bg-indigo-700 text-white block px-3 py-2 rounded-md text-base font-medium">
                  {item.label}
                </a>
              </Fragment>
            ) : (
              <a
                key={item.label}
                href={item.page}
                className="text-white hover:bg-indigo-500 hover:bg-opacity-75 block px-3 py-2 rounded-md text-base font-medium"
              >
                {item.label}
              </a>
            )
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-indigo-700">
          <div className="flex items-center px-5">


          </div>
               <button onClick={() => signOut()}   className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-500 hover:bg-opacity-75">Logout</button>
        </div>
      </Disclosure.Panel>
    </>
  )}
</Disclosure>
</React.Fragment>)
}

export default Navbar;