import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { sanityClient, urlFor } from '../Sanity'
import { Collection } from '../typings'

interface Props {
  collections: Collection[]
}

const Home = ({ collections }: Props) => {
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  return (
    <div className="max-w-7xl mx-auto flex flex-col min-h-screen py-20 px-10 2xl:px-0">
      <Head>
        <title>NFT Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="flex items-center justify-between">
        <h1 className="mb-10 text-4xl font-extralight">
          The {''}
          <span className="font-extrabold underline decoration-pink-600/80">
            Great
          </span>
          {''} NFT Market Place
        </h1>
        <button
          onClick={() => (address ? disconnect() : connectWithMetamask())}
          className="rounded-full  bg-cyan-400 text-white px-4 py-2 text-xs font-bold lg:px-5 lg:py-3 lg:text-base mb-10 "
        >
          {address ? 'Sign Out' : 'Sign In'}
        </button>
      </header>

      <main className="bg-slate-200 p-10 shadow-2xl shadow-cyan-400/50 rounded-2xl">
        <div className="grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {collections.map((collection) => (
            <Link href={`/nft/${collection.slug.current}`}>
              <div className="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105">
                <img
                  className="h-96 w-60 rounded-2xl object-fill "
                  src={urlFor(collection.mainImage).url()}
                  alt=""
                />
                <div className="p-5 ">
                  <h2 className="text-3xl">{collection.title}</h2>
                  <p className="mt-2 text-sm text-gray-400">
                    {collection.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == "collection"]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage {
      asset
    },
    previewImage {
      asset
    },
    slug {
      current
    },
    creator=> {
      _id,
      name,
      address,
      slug {
        current
      },
    },
  }`

  const collections = await sanityClient.fetch(query)

  return {
    props: {
      collections,
    },
  }
}
