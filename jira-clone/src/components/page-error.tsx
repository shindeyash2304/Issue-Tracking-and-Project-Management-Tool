import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/pro-solid-svg-icons/faTriangleExclamation'

export default function PageError({ message = "Something went wrong" }: { message?: string }) {
  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <FontAwesomeIcon icon={faTriangleExclamation} className='size-6 text-muted-foreground mb-2' />
      <p className='text-sm text-muted-foreground font-medium'>{message}</p>
    </div>
  )
}
