import { dislikeAPI, likeAPI, undoDislikeAPI, undoLikeAPI } from '@/api/post/postAPI';
import { useAlert } from '@/lib/context/AlertContext';
import { RootState } from '@/lib/store';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
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
    const [likeCount, setLikeCount] = useState<number>(initialLikes);
    const [dislikeCount, setDislikeCount] = useState<number>(initialDislikes);
    const [userLikes, setUserLikes] = useState<boolean>();
    const [userDislikes, setUserDislikes] = useState<boolean>();

    const handleLike = async () => {
        if (!userId) return setAlert({ message: 'You must be logged in to like posts.', type: 'error' });

        let newLikeCount = likeCount;
        let newDislikeCount = dislikeCount;
        try {
            if (userLikes) {
                // Undo like
                const response = await undoLikeAPI(on, userId);
                if (!response) return setAlert({ message: 'Error undoing like', type: 'error' });
                newLikeCount -= 1;
                setUserLikes(false);
            }
            if (userDislikes) {
                const response = await undoDislikeAPI(on, userId);
                if (!response) return setAlert({ message: 'Error liking post', type: 'error' })
                newDislikeCount -= 1;
                setUserDislikes(false);
            }
            // Like the post
            const response = await likeAPI(on, userId);
            if (!response) return setAlert({ message: 'Error liking post', type: 'error' });
            newLikeCount += 1;
            setUserLikes(true);
            setLikeCount(newLikeCount);
            setDislikeCount(newDislikeCount);
        } catch (error) {
            setAlert({ message: 'Error liking post', type: 'error' });
        }
    };

    const handleDislike = async () => {
        if (!userId) return setAlert({ message: 'You must be logged in to dislike posts.', type: 'error' });
        let newLikeCount = likeCount;
        let newDislikeCount = dislikeCount;
        try {
            if (userDislikes) {
                // Undo dislike
                const response = await undoDislikeAPI(on, userId);
                if (!response) return setAlert({ message: 'Error undoing dislike', type: 'error' });
                newDislikeCount -= 1;
                setUserDislikes(false);
            }
            if (userLikes) {
                const response = await undoLikeAPI(on, userId);
                if (!response) return setAlert({ message: 'Error undoing like', type: 'error' });
                newLikeCount -= 1;
                setUserLikes(false);
            }
            // Dislike the post
            const response = await dislikeAPI(on, userId);
            if (!response) setAlert({ message: " Error Disliking", type: 'error' })
            newDislikeCount += 1;
            setUserDislikes(true);
            setDislikeCount(newDislikeCount);
            setLikeCount(newLikeCount);
        } catch (error) {
            setAlert({ message: 'Error disliking post', type: 'error' });
        }
    };
    useEffect(() => {
        setLikeCount(initialLikes);
        setDislikeCount(initialDislikes);
        setUserLikes(initialUserLikes);
        setUserDislikes(initialUserDislikes);
        return () => {
            setDislikeCount(0);
            setLikeCount(0);
            setUserDislikes(false);
            setUserLikes(false);
        }
    }, [on, initialLikes, initialDislikes, initialUserLikes, initialUserDislikes])
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
