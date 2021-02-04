export class Node {
    constructor(data, next = null){
        this.data = data;
        this.next = next;
    }
    forEach(func){//executes a callback function on each node in the list
        for(let index = 0, current = this; current != null; index++, current = current.next){
            const response = func(current, index);
            if(response) return response;//will break out of the loop if a value is returned from callback
        }
    }
    draw(canvas=document.getElementById('quick-canvas')){
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height); 
        this.forEach((node, index) => {//node.data == width
            const {width, x, height, color} = node.data
            ctx.fillStyle = color;
            ctx.fillRect(x, height * index, width, height);
        })
    }
}

export class LinkedList {
    constructor(list){
        this.head = null;
        if(Array.isArray(list)){
            list.forEach(value => this.add(value));
        }else if(list?.constructor === Node){
            this.head = list;
        }
    }
    get size(){
        if(!this.head) return 0; 
        let index = 0;
        this.forEach((_, i) => {index = i})
        return ++index;
    }
    isInBounds(index){//returns true if the index is valid
        if(index >= this.size || index < 0){
           console.warn(`index ${index} is out of bounds`);  
           return false;
        } 
        return true;
    }
    addFirst(data){//adds a new node to the front of the list
        this.head = new Node(data, this.head);
        return this.size;
    }

    add(data){//adds a new node to the end of the list
        if(this.head === null) return this.addFirst(data);
        this.getAt(this.size-1).next = new Node(data);
        return this.size;
    }

    addAt(data, index){//adds a new node at index index
        if(index === 0) return this.addFirst(data);
        const node = this.getAt(index-1);
        node.next = new Node(data, node.next);
        return this.size;
    }

    getAt(index){//returns the node at index index
        if(!this.isInBounds(index)) return;
        return this.forEach((node, i) => {
            if(i === index) return node;
        })
    }

    getMiddle(node){
        if(!node) return null;
        let slow = node, fast = node;
        while(fast.next?.next){//fast will reach the end of the list twice as fast as slow
            slow = slow.next;
            fast = fast.next.next
        }//so at the end, slow will be in the middle of the list
        return slow;
    }

    getIndexOf(data){//returns the index of the first node that has matching data
        const result = this.forEach((node, index) => {
            if(node.data == data) return index;
        })
        return result || -1;
    }
    
    removeFirst(){//removes the first node in the list
        if(!this.head) return;
        this.head = this.head.next;
        return this.size;
    }

    removeAt(index){//removes a node a index index
        if(!this.isInBounds(index)) return;
        if(index === 0) return this.removeFirst();
        const previous = this.getAt(index-1);
        const removed = previous.next;
        previous.next = removed.next;
        return this.size;
    }

    removeData(data){//removes all nodes that match data
        let previous;
        this.forEach((node, index) => {
            if(node.data === data) {
                if(index === 0) this.removeFirst();
                else {
                   previous.next = node.next; 
                   this.size;
                }
            }
            previous = node;
        })
        return this.size;
    }

    clear(){//empty the list
        this.head = null;
    }

    forEach(func){//executes a callback function on each node in the list
        const linkListCopy = this;//the callback will recieve the current node, current index, and a copy of the original list
        for(let index = 0, current = this.head; current != null; index++, current = current.next){
            const response = func(current, index, linkListCopy);
            if(response) return response;//will break out of the loop if a value is returned from callback
        }
    }

    swap(a, b){//swaps data in nodes a and b
        const nodeA = this.getAt(a);
        const nodeB = this.getAt(b);
        const temp = nodeA.data;
        nodeA.data = nodeB.data;
        nodeB.data = temp;
    }

    toString(){//returns the linkedList in string format
        let string = '';
        this.forEach((node, index) => {
            string += node.next ? `[Node: ${index}   Data: ${node.data}] ====> \n` : `[Node: ${index}   Data: ${node.data}]` 
        })
        const result = string ? `${string}\nSize: ${this.size}` : "empty list"
        console.log(result);
        return result;
    }

    sort(){
        const mergeSort = (node) => { //split list in half recursively
            if(!node?.next) return node; //will return indivdual nodes here before calling merge
            const left = node;
            const middle = this.getMiddle(node);
            const right = middle.next;
            middle.next = null;
            return merge(mergeSort(left), mergeSort(right));
        }
        const merge = (a, b) => { //recusively add lowest between a and b to result
            if(!a) return b;//reached the end of a half so other node must be smaller, return other node and add it to result
            if(!b) return a;
            let result = null; //will become the head of sorted list
            if(a.data <= b.data){ //make the result the lowest of the two nodes
                result = a;
                result.next = merge(a.next, b);//move through a and b seperately
            }
            else {
                result = b;
                result.next = merge(a, b.next)
            }
            return result;//a and b have now been merged into a sorted list
        }
        this.head = mergeSort(this.head); //finally, set the head to the head of the sorted list
        return this;
    }
}
