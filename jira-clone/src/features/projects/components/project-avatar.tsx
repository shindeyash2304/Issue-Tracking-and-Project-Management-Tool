import Image from 'next/image';

import { cn, getImageUrl } from '@/lib/utils';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function ProjectAvatar({ className, name, imageUrl, fallbackClassname }: { imageUrl?: string, name: string, className?: string, fallbackClassname?: string }) {
  if (imageUrl) {
    return (
      <div className={cn('size-5 relative rounded-md overflow-hidden', className)}>
        <Image src={getImageUrl(imageUrl)!} alt={name} fill className='object-cover' />
      </div>
    )
  }
  return (
    <Avatar className={cn('size-5', className)}>
      <AvatarFallback className={cn('text-white bg-blue-600 font-semibold text-sm uppercase', fallbackClassname)}>
        {name[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}
