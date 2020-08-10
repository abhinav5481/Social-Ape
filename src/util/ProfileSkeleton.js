import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import NoImg from '../util/NoImg.png';
import {Link} from 'react-router-dom';

import Paper from '@material-ui/core/Paper';

import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from '@material-ui/icons/CalendarToday';


const styles = theme => ({
    handle: {
        height: 20,
        backgroundColor: theme.palette.primary.main,
        width: 60,
        margin:'0px auto 7px auto'
    }
    ,
    fullLine: {
        height: 15,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: '100%',
        marginBottom: 10
    },
    halfLine: {
        height: 15,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: '50%',
        marginBottom: 10,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    image_wrapper: {
        textAlign: "center",
        position: "relative"
    },
    profile_image: {
        width: 200,
        height: 200,
        objectFit: "cover",
        maxWidth: "100%",
        borderRadius: "50%",
    }
    ,profile_details: {
        textAlign: "center"
    }
    ,
    svg: {
        verticalAlign: "middle"
    }
    ,
    hr: {
        border: "none",
        margin: "0 0 10px 0",
    },
    paper: {
        padding: 20,
      }

})
const ProfileSkeleton = (props) => {
    const { classes } = props;
    return (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className={classes.image_wrapper}>
                    <img src={NoImg} alt="profile" className={classes.profile_image} />
                </div>
                <hr />
                <div className={classes.profile_details}>
                    <div className={classes.handle} />
                    <hr />
                    <div className={classes.fullLine} />
                    <div className={classes.halfLine} />
                    <hr />
                    <LocationOn color="primary" />
                    <hr />
                    <Link color="primary" /> https://website.com
                    <hr />
                    <CalendarToday color="primary" />
                </div>
            </div>
        </Paper>
    )
}

ProfileSkeleton.propTypes = {
    classes: PropTypes.object.isRequired
}
export default withStyles(styles)(ProfileSkeleton)
