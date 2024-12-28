"use client"
import { GET_POST } from "@/api/graphql/Query"
import DisplayPost from "@/components/Post/DisplayPost";
import ListPosts from "@/components/Post/ListPosts";
import { useQuery } from "@apollo/client"
import { useParams } from "next/navigation";

const Page = () => {
  const { postId } = useParams();
  const { data, loading, error } = useQuery(GET_POST, { variables: { postId } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <DisplayPost post={data?.getPost}/>
  );
}


export default Page;