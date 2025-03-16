import postAPI from '@/api/post/postAPI';
import { useAlert } from '@/lib/context/AlertContext';
import { RootState } from '@/lib/store';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

interface LikeDislikeViewProps {
    on: string;
    likeCount: number;
    dislikeCount: number;
    userLikes: boolean;
    userDislikes: boolean;
}

const LikeDislikeView: React.FC<LikeDislikeViewProps> = ({ on, likeCount: initialLikes, dislikeCount: initialDislikes, userLikes: initialUserLikes, userDislikes: initialUserDislikes }) => {
    const userId = useSelector((state: RootState) => state.auth.user?.id);
    const { setAlert } = useAlert();

    // State to dynamically update likes, dislikes, and user interactions
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [dislikeCount, setDislikeCount] = useState(initialDislikes);
    const [userLikes, setUserLikes] = useState(initialUserLikes);
    const [userDislikes, setUserDislikes] = useState(initialUserDislikes);

    const handleLike = async () => {
        if (!userId) return setAlert({ message: 'You must be logged in to like posts.', type: 'error' });

        let payload;
        let newLikeCount = likeCount;
        let newDislikeCount = dislikeCount;

        if (userLikes) {
            // Undo like
            payload = {
                query: `mutation undoLike($on: ID!, $likedBy: ID!){ undoLike(on: $on, likedBy: $likedBy) }`,
                variables: { on, likedBy: userId }
            };
            newLikeCount -= 1;
            setUserLikes(false);
        } else {
            // Like the post
            payload = {
                query: `mutation like($on: ID!, $likedBy: ID!){ like(on: $on, likedBy: $likedBy) }`,
                variables: { on, likedBy: userId }
            };
            newLikeCount += 1;
            setUserLikes(true);

            if (userDislikes) {
                newDislikeCount -= 1;
                setUserDislikes(false);
            }
        }

        try {
            const response = await postAPI.post("/", payload);
            if (response.data?.data) {
                setLikeCount(newLikeCount);
                setDislikeCount(newDislikeCount);
            } else {
                setAlert({ message: 'Error updating like status', type: 'error' });
            }
        } catch (error) {
            setAlert({ message: 'Error liking post', type: 'error' });
        }
    };

    const handleDislike = async () => {
        if (!userId) return setAlert({ message: 'You must be logged in to dislike posts.', type: 'error' });

        let payload;
        let newLikeCount = likeCount;
        let newDislikeCount = dislikeCount;

        if (userDislikes) {
            // Undo dislike
            payload = {
                query: `mutation undoDislike($on: ID!, $dislikedBy: ID!){ undoDislike(on: $on, dislikedBy: $dislikedBy) }`,
                variables: { on, dislikedBy: userId }
            };
            newDislikeCount -= 1;
            setUserDislikes(false);
        } else {
            // Dislike the post
            payload = {
                query: `mutation dislike($on: ID!, $dislikedBy: ID!){ dislike(on: $on, dislikedBy: $dislikedBy) }`,
                variables: { on, dislikedBy: userId }
            };
            newDislikeCount += 1;
            setUserDislikes(true);

            if (userLikes) {
                newLikeCount -= 1;
                setUserLikes(false);
            }
        }

        try {
            const response = await postAPI.post("/", payload);
            if (response.data?.data) {
                setLikeCount(newLikeCount);
                setDislikeCount(newDislikeCount);
            } else {
                setAlert({ message: 'Error updating dislike status', type: 'error' });
            }
        } catch (error) {
            setAlert({ message: 'Error disliking post', type: 'error' });
        }
    };

    return (
        <div className="flex items-center space-x-6 mt-4">
            {/* Like Button */}
            <button
                onClick={handleLike}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-400 font-medium transition"
            >
                <FontAwesomeIcon
                    icon={faThumbsUp}
                    color={userLikes ? 'blue' : 'currentColor'}
                />
                <span>{likeCount}</span>
            </button>

            {/* Dislike Button */}
            <button
                onClick={handleDislike}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-400 font-medium transition"
            >
                <FontAwesomeIcon
                    icon={faThumbsDown}
                    color={userDislikes ? 'red' : 'currentColor'}
                />
                <span>{dislikeCount}</span>
            </button>
        </div>
    );
};

export default LikeDislikeView;
