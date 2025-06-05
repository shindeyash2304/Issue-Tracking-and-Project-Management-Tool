"use client";

import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouseWindow as faHouseWindowSolid } from '@fortawesome/pro-solid-svg-icons/faHouseWindow'
import { faHouseWindow as faHouseWindowRegular } from '@fortawesome/pro-regular-svg-icons/faHouseWindow'
import { faCircleCheck as faCircleCheckSolid } from '@fortawesome/pro-solid-svg-icons/faCircleCheck'
import { faCircleCheck as faCircleCheckRegular } from '@fortawesome/pro-regular-svg-icons/faCircleCheck'
import { faGear as faGearRegular } from '@fortawesome/pro-regular-svg-icons/faGear'
import { faGear as faGearSolid } from '@fortawesome/pro-solid-svg-icons/faGear'
import { faUsers as faUsersSolid } from '@fortawesome/pro-solid-svg-icons/faUsers'
import { faUsers as faUsersRegular } from '@fortawesome/pro-regular-svg-icons/faUsers'
import { type IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { cn } from '@/lib/utils';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

const routes = [
  {
    label: "Home",
    href: "",
    outlineIcon: faHouseWindowRegular,
    activeIcon: faHouseWindowSolid
  },
  {
    label: "Tasks",
    href: "/tasks",
    outlineIcon: faCircleCheckRegular,
    activeIcon: faCircleCheckSolid
  },
  {
    label: "Settings",
    href: "/settings",
    outlineIcon: faGearRegular,
    activeIcon: faGearSolid
  },
  {
    label: "Members",
    href: "/members",
    outlineIcon: faUsersRegular,
    activeIcon: faUsersSolid
  }
]

export default function Navigation() {

  return (
    <div className='flex flex-col'>
      {routes.map((route) => <NavigationItem key={route.label} {...route} />)}
    </div>
  )
}

function NavigationItem({ label, href, outlineIcon, activeIcon }: { label: string, href: string, outlineIcon: IconDefinition, activeIcon: IconDefinition }) {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();
  const fullHref = `/workspaces/${workspaceId}/${href}`
  const isActive = pathname === fullHref;
  const icon = isActive ? activeIcon : outlineIcon;
  return (
    <Link href={fullHref}>
      <div className={cn("flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500", isActive ? "bg-white shadow-sm hover:opacity-100 text-primary" : "")}>
        <FontAwesomeIcon icon={icon} className='size-5 text-neutral-500' />
        {label}
      </div>
    </Link>
  )
}
