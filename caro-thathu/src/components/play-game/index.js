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
  MDBCardTitle,
  MDBCardText
} from "mdbreact";

import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { BrowserRouter } from 'react-router-dom';
import Board from '../Board';
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
    // if(this.props.TimeReducer.time <=0)
    // {
    //   clearInterval(this.state.timeCount);
    // }

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

    // const scrollContainerStyle = { width: "100%", maxHeight: "360px" };
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
            <MDBCol className="board-game d-flex align-items-center justify-content-center" size="6" style={{ backgroundColor: "#dddddd" }} >
              <Board width={15} height={15} onClick={this.onClick} ></Board>
            </MDBCol>
            <MDBCol size="6" className="pl-2" >
              {/* user info */}

              <MDBContainer style={{ backgroundColor: "#DDDDDD" }} >
                <MDBRow className="user-info" >
                  <MDBCol className="d-flex justify-content-start" size="4"  >
                    <MDBCard style={{ backgroundColor: "#747d8c" }} className="p-3">
                      <MDBCardBody className="p-2 ">
                        <img src="/images/boy.svg" height="64px" width="64px" className="pl-2 ml-2"></img>
                        <div className="py-2">
                          <div className="d-flex align-middle">
                            <img className="mr-2" src="/images/name.svg" height="32px" width="32px"></img>
                            <span className="text-while mt-1">Chí Thức</span>
                          </div>
                          <div className="d-flex align-middle">
                            <img src="/images/coin.svg" height="32px" width="32px" className="mr-2"></img>
                            <span className="text-room">10000</span>
                          </div>
                          <div className="d-flex align-middle">
                            <img src="/images/gamepad.svg" height="32px" width="32px" className="mr-2"></img>
                            <span className="text-room mt-2">100</span>
                          </div>
                        </div>
                      </MDBCardBody>

                    </MDBCard>
                  </MDBCol>
                  <MDBCol size="4">
                    <MDBContainer style={{height:'10vh'}} className="d-flex justify-content-center">
                      <p className="bet-gold-play-screen"> Bet Gold: 10000</p>
                    </MDBContainer>
                    <MDBContainer className="d-flex justify-content-center align-items-center">
                      <p className="font-pattern pattern-x">X</p>
                      <img src="/images/war.svg" height="50%" width="50%"></img>
                      <p className="font-pattern pattern-o">O</p>
                    </MDBContainer>
                  </MDBCol>
                  <MDBCol className="d-flex justify-content-end" size="4" >
                    <MDBCard style={{ backgroundColor: "#747d8c" }} className="p-3">
                      <MDBCardBody className="p-2 ">
                        <img src="/images/boy.svg" height="64px" width="64px" className="pl-2 ml-2"></img>
                        <div className="py-2">
                          <div className="d-flex align-middle">
                            <img className="mr-2" src="/images/name.svg" height="32px" width="32px"></img>
                            <span className="text-while mt-1">Chí Thức</span>
                          </div>
                          <div className="d-flex align-middle">
                            <img src="/images/coin.svg" height="32px" width="32px" className="mr-2"></img>
                            <span className="text-room">10000</span>
                          </div>
                          <div className="d-flex align-middle">
                            <img src="/images/gamepad.svg" height="32px" width="32px" className="mr-2"></img>
                            <span className="text-room mt-2">100</span>
                          </div>
                        </div>
                      </MDBCardBody>

                    </MDBCard>
                  </MDBCol>

                </MDBRow >
              </MDBContainer>

              {/* board game */}
              <MDBContainer className="process-bar-in-play-game">
                <ProcessBar />
              </MDBContainer>
              {/* chat info */}
              <MDBContainer className="chat-block-in-play-game">
                <MDBRow style={{ width: "100%", height: "44vh" }} className="mt-2 scrollbar scrollbar-primary chat-body d-flex flex-column" >
                  <Message ></Message>
                </MDBRow>
                {/* button  send  */}
                <MDBRow style={{ backgroundColor: "#DDDDDD" }} className="pr-4 form-send-message-play-screen">
                  <MDBCol size="1" className="d-flex align-items-center">
                    <MDBIcon far icon="comment" className="fa-2x " />
                  </MDBCol>
                  <MDBCol size="9" >
                    <MDBInput onInput={this.handleMessage}
                      className="text-while input-message-play-game" style={{ backgroundColor: "#9C9C9C" }} />
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
    TimeReducer: state.TimeReducer
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ appendMessage, startDecrementTime, pauseTime, restartTime, restartTurn }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayGame);
