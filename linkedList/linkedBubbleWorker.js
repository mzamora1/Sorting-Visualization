
function sleep(ms, node){
    if(node) postMessage({node});
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function swap(head, nodeA, nodeB){//swaps data in nodes a and b
    nodeA.data.color = 'rgb(255, 0, 0)';
    nodeB.data.color = 'rgb(0, 0, 255)';
    const temp = nodeA.data;
    nodeA.data = nodeB.data;
    nodeB.data = temp;
    await sleep(0, head);
    nodeA.data.color = nodeA.data.startColor;
    nodeB.data.color = nodeB.data.startColor;
}

onmessage = async (e) => {
    console.log('worker start', e.data.head?.data.width)
    const list = e.data;
    for(let end = list.size-1; end > 1; end--){
        for(let i = 0, current = list.head; current != null && i < end; i++, current = current.next){
            if(current.data.width > current.next.data.width){
                await swap(list.head, current, current.next)
            }
            else await sleep(0, list.head)
        }
    }
    console.log('bubble done!')
    await sleep(0, list.head);

}