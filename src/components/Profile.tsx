'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    FaUser, 
    FaCalendarAlt, 
    FaEnvelope, 
    FaPhone, 
    FaFileAlt, 
    FaComments 
} from 'react-icons/fa'

interface Post {
    id: string
    content: string
    image: string
    createdAt: Date
}

interface Comment {
    id: string
    content: string
    createdAt: Date
    post: {
        id: string
        title: string
        content: string
        image: string
    }
}

interface ProfileData {
    id: string
    email: string
    anonyName: string
    emergencyContact: string
    dateOfBirth: string
    surveyDays: Date
    posts: Post[]
    comments: Comment[]
}

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
}

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
}

const Profile = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts')

    useEffect(() => {
        const getProfile = async () => {
            try {
                const res = await axios.get('/api/user/get-profile')
                setProfile(res.data.user)
            } catch (error) {
                console.error('Error fetching profile:', error)
            } finally {
                setIsLoading(false)
            }
        }
        getProfile()
    }, [])

    if (isLoading) {
        return (
            <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
                <motion.div 
                    className="animate-pulse"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="h-48 bg-gray-700 rounded-lg w-full" />
                    <div className="h-8 bg-gray-700 rounded w-48 mx-auto mt-4" />
                    <div className="h-96 bg-gray-700 rounded-lg w-full mt-4" />
                </motion.div>
            </div>
        )
    }

    if (!profile) {
        return (
            <motion.div 
                className="max-w-2xl mx-auto mt-6 p-4 bg-red-500/10 border border-red-500 rounded-lg"
                {...fadeIn}
            >
                <p className="text-red-500 text-center">
                    Unable to load profile data. Please try again later.
                </p>
            </motion.div>
        )
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#1111115f] p-6"
        >
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Profile Header */}
                <motion.div 
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                >
                    <div className="text-center">
                        <motion.div 
                            className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaUser size={48} className="text-white" />
                        </motion.div>
                        <motion.h1 
                            className="text-3xl font-bold text-white mb-6"
                            variants={fadeIn}
                        >
                            {profile.anonyName}
                        </motion.h1>
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-200"
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                        >
                            <motion.div 
                                className="flex items-center justify-center space-x-2"
                                variants={fadeIn}
                            >
                                <FaEnvelope className="w-4 h-4 text-blue-400" />
                                <span className="text-sm">{profile.email}</span>
                            </motion.div>
                            <motion.div 
                                className="flex items-center justify-center space-x-2"
                                variants={fadeIn}
                            >
                                <FaCalendarAlt className="w-4 h-4 text-purple-400" />
                                <span className="text-sm">
                                    {new Date(profile.dateOfBirth).toLocaleDateString()}
                                </span>
                            </motion.div>
                            <motion.div 
                                className="flex items-center justify-center space-x-2"
                                variants={fadeIn}
                            >
                                <FaPhone className="w-4 h-4 text-green-400" />
                                <span className="text-sm">{profile.emergencyContact}</span>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Custom Tabs */}
                <div className="flex justify-center space-x-2 mb-6">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('posts')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors duration-200 ${
                            activeTab === 'posts'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        <FaFileAlt className="w-4 h-4" />
                        <span>Posts</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('comments')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors duration-200 ${
                            activeTab === 'comments'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        <FaComments className="w-4 h-4" />
                        <span>Comments</span>
                    </motion.button>
                </div>

                {/* Content Container */}
                <motion.div 
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                >
                    <AnimatePresence mode="wait">
                        {activeTab === 'posts' ? (
                            <motion.div 
                                key="posts"
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-semibold text-white mb-6">Posts</h2>
                                {profile.posts.length > 0 ? (
                                    profile.posts.map((post) => (
                                        <motion.div
                                            key={post.id}
                                            variants={fadeIn}
                                            className="bg-gray-800/80 rounded-lg p-4 hover:bg-gray-700/80 transition-colors duration-200"
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <p className="text-sm text-blue-400 mb-2">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </p>
                                            <p className="text-gray-200 mb-3">{post.content}</p>
                                            {post.image && (
                                                <motion.div 
                                                    className="relative h-48 w-full overflow-hidden rounded-lg"
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    <img
                                                        src={post.image}
                                                        alt="Post content"
                                                        className="object-cover w-full h-full"
                                                    />
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-400">No posts yet</p>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="comments"
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="space-y-4"
                            >
                                <h2 className="text-2xl font-semibold text-white mb-6">Comments</h2>
                                {profile.comments.length > 0 ? (
                                    profile.comments.map((comment) => (
                                        <motion.div
                                            key={comment.id}
                                            variants={fadeIn}
                                            className="bg-gray-800/80 rounded-lg p-4 hover:bg-gray-700/80 transition-colors duration-200"
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <p className="text-gray-200 mb-2">{comment.content}</p>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-purple-400">
                                                    On: {comment.post.title}
                                                </span>
                                                <span className="text-blue-400">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-400">No comments yet</p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default Profile