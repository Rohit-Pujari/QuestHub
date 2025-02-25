import postAPI from "@/api/post/postAPI";
import ListPosts from "@/components/ListPosts";
import Link from "next/link";

export default async function Home() {
  try {
    const payload = {
      query: `
        query {
          getPosts(limit: 10, skip: 0) {
            id
            title
            createdAt
            createdBy {
              username
            }
            mediaUrl
          }
        }
      `,
    };

    const response = await postAPI.post("/", payload);
    const posts = response?.data?.data?.getPosts;
    // const posts = [{ title: 'Test', id: '1', createdAt: '10/2/2024', createdBy: { username: 'User' }, mediaUrl: '' }]

    return (
      <div>
        {posts?.map((post: { id: string; title: string; createdAt: string; createdBy: { username: string; }; mediaUrl: string; }) => (
          <Link key={post.id} href={`post/${post.id}`}>
            <ListPosts
              id={post.id}
              title={post.title}
              createdAt={post.createdAt}
              createdBy={post.createdBy.username}
              mediaUrl={post.mediaUrl}
            />
          </Link>
        ))}
      </div>
    );
  } catch (err) {
    console.error("Error fetching posts:", err);
    return <div>Error loading posts.</div>;
  }
}
