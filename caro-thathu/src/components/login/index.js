import React,{Component} from 'react';
import './index.css';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBModalFooter,
    MDBIcon,
    MDBCardHeader,
    MDBBtn,
    MDBInput
  } from "mdbreact";
class Login extends Component{
    constructor(props){
        super(props);

        this.username=React.createRef();
        this.password=React.createRef();
    }

    render(){
        return(
            <MDBContainer>
                <MDBRow className="d-flex justify-content-center align-items-center my-5">
                  <MDBCol md="6">
                    <MDBCard className="gray-text">
                      <div className="header pt-3 my-4">
                        <MDBRow className="d-flex justify-content-center">
                            <MDBCardHeader className="form-header rounded ">
                                <h3 className="font-weight-bold">
                                    <strong>THATHU</strong>
                                    <a href="#!" className="green-text font-weight-bold">
                                        <strong> CARO</strong>
                                    </a>
                                </h3>
                            </MDBCardHeader>                            
                        </MDBRow>
                      </div>
                      <MDBCardBody className="mx-4 mt-4">
                        <MDBInput label="Your username" group type="text" validate />
                        <MDBInput label="Your password" group type="password" validate containerClass="mb-0"/>
                        <p className="font-small d-flex justify-content-end">
                          Forgot
                          <a href="#!" className="green-text ml-1 font-weight-bold">Password?</a>
                        </p>
                        <MDBRow className="d-flex justify-content-center align-items-center mb-4 mt-5">
                            <div className="btn-bound text-center">
                              <MDBBtn color="success" type="button" color="deep-orange" className="btn-block z-depth-1a">Log in</MDBBtn>
                            </div>
                        </MDBRow>
                        <MDBRow className="d-flex justify-content-end align-items-center mb-4 mt-5">
                            <p className="font-small mt-3">
                              Don't have an account?
                              <a href="#!" className="green-text ml-1 font-weight-bold">Sign up</a>
                            </p>                          
                        </MDBRow>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }
}

export default Login;