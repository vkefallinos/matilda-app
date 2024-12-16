import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Matilda - Teacher Management Application" />
      </Head>
      <body className="bg-background min-h-screen">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
