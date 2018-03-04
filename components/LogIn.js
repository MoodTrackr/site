import React, {Component} from 'react';
import {post} from 'axios';

let usernameField, passwordField;

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        usernameField = document.getElementById('username');
        passwordField = document.getElementById('password');
    }

    handleSubmit(event) {
        event.preventDefault();
        const loginRequest = post('https://localhost:8080', {username: usernameField.value, password: passwordField.value}, {headers: { 'content-type': 'application/json' }});
        loginRequest.then(result => {console.log(result)}).catch(error => {console.log(error)});
    }

    render() {
        return (
            [<div className="jumbotron"><center><h1>Log In</h1></center></div>,
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
                            <label for="password" className="col-sm-2 col-form-label">Password</label>
                            <div className="col-sm-6"><input type="password" className="form-control" id="password"/></div>
                            <div className="col-sm-2"></div>
                        </div>
                    </fieldset>
                    <input type="submit" value="Submit" className="btn btn-default"/>
                </form>
            </center>]
        );
    }
}
