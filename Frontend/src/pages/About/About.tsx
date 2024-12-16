import React from "react";

const About: React.FC = () => {
  return (
    <div className="container mx-auto p-10">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        About QuestHub
      </h1>
      <p className="text-lg text-gray-700 mb-4">
        QuestHub is a platform designed for gamers and tech enthusiasts. It's a
        place to share knowledge, engage in conversations, and build a community
        around shared interests. Our mission is to create a space where people
        can explore new ideas, connect with like-minded individuals, and grow
        together.
      </p>
      <p className="text-lg text-gray-700">
        The platform includes features like user authentication, a personalized
        feed, messaging system, and much more. QuestHub is built with cutting-edge
        technologies and designed to scale with the growing needs of our users.
      </p>
    </div>
  );
};

export default About;
