import React, { Suspense,lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SocketContext from './context/SocketSlice';
import './App.css';
import Spinner from './components/Spinner'
import Login from './pages/Login'
import Register from './pages/Register'
const Chat = lazy(() => import('./pages/Chat'));

const App = () => {
  return (
    <BrowserRouter>
      <SocketContext >
        <Suspense fallback={<div><Spinner /></div>}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<Chat />} />
          </Routes>
        </Suspense>
      </SocketContext>
    </BrowserRouter>
  )
}

export default App