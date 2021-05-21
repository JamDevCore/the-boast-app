
import React from "react"

const Layout = ({ children }) => (
      <React.Fragment>
        <div
          style={{
            margin: `0 auto`,
            maxWidth: 1200,
            padding: `0px 1.0875rem 1.45rem`,
            paddingTop: 0,
          }}
        >
          <main>{children}</main>
        </div>
      </React.Fragment>
)


export default Layout
