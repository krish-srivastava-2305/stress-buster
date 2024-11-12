'use client'
import { BackgroundBeams } from '@/components/ui/background-beams';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaEllipsisH, FaHeart, FaRegComment, FaArrowRight, FaRegHeart } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    anonyName: string;
  };
}

interface Post {
  id: string;
  author: {
    anonyName: string;
    id: string;
  };
  content: string;
  image: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
}

const Page = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(`/api/post/get-post?id=${id}`);
        if (res.status === 200) {
          setPost(res.data.post);
          setLiked(res.data.post.liked); // assuming the server responds with a liked status
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    getPost();
  }, [id]);

  const handleLike = async (postId : string) => {

    try {
      const res = await axios.post(`/api/post/like-post`, { postId });
      if (res.status === 200) {
        setLiked(!liked);
        setPost((prevPost) => prevPost ? { ...prevPost, likes: liked ? prevPost.likes - 1 : prevPost.likes + 1 } : null);
      }
    } catch (error) {
      toast.error('Failed to like/dislike post');
    }
  };

  const handleComment = async () => {
    if (!post || !commentText.trim()) return;

    try {
      const res = await axios.post(`/api/post/comment`, { postId: post.id, content: commentText });
      if (res.status === 200) {
        const newComment = res.data.comment; // assuming server returns new comment
        setPost((prevPost) =>
          prevPost ? { ...prevPost, comments: [...prevPost.comments, newComment] } : null
        );
        setCommentText('');
        toast.success('Comment added successfully');
      }
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className='w-full h-[100vh] flex justify-center items-center'>
      <Toaster />
      <motion.article
        key={post?.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
        className="p-6 border-b border-gray-800 hover:bg-gray-900/50 transition-all w-2/3 "
      >
        {post ? (
          <>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {post.author.anonyName[0].toUpperCase()}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white hover:underline">
                      @{post.author.anonyName}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <button className="text-gray-500 hover:text-gray-400">
                    <FaEllipsisH />
                  </button>
                </div>

                <p className="mt-2 text-white text-lg">{post.content}</p>

                {post.image && (
                  <div className="mt-3 rounded-xl overflow-hidden">
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full h-auto object-cover hover:opacity-90 transition-opacity"
                    />
                  </div>
                )}

                <div className="flex items-center gap-6 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 ${
                      liked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
                    }`}
                  >
                    {liked ? <FaHeart className="w-5 h-5" /> : <FaRegHeart className="w-5 h-5" />}
                    <span className="text-sm">{post.likes} likes</span>
                  </motion.button>

                  <div className="flex items-center gap-2 text-gray-500">
                    <FaRegComment className="w-5 h-5" />
                    <span className="text-sm">{post.comments.length} comments</span>
                  </div>
                </div>

                {/* Comment Input Section */}
                <div className="mt-6 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 bg-gray-800 text-white rounded-lg p-2 focus:outline-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleComment}
                    className="bg-blue-500 px-4 py-2 rounded-lg text-white font-semibold"
                  >
                    <FaArrowRight />
                  </motion.button>
                </div>

                {/* Comments Section */}
                <div className="mt-6">
                  <h3 className="text-gray-400 font-semibold">Comments</h3>
                  <div className="mt-4 space-y-4">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-bold">@{comment.user.anonyName}</span>
                        </div>
                        <p className="text-gray-300">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-400">Loading...</p>
        )}
      </motion.article>

      <div className="fixed bg-black -z-10 top-0 left-0 h-full w-full">
        <BackgroundBeams />
      </div>
      <Sidebar tab='Home' />
    </div>
  );
};

export default Page;
