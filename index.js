const numOfBars = 100;

function map(value, a, b, c, d){
    value = (value - a) / (b - a); // first map value from (a..b) to (0..1)
    return Math.round(c + value * (d - c)); // then map it from (0..1) to (c..d) and return it
}

class Bar {
    constructor(canvas){
        this.width = (canvas.width/ numOfBars);
        this.height = Math.random() * canvas.height;
        this.y = canvas.height-this.height;
        const lightness = map(this.height, 0, canvas.height, 5, 95)
        //const hue = map(this.height, 0, canvas.height, 0, 359);
        this.color = `hsl(143, 75%, ${lightness}%)`
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
        bar.color = bar.startColor;
    });
}

// document.getElementById('quick').onclick = function(e){
//     e.preventDefault();
//     const root = document.getElementById('quick-div');
//     const canvas = document.getElementById('quick-canvas');
//     startSort(root, canvas, new Worker('quickWorker.js'))
// }
// document.getElementById('bubble').onclick = function(e){
//     e.preventDefault();
//     const root = document.getElementById('bubble-div');
//     const canvas = document.getElementById('bubble-canvas');
//     startSort(root, canvas, new Worker('bubbleWorker.js'))
// }
// document.getElementById('insert').onclick = function(e){
//     e.preventDefault();
//     const root = document.getElementById('insert-div');
//     const canvas = document.getElementById('insert-canvas');
//     startSort(root, canvas, new Worker('insertWorker.js'))
// }
// document.getElementById('merge').onclick = function(e){
//     e.preventDefault();
//     const root = document.getElementById('merge-div');
//     const canvas = document.getElementById('merge-canvas');
//     startSort(root, canvas, new Worker('mergeWorker.js'))
// }
// document.getElementById('select').onclick = function(e){
//     e.preventDefault();
//     const root = document.getElementById('select-div');
//     const canvas = document.getElementById('select-canvas');
//     startSort(root, canvas, new Worker('selectionWorker.js'))
// }
const workers = ['quickWorker.js', 'mergeWorker.js', 'insertWorker.js','selectionWorker.js','bubbleWorker.js'];
let index = 0;
for(let div of Array.from(document.getElementsByTagName('div'))){
    const canvas = div.getElementsByTagName('canvas')[0];
    startSort(div, canvas, new Worker(workers[index]))
    index++;
}

async function startSort(root, canvas, worker){
    canvas.width = root.clientWidth;
    canvas.height = root.clientHeight;
    let bars = [];
    for(let i = 0; i < numOfBars; i++){
        bars.push(new Bar(canvas))
    }
    draw(bars, canvas);
    worker.postMessage(bars)
    worker.onmessage = function(e){
        bars = e.data;
        draw(bars, canvas);
    }
    canvas.onclick = () => {
        worker.terminate();
    }
}
