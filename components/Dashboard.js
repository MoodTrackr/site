import React, {Component} from 'react';
import PieChart from 'react-svg-piechart';

let timer;

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.handleStartTrack = this.handleStartTrack.bind(this);
        this.handleStopTrack = this.handleStopTrack.bind(this);
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
        this.props.start();
        timer = setInterval(() => {
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

    handleStopTrack() {
        this.props.stop();
        clearInterval(timer);
        this.setState({stage: 'report'});
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
                <div className="container-fluid row" style={{marginTop: 20}}>
                    <div className="col-sm-2"></div>
                    <div className="col-sm-4">
                        <PieChart data={[
                            {title: "Data 1", value: 100, color: "#22594e"},
                            {title: "Data 2", value: 60, color: "#2f7d6d"},
                            {title: "Data 3", value: 30, color: "#3da18d"},
                            {title: "Data 4", value: 20, color: "#69c2b0"},
                            {title: "Data 5", value: 10, color: "#a1d9ce"},
                        ]} expandOnHover/>
                    </div>
                    <div className="col-sm-4">
                        <h6>Play a game in the meantime!</h6>

                    </div>
                    <div className="col-sm-2"></div>
                </div>
                <button className="btn btn-danger" onClick={this.handleStopTrack}>Stop</button>
            </div>;
        }
        else if(this.state.stage == 'report') {
            dash = <div style={{textAlign: "center"}}>
                <h4 style={{fontWeight: "bold"}}>Over <span style={{textTransform: "none"}}>{this.state.elapsed}</span>, you mostly felt {this.state.currentMood}.</h4>
                <button className="btn btn-success" onClick={this.handleStartTrack}>Track</button>
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
