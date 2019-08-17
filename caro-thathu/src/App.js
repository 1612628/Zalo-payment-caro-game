import React from 'react';
import './App.css';
import Login from './components/login';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import socketIOClient from "socket.io-client";

class App extends React.Component{
  constructor(){
    super();
    this.state={
      response:false,
      endpoint:"http://127.0.0.1:4001"
    }
  }

  componentDidMount(){
    const{endpoint}=this.state;
    const socket = socketIOClient(endpoint);
    socket.on("FromServer",data=>this.setState({response:data}));
  }

  render(){
    return (
        <Login></Login>
      );  
  }
  
}

export default App;
