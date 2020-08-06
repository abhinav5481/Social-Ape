import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import jwtDecode from 'jwt-decode'; //for decoding the User token;
import AuthRoute from './util/AuthRoute'
//MUI stuff
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'


//pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";

//components
import Navbar from "./components/Navbar";

//Redux
import {Provider } from 'react-redux';
import store from './redux/store';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#33c9dc',
      main: '#00bcd4',
      dark: '#008394',
      contrastText: '#ffffff'
    },
    secondary: {
      light: '#ff6333',
      main: '#ff3d00',
      dark: '#b22a00',
      contrastText: '#ffffff'
    },
    typography: {
      useNextVariants : true
    }
  }
});

let authenticated ;
const token = localStorage.FBIdToken;
if(token){
  const decodedToken = jwtDecode(token);
  if(decodedToken * 1000 < Date.now()){
    window.location.href = '/login';
    authenticated = false;
  }
  else{
    authenticated = true;
  }

}
 class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
      <div className="App">
        <Router>
        <Navbar />
          <div className="container">
            
            <Switch>
              <Route exact path="/" component={home} />
              <AuthRoute exact path="/login" component={login} authenticated={authenticated} />
              <AuthRoute exact path="/signup" component={signup} authenticated={authenticated} />
            </Switch>
          </div>
        </Router>
      </div>
      </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
