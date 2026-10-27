import { SerpPage } from '@/serp/SerpPage'
import { createSerpServerSideProps } from '@/serp/server'

// /jurisprudencia/busca: the SERP for 'jurisprudence' only. The file name defines the route.
export const getServerSideProps = createSerpServerSideProps('jurisprudence')
export default SerpPage
