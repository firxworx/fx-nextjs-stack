import type { AppProps } from 'next/app'
import '../styles/tailwind.css'

function ProjectApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default ProjectApp
