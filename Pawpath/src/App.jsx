import { useState } from 'react'
import Sign_in from './components/sign_in/sign_in'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Sign_in></Sign_in>
  )
}

export default App
