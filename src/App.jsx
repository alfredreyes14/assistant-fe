import { useState } from 'react'
import Button from '@mui/material/Button';

function App() {
  const [ prompt, setPrompt ] = useState("")
  const [ loading, setLoading ] = useState(false)
  const [ streamedAnswer, setStreamedAnswer ] = useState("")
  return (
    <>
      <Button variant="contained">Hello world</Button>
    </>
  )
}

export default App
