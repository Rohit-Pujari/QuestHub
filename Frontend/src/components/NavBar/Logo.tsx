import { Link } from "react-router-dom";
const Logo: React.FC = () => {
  return (
    <Link to="/">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="120"
        height="40"
        viewBox="0 0 200 50"
        fill="none"
      >
        <text
          x="0"
          y="35"
          fontSize="30"
          fontFamily="Arial, sans-serif"
          fill="#4F46E5"
          fontWeight="bold"
        >
          QuestHub
        </text>
      </svg>
    </Link>
  );
};

export default Logo;
