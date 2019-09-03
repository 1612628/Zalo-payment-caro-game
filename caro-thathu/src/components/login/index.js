import React, { Component } from 'react';
import './login.css';
import { LoginRequest } from '../../apis'
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBBtn,
  MDBInput
} from "mdbreact";

import socketIOClient from "socket.io-client";

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import {updateUser,initialState,
  updateUserPattern,
  updateUserGolds,
  updateUserTotalPlayedGame} from '../../store/actions/user';
import {CellClick,InitBoard} from '../../store/actions/celllist';
import { getOutOfOwnCreatedRoomGame, opponentJoinGame,
  updateOpponentTypePattern,updateGameStatus,
  updateGameIdToContinueGame,
  updateOpponentInfoToContinueGame,
  resetRoomGame,resetOpponentToDefault } from '../../store/actions/roomGame';
import { appendMessage } from '../../store/actions/messages';
import { startDecrementTime, 
      restartTime,
      restartTurn } from '../../store/actions/timer/index';
import { updateWaitingGame } from '../../store/actions/waitingGames';

import {changeAuth} from '../../store/actions/auth'

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const mySwal = withReactContent(Swal);



class UserLogin extends Component {
  constructor(props) {
    super(props)
    this.props.initialState();
    this.handleLogin = this.handleLogin.bind(this);
    this.state = {
      usernameInput: {
        value:"",
        valid:false
      },
      passwordInput: {
        value:"",
        valid:false
      }
    }

  } 

  handleUsername = (event) => {
    this.setState({
      usernameInput: {value:event.target.value,valid:!!event.target.value}
    })
  }

  handlePassword = (event) => {
    this.setState({
      passwordInput: {value:event.target.value,valid:!!event.target.value}
    })
  }
  
  async handleLogin(event) {
    event.preventDefault();
    if(this.state.usernameInput.value && this.state.passwordInput.value){
      let res = await LoginRequest(this.state.usernameInput.value, this.state.passwordInput.value);
      if(res!=null){
        
        // this.handleSocket(res);
        const socket = socketIOClient(this.props.ServerReducer.server.endpoint,{
          query:{token:this.props.UserReducer.user.token}
        });
        socket.emit('user_id',res.user._id);

        this.props.updateUser(res.user._id,
        res.user.username,
        res.user.golds,
        res.token,
        res.user.total_played_game,socket);
        console.log(this.props.AuthReducer.isAuthenticate);
        this.props.changeAuth(true);
        console.log(this.props.AuthReducer.isAuthenticate);
        this.props.history.push("/mainscreengame");
      }else{
        mySwal.fire({
          title: 'Oops...',
          text: 'Failed to login',
          timer:2000
        });
      }
    }else{
      mySwal.fire({
        title: 'Please fill all information in the form.',
        timer:2000
      });
    }
    
  }
  handleRedirectToRegister=()=>{
    this.props.history.push("/register");
  }
  handleRedirectToForgotPassword=()=>{
    this.props.history.push('/forgotpassword');
  }

  render() {
    return (
        <MDBContainer className="login-container">
          <MDBRow className="d-flex justify-content-center align-items-center my-5">
            <MDBCol md="6">
              <MDBCard className="gray-text">
                <div className="header pt-3 my-4">
                  <MDBRow className="d-flex justify-content-center">
                    <MDBCardHeader className="form-header rounded ">
                      <h3 className="font-weight-bold">
                        <strong>THATHU</strong>
                        <a href="#!" className="green-text font-weight-bold">
                          <strong> CARO</strong>
                        </a>
                      </h3>
                    </MDBCardHeader>
                  </MDBRow>
                </div>
                <MDBCardBody className="mx-4 mt-4">
                  <form>
                    <MDBInput onInput={this.handleUsername}
                    value={this.state.usernameInput.value}
                    className={this.state.usernameInput.valid?"form-control is-valid":"form-control is-invalid"}
                    id="username" icon="user" 
                    label="Your username" 
                    type="text" name="username" 
                    required />

                    <MDBInput 
                    onInput={this.handlePassword}
                    value={this.state.passwordInput.value}
                    className={this.state.passwordInput.valid?"form-control is-valid":"form-control is-invalid"}
                    id="password" icon="lock" 
                    label="Your password" 
                    type="password" 
                    name="password"  
                    required/>
                    <p className="font-small d-flex justify-content-end">
                      <a href="#!" className="green-text ml-1 font-weight-bold" onClick={this.handleRedirectToForgotPassword}>Forgot Password?</a>
                    </p>
                  

                    <MDBRow className="d-flex justify-content-end align-items-center mb-4">
                      <p className="font-small">
                        Don't have an account?
                          <a href="#!" className="green-text ml-1 font-weight-bold" onClick={this.handleRedirectToRegister}>Register</a>
                      </p>
                    </MDBRow>
                    <MDBRow className="d-flex justify-content-center align-items-center mb-4 mt-2">
                      <div className="btn-bound text-center">
                        <MDBBtn type="submit" color="deep-orange" className="btn-block z-depth-1a" onClick={this.handleLogin}>Log in</MDBBtn>
                      </div>
                    </MDBRow>
                  </form>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
    );
  }
}

const mapStateToProps=(state)=>{
  return{
    UserReducer:state.UserReducer,
    ServerReducer:state.ServerReducer,
    AuthReducer:state.AuthReducer,
    MessageReducer: state.MessageReducer,
    TimeReducer: state.TimeReducer,  
    RoomGameReducer: state.RoomGameReducer
  }
}

const mapDispatchToProps=(dispatch)=>{
  return bindActionCreators({
    updateUser,changeAuth,initialState,
    appendMessage,
    startDecrementTime, restartTime,
    getOutOfOwnCreatedRoomGame, opponentJoinGame,
    updateUserPattern,
    updateOpponentTypePattern,
    restartTurn,CellClick,InitBoard,
    updateGameStatus, updateGameIdToContinueGame,
    updateUserGolds,updateUserTotalPlayedGame,
    updateOpponentInfoToContinueGame,
    resetRoomGame,resetOpponentToDefault,
    updateWaitingGame
  }
    ,dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserLogin);
