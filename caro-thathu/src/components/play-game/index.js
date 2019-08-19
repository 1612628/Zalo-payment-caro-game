import React, { Component } from 'react';
import './playgame.css';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBNav, MDBNavLink, MDBBtn

} from "mdbreact";

import { bindActionCreators } from 'redux';
import { updateUserSocket } from '../../store/actions/user';
import { connect } from "react-redux";
import { BrowserRouter } from 'react-router-dom';

class PlayGame extends Component {
  constructor(props) {
    super(props);
  }
  renderSquare()
  {
    return (
    <div className="square">
    </div>
    );
  }
  render() {
    return (
      <MDBContainer fluid="true">
        <BrowserRouter>
          <MDBNav style={{ backgroundColor: "#ee6c4d" }}>
            <MDBNavLink className="nav-logo  mr-auto p-2 " to="#"><img src="/images/avarta.png" height="64px" ></img></MDBNavLink>
            <MDBNavLink className="nav-end mt-3" to="#"><img src="/images/info.svg" height="32px" width="32px"></img></MDBNavLink>
            <MDBNavLink style={{ backgroundColor: "while" }} className="nav-end mt-3" to="#"><img src="/images/exit.svg" height="32px" width="32px"></img></MDBNavLink>
          </MDBNav>
        </BrowserRouter>
        <MDBContainer fluid="true" className="mt-2">
          <MDBRow>
    
            {/* list room game */}

            <MDBCol size="8" className="border-top border-left border-bot " style={{ backgroundColor: "#ffff" }} >
              {
                this.renderSquare()
              }
            </MDBCol>
            <MDBCol size="4" className="pl-4" >
              {/* user info */}
              <MDBRow className="d-flex justify-content-center hover-item" style={{ backgroundColor: "#5B5B5B" }} >
                <MDBCol size="6" >
                  <img src="/images/boy.svg" height="64px" width="64px"></img>
                </MDBCol>
                <MDBCol size="6">
                  <img src="/images/boy.svg" height="64px" width="64px"></img>
                </MDBCol>
              </MDBRow >

              {/* leader board */}
              <MDBRow id="leader-board" style={{ backgroundColor: "#3D496B" }} className="mt-4 hover-item">

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

const mapStateToProps = (state) => {
  return {
    ServerReducer: state.ServerReducer
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateUserSocket }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayGame);
