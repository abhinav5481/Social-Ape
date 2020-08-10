import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Link } from "react-router-dom";

//MUI stuffs
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import AppIcon from "../images/socialApe.jpg";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { CircularProgress } from "@material-ui/core";

//REDUX STUFF
import {connect} from 'react-redux';
import {loginUser} from '../redux/actions/userActions'

const styles = {
  form: {
    textAlign: "center",
  },
  iconImage: {
    transform: "scale(0.5)",
  },
  pageTitle: {
    marginBottom: "10px",
  },
  textField: {
    marginTop: "10px",
  },
  button: {
    marginTop: "20px",
    paddingLeft: "30px",
    paddingRight: "30px",
    position: "relative",
  },
  customError: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: 10,
  },
  progress: {
    position: "absolute",
  },
};

export class login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      // loading: false,
      errors: {},
    };
  }
  handleSubmit = (event) => {
    event.preventDefault();
    // this.setState({ loading: true });
    const userData = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.loginUser(userData, this.props.history);
    // axios
    //   .post("/login", userData)                                                //Before Redux
    //   .then((res) => {
    //     console.log(res.data);
    //     localStorage.setItem('FBIdToken',`Bearer ${res.data.token}`);
    //     this.setState({ loading: false });
    //     this.props.history.push("/");
    //   })
    //   .catch((err) => {
    //     this.setState({
    //       errors: err.response.data,
    //       loading: false,
    //     });
    //   });
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  componentWillReceiveProps(nextProps) {
    if(nextProps.UI.errors){
    this.setState({ errors : nextProps.UI.errors});
    }
  }
  render() {
    const { classes,UI: {loading}  } = this.props;    //=== this.props.ui.loading
    const { errors } = this.state;
    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img
            src={AppIcon}
            className={classes.iconImage}
            alt="icon-SocialApe"
          />
          <Typography variant="h4" className={classes.pageTitle}>
            Login
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              className={classes.textField}
              helperText={errors.email}
              error={errors.email ? true : false}
              value={this.state.email}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              className={classes.textField}
              helperText={errors.password}
              error={errors.password ? true : false}
              value={this.state.password}
              onChange={this.handleChange}
              fullWidth
            />
            {errors.general && (
              <Typography variant="body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              Login{" "}
              {loading && (
                <CircularProgress className={classes.progress} size={20} />
              )}
            </Button>{" "}
            <br />
            <small>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </small>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

//propTypes is used to validate the dataType 
login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired

};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI
});

const mapActionsToProps = {
  loginUser : loginUser
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(login));
