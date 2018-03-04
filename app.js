var React = require('react');
var ReactDOM = require('react-dom');
import {post} from 'axios';
import Login from './components/LogIn';
import Signup from './components/SignUp';

var video;
var img = new Image(48, 48);
var canvas;

// REACTDOM THINGS
class App extends React.Component {
    constructor(props) {
        super(props);
        this.toggleModule = this.toggleModule.bind(this);
        this.state = {
            module: ''
        }
    }

    componentDidMount() {
        if(readCookie('auth') == null) {
            this.toggleModule('login');
        }
    }

    render() {
        let mod = <div></div>;

        if(this.state.module == 'login') {
            mod = <Login toggle={this.toggleModule}/>;
        }
        else if(this.state.module == 'signup') {
            mod = <Signup toggle={this.toggleModule}/>;
        }

        return mod;
    }

    toggleModule(newModule) {
        this.setState({module: newModule});
    }
};

ReactDOM.render(<App/>, document.getElementById('app'));

/******************************************************/

// TRACKER THINGS
window.onload = function() {
    const constraints = {
        video: { width: 48, height: 48 }
    };

    video = document.querySelector('video');
    canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 48;
    navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
}

// IF WE HAVE WEBCAM PERMISSIONS, KICK OFF TRACKING
function handleSuccess(stream) {
    video.srcObject = stream;
    setInterval(sendSnapshot, 1000);
}

// LOG PERMISSIONS ERROR
function handleError(error) {
    console.error('Permissions error', error);
}

// PROCESS IMAGE AND SEND IT AS REQUEST
function sendSnapshot() {
    canvas.getContext('2d').drawImage(video, 0, 0);
    img.src = canvas.toDataURL('image/webp;base64');
    img.src = grayscale();
    // post('https://localhost:8080', img, {headers: { 'content-type': 'image/webp;base64' }});
    // console.log({
    //     image: canvas.toDataURL()
    // })
    document.body.appendChild(img);
}

// CONVERT IMAGE TO GRAYSCALE
function grayscale() {
    var ctx = canvas.getContext('2d');
    var imgPixels = ctx.getImageData(0, 0, 48, 48);
    for(var y = 0; y < imgPixels.height; y++){
        for(var x = 0; x < imgPixels.width; x++){
            var i = (y * 4) * imgPixels.width + x * 4;
            var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
            imgPixels.data[i] = avg;
            imgPixels.data[i + 1] = avg;
            imgPixels.data[i + 2] = avg;
        }
    }
    ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    return canvas.toDataURL();
}
