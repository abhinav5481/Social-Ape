import React, { Component } from 'react';
import axios from 'axios';
import Scream from '../components/scream/Scream';
import Profile from '../components/profile/Profile';
import PropTypes from 'prop-types';
import ScreamSkeleton from '../util/ScreamSkeleton';



//Mui Stuffs
import Grid from '@material-ui/core/Grid';

//REDUX stuff
import {connect} from 'react-redux';
import {getScreams} from '../redux/actions/dataActions'

class home extends Component {
 
    componentDidMount(){
        // axios.get('/screams')
        // .then(res => {
        //     this.setState({
        //         screams: res.data
        //     })
        // })
        // .catch(err => console.log(err));
        
        this.props.getScreams();
    }

   
    render() {
        const {screams,loading} = this.props.data;
        let recentScreamsMarkup = !loading ? (
        screams.map((scream) => 
        // <p>{scream.body}</p>
                 <Scream key={scream.screamId} scream={scream} />
                 ) 
        ) : (
            <ScreamSkeleton />
        )
        return (
            <Grid  container spacing={10}>
                <Grid item sm={8} xs={12}>
                   {recentScreamsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                   <Profile />
                </Grid>
            </Grid>
        )
    }
}


home.proTypes = {
    getScream: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapActionsToProps = {
    getScreams : getScreams
}
const mapStateToProps = (state) => ({
    data: state.data
})

export default connect(mapStateToProps,mapActionsToProps)(home)
