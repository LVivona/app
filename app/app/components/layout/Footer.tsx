import config from '@/config.json'
import Image from 'next/image'
import React from 'react'

const navigation = {
  social: [
    {
      name: 'GitHub',
      href: config.links.github,
      icon: "/github-icon.svg"
    },
    {
      name: 'Discord',
      href: config.links.discord,
      icon: "/discord-icon.svg"
    },
    {
      name: 'X',
      href: config.links.x,
      icon: "/x-icon.svg"
    },
    {
      name: 'Telegram',
      href: config.links.telegram,
      icon: "/telegram-icon.svg"
    },
  ],
}


export const Footer = () => {
  return (<>
      <div className="absolute bottom-[0.7rem] right-32 text-white bg-black px-2 z-20 text-xs cursor-pointer flex space-x-2">
      {navigation.social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="fill-current text-green-500 hover:text-green-300 transition-colors"
                aria-label={item.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image alt={item.name} src={item.icon} width={50} height={50} className="h-5 w-5" />
              </a>
            ))}
      </div>
  </>)
}
