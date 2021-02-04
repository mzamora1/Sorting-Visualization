import {LinkedList, Node} from './linkedList.js';

function map(value, a, b, c, d){
    value = (value - a) / (b - a); // first map value from (a..b) to (0..1)
    return Math.round(c + value * (d - c)); // then map it from (0..1) to (c..d) and return it
}
function sleep(ms){
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

class AnimatedLinkedList extends LinkedList{
    constructor(dataArray){
        super(dataArray);
    }
    sort(worker, canvas) {
        worker.onmessage = (e) => {
            console.log(e.data)
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height); 
            for(let index = 0, current = e.data; current != null; index++, current = current.next){
                const {width, x, height, color} = current.data
                ctx.fillStyle = color;
                ctx.fillRect(x, height * index, width, height);
            }
        }
        worker.postMessage(this);
    }
}
class Link {
    constructor(canvas){
        this.height = canvas.height/numOfLinks;
        this.width = Math.random() * canvas.width;
        this.x = (canvas.width/2) - (this.width/2);
        const lightness = map(this.width, 0, canvas.width, 5, 95)
        this.color = `hsl(100, 75%, ${lightness}%)`
        this.startColor = this.color;
    }
}
const root = document.getElementsByClassName('linkedSort')[0];
const canvas = root.getElementsByTagName('canvas')[0];
canvas.width = root.clientWidth;
canvas.height = root.clientHeight;
const worker = new Worker("./linkedMergeWorker.js", {type: 'module'});
const aLL = new AnimatedLinkedList();
const numOfLinks = 80;
for(let i = 0; i < numOfLinks; i++){
    aLL.add(new Link(canvas))
}
aLL.head.draw(canvas);
sleep(1000).then(() => aLL.sort(worker, canvas))
