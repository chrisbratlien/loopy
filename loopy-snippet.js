var elmnt, pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }


var media = document.querySelector('audio') || document.querySelector('video');

if (!media) {
    alert('No audio or video element found. Try again later when you have something playing');
}

var origPBR = media.playbackRate;
var wrap = document.createElement('div');
elmnt = wrap;
var label = document.createElement('label');
label.style = 'padding: 0 20px; min-width: 20px;';
label.innerText = 1.0;
wrap.style = `
    background: white; 
    border: 1px solid #888;
    height: 120px; 
    position: absolute; 
    left: 30%; 
    right: 70%; 
    top: 80px; 
    width: 40%; 
    z-index: 1000;
`;
//wrap.draggable = true;


var dragMe = document.createElement('label');
dragMe.innerText = 'dragMe';


var slider = document.createElement('input');
slider.type = 'range';
slider.min = 0.25;
slider.max = 2;
slider.step = 0.05;
slider.value = origPBR;
slider.style = 'height: 20px; width: 90%; margin: 0 auto;';
slider.onchange = function() {
    media.playbackRate = parseFloat(this.value);
    label.innerText = this.value;
    updateLoopTimeout();
}
;
var BSD;
BSD = {
    A: false,
    B: false
};
BSD.loopTimeout = false;
BSD.backToA = function() {
    console.log('bTA before pbR', media.playbackRate);
    media.currentTime = (BSD.A || 0);
    console.log('bTA after pbR', media.playbackRate);
    updateLoopTimeout();
}
;
BSD.keycodes = {
    TAB: 9,
    "RETURN": 13,
    ENTER: 13,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    PERIOD: 46,
    a: 65,
    b: 66,
    LEFT_BRACKET: 219,
    RIGHT_BRACKET: 221
};

var blinkOnceTimeout = 0;

function blinkOnce(elem) {

    var saveBGC = elem.style.backgroundColor;
    
    elem.style.backgroundColor = 'white';
    clearTimeout(blinkOnceTimeout);
    setTimeout(function(){
        elem.style.backgroundColor = saveBGC;
    },100);
}

function handleKeys(e) {
    var c = e.keyCode || e.which;
    if (c == BSD.keycodes.a) {
        setLoopStart(media.currentTime);
    }
    if (c == BSD.keycodes.b) {
        setLoopEnd(media.currentTime);
    }
    if (c == BSD.keycodes.LEFT_BRACKET) {
        nudgeLoopStart();
    }
    if (c == BSD.keycodes.RIGHT_BRACKET) {
        nudgeLoopEnd();
    }
    var elemToBlink = mapKeyToElement[c];
    if (elemToBlink) {
        blinkOnce(elemToBlink);
    }
    
}
document.addEventListener('keydown', handleKeys);
function updateLoopTimeout() {
    console.log('uLT pbR', media.playbackRate);
    var end = BSD.B || media.duration;
    var when = (end - media.currentTime) * 1 / media.playbackRate;
    console.log({end, when, a: BSD.A, b: BSD.B});
    if (isNaN(when)) {
        return console.log('when isNaN');
    }
    if (BSD.A > BSD.B) {
        return console.log('A > B');
    }
    if (BSD.B < BSD.A) {
        return console.log('B < A');
    }
    clearTimeout(BSD.loopTimeout);
    BSD.loopTimeout = setTimeout(BSD.backToA, when * 1000);
}
function setLoopStart(secs) {
    secs = parseFloat(secs);
    if (secs < 0) {
        secs = 0;
    }
    BSD.A = secs;
    updateLoopTimeout();
}
function setLoopEnd(secs) {
    secs = parseFloat(secs);
    var smallestAllowedLoopSeconds = 0.5;
    if (secs <= BSD.A + smallestAllowedLoopSeconds) {
        return false;
    }
    BSD.B = secs;
    media.currentTime = BSD.A;
    updateLoopTimeout();
}
function nudgeLoopStart() {
    BSD.A -= 1;
    BSD.A = (BSD.A < 0) ? 0 : BSD.A;
    updateLoopTimeout();
}
function nudgeLoopEnd() {
    BSD.B += 1;
    updateLoopTimeout();
}
var nA = document.createElement('label');
nA.style = `
    margin: 0; 
    background: #bbb; 
    color: #333; 
    cursor: pointer;
    padding: 2px 10px;
`;
nA.innerText = '[';
nA.onclick = function() {
    nudgeLoopStart();
}
;
var btnA = document.createElement('label');
btnA.style = `
    background: #6d6; 
    color: white; 
    cursor: pointer;
    margin-right: 0px; 
    padding: 2px 10px;
`;
btnA.innerText = 'A';
btnA.onclick = function() {
    setLoopStart(media.currentTime);
}
;
var btnB = document.createElement('label');
btnB.style = `
    background: red; 
    color: white; 
    cursor: pointer;
    margin: 0px; 
    padding: 2px 10px;
`;
btnB.innerText = 'B';
btnB.onclick = function() {
    setLoopEnd(media.currentTime);
}
;
var nB = document.createElement('label');
nB.style = `
    margin: 0; 
    background: #bbb; 
    color: #333; 
    cursor: pointer;
    padding: 2px 10px;
`;
nB.innerText = ']';
nB.onclick = function() {
    nudgeLoopEnd();
}
;

var mapKeyToElement = {
    [BSD.keycodes.a]: btnA,
    [BSD.keycodes.b]: btnB,
    [BSD.keycodes.LEFT_BRACKET]: nA,
    [BSD.keycodes.RIGHT_BRACKET]: nB
};

var btnResume = document.createElement('button');
btnResume.style = 'margin: 0 10px;';
btnResume.innerText = 'resume normal playback';
btnResume.onclick = function() {
    clearTimeout(BSD.loopTimeout);
}
;
var btnExit = document.createElement('label');
btnExit.style = `
    position: absolute; 
    top: 0; 
    right: 0; 
    padding: 2px 5px; 
    background: black; 
    color: white;
    cursor: pointer;
`;
btnExit.innerText = 'X';
btnExit.onclick = function() {
    clearTimeout(BSD.loopTimeout);
    media.playbackRate = origPBR;
    BSD = null;
    document.body.removeChild(wrap);
}
;
var db = window.localStorage;
if (db) {
    [0, 1, 2, 3].forEach(function(i) {
        var key = 'Loopy::save' + (i+1);
        var slot = document.createElement('div');
        slot.style = 'padding: 2px 5px; display: block-inline; float: left; background: #fa0; border-right: 1px solid #a50;';
        var load = document.createElement('label');
        load.style = ' margin: 0 2px;';
        load.innerText = ((i == 0) ? 'load' : 'L') + (i + 1);
        load.onclick = function() {
            if (!db[key]) {
                return false;
            }
            var loopInfo = JSON.parse(db[key]);
            BSD.A = loopInfo.A;
            BSD.B = loopInfo.B;
            clearTimeout(BSD.loopTimeout);
            media.currentTime = BSD.A;
            updateLoopTimeout();
        }
        ;
        var save = document.createElement('label');
        save.style = '';
        save.innerText = ((i == 0) ? 'save' : 'S') + (i + 1);
        save.onclick = function() {
            var loopInfo = {
                A: BSD.A,
                B: BSD.B
            };
            db[key] = JSON.stringify(loopInfo);
        }
        ;
        slot.appendChild(save);
        slot.appendChild(load);
        wrap.appendChild(slot);
    });

}
wrap.appendChild(slider);
wrap.appendChild(label);
wrap.append(nA);
wrap.append(btnA);
wrap.append(btnB);
wrap.append(nB);
wrap.append(btnResume);
wrap.append(dragMe);
wrap.append(btnExit);
document.body.appendChild(wrap);
dragMe.onmousedown = dragMouseDown;