import React, { Component } from 'react';
import './mainscreen.css';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon
} from "mdbreact";

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import {updateUser} from '../../store/actions/user';
import {updateLeaderboard} from '../../store/actions/leaderboard';
import {updateWaitingGame} from '../../store/actions/waitingGames';

import {LeaderboardRequest,WaitingRoomGamesRequest} from '../../apis'

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
    ServerReducer:state.ServerReducer,
    LeaderboardReducer:state.LeaderboardReducer
  }
}

const mapDispatchToProps=(dispatch)=>{
  return bindActionCreators({updateUser,updateLeaderboard,updateWaitingGame},dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(MainScreenGame);