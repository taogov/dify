'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useBoolean, useClickAway } from 'ahooks'
import { useSelectedLayoutSegment } from 'next/navigation'
import { Bars3Icon } from '@heroicons/react/20/solid'
import HeaderBillingBtn from '../billing/header-billing-btn'
import AccountDropdown from './account-dropdown'
import AppNav from './app-nav'
import DatasetNav from './dataset-nav'
import EnvNav from './env-nav'
import ExploreNav from './explore-nav'
import { WorkspaceProvider } from '@/context/workspace-context'
import { useAppContext } from '@/context/app-context'
import LogoSite from '@/app/components/base/logo/logo-site'
import PlanComp from '@/app/components/billing/plan'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
import { useProviderContext } from '@/context/provider-context'

const navClassName = `
  flex items-center relative mr-0 sm:mr-3 px-3 h-9 rounded-xl
  font-medium text-sm
  cursor-pointer
`

const Header = () => {
  const { isCurrentWorkspaceManager, langeniusVersionInfo,isAdmin } = useAppContext()
  const [showUpgradePanel, setShowUpgradePanel] = useState(false)
  const upgradeBtnRef = useRef<HTMLElement>(null)
  useClickAway(() => {
    setShowUpgradePanel(false)
  }, upgradeBtnRef)

  const selectedSegment = useSelectedLayoutSegment()
  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile
  const [isShowNavMenu, { toggle, setFalse: hideNavMenu }] = useBoolean(false)
  const { enableBilling } = useProviderContext()

  useEffect(() => {
    hideNavMenu()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSegment])
  return (
    <div className='flex flex-1 items-center justify-between px-4'>
      <div className='flex items-center'>
        {isMobile && <div
          className='flex items-center justify-center h-8 w-8 cursor-pointer'
          onClick={toggle}
        >
          <Bars3Icon className="h-4 w-4 text-gray-500" />
        </div>}
        {!isMobile && <>
          <Link href="/apps" className='flex items-center mr-4'>
            <LogoSite />
          </Link>
        </>}
      </div>
      {isMobile && (
        <div className='flex'>
          <Link href="/apps" className='flex items-center mr-4'>
            <LogoSite />
          </Link>
        </div>
      )}
      {!isMobile && (
        <div className='flex items-center'>
          <ExploreNav className={navClassName} />
          <AppNav />
          {isAdmin && <DatasetNav />}
        </div>
      )}
      <div className='flex items-center flex-shrink-0'>
        <EnvNav />
        {enableBilling && (
          <div className='mr-3 select-none'>
            <HeaderBillingBtn onClick={() => setShowUpgradePanel(true)} />
            {showUpgradePanel && (
              <div
                ref={upgradeBtnRef as any}
                className='fixed z-10 top-12 right-1 w-[360px]'
              >
                <PlanComp loc='header' />
              </div>
            )}
          </div>
        )}
        <WorkspaceProvider>
          <AccountDropdown isMobile={isMobile}/>
        </WorkspaceProvider>
      </div>
      {(isMobile && isShowNavMenu) && (
        <div className='w-full flex flex-col p-2 gap-y-1'>
          <ExploreNav className={navClassName} />
          <AppNav />
          {isAdmin && <DatasetNav />}
        </div>
      )}
    </div>
  )
}
export default Header
