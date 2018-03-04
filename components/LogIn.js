import React, {Component} from 'react';
import axios, {post} from 'axios';
import https from 'https';

let usernameField, passwordField;

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.goToSignup = this.goToSignup.bind(this);
    }

    componentDidMount() {
        usernameField = document.getElementById('username');
        passwordField = document.getElementById('password');
    }

    goToSignup() {
        console.log('signup')
        this.props.toggle('signup');
    }

    handleSubmit(event) {
        event.preventDefault();
        const agent = new https.Agent({
            rejectUnauthorized: false
        });
        const instance = axios.create({
            httpsAgent: agent
        })
        instance.post("https://18.219.163.179:8080/login", {
            username: usernameField.value,
            password: passwordField.value
        }, {
            headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}
        }).then((result) => {
            showLogout();
            this.props.authenticate(result.data.cookie, usernameField.value);
        });
   }

    render() {
        return (
            [<div className="jumbotron"><center><h1>Log In</h1></center></div>,
            <center>
                <form style={{width: "100%"}} onSubmit={this.handleSubmit}>
                    <fieldset>
                        <div className="form-group row" style={{textAlign: "center"}}>
                            <div className="col-sm-2"></div>
                            <label for="username" className="col-sm-2 col-form-label" value={this.props.name}>Username</label>
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
            </center>,
            <div style={{textAlign: "center", marginTop: 10}}><span style={{fontStyle: "italic"}}>Not a user yet? <a href="#" onClick={this.goToSignup}>Sign up!</a></span></div>]
        );
    }
}
