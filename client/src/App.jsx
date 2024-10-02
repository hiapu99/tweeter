import React from 'react'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Feed from './components/Feed'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Profile from './components/Profile'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/signIn' element={<SignIn />} />
          <Route element={<Home />}>
            <Route path='/' element={<Feed />} />
            <Route path='/profile/:id' element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
