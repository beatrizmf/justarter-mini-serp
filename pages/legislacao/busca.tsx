import { SerpPage } from '@/serp/SerpPage'
import { createSerpServerSideProps } from '@/serp/server'

// /legislacao/busca: the SERP for 'legislation' only. The file name defines the route.
export const getServerSideProps = createSerpServerSideProps('legislation')
export default SerpPage
