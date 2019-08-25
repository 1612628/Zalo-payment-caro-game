import React,{Component} from 'react';


import {
  MDBCol,
  MDBIcon,
} from "mdbreact";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {joinInRoomGame} from '../../store/actions/roomGame';
import {JoinGameRequest} from '../../apis/';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const mySwal = withReactContent(Swal);


class WaitingGameBox extends Component{
    constructor(props){
        super(props);
        
        this.state={
          index: this.props.index
        }
    }
    handleWaitingGameBoxClick=()=>{
      console.log("somebody");
        mySwal.fire({
            title: 'Do you want to join this game?',
            type:'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
          })
          .then(async (result)=>{
            if(result.value){
                let res = await JoinGameRequest(this.props.UserReducer.user.token,
                  this.props.WaitingGamesReducer.waitingGames[this.state.index].roomGameId,
                  this.props.UserReducer.user.id,this.props.UserReducer.user.golds);
                if(res){
                  this.props.joinInRoomGame(this.props.WaitingGamesReducer.waitingGames[this.state.index].roomGameId,
                    res.status,this.props.WaitingGamesReducer.waitingGames[this.state.index].bettingGolds,
                    res.opponent.id,res.opponent.name,res.opponent.golds,
                    parseInt(res.opponent.totalPlayedGame,10));
                  
                  this.props.UserReducer.user.socket.emit('join_game',{
                    gameId:this.props.WaitingGamesReducer.waitingGames[this.state.index].roomGameId,
                    userId:this.props.UserReducer.user.id,
                    username:this.props.UserReducer.user.username,
                    golds:this.props.UserReducer.user.golds,
                    totalPlayedGame:this.props.UserReducer.user.totalPlayedGame
                  });
                  
                  this.props.history.push("/playgame");

                }
            }
          })
    }

    render(){
      return(
        <MDBCol size="6" className=" mt-3">
            <div onClick={this.handleWaitingGameBoxClick} className="d-flex justify-content-around align-items-center hoverable hover-item room-item"
              style={{ backgroundColor: "#EE6C4D", height: "70px" }}>
              <div className="font-light align-items-center">
                <MDBIcon className="text-room mr-1" icon="home" />
                <span className="text-room">{this.props.WaitingGamesReducer.waitingGames[this.state.index].roomGameId}</span>
              </div>
              <div className="font-light align-items-center">
                <MDBIcon className="text-room mr-1" icon="ring" />
                <span className="text-room">{this.props.WaitingGamesReducer.waitingGames[this.state.index].bettingGolds}</span>
              </div>
              <div className="font-light align-items-center">
                <MDBIcon className="text-room mr-1" icon="ring" />
                <span className="text-room">{this.props.WaitingGamesReducer.waitingGames[this.state.index].status}</span>
              </div>
              <div className="font-light align-items-center">
                <MDBIcon className="text-room mr-1" icon="user-alt" />
                <span className="text-room">{this.props.WaitingGamesReducer.waitingGames[this.state.index].hostName}</span>
              </div>
            </div>
        </MDBCol>
      )        
    }
}

const mapStateToProps = (state) => {
    return {
        WaitingGamesReducer:state.WaitingGamesReducer,
        UserReducer:state.UserReducer,
    }
  }
  
const mapDispatchToProps=(dispatch)=>{
  return bindActionCreators({
    joinInRoomGame
  },dispatch);
}

  
export default connect(mapStateToProps, mapDispatchToProps)(WaitingGameBox);