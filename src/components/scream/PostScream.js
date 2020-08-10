import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

//REDUX STUFF
import { connect } from "react-redux";
import { postScream } from "../../redux/actions/dataActions";
import { clearErrors } from "../../redux/actions/dataActions";

//MUI stuff
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MyButton from "../../util/MyButton";

//icons
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import Axios from "axios";

const styles = (theme) => ({
  
  submitButton: {
      position: 'relative',
      marginTop: '40px',
      marginBottom: '20px'
  },
  progressSpinner: {
      position: 'absolute'
  },
  closeButton: {
      position: 'absolute',
      left: '92%',
      top: '2%'
  }
});

class PostScream extends Component {
  state = {
    open: false,
    body: "",
    errors: {}
  };
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
      this.props.clearErrors();
    this.setState({ open: false, errors: {} });
  };
  handleSubmit = (event) => {
    event.preventDefault();
   this.props.postScream({body: this.state.body});
//    this.setState({open: false})
  }
  handleChange = (event) => {
      this.setState({
        [event.target.name] : event.target.value
      })
  }

  componentWillReceiveProps = (nextProps) => {
      if(nextProps.UI.errors){
          this.setState({
              errors: nextProps.UI.errors
          })
      };
      if(!nextProps.UI.errors && !nextProps.UI.loading){
        this.setState({body: '',open: false, errors: {}});
        
      }
  }
  render() {
    const { errors } = this.state;
    const {
      classes,
      UI: { loading },
    } = this.props;
    return (
      <>
        <MyButton onClick={this.handleOpen} title="Post a Scream!">
          <AddIcon />
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
          <DialogTitle>Post a new scream</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <TextField
                name="body"
                type="text"
                label="Scream!!!"
                multiline
                rows="3"
                placeholder="Scream Now"
                errors={errors.body ? true : false}
                helperText={errors.body}
                className={classes.textField}
                onChange={this.handleChange}
                fullWidth
              />
              <Button type="submit" variant="contained" color="primary" className={classes.submitButton} disabled={loading} >
                  Submit
                 {loading && (
                      <CircularProgress size={16} className={classes.progressSpinner} />
                 )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

PostScream.propTypes = {
  postScream: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,

};

const mapStateToProps = (state) => ({
  UI: state.UI,
});

const mapActionsToProps = {
  postScream: postScream,
  clearErrors: clearErrors
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(PostScream));
