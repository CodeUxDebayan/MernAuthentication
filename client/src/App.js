import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';


function App() {

  // const Hi = ()=> {
  //   return (
  //     <div> HI </div>
  //   )}

  return (
    <Router>
      <div className="App">
      
      <Link to='/login' >Login</Link>
      <br />
      <Link to='/signup' >Signup</Link>
      <br />
      <Link to='/dashboard' >Dashboard</Link>
      
      <Routes>
      {/* <Route path='/homepage' element={<Hi/>}/> */}
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
