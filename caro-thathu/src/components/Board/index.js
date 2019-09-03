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
    if(this.props.CellListReducer.cellList){
      return this.props.CellListReducer.cellList.map((datarow, i) => (
        <div key={i} className="game-row">
          {
            datarow.map((dataItem, j) => (
              <Cell key={i * datarow.length + j} data={dataItem} ></Cell>
            ))
          }
        </div>
      ));
    }else{
      return null;
    }
    
  }
  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
  createEmptyBoard(height, width) {
    let data = [];
    for (let i = 0; i < width; i++) {
      data.push([]);
      for (let j = 0; j < height; j++) {
        data[i][j]= {
          x:j,
          y:i,
          isChecked:false,
          typePattern: ""
        }
      }
    }
    return data;
  }

}
const mapStateToProps = (state) => {
  return {
    CellListReducer: state.CellListReducer
 }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ InitBoard }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
