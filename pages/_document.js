import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import { signIn, signOut, getSession, jwt } from 'next-auth/client'


const sheet = new ServerStyleSheet();
class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;
        // const session = await getSession(ctx);
        // const path = ctx.pathname
        // MyDocument.getPath = path;
        // MyDocument.getSession = await getSession(ctx);
        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    // useful for wrapping the whole react tree
                    enhanceApp: (App) => (props) => {
                        this.props = props;
                        return sheet.collectStyles(
                            <>
                
                <App {...props} />
            </>
                        , )
                    },
                    // useful for wrapping in a per-page basis
                    enhanceComponent: (Component) => Component
                , });
            // Run the parent `getInitialProps`, it now includes the custom `renderPage`
            const initialProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps
                , styles: (
                    <>
                    {initialProps.styles}
                    {sheet.getStyleElement()}
                    </>
                )
            , };
        } finally {
            sheet.seal();
        }
    }
    render(props) {
        return (
            <Html lang="en">
                <Head>
                {/* {MyDocument.getSession && MyDocument.getSession.user &&  MyDocument.getSession.user.id && MyDocument.getPath !== '/feed/[id]' && <script async data-userId={MyDocument.getSession.user.id} data-defaultButton="false" data-buttonText="What's new" src="https://unpkg.com/boast-init@latest/umd/boast-init.min.js"></script>} */}
                </Head>
                <body>
                <Main>

                </Main>
                <NextScript />
                </body>
                </Html>
        );
    }
}
export default MyDocument;