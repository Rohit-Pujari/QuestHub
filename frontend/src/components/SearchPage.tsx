"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store';
import { useAlert } from '@/lib/context/AlertContext';
import { isFollowedAPI, queryPostsAPI } from '@/api/post/postAPI';
import { IPost, IUser } from '@/types';
import { queryUsersAPI } from '@/api/auth/authAPI';
import InfiniteScroll from './InfinteScroll';
import ListPosts from './ListPosts';
import UserBox from './UserBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface IProps {
    query: string
}

const SearchPage: React.FC<IProps> = ({ query }) => {
    const userid = useSelector((state: RootState) => state.auth.user?.id)
    const [queries, setQuery] = useState<string>(query)
    const [posts, setPosts] = useState<IPost[]>([])
    const [users, setUsers] = useState<IUser[]>([])
    const [tab, setTab] = useState<'posts' | 'users'>('posts')
    const postRef = useRef(1)
    const { setAlert } = useAlert()
    if (!userid) return null;

    const loadPosts = async () => {
        if (!userid || queries === '') return;
        try {
            const skip = (postRef.current - 1) * 10;
            const posts = await queryPostsAPI(userid, queries, skip);
            setPosts(posts);
        } catch (err) {
            setAlert({ message: "Error fetching posts", type: 'error' });
        }
    };

    const loadUsers = async () => {
        if (!userid || queries === '') return;
        try {
            const users: IUser[] = await queryUsersAPI(queries);
            users.map(async (user) => user.isFollowed = await isFollowedAPI(userid, user.id));
            setUsers(users);
        } catch (err) {
            setAlert({ message: "Error fetching users", type: 'error' });
        }
    };

    useEffect(() => {
        if (query) {
            setQuery(query);
            loadPosts();
        }
        return () => {
            setPosts([]);
            setUsers([]);
        };
    }, [query]);

    return (
        <div className="flex flex-col justify-center items-center bg-gray-800 dark:bg-black p-4 rounded-lg shadow-lg text-black dark:text-white gap-4">
            <div className='w-full flex justify-center items-center'>
                <input
                    type='text'
                    value={queries}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        tab === "posts" ? loadPosts() : loadUsers();
                    }}
                    className='w-1/2 p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-lg'
                />
                <button
                    onClick={() => { tab === "posts" ? loadPosts() : loadUsers(); }}
                    className='bg-blue-500 p-2 rounded-lg ml-2 hover:bg-blue-600 dark:hover:bg-blue-400'
                >
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </div>
            <div className='border-b-2 border-gray-300 dark:border-gray-600 w-full' />
            <div className="flex justify-center w-full my-4">
                <button
                    onClick={() => setTab("posts")}
                    className={`px-4 py-2 mx-2 text-lg font-semibold relative group hover:text-blue-500 ${tab === "posts" ? "text-blue-500" : "text-gray-700 dark:text-gray-300"}`}
                >
                    Posts
                    {tab === "posts" && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"></span>}
                </button>
                <button
                    onClick={() => setTab("users")}
                    className={`px-4 py-2 mx-2 text-lg font-semibold relative group hover:text-blue-500 ${tab === "users" ? "text-blue-500" : "text-gray-700 dark:text-gray-300"}`}
                >
                    Users
                    {tab === "users" && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"></span>}
                </button>
            </div>
            <p className='text-lg text-gray-400'>Search Results for {queries}</p>
            {tab === "posts"
                ? (<InfiniteScroll fetchMoreData={loadPosts} hasMore={false}><ListPosts posts={posts} /></InfiniteScroll>)
                : users.length > 0 && (<InfiniteScroll hasMore={false} fetchMoreData={loadUsers}>{users.map((user) => (<UserBox key={user.id} user={user} />))}</InfiniteScroll>) || <p className='text-lg text-gray-400'>No users found</p>}
        </div>
    )
}

export default SearchPage;
