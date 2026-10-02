import 'server-only'
import { defineLive } from 'next-sanity/live' 
import { client } from '@/libs/sanity/client'

const token = process.env.SANITY_API_READ_TOKEN 

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
})
