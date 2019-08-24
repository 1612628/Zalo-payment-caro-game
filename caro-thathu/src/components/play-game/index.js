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
import { startDecrementTime, restartTime, pauseTime } from '../../store/actions/timer';
import { getOutOfOwnCreatedRoomGame, opponentJoinGame, updateOpponentTypePattern } from '../../store/actions/roomGame';
import { updateUserPattern } from '../../store/actions/user';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const mySwal = withReactContent(Swal);


class PlayGame extends Component {
  constructor(props) {
    super(props);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.state = {
      message: null,
      timeCount: null
    }

    this.props.UserReducer.user.socket.on('opponent_join_game', (data) => {
      console.log('socket opponent_join_game')
      this.props.opponentJoinGame(data.opponentId, data.opponentName, data.opponentGolds);
    })
    this.props.UserReducer.user.socket.on('ready_to_start_game', (gameId) => {
      console.log('socket ready_to_start_game')
      let timerInterval
      mySwal.fire({
        title: 'Please waiting for your opponent!',
        html: '<strong></strong>.',
        timer: 5000,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        onBeforeOpen: () => {
          Swal.showLoading()

          this.props.UserReducer.user.socket.emit('ready_to_play', {
            gameId: gameId,
            userId: this.props.UserReducer.user.id
          });

          timerInterval = setInterval(() => {
            Swal.getContent().querySelector('strong')
              .textContent = (Swal.getTimerLeft() / 1000).toFixed(0)
          }, 100)
        },
        onClose: () => {
          clearInterval(timerInterval)
        }
      }).then((result) => {
        mySwal.fire({
          title: 'Start game',
          type: 'success',
          timer: 500,
          showConfirmButton: false
        })
      })
    })

    this.props.UserReducer.user.socket.on('start_game', (data) => {
      console.log('socket start_game')
      let currentUserPattern, opponentPattern;
      for (const pattern of data.patterns) {
        if (pattern.userId == this.props.UserReducer.user.id) {
          currentUserPattern = pattern.patternType;
        } else {
          opponentPattern = pattern.patternType;
        }
      }

      this.handleStartGame(data.firstUserId, currentUserPattern, opponentPattern);
    })
  }

  handleStartGame = (firstUserId, currentUserPattern, opponentPatterrn) => {
    this.props.updateUserPattern(currentUserPattern);
    this.props.updateOpponentTypePattern(opponentPatterrn);
    if (firstUserId == this.props.UserReducer.user.id) {
      this.props.restartTime();
    } else {
      this.props.startDecrementTime();
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

    handleTeamInfo = () => {
      mySwal.fire({
        title: '<strong>ThaThu Caro</u></strong>',
        type: 'info',
        html:
          'ThaThu Caro is a project that we were trained in Spring Zalopay Fresher Course!!' +
          '<br/> <br/>' +
          'To contact us:' +
          '<br/>' +
          '<a target="blank" href="https://github.com/1612628">thanhnguyenduy2304@gmail</a> <br/>' +
          '<a target="blank" href="https://github.com/sv1612677">thuckhpro@gmail.com</a>',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
          '<i class="fa fa-thumbs-up"></i> Great!',
        confirmButtonAriaLabel: 'Thumbs up, great!',
        cancelButtonText:
          '<i class="fa fa-thumbs-down"></i>',
        cancelButtonAriaLabel: 'Thumbs down'
      });
    }

    handlePlayingPlayerTurn = () => {
      let playing = setInterval(() => {
        if (this.props.TimeReducer.isMyTurn === true) {
          console.log(this.props.TimeReducer.time);
          this.props.startDecrementTime();
          if (this.props.TimeReducer.time < 0) {
            clearInterval(playing);
          }
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

    handleBackToWaitingRoom = async () => {
      this.props.UserReducer.user.socket.emit('get_out_of_game', this.props.RoomGameReducer.roomGame.roomGameId)
      this.props.getOutOfOwnCreatedRoomGame();
      await mySwal.fire({
        type: 'success',
        html: 'Get out of game'
      });
      this.props.history.push('/mainscreengame');
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
              <MDBNavLink className="nav-end mt-3" to="#" onClick={this.handleTeamInfo}><img src="/images/info.svg" height="32px" width="32px"></img></MDBNavLink>
              <MDBNavLink style={{ backgroundColor: "while" }} className="nav-end mt-3" to="#" onClick={this.handleBackToWaitingRoom}><img src="/images/exit.svg" height="32px" width="32px"></img></MDBNavLink>
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
  return bindActionCreators({
    appendMessage,
    startDecrementTime, pauseTime, restartTime,
    getOutOfOwnCreatedRoomGame, opponentJoinGame,
    updateUserPattern,
    updateOpponentTypePattern
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayGame);
