import React from 'react';
import './message.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { appendMessage } from '../../store/actions/messages';
import {

    MDBCard,
    MDBCardBody,
} from "mdbreact";
class Message extends React.Component {


    render() {
        return this.props.MessageReducer.messages.map((messageItem, index) => {
            let classNameOfMessage = "message-body ";
            if (this.props.MessageReducer.message == "undefined") {
                return;
            }

            if (this.props.UserReducer.user.id === messageItem.userIdSend) {
                classNameOfMessage += " message-other"
            }
            console.log(messageItem.userIdSend);
            console.log(this.props.UserReducer.user.id )
            return (
                <MDBCard key={index} className={classNameOfMessage}>
                    <MDBCardBody>
                        <p className="mb-0">{messageItem.message}</p>
                        <small className="pull-right text-muted">
                            <i className="far fa-clock" /> {messageItem.time}
                </small>
                    </MDBCardBody>
                </MDBCard>

            );
        })

    }
}

const mapStateToProps = (state) => {
    return {
        MessageReducer: state.MessageReducer,
        UserReducer: state.UserReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ appendMessage }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Message);

