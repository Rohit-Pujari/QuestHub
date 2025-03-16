'use client'
import postAPI from "@/api/post/postAPI";
import InfiniteScroll from "@/components/InfinteScroll";
import ListPosts from "@/components/ListPosts";
import { useAlert } from "@/lib/context/AlertContext";
import { RootState } from "@/lib/store";
import { IPost } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<IPost[]>([])
  const pageRef = useRef(1);
  const user = useSelector((state: RootState) => state.auth.user);
  const { setAlert } = useAlert()
  if (!user) return null
  const loadPosts = async () => {
    if (!hasMore) return;
    try {
      const payload = {
        query: `query getPosts($userId: ID!,$skip:Int,$limit:Int!){
        getPosts(userId:$userId,skip:$skip,limit:$limit){
          id
          title
          content
          mediaUrl
          createdAt
          createdBy{
            id
            username
            email
            profile_picture
            isFollowed
          }
          likeCount
          dislikeCount
          likedByUser
          dislikedByUser
        }
      }
      `,
        variables: {
          userId: user.id,
          skip: (pageRef.current - 1) * 10,
          limit: 10
        }
      }
      const response = await postAPI.post("/", payload);
      const newPosts = response.data?.data?.getPosts || [];
      setPosts((prev) => [...prev, ...newPosts]);
      setHasMore(newPosts.length > 0);
      pageRef.current += 1;
    } catch (err) {
      console.log();
      setAlert({ message: "Error Occured", type: "error" })
    }
  }
  useEffect(() => {
    if (user?.id) {
      loadPosts()
    }
  }, [user?.id])
  return (
    <InfiniteScroll fetchMoreData={loadPosts} hasMore={hasMore}>
      <ListPosts posts={posts} />
    </InfiniteScroll>
  )
}