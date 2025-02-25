"use client";
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faSearch, faTimes, faUserAlt } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { SideBarItems } from '@/constants';
import { usePathname } from 'next/navigation';
import GlobalAlert from '@/lib/context/GlobalAlert';

interface NavigationProps {
    children: React.ReactNode
}

const Logo: React.FC = () => {
    return (
        <main>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="120"
                height="40"
                viewBox="0 0 200 50"
                fill="none"
            >
                <text
                    x="0"
                    y="35"
                    fontSize="30"
                    fontFamily="Arial, sans-serif"
                    fill="#4F46E5"
                    fontWeight="bold"
                >
                    QuestHub
                </text>
            </svg>
        </main>
    )
}

interface NavBarProps {
    mobileMenu: boolean
    setMobileMenu: (prev: boolean) => void;
}
const NavBar: React.FC<NavBarProps> = ({ mobileMenu, setMobileMenu }) => {
    return (
        <nav className='flex z-50 items-center justify-between p-4 bg-gray-700 dark:bg-black text-white shadow-lg'>
            <div className='flex sm:hidden items-center space-x-4'>
                <button onClick={() => setMobileMenu(!mobileMenu)}>
                    {mobileMenu ? <FontAwesomeIcon icon={faTimes} height={20} width={20} /> : <FontAwesomeIcon icon={faBars} height={20} width={20} />}
                </button>
            </div>
            <div className='hidden sm:flex items-center space-x-4'>
                <Link href="/"><Logo /></Link>
            </div>
            <div className='flex items-center space-x-4'>
                <div className='flex items-center space-x-2 p-2 rounded-lg bg-gray-500 dark:bg-gray-800'>
                    <input type="text" className='bg-gray-500 text-white dark:bg-gray-800' />
                    <button>
                        <FontAwesomeIcon icon={faSearch} height={20} width={20} />
                    </button>
                </div>
                <section className='hover:bg-gray-500 dark:hover:bg-gray-700 p-2 rounded-lg'>
                    <FontAwesomeIcon icon={faUserAlt} height={20} width={20} size='lg' />
                </section>
            </div>
        </nav>
    )
}

interface SidebarProps {
    mobileMenu: boolean;
    setMobileMenu: (prev: boolean) => void;
}
const Sidebar: React.FC<SidebarProps> = ({ setMobileMenu, mobileMenu }) => {
    const pathname = usePathname();
    return (
        <nav className='h-full flex flex-col shadow-lg p-4'>
            {SideBarItems.map((item) => (
                <Link key={item.title} href={item.link} onClick={() => setMobileMenu(!mobileMenu)}>
                    <section className={`flex items-center space-x-4 p-2 m-1 rounded-lg text-white hover:bg-gray-500 dark:hover:bg-gray-700 ${pathname === item.link ? 'bg-gray-500 dark:bg-gray-700' : ''}`}>
                        <FontAwesomeIcon color='white' height={20} width={20} icon={item.icon} /><strong>{item.title}</strong>
                    </section>
                </Link>
            ))}
        </nav>
    )
}


const Navigation: React.FC<NavigationProps> = ({ children }) => {
    const [mobileMenu, setMobileMenu] = useState(false)
    return (
        <main>
            <NavBar mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />
            <main className='flex'>
                {/* sidebar */}
                <aside className={`${mobileMenu ? 'block' : 'hidden'} sm:flex flex-col h-screen overflow-hidden w-64 bg-gray-700 dark:bg-black`}>
                    <Sidebar setMobileMenu={setMobileMenu} mobileMenu={mobileMenu} />
                </aside>
                {/* main content */}
                <section className='w-screen h-screen p-4 items-center bg-white dark:bg-gray-500 '>
                    <GlobalAlert />
                    {children}
                </section>
            </main>
        </main>
    )
}

export default Navigation