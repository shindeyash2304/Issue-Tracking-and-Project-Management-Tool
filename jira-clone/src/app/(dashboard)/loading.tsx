import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLoader } from '@fortawesome/pro-solid-svg-icons/faLoader'

export default function Loading() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <FontAwesomeIcon icon={faLoader} spin className='size-6 text-muted-foreground' />
    </div>
  )
}

