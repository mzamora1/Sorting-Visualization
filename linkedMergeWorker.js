
function sleep(ms, list){
    postMessage(list);
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
onmessage = async (e) => {
    const mergeSort = async (node) => { //split list in half recursively
        if(!node?.next) return node; //will return indivdual nodes here before calling merge
        const left = node;
        const middle = getMiddle(node);
        const right = middle.next;
        middle.next = null;
        await sleep(700, node);
        return await merge(await mergeSort(left), await mergeSort(right));
    }
    const merge = async (a, b) => { //recusively add lowest between a and b to result
        if(!a) return b;//reached the end of a half so other node must be smaller, return other node and add it to result
        if(!b) return a;
        let result = null; //will become the head of sorted list
        if(a.data.width <= b.data.width){ //make the result the lowest of the two nodes
            result = a;
            result.next = await merge(a.next, b);//move through a and b seperately
        }
        else {
            result = b;
            result.next = await merge(a, b.next)
        }
        await sleep(200, result);
        return result;//a and b have now been merged into a sorted list
    }
    const getMiddle = (node) => {
        if(!node) return null;
        let slow = node, fast = node;
        while(fast.next?.next){//fast will reach the end of the list twice as fast as slow
            slow = slow.next;
            fast = fast.next.next
        }//so at the end, slow will be in the middle of the list
        return slow;
    }
    const list = e.data;
    console.log("starting sort")
    list.head = await mergeSort(list.head); //finally, set the head to the head of the sorted list
    postMessage(list.head);
}