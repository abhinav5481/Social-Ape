import React, { Component } from "react";
import PropTypes from "prop-types";
import MyButton from "../../util/MyButton";
import { Link } from "react-router-dom";
import Comments from './Comments';
import CommentForm from './CommentForm';

//MUI stuff
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

//Icons
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";

//dayjs
import dayjs from "dayjs";

//Redux stuff
import { connect } from "react-redux";
import { getScream } from "../../redux/actions/dataActions";

const styles = (theme) =>  ({
   
    invisibleSeperator : {
        border: 'none',
        margin: '4px'
    }
    ,
    profileImage: {
        maxWidth: '200px',
        height: '200px',
        borderRadius: '50%',
        objectFit: 'cover'
    },
   
    DialogContent: {
        padding: 20
    },
    closeButton:{
        position: 'absolute',
        left: '90%'
    },
    expandButton:{
        position: 'absolute',
        left: '90%'
    },
    visibleSeperator: {
      width: '100%',
        borderBottom: '1px solid #00bcd4',
        marginBottom: 20,
        backgroundColor: '#00bcd4'

    }
    

});

export class ScreamDialog extends Component {
  state = {
    open: false,
    oldPath: '',
    newPath: ''
  };
  componentDidMount() {
    if (this.props.openDialog) {
      this.handleOpen();
    }
  }
  handleOpen = () => {
    let oldPath = window.location.pathname;
    const { userHandle, screamId} = this.props;
    const newPath = `/users/${userHandle}/scream/${screamId}`;
    if(oldPath === newPath) oldPath = `/users/${userHandle}`;

    this.setState({oldPath:oldPath,newPath:newPath});
    window.history.pushState(null,null,newPath);
    this.setState({ open: true });
    this.props.getScream(this.props.screamId);

  };

  handleClose = () => {
    window.history.pushState(null,null,this.state.oldPath);
    this.setState({ open: false });
  };

  render() {
    const {
      classes,
      scream: {
        screamId,
        body,
        createdAt,
        likeCount,
        commentCount,
        userImage,
        userHandle,
        comments
      },
      UI: { loading },
    } = this.props;

    const dialogMarkup = loading ? (
        <div style={{textAlign: 'center','marginTop': '50px','marginBottom': '50px'}}>
        <CircularProgress className={classes.CircularProgress} size={100} thickness={2} />
        </div>
    ) : (
        <Grid container spacing={16}>
            <Grid item sm={5}>
                <img src={userImage} alt="Profile" className={classes.profileImage} />
            </Grid>
            <Grid item sm={7}>
                <Typography
                component={Link}
                color="primary"
                variant="h5"
                to={`/users/${userHandle}`} >
                    @{userHandle}
                </Typography>
                <hr className={classes.invisibleSeperator} />
                <Typography variant="body2" color="textSecondary">
                    {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                </Typography>
                <hr className={classes.invisibleSeperator} />
                <Typography variant="body1" >
                    {body}
                </Typography>

            </Grid>
            {/* <hr className={classes.visibleSeperator} /> */}
            <CommentForm screamId={screamId} />
            <Comments comments={comments} />
        </Grid>
    )
    return (
      <>
        <MyButton
          onClick={this.handleOpen}
          title="Expand Scream!"
          tipClassName={classes.expandButton}
        >
          <UnfoldMore className={classes.unfold}  color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton
            title="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
          <DialogContent className={classes.DialogContent}>
              {dialogMarkup}
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

ScreamDialog.propTypes = {
  getScream: PropTypes.func.isRequired,
  scream: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  scream: state.data.scream,
  UI: state.UI,
});

const mapActionsToProps = {
  getScream: getScream,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(ScreamDialog));
