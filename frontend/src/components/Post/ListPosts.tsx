interface PostItemProps {
  title: string;
  createdBy: string;
  createdAt: string;
}

const ListPosts: React.FC<PostItemProps> = ({ title, createdBy, createdAt }) => {
  return (
    <div className="bg-slate-500 flex flex-col gap-2 items-start rounded-lg shadow-lg p-4 mb-4 hover:bg-slate-400 cursor-pointer text-white transition duration-200 ease-in-out">
      <div className="flex justify-between w-full text-sm text-slate-200">
        <span className="font-medium">By: {createdBy}</span>
        <span>{new Date(createdAt).toLocaleDateString()}</span>
      </div>
      <h2 className="text-lg font-bold text-white">{title}</h2>
    </div>
  );
};

export default ListPosts;
