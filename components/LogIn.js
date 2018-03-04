import React, {Component} from 'react';
// import axios, {post} from 'axios';
// import tunnel from 'tunnel';

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

        var tunnelingAgent = tunnel.httpOverHttps({
            // maxSockets: poolSize, // Defaults to http.Agent.defaultMaxSockets

            proxy: { // Proxy settings
                // host: proxyHost, // Defaults to 'localhost'
                port: 8080, // Defaults to 443
                // localAddress: localAddress, // Local interface if necessary

                // Header fields for proxy server if necessary
                headers: {
                  'User-Agent': 'Node'
                },
            }
        });

        // var req = http.request({
        //     host: '18.219.163.179',
        //     path: '/login',
        //     port: 8080,
        //     agent: tunnelingAgent
        // }, (res) => {
        //     res.on('data', (data) => {console.log(data);});
        // });
        // const loginRequest = axios({
        //     method: 'post',
        //     url: '/login',
        //     headers: { 'Content-Type': 'application/json' },
        //     data: {
        //         username: usernameField.value,
        //         password: passwordField.value
        //     },
	    // proxy: {
		// host: 'http://18.219.163.179',
		// port: 8080
	    // },
	    // baseURL: 'http://18.219.163.179:8080'
        // }).then(result => {console.log(result)}).catch(error => {console.log(error)});

	/*axios.post('/login', {
		username: usernameField.value,
		password: passwordField.value
	})
	.then(function(response) {
		console.log(response);
	})
	.catch(function(error) {
		console.log(error);
	});*/
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
            </center>,
            <span style={{fontSize: "x-small", fontStyle: "italic"}}>Not a user yet? <a href="#" onclick="toggleModule('signup')">Sign up!</a></span>]
        );
    }
}
