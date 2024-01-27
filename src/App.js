import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './home';
import Login from './login';
import Register from './register';
import Chat from './chat';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [ID, setID] = useState("")

  useEffect(() => {
    let token = localStorage.getItem('token')
    if (token === null) {
      setLoggedIn(false)
      return
    }else{
      setUsername(localStorage.getItem('user'))
      setID(localStorage.getItem('id'))
      setLoggedIn(true)
    }
  
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home username={username} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setUsername={setUsername} setID={setID} />} />
          <Route path="/register" element={<Register setLoggedIn={setLoggedIn} setUsername={setUsername} setID={setID} />} />
          <Route path="/chat" element={<Chat setLoggedIn={setLoggedIn} setUsername={setUsername} setID={setID} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
