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
import { updateUser } from '../../store/actions/user';
import { updateLeaderboard } from '../../store/actions/leaderboard';
import { updateWaitingGame } from '../../store/actions/waitingGames';
import {createRoomGame} from '../../store/actions/roomGame';
import { LeaderboardRequest, WaitingRoomGamesRequest,CreateRoomGameRequest } from '../../apis'

import { BrowserRouter } from 'react-router-dom';

import WaitingGameBox from '../waiting-game-box';
import Leaderboard from '../leaderboard';
import Auth from '../../auth';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const mySwal = withReactContent(Swal);

class MainScreenGame extends Component {
  constructor(props) {
    super(props);

    this.state={
      reload:false
    }
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
    
  }

  async componentDidUpdate(nextProps,nextState){
    let users = await LeaderboardRequest(this.props.UserReducer.user.token);
    if(users){
      this.props.updateLeaderboard(users);
    }
    

    let waitingRoomGames = await WaitingRoomGamesRequest(this.props.UserReducer.user.token);
    if(waitingRoomGames){
      this.props.updateWaitingGame(waitingRoomGames);
    }
  }

  getRenderWaitingGames(waitingGames){
    if(waitingGames){
      return waitingGames.map((waitingGame,index)=>{
        return(
          <WaitingGameBox key={index} index={index}></WaitingGameBox>
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

  handleReload=()=>{
    this.setState({
      reload:!this.state.reload
    })
  }

  handleBack = () => {
    Auth.authenticate();
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
          this.props.UserReducer.user.id,this.props.UserReducer.user.username,
          result.value);
        if(res){
          this.props.createRoomGame(res.roomGameId,'waiting',result.value);
          mySwal.fire({
            type: 'success',
            html: 'You create a room with betting golds: ' + result.value
          });
        }else{
          mySwal.fire({
            type: 'warning',
            html: 'Failed to create a room with betting golds: ' + result.value
          });
        }
        

      }})
    };
  

  renderWaitingRoom = () => {
    return this.props.waitingRoomGames.map((dataitem, index) => (
        <WaitingRoomItem  key={index}  idGame={dataitem.idGame} bettingGold ={dataitem.bettingGold} username={dataitem.username} >
        </WaitingRoomItem>
    ));
  }
  renderLearBoard= ()=>{
    return this.props.LeaderboardReducer.map((dataitem, index) => (
      <LeaderboardItem  key={index}  rank={dataitem.rank} username ={dataitem.username} gold={dataitem.gold} >
      </LeaderboardItem>
  ));
  }

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
                    <MDBCol size="6" className=" mt-3">
                  <div className="d-flex justify-content-around align-items-center hoverable hover-item room-item"
                    style={{ backgroundColor: "#EE6C4D", height: "70px" }}>
                    <div className="font-light align-items-center">
                      <MDBIcon className="text-room mr-1" icon="home" />
                      <span className="text-room">{this.props.UserReducer.user.username}</span>
                    </div>
                    <div className="font-light align-items-center">
                      <MDBIcon className="text-room mr-1" icon="ring" />
                      <span className="text-room">{this.props.UserReducer.user.golds}</span>
                    </div>
                    <div className="font-light align-items-center">
                      <MDBIcon className="text-room mr-1" icon="user-alt" />
                      <span className="text-room">{this.props.UserReducer.user.totalPlayedGame}</span>
                    </div>
                  </div>
                </MDBCol>
                <MDBCol size="6" className=" mt-3">
                  <div className="d-flex justify-content-around align-items-center hoverable hover-item room-item"
                    style={{ backgroundColor: "#EE6C4D", height: "70px" }}>
                    <div className="font-light align-items-center">
                      <MDBIcon className="text-room mr-1" icon="home" />
                      <span className="text-room">1234</span>
                    </div>
                    <div className="font-light align-items-center">
                      <MDBIcon className="text-room mr-1" icon="ring" />
                      <span className="text-room">Gold</span>
                    </div>
                    <div className="font-light align-items-center">
                      <MDBIcon className="text-room mr-1" icon="user-alt" />
                      <span className="text-room">username </span>
                    </div>
                  </div>
                </MDBCol>    
                  </MDBRow>  
                </MDBContainer>
              
                
                
              </MDBRow>
            </MDBCol>
            <MDBCol size="4" className="pl-4 d-fle justify-content-center" >
              
              <div className="d-flex flex-column" style={{height:"100%"}}>
                {/* user info */}
                <MDBRow className="  d-flex justify-content-end hover-item" style={{ backgroundColor: "#5B5B5B" }} >
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
                <MDBRow id="leader-board" style={{ backgroundColor: "#5B5B5B",height:"100%"}} className="mt-4 hover-item d-flex flex-column">
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



class WaitingRoomItem extends Component {
  render() {
    return (
      <MDBCol size="6" className=" mt-2">
        <div className="d-flex justify-content-around align-items-center hoverable hover-item room-item"
          style={{ backgroundColor: "#EE6C4D", height: "70px" }}>
          <div className="font-light align-items-center">
            <MDBIcon className="text-room mr-1" icon="home" />
            <span className="text-room">{this.props.idGame}</span>
          </div>
          <div className="font-light align-items-center">
            <MDBIcon className="text-room mr-1" icon="ring" />
            <span className="text-room">{this.props.bettingGold}</span>
          </div>
          <div className="font-light align-items-center">
            <MDBIcon className="text-room mr-1" icon="user-alt" />
            <span className="text-room">{this.props.username} </span>
          </div>
        </div>
      </MDBCol>
    );
  }
}
class LeaderboardItem extends Component {
  render() {
    return (
      <div className="d-flex justify-content-around pt-2 pb-2" >
        <div className="rounded" style={{ backgroundColor: "#9C9C9C" }} >
          <span className="p-2 text-white" height="20px" width="20px">{this.props.rank}</span>
        </div>
        <div>
          <span className="p-2 text-white" >{this.props.username}</span>
        </div>
        <div >
          <span className="p-2 text-white" >{this.props.gold} <img src="/images/coin.svg" height="32px" width="32px"></img></span>
        </div>
      </div>
    );
  }
}



const mapStateToProps = (state) => {
  return {
    UserReducer: state.UserReducer,
    ServerReducer: state.ServerReducer,
    LeaderboardReducer: state.LeaderboardReducer,
    WaitingGamesReducer:state.WaitingGamesReducer
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateUser, updateLeaderboard, updateWaitingGame,createRoomGame }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(MainScreenGame);