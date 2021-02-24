//import {globalSleep} from '../index.js';
import {map, constrain, sleep, setupNav, $} from '../helpers.js';
alert('imported');
const numOfBars = constrain(map(window.innerWidth, 0, 1080, 100, 500), 100, 500);
console.log(numOfBars);
const workers = ['quickWorker.js', 'mergeWorker.js', 'insertWorker.js','selectionWorker.js','bubbleWorker.js'];
const runningWorkers = [];
window.onbeforeunload = () => runningWorkers.forEach(worker => worker.terminate());
document.onvisibilitychange = (e) => runningWorkers.forEach(worker => worker.terminate());
$("#stopBtn").onclick = () => runningWorkers.forEach(worker => worker.terminate());

function main(){
    setupNav();
    Array.from(document.getElementsByClassName('root')).forEach((div, index) => {
        startSort(div, workers[index]);
    })
}

class Bar {
    constructor(canvas){
        this.width = (canvas.width/ numOfBars);
        this.height = Math.random() * canvas.height;
        this.y = canvas.height-this.height;
        const lightness = map(this.height, 0, canvas.height, 5, 95)
        //const hue = map(this.height, 0, canvas.height, 0, 359);
        //this.color = `hsl(100, 75%, ${lightness}%)`
        this.color = `hsl(45, 75%, ${lightness}%)`
        //this.color = `hsl(${hue}, 100%, ${50}%)`
        this.startColor = this.color;
    }
}



function startSort(root, workerFile){
    const worker = new Worker(`../workers/${workerFile}`);
    const canvas = root.getElementsByTagName('canvas')[0];
    canvas.width = root.clientWidth;
    canvas.height = root.clientHeight;
    canvas.onclick = () => {
        worker.terminate();
        canvas.onclick = () => startSort(root, workerFile);
    }
    const bars = [];
    for(let i = 0; i < numOfBars; i++){
        bars.push(new Bar(canvas))
    }
    const ctx = canvas.getContext('2d');
    draw(bars, canvas, ctx);
    worker.onmessage = (e) => draw(e.data, canvas, ctx);
    sleep(1000).then(() => worker.postMessage(bars));
    runningWorkers.push(worker);
}

function draw(array, canvas, ctx){
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    array.forEach((bar, i) => {
        ctx.fillStyle = bar.color;
        ctx.fillRect(bar.width * i, bar.y, bar.width, bar.height);
    });
}

main();