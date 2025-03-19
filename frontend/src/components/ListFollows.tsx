import { IUser } from '@/types'
import React, { useEffect, useState } from 'react'
import UserBox from './UserBox'

interface ListFollowsProps {
    follows: IUser[]
}

const ListFollows: React.FC<ListFollowsProps> = ({ follows }) => {
    const [follow, setFollows] = useState<IUser[]>([])
    useEffect(() => {
        setFollows(follows)
    }, [follows])
    return follow.length > 0 ? follow.map((user) => (<UserBox key={user.id} user={user} />)) : <p>No Users Found</p>
}

export default ListFollows