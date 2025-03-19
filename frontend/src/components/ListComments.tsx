import React, { useEffect, useState } from 'react'
import CommentBox from './CommentBox'
import { IComment } from '@/types'
import InfiniteScroll from './InfinteScroll'
import { usePathname } from 'next/navigation'

export interface ICommentBox {
    id: string,
    content: string,
    parentId: string,
    associatedTo: string,
    createdBy: {
        id: string,
        username: string,
        isFollowed: boolean
    },
    likeCount: number,
    dislikeCount: number,
    createdAt: string,
    likedByUser: boolean,
    dislikedByUser: boolean,
    replies: ICommentBox[],
}

interface ListCommentsProps {
    comments: IComment[]
    getMoreComments: () => void
    hasMore: boolean
}


const ListComments: React.FC<ListCommentsProps> = ({ comments, getMoreComments, hasMore }) => {
    const [commentTree, setCommentTree] = useState<ICommentBox[]>([])
    const pathname = usePathname()
    const onCommentDelete = (id: string) => {
        setCommentTree(commentTree.filter(comment => comment.id !== id))
    }
    useEffect(() => {
        if (!comments.length) return;

        // Create a map to store comments by ID
        const commentMap = new Map<string, ICommentBox>()

        // Initialize the map with all comments
        comments.forEach(comment => {
            commentMap.set(comment.id, { ...comment, replies: [] })
        })

        const rootComments: ICommentBox[] = []

        comments.forEach(comment => {
            if (comment.parentId && commentMap.has(comment.parentId)) {
                const parentComment = commentMap.get(comment.parentId)
                parentComment?.replies.push(commentMap.get(comment.id)!)
            } else {
                rootComments.push(commentMap.get(comment.id)!)
            }
        })

        // Sorting function: First by likeCount (desc), then by createdAt (desc)
        const sortComments = (a: ICommentBox, b: ICommentBox) => {
            if (b.likeCount !== a.likeCount) {
                return b.likeCount - a.likeCount // Sort by most liked
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() // Sort by newest
        }

        // Recursively sort the comments and their replies
        const sortCommentTree = (comments: ICommentBox[]): ICommentBox[] => {
            return comments
                .map(comment => ({
                    ...comment,
                    replies: sortCommentTree(comment.replies)
                }))
                .sort(sortComments)
        }

        setCommentTree(sortCommentTree(rootComments))
        return () => {
            setCommentTree([])
        }
    }, [comments, pathname])
    return (
        <InfiniteScroll hasMore={hasMore} fetchMoreData={getMoreComments} >
            {commentTree.map(comment => (
                <CommentBox key={comment.id} comment={comment} onDelete={onCommentDelete} />
            ))}
        </InfiniteScroll>
    )
}

export default ListComments
