"use client";
import GlobalAlert from '@/lib/context/GlobalAlert';
import Link from 'next/link';
import React, { useState } from 'react'
import { useAlert } from '@/lib/context/AlertContext';
import { loginAPI } from '@/api/auth/authAPI';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { login } from '@/lib/features/Auth/authSlice';


const Login: React.FC = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { setAlert } = useAlert()
    const dispatch = useDispatch()
    const navigate = useRouter()
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await loginAPI(username, password)
            if (response.status === 200) {
                const payload = {
                    user: {
                        id: response.data.user.id,
                        username: response.data.user.username,
                        profilePicture: response.data.user.profilePicture
                    },
                    token: response.data.token
                }
                localStorage.setItem('Auth', JSON.stringify(payload))
                dispatch(login(payload))
                navigate.replace('/')
                return
            }
            setAlert({ message: 'Invalid Credentials', type: 'error' })
            return
        } catch (err) {
            setAlert({ message: "Error Occured", type: 'error' })
            return
        }
    }
    return (
        <form
            onSubmit={handleSubmit}
            className='flex flex-col bg-white border border-gray-300 rounded-lg shadow-lg w-fit max-w-md p-6'
        >
            <GlobalAlert />
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Login</h1>
            <section className="flex flex-col mb-4">
                <label htmlFor='username' className="text-sm text-gray-600 mb-1">Username</label>
                <input
                    type="text"
                    name="username"
                    id='username'
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border text-black border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                />
            </section>
            <section className="flex flex-col mb-4">
                <label htmlFor='password' className="text-sm text-gray-600 mb-1">Password</label>
                <input
                    type="password"
                    name="password"
                    id='password'
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border text-black border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                />
            </section>
            <button type="submit" className="bg-indigo-600 text-white py-2 rounded-md text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300">
                Submit
            </button>
            <span>Don't have an Account ? Sign-Up! <Link href="/sign-up" className='font-thin text-lg text-blue-600'>here</Link></span>
        </form>
    )
}

export default Login;