'use client';

import { useEffect } from 'react';
import { useModal } from '../../context/modal';
import { useTheme } from '../../context/theme';
import { LoginModal } from '../modal/login';
import { useUser } from '../../context/user';
import { SearchModal } from '../modal/search';

export const Header = () => {
  const { toggleTheme, getTheme } = useTheme();
  const { user, getUserId } = useUser();
  const { openModal } = useModal(); // Access the modal context

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 's') {
        openModal(<></>); // Open search modal on 'S' key press
      }
      if (event.key.toLowerCase() === 'l') {
        openModal(<LoginModal />); // Open login modal on 'L' key press
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [openModal]);

  return (
    <>
      {/* Header component */}
      <span 
        onClick={toggleTheme} 
        className="absolute top-[0.65rem] left-4 md:left-8 dark:text-white text-black dark:bg-black bg-white px-3 cursor-pointer text-xs font-semibold transition-all z-20"
      >
        {getTheme()} mode
      </span>
      
      <span className="absolute top-[0.65rem] md:bottom-[0.7rem] left-1/2 transform -translate-x-1/2 h-6 dark:text-white text-black dark:bg-black bg-white px-3 z-20 text-xs font-semibold">
        Commune AI
      </span>

      <div className="absolute top-[0.68rem] right-4 md:right-8 space-x-6 z-20 flex items-center">
        <span 
          className='px-3 cursor-pointer text-xs font-semibold transition-all dark:text-white text-black dark:bg-black bg-white' 
          onClick={() => {
            openModal(<LoginModal />)
          }}
        >
          {user === null ? "Login" : getUserId() }
        </span>
        <span onClick={() => {
          openModal(<SearchModal/>)
        }} className='px-3 cursor-pointer text-xs font-semibold transition-all dark:text-white text-black dark:bg-black bg-white'>
          Search
        </span>
        { user &&        
          <span className='px-3 cursor-pointer text-xs font-semibold transition-all dark:text-white text-black dark:bg-black bg-white'>
            Create
          </span>
        }
      </div>
    </>
  );
};


export default Header;



  // <header className="sticky top-0 z-40 w-full bg-black border-b border-green-500/30 bg-opacity-90 backdrop-blur font-mono">
  //   <nav className="p-3 px-5 mx-auto flex items-center justify-between max-w-7xl">        {/* Left side: "Logo" with larger copyright */}
  //       <div className="flex items-center gap-1">
  //         <Link href="/" className="flex items-center">
  //           <span className="text-green-500 text-5xl s">©</span>
  //         </Link>
  //         {/* Social icons moved next to copyright */}
  //         <div className="flex items-center space-x-4 ml-4">
  //           {navigation.social.map((item) => (
  //             <a
  //               key={item.name}
  //               href={item.href}
  //               className="fill-current text-green-500 hover:text-green-300 transition-colors"
  //               aria-label={item.name}
  //               target="_blank"
  //               rel="noopener noreferrer"
  //             >
  //               <Image alt={item.name} src={item.icon} width={50} height={50} className="h-5 w-5" />
  //             </a>
  //           ))}
  //         </div>
  //       </div>

  //       {/* Right side: Wallet login/logout */}
  //       <div className="flex gap-4">
  //         {walletInfo ? (
  //           <div className="flex items-center gap-4">
  //             <div className="flex items-center gap-2 px-4 py-2 bg-black/60 border border-green-500/30 rounded">
  //               <span className="text-gray-400 text-sm">
  //                 {walletInfo.address.slice(0, 6)}...
  //                 {walletInfo.address.slice(-4)}
  //               </span>
  //               <CopyButton code={walletInfo.address} />
  //             </div>
  //             <button
  //               onClick={() => setWalletInfo(null)}
  //               className="px-4 py-2 bg-black/60 text-green-400 border border-green-500/30 rounded hover:bg-green-900/20 transition-colors"
  //             >
  //               $ logout
  //             </button>
  //           </div>
  //         ) : (
  //           <form onSubmit={handleSignIn} className="flex items-center gap-2">
  //             <span className="text-green-400 fixed top-2 ml-2 text-xs bg-black">login</span>
  //             <input
  //               type="password"
  //               placeholder="*********"
  //               value={password}
  //               onChange={(e) => setPassword(e.target.value)}
  //               className="px-4 py-2 bg-black/60 border border-green-500/30 rounded 
  //                 text-green-400 text-sm focus:outline-none focus:border-green-400"
  //             />
  //           </form>
  //         )}
  //       </div>
  //     </nav>
  //   </header>