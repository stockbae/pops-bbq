import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import EmployeeMenu from './pages/EmployeeMenu'

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
