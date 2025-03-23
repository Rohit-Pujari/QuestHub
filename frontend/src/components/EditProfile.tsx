"use client";
import { getUserInfoAPI, updateUserInfoAPI } from '@/api/auth/authAPI';
import { useAlert } from '@/lib/context/AlertContext';
import { update } from '@/lib/features/Auth/authSlice';
import { RootState } from '@/lib/store';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';


interface EditProfileProps {
    id: string
}

interface User {
    id: string
    username: string
    email: string
    bio: string
    profile_picture: string
}

const EditProfile: React.FC<EditProfileProps> = ({ id }) => {
    const [user, setUser] = useState<User>()
    const userid = useSelector((state: RootState) => state.auth.user?.id)
    const [username, setUsername] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [bio, setBio] = useState('')
    const [profile_picture, setProfilePicture] = useState<File | null>()
    const [progress, setProgress] = useState<number>(0)
    const navigate = useRouter()
    const dispatch = useDispatch()
    const { setAlert } = useAlert()
    const loadUser = async () => {
        const response = await getUserInfoAPI(id)
        if (response) {
            setUser(response)
            setUsername(response.username)
            setEmail(response.email)
            setBio(response.bio)
            return
        }
        setAlert({ message: "Error loading user", type: "error" })
    }
    const updateUser = async () => {
        try {
            if (
                username === user?.username &&
                email === user?.email &&
                bio === user?.bio &&
                !profile_picture // Only check if a new file is uploaded
            ) {
                setAlert({ message: "No fields changed, can't update", type: "info" });
                return;
            }

            let fileurl = user?.profile_picture || ''; // Default to existing picture
            if (profile_picture) {
                const formData = new FormData();
                formData.append("file", profile_picture);
                formData.append("type", "Profile-pic/");

                const fileUpload = await axios.post('/api/cdn', formData, {
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.progress) setProgress(progressEvent.progress);
                    },
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                fileurl = fileUpload.data.fileUrl;
            }
            const response = await updateUserInfoAPI(id, username!, email!, bio, fileurl);
            if (response) {
                const updatedUser = {
                    id: response.id,
                    username: response.username,
                    email: response.email,
                    profile_picture: response.profile_picture
                };
                console.log("Dispatching update:", updatedUser); // Debugging
                dispatch(update({ user: updatedUser }));
                navigate.back();
                return;
            }
            setAlert({ message: "Error updating user", type: "error" });
        } catch (e) {
            setAlert({ message: "Error updating user", type: "error" });
        }
    };
    useEffect(() => {
        if (id) {
            loadUser()
        }
    }, [])
    if (userid !== id) {
        return <div>Not Authorized</div>
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-full  dark:bg-gray-900 p-6">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-xl">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
                    Edit Profile
                </h2>

                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center mb-4">
                    <label htmlFor="profilePic" className="cursor-pointer">
                        {
                            user?.profile_picture ? (

                                <img
                                    src={user?.profile_picture}
                                    className="w-24 h-24 rounded-full border-4 border-gray-300 dark:border-gray-600"
                                />
                            ) : (<FontAwesomeIcon icon={faUser} size="6x" className="text-gray-300 dark:text-gray-600" />)
                        }
                    </label>
                    <input type="file" id="profilePic" className="hidden" onChange={(e) => setProfilePicture(e.target.files?.[0] || null)} />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Click to change profile picture</p>
                </div>

                {/* Upload Progress Bar */}
                {progress > 0 && (
                    <div className="w-full bg-gray-300 dark:bg-gray-700 h-2 rounded-lg overflow-hidden my-2">
                        <div
                            className="bg-blue-500 h-2 transition-all duration-300"
                            style={{ width: `${progress * 100}%` }}
                        ></div>
                    </div>
                )}

                {/* Input Fields */}
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold">Username</label>
                    <input
                        type="text"
                        placeholder={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 mt-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold">Email</label>
                    <input
                        type="email"
                        placeholder={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 mt-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold">Bio</label>
                    <input
                        type="text"
                        placeholder={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className='w-full p-2 mt-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={updateUser}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => navigate.back()}
                        className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition-all duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )

}

export default EditProfile