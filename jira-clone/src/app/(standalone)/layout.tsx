
import { UserButton } from '@/features/auth/components/user-button'
import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode } from 'react'

export default function StandaloneLayout({children}:{children: ReactNode}) {
  return (
    <main className='bg-neutral-100 min-h-screen'>
        <div className='mx-auto max-w-screen-2xl p-4'>
            <nav className='flex justify-between items-center h-[72px]'>
                <Link href={"/"}>
                <Image src={"/logo.svg"} alt='Logo' height={100} width={100} />
                </Link>
                <UserButton />
            </nav>

        <div className='flex flex-col items-center justify-center py-4'>

        {children}
        </div>
        </div>
    </main>
  )
}
