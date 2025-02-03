import { useState } from 'react'
import { Button } from "@/components/ui/button"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button className="" onClick={() => setCount((count) => count + 1)}>Count is {count}</Button>
    </div>
  )
}

export default App
