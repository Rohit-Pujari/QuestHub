import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import FollowBox from './FollowBox';
import { IUser } from '@/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Link from 'next/link';

interface UserBoxProps {
    user: IUser
}

const UserBox: React.FC<UserBoxProps> = ({ user }) => {
    const [id, setId] = useState<string | null>()
    const [userName, setUsername] = useState<string | null>()
    const [profilePicture, setProfilePicture] = useState<string | undefined>()
    const userid = useSelector((state: RootState) => state.auth.user?.id)
    if (!userid) return
    useEffect(() => {
        setId(user.id)
        setUsername(user.username)
        setProfilePicture(user.profile_picture)
        return () => {
            setId(null)
            setUsername(null)
            setProfilePicture(undefined)
        }
    }, [user])
    return (
        <div className="w-full flex justify-center items-center gap-3 text-white">
            {profilePicture ? (
                <img
                    src={profilePicture}
                    className="w-8 h-8 rounded-full"
                />) : (
                <FontAwesomeIcon
                    icon={faUser}
                    className="w-8 h-8 rounded-full"
                />
            )}
            <div className='w-full flex justify-between items-center'>
                <Link href={`/profile/${user.id}`}>
                    <p className="text-white font-semibold">{userName}</p>
                </Link>
                {id !== userid &&
                    <FollowBox follower={userid} following={user.id} isFollowed={user.isFollowed} />
                }
            </div>
        </div>
    )
}

export default UserBox