import React from 'react';
import PropTypes from 'prop-types';
import './cell.css';
import { bindActionCreators } from 'redux';
import { CellClick } from '../../store/actions/celllist';
import { connect } from 'react-redux';

class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            x: this.props.data.x,
            y: this.props.data.y
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        let typePattern = this.props.UserReducer.typePattern;
        let isChecked = true;
        this.props.CellClick(this.state.x, this.state.y, isChecked, "X");
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
        UserReducer:state.UserReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ CellClick }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Cell);
