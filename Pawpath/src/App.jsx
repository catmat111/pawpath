import { useState } from 'react'
import Sign_in from './components/sign_in/sign_in'
import Login from './components/login/Login.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Login></Login>
  )
}

export default App
