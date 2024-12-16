import React from "react";

const Features: React.FC = () => {
  return (
    <div className="container mx-auto p-10">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        Features of QuestHub
      </h1>
      <ul className="list-disc list-inside text-lg text-gray-700">
        <li>User authentication and secure login</li>
        <li>Personalized user feed with relevant content</li>
        <li>Real-time messaging and chat system</li>
        <li>Customizable profiles and settings</li>
        <li>Seamless integration with multiple services</li>
        <li>Scalable architecture for future growth</li>
      </ul>
      <p className="text-lg text-gray-700 mt-4">
        QuestHub is built with a strong focus on security, performance, and
        user experience. Whether you're a gamer or a tech enthusiast, our
        platform is designed to meet your needs.
      </p>
    </div>
  );
};

export default Features;
