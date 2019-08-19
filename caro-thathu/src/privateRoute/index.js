import React,{Component} from 'react';
import {Route,Redirect} from 'react-router-dom';
import Auth from '../auth';

const PrivateRoute=({component:Component, ...rest})=>{
    return(
        <Route 
            {...rest} 
            render={
                props=>
                    Auth.getAuth()?
                    (<Component {...props}/>):
                    (<Redirect to={{pathname:"/"}}/>)
            }
        />
    )
}

export default PrivateRoute;