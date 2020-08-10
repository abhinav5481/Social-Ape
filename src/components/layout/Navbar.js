import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import PropTypes from "prop-types";
import MyButton from '../../util/MyButton';
import PostScream from '../scream/PostScream';
import Notifications from './Notifications'

//REDUX stuff
import { connect } from 'react-redux';

//MUI stuff
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

//ICONS
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
// import Notification from '@material-ui/icons/NotificationsNoneSharp';

export class Navbar extends Component {
    render() {
        const { authenticated } = this.props
        return (
           <AppBar position='fixed'>
               <Toolbar className="nav-container">
                   {authenticated ? (
                       <>
                       {/* <MyButton title="Post a Scream!">
                           <AddIcon></AddIcon>
                       </MyButton> */}

                       <PostScream />
                       <Link to="/">
                            <MyButton title="Home">
                                <HomeIcon></HomeIcon>
                            </MyButton>
                       </Link>
                       {/* <MyButton title="Notifications"> */}
                                <Notifications />
                        {/* </MyButton> */}
                       </>
                   ) : 
                   <> 
                   <Button color="inherit" component={Link} to="/signup">Signup</Button>
                   <Button color="inherit" component={Link} to="/login">Login</Button>
                   <Button color="inherit" component={Link} to="/">Home</Button>
                   </>
                   }
               </Toolbar>
           </AppBar>
        )
    }
}

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired,
  };

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated

})

export default connect(mapStateToProps)(Navbar);
