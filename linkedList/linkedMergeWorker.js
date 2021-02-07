
function sleep(ms, node, action){
    postMessage({node, action});
    return new Promise(resolve => setTimeout(resolve, ms));
}
onmessage = async (e) => {
    let iterations = 0;
    let isFirstSplit = true;
    const length = (node) => { //returns the number of children in next
        let count = 0;
        for(let current = node; current != null; current = current.next){
            count++;
        }
        return count;
    }
    const mergeSort = async (node) => { //split list in half recursively
        if(!node?.next) return node; //will return indivdual nodes here before calling merge
        const left = node;
        const middle = getMiddle(node);
        const right = middle.next;
        middle.next = null;

        if(isFirstSplit) await sleep(700, node, 'spliting');
        else if(length(node) > e.data.size/50) await sleep(700, node, 'spliting');
        else await sleep(300, node, 'spliting')
        // if(isFirstSplit) await sleep(700, node, 'spliting');
        // else if(length(node) > e.data.size/50) await sleep(500, node, 'spliting');
        // else await sleep(10, node, 'spliting')
        iterations++;
        return await merge(await mergeSort(left), await mergeSort(right));
    }
    const merge = async (a, b) => { //recusively add lowest between a and b to result
       // iterations++;
       isFirstSplit = false;
        if(!a) return b;//reached the end of a half but other half still has nodes in it, return other other half and add it to result
        if(!b) return a;// <== these nodes remain unsorted for now
        let result = null; //will become the head of sorted list
        if(a.data.width <= b.data.width){ //make the result the lowest of the two nodes
            result = a;
            result.next = await merge(a.next, b);//move through a and b seperately
        }
        else {
            result = b;
            result.next = await merge(a, b.next)
        }
        await sleep(105, result, 'merging');
        return result;//a and b have now been merged into a partially sorted list
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
    console.log("starting sort", e.data);
    list.head = await mergeSort(list.head); //finally, set the head to the head of the sorted list
    console.log("done sorting!",list.head)
    await sleep(0, list.head, 'done');
    self.close();
}