import type { FC } from 'react'
import React from 'react'

import type { IMainProps } from '@/app/components/share/chat-visitor'
import Main from '@/app/components/share/chat-visitor'

const Chat: FC<IMainProps> = () => {
  return (
    <Main />
  )
}

export default React.memo(Chat)
