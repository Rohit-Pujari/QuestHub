import { followAPI, unfollowAPI } from '@/api/post/postAPI';
import { useAlert } from '@/lib/context/AlertContext';
import React, { useEffect, useState } from 'react'

interface FollowBoxProps {
    isFollowed: boolean;
    follower: string;
    following: string
}

const FollowBox: React.FC<FollowBoxProps> = ({ follower, following, isFollowed }) => {
    const [followed, setFollowed] = useState<boolean>(false)
    const { setAlert } = useAlert()
    const handleFollow = async () => {
        if (followed) return
        try {
            const response = await followAPI(follower, following)
            if (response) setFollowed(true)
            setAlert({ message: 'Following user', type: 'success' })
        } catch (err) {
            setAlert({ message: 'Error following user', type: 'error' })
        }
    }
    const handleUnfollow = async () => {
        if (!followed) return
        try {
            const response = await unfollowAPI(follower, following)
            if (response) setFollowed(false)
            setAlert({ message: 'Unfollowed user', type: 'success' })
        } catch (err) {
            setAlert({ message: 'Error unfollowing user', type: 'error' })
        }
    }
    useEffect(() => {
        setFollowed(isFollowed)
        return () => {
            setFollowed(false)
        }
    }, [followed])
    return followed ? (<button className='p-2 text-white font-semibold border rounded-lg border-gray-50 ' onClick={handleUnfollow}>Unfollow</button>) : (<button onClick={handleFollow} className='p-2 text-white font-semibold border rounded-lg border-gray-500'>Follow</button>)

}

export default FollowBox