import React from 'react';
import './message.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { appendMessage } from '../../store/actions/messages';
class Message extends React.Component {
    render() {
        if(this.props.MessageReducer.message == "undefined")
        {
            return;
        }
        return this.props.MessageReducer.messages.map((messageItem, index) => {
            let classNameOfMessage = "rounded p-2  message-in-play-screen message-other mt-2";
            return (
                <span key={index} className={classNameOfMessage}   >
                    {messageItem.message}
                </span>
            );
        })

    }
}

const mapStateToProps = (state) => {
    return {
        MessageReducer: state.MessageReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ appendMessage }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Message);

