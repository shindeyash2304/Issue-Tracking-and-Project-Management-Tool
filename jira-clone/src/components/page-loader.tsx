
import { faLoader } from '@fortawesome/pro-solid-svg-icons/faLoader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function PageLoader() {
  return (
    <div className='flex items-center justify-center h-full'>
      <FontAwesomeIcon icon={faLoader} className='size-6 text-muted-foreground' spin />
    </div>
  )
}
