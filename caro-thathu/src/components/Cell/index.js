import React from 'react';
import './cell.css';
import { bindActionCreators } from 'redux';
import { CellClick } from '../../store/actions/celllist';
import { restartTime } from '../../store/actions/timer';

import { connect } from 'react-redux';

class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            x: this.props.data.x,
            y: this.props.data.y,
            isChecked: this.props.data.isChecked
        }
        this.handleClick = this.handleClick.bind(this);


    }

    handleClick() {
        if(this.props.RoomGameReducer.roomGame.status !== 'playing' ||
         this.state.isChecked===true || !this.props.TimeReducer.isMyTurn)
        {
            console.log("khong check dc nua");
            return;
        }
        // let typePattern = this.props.UserReducer.typePattern;
        this.state.isChecked = true;
        this.props.CellClick(this.state.x, this.state.y,
            this.state.isChecked,this.props.UserReducer.user.typePattern);
        this.props.restartTime();
        console.log("is click")

        this.props.UserReducer.user.socket.emit('play_a_game_turn',{
            gameId:this.props.RoomGameReducer.roomGame.roomGameId,
            userId:this.props.UserReducer.user.id,
            y:this.state.y,
            x:this.state.x,
            pattern:this.props.UserReducer.user.typePattern
        })

    }
    render() {

        let classname = "square hoverable"
        if (this.props.CellListReducer.cellList[this.state.y][this.state.x].typePattern != "") {
            if (this.props.CellListReducer.cellList[this.state.y][this.state.x].typePattern == "X") {
                classname += " cell-x"
            }
            else {
                classname += " cell-o"
            }
        }
        return (
            <div className={classname} onClick={this.handleClick}>
                {this.props.CellListReducer.cellList[this.state.y][this.state.x].typePattern}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        CellListReducer: state.CellListReducer,
        UserReducer:state.UserReducer,
        TimeReducer:state.TimeReducer,
        RoomGameReducer:state.RoomGameReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ CellClick,restartTime }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Cell);
