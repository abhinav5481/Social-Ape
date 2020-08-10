import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

//REDUX STUFF
import { connect } from "react-redux";
import { editUserDetails } from "../../redux/actions/userActions";

//MUI stuff
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

//ICONS
import EditIcon from "@material-ui/icons/Edit";
import BorderColorSharpIcon from '@material-ui/icons/BorderColorSharp';

const styles = (theme) => ({
  
  button:{
      float: 'right'
  }
});

class EditDetails extends Component {
  state = {
    bio: "",
    website: "",
    location: "",
    open: false,
  };
  setUserDetailsToState = (credentials) => {
    this.setState({
      bio: credentials.bio ? credentials.bio : "",
      website: credentials.website ? credentials.website : "",
      location: credentials.location ? credentials.location : "",
    });
  };


  componentDidMount() {
    const { credentials } = this.props;
    this.setUserDetailsToState(credentials);
  }

  handleOpen = () => {
    this.setState({ open: true });
    this.setUserDetailsToState(this.props.credentials);
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleSubmit = () => {
      const userDetails = {
          bio: this.state.bio,
          website: this.state.website,
          location: this.state.location
      };
      this.props.editUserDetails(userDetails);
      this.handleClose();
  }
  render() {
    const { classes } = this.props;
    return (
      <>
        <Tooltip title="Edit Details" placement="bottom">
          <IconButton onClick={this.handleOpen} className={classes.button}>
            <BorderColorSharpIcon color="primary"></BorderColorSharpIcon>
          </IconButton>
        </Tooltip>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit your details</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="bio"
                type="text"
                label="Bio"
                multiline
                rows="3"
                placeholder="About yourself"
                className={classes.textField}
                value={this.state.bio}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="website"
                type="text"
                label="Website"
                placeholder="Your personal/professional website"
                className={classes.textField}
                value={this.state.website}
                onChange={this.handleChange}
                fullWidth
              />
               <TextField
                name="location"
                type="text"
                label="Location"
                placeholder="Your Location"
                className={classes.textField}
                value={this.state.location}
                onChange={this.handleChange}
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
              <Button onClick={this.handleClose} color="secondary">Cancel</Button>
              <Button onClick={this.handleSubmit} color="primary">Save</Button>

          </DialogActions>
        </Dialog>
      </>
    );
  }
}

EditDetails.propTypes = {
  editUserDetails: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  credentials: state.user.credentials
});

const mapActionsToProps = {
  editUserDetails,
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(EditDetails));
