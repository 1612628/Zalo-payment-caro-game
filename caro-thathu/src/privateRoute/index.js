import React,{Component} from 'react';
import {Route,Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoute=({component:Component,AuthReducer, ...rest})=>{
    
    return(
        <Route 
            {...rest} 
            render={
                props=>
                AuthReducer.isAuthenticate===true?
                    (<Component {...props}/>):
                    (<Redirect to={{pathname:"/"}}/>)
            }
        />
    )
}

PrivateRoute.propTypes={
    AuthReducer:PropTypes.object.isRequired
}
const mapStateToProps=(state)=>({
    AuthReducer:state.AuthReducer
})

export default connect(mapStateToProps,null)(PrivateRoute);