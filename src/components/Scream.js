import React, { Component } from 'react';
import {Link} from 'react-router-dom';

//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

//dayjs 
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';


const styles = {
    card: {
        display: 'flex',
        marginBottom : 20
    },
    image: {
        minWidth: 100,
        backgroundSize: 'contain',
        margin: '10px 0px 10px 10px'
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }


}

class Scream extends Component {
    render() {
        const { classes, scream : {body, createdAt, userImage,userHandle, screamId, likeCount, commentCount} } = this.props;
        dayjs.extend(relativeTime);
        return (
           <Card className={classes.card}>
               <CardMedia image={userImage} title="profile image" className={classes.image} />
               <CardContent className={classes.content}>
                   <Typography variant ="h5" component={Link} to={`/users/${userHandle}`} color="primary">{userHandle}</Typography>
                   <Typography variant ="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                   <Typography variant ="body1">{body}</Typography>
               </CardContent>
           </Card>
        )
    }
}

export default withStyles(styles)(Scream);
