import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Body from '../src/components/Body'
import Login from '../src/components/Login'
import Profile from '../src/components/Profile'
import Feed from "../src/components/Feed"
import {Provider} from "react-redux"
import appStore from './utils/appStore'
import Connections from './components/Connections'
import Requests from './components/Requests'
import Chat from './components/Chat'


function App() {
  

  return (
    <>
    <Provider store={appStore}>
    <BrowserRouter basename='/'>
    <Routes>
      <Route path="/" element={<Body />}>
        <Route index element={<Feed />} />
        <Route path="login" element={<Login />} />
        <Route path="profile" element={<Profile />} />
        <Route path="connections" element={<Connections />} />
        <Route path="requests" element={<Requests />} />
        <Route path="chat/:targetUserId" element={<Chat/>} />
      </Route>
    </Routes>
    </BrowserRouter>
    </Provider>
    </>
  )
}

export default App
