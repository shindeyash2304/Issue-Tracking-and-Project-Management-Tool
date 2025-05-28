import Image from 'next/image';

import { cn, getImageUrl } from '@/lib/utils';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function WorkspaceAvatar({ className, name, imageUrl }: { imageUrl?: string, name: string, className?: string }) {
  if (imageUrl) {
    return (
      <div className={cn('size-10 relative rounded-md overflow-hidden', className)}>
        <Image src={getImageUrl(imageUrl)} alt={name} fill className='object-cover' />
      </div>
    )
  }
  return (
    <Avatar className={cn('size-10', className)}>
      <AvatarFallback className='text-white bg-blue-600 font-semibold text-lg uppercase'>
        {name[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}
