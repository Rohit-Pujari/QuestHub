import React from "react";

const Contact: React.FC = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        Contact Us
      </h1>
      <p className="text-lg text-gray-700 mb-4 text-center">
        Have questions, suggestions, or want to get in touch? We're here to
        help! Reach out to us through the form below or follow us on social
        media.
      </p>
      <form className="max-w-md mx-auto space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-gray-700 font-semibold"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Your Name"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-gray-700 font-semibold"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Your Email"
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-gray-700 font-semibold"
          >
            Message
          </label>
          <textarea
            id="message"
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
            placeholder="Your Message"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
