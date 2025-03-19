"use client";
import { getUserInfoAPI } from "@/api/auth/authAPI";
import {
    getCommentsByUserAPI,
    getFollowersAPI,
    getFollowersCountAPI,
    getFollowingAPI,
    getFollowingCountAPI,
    getPostsByUserAPI,
    isFollowedAPI,
} from "@/api/post/postAPI";
import { useAlert } from "@/lib/context/AlertContext";
import { RootState } from "@/lib/store";
import { IComment, IPost, IUser } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import UserBox from "./UserBox";
import InfiniteScroll from "./InfinteScroll";
import ListFollows from "./ListFollows";
import ListPosts from "./ListPosts";
import ListComments from "./ListComments";
import Modal from "./Modal";

interface ProfileViewProps {
    id: string;
}

const ProfileView: React.FC<ProfileViewProps> = ({ id }) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [userProfile, setUserProfile] = useState<IUser | null>(null);
    const [followers, setFollowers] = useState<IUser[]>([]);
    const [following, setFollowing] = useState<IUser[]>([]);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [isFollowersOpen, setIsFollowersOpen] = useState(false);
    const [isFollowingOpen, setIsFollowingOpen] = useState(false);
    const [hasMoreFollowers, setHasMoreFollowers] = useState(true);
    const [hasMoreFollowing, setHasMoreFollowing] = useState(true);
    const [posts, setPosts] = useState<IPost[]>([]);
    const [comments, setComments] = useState<IComment[]>([]);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");
    const followersRef = useRef(1);
    const followingRef = useRef(1);
    const postsRef = useRef(1);
    const commentsRef = useRef(1);
    const { setAlert } = useAlert();

    if (!user) return null;

    const loadProfileAndCounts = async () => {
        if (!user.id) return;
        try {
            const [fetchedProfile, isFollowed, followCount, followingCount] = await Promise.all([
                getUserInfoAPI(id),
                isFollowedAPI(id, user.id),
                getFollowersCountAPI(id),
                getFollowingCountAPI(id),
            ]);

            if (!fetchedProfile) throw new Error("Profile not found");

            setUserProfile({ ...fetchedProfile, isFollowed });
            setFollowersCount(followCount);
            setFollowingCount(followingCount);
        } catch (err) {
            setAlert({ message: "Error loading profile", type: "error" });
        }
    };


    const loadPosts = async () => {
        if (!user.id) return
        try {
            const skip = (postsRef.current - 1) * 10;
            const newPosts = await getPostsByUserAPI(id, user.id, skip);
            if (newPosts) {
                setPosts((prev) => [
                    ...prev,
                    ...newPosts.filter((p) => !prev.some((prev) => prev.id === p.id)),
                ]);
                setHasMorePosts(newPosts.length > 0);
                postsRef.current += 1
            } else {
                setAlert({ message: "Error Fetching Posts", type: "error" });
            }
        } catch (err) {
            setAlert({ message: "Error Fetching Posts", type: "error" });
        }
    };

    const loadComments = async () => {
        if (!user.id) return
        try {
            const skip = (commentsRef.current - 1) * 10;
            const newComments = await getCommentsByUserAPI(id, user.id, skip);
            if (newComments) {
                setComments((prev) => [
                    ...prev,
                    ...newComments.filter((c) => !prev.some((prev) => prev.id === c.id)),
                ]);
                setHasMoreComments(newComments.length > 0);
                commentsRef.current += 1
            } else {
                setAlert({ message: "Error Fetching Comments", type: "error" });
            }
        } catch (err) {
            setAlert({ message: "Error Fetching Comments", type: "error" });
        }
    };

    const loadFollowers = async () => {
        if (!user.id) return
        try {
            const skip = (followersRef.current - 1) * 10;
            const followers = await getFollowersAPI(id, user.id, skip);
            if (followers) {
                setFollowers(followers);
                setHasMoreFollowers(followers.length > 0);
                followersRef.current += 1
            } else {
                setAlert({ message: "Error Fetching Followers", type: "error" });
            }
        } catch (err) {
            setAlert({ message: "Error Fetching Followers", type: "error" });
        }
    }
    const loadFollowing = async () => {
        if (!user.id) return
        try {
            const skip = (followingRef.current - 1) * 10;
            const following = await getFollowingAPI(id, user.id, skip);
            if (following) {
                setFollowing(following);
                setHasMoreFollowing(following.length > 0);
                followingRef.current += 1
            } else {
                setAlert({ message: "Error Fetching Following", type: "error" });
            }
        } catch (err) {
            setAlert({ message: "Error Fetching Following", type: "error" });
        }
    }
    useEffect(() => {
        loadProfileAndCounts();
    }, [id]);


    useEffect(() => {
        setPosts([]);
        postsRef.current = 1;
        loadPosts();
    }, [id]);

    useEffect(() => {
        setFollowers([]);
        setFollowing([]);
        followersRef.current = 1;
        followingRef.current = 1;
    }, [id]);

    if (!userProfile) {
        return (
            <div className="flex flex-col items-center justify-center text-white">
                <p>Loading Profile...</p>
                <button onClick={loadProfileAndCounts} className="mt-2 p-2 bg-blue-500 rounded">
                    Retry
                </button>
            </div>
        );
    }
    return (
        <div className="flex flex-col justify-center items-center bg-black p-2 rounded-lg shadow-lg text-white">
            {/* User Info */}
            <UserBox user={userProfile} />

            {/* Followers & Following */}
            <div className="flex justify-around w-full my-4">
                <button className="relative group hover:text-blue-500" onClick={() => setIsFollowersOpen(!isFollowersOpen)}>
                    Followers: {followersCount}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-0.5 bg-blue-500 transition-all"></span>
                </button>
                <button className="relative group hover:text-blue-500" onClick={() => setIsFollowingOpen(!isFollowingOpen)}>
                    Following: {followingCount}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-0.5 bg-blue-500 transition-all"></span>
                </button>
            </div>

            <div className="w-full h-0.5 bg-gray-500" />

            {/* Tabs */}
            <div className="flex justify-center w-full my-4">
                <button
                    onClick={() => setActiveTab("posts")}
                    className={`px-4 py-2 mx-2 text-lg font-semibold relative hover:text-blue-500 ${activeTab === "posts" ? "text-blue-500" : "text-gray-700"
                        }`}
                >
                    Posts
                    {activeTab === "posts" && (
                        <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"></span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("comments")}
                    className={`px-4 py-2 mx-2 text-lg font-semibold relative hover:text-blue-500 ${activeTab === "comments" ? "text-blue-500" : "text-gray-700"
                        }`}
                >
                    Comments
                    {activeTab === "comments" && (
                        <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"></span>
                    )}
                </button>
            </div>

            {/* Content */}
            {activeTab === "posts" ? (
                <InfiniteScroll fetchMoreData={loadPosts} hasMore={hasMorePosts}>
                    <ListPosts posts={posts} />
                </InfiniteScroll>
            ) : (
                <ListComments
                    comments={comments}
                    getMoreComments={loadComments}
                    hasMore={hasMoreComments}
                />
            )}
            {/* showing followers and following */}
            {isFollowersOpen && (
                <Modal onClose={() => setIsFollowersOpen(false)} title="Followers">
                    <InfiniteScroll fetchMoreData={loadFollowers} hasMore={hasMoreFollowers}>
                        <ListFollows follows={followers} />
                    </InfiniteScroll>
                </Modal>
            )}
            {isFollowingOpen && (
                <Modal onClose={() => setIsFollowingOpen(false)} title="Following">
                    <InfiniteScroll fetchMoreData={loadFollowing} hasMore={hasMoreFollowing}>
                        <ListFollows follows={following} />
                    </InfiniteScroll>
                </Modal>
            )}
        </div>
    )
};

export default ProfileView;
