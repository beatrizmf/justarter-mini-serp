import { SerpPage } from '@/serp/SerpPage'
import { createSerpServerSideProps } from '@/serp/server'

// /noticias/busca: the SERP for 'news' only. The file name defines the route.
export const getServerSideProps = createSerpServerSideProps('news')
export default SerpPage
