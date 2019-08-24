import React,{Component} from 'react';
import './register.css';
import {RegisterRequest} from '../../apis';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBBtn,
    MDBInput,
  } from "mdbreact";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const mySwal = withReactContent(Swal);

class Register extends Component{
    constructor(props){
        super(props);

        this.state = {
          usernameInput: {
            value:"",
            valid:false
          },
          passwordInput: {
            value:"",
            valid:false
          },
          passwordRepeatInput: {
            value:"",
            valid:false
          },
          emailInput: {
            value:"",
            valid:false
          }
        }

        this.handleRegister = this.handleRegister.bind(this);

    }

    handleInput=(event)=>{
      this.setState({
        [event.target.name]:{value:event.target.value,valid:!!event.target.value}
      })
    }

    handleRepeatPassword = (event) => {
      if(this.state.passwordInput.value===event.target.value){
        this.setState({
          passwordRepeatInput: {value:event.target.value,valid:!!event.target.value}
        })
      }else{
        this.setState({
          passwordRepeatInput: {value:event.target.value}
        })
      }
    }

    async handleRegister(event)
    {
      event.preventDefault();
      if(this.state.usernameInput.value && this.state.passwordInput.value && 
        this.state.passwordInput.value && this.state.passwordRepeatInput.value){
          if(this.state.passwordInput.value !== this.state.passwordRepeatInput.value)
          {
            mySwal.fire({
              type: 'error',
              title: 'Repeat password is not matched',
              timer:2000
            });
          }else{
            let res = await RegisterRequest(this.state.usernameInput.value,
              this.state.passwordInput.value,
              this.state.emailInput.value);
             console.log(res)
            if(res && res.status===201){
              mySwal.fire({
                type:'success',
                title: 'Create account successful',
                timer:2000
              });
              this.props.history.push("/");
            }else{
              mySwal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'User account is existed',
                timer:2000
              });
            }
          }
        }else{
          mySwal.fire({
            title: 'Please fill all information in the form.',
            timer:2000
          });
        }
           
    }

    handleRedirectToLogin=()=>{
      this.props.history.push("/");
    }
    handleRedirectToForgotPassword=()=>{
      this.props.history.push("/forgotpassword");
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
                        <form>                        
                          <MDBInput 
                          onInput={this.handleInput} 
                          value={this.state.usernameInput.value}
                          className={this.state.usernameInput.valid?" is-valid":" is-invalid"}
                          id="username" 
                          icon= "user" 
                          label="Your username" 
                          group type="text" 
                          name="usernameInput"
                          required />
                          <MDBInput 
                          onInput={this.handleInput}
                          value={this.state.emailInput.value}
                          className={this.state.emailInput.valid?" is-valid":" is-invalid"} 
                          id="email" 
                          icon="envelope" 
                          label="Your email" 
                          group type="text" 
                          name="emailInput"
                          required containerClass="mb-0"/>
                          <MDBInput 
                          onInput={this.handleInput} 
                          value={this.state.passwordInput.value}
                          className={this.state.passwordInput.valid?" is-valid":" is-invalid"} 
                          id="password" 
                          icon="lock" 
                          label="Your password" 
                          group type="password" 
                          name="passwordInput"
                          required containerClass="mb-0"/>
                          <MDBInput 
                          onInput={this.handleRepeatPassword} 
                          value={this.state.passwordRepeatInput.value}
                          className={this.state.passwordRepeatInput.valid?" is-valid":" is-invalid"} 
                          id="repeat-password" icon="lock" 
                          label="Repeat password" 
                          group type="password" 
                          name="passwordRepeatInput"
                          required containerClass="mb-0"/>
  
                          <p className="font-small d-flex justify-content-end">
                            <a href="#!" className="green-text ml-1 font-weight-bold" onClick={this.handleRedirectToForgotPassword}>Forgot Password?</a>
                          </p>
                          <MDBRow className="d-flex justify-content-end align-items-center mb-4">
                              <p className="font-small">
                                Have an account?
                                <a href="#!" className="green-text ml-1 font-weight-bold" onClick={this.handleRedirectToLogin}>Sign in</a>
                              </p>                          
                          </MDBRow>
                          <MDBRow className="d-flex justify-content-center align-items-center mb-4 mt-2">
                              <div className="btn-bound text-center">
                                <MDBBtn  type="button" color="deep-orange" className="btn-block z-depth-1a"  onClick={this.handleRegister}>Register</MDBBtn>
                              </div>
                          </MDBRow>
                        </form>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }
}


export default Register;