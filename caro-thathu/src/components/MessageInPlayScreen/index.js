import React from 'react';
import './message.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { appendMessage } from '../../store/actions/messages';
class Message extends React.Component {
    render() {
        if(this.props.MessagesReducers == "undefined")
        {
            return;
        }
        return this.props.MessagesReducers.messages.map((messageItem, index) => {
            let classNameOfMessage = "rounded p-2  message-in-play-screen";
            //if message of other
            if (this.props.userid === this.state.myiduser) {
                classNameOfMessage += " message-other"
            }
            return (
                <p key={index} className={classNameOfMessage}   >
                    {messageItem.message}
                </p>
            );
        })

    }
}

const mapStateToProps = (state) => {
    return {
        MessagesReducers: state.MessagesReducers
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ appendMessage }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Message);

