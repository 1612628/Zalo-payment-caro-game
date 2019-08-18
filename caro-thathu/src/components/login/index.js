import React, { Component } from 'react';
import './login.css';
import { LOGIN } from '../../store/actions'
import { connect } from "react-redux";
import { LoginRequest } from '../../apis'
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

function mapDispatchToProps(dispatch) {
  return {
    login: userInfo => dispatch(LOGIN(userInfo))
  };
}

class UserLogin extends Component {
  constructor(props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this);
    this.state = {
      usernameInput: "",
      passwordInput: ""
    }
  }

  handleUsername = (event) => {
    this.setState({
      usernameInput: event.target.value
    })
  }

  handlePassword = (event) => {
    this.setState({
      passwordInput: event.target.value
    })
  }
  handleLogin() {
    console.log(this.state.usernameInput);
    console.log(this.state.passwordInput);
    let res = LoginRequest(this.state.usernameInput, this.state.passwordInput);
    //reponse respone here
    let data = {
      idUser: 1,
      username: 1,
      golds: 1,
      socket: 1
    }
    //change state of redux
    this.props.login(data)
  }

  render() {
    return (
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
                <form>
                  <MDBInput onInput={this.handleUsername} id="username" icon="user" label="Your username" type="text" name="username" required />

                  <MDBInput onInput={this.handlePassword} id="password" icon="lock" label="Your password" type="password" name="password"  required />
                  <p className="font-small d-flex justify-content-end">
                    <a href="#!" className="green-text ml-1 font-weight-bold">Forgot Password?</a>
                  </p>
                </form>

                  <MDBRow className="d-flex justify-content-end align-items-center mb-4">
                    <p className="font-small">
                      Don't have an account?
                              <a href="#!" className="green-text ml-1 font-weight-bold">Sign up</a>
                    </p>
                  </MDBRow>
                  <MDBRow className="d-flex justify-content-center align-items-center mb-4 mt-2">
                    <div className="btn-bound text-center">
                      <MDBBtn type="button" color="deep-orange" className="btn-block z-depth-1a" onClick={this.handleLogin}>Log in</MDBBtn>
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

const Login = connect(null, mapDispatchToProps)(UserLogin);
export default Login;