'use client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Login = () => {
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('') 
    const router = useRouter()

    const handleSunbmit = async () => {
        const res = await axios.post('/api/auth/login', {email, password})
        if(res.status === 200){
            console.log('Logged in')
            router.push('/chat')
        }
    }
  return (
    <div>
      <label className='bg-black'>Email: <input onChange={(e) => {setEmail(e.target.value)}} type='text' /></label>
      <label>Password: <input onChange={(e) => {setPassword(e.target.value)}} type='password' /></label>
        <button onClick={handleSunbmit}>Login</button>
    </div>
  )
}

export default Login
