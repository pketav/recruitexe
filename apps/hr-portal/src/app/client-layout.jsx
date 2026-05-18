'use client'

import { usePathname } from 'next/navigation'
import TitleSetter from '@/components/TitleSetter'

export default function ClientLayout({ children }) {
  const pathname = usePathname()

  return (
    <>
      <TitleSetter key={pathname} />
      {children}
    </>
  )
}
