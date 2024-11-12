'use client'
import React, { useState } from 'react';
import { FaImage, FaPoll, FaSmile, FaCalendar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

interface PostCreationProps {
  onSubmit: (content: string, imageFile: File | null) => void;
}

const PostCreation: React.FC<PostCreationProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', content);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    try {
      const res = await axios.post('/api/user/create-post', formData)
      toast.success('Post created successfully!');
    } catch (error : any) {
      toast.error(error.response.data.error); 
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mx-auto bg-gray-900 rounded-xl shadow-xl p-4 mb-4"
    >
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0" />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="flex-1 bg-transparent text-white resize-none focus:outline-none text-lg min-h-[120px]"
          />
        </div>
        
        {imagePreview && (
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="rounded-xl max-h-80 w-full object-cover" 
            />
            <button
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
              }}
              className="absolute top-2 right-2 bg-gray-900/80 text-white p-2 rounded-full hover:bg-gray-900"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-800 pt-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => document.getElementById('image-input')?.click()}
              className="text-blue-400 hover:text-blue-300"
            >
              <FaImage className="w-5 h-5" />
            </motion.button>
            <input
              id="image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!content.trim() && !imageFile}
            className="bg-blue-500 px-6 py-2 rounded-full font-semibold text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Post
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default PostCreation;
