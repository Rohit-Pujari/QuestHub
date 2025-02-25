'use client';
import { checkEmailAPI, checkUserNameAPI, loginAPI, signUpAPI } from '@/api/auth/authAPI';
import { useAlert } from '@/lib/context/AlertContext';
import GlobalAlert from '@/lib/context/GlobalAlert';
import { login } from '@/lib/features/Auth/authSlice';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';


const SignUp: React.FC = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { setAlert } = useAlert()
    const dispatch = useDispatch();
    const navigate = useRouter()
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setAlert({ message: 'Passwords do not match', type: 'error' })
            return
        }
        if (password.length < 8) {
            setAlert({ message: 'Password must be at least 8 characters long', type: 'info' })
            return
        }
        const passwordCheck = /^(?=.*\b(password|123456|123456789|12345|1234|qwerty|abc123|password1|letmein|welcome|admin|sunshine|iloveyou|princess|123123|qwerty123|1q2w3e4r5t|qwertyuiop)\b).{6,}$/
        if (passwordCheck.test(password)) {
            setAlert({ type: 'info', message: 'Use a Strong Password' })
            return
        }
        try {
            const checkUsername = await checkUserNameAPI(username);
            if (checkUsername.data.exists) {
                setAlert({ message: 'Username Aleready Taken', type: 'info' })
                return
            }
            const checkEmail = await checkEmailAPI(email);
            if (checkEmail.data.exists) {
                setAlert({ message: 'Email exists try with another mail ID', type: 'info' })
                return
            }
            const response = await signUpAPI(username, email, password, confirmPassword)
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
            setAlert({ message: 'Provide all the values correctly', type: 'error' })
            return
        } catch (err) {
            console.log(err);
            setAlert({ message: 'Error occured', type: 'error' })
            return
        }

    }
    return (
        <form
            onSubmit={handleSubmit}
            className='flex flex-col bg-white border border-gray-300 rounded-lg shadow-lg w-fit max-w-md p-6'
        >
            <GlobalAlert />
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Sign-Up</h1>
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
                <label htmlFor='email' className="text-sm text-gray-600 mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    id='email'
                    onChange={(e) => setEmail(e.target.value)}
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
            <section className="flex flex-col mb-4">
                <label htmlFor='confirm_password' className="text-sm text-gray-600 mb-1">Confirm Password</label>
                <input
                    type="password"
                    name="confirm_password"
                    id='confirm_password'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border text-black border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                />
            </section>
            <button type="submit" className="bg-indigo-600 text-white py-2 rounded-md text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300">
                Submit
            </button>
            <span>Already have an Account ? Login! <Link href="/login" className='font-thin text-lg text-blue-600'>here</Link></span>
        </form>
    )
}

export default SignUp