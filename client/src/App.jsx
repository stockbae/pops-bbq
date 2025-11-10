import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import EmployeeMenu from './EmployeeMenu'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/employee-menu" element={<EmployeeMenu />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
