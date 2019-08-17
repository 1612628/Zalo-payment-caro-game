import React, { Component } from 'react';
import './index.css';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBInput
} from "mdbreact";
class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.email = React.createRef();
  }

  render() {
    return (
      <MDBContainer>
        <MDBRow className="d-flex justify-content-center align-items-center my-5">
          <MDBCol md="6">
            <MDBCard className="gray-text">
              <p className="form-header rounded mt-5">
                <h3 className="green-text font-weight-bold d-flex justify-content-center mt-5">
                Enter gmail to receive your account
                </h3>
              </p>
              <MDBCardBody className="mx-4">
              <MDBInput id="email" icon="envelope" label="Your email" group type="password" validate containerClass="mb-0"/>
                <MDBRow className="d-flex justify-content-center align-items-center mb-4 mt-5">
                  <div className="btn-bound text-center">
                    <MDBBtn  type="button" color="deep-orange" className="btn-block z-depth-1a">Submit</MDBBtn>
                  </div>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default ForgotPassword;