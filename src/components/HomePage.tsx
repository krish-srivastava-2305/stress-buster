'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCreation from '../components/PostCreation';
import PostList from '../components/PostList';
import Sidebar from '../components/Sidebar';
import { BackgroundBeams } from './ui/background-beams';

interface Author {
  anonyName: string;
  avatar?: string;
  id: string;
}

interface Post {
  id: number;
  content: string;
  author: Author;
  createdAt: string;
  likes: number;
  retweets: number;
  comments: number;
  views: number;
  image?: string;
}

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/api/homepage/get-posts');
        if (res.status === 200) {
          setPosts(res.data.posts);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchPosts();
  }, []);

    return (
        <>
          <div className="flex justify-center items-center gap-4 py-16">
            {/* Make this flaot in air like */}
            <div className="w-2/3 rounded-2xl border-2 border-slate-900 bg-[#3b3b3b50] shadow-2xl">
                <PostCreation onSubmit={(content, imageFile) => {
                console.log(content, imageFile);
                }} />
                <PostList posts={posts} />
            </div>
            <Sidebar tab='Home' />
          </div>
          <div className='fixed bg-black -z-10 top-0 left-0 h-full w-full'>
            <BackgroundBeams />
          </div>
        </>
    );  
}

export default HomePage;
