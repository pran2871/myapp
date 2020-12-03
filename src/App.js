import {makeStyles} from "@material-ui/core/styles";
import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import './App.css';
import AppLayout from './components/AppLayout';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import EmailVerify from './components/LoginForm/EmailVerify';
import LoginForm from './components/LoginForm/LoginForm';
import Resetpassword from './components/ResetPassword/ResetPassword';


const useStyles = makeStyles({
    container: {
        display: "flex"
    }
});

function App() {
    const ForbiddenPage = props => {
        return (
            <div>
                Forbidden page
            </div>
        );
    };

    const NotFoundPage = props => {

        return (
            <div>
                page nor found
            </div>
        );
    };

    return (
        <Router>

            <div className="App">
                <div className="container d-flex align-items-center flex-column">

                    <Switch
                        atEnter={{opacity: 0}}
                        atLeave={{opacity: 0}}
                        atActive={{opacity: 1}}
                        className="switch-wrapper"
                    >
                        <Route exact path="/login" component={LoginForm}/>
                        <Route exact path="/forbidden" component={ForbiddenPage}/>
                        <Route exact path="/forgot" component={ForgotPassword}/>
                        <Route exact path="/verify" component={EmailVerify}/>
                        <Route exact path="/reset" component={Resetpassword}/>
                        <AuthenticatedRoute path="/" component={AppLayout}/>
                        <Route
                            exact
                            path="/"
                            render={() => <Redirect to={{pathname: "/login"}}/>}
                        />
                        <Route component={NotFoundPage}/>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default App;
