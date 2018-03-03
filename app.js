import {post} from 'axios';

var video;
var img = new Image();
var canvas;

window.onload = function() {
    const constraints = {
        video: { width: 48, height: 48 }
    };

    video = document.querySelector('video');
    canvas = document.createElement('canvas');
    navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
}

function handleSuccess(stream) {
    video.srcObject = stream;
    setInterval(sendSnapshot, 1000);
}

function handleError(error) {
    console.error('Permissions error', error);
}

function sendSnapshot() {
    canvas.getContext('2d').drawImage(video, 0, 0);
    img.src = canvas.toDataURL('image/webp');
    // post('http://localhost:3030', img, {headers: { 'content-type': 'image/webp' }});
    console.log(img);
}
