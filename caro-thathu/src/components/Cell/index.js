import React from 'react';
import PropTypes from 'prop-types';
import './cell.css';
import { bindActionCreators } from 'redux';
import { updateUser } from '../../store/actions/user';
import { connect } from 'react-redux';

class Cell extends React.Component {
    handleClick()
    {
        
    }
    render() {
        return (
            <div className="square hoverable" onClick={this.handleClick}>
                O
            </div>
        );
    }
}

export default Cell;