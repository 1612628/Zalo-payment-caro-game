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
        if(this.state.isChecked===true)
        {
            console.log("khong check dc nua");
            return;
        }
        let typePattern = this.props.UserReducer.typePattern;
        this.state.isChecked = true;
        this.props.CellClick(this.state.x, this.state.y,  this.state.isChecked, "X");
        this.props.restartTime();
        console.log("is click")
    }
    render() {

        let classname = "square hoverable"
        if (this.props.data.typePattern != "") {
            if (this.props.data.typePattern == "X") {
                classname += " cell-x"
            }
            else {
                classname += " cell-o"
            }
        }
        return (
            <div className={classname} onClick={this.handleClick}>
                {this.props.data.typePattern}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        CellListReducer: state.CellListReducer,
        UserReducer:state.UserReducer,
        TimeReducer:state.TimeReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ CellClick,restartTime }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Cell);
