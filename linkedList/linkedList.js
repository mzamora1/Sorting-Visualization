import Iterable from "./iterable.js";

export class Node extends Iterable {
    constructor(data, next = null){
        super();
        this.data = data;
        this.next = next;
    }
    get length() { //returns the number of children in next
        let count = 0;
        this.forEach(() => count++);
        return count;
    }
    get middle(){ //returns the middle child node
        let slow = this, fast = this;
        while(fast.next?.next){//fast will reach the end of the list twice as fast as slow
            slow = slow.next;
            fast = fast.next.next;
        }//so at the end, slow will be in the middle of the list
        return slow;
    }
}

export class LinkedList extends Iterable {
    constructor(iterable){
        super();
        this.head = null;
        this.size = 0;
        if(iterable) this.join(iterable);
    }
    get lastNode(){
        return this.head ? this.getAt(this.size-1) : null;
    }

    //private helper method
    #isInBounds(index){//returns true if the index is valid
        if(index >= this.size || index < 0){
           console.warn(`index ${index} is out of bounds\n\tLinkedList:\n${this}`); 
           return false;
        } 
        else return true;
    }

    addFirst(data){//adds a new node to the front of the list
        this.head = new Node(data, this.head);
        this.size++;
        return this;
    }

    add(data, index){//creates a new node and adds it to the end of the list or at specified index
        if(index !== undefined && this.#isInBounds(index)){ //add at specified index
            if(index === 0) return this.addFirst(data);
            const prevNode = this.getAt(index-1);
            prevNode.next = new Node(data, prevNode.next);
        }
        else { //add to end of the list
            if(this.head === null) return this.addFirst(data);
            this.lastNode.next = new Node(data);
        }
        this.size++;
        return this;
    }

    getAt(index){//returns the node at index index
        if(!this.#isInBounds(index)) return;
        return this.find((node, i) => i === index ? node : false)
    }

    indexOf(value){//returns the index of the first node that has matching data or -1
        const index = this.find((node, index) => node?.data == value && index)
        return index === undefined ? -1 : index;
    }
    
    popFirst(){//removes and returns the first node
        if(!this.head) return;
        const removed = this.head;
        this.head = this.head.next;
        this.size--;
        return removed;
    }

    removeAt(index){//removes and returns the node at index index
        if(!this.#isInBounds(index)) return;
        if(index === 0) return this.popFirst();
        const previous = this.getAt(index-1);
        const removed = previous.next;
        previous.next = removed.next;
        this.size--;
        return removed;
    }

    pop(){//removes and returns the last node
        return this.removeAt(this.size-1);
    }

    removeAllOf(data){//filter out all nodes whose data == data
        this.filter(node => node?.data == data);
    }

    filter(func){//similar to forEach except it removes nodes(in place) where the callback function returns truthy
        let previous;
        for(let index = 0, current = this.head; current != null; index++, current = current.next){
            if(func(current, index)) {
                if(index === 0) this.popFirst();
                else {
                    previous.next = current.next;
                    current = previous; //needed so the loop stays in sync while removing items from list
                }
                index--;
            }
            previous = current;
        }
        return this;
    }

    clear(){//empty the list
        this.head = null;
        this.size = 0;
        return this;
    }

    find(func){//similar to forEach except it will break out of the loop when a value is returned from func and return that value
        for(const [current, index] of this){
            const response = func(current, index);
            if(response || response === 0){
                return response;
            } 
        }
    }

    contains(value){ //returns true if the list contains value
        if(this.find(node => node?.data == value) !== undefined) return true;
        else return false;
    }

    clone(){ //returns an identical list
        return this.map(node => node);
    }

    map(func){//similar to forEach execpt it creates and returns a new list from the return values of the callback
        const newList = new LinkedList();
        let newCurrent = newList.head;
        this.forEach((current, index) => {
            const response = func(current, index);
            if(response !== undefined){
                if(response instanceof Node) {
                    if(!newCurrent) {
                        newList.head = new Node(response.data);
                        newCurrent = newList.head;
                    }
                    else {
                        newCurrent.next = new Node(response.data);
                        newCurrent = newCurrent.next;
                    }
                }
                else {
                    if(!newCurrent) {
                        newList.head = new Node(response);
                        newCurrent = newList.head;
                    } 
                    else {
                        newCurrent.next = new Node(response);
                        newCurrent = newCurrent.next;
                    }
                }
                newList.size++;
            }
        })

        return newList;
    }

    reverse(){//set the head of the list to a reversed copy
        const newList = new LinkedList();
        this.forEach(node => void newList.addFirst(node));
        this.head = newList.head;
        return this;
    }

    average(){//uses reduce() to find the average of all nodes in the list
        return this.reduce((sum, current) => sum + current.data) / this.size;
    }

    reduce(func, initalValue = 0){ //similar to forEach except it provides an accumulator while looping through list
        let accumulator = initalValue;//will 'reduce' the list down to one value
        this.forEach((node, index) => void(accumulator = func(accumulator, node, index)));
        return accumulator;
    }

    join(iterable){ //appends an iterable object to the end of the list
        if(!iterable || iterable?.head === this.head) return;

        if(iterable instanceof Node || iterable instanceof LinkedList) {
            if(this.head){
                this.lastNode.next = iterable.head || iterable;
                this.size += iterable.length || iterable.size; 
            }
            else {
                this.head = iterable.head || iterable;
                this.size += iterable.length || iterable.size; 
            }
        }
        else if(Symbol.iterator in Object(iterable)){ //if iterable is an iterable
            let lastNode = this.lastNode;
            for(const value of iterable){ //add each value to the end of the list
                if(lastNode){
                    lastNode.next = new Node(value);
                    lastNode = lastNode.next;
                }
                else {
                    this.head = new Node(value);
                    lastNode = this.head;
                }
                this.size++;
            }
        }
        return this;
    }

    slice(start, end = this.size-1){ //returns a copy from start index to end index
        if(!this.#isInBounds(start)) return;
        const newList = new LinkedList();
        let startIndex = start;
        for(const [current] of this.getAt(start)){
            if(++startIndex <= end) newList.add(current.data);
            else break;
        }
        return newList;
    }

    swap(a, b){//swaps data in nodes a and b
        if(!this.#isInBounds(a) || !this.#isInBounds(b)) return;
        const nodeA = this.getAt(a);
        const nodeB = this.getAt(b);
        const temp = nodeA.data;
        nodeA.data = nodeB.data;
        nodeB.data = temp;
        return this;
    }

    toString(){//defines how to represent linkedList in string format
        if(!this.head) return null;
        let string = ``;
        this.forEach((node, index) => {
            string += node.next ? `[Node: ${index}\tData: ${node.data}] ====> \n` : `[Node: ${index}\tData: ${node.data}]` 
        })
        return `${string}\n\t  Size: ${this.size}`
    }

    sort(){
        const mergeSort = (node) => { //split list in half recursively
            //BASE CASE if we reached the end of the list
            if(!node?.next) return node; //will return indivdual nodes here before calling merge
            const left = node; 
            const middle = node.middle;
            const right = middle.next;//middle is last node of left
            middle.next = null;
            return merge(mergeSort(left), mergeSort(right));
        }
        const merge = (a, b) => { //recusively add lowest between a and b to result
            if(!a) return b;//reached the end of a half so other node must be smaller, return other node and add it to result
            if(!b) return a;
            let result = null; //will become the head of sorted list
            if(a.data <= b.data){ //make result the lowest of the two nodes
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
