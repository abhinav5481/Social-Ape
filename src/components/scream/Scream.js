import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import MyButton from "../../util/MyButton";
import DeleteScream from '../scream/DeleteScream';
import ScreamDialog from './ScreamDialog'

//MUI stuff
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

//Icons
import ChatIcon from "@material-ui/icons/Chat";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Favorite from "@material-ui/icons/Favorite";

//dayjs
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

//redux stuff
import { connect } from "react-redux";
import { likeScream } from "../../redux/actions/dataActions";
import { unLikeScream } from "../../redux/actions/dataActions";

const styles = {
  card: {
    display: "flex",
    marginBottom: 20,
    position: 'relative'
  },
  image: {
    minWidth: 100,
    backgroundSize: "contain",
    margin: "10px 0px 10px 10px",
  },
  content: {
    padding: 25,
    objectFit: "cover",
  },
};

class Scream extends Component {
  likedScream = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.screamId === this.props.scream.screamId
      )
    ) {
      return true;
    } else return false;
  };
  likeScream = () => {
    this.props.likeScream(this.props.scream.screamId);
  };
  unLikeScream = () => {
    this.props.unLikeScream(this.props.scream.screamId);
  };
  render() {
    const {
      classes,
      scream: {
        body,
        createdAt,
        userImage,
        userHandle,
        screamId,
        likeCount,
        commentCount,
      },
      user: { authenticated, credentials: {handle} },
    } = this.props;

    let newBody = body.split(' ',10).join(' ');
    console.log(newBody,'nb');

    dayjs.extend(relativeTime);

    const likeButton = !authenticated ? (
      <MyButton title="Like">
        <Link to="/login">
          <FavoriteBorder color="primary"></FavoriteBorder>
        </Link>
      </MyButton>
    ) : this.likedScream() ? (
      <MyButton title="Undo Like" onClick={this.unLikeScream}>
        <Favorite color="primary"></Favorite>
      </MyButton>
    ) : (
      <MyButton title="Like" onClick={this.likeScream}>
        <FavoriteBorder color="primary"></FavoriteBorder>
      </MyButton>
    );


    const deleteButton  = authenticated && userHandle === handle ? (
        <DeleteScream screamId={screamId} />
    ) :  null

    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          title="profile image"
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            component={Link}
            to={`/users/${userHandle}`}
            color="primary"
          >
            {userHandle}
          </Typography>
          {deleteButton}
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{newBody}  .....</Typography>
          {likeButton}
          <span>{likeCount} Likes</span>

          <MyButton title="comments">
            <ChatIcon color="primary"></ChatIcon>
          </MyButton>
          <span>{commentCount} Comments</span>
          <ScreamDialog screamId = {screamId} userHandle={userHandle} openDialog={this.props.openDialog} />
        </CardContent>
       
      </Card>
    );
  }
}

Scream.propTypes = {
  likeScream: PropTypes.func.isRequired,
  unLikeScream: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool
};

const mapStateToProps = (state) => ({
  // data: state.data,
  user: state.user
});

const mapActionsToProps = {
  likeScream,
  unLikeScream,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Scream));
