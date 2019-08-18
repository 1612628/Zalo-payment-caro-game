import React, { Component } from 'react';
import './mainscreen.css';
import PropTypes from 'prop-types';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon
} from "mdbreact";

import {bindActionCreators} from 'redux';
import socketIOClient from "socket.io-client";
import {updateUser} from '../../store/actions/user';
import { connect } from 'react-redux';

class MainScreenGame extends Component {
  constructor(props) {
    super(props);
    // this.username=React.createRef();
  }
  componentDidMount(){
    const socket = socketIOClient(this.props.ServerReducer.server.endpoint);
    this.props.updateUser(this.props.UserReducer.user.id,
      this.props.UserReducer.user.username,
      this.props.UserReducer.user.golds,
      this.props.UserReducer.user.token,
      this.props.UserReducer.user.totalPlayedGame,socket);
    
  }

  render() {
    const scrollContainerStyle = { width: "800px", maxHeight: "400px" };

    return (
      <MDBContainer fluid="true">
        <MDBContainer>
        <span>ahi</span>
        <MDBRow>
        <MDBCol size="8">
          
        <MDBRow className="scrollbar scrollbar-primary  " size="8" style={scrollContainerStyle}>
             <MDBCol size="6" className="  item">
              <div className="d-flex justify-content-around" width='90%;' style={{backgroundColor: "yellow"}}>
              <div className="font-light">
                <MDBIcon far icon="user" /> ahihi
                </div>
                <div className="font-light">
                  <p>mid</p>
                </div>
                <div className="font-light">
                  <p>mid</p>
                </div>
              </div>
            </MDBCol>
            <MDBCol size="6" className="  item">
              <div className="d-flex justify-content-around" width='90%;' style={{backgroundColor: "yellow"}}>
              <div className="font-light">
                <MDBIcon far icon="user" /> ahihi
                </div>
                <div className="font-light">
                  <p>mid</p>
                </div>
                <div className="font-light">
                  <p>mid</p>
                </div>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBCol>
          <MDBCol size="3" className="ml-5">.col-4</MDBCol>
        </MDBRow>
        </MDBContainer>
      </MDBContainer>
    );
  }
}

const mapStateToProps=(state)=>{
  return{
    UserReducer:state.UserReducer,
    ServerReducer:state.ServerReducer
  }
}

const mapDispatchToProps=(dispatch)=>{
  return bindActionCreators({updateUser},dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(MainScreenGame);