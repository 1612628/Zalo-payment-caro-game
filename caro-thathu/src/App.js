import React from 'react';
import './App.css';
import Register from './components/register';
import Login from './components/login';
import MainScreenGame from './components/man-screen-game'
import ForgotPassword from './components/forgot-password'
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';


function App() {
  return (
    <MainScreenGame></MainScreenGame>
  );
}

export default App;
