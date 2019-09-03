import React,{Component} from 'react';

import { connect } from 'react-redux';


class Leaderboard extends Component{
    constructor(props){
        super(props);
        
        this.state={
          index: this.props.index
        }
    }

    getRandomAvartar = ()=>{
        let avartars=["/images/man.svg","/images/boy.svg","/images/girl (1).svg","/images/girl (2).svg","/images/girl (3).svg"];
        let indexRandom = Math.floor(Math.random()*(avartars.length-1));
        return avartars[indexRandom];
    }
    

    render(){
      return(
        <div className="d-flex justify-content-around pt-2 pb-2" >
            <div className="rounded" style={{ backgroundColor: "#9C9C9C" }} >
                <span className="p-2 text-white" height="20px" width="20px">{this.state.index+1}</span>
            </div>
            <div>
                <span className="p-2 text-white" >{this.props.LeaderboardReducer.leaderboard[this.state.index].username}  <img alt="" src={this.getRandomAvartar()} height="32px" width="32px"></img></span>
            </div>
            <div>
                <span className="p-2 text-white" >{this.props.LeaderboardReducer.leaderboard[this.state.index].totalPlayedGame}  <img alt="" src="/images/sword.svg" height="32px" width="32px"></img></span>
            </div>
            <div >
                <span className="p-2 text-white" >{this.props.LeaderboardReducer.leaderboard[this.state.index].golds}  <img alt="" src="/images/coin.svg" height="32px" width="32px"></img></span>
            </div>
        </div>
      )
    }
}

const mapStateToProps = (state) => {
    return {
        LeaderboardReducer:state.LeaderboardReducer
    }
  }
  
  
  export default connect(mapStateToProps, null)(Leaderboard);