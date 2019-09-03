import React, { Component } from 'react';
import { connect } from 'react-redux';
import './user-info.css';
import {
  MDBCard,
  MDBCardBody,

} from "mdbreact";
class UserInfo extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (

            <MDBCard style={{ backgroundColor: "#747d8c" }} className="p-3 radius" width="100%">
            <MDBCardBody className="p-2 ml-1">
              <img src="/images/boy.svg" height="64px" width="64px" className="pl-2 ml-2"></img>
              <div className="py-2">
                <div className="d-flex align-middle">
                  <img className="mr-2" src="/images/name.svg" height="32px" width="32px"></img>
                  <p className="text-while mt-1">{this.props.UserReducer.user.username}</p>
                </div>
                <div className="d-flex align-middle">
                  <img src="/images/coin.svg" height="32px" width="32px" className="mr-2"></img>
                  <p className="text-room">{this.props.UserReducer.user.golds}</p>
                </div>
                <div className="d-flex align-middle">
                  <img src="/images/gamepad.svg" height="32px" width="32px" className="mr-2"></img>
                  <p className="text-room mt-2">{this.props.UserReducer.user.totalPlayedGame}</p>
                </div>
              </div>
            </MDBCardBody>
    
          </MDBCard>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    UserReducer: state.UserReducer,
    RoomGameReducer: state.RoomGameReducer
  }
}

export default connect(mapStateToProps, null)(UserInfo);