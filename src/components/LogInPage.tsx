'use client'
import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaLock, FaRegUserCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { createName } from '@/util/createName';
import toast, { Toaster } from 'react-hot-toast';

/*from-indigo-500 to-purple-500*/

const LogInPage = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <div className='h-full w-full'>
      <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-screen flex items-center justify-center px-10 z-50 bg-gray-900 text-white"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex w-full h-4/5 bg-gray-800 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Left Side - Logo and Message */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-1/2 flex flex-col items-center justify-center space-y-8 bg-gradient-to-br  p-10"
        >
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{
              scale: 1.1, 
              rotate: [0, 90, -30, 0, 0], 
              transition: { duration: 0.6, type: "spring", stiffness: 100 },
            }}
            className="text-9xl font-bold cursor-pointer relative z-10"
          >
            Stress-Off
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative text-4xl font-semibold z-10"
          >
            Write it down.
          </motion.h1>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-2xl font-medium"
          >
            Let it go.
          </motion.h2>
        </motion.div>

        {/* Right Side - Login/Signup Form */}
        <div className="w-1/2 flex flex-col items-center justify-center p-8 rounded-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isLogin ? <Login /> : <Signup />}
            </motion.div>
          </AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6"
          >
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-500 cursor-pointer hover:text-blue-600 relative z-10" 
                  onClick={() => setIsLogin(false)}
                >
                  Sign up
                </motion.span>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-500 cursor-pointer hover:text-blue-600 relative z-10" 
                  onClick={() => setIsLogin(true)}
                >
                  Log in
                </motion.span>
              </p>
            )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const Login = () => {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('api/auth/login', { email, password });
      if(res.status === 200) {
        console.log(res.data);
        toast.success('Logged in successfully');
        router.push('/homepage');
      }
    } catch (error) {
      toast.error('Error logging in');
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <Toaster />
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold mb-4"
      >
        Login
      </motion.h1>
      <form className="space-y-4">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <FaUserCircle size={20} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500 z-20" />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 pl-10 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent relative z-10"
          />
        </motion.div>
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <FaLock size={20} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500 z-20" />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pl-10 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent relative z-10"
          />
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          onClick={handleLogin}
          className="w-full p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-colors relative z-10"
        >
          Log in
        </motion.button>
      </form>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-gray-400 text-center mt-4"
      >
        By logging in, you agree to our{' '}
        <motion.span 
          whileHover={{ scale: 1.05 }}
          className="text-blue-500 cursor-pointer hover:text-blue-600"
        >
          Terms
        </motion.span>{' '}
        and{' '}
        <motion.span 
          whileHover={{ scale: 1.05 }}
          className="text-blue-500 cursor-pointer hover:text-blue-600"
        >
          Privacy Policy
        </motion.span>
        .
      </motion.p>
    </div>
  );
};

const Signup = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [emergencyContact, setEmergencyContact] = useState<string>('');
  const [dob, setDob] = useState<Date | null>(null);
  const [names, setNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const res = await axios.get('api/user/get-all-names');
        const allNames = res.data.map((user: any) => user.anonyName);
        setNames(allNames);
      } catch (error) {
        console.error(error); 
      }
    }
    fetchNames();
  },[])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const anonyName = await createName(names);
    const surveyDays = new Date(Date.now() + 1000*60*60*24*7);
    console.log(email, password, emergencyContact, dob, anonyName, surveyDays);
    try {
      const res = await axios.post('api/auth/register', { email, password, emergencyContact, dateOfBirth: dob?.toISOString(), anonyName, surveyDays: surveyDays.toISOString() });
      if(res.status === 200) {
        console.log(res.data);
        alert('Signed up successfully');
        router.push('/homepage');
      }
    } catch (error) {
      alert('Error signing up');
      console.error(error);
    }
  }



  return (
    <div className="w-full max-w-md space-y-6">
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold mb-4"
      >
        Sign up
      </motion.h1>
      <form className="space-y-4">
        {/* Stagger the form inputs */}
        {[
          { type: 'email', placeholder: 'Email', icon: <FaUserCircle size={20} />, onChange : (e: any) => {setEmail(e.target.value)}  },
          { type: 'password', placeholder: 'Password', icon: <FaLock size={20} />, onChange : (e: any) => {setPassword(e.target.value)} },
          { type: 'password', placeholder: 'Confirm Password', icon: <FaLock size={20} />, onChange : (e: any) => {setConfirmPassword(e.target.value)} },
          { type: 'email', placeholder: 'Emergency Contact (email)', icon: <FaUserCircle size={20} />, onChange : (e: any) => {setEmergencyContact(e.target.value)} },
        ].map((input, index) => (
          <motion.div
            key={input.placeholder}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <span className="absolute top-6 transform -translate-y-1/2 left-3 text-gray-500 z-20">
              {input.icon}
            </span>
            <input
              onChange={input.onChange}
              type={input.type}
              placeholder={input.placeholder}
              className="w-full p-3 pl-10 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent relative z-10"
            />
          </motion.div>
        ))}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative z-10"
        >
          <input
            type="date"
            onChange={(e) => setDob(new Date(e.target.value))}
            className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent relative z-10"
          />
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          onClick={handleSignup}
          className="w-full p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-colors relative z-10"
        >
          Sign up
        </motion.button>
      </form>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-gray-400 text-center mt-4"
      >
        By signing up, you agree to our{' '}
        <motion.span 
          whileHover={{ scale: 1.05 }}
          className="text-blue-500 cursor-pointer hover:text-blue-600"
        >
          Terms
        </motion.span>{' '}
        and{' '}
        <motion.span 
          whileHover={{ scale: 1.05 }}
          className="text-blue-500 cursor-pointer hover:text-blue-600"
        >
          Privacy Policy
        </motion.span>
        .
      </motion.p>
    </div>
  );
};

export default LogInPage;