import type { DocumentContext } from "next/document";
import Document, { Head, Html, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    const title = "UMA - Oracle Dapp V2";
    const description = "An optimistic oracle built for web3";
    const image = "/uma_square_red_logo.png";

    return (
      <Html lang="en">
        <Head>
          <meta name="description" content={description} />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@UMAprotocol" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:image" content={image} />

          <meta property="og:title" content={title} />
          <meta property="og:image" content={image} />
          <meta property="og:description" content={description} />
          <meta property="og:url" content="https://oracle.uma.xyz" />

          <link
            rel="icon"
            type="image/png"
            href="/favicon-32x32.png"
            sizes="32x32"
          />
          <link
            rel="icon"
            type="image/png"
            href="/favicon-16x16.png"
            sizes="16x16"
          />
          <link rel="mask-icon" href="safari-pinned-tab.svg" color="#FF4A4A" />
          <link
            rel="preload"
            href="/fonts/HalyardDisplay-Regular.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/HalyardDisplay-Regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
