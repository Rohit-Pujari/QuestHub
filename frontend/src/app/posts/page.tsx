"use client"
import { GET_POSTS } from "@/api/graphql/Query";
import ListPosts from "@/components/Post/ListPosts";
import { useQuery } from "@apollo/client";
import Link from "next/link";

const Page = () => {
  const { data, loading, error } = useQuery(GET_POSTS, { variables: { limit: 10, skip: 0 } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div>
        {data?.getPosts.map((post: any) => (
          <Link key={post.id} href={`/posts/${post.id}`}>
              <ListPosts title={post.title} createdBy={post.createdBy.username} createdAt={post.createdAt} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Page;