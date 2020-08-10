import React, { Component } from "react";
import PropTypes from "prop-types";
import MyButton from "../../util/MyButton";

//MUI stuff
import withStyles from "@material-ui/core/styles/withStyles";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';


//Icons
import DeleteOutline from '@material-ui/icons/DeleteOutline';

//Redux stuff
import {connect} from 'react-redux';
import {deleteScream} from '../../redux/actions/dataActions'

const styles= {
    deleteButton: {
        left: '90%',
        top: '7%',
        position: 'absolute'
    }
}
 class DeleteScream extends Component {
    deleteNow = () => {
        this.props.deleteScream(this.props.screamId);
        this.setState({open : false})
    }

    state = {
        open: false
    }
    handleOpen = () => {
        this.setState({open: true})
    }
    handleClose = () => {
        this.setState({open : false})
    }

    render() {
        const {classes} = this.props
        return (
            <>
            <MyButton title="Delete Scream" onClick={this.handleOpen} btnClassName={classes.deleteButton}>
            <DeleteOutline color = "secondary"></DeleteOutline>
            </MyButton>
            <Dialog open={this.state.open} 
            onClose={this.handleClose}
            fullWidth
            maxWidth="sm">
                <DialogTitle>Are you sure you want to delete this scream?</DialogTitle>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">Cancel</Button>
                    <Button onClick={this.deleteNow} color="secondary">Delete</Button>
                </DialogActions>
            </Dialog>
            </>
        )
    }
};

DeleteScream.propTypes = {
    deleteScream: PropTypes.func.isRequired,
    screamId: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
   
  };

const mapActionsToProps = {
    deleteScream
}


export default connect(null,mapActionsToProps)(withStyles(styles)(DeleteScream))
