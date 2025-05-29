"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/pro-solid-svg-icons/faExclamationTriangle';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function Error() {
  return (
    <div className='h-screen flex flex-col gap-y-4 items-center justify-center'>
      <FontAwesomeIcon icon={faExclamationTriangle} className='size-6 text-muted-foreground' />
      <p className='text-sm text-muted-foreground'>Something went wrong</p>
      <Button variant={'secondary'} asChild>
        <Link href={"/"}>
          Back to home
        </Link>
      </Button>
    </div>
  )
}
