import Iterable from "./iterable.js";

export class Node extends Iterable {
    constructor(data, next = null){
        super();
        this.data = data;
        this.next = next;
    }
    get length() {
        let count = 0;
        this.forEach(() => count++);
        return count;
    }
    get middle(){ //returns the middle child node (used in merge sort)
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
        this.tail = null; //not classic, but greatly improves performance when adding to end of list
        this.size = 0;
        if(iterable) this.join(iterable);
    }
    //private helper method
    #isInBounds(index){//returns true if the index is valid
        if(index >= this.size || index < 0){
           console.warn(`%cIndex ${index} is out of bounds\n`, 'color: yellow', this); 
           return false;
        } 
        else return true;
    }

    addFirst(data){//adds a new node to the front of the list
        this.head = new Node(data, this.head);
        if(this.size === 0) this.tail = this.head;
        this.size++;
        return this;
    }

    add(data, index){//creates a new node and adds it to the end of the list or at specified index
        if(index != undefined && this.#isInBounds(index) && index !== this.size - 1){ //add at specified index
            if(index === 0) return this.addFirst(data);
            const prevNode = this.getAt(index-1);
            prevNode.next = new Node(data, prevNode.next);
        }
        else { //add to end of the list
            if(this.head === null) return this.addFirst(data);
            this.tail.next = new Node(data);
            this.tail = this.tail.next;
        }
        this.size++;
        return this;
    }

    getAt(index){//returns the node at index index
        if(!this.#isInBounds(index)) return;
        if(index === this.size - 1) return this.tail;
        return this.find((node, i) => i === index ? node : false)
    }

    indexOf(value){//returns the index of the first node that has matching data or -1 if not found
        const index = this.find((node, index) => node?.data == value && index)
        return index === undefined ? -1 : index;
    }
    
    popFirst(){//removes and returns the first node
        if(!this.head) return;
        const removed = this.head;
        this.head = this.head.next;
        this.size--;
        if(this.size === 0) this.tail = null;
        return removed;
    }

    removeAt(index){//removes and returns the node at index index
        if(!this.#isInBounds(index)) return;
        if(index === 0) return this.popFirst();
        const previous = this.getAt(index-1);
        const removed = previous.next;
        previous.next = removed.next;
        this.size--;
        if(removed === this.tail) this.tail = previous;
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
        this.tail = null;
        this.size = 0;
        return this;
    }

    contains(value){ //returns true if the list contains value
        if(this.indexOf(value) !== -1) return true;
        else return false;
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
        if(!iterable) return;
        if(iterable instanceof Iterable){ //Iterable must be a Node or LinkedList
            let copy = iterable.clone(); //must clone or else risk memory loops if the same exact node already exists in iterable
            if(!this.tail) this.head = copy.head;
            else this.tail.next = copy.head;
            this.tail = copy.tail;
            this.size += copy.size;
            console.log(this)
        }
        else if(Symbol.iterator in Object(iterable)){ //if iterable is an iterable
            for(const value of iterable){ //add each value to the end of the list
                if(this.tail){
                    this.tail.next = new Node(value);
                    this.tail = this.tail.next;
                }
                else {
                    this.head = new Node(value);
                    this.tail = this.head;
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

    swap(a, b){//swaps data in nodes at indexes a and b
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
