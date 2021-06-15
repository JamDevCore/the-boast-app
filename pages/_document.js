import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
const sheet = new ServerStyleSheet();
class MyDocument extends Document {
static async getInitialProps(ctx) {
const sheet = new ServerStyleSheet();
const originalRenderPage = ctx.renderPage;
try {
ctx.renderPage = () =>
originalRenderPage({
// useful for wrapping the whole react tree
enhanceApp: (App) => (props) =>
sheet.collectStyles(
<>
<App {...props} />
</>,
),
// useful for wrapping in a per-page basis
enhanceComponent: (Component) => Component,
});
// Run the parent `getInitialProps`, it now includes the custom `renderPage`
const initialProps = await Document.getInitialProps(ctx);
return {
        ...initialProps,
        styles: (
        <>
        {initialProps.styles}
        {sheet.getStyleElement()}
        </>
        ),
    };
} finally {
sheet.seal();
}
}
render() {
return (
<Html lang="en">
<Head>
<script>{console.log('heello')}</script>
<script async data-userId="60a2747d4652a216c309d08e" data-defaultButton="false" data-buttonText="What's new" src="https://unpkg.com/boast-init@0.1.5/umd/boast-init.min.js"></script>
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