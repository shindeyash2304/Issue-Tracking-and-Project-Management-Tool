"use client";

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/pro-solid-svg-icons/faBars';
import { usePathname } from 'next/navigation';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/sidebar';

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }
    , [pathname]);

  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>
        <Button variant={"secondary"} className='lg:hidden'>
          <FontAwesomeIcon icon={faBars} className='size-4 text-neutral-500' />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className='p-0'>
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}
