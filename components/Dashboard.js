import React, {Component} from 'react';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.handleStartTrack = this.handleStartTrack.bind(this);
        this.state = {
            stage: '',
            currentMood: '',
            elapsed: '0s'
        }
    }

    componentWillMount() {
        this.setState({stage: 'fresh'});
    }

    handleStartTrack() {
        this.setState({stage: 'tracking', currentMood: 'happy', startTime: Date.now()});
        setInterval(() => {
            var elapsed = parseInt((Date.now() - this.state.startTime)/1000); // elapsed SECONDS
            var fancyTime = "0s";
            if(elapsed >= 60*60) {
                fancyTime = elapsed%(60*60) + "h";
                elapsed = elapsed%(60*60);
                fancyTime += " " + elapsed%60 + "m";
                elapsed = elapsed%60;
                fancyTime += " " + elapsed%60 + "s";
            }
            else if(elapsed >= 60) {
                fancyTime = parseInt(elapsed/60) + "m " + elapsed%60 + "s";
            }
            else {
                fancyTime = elapsed + "s";
            }
            this.setState({elapsed: fancyTime});
        }, 1000);
    }

    render() {
        let dash = <div></div>;
        if(this.state.stage == 'fresh') {
            dash = <div style={{textAlign: "center"}}>
                <h4 style={{fontWeight: "bold"}}>Let's get started!</h4>
                <button className="btn btn-success" onClick={this.handleStartTrack}>Track</button>
            </div>;
        }
        else if(this.state.stage == 'tracking') {
            dash = <div style={{textAlign: "center"}}>
                <h4 style={{fontWeight: "bold"}}>We think you're feeling {this.state.currentMood} right now.</h4>
                <h1 style={{fontSize: "300%", textTransform: 'lowercase'}} id="timecode">{this.state.elapsed}</h1>
                <button className="btn btn-danger" onClick={this.handleStopTrack}>Stop</button>
            </div>;
        }
        return (
            [
                <div className="jumbotron"><center><h1>Hi, {readCookie('username')}.</h1></center></div>,
                dash
            ]
        );
    }
}
