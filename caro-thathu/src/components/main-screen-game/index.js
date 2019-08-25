import React, { Component } from 'react';
import './mainscreen.css';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBNav, MDBNavLink, MDBBtn

} from "mdbreact";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateUser,userLogOut } from '../../store/actions/user';
import { updateLeaderboard } from '../../store/actions/leaderboard';
import { updateWaitingGame } from '../../store/actions/waitingGames';
import {createRoomGame} from '../../store/actions/roomGame';
import {changeAuth} from '../../store/actions/auth';

import {LogoutRequest, LeaderboardRequest, WaitingRoomGamesRequest,CreateRoomGameRequest } from '../../apis'

import { BrowserRouter } from 'react-router-dom';

import WaitingGameBox from '../waiting-game-box';
import Leaderboard from '../leaderboard';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const mySwal = withReactContent(Swal);


class MainScreenGame extends Component {
  constructor(props) {
    super(props);
    this.props.UserReducer.user.socket.on('update_list_waiting_game', (msg) => {
      console.log('socket update_list_waiting_game');
      if(msg.userId !== this.props.UserReducer.user.id)
      {
        if(msg.data == undefined  || msg.data == null 
          || msg.data.length == 0)
        {
          console.log("no have data")
          this.props.updateWaitingGame([]);
        }
        else{
          console.log("have data")
          console.log(msg.data)
          this.props.updateWaitingGame(msg.data);
        }
      }
    })
  }

  
  async componentDidMount() {
    let users = await LeaderboardRequest(this.props.UserReducer.user.token);
    if(users){
      this.props.updateLeaderboard(users);
    }
    

    let waitingRoomGames = await WaitingRoomGamesRequest(this.props.UserReducer.user.token);
    if(waitingRoomGames){
      this.props.updateWaitingGame(waitingRoomGames);
    }
    window.onpopstate=(event)=>{
      event.preventDefault();
      LogoutRequest(this.props.UserReducer.user.token,this.props.UserReducer.user.id)
      this.props.changeAuth(false);
      this.props.userLogOut();
      this.props.history.push('/');
    }    
   
  }


  getRenderWaitingGames(waitingGames){
    if(waitingGames){
      return waitingGames.map((waitingGame,index)=>{
        return(
          <WaitingGameBox history={this.props.history} key={index} index={index}></WaitingGameBox>
        )
      })
    }else{
      return null;
    }
  }
  getRenderLeaderboard(leaderboards){
    if(leaderboards){
      return leaderboards.map((user,index)=>{
        return(
          <Leaderboard key={index} index={index}></Leaderboard>
        )
      })
    }else{
      return null;
    }
  }

  handleReload=async ()=>{
    let users = await LeaderboardRequest(this.props.UserReducer.user.token);
    if(users){
      this.props.updateLeaderboard(users);
    }
    

    let waitingRoomGames = await WaitingRoomGamesRequest(this.props.UserReducer.user.token);
    if(waitingRoomGames){
      this.props.updateWaitingGame(waitingRoomGames);
    }
  }

  handleBack = () => {
    LogoutRequest(this.props.UserReducer.user.token,this.props.UserReducer.user.id)
    this.props.changeAuth(false);
    this.props.userLogOut();
    this.props.history.push('/');
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
  handleCreateGame=()=>{
    mySwal.fire({
      title: 'Create Game',
      html: '<span><p style="color:#ffbf00">Select betting golds for your room</p><img alt="" src="/images/coin.svg" height="32px" width="32px"></img></span>',
      input: 'select',
      inputOptions: {
        '0': '0',
        '1000': '1000',
        '2000': '2000',
        '5000': '5000',
        '10000': '10000'
      },
      showCancelButton: true
    })
    .then(async (result)=> {
      if (result.value) {
        let res = await CreateRoomGameRequest(this.props.UserReducer.user.token,
          this.props.UserReducer.user.id,
          result.value);
        if(res){
          // res.status(200).json({roomGameId:idGameCount,betting_golds:bettingGolds,status:'waiting'});

          this.props.UserReducer.user.socket.emit('create_game',{
            gameId:res.roomGameId,
            userId: this.props.UserReducer.user.id
          });
          this.props.createRoomGame(res.roomGameId,'waiting',result.value);
          await mySwal.fire({
            type: 'success',
            html: 'You create a room with betting golds: ' + result.value,
            timer:1500
          });
          
          this.props.history.push('/playgame');
        }else{
          await mySwal.fire({
            type: 'warning',
            html: 'Failed to create a room with betting golds: ' + result.value
          });
        }
        

      }})
    };

  renderUserInfo = () => {
    return (
      <MDBRow className="  d-flex justify-content-end hover-item" style={{ backgroundColor: "#5B5B5B" }} >
        <MDBCol size="4" className=" pt-3 pb-3 d-flex justify-content-center align-items-center">
          <img src="/images/boy.svg" height="64px" width="64px"></img>
        </MDBCol>
        <MDBCol size="7" className="">
          <div className="d-flex flex-column pt-3 pb-3">
            <div className="pt-1 pb-1">
              <img src="/images/name.svg" height="32px" width="32px" className="mr-2"></img>
              <span className="text-room">{this.props.UserReducer.user.username}</span>
            </div>
            <div className="pt-1 pb-1">
              <img src="/images/coin.svg" height="32px" width="32px" className="mr-2"></img>
              <span className="text-room">{this.props.UserReducer.user.golds}</span>
            </div>
            <div className="pt-1">
              <img src="/images/gamepad.svg" height="32px" width="32px" className="mr-2"></img>
              <span className="text-room mt-2">{this.props.UserReducer.user.totalPlayedGame}</span>
            </div>
          </div>
        </MDBCol>
      </MDBRow >
    );
  }
  render() {
    const scrollContainerStyle = { width: "100%", height: "90vh" };
    return (
      <MDBContainer fluid="true">
        <BrowserRouter>
          <MDBNav style={{ backgroundColor: "#ee6c4d" }}>
            <MDBNavLink className="nav-logo  mr-auto p-2 " to="#"><img alt="" src="/images/avarta.png" height="64px" onClick={this.handleReload}></img></MDBNavLink>
            <MDBNavLink className="nav-end mt-3" to="#"><img alt="" src="/images/info.svg" height="32px" width="32px" onClick={this.handleTeamInfo}></img></MDBNavLink>
            <MDBNavLink style={{ backgroundColor: "while" }} className="nav-end mt-3" to="#" onClick={this.handleBack}><img alt="" src="/images/exit.svg" height="32px" width="32px"></img></MDBNavLink>
          </MDBNav>
        </BrowserRouter>
        <MDBContainer fluid="true" className="mt-2">
          <MDBRow className="mx-0">

            {/* list room game */}
            <MDBCol size="8" >            
              <MDBRow className="scrollbar scrollbar-default d-flex flex-wrap align-items-start" style={scrollContainerStyle} >
                <MDBContainer>
                  <MDBRow>
                    {this.getRenderWaitingGames(this.props.WaitingGamesReducer.waitingGames)}
                  </MDBRow>  
                </MDBContainer>
              </MDBRow>
            </MDBCol>
            <MDBCol size="4" className="pl-4 d-fle justify-content-center" >
              
              <div className="d-flex flex-column" style={{height:"100%"}}>
                {/* user info */}
                <MDBRow className="  d-flex justify-content-end user-box" style={{ backgroundColor: "#5B5B5B" }} >
                  <MDBCol size="4" className=" pt-3 pb-3 d-flex justify-content-center align-items-center">
                    <img alt="" src="/images/boy.svg" height="64px" width="64px"></img>
                  </MDBCol>
                  <MDBCol size="7" className="">
                    <div className="d-flex flex-column pt-3 pb-3">
                      <div className="pt-1 pb-1">
                        <img alt="" src="/images/name.svg" height="32px" width="32px" className="mr-2"></img>
                        <span className="text-room">{this.props.UserReducer.user.username}</span>
                      </div>
                      <div className="pt-1 pb-1">
                        <img alt="" src="/images/coin.svg" height="32px" width="32px" className="mr-2"></img>
                        <span className="text-room">{this.props.UserReducer.user.golds}</span>
                      </div>
                      <div className="pt-1">
                        <img alt="" src="/images/sword.svg" height="32px" width="32px" className="mr-2"></img>
                        <span className="text-room mt-2">{this.props.UserReducer.user.totalPlayedGame}</span>
                      </div>
                    </div>
                  </MDBCol>
                </MDBRow >

                {/* leader board */}
                <MDBRow id="leader-board" style={{ backgroundColor: "#3D496B",height:"100%"}} className="mt-4 hover-item d-flex flex-column">
                  <MDBContainer className="d-flex justify-content-center align-items-center">
                    <h3 className="text-light">Leaderboard</h3>
                  </MDBContainer>
                  <MDBContainer style={{ backgroundColor: "#5B5B5B" }} >
                    <MDBRow className="scrollbar scrollbar-default d-flex flex-wrap" style={{width:"100%",height:"58vh"}} >
                      <MDBContainer style={{ backgroundColor: "#5B5B5B" }} >
                        {this.getRenderLeaderboard(this.props.LeaderboardReducer.leaderboard)}
                      </MDBContainer>
                    </MDBRow>
                  </MDBContainer>
                </MDBRow>
                {/* create game button */}
                <MDBRow className="pl-3 mt-2">
                  <MDBBtn type="button" id="create-game" className="btn-block pt-4  pb-4 rounded-0" onClick={this.handleCreateGame}>Create Game</MDBBtn>
                </MDBRow>
              </div>

            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </MDBContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    UserReducer: state.UserReducer,
    ServerReducer: state.ServerReducer,
    LeaderboardReducer: state.LeaderboardReducer,
    WaitingGamesReducer:state.WaitingGamesReducer,
    AuthReducer:state.AuthReducer
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateUser, 
    updateLeaderboard, updateWaitingGame,
    createRoomGame,changeAuth,userLogOut }
    , dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(MainScreenGame);