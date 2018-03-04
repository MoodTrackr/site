var React = require('react');
var ReactDOM = require('react-dom');
import {post} from 'axios';
import Login from './components/LogIn';
import Signup from './components/SignUp';
import Dashboard from './components/Dashboard';

var video;
var videoStream;
var img = new Image(48, 48);
var canvas;
var camInterval;

// REACTDOM THINGS
class App extends React.Component {
    constructor(props) {
        super(props);
        this.toggleModule = this.toggleModule.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.startFilming = this.startFilming.bind(this);
        this.stopFilming = this.stopFilming.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
        this.handleError = this.handleError.bind(this);
        this.sendSnapshot = this.sendSnapshot.bind(this);
        this.grayscale = this.grayscale.bind(this);

        this.state = {
            module: '',
            hasAuth: false,
            currentEmotion: 'Neutral'
        }
    }

    componentDidMount() {
        if(readCookie('auth') == null) {
            this.toggleModule('login');
        }
        else {
            this.toggleModule('dash');
            this.setState({hasAuth: true})
        }
    }

    render() {
        let mod = <div></div>;

        if(this.state.module == 'login') {
            mod = <Login toggle={this.toggleModule} authenticate={this.authenticate}/>;
        }
        else if(this.state.module == 'signup') {
            mod = <Signup toggle={this.toggleModule}/>;
        }
        else if(this.state.module == 'dash' || this.state.hasAuth) {
            mod = <Dashboard start={this.startFilming} stop={this.stopFilming} current={this.state.currentEmotion}/>;
        }

        return mod;
    }

    startFilming() {
        const constraints = {
            video: { width: 48, height: 48 }
        };
        navigator.mediaDevices.getUserMedia(constraints).then(this.handleSuccess).catch(this.handleError);
    }

    stopFilming() {
        clearInterval(camInterval);
        video.pause();
        video.srcObject = null;
        videoStream.getTracks().forEach(function (track) { track.stop() })
    }

    toggleModule(newModule) {
        this.setState({module: newModule});
    }

    authenticate(cookie, name) {
        makeCookie('auth', cookie);
        makeCookie('username', name)
        this.setState({hasAuth: true, module: 'dash'})
    }

    // IF WE HAVE WEBCAM PERMISSIONS, KICK OFF TRACKING
    handleSuccess(stream) {
        video.srcObject = stream;
        videoStream = stream;
        camInterval = setInterval(this.sendSnapshot, 3000);
    }

    // LOG PERMISSIONS ERROR
    handleError(error) {
        console.error('Permissions error', error);
    }

    // PROCESS IMAGE AND SEND IT AS REQUEST
    sendSnapshot() {
        canvas.getContext('2d').drawImage(video, 0, 0);
        img.src = canvas.toDataURL('image/webp;base64');
        img.src = this.grayscale();
        post('https://18.219.163.179:8080/upload',
            {
                cookie: readCookie('auth'),
                image: img.src
            },
            {
                headers: { 'content-type': 'application/json' },
                timeout: 3000
            }
        ).then((res) => {
            console.log(res);
            this.setState({currentEmotion: res.data.emotion});
        }).catch((error) => {console.log(error)});
    }

    // CONVERT IMAGE TO GRAYSCALE
    grayscale() {
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
};

ReactDOM.render(<App/>, document.getElementById('app'));

/******************************************************/

// TRACKER THINGS
window.onload = function() {
    video = document.querySelector('video');
    canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 48;
    canvas.style.display = "none";
}
