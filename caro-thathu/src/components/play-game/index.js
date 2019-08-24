import React, { Component } from 'react';
import './playgame.css';
import {
  MDBContainer,
  MDBRow,
  MDBInput,
  MDBIcon,
  MDBCol,
  MDBNav, MDBNavLink,
  MDBCard,
  MDBCardBody,
} from "mdbreact";

import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { BrowserRouter } from 'react-router-dom';
import Board from '../Board';
import OpponentInfo from '../opponent-info';
import UserInfo from '../user-info';
import Message from '../message';
import ProcessBar from '../process-bar';
import { appendMessage } from '../../store/actions/messages';
import { startDecrementTime, restartTurn, pauseTime, restartTime } from '../../store/actions/timer';



class PlayGame extends Component {
  constructor(props) {
    super(props);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.state = {
      message: null,
      timeCount: null
    }
  }
  componentDidMount() {
    this.handlePlayGame();
  }

  handlePlayGame = () => {
    let x = setInterval(() => {
      if (this.props.TimeReducer.isMyTurn === true) {
        this.props.startDecrementTime();
        if (this.props.TimeReducer.time <= 0) {
          clearInterval(x);
        }
      } else {
        this.props.restartTime();
        clearInterval(x);
      }
    }, 1000);
  }

  handleMessage = (event) => {
    console.log(event.target.value)
    this.state.message = event.target.value
  }
  handleInput = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleSendMessage() {
    this.props.restartTurn();
    this.handlePlayGame();
    if (this.state.message != null) {
      this.props.appendMessage(this.state.message, true);
    }

  }
  render() {
    return (
      <MDBContainer fluid="true" className="my-row-play-screen" >
        <BrowserRouter>
          <MDBNav style={{ backgroundColor: "#dddddd" }}>
            <MDBNavLink className="nav-logo  mr-auto p-2 " to="#"><img src="/images/avarta.png" height="64px" ></img></MDBNavLink>
            <MDBNavLink className="nav-end mt-3" to="#"><img src="/images/info.svg" height="32px" width="32px"></img></MDBNavLink>
            <MDBNavLink style={{ backgroundColor: "while" }} className="nav-end mt-3" to="#"><img src="/images/exit.svg" height="32px" width="32px"></img></MDBNavLink>
          </MDBNav>
        </BrowserRouter>
        <MDBContainer fluid="true" className="mt-2">
          <MDBRow className="my-row-play-screen">
            {/* render board game */}
            <MDBCol className="board-game d-flex align-items-center justify-content-center radius" size="7" style={{ backgroundColor: "#dddddd" }} >
              <Board width={15} height={15} onClick={this.onClick} ></Board>
            </MDBCol>
            <MDBCol size="5" className="pl-2" >
              {/* user info */}
              <MDBContainer style={{ backgroundColor: "#DDDDDD" }} className="radius" >
                <MDBRow className="user-info rounded" >
                  <MDBCol size="4"  >
                    <UserInfo></UserInfo>
                  </MDBCol>
                  <MDBCol size="4">
                    <MDBContainer style={{ height: '10vh' }} className="d-flex justify-content-center">
                      <p className="bet-gold-play-screen mt-2"> Bet Gold {this.props.RoomGameReducer.roomGame.bettingGolds}</p>
                    </MDBContainer>
                    <MDBContainer className="d-flex justify-content-center align-items-center">
                      <p className="font-pattern pattern-x">X{this.props.UserReducer.user.typePattern}</p>
                      <img src="/images/war.svg" height="50%" width="50%"></img>
                      <p className="font-pattern pattern-o">{this.props.RoomGameReducer.roomGame.opponent.typePattern}</p>
                    </MDBContainer>
                  </MDBCol>
                  <MDBCol size="4" >
                    <OpponentInfo></OpponentInfo>
                  </MDBCol>
                </MDBRow >
              </MDBContainer>
              {/* board game */}
              <MDBContainer className="process-bar-in-play-game ">
                <ProcessBar />
              </MDBContainer>
              {/* chat info */}
              <MDBContainer className="chat-block-in-play-game">
                <MDBRow className="scrollbar-chatbox chat-body" >
                  <Message ></Message>
                </MDBRow>
                {/* button  send  */}
                <MDBRow style={{ backgroundColor: "#dddddd" }} className="pr-4 form-send-message-play-screen">
                  <MDBCol size="10" >
                    <MDBInput onInput={this.handleMessage} label="Message Here"
                      className="text-dark input-message-play-game" />
                  </MDBCol>
                  <MDBCol size="2" className="d-flex align-items-center">
                    <button className="btn-send-message-play-game " onClick={this.handleSendMessage}>Send</button>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
            </MDBCol>
          </MDBRow>

        </MDBContainer>
      </MDBContainer>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    MessageReducer: state.MessageReducer,
    TimeReducer: state.TimeReducer,
    UserReducer: state.UserReducer,
    RoomGameReducer: state.RoomGameReducer
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ appendMessage, startDecrementTime, pauseTime, restartTime, restartTurn }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayGame);
