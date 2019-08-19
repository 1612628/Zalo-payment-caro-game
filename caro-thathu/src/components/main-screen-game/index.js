import React, { Component } from 'react';
import './mainscreen.css';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBNav, MDBNavItem, MDBNavLink, MDBBtn

} from "mdbreact";

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import {updateUser} from '../../store/actions/user';
import {updateLeaderboard} from '../../store/actions/leaderboard';
import {updateWaitingGame} from '../../store/actions/waitingGames';

import {LeaderboardRequest,WaitingRoomGamesRequest} from '../../apis'

import {BrowserRouter} from 'react-router-dom';

class MainScreenGame extends Component {
  constructor(props) {
    super(props);
  }
  async componentWillMount(){
    let users = await LeaderboardRequest(this.props.UserReducer.user.token);
    this.props.updateLeaderboard(users);
    let waitingRoomGames=await WaitingRoomGamesRequest(this.props.UserReducer.user.token);
    this.props.updateWaitingGame(waitingRoomGames);
  }

  render() {
    const scrollContainerStyle = { width: "800px", maxHeight: "400px" };
    return (
      <MDBContainer fluid="true">
        <BrowserRouter>
          <MDBNav style={{ backgroundColor: "#ee6c4d" }}>
            <MDBNavLink className="nav-logo  mr-auto p-2 " to="#"><img src="/images/info.svg" height="32px" width="32px"></img></MDBNavLink>
            <MDBNavLink className="nav-end " to="#"><img src="/images/info.svg" height="32px" width="32px"></img></MDBNavLink>
            <MDBNavLink className="nav-end" to="#"><img src="/images/exit.svg" height="32px" width="32px"></img></MDBNavLink>
          </MDBNav>
        </BrowserRouter>
        <MDBContainer fluid="true" className="mt-4">
          <MDBRow>

            {/* list room game */}

            <MDBCol size="8" className="border-top border-left border-bot " style={{ backgroundColor: "#5B5B5B" }} >
              <MDBRow className="scrollbar  d-flex justify-content-end" style={{ scrollContainerStyle, backgroundColor: "#5B5B5B" }}>
                <MDBCol size="6" className=" mt-2">
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
                <MDBCol size="6" className=" mt-2">
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
            </MDBCol>


            <MDBCol size="4" className="pl-4" >
              {/* user info */}
              <MDBRow className="  d-flex justify-content-end hover-item" style={{ backgroundColor: "#5B5B5B" }} >
                <MDBCol size="4" className=" pt-3 pb-3">
                  <img src="/images/boy.svg" height="64px" width="64px"></img>
                </MDBCol>
                <MDBCol size="6" className="">
                  <div className="d-flex flex-column pt-3 pb-3">
                    <div className="pt-1 pb-1">
                      <img src="/images/name.svg" height="32px" width="32px" className="mr-2"></img>
                      <span className="text-room">Chí Thức</span>
                    </div>
                    <div className="pt-1 pb-1">
                      <img src="/images/coin.svg" height="32px" width="32px" className="mr-2"></img>
                      <span className="text-room">10000</span>
                    </div>
                    <div className="pt-1">
                      <img src="/images/gamepad.svg" height="32px" width="32px" className="mr-2"></img>
                      <span className="text-room mt-2">100</span>
                    </div>
                  </div>
                </MDBCol>
              </MDBRow >

              {/* leader board */}
              <MDBRow id="leader-board" style={{ backgroundColor: "#3D496B" }} className="mt-4 hover-item">
                <MDBContainer className="d-flex justify-content-center">
                  <h3 className="text-light">Leaderboard</h3>
                </MDBContainer>
                <MDBContainer style={{ backgroundColor: "#5B5B5B" }} >
                  <div className="d-flex justify-content-around pt-2 pb-2" >
                    <div className="rounded" style={{ backgroundColor: "#9C9C9C" }} >
                      <span className="p-2 text-white" height="20px" width="20px">1</span>
                    </div>
                    <div>
                      <span className="p-2 text-white" >Nguyễn Chí Thức</span>
                    </div>
                    <div >
                      <span className="p-2 text-white" >1000 <img src="/images/top-rated.svg" height="32px" width="32px"></img></span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-around pt-2 pb-2" >
                    <div className="rounded" style={{ backgroundColor: "#9C9C9C" }} >
                      <span className="p-2 text-white" height="20px" width="20px">1</span>
                    </div>
                    <div>
                      <span className="p-2 text-white" >Nguyễn Chí Thức</span>
                    </div>
                    <div >
                      <span className="p-2 text-white" >1000 <img src="/images/top-rated.svg" height="32px" width="32px"></img></span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-around pt-2 pb-2" >
                    <div className="rounded" style={{ backgroundColor: "#9C9C9C" }} >
                      <span className="p-2 text-white" height="20px" width="20px">1</span>
                    </div>
                    <div>
                      <span className="p-2 text-white" >Nguyễn Chí Thức</span>
                    </div>
                    <div >
                      <span className="p-2 text-white" >1000 <img src="/images/top-rated.svg" height="32px" width="32px"></img></span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-around pt-2 pb-2" >
                    <div className="rounded" style={{ backgroundColor: "#9C9C9C" }} >
                      <span className="p-2 text-white" height="20px" width="20px">1</span>
                    </div>
                    <div>
                      <span className="p-2 text-white" >Nguyễn Chí Thức</span>
                    </div>
                    <div >
                      <span className="p-2 text-white" >1000 <img src="/images/top-rated.svg" height="32px" width="32px"></img></span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-around pt-2 pb-2" >
                    <div className="rounded" style={{ backgroundColor: "#9C9C9C" }} >
                      <span className="p-2 text-white" height="20px" width="20px">1</span>
                    </div>
                    <div>
                      <span className="p-2 text-white" >Nguyễn Chí Thức</span>
                    </div>
                    <div >
                      <span className="p-2 text-white" >1000 <img src="/images/top-rated.svg" height="32px" width="32px"></img></span>
                    </div>
                  </div>
                </MDBContainer>

              </MDBRow>
              <MDBRow className="pl-3 mt-2">
                <MDBBtn type="button" id="create-game" className="btn-block pt-4  pb-4 rounded-0" onClick={this.handleLogin}>Create Game</MDBBtn>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </MDBContainer>
    );
  }
}

const mapStateToProps=(state)=>{
  return{
    UserReducer:state.UserReducer,
    ServerReducer:state.ServerReducer,
    LeaderboardReducer:state.LeaderboardReducer
  }
}

const mapDispatchToProps=(dispatch)=>{
  return bindActionCreators({updateUser,updateLeaderboard,updateWaitingGame},dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreenGame);