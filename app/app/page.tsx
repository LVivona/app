import { Suspense } from 'react'
import { Footer, Header, Loading } from './components'
import Modules from './components/Modules'
import Image from 'next/image'

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <main>
        <div className='flex h-screen min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-white p-5 font-mono text-gray-200 dark:bg-black'>
          <Header />
          <div className='relative h-full w-full max-w-full min-h-full md:min-h-fit overflow-hidden rounded-lg border-2 dark:border-green-400 border-black bg-white dark:bg-black p-6 font-mono'>
            {/* Spans positioned above the border */}
            <Modules />
          </div>
        </div>
      </main>
    </Suspense>
  )
}
