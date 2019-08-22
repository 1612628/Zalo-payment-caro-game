import React, { Component } from 'react';
import './playgame.css';
import {
  MDBContainer,
  MDBRow,
  MDBInput,
  MDBIcon,
  MDBCol,
  MDBNav, MDBNavLink
} from "mdbreact";

import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { BrowserRouter } from 'react-router-dom';
import Board from '../Board';
import Message from '../MessageInPlayScreen';
import { appendMessage } from '../../store/actions/messages';

class PlayGame extends Component {
  constructor(props) {
    super(props);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.state = {
      message: null
    }
  }
  handleMessage = (event) => {
      this.state.message = event.target.value
    }

  handleInput = (event) => {
      this.setState({
          [event.target.id]: event.target.value
      })
  }

  handleSendMessage() {
    this.props.appendMessage(this.state.message,true);
  }
  render() {
    const scrollContainerStyle = { width: "100%", maxHeight: "360px" };
    return (
      <MDBContainer fluid="true">
        <BrowserRouter>
          <MDBNav style={{ backgroundColor: "#dddddd" }}>
            <MDBNavLink className="nav-logo  mr-auto p-2 " to="#"><img src="/images/avarta.png" height="64px" ></img></MDBNavLink>
            <MDBNavLink className="nav-end mt-3" to="#"><img src="/images/info.svg" height="32px" width="32px"></img></MDBNavLink>
            <MDBNavLink style={{ backgroundColor: "while" }} className="nav-end mt-3" to="#"><img src="/images/exit.svg" height="32px" width="32px"></img></MDBNavLink>
          </MDBNav>
        </BrowserRouter>
        <MDBContainer fluid="true" className="mt-2">
          <MDBRow>
            {/* render board game */}
            <MDBCol className="board-game d-flex align-items-center justify-content-center" size="8" style={{ backgroundColor: "#dddddd" }} >
              <Board width={15} height={15} onClick={this.onClick} ></Board>
            </MDBCol>
            <MDBCol size="4" className="pl-4" >
              {/* user info */}
              <MDBRow style={{ backgroundColor: "#747d8c" }} className="user-info" >
                <MDBCol className="d-flex align-items-center justify-content-center " size="6" >
                  <img src="/images/boy.svg" height="64px" width="64px" className="mr-3"></img>
                  <div className="py-2">
                    <div className="d-flex align-middle">
                      <img className="mr-1" src="/images/name.svg" height="32px" width="32px"></img>
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
                </MDBCol>
                <MDBCol className="d-flex align-items-center justify-content-center" size="6" >
                  <img src="/images/boy.svg" height="64px" width="64px" className="mr-3"></img>
                  <div className="py-2">
                    <div className="d-flex align-middle">
                      <img className="mr-1" src="/images/name.svg" height="32px" width="32px"></img>
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
                </MDBCol>
              </MDBRow >
              {/* chat info */}
              <MDBRow>
                <MDBRow style={scrollContainerStyle} className="mt-4 scrollbar scrollbar-primary chat-body d-flex flex-column" >
                  <MDBContainer className="chat-context">
                    <Message></Message>
                  </MDBContainer>
                </MDBRow>
              </MDBRow>
              <MDBRow style={{ backgroundColor: "#DDDDDD" }} className="pr-4">
                <MDBCol size="1" className="d-flex align-items-center">
                  <MDBIcon far icon="comment" className="fa-2x " />
                </MDBCol>
                <MDBCol size="9" >
                  <MDBInput onInput={this.handleMessage}
                    className="text-while input-message-play-game" style={{ backgroundColor: "#9C9C9C" }} />
                </MDBCol>
                <MDBCol size="2" className="d-flex align-items-center">
                  <button className="send-message-play-game mr-3" onClick={this.handleSendMessage}>alo</button>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>

        </MDBContainer>
      </MDBContainer>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    MessageReducer: state.MessageReducer
 }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ appendMessage }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayGame);
