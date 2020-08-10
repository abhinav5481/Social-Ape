import React, { Component } from "react";
import PropTypes from "prop-types";

//MUI stuff
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
// import Dialog from "@material-ui/core/Dialog";
// import CircularProgress from "@material-ui/core/CircularProgress";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// //Icons
// import CloseIcon from "@material-ui/icons/Close";
// import UnfoldMore from "@material-ui/icons/UnfoldMore";

//dayjs
// import dayjs from "dayjs";

//Redux stuff
import { connect } from "react-redux";
import { submitComment } from "../../redux/actions/dataActions";

const styles = (theme) => ({
  visibleSeperator: {
    width: "100%",
    borderBottom: "1px solid #00bcd4",
    marginBottom: 20,
    backgroundColor: "#00bcd4",
  },
  button: {
    marginTop: 20,
    marginBottom: 20
  },
  invisibleSeperator : {
    border: 'none',
    margin: '4px'
}
});

export class CommentForm extends Component {
  state = {
    body: "",
    errors: {},
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.submitComment(this.props.screamId, { body: this.state.body });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: '' });
    }
  }
  render() {
    const { classes, authenticated } = this.props;
    const errors = this.state.errors;
    const commentFormMarkup = authenticated ? (
      <Grid item sm={12} style={{ textAlign: "center" }}>
        <form onSubmit={this.handleSubmit}>
          <TextField
            name="body"
            type="text"
            label="Comment on this scream"
            error={errors.Comment ? true : false}
            helperText={errors.Comment}
            value={this.state.body}
            onChange={this.handleChange}
            fullWidth
            className={classes.textField}
          />
          <Button fullWidth
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Submit
          </Button>
        </form>
        <hr className={classes.invisibleSeperator} />
      </Grid>
    ) : null;
    return commentFormMarkup;
  }
}

CommentForm.propTypes = {
  submitComment: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  screamId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  UI: state.UI,
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, { submitComment })(
  withStyles(styles)(CommentForm)
);
