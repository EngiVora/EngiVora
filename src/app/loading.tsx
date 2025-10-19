import { Loading } from '@/components/loading'

export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loading 
        size="lg" 
        text="Loading Engivora..." 
        className="text-center"
      />
    </div>
  )
}
