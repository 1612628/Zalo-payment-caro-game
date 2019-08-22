import React from 'react';
import Cell from '../Cell';
import PropTypes from 'prop-types';
import './board.css';
import { bindActionCreators } from 'redux';
import { InitBoard } from '../../store/actions/celllist';
import { connect } from "react-redux";



class Board extends React.Component {
  constructor(props) {
    super(props);
    const height = 15;
    const width = 15;
    let boardData= this.createEmptyBoard(width,height);
    this.props.InitBoard(boardData);
  }

  renderBoard() {
    return this.createBoardData(this.props.height, this.props.width).map((datarow, i) => (
      <div key={i} className="game-row">
        {
          datarow.map((dataItem, j) => (
            <Cell key={i * datarow.length + j} type={dataItem} ></Cell>
          ))
        }
      </div>
    ));
  }
  render() {
    return (
      <div >
        {this.renderBoard()}
      </div>
    );
  }
  createEmptyBoard(height, width) {
    let data = [];
    for (let i = 0; i < width; i++) {
      data.push([]);
      for (let j = 0; j < height; j++) {
        data[i][j] = 0;
      }
    }
    return data;
  }

}
Board.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  mines: PropTypes.number,
}
Board.defaultProps = {
  mine: -1
};

const mapStateToProps = (state) => {
  return {
    CellReducer: state.CellReducer
 }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ InitBoard }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
