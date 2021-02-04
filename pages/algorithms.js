const numOfBars = map(window.innerWidth, 0, 1080, 100, 500);
console.log(numOfBars)

function map(value, a, b, c, d){
    value = (value - a) / (b - a); // first map value from (a..b) to (0..1)
    return Math.round(c + value * (d - c)); // then map it from (0..1) to (c..d) and return it
}

function sleep(ms){
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
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
    resize(){
        this.width = (canvas.width/ numOfBars);
    }
}

function draw(array, canvas){
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    array.forEach((bar, i) => {
        ctx.fillStyle = bar.color;
        ctx.fillRect(bar.width * i, bar.y, bar.width, bar.height);
    });
}

const workers = ['quickWorker.js', 'mergeWorker.js', 'insertWorker.js','selectionWorker.js','bubbleWorker.js'];
let index = 0;
for(let div of Array.from(document.getElementsByClassName('root'))){
    const canvas = div.getElementsByTagName('canvas')[0];
    startSort(div, canvas, workers[index])
    index++;
}

const runningWorkers = [];
async function startSort(root, canvas, workerFile){
    canvas.width = root.clientWidth;
    canvas.height = root.clientHeight;
    const worker = new Worker(`../workers/${workerFile}`);
    const bars = [];
    for(let i = 0; i < numOfBars; i++){
        bars.push(new Bar(canvas))
    }
    draw(bars, canvas);
    worker.onmessage = (e) => draw(e.data, canvas);
    await sleep(1000);
    worker.postMessage(bars);
    runningWorkers.push(worker);
    canvas.onclick = () => {
        worker.terminate();
        canvas.onclick = () => {
            startSort(root, canvas, workerFile);
        }
    }
}
document.getElementById('homeBtn').onclick = () => runningWorkers.forEach(worker => worker.terminate())