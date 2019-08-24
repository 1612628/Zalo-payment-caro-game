import React from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import Login from './components//login';
import MainScreenGame from './components/main-screen-game';
import PlayGame from './components/play-game';


class App extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <Login history ={this.props.history}></Login>
      );  
  }
}


export default App;
