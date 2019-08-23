import React, { Component } from 'react';
import './index.css';

import {ForgotPasswordRequest} from '../../apis';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBInput
} from "mdbreact";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const mySwal = withReactContent(Swal);



class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      usernameInput: {
        value:"",
        valid:false
      },
      emailInput: {
        value:"",
        valid:false
      }
    }
  }

  handleInput=(event)=>{
    this.setState({
      [event.target.name]:{value:event.target.value,valid:!!event.target.value}
    })
  }
  handleSubmitForgotPassword=async(event)=>
    {
      event.preventDefault();
      if(this.state.usernameInput.value && this.state.emailInput.value)
      {
        await ForgotPasswordRequest(this.state.usernameInput.value,
        this.state.emailInput.value);
        mySwal.fire({
          type:'info',
          title: 'Reset password request has been sent',
          timer:2000
        });
        this.props.history.push("/");
      }else{
        mySwal.fire({
          title: 'Please fill all information in the form.',
          timer:2000
        });
      }      
    }

  render() {
    return (
      <MDBContainer>
        <MDBRow className="d-flex justify-content-center align-items-center my-5">
          <MDBCol md="6">
            <MDBCard className="gray-text">
              
              <MDBCardBody className="mx-4">
                <div className="form-header rounded mt-5 text-center">
                  <h3 className="green-text font-weight-bold d-flex justify-content-center mt-5">
                  Enter username and email to reset your password
                  </h3>
                </div>
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
                    <MDBRow className="d-flex justify-content-center align-items-center mb-4 mt-2">
                      <div className="btn-bound text-center">
                        <MDBBtn  type="button" color="deep-orange" className="btn-block z-depth-1a"  onClick={this.handleSubmitForgotPassword}>Submit</MDBBtn>
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

export default ForgotPassword;