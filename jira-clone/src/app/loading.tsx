import { faLoader } from '@fortawesome/pro-solid-svg-icons/faLoader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Loading() {
  return (
    <div className='h-screen flex flex-col gap-y-4 items-center justify-center'>
      <FontAwesomeIcon icon={faLoader} spin className='size-6 text-muted-foreground' />
    </div>
  )
}
