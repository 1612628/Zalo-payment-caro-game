import React, { Component } from 'react';
import './mainscreen.css';
import PropTypes from 'prop-types';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon
} from "mdbreact";

class MainScreenGame extends Component {
  // constructor(props) {
  //   super(props);
  //   // this.username=React.createRef();
  // }

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
MDBContainer.propTypes = {
  fluid: PropTypes.bool
  // applies .container-fluid class
}
export default MainScreenGame;