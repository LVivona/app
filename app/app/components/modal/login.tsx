import { useState, FormEvent, useRef, useEffect } from 'react'
import { Wallet } from '@/app/utils/wallet'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import { useModal } from '../../context/modal'
import { useUser } from '@/app/context/user'

/**
 * Terminal-style login modal component.
 */
export const LoginModal = () => {
  const { closeModal } = useModal()
  const { user, login } = useUser()
  const [password, setPassword] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault()
    try {
      if (user === null) {
        await cryptoWaitReady()
        const wallet = new Wallet(password)
        login({
          address: wallet.address,
          signiture: wallet.signiture,
        })
        closeModal()
      } else {
        throw new Error('User already signed in.')
      }
    } catch (error) {
      console.error('Failed to create wallet:', error)
    }
  }

  return (
    <div className='p-6 text-green-400 bg-white dark:bg-black border border-green-600 font-mono'>
      <h2 className='text-xl font-bold'>[ LOGIN ]</h2>
      <form onSubmit={handleSignIn} className='mt-4'>
        <input
          ref={inputRef}
          type='password'
          placeholder='Enter password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full bg-white dark:bg-black text-green-400 border border-green-600 p-2 outline-none'
        />
        <button
          type='submit'
          className='mt-3 w-full border border-green-600 bg-white dark:bg-black text-green-400 p-2'
        >
          Sign In
        </button>
      </form>
    </div>
  )
}