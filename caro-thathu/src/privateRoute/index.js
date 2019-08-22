import React,{Component} from 'react';
import {Route,Redirect} from 'react-router-dom';
import Auth from '../auth';
import { connect } from 'react-redux'; 

const PrivateRoute=({component:Component, ...rest})=>{
    return(
        <Route 
            {...rest} 
            render={
                props=>
                    props.AuthReducer.auth?
                    (<Component {...props}/>):
                    (<Redirect to={{pathname:"/"}}/>)
            }
        />
    )
}

const mapStateToProps=(state)=>{
    return{
        AuthReducer:state.AuthReducer
    }
}


export default connect(mapStateToProps,null)(PrivateRoute);