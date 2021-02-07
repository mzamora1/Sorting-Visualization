import {LinkedList, Node} from './linkedList/linkedList.js';
import {map, sleep} from './helpers.js';

const splitSpan = document.getElementById("splitSpan");
const mergeSpan = document.getElementById("mergeSpan");
const rootContainer = document.getElementById('linkedSort');
const workers = ['linkedMergeWorker.js', 'linkedBubbleWorker.js'];
const numOfLinks = 50;

class AnimatedLinkedList extends LinkedList{
    constructor(iterable){
        super(iterable);
    }

    draw(canvas, startNode = this.head){ //startNode will be a plain object from worker
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height); //cant use for-of because functions dont transfer over postMessages
        for(let index = 0, current = startNode; current != null; index++, current = current.next){
            const {width, x, height, color} = current.data
            ctx.fillStyle = color;
            ctx.fillRect(x, height * index, width, height);
        }
    }
    sort(worker, canvas) {
        worker.onmessage = e => {
            if(e.data.action === 'spliting') {
                splitSpan.style.opacity = 1;
                mergeSpan.style.opacity = 0;
            }
            else if(e.data.action === 'merging') {
                splitSpan.style.opacity = 0;
                mergeSpan.style.opacity = 1;
            }
            else if(e.data.action === 'done'){
                splitSpan.style.opacity = 0;
                mergeSpan.style.opacity = 0;
            }

            this.draw(canvas, e.data.node);
        }
        console.log(this)
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

console.log(rootContainer)
Array.from(rootContainer.getElementsByClassName('root')).forEach((div, index) => {
    startSort(div, workers[index]);
})

async function startSort(root, workerFile){
    const canvas = root.getElementsByTagName('canvas')[0];
    canvas.width = root.clientWidth;
    canvas.height = root.clientHeight;
    const worker = new Worker(`./linkedList/${workerFile}`, {type: 'module'});
    canvas.onclick = () => {
        worker.terminate();
        canvas.onclick = () => {
            startSort(root, workerFile);
        }
    }
    const aLL = new AnimatedLinkedList();
    for(let i = 0; i < numOfLinks; i++){
        aLL.add(new Link(canvas))
    }
    aLL.draw(canvas);
    await sleep(1000);
    aLL.sort(worker, canvas);
    
}

const bigArr = []
for(let i = 0; i < 20; i++){
    bigArr.push(Math.round(Math.random()*1000))
}
//[4,4,4,4,4,6,7,3,4]
const list = new LinkedList(new AnimatedLinkedList(bigArr));

console.log(list.indexOf(6))
console.log(list.slice(1, 4))
list.join(list.clone());
console.log(list.getAt(0), list.getAt(2))
//list.removeAllOf(0);
console.time('sort');
list.sort();
console.timeEnd('sort');
console.log(list.size)
console.log(list+"");
console.log(list.constructor === LinkedList)