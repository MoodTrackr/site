import React, {Component} from 'react';
import {post} from 'axios';
import PieChart from 'react-svg-piechart';
import _ from 'lodash';

let timer, timer2;

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.handleStartTrack = this.handleStartTrack.bind(this);
        this.handleStopTrack = this.handleStopTrack.bind(this);
        this.generatePieChart = this.generatePieChart.bind(this);
        this.getEmotionInterval = this.getEmotionInterval.bind(this);
        this.getMostFrequentEmotion = this.getMostFrequentEmotion.bind(this);
        this.goToGame1 = this.goToGame1.bind(this);
        this.state = {
            stage: '',
            currentMood: '',
            elapsed: '0s',
            angry: 0,
            disgust: 0,
            fear: 0,
            happy: 0,
            neutral: 1,
            sad: 0,
            surprise: 0
        }
    }

    componentWillMount() {
        this.setState({stage: 'fresh'});
    }

    getEmotionInterval() {
        post("https://moodtrackr.com:8080/history", {
            cookie: readCookie('auth'),
            starttime: this.state.startTime,
            endtime: Date.now()
        }, {
            headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            timeout: 20000
        }).then((result) => {
            console.log(result);
            this.setState({angry: result.data["Angry"], disgust: result.data["Disgust"], fear: result.data["Fear"], happy: result.data["Happy"], neutral: result.data["Neutral"], sad: result.data["Sad"], surprise: result.data["Surprise"]})
        }).catch(error => {console.log(error)});
    }

    getMostFrequentEmotion() {
        var arr = [this.state.angry, this.state.disgust, this.state.fear, this.state.happy, this.state.neutral, this.state.sad, this.state.surprise];
        var max = Math.max(...arr);
        var i = arr.findIndex(num => {num == max});
        switch(i) {
            case 0:
                return "Angry";
            case 1:
                return "Disgust";
            case 2:
                return "Fear";
            case 3:
                return "Happy";
            case 4:
                return "Neutral";
            case 5:
                return "Sad";
            case 6:
                return "Surprise";
            default:
                return "Neutral";
        }
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

        timer2 = setInterval(() => {
            this.getEmotionInterval();
        }, 20000);
    }

    handleStopTrack() {
        this.props.stop();
        clearInterval(timer);
        clearInterval(timer2);
        this.setState({stage: 'report'});
    }

    goToGame1() {
        this.props.toggle('game1');
    }

    generatePieChart() {
        let state = this.state;
        return (
            <PieChart data={[
                {title: "Angry", value: state.angry, color: "#d9534f"},
                {title: "Disgust", value: state.disgust, color: "#4BBF73"},
                {title: "Fear", value: state.fear, color: "#6f42c1"},
                {title: "Happy", value: state.happy, color: "#f0ad4e"},
                {title: "Neutral", value: state.neutral, color: "#919aa1"},
                {title: "Sad", value: state.sad, color: "#007bff"},
                {title: "Surprise", value: state.surprise, color: "#fd7e14"}
            ]} expandOnHover/>
        );
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
                <h4 style={{fontWeight: "bold"}}>We think you're feeling {this.props.current} right now.</h4>
                <h1 style={{fontSize: "300%", textTransform: 'lowercase'}} id="timecode">{this.state.elapsed}</h1>
                <div className="container-fluid row" style={{marginTop: 20}}>
                    <div className="col-sm-2"></div>
                    <div className="col-sm-4">
                        {this.generatePieChart()}
                    </div>
                    <div className="col-sm-4">
                        <h6>Play a game in the meantime!</h6>
                        <a href="../demos/Game1.html" target="_blank"><img src="../demos/jeff.png"/></a>
                        <a href="../demos/Game2.html" target="_blank"><img src="../demos/boss.png" style={{width: "30%"}}/></a>
                    </div>
                    <div className="col-sm-2"></div>
                </div>
                <button className="btn btn-danger" onClick={this.handleStopTrack}>Stop</button>
            </div>;
        }
        else if(this.state.stage == 'report') {
            dash = <div style={{textAlign: "center"}}>
                <h4 style={{fontWeight: "bold"}}>Over <span style={{textTransform: "none"}}>{this.state.elapsed}</span>, you mostly felt {this.getMostFrequentEmotion()}.</h4>
                <div className="container-fluid row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4"></div>
                        {this.generatePieChart()}
                    </div>
                    <div className="col-sm-4"></div>
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
