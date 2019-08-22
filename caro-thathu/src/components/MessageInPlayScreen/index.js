import React from 'react';
import './message.css';

class Message extends React.Component {
    render() {
        let classNameOfMessage = "rounded p-2  message-in-play-screen";
        //if message of other
        if (this.props.type == 0) {
            classNameOfMessage += " message-other"
        }

        return (
                <p className={classNameOfMessage}   >
                    {this.props.message}
                </p>
        );
    }
}

export default Message;