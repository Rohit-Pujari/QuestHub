import React, { useEffect, useRef, useState } from 'react';
import { IUser, Message } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faArrowDown, faUser, faRobot } from '@fortawesome/free-solid-svg-icons';
import { getMessagesAPI } from '@/api/messaging/messageAPI';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useAlert } from '@/lib/context/AlertContext';
import { chatAiAPI } from '@/api/chatbot/chatbot';

interface MessageBoxProps {
    receiverId: string;
    sendMessage: (receiverId: string, content: string) => void;
    selectedUser: IUser;
}

const MessageBox: React.FC<MessageBoxProps> = ({ receiverId, sendMessage, selectedUser }) => {
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const user = useSelector((state: RootState) => state.auth.user);
    const [messages, setMessages] = useState<Message[]>([]);
    const { setAlert } = useAlert();
    const [skip, setSkip] = useState(0);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const limit = 10;

    const handleSendMessage = async () => {
        if (receiverId == "ai_bot") {
            try {
                const response = await chatAiAPI(message);
                const newMessage: Message = { content: message, senderId: user?.id!, receiverId, timestamp: new Date().toISOString() } as Message;
                setMessages((prev) => [...prev, newMessage]);
                setMessages((prev) => [...prev, { content: response.response, senderId: "ai_bot", receiverId, timestamp: new Date().toISOString() } as Message]);
                setMessage('');
                scrollToBottom();
                return
            } catch (err) {
                console.log(err);
                return
            }
        };
        if (message.trim() !== '') {
            const newMessage: Message = { content: message, senderId: user?.id!, receiverId, timestamp: new Date().toISOString() } as Message;
            setMessages((prev) => [...prev, newMessage]); // Append new message
            sendMessage(receiverId, message);
            setMessage('');
            scrollToBottom();
        }
    };

    const fetchMessages = async () => {
        if (receiverId == "ai_bot") return
        try {
            const response = await getMessagesAPI(user?.id!, receiverId, limit, skip);
            setMessages((prevMessages) => {
                const existingMessageIds = new Set(prevMessages.map(msg => msg.timestamp)); // Avoid duplicates
                return [...response.filter(msg => !existingMessageIds.has(msg.timestamp)), ...prevMessages];
            });
            setSkip((prevSkip) => prevSkip + limit);
        } catch (err) {
            setAlert({ message: "Error loading messages", type: "error" });
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        setShowScrollToBottom(false);
    };

    useEffect(() => {
        setMessages([]);
        fetchMessages();
        scrollToBottom();
    }, [selectedUser]);

    const handleScroll = () => {
        if (!messagesContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        if (scrollTop === 0) fetchMessages();
        setShowScrollToBottom(scrollHeight - clientHeight - scrollTop > 200);
    };

    return (
        <div className="flex flex-col h-full w-full dark:bg-[#1a1a2e] shadow-md rounded-lg">
            {/* Header */}
            {selectedUser.id == "ai_bot" ? (
                <div key={selectedUser.id} className="flex items-center p-3 bg-gray-800 border-gray-700 rounded-lg">
                    <FontAwesomeIcon icon={faRobot} className="w-10 h-10 text-[#4F46E5] mr-3" />
                    <span className="text-gray-200 font-semibold">{selectedUser.username}</span>
                </div>) :

                <div key={selectedUser.id} className="flex items-center p-3 bg-gray-800 border-gray-700 rounded-lg">
                    {selectedUser.profile_picture ? (
                        <img src={selectedUser.profile_picture} alt="profile" className="w-10 h-10 rounded-full mr-3 border border-gray-600" />
                    ) : (
                        <FontAwesomeIcon icon={faUser} className="w-10 h-10 text-gray-400 mr-3" />
                    )}
                    <span className="text-gray-200 font-semibold">{selectedUser.username}</span>
                </div>
            }
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 relative" ref={messagesContainerRef} onScroll={handleScroll}>
                {messages.map((msg, index) => {
                    const isSender = msg.senderId === user?.id;
                    return (
                        <div
                            key={index}
                            className={`max-w-[75%] px-4 py-2 rounded-lg shadow-md ${isSender ? "bg-green-500 text-white ml-auto" : "bg-blue-500 text-white mr-auto"
                                } flex flex-col`}
                        >
                            <p className="text-sm opacity-80">{isSender ? "You" : selectedUser.username}</p>
                            <p className="text-base">{msg.content}</p>
                            <p className="text-xs text-gray-300 text-right mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
                {showScrollToBottom && (
                    <button className="absolute bottom-5 right-5 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-600" onClick={scrollToBottom}>
                        <FontAwesomeIcon icon={faArrowDown} size="lg" />
                    </button>
                )}
            </div>

            {/* Input */}
            <div className="flex items-center p-3 border-t border-gray-700 bg-gray-800 rounded-lg">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button onClick={handleSendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </div>
        </div >
    );
};

export default MessageBox;
