'use client'
import { getPostsAPI } from "@/api/post/postAPI";
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
    if (!hasMore || !user?.id) return;

    try {
      const skip = (pageRef.current - 1) * 10;
      const newPosts = await getPostsAPI(user.id, skip);

      if (newPosts?.length) {
        setPosts((prev) => [...prev, ...newPosts.filter((p) => !prev.some((prevPost) => prevPost.id === p.id))]);
        setHasMore(newPosts.length > 1);
        pageRef.current += 1;
      }
    } catch (err) {
      setAlert({ message: "Error Occurred", type: "error" });
    }
  };

  useEffect(() => {
    setPosts([])
    pageRef.current = 1
    if (user?.id) {
      loadPosts()
    }
    return () => {
      setPosts([])
    }
  }, [user?.id])
  return (
    <InfiniteScroll fetchMoreData={loadPosts} hasMore={hasMore}>
      <ListPosts posts={posts} />
    </InfiniteScroll>
  )
}