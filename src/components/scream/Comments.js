import React, { Component,Fragment } from "react";
import PropTypes from "prop-types";
import MyButton from "../../util/MyButton";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import Paper from '@material-ui/core/Paper'


//MUI stuff
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
    commentImage: {
        maxWidth: '100%',
        height: 100,
        objectFit: 'cover',
        borderRadius: '50%'
    },
    commentData: {
        marginLeft: 20
    },
    invisibleSeperator : {
        border: 'none',
        margin: '4px'
    },
    visibleSeperator: {
        width: '100%',
        borderBottom: '1px solid #00bcd4',
        marginBottom: 20,
        backgroundColor: '#00bcd4'
  
      },
      paper: {
        padding: 10,
        margin:'10px',
    width: '100%',
    backgroundColor: '#DFE9E6',
    color: '#000000'
}
      
      
})


class Comments extends Component {
    render() {
        const {comments,classes} = this.props
        return (
            <Grid container>
                {comments.map((comment,id) => {
                    const {body,createdAt,userImage,userHandle} = comment;
                    return(
                        <Paper className={classes.paper}  key={comment.id}>
                        <Grid item sm={12}>
                            <Grid container>
                                <Grid item sm={2}>
                                    <img src={userImage} alt="comment" className={classes.commentImage} />
                                </Grid>
                                <Grid item sm={9}>
                                    <div className={classes.commentData}>
                                        <Typography variant="h5" component={Link} to={`/users/${userHandle}`} color="primary">
                                            {userHandle}
                                        </Typography>
                            <Typography variant="body2"
                            color="textSecondary">
                                {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                            </Typography>
                            <hr className={classes.invisibleSeperator} />


                            <Typography variant="body1">{body}</Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* {id !== comments.length - 1 && (<hr className={classes.visibleSeperator} />)} */}

                        </ Paper>
                    )
                })}
            </Grid>
        )
    }
}

Comments.propTypes = {
    comments: PropTypes.array.isRequired,
   
  };
  

export default withStyles(styles)(Comments)
