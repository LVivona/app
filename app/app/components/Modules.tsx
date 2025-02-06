'use client'

import { useEffect, useState } from 'react'
import { Client } from '@/app/utils/client'
import { ModuleCard } from '@/app/components/module'
import { ModuleState } from '../types/module'
import Image from 'next/image'

const defaultModule: ModuleState = {
  name: 'agi',
  key: 'agi',
  url: 'agi.com',
  description: 'agi module',
  network: 'eth',
}
export default function Modules() {
  const client = new Client()
  const [searchTerm, setSearchTerm] = useState('')
  const [modules, setModules] = useState<ModuleState[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newModule, setNewModule] = useState<ModuleState>(defaultModule)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchModules = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await client.call('modules')
      if (!Array.isArray(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data)}`)
      }
      setModules(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch modules')
      setModules([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchModules()
  }, [])

  return (
    <>
      {loading && <div className='py-4 text-center '>Loading...</div>}
      {!loading && modules.length === 0 && (
        <div className='flex h-full w-full flex-col items-center justify-center text-gray-400'>
          {searchTerm ? (
            'No modules found.'
          ) : (
            <Image
              alt='commune-ai-logo'
              src='/commune-ai-logo.svg'
              width={500}
              height={500}
              className='invert dark:invert-0 opacity-50'
            />
          )}
        </div>
      )}
      <div className='grid h-full grid-cols-1 gap-6 overflow-auto px-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {modules.map((m) => (
          <ModuleCard key={m.key} module={m} />
        ))}
      </div>
    </>
  )
}
