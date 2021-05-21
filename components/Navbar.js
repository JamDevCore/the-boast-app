import Image from 'next/image';
import styled from 'styled-components';
const Navbar = ({ className }) => (
    <div className={className}>
    <a className="navLink" href="/dashboard"><Image width="25px" height="25px" src='/folder.svg'/></a>
    <a className="navLink"  href="/new-post"><Image width="25px" height="25px" src='/pencil.svg'/></a>
    <a className="navLink"  href="/snippet"><Image width="25px" height="25px" src='/html.svg'/></a>
    <button
        onClick={e => {
          signOut()
        }}
      >
     <Image width="25px" height="25px" src='/exit.svg'/>
    </button>
  </div>
)

export default styled(Navbar)`
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
    .navLink {
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
`