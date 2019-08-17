import React,{Component} from 'react';
import './register.css';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBBtn,
    MDBInput
  } from "mdbreact";
class Register extends Component{
    constructor(props){
        super(props);
        this.username=React.createRef();
        this.password=React.createRef();
        this.repeatPassword =React.createRef();
        this.email=React.createRef();
    }

    render(){
        return(
            <MDBContainer>
                <MDBRow className="d-flex justify-content-center align-items-center my-5">
                  <MDBCol md="6">
                    <MDBCard className="gray-text">
                      <div className="header pt-3 my-4">
                        <MDBRow className="d-flex justify-content-center">
                            <MDBCardHeader className="form-header rounded align-middle">
                                <h3 className="font-weight-bold ">
                                    <strong>THATHU</strong>
                                    <a href="#!" className="green-text font-weight-bold">
                                        <strong> CARO</strong>
                                    </a>
                                </h3>
                            </MDBCardHeader>                            
                        </MDBRow>
                      </div>
                      <MDBCardBody className="mx-4 mt-4">
                        <MDBInput id="email" icon="envelope" label="Your email" group type="password" validate containerClass="mb-0"/>
                        <MDBInput id="username" icon= "user" label="Your username" group type="text" validate />
                        <MDBInput id="password" icon="lock" label="Your password" group type="password" validate containerClass="mb-0"/>
                        <MDBInput id="repeat-password" icon="lock" label="Repeat password" group type="password" 
                        validate containerClass="mb-0"/>

                        <p className="font-small d-flex justify-content-end">
                          <a href="#!" className="green-text ml-1 font-weight-bold">Forgot Password?</a>
                        </p>
                        <MDBRow className="d-flex justify-content-end align-items-center mb-4">
                            <p className="font-small">
                              Don't have an account?
                              <a href="#!" className="green-text ml-1 font-weight-bold">Sign up</a>
                            </p>                          
                        </MDBRow>
                        <MDBRow className="d-flex justify-content-center align-items-center mb-4 mt-2">
                            <div className="btn-bound text-center">
                              <MDBBtn  type="button" color="deep-orange" className="btn-block z-depth-1a">Register</MDBBtn>
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

export default Register;