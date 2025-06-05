"use client";

import { UserButton } from '@/features/auth/components/user-button';
import MobileSidebar from '@/components/mobile-sidebar';
import { usePathname } from 'next/navigation';

const pathnameMap: Record<string, { title: string, description: string }> = {
  "tasks": {
    title: "My tasks",
    description: "View all of your tasks here"
  },
  "projects": {
    title: "My Project",
    description: "View tasks of your project here"
  }
}

const defaultMap = {
  title: "Home",
  description: "Monitor all of your projects and tasks here"
}

export default function Navbar() {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

  const { description, title } = pathnameMap[pathnameKey] || defaultMap

  return (
    <nav className='pt-4 px-6 flex items-center justify-between'>
      <div className="flex-col hidden lg:flex">
        <h1 className='text-2xl font-semibold'>{title}</h1>
        <p className='text-muted-foreground'>{description}</p>
      </div>
      <MobileSidebar />
      <UserButton />

    </nav>
  )
}
