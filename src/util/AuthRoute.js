import React from 'react';
import { Route , Redirect} from 'react-router-dom';
import PropTypes from 'prop-types'

//REDUC STUFF
import {connect} from 'react-redux';

function AuthRoute({component : Component, authenticated, ...rest}) {
    return (
       <Route {...rest} render={(props) => authenticated === true ? <Redirect to='/' /> : <Component {...props} />} />
       
    )
}

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated
});

AuthRoute.propTypes ={
    user: PropTypes.object
}



export default connect(mapStateToProps)(AuthRoute)
