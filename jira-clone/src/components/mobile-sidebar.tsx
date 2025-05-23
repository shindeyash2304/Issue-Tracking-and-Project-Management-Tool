"use client";
import React, { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/pro-solid-svg-icons/faBars';
import Sidebar from './sidebar';
import { usePathname } from 'next/navigation';

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
