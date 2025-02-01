'use client'

import { useEffect, useState } from 'react'
import { Footer } from '@/app/components'
import Client from '@/app/client'
import ModuleCard from './ModuleCard'
import { Loading } from '@/app/components/Loading'

type ModuleType = {
  name: string
  key: string
  url: string
  description: string
  network: string
}

const defaultModule: ModuleType = {
  name: 'agi',
  key: 'agi',
  url: 'agi.com',
  description: 'agi module',
  network: 'eth',
}

// Helper to abbreviate keys
function abbreviateKey(key: string) {
  if (key.length <= 12) return key
  return `${key.slice(0, 8)}...${key.slice(-4)}`
}

export default function Modules() {
  const client = new Client()
  const [searchTerm, setSearchTerm] = useState('')
  const [modules, setModules] = useState<ModuleType[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newModule, setNewModule] = useState<ModuleType>(defaultModule)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

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

  const handleCreate = async () => {
    setLoading(true)
    setError('')
    try {
      const { name, key, url, description, network } = newModule
      if (!name || !key) {
        throw new Error('Name and Key are required')
      }
      const params = { name, key, url, description, network }
      await client.call('add_module', params)
      setNewModule(defaultModule)
      setShowCreateForm(false)
      await fetchModules()
    } catch (err: any) {
      setError(err.message || 'Failed to create module')
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (field: string, value: string) => {
    setNewModule((prev) => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const filteredModules = modules.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    fetchModules()
  }, [])

  return (
    <div className="flex flex-col items-center py-10 min-h-screen bg-black font-mono text-gray-200">
      {error && (
        <div className="mb-4 w-full max-w-md px-4 py-2 bg-red-500/80 text-white rounded-lg flex justify-between items-center shadow-lg">
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-4">
            ✕
          </button>
        </div>
      )}

      <div className="flex gap-4 items-center w-full max-w-3xl px-6 mb-12">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
            🔍
          </span>
          <input
            type="text"
            placeholder="search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-sm rounded-lg bg-gray-800 border border-green-500/30 focus:border-green-400 focus:outline-none shadow"
            disabled={loading}
          />
        </div>
        <button
          onClick={fetchModules}
          disabled={loading}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 transition-all border border-green-500/30"
        >
          {loading ? 'Loading...' : '♻️ refresh'}
        </button>
        <button
          onClick={() => setShowCreateForm(true)}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 disabled:opacity-50 transition-all border border-green-500/30"
        >
          module (+)
        </button>
      </div>

      {showCreateForm && (
        <div className="w-full max-w-lg mb-8 p-6 bg-gray-800 rounded-xl border border-green-500/30 shadow-md">
          <h2 className="text-xl font-bold mb-6 text-white">
            New Module
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔑</span>
              <input
                placeholder="Module Key"
                value={newModule.key}
                onChange={(e) => handleFormChange('key', e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white border border-green-500/30 focus:outline-none"
                disabled={loading}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌐</span>
              <input
                placeholder="Address"
                value={newModule.url}
                onChange={(e) => handleFormChange('url', e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white border border-green-500/30 focus:outline-none"
                disabled={loading}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => {
                setShowCreateForm(false)
                setNewModule(defaultModule)
              }}
              disabled={loading}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      )}

      {/* Actual modules listing */}
      <div className="w-full max-w-[1600px] px-4 max-h-[70vh] overflow-y-auto">
        {loading && <Loading />}
        {!loading && filteredModules.length === 0 && (
          <div className="text-center py-4 text-gray-400">
            {searchTerm ? 'No modules found.' : 'No modules available.'}
          </div>
        )}

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredModules.map((m) => (
              <ModuleCard key={m.key} module={m} />
            ))}
          </div>
        )}

        {viewMode === 'table' && filteredModules.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-white border-collapse border border-green-500/30 text-sm">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2 border-b border-green-500/30">
                    Name
                  </th>
                  <th className="px-4 py-2 border-b border-green-500/30">
                    Key
                  </th>
                  <th className="px-4 py-2 border-b border-green-500/30">
                    Address
                  </th>
                  <th className="px-4 py-2 border-b border-green-500/30">
                    Network
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredModules.map((mod) => (
                  <tr
                    key={mod.key}
                    className="hover:bg-gray-800 cursor-pointer"
                    onClick={() => {
                      window.location.href = `/modules/${mod.key}`
                    }}
                  >
                    <td className="px-4 py-2 border-b border-green-500/30">
                      {mod.name}
                    </td>
                    <td className="px-4 py-2 border-b border-green-500/30">
                      {abbreviateKey(mod.key)}
                    </td>
                    <td className="px-4 py-2 border-b border-green-500/30">
                      {mod.url}
                    </td>
                    <td className="px-4 py-2 border-b border-green-500/30">
                      {mod.network}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
