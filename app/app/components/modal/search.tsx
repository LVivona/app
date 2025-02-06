'use client';
import { useModal } from "@/app/context/modal"
import { useState, useRef, useEffect, FormEvent } from "react"


/**
 * Terminal-style search modal component.
 */
export const SearchModal = () => {
    const { closeModal } = useModal()
    const [query, setQuery] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
  
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, [])
  
    const handleSearch = (e: FormEvent) => {
      e.preventDefault()
      console.log('Search:', query)
      closeModal()
    }
  
    return (
      <div className='p-6 text-green-400 font-mono md:w-[500px] w-full'>
        <h2 className='text-xl font-bold'>[ SEARCH ]</h2>
        <form onSubmit={handleSearch} className='mt-4'>
          <input
            ref={inputRef}
            type='text'
            placeholder='Type your search...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='w-full bg-white dark:bg-black text-green-400 border border-green-600 p-2 outline-none'
          />
        </form>
      </div>
    )
  }
  