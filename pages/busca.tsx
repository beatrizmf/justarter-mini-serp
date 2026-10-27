import { SerpPage } from '@/serp/SerpPage'
import { createSerpServerSideProps } from '@/serp/server'

// /busca: the general SERP, with every kind. Rendered on the server on every request (SSR).
export const getServerSideProps = createSerpServerSideProps(null)
export default SerpPage
