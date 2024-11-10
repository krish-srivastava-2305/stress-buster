'use client'
import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { FaEllipsisH, FaHeart, FaRegComment, FaRegHeart } from 'react-icons/fa';

interface Author {
  anonyName: string;
  avatar?: string;
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

interface PostListProps {
  posts: Post[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const PostActions: React.FC<{ post: Post }> = ({ post }) => (
  <div className="flex justify-between mt-4 text-gray-500 w-full max-w-md">
    <motion.button whileHover={{ scale: 1.1, color: '#1d9bf0' }} aria-label="Comment">
      💬 {post.comments}
    </motion.button>
    <motion.button whileHover={{ scale: 1.1, color: '#f91880' }} aria-label="Like">
      ❤️ {post.likes}
    </motion.button>
  </div>
);

const PostList: React.FC<PostListProps> = ({ posts }) => {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full mx-auto"
    >
      {posts.map((post) => (
        <motion.article
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
          className="p-6 border-b border-gray-800 hover:bg-gray-900/50 transition-all"
        >
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
                      day: 'numeric'
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
                  className="flex items-center gap-2 text-gray-500 hover:text-blue-400"
                >
                  <FaRegComment className="w-5 h-5" />
                  <span className="text-sm">{post.comments}</span>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-2 ${
                    likedPosts.has(post.id) ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
                  }`}
                >
                  {likedPosts.has(post.id) ? (
                    <FaHeart className="w-5 h-5" />
                  ) : (
                    <FaRegHeart className="w-5 h-5" />
                  )}
                  <span className="text-sm">{post.likes}</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
};

export default PostList;
