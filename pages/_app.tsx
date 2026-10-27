import type { AppProps } from 'next/app'
import { Layout } from '@/components/Layout'
import '@/styles/globals.css'

/** Wraps every page: this is where the layout, providers and global CSS go. */
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
