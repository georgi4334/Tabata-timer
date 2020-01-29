let prepare = document.querySelector('.prepare');
let work = document.querySelector('.work');
let rest = document.querySelector('.rest');
let cycles = document.querySelector('.cycles');
//prepare  + work + rest  = combined 
let combined = document.querySelectorAll('.combined');
let allDivs = document.querySelectorAll('input[type=tel]');
let timerDiv = document.querySelector('.timer');
let startBtn = document.querySelector('.start');
let currentTime = document.querySelector('.current');
let timeLeft = document.querySelector('.timeLeft');
let currentSession = document.querySelector('.currentSession')
let countdown;
let countdown2;
let isWorking = false;


//enter time for workout
const secondsToHms = (d, comp) => {

    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

    let hDisplay = h > 0 ? h + (":") : "";
    let mDisplay = m > 0 ? (m < 1 ? ":0" : "") + m : "0";
    let sDisplay = s > 0 ? (s < 10 ? ":0" : ":") + s : "";
    comp.value = `${hDisplay}${mDisplay}${sDisplay}`;

}


combined.forEach(i => i.addEventListener('change', (e) => {
    let attr = i.getAttribute('name');
    if (attr == 'prepare') {
        secondsToHms(i.value, prepare);
    } else if (attr == 'work') {
        secondsToHms(i.value, work)
    } else if (attr == 'rest') {
        secondsToHms(i.value, rest)
    }

}))

//take value from input and convert it to seconds 
function inputStringToNum(time) {
    time = time.split(":");
    let [minutes, seconds] = time;
    let totalSec = Number(minutes) * 60 + Number(seconds);
    return totalSec
}

//function for formating seconds to more readable time
const secondsToHmsCycles = (d) => {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

    let hDisplay = h > 0 ? h + (":") : "";
    let mDisplay = m > 0 ? (m < 1 ? ":0" : "") + m : "0";
    let sDisplay = s > 0 ? (s < 10 ? ":0" : ":") + s : "";
    return `${hDisplay}${mDisplay}${sDisplay}`;

}


//cycles total time for tabata 

let sum = 0;
let totalCycles = 0;

allDivs.forEach(e => e.addEventListener('change', () => {
    sum = inputStringToNum(work.value) + inputStringToNum(rest.value);
    totalCycles = (sum * Number(cycles.value)) + inputStringToNum(prepare.value);

    timeLeft.innerHTML = secondsToHmsCycles(totalCycles);

}))

console.log(totalCycles)

//start of tabata onclick 
startBtn.onclick = function () {
    if (!isWorking) {
        isWorking = true;
        runTabata(inputStringToNum(prepare.value), inputStringToNum(work.value), inputStringToNum(rest.value),
            Number(cycles.value), timerTotal(totalCycles));

    } else {
        isWorking = false;
        clearInterval(countdown);
    }
}

// pushing values into array[] and prepare it for timer
function runTabata(preparation, activity, resting, rounds) {
    let arrPeriods = [preparation];
    let index = 0;

    for (let i = 0; i < rounds; i++) {
        arrPeriods.push(activity)
        arrPeriods.push(resting)
    }
    timer(arrPeriods, index);
}


//timer engine
function timer(arrPeriods, index) {
    var timeNow, timeFuture, timeDifference;

    timeFuture = new Date();
    timeFuture = timeFuture.getTime();
    timeFuture = timeFuture + arrPeriods[index] * 1000;

    countdown = setInterval(function () {
        timeNow = new Date();
        timeDifference = Math.round((timeFuture - timeNow) / 1000) + 1;
        //print the current session workout

        if (index % 2 != 0) currentSession.innerHTML = 'Workout';
        if (index % 2 == 0) currentSession.innerHTML = 'Rest';

        timerDiv.innerHTML = secondsToHmsCycles(timeDifference);
        currentTime.innerHTML = Math.floor(((index + 1) / 2)) + " / " +
            (arrPeriods.length - 1) / 2;

        if (timeDifference === 1) {
            clearInterval(countdown);
            if (index < arrPeriods.length - 1) {
                index++;
                timer(arrPeriods, index);
            } else {

                setTimeout(() => {
                    timerDiv.innerHTML = '0:00';
                    currentSession.innerHTML = 'Done ! ';
                }, 1000)
            }
        }
    }, 1000);
}


function timerTotal(seconds) {
    // clear any existing timers
    clearInterval(countdown);

    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);


    countdown2 = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000 + 1);
        // check if we should stop it!
        if (secondsLeft < 0) {
            clearInterval(countdown);
            return;
        }
        // display it
        displayTimeLeft(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
    timeLeft.innerHTML = display

}