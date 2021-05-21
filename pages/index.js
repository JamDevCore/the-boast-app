import { signIn, signOut, useSession, jwt } from 'next-auth/client'

export default function Page() {
  const [ session, loading ] = useSession()
  console.log(session)
  return <>
    {!session && <>
      Not signed in <br/>
      <button onClick={() => signIn()}>Sign in</button>
    </>}
    {session && <>
      <button onClick={() => signOut()}>Sign out</button>
    </>}
  </>
}