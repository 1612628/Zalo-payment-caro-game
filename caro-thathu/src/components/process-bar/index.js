import React from "react";
import { MDBProgress, MDBIcon, MDBRow, MDBCol } from 'mdbreact';
import { bindActionCreators } from 'redux';
import { startDecrementTime } from '../../store/actions/timer';
import { connect } from 'react-redux';

class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
    }
    converTimeToProcessBar() {
        return Math.floor(this.props.TimeReducer.time * 100 / 15);
    }
    render() {
        return (
            <MDBRow className="py-2" >
                <MDBCol size="10">
                    <MDBProgress  value={this.converTimeToProcessBar()} className="my-2" />
                </MDBCol>
                <MDBCol size="2" className="d-flex justify-content-around">
                    <MDBIcon far icon="clock" size="2x" className="text-while" />
                    <p className="align-self-center text-while pt-1">{this.props.TimeReducer.time}</p>
                </MDBCol>

            </MDBRow>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        TimeReducer: state.TimeReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ startDecrementTime }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgressBar);
