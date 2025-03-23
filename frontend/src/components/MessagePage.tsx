"use client";
import { IUser } from '@/types';
import React, { useState, useEffect, useMemo } from 'react';
import InfiniteScroll from './InfinteScroll';
import MessageBox from './MessageBox';
import useWebSocket from '@/hooks/useWebSocket';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useAlert } from '@/lib/context/AlertContext';
import { getMessagedUsersListAPI } from '@/api/messaging/messageAPI';
import { getUserInfoAPI, queryUsersAPI } from '@/api/auth/authAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import { chatAiAPI } from '@/api/chatbot/chatbot';

interface ListUsersMessageProps {
    users: IUser[];
    loadMoreUsers: () => void;
    onSelectUser: (user: IUser) => void;
    selectedUser: IUser | null;
    searchUsers: (query: string) => void;
    searchedUsers: IUser[];
}

const ListUsersMessage: React.FC<ListUsersMessageProps> = ({ users, loadMoreUsers, onSelectUser, selectedUser, searchUsers, searchedUsers }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchTerm(query);
        if (query.trim().length > 0) {
            searchUsers(query);
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    };

    return (
        <div className="w-1/3 bg-gray-700 dark:bg-[#1a1a2e] text-white flex flex-col m-2">
            {/* Search Bar */}
            <div className="p-3 bg-gray-800 relative rounded-md">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {showModal && (
                    <div className="mt-2 absolute top-full left-0 w-full bg-gray-800 border border-gray-700 shadow-lg z-10 rounded-md overflow-hidden">
                        {searchedUsers.length > 0 ? (
                            searchedUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center p-3 cursor-pointer hover:bg-gray-700 transition rounded-lg"
                                    onClick={() => { onSelectUser(user); setShowModal(false); }}
                                >
                                    {user.profile_picture ? (
                                        <img
                                            src={user.profile_picture}
                                            alt="profile"
                                            className="w-8 h-8 rounded-full mr-3 border border-gray-600"
                                        />
                                    ) : (
                                        <FontAwesomeIcon icon={faUser} className="w-8 h-8 text-gray-400 mr-3" />
                                    )}
                                    <span className="text-gray-300">{user.username}</span>
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-gray-400">No users found</div>
                        )}
                    </div>
                )}
            </div>

            {/* Users List */}
            <div className="m-2 flex-1 overflow-y-auto">
                <InfiniteScroll hasMore={false} fetchMoreData={loadMoreUsers}>
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className={`flex items-center p-4 cursor-pointer border-b rounded-lg shadow-xl border-gray-700 transition ${selectedUser?.id === user.id ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
                                }`}
                            onClick={() => onSelectUser(user)}
                        >
                            {user.id === "ai_bot" ? (
                                <FontAwesomeIcon icon={faRobot} className={`w-10 h-10 ${selectedUser?.id === user.id ? "text-[#4F46E5]" : "text-gray-400"} mr-3`} />
                            ) : user.profile_picture ? (
                                <img
                                    src={user.profile_picture}
                                    alt="profile"
                                    className="w-10 h-10 rounded-full mr-3 border border-gray-600"
                                />
                            ) : (
                                <FontAwesomeIcon icon={faUser} className="w-10 h-10 text-gray-400 mr-3" />
                            )}
                            <span className="text-gray-300 font-medium">{user.username}</span>
                        </div>
                    ))}

                </InfiniteScroll>
            </div>
        </div>
    );

};

const MessagePage: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [users, setUsers] = useState<IUser[]>([]);
    const [searchedUsers, setSearchedUsers] = useState<IUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const { messages, sendMessage } = useWebSocket(user?.id!);
    const { setAlert } = useAlert();


    // Define AI User
    const AI_USER: IUser = {
        id: 'ai_bot',
        username: 'QuestHub AI',
        profile_picture: '',
        bio: '',
        isFollowed: false
    };
    // Inside useEffect or directly in state
    useEffect(() => {
        if (!user?.id) return;
        const fetchUsers = async () => {
            try {
                const response = await getMessagedUsersListAPI(user.id!);
                const userIds = response.map((info) => info.participants.filter((id) => id !== user.id)[0]);
                const userWithInfo = await Promise.all(userIds.map((id) => getUserInfoAPI(id)));
                // Add AI User to the List
                setUsers([AI_USER, ...userWithInfo]);
            } catch (err) {
                setAlert({ message: "Error loading users", type: "error" });
            }
        };
        fetchUsers();
    }, [user?.id]);
    // Only re-run when `user.id` changes    

    const searchUsers = async (query: string) => {
        try {
            const response = await queryUsersAPI(query);
            setSearchedUsers(response);
        } catch (err) {
            setAlert({ message: "Error searching users", type: "error" });
        }
    };
    return (
        <div className="flex h-full w-full bg-gray-700 dark:bg-[#1a1a2e] text-white rounded-lg">
            {/* Left: User List */}
            <ListUsersMessage
                users={users}
                loadMoreUsers={() => { }}
                onSelectUser={setSelectedUser}
                selectedUser={selectedUser}
                searchUsers={searchUsers}
                searchedUsers={searchedUsers}
            />

            {/* Right: Message Box */}
            <div className="w-2/3 h-full flex items-center justify-center bg-gray-700 dark:bg-[#1a1a2e] rounded-lg">
                {selectedUser ? (
                    <MessageBox
                        selectedUser={selectedUser!}
                        receiverId={selectedUser.id}
                        sendMessage={sendMessage}
                    />
                ) : (
                    <div className="text-gray-400 text-lg">
                        Select a user to start messaging
                    </div>
                )}
            </div>
        </div>
    );

};

export default MessagePage;
