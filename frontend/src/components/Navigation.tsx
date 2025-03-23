"use client";
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faSearch, faTimes, faUserAlt } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { SideBarItems } from '@/constants';
import { usePathname, useRouter } from 'next/navigation';
import GlobalAlert from '@/lib/context/GlobalAlert';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { login, logout } from '@/lib/features/Auth/authSlice';
import { logoutAPI } from '@/api/auth/authAPI';

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
    const user = useSelector((state: RootState) => state.auth.user);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = async () => {
        await logoutAPI();
        setDropdownOpen(false);
        dispatch(logout());
    };
    if (!user) return null;
    return (
        <nav className='flex z-50 items-center justify-between p-4 bg-gray-800 dark:bg-black text-white shadow-lg'>
            <div className='flex sm:hidden items-center space-x-4'>
                <button onClick={() => setMobileMenu(!mobileMenu)}>
                    {mobileMenu ? <FontAwesomeIcon icon={faTimes} height={20} width={20} /> : <FontAwesomeIcon icon={faBars} height={20} width={20} />}
                </button>
            </div>
            <div className='hidden sm:flex items-center space-x-4'>
                <Link href="/"><Logo /></Link>
            </div>
            <div className='flex items-center space-x-4 relative'>
                <div className='flex items-center space-x-2 p-2 rounded-lg bg-gray-500 dark:bg-gray-800'>
                    <input type="text" className='bg-gray-500 text-white dark:bg-gray-800' placeholder='Search...' onChange={(e) => setQuery(e.target.value)} />
                    <button onClick={() => router.push(`/search/${query}`)} className='hover:bg-gray-600 dark:hover:bg-gray-700 p-2 rounded-lg'>
                        <FontAwesomeIcon icon={faSearch} height={20} width={20} />
                    </button>
                </div>
                <div className='relative'>
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className='hover:bg-gray-500 dark:hover:bg-gray-700 p-2 rounded-lg'>
                        {user?.profilePicture ?
                            (<img src={user.profilePicture} className='w-8 h-8 rounded-full' />) :
                            (<FontAwesomeIcon icon={faUserAlt} height={20} width={20} size='lg' />)
                        }
                    </button>
                    {dropdownOpen && (
                        <div className='absolute right-0 mt-6 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden'>
                            <button className='block w-full px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700' onClick={() => setDropdownOpen(false)}>
                                <Link href={`/profile/edit/${user?.id}`} >
                                    Edit Profile
                                </Link>
                            </button>
                            <button onClick={() => {
                                handleLogout();
                                router.push('/login');
                            }} className='block w-full  px-4 py-2 text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700'>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
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
    const [isHydrated, setIsHydrated] = useState(false);
    useEffect(() => {
        setIsHydrated(true);
    }, []);
    if (!isHydrated) {
        return <div className="h-screen w-screen bg-gray-200 dark:bg-gray-900"></div>;
    }
    return (
        <div className="flex h-screen w-full">
            {/* Sidebar */}
            <aside className={`absolute sm:relative ${mobileMenu ? 'block' : 'hidden'} sm:flex flex-col w-64 bg-gray-800 dark:bg-black h-screen overflow-hidden shadow-lg`}>
                <Sidebar setMobileMenu={setMobileMenu} mobileMenu={mobileMenu} />
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Navbar */}
                <header className="w-full bg-gray-700 dark:bg-gray-900 text-white shadow-md">
                    <NavBar mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />
                </header>

                {/* Content Section */}
                <main className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-900 custom-scrollbar">
                    <GlobalAlert />
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Navigation