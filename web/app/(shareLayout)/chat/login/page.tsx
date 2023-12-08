// pages/login.tsx
'use client'

import React, { useState } from 'react'
import { fetchAccessToken } from '@/service/share'

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    // 在这里添加登录逻辑
    const result = await fetchAccessToken({
      username, password,
    })
    if (result.access_token !== undefined) {
      localStorage.setItem('token', result.access_token)
      window.location.href = '/chat'
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-96 p-8 bg-white rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-4">用户登录</h1>
        <form>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-semibold mb-2">
              用户名
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-semibold mb-2">
              密码
            </label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            onClick={handleLogin}
          >
            登录
          </button>
        </form>
      </div>
    </div>
  )
}

export default React.memo(LoginPage)
