import React, {Component} from 'react';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {stage: 'fresh'}
    }

    componentDidMount() {
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        let dash = <div></div>;
        if(this.state.stage == 'fresh') {
            dash = <div><h4 style={{fontWeight: "bold", textAlign: "center"}}>Let's get started!</h4></div>
        }
        return (
            [
                <div className="jumbotron"><center><h1>Hi, {readCookie('username')}.</h1></center></div>,
                dash
            ]
        );
    }
}
