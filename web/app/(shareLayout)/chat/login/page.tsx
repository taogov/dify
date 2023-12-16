// pages/login.tsx
'use client'

import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import styles from './index.module.css'
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
      localStorage.setItem('username', username)
      window.location.href = '/chat'
    }
  }
  return (
    <div className={classNames('flex items-center justify-center h-screen', styles.pcScreen)}>
      <div className={classNames('w-96 p-8 bg-white rounded shadow-lg', styles.shadowMoible)}>
        <h1 className={classNames('text-2xl font-bold mb-4', styles.userLogin)}>用户登录</h1>
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

const LoginArea = () => {
  return (
    <div className={classNames(styles.backgroundBox)}>
      <div className={classNames(styles.backgroundImage)}></div>
      <div className={classNames(styles.loginBox)}>
        <div className={styles.topInfo}>
          <div className={classNames(styles.logo)} />
          <div className={styles.title}>基于AI大模型定制化AI应用引擎</div>
          <div className={styles.textInfo}>AI大模型+行业专业数据+企业私域数据定制企业AI，自动学习数据，自主训练与意图识别，集成多种平台</div>
        </div>
        <LoginPage></LoginPage>
        <div className={classNames(styles.footer)}>
          <div className={styles.messgae}>企业AI战略咨询,解决方案设计,大语言模型私有化部署,模型训练与微调,
            AIGC 应用定制开发,AI教育培训, 核心技术骨干来自Microsoft , AWS, Google全球AI领域顶级厂商的技术咨询和服务团队
          </div>
          <div className={styles.chatCode} />
          <div className={styles.linkInfo}>
             即刻联系GotoAI开始试用，或者推荐商机，赢取佣金
            <a href="https://www.gotoai.world" target='_blank' className={styles.link}>www.gotoai.world</a>
               400-862-1600
          </div>
        </div>
      </div>
      <div className={styles.copyRight}>GotoAI 为深圳市云展信息技术有限公司AI解决方案品牌
           Copyright ©2023 深圳 | 广州 | 北京 | 武汉
      </div>
    </div>
  )
}

const LoginMoible = () => {
  return (
    <div className={styles.moibleBox}>
      <div className={styles.moibleLogo}></div>
      <LoginPage/>
      <div className={styles.moibleFooter}>
        <div className={styles.footerOneMoible}>
          {/* <div className={styles.chatCode} /> */}
          <div className={styles.linkInfoMoible}>
             即刻联系GotoAI开始试用，或者推荐商机，赢取佣金
            <a href="https:/www.gotoai.world" target='_blank' className={styles.link}>www.gotoai.world</a>
               400-862-1600
          </div>
        </div>
        <div className={styles.messgaeMoible}>企业AI战略咨询,解决方案设计,大语言模型私有化部署,模型训练与微调,
            AIGC 应用定制开发,AI教育培训, 核心技术骨干来自Microsoft , AWS, Google全球AI领域顶级厂商的技术咨询和服务团队
        </div>
        <div className={styles.copyRightMoible}>GotoAI 为深圳市云展信息技术有限公司AI解决方案品牌
           Copyright ©2023 深圳 | 广州 | 北京 | 武汉
        </div>
      </div>
    </div>
  )
}

const LoginPageBox = () => {
  const [currentWidth, setWidth] = useState(document.documentElement.clientWidth)
  useEffect(() => {
    window.addEventListener('resize', () => {
      console.log(document.documentElement.clientWidth)
      setWidth(document.documentElement.clientWidth)
      return () => {
        document.removeEventListener('resize', () => {
          console.log('移除完毕')
        })
      }
    })
  }, [])
  return (
    <>
      {currentWidth < 768 ? <LoginMoible/> : <LoginArea/>}
    </>
  )
}
export default React.memo(LoginPageBox)
