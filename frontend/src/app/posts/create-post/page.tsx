"use client";
import TinyMCE from '@/components/Editor';
import Form from '@/components/Form';
import React, { useState } from 'react';

const CreatePost = () => {
  const [content, setContent] = useState();
  const fields = [
    {name:"title",label:"Title",type:"text",required:true},
  ]

  const handleSubmit = async () => {
    const response = await fetch('/api/createPost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'My Post',
        content,
        createdBy: '57d3bb37-3cdf-4948-b788-3c465c7aa810',
      }),
    });

    if (response.ok) {
      console.log('Post created!');
    }
  };

  return (
    <div className='flex flex-col items-center'>
      <Form title='Create Post' fields={fields} onSubmit={handleSubmit}  className='text-black'>
        <TinyMCE/>
      </Form>
    </div>
  );
};

export default CreatePost;
