import {LinkedList, Node} from './linkedList/linkedList.js';
import {map, sleep, setupNav, $, hexToHSL} from './helpers.js';
import * as render from './linkedList/render.js';
import {Rect, Arrow, NewLink} from './linkedList/draw.js';

const splitSpan = $("#splitSpan");
const mergeSpan = $("#mergeSpan");
const sortContainer = $('#linkedSort');
const workers = ['linkedMergeWorker.js', 'linkedBubbleWorker.js'];
const runningWorkers = [];
const hsl = { h: 141, s: 73, l: 0 };
let numOfLinks = 50;





const init = () => {
    runningWorkers.forEach(worker => worker.terminate());
    Array.from(sortContainer.getElementsByClassName('root')).forEach((div, index) => {
        startSort(div, workers[index]);
    });
    startInsertion(true);
    // Array.from(showCase.getElementsByClassName('root')).forEach((div, index) => {
    //     startShowCase(div, workers[index]);
    // });
}

const form = $('#modal-form');
const barInput = $('#barInput');
form.onsubmit = (e) => {
    e.preventDefault();
    const {h, l} = hexToHSL($('#colorInput').value);
    hsl.h = h;
    hsl.l = l;
    if(barInput.value && barInput.value <= 500) numOfLinks = barInput.value;
    else if(barInput.value) alert("Enter smaller number please");
    init();
}
document.onvisibilitychange = () => runningWorkers.forEach(worker => worker.terminate());
$("#stopBtn").onclick = () => runningWorkers.forEach(worker => worker.terminate());
setupNav();

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
        //console.log(this)
        worker.postMessage(this);
    }
}
class Link {
    constructor(canvas){
        this.height = canvas.height/numOfLinks;
        this.width = Math.random() * canvas.width;
        this.x = (canvas.width/2) - (this.width/2);
        const lightness = map(this.width, 0, canvas.width, 5, 95);
        this.color = `hsl(${hsl.h}, ${hsl.s}%, ${lightness}%)`;
        this.startColor = this.color;
    }
}


async function startSort(root, workerFile){
    const canvas = root.getElementsByTagName('canvas')[0];
    canvas.width = root.clientWidth;
    canvas.height = root.clientHeight;
    const worker = new Worker(`./linkedList/${workerFile}`);
    canvas.onclick = () => {
        worker.terminate();
        canvas.onclick = () => startSort(root, workerFile);
    }
    const aLL = new AnimatedLinkedList();
    for(let i = 0; i < numOfLinks; i++) aLL.add(new Link(canvas));
    aLL.draw(canvas);
    await sleep(1000);
    aLL.sort(worker, canvas);
    runningWorkers.push(worker);
}

async function startShowCase(root, workerFile) {
    const canvas = root.getElementsByTagName('canvas')[0];
    canvas.width = root.clientWidth;
    canvas.height = root.clientHeight;
    const ctx = canvas.getContext('2d');
    const arrow = new Arrow(50, canvas.height/2, 50, 10);
    const a = new Arrow(50, canvas.height/2 + 100, 50, 1, undefined, 90);
    const links = new LinkedList();
    const numLinks = 10;
    const height = (canvas.height/numLinks)/2
    for(let i = 0; i < numLinks; i++){
        links.add(new NewLink(i*10, canvas.height/2, i*height*2, 300, height))
    }
    links.forEach(link => link.data.draw(ctx))
    //  const link = new NewLink("hello", 50, 100, 200, 50);
    // link.draw(ctx)
    // arrow.draw(ctx);
    // a.draw(ctx);
}

async function startInsertion(slow = false){
    let link;
    for(let i = 0; i < 10; i++){
        if(slow) await sleep(1000);
        link = render.createLink(Math.round(Math.random(i)*10));
        render.addLast(link);
    }
    return link;
}

async function startDeletion(){
    const deletion = $("#deletion");
    const newWrapper = $(".link-wrapper")
    deletion.after()
    const lastLink = startInsertion();
    const list = render.getList();
    for(const link of list){
        render.setActive(link);
        await sleep(1000);
        render.removeActive(link);
    }
}

// const bigArr = []
// for(let i = 0; i < 20; i++){
//     bigArr.push(Math.round(Math.random()*1000))
// }
// //[4,4,4,4,4,6,7,3,4]
// const list = new LinkedList(new AnimatedLinkedList(bigArr));

// console.log(list.indexOf(6))
// console.log(list.slice(1, 4))
// list.join(list.clone());
// console.log(list.getAt(0), list.getAt(2))
// //list.removeAllOf(0);
// console.time('sort');
// list.sort();
// console.timeEnd('sort');
// console.log(list.size)
// console.log(list+"");
// console.log(list.constructor === LinkedList);


init();