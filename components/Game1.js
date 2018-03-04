import React from 'react';

var s;

export default class Game1 extends React.Component {
    constructor(props) {
        super(props);
        s = document.createElement('script');
        s.setAttribute('src', './Game1script.js');
    }

    componentWillUnmount() {
        s.src = '';
    }

    render() {
        return ([
            <center><h1>Game</h1><canvas id="myCanvas" width="1600" height="600"></canvas></center>,
            <img id="Jeff" style="display:none;" src="jeff.png"></img>,
            <img id="Crash" style="display:none;" src="explosion.png"></img>,
            <img id="Background" style="display:none;" src="background.jpg"></img>,
            <img id="Background2" style="display:none;" src="background.jpg"></img>,
            <img id="Trex" style="display:none;" src="trex.png"></img>,
            <img id="Pt" style="display:none;" src="pt.png"></img>
        ])
    }
}
