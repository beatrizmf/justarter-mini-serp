import { SerpPage } from '@/serp/SerpPage'
import { createSerpServerSideProps } from '@/serp/server'

// /modelos-pecas/busca: the SERP for 'template' only. The file name defines the route.
export const getServerSideProps = createSerpServerSideProps('template')
export default SerpPage
