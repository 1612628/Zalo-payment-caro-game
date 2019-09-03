import React, { Component } from 'react';
import './playgame.css';
import {
  MDBContainer,
  MDBRow,
  MDBInput,
  MDBIcon,
  MDBCol,
  MDBNav,
  MDBNavLink,
  MDBScrollbar,
  MDBListGroup
} from "mdbreact";

import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { BrowserRouter } from 'react-router-dom';
import Board from '../Board';
import OpponentInfo from '../opponent-info';
import UserInfo from '../user-info';
import Message from '../message';
import ProcessBar from '../process-bar';

import { appendMessage,restartMessageList } from '../../store/actions/messages';
import { startDecrementTime, restartTime, pauseTime, restartTurn } from '../../store/actions/timer';
import {
  getOutOfOwnCreatedRoomGame, opponentJoinGame,
  updateOpponentTypePattern, updateGameStatus,
  updateGameIdToContinueGame,
  updateOpponentInfoToContinueGame,
  opponentOutGame,getOutOfGame
} from '../../store/actions/roomGame';
import { updateUserPattern, updateUserGolds, updateUserTotalPlayedGame } from '../../store/actions/user';
import { CellClick, InitBoard } from '../../store/actions/celllist';


import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const mySwal = withReactContent(Swal);


class PlayGame extends Component {
  constructor(props) {
    super(props);
    // this.handleInputMessageChange = this.handleInputMessageChange.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.state = {
      message: null,
      timeCount: null
    }
    this.props.UserReducer.user.socket.on('opponent_join_game', (data) => {
      console.log('socket opponent_join_game')
      this.props.opponentJoinGame(data.opponentId, data.opponentName,
        data.opponentGolds, data.opponentTotalPlayedGame);
    })
    

    this.props.UserReducer.user.socket.on('opponent_out_game', async (data) => {
      console.log('socket opponent_out_game')
      console.log(data)
      await mySwal.fire({
        title: 'You WIN !!!',
        width: 600,
        padding: '3em',
        background: '#fff url(/images/trees.png)',
        backdrop: `
          rgba(0,0,123,0.4)
          url("/images/nyan-cat.gif")
          center left
          no-repeat
        `
      })
      this.props.opponentOutGame(data[0].gameId,data[0].bettingGolds);
      this.props.restartTime();
      let board = await this.createEmptyBoard(15, 15);
      this.props.InitBoard(board);
      this.props.restartMessageList();
      
    })


    this.props.UserReducer.user.socket.on('message_come', (data) => {
      console.log("message_come");
      console.log(data);
      this.props.appendMessage(data.message, data.time, data.userIdSend);
    })

    this.props.UserReducer.user.socket.on('ready_to_start_game', (gameId) => {
      console.log('socket ready_to_start_game');
      this.props.UserReducer.user.socket.emit('ready_to_play', {
        gameId: gameId,
        userId: this.props.UserReducer.user.id
      });
    })

    this.props.UserReducer.user.socket.on('start_game', async (data) => {
      console.log('socket start_game')
      let currentUserPattern, opponentPattern;
      for (const pattern of data.patterns) {
        if (pattern.userId == this.props.UserReducer.user.id) {
          currentUserPattern = pattern.patternType;
        } else {
          opponentPattern = pattern.patternType;
        }
      }

      this.props.updateGameStatus('playing');

      let timerInterval
      await mySwal.fire({
        title: 'Please waiting for your opponent!',
        html: '<strong></strong>.',
        timer: 5000,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        onBeforeOpen: () => {
          mySwal.showLoading()

          timerInterval = setInterval(() => {
            if (mySwal.getContent()) {
              let strong = mySwal.getContent().querySelector('strong');
              if (strong) {
                strong.textContent = (mySwal.getTimerLeft() / 1000).toFixed(0)
              }
            }
          }, 500)
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

      this.handleStartGame(data.firstUserId, currentUserPattern, opponentPattern);
    })

    this.props.UserReducer.user.socket.on('next_turn', (data) => {
      if (this.props.TimeReducer.isMyTurn == false) {

        this.props.CellClick(data.x, data.y, true, data.pattern);
        this.props.restartTurn();
        this.handlePlayGame();
      }
    })

  }

  
  getTimeNow() {
    let date = new Date();
    return (date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
  }
  handleSendMessage() {
    if (this.state.message != null) {
      this.props.UserReducer.user.socket.emit('chat', {
        message: this.state.message,
        userId: this.props.UserReducer.user.id,
        time: this.getTimeNow(),
        gameId: this.props.RoomGameReducer.roomGame.roomGameId.toString()
      });
      this.setState({
        message:'',
        timeCount:this.state.timeCount
      })
    }

  }
  handleInputMessageChange = (e) => {
    this.setState({message: e.target.value,
      timeCount: this.state.timeCount
    });
  }

  handleStartGame = (firstUserId, currentUserPattern, opponentPatterrn) => {
    this.props.updateUserPattern(currentUserPattern);
    this.props.updateOpponentTypePattern(opponentPatterrn);
    if (firstUserId == this.props.UserReducer.user.id) {
      this.props.restartTurn();
      this.handlePlayGame();
    } else {
      this.props.restartTime();
    }

  }
  componentDidMount() {

  }

  handlePlayGame = () => {
    let x = setInterval(() => {
      if (this.props.TimeReducer.isMyTurn === true) {
        this.props.startDecrementTime();
        if (this.props.TimeReducer.time <= 0) {
          this.props.updateGameStatus('end');
          this.props.UserReducer.user.socket.emit('play_time_out', {
            gameId: this.props.RoomGameReducer.roomGame.roomGameId,
            userId: this.props.UserReducer.user.id
          });
          this.props.updateGameStatus('end');
          this.props.restartTime();
          clearInterval(x);
          mySwal.fire({
            type: 'info',
            html: 'Time is over'
          });
        }
      } else {
        this.props.restartTime();
        clearInterval(x);
      }
    }, 1000);
  }

  createEmptyBoard(height, width) {
    let data = [];
    for (let i = 0; i < width; i++) {
      data.push([]);
      for (let j = 0; j < height; j++) {
        data[i][j] = {
          x: j,
          y: i,
          isChecked: false,
          typePattern: ""
        }
      }
    }
    return data;
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

  handle


  handleBackToWaitingRoom = async () => {
    this.props.UserReducer.user.socket.emit('get_out_of_game', {
      gameId: this.props.RoomGameReducer.roomGame.roomGameId,
      userId: this.props.UserReducer.user.id
    })
    this.props.restartMessageList();
    this.props.getOutOfGame();
    let newBoard = await this.createEmptyBoard(15,15);
    this.props.InitBoard(newBoard);
    await mySwal.fire({   
      type: 'success',
      html: 'Get out of game'
    });
    this.props.history.push('/mainscreengame');
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
                      <p className="font-pattern pattern-x">{this.props.UserReducer.user.typePattern}</p>
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
                {/* <MDBRow className="scrollbar-chatbox chat-body list-unstyled" >
                  <Message ></Message>
                </MDBRow>
                <div className="scrollable-chat"> */}
                <div className=" chat-body list-unstyled scrollbar-chatbox">
                  <MDBListGroup className="list-unstyled pl-3 pr-3 ">
                    <Message></Message>
                  </MDBListGroup>
                </div>
                {/* button  send  */}
                <MDBRow style={{ backgroundColor: "#dddddd" }} className="pr-4 form-send-message-play-screen">
                  <MDBCol size="10" >
                    <MDBInput onChange={this.handleInputMessageChange} value = {this.state.message} label="Message Here"
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
    updateUserPattern,opponentOutGame,
    updateOpponentTypePattern,
    restartTurn, CellClick, InitBoard,getOutOfGame,
    updateGameStatus, updateGameIdToContinueGame,
    updateUserGolds, updateUserTotalPlayedGame,
    updateOpponentInfoToContinueGame,restartMessageList
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayGame);
