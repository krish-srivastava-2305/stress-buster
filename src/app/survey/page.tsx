'use client';
import { FaLock, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { BackgroundBeams } from '@/components/ui/background-beams';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [text, setText] = useState<string>('');
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!text) {
      return toast.error('Please enter a valid text.');
    }

    try {
      const res = await axios.post('https://cb-nlp-heroku-e2ebb02dfc86.herokuapp.com/cyberbullying_detection', {text})

      const isSuicidal = res.data === 'Cyberbullying' ? true : false;

      // if suicidal send an email to emergenct contact

      const surveySave = await axios.post('/api/survey/detection', { text, score: isSuicidal ? 0 : 1 });

      if (surveySave.status === 200) {
          toast.success('Survey submitted successfully.');
          setText('');
          router.push('/homepage');
      }

    } catch (error) {
      console.error(error);
      toast.error('Failed to submit survey.');
    }
  };

  return (
    <div className="w-full min-h-screen py-24 flex flex-col gap-16 justify-center items-center">
      <Toaster />
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold mb-4 text-center text-white"
      >
        How was your last week and how do you feel about it?
      </motion.h1>
      <form className="space-y-4 w-3/4 max-w-md" onSubmit={handleSubmit}>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <textarea
            placeholder="It was good/bad."
            onChange={(e) => setText(e.target.value)}
            value={text}
            className="w-full p-3 pl-4 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-colors"
        >
          Submit
        </motion.button>
      </form>
      <div className="fixed bg-black -z-10 top-0 left-0 h-full w-full">
        <BackgroundBeams />
      </div>
    </div>
  );
};

export default Page;
