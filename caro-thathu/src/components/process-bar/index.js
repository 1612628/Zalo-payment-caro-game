import React from "react";
import { MDBProgress } from 'mdbreact';
import { bindActionCreators } from 'redux';
import { startDecrementTime } from '../../store/actions/timer';
import { connect } from 'react-redux';

class ProgressBar extends React.Component{
    constructor(props)
    {
        super(props);
    }
    converTimeToProcessBar()
    {
        return Math.floor( this.props.TimeReducer.time * 100 / 15);
    }
    render()
    {


        return (
            <MDBProgress value={this.converTimeToProcessBar()} className="my-2" />
        );
    }
}   

const mapStateToProps = (state) => {
    return {
        TimeReducer:state.TimeReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ startDecrementTime }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgressBar);
