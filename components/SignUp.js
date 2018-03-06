import React, {Component} from 'react';
import {post} from 'axios';

let usernameField, passwordField1, passwordField2;

export default class Signup extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.goToLogin = this.goToLogin.bind(this);
    }

    componentDidMount() {
        usernameField = document.getElementById('username');
        passwordField1 = document.getElementById('password1');
        passwordField2 = document.getElementById('password2');
    }

    goToLogin() {
        this.props.toggle('login');
    }

    redirectEverSignUp() {
        this.saveState({user: usernameField.value});
        this.props.toggle('login');
        document.getElementById('username').value = this.state.user;
    }

    handleSubmit(event) {
        event.preventDefault();
        if(passwordField1.value == passwordField2.value) {
            post("https://moodtrackr.com:8080/register", {
                username: usernameField.value,
                password: passwordField1.value
            }, {
                headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}
            }).then((result) => {
                this.props.redirect(usernameField.value);
            });
        }
    }

    render() {
        return (
            [<div className="jumbotron"><center><h1>Sign Up</h1></center></div>,
            <center>
                <form style={{width: "100%"}} onSubmit={this.handleSubmit}>
                    <fieldset>
                        <div className="form-group row" style={{textAlign: "center"}}>
                            <div className="col-sm-2"></div>
                            <label for="username" className="col-sm-2 col-form-label">Username</label>
                            <div className="col-sm-6"><input type="text" className="form-control" id="username"/></div>
                            <div className="col-sm-2"></div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div className="form-group row" style={{textAlign: "center"}}>
                            <div className="col-sm-2"></div>
                            <label for="password1" className="col-sm-2 col-form-label">Password</label>
                            <div className="col-sm-6"><input type="password" className="form-control" id="password1"/></div>
                            <div className="col-sm-2"></div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div className="form-group row" style={{textAlign: "center"}}>
                            <div className="col-sm-2"></div>
                            <label for="password2" className="col-sm-2 col-form-label">Retype Password</label>
                            <div className="col-sm-6"><input type="password" className="form-control" id="password2"/></div>
                            <div className="col-sm-2"></div>
                        </div>
                    </fieldset>
                    <input type="submit" value="Submit" className="btn btn-default"/>
                </form>
            </center>,
            <div style={{textAlign: "center", marginTop: 10}}><span style={{fontStyle: "italic"}}>Already a user? <a href="#" onClick={this.goToLogin}>Log in!</a></span></div>]
        );
    }
}
