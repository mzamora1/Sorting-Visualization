import Iterable from "./iterable.js";


/**
 * represents a Node in a LinkedList
 * @extends Iterable
 */
export class Node extends Iterable {

    /**
     * @param {any} data the starting data
     * @param {Node} [next] the pointer to the starting next node
     */
    constructor(data, next = null){
        super();
        /**
         * holds the data within the node
         * @type {(any|undefined)}
         */
        this.data = data;

        /**
         * holds the pointer to the next node
         * @type {(Node|null)}
         */
        this.next = next;
    }


    /**
     * computes the number of child nodes down the chain from this node
     * @returns {number}
     */
    get length() {
        let count = 0;
        this.forEach(() => count++);
        return count;
    }

    /**
     * finds the middle child node (used in merge sort)
     * @returns {Node} the middle node from this node to it's tail
     */
    get middle(){ 
        let slow = this, fast = this;
        while(fast.next?.next){//fast will reach the end of the list twice as fast as slow
            slow = slow.next;
            fast = fast.next.next;
        }//so at the end, slow will be in the middle of the list
        return slow;
    }
}//end of Node


/**
 * represents a LinkedList
 * @extends Iterable
 */
export class LinkedList extends Iterable {
    
    /**
     * creates a new LinkedList filled with data from iterables
     * @param {...unknown} [iterables] any object with data and next properties or anything that works in for..of/...(spread) syntax
     */
    constructor(...iterables){
        super();
        /**
         * holds the first node in the list
         * @type {(Node|null)} 
         */
        this.head = null;

        /**
         * holds the last node in the list
         * @type {(Node|null)}
         */
        this.tail = null;

        /**
         * holds the number of nodes in the list
         * @type {Number}
         */
        this.size = 0;
        if(iterables[0] !== undefined) this.join(...iterables);
    }

    /**
     * returns a new list with specified size where all nodes data property equals undefined
     * @static
     * @param {number} numOfNodes the starting size of the list
     * @returns {LinkedList} the new LinkedList instance
     */
    static Of(numOfNodes){
        const newList = new LinkedList()
        for(let i = 0; i < numOfNodes; i++) newList.add(undefined);
        return newList;
    }


    /**
     * overwrites data in each node with value
     * @param {any} value the value to fill the list with
     * @returns {this} allows for chaining method calls
     */
    fill(value){
        return this.forEach(node => node.data = value);
    }


    /**
     * helper method that checks if index is valid
     * @private
     * @param {number} index is valid if it is not greater than or equal to {@l}this.size or less 0
     * @returns {boolean} false if index is invalid, true otherwise
     */
    isInBounds(index){
        if(typeof index !== 'number' || index >= this.size || index < 0){
           console.warn(`%cIndex ${index} is out of bounds\n`, 'color: yellow', this); 
           return false;
        } 
        else return true;
    }


    /**
     *  adds all arguments to the front of the list and increases its size
     * @param {...any} args
     */
    addFirst(...args){
        for(const data of args){
            this.head = new Node(data, this.head);
            if(this.size === 0) this.tail = this.head;
            this.size++;
        }
        return this;
    }


    /**
     * adds all args to the end of the list and increases its size 
     * @param {...any} args
     */
    add(...args){
        for(const data of args){
            if(this.head === null) this.addFirst(data);
            else{
                this.tail.next = new Node(data);
                this.tail = this.tail.next;
                this.size++;
            }
        }
        return this;
    }


    /**
     * inserts data directly after the node at index
     * if data is iterable, each element is added indivdually
     * @param {(Iterable|any)} data the data to be added
     * @param {number} [index] the index to add at
     */
    insertAt(data, index = this.size - 1){
        const prevNode = this.getAt(index);
        if(data instanceof Iterable){
            const clone = data.clone();
            const oldNext = prevNode.next;
            prevNode.next = clone.head;
            clone.tail.next = oldNext;
            if(prevNode === this.tail) this.tail = clone.tail;
            this.size += clone.size;
        }
        else {
            prevNode.next = new Node(data, prevNode.next);
            if(prevNode === this.tail) this.tail = prevNode;
            this.size++;
        }
        return this;
    }


    /**
     * gets a node by its index
     * @param {number} index
     * @returns {(Node|undefined)} the node at index, undefined if index is invalid
     */
    getAt(index){
        if(!this.isInBounds(index)) return;
        if(index === this.size - 1) return this.tail;
        return this.find((node, i) => i === index ? node : false)
    }


    /**
     * gets the index of a node by its data
     * @param {any} value 
     * @returns {number} the index of the first node with data that == value or -1
     */
    indexOf(value){
        const index = this.find((node, index) => node?.data == value && index)
        return index === undefined ? -1 : index;
    }
    

    /**
     * removes the first node in the list
     * @returns {(Node|undefined)} the old head of the list or undefined if already empty
     */
    popFirst(){
        if(!this.head) return;
        const removed = this.head;
        this.head = this.head.next;
        this.size--;
        if(this.size === 0) this.tail = null;
        return removed;
    }


    /**
     * removes and returns the node at index
     * @param {number} index 
     * @returns {(Node|undefined)} the removed node or undefined if index is out of bounds
     */
    removeAt(index){
        if(!this.isInBounds(index)) return;
        if(index === 0) return this.popFirst();
        const previous = this.getAt(index-1);
        const removed = previous.next;
        previous.next = removed.next;
        this.size--;
        if(removed === this.tail) this.tail = previous;
        return removed;
    }


    /**
     * removes and returns the last node
     * @return {(Node|undefined)}
     */
    pop(){
        return this.removeAt(this.size-1);
    }


    /**
     * filters out all nodes whose data == data
     * @param {any} data occurances to be removed from list
     */
    removeAllOf(data){
        return this.filter(node => node.data == data);
    }


    /**
     * removes nodes (in-place) where func returns truthy
     * @param {(currentNode: Node, currentIndex: number) => boolean} func 
     */
    filter(func){
        let previous;
        for(let index = 0, current = this.head; current != null; index++, current = current.next){
            if(func(current, index)) {
                if(index === 0) this.popFirst();
                else {
                    previous.next = current.next;
                    if(current === this.tail) this.tail = previous;
                    current = previous; //needed so the loop stays in sync while removing items from list
                    this.size--;
                    break;
                }
                index--;
            }
            previous = current;
        }
        return this;
    }


    /**
     * empties the list
     */
    clear(){
        this.head = null;
        this.tail = null;
        this.size = 0;
        return this;
    }


    /**
     * checks if one of the nodes in the list contains value
     * @param {any} value the value to check
     * @return {boolean} true if the list contains value, false otherwise
     */
    contains(value){
        if(this.indexOf(value) !== -1) return true;
        else return false;
    }


    /**
     * sets the head to a reversed copy
     */
    reverse(){
        const newList = new LinkedList();
        this.forEach(node => void newList.addFirst(node));
        this.head = newList.head;
        return this;
    }


    /**
     * uses reduce() to find the average of all nodes in the list
     */
    average(){
        return this.reduce((sum, current) => sum + current.data) / this.size;
    }


    /**
     * reduces the list down to a single value
     * @param {(accumulator: any, currentNode: Node, currentIndex: number) => any} func 
     *      the return value of this function will be assigned to the accumulator
     * @param {any} [initalValue] the inital value of the accumulator
     * @return {any} the reduced list
     */
    reduce(func, initalValue = 0){ //similar to forEach except it provides an accumulator while looping through list
        let accumulator = initalValue;//will 'reduce' the list down to one value
        this.forEach((node, index) => void(accumulator = func(accumulator, node, index)));
        return accumulator;
    }


    /**
     * appends all arguments to the end of the list
     * if the argument is iterable, each element in the argument will be added individually
     * @param {...unknown} args any object with next and data properties or anything that works in for..of
     * @return {this}
     */
    join(...args){
        for(const arg of args){
            switch(typeof arg){
                case 'object': {
                    const unknownObj = arg?.head || arg;
                    if('data' in unknownObj && 'next' in unknownObj){ //doing it this way allows plain objects from workers to be reatched to the class
                        for(let current = unknownObj; current != null; current = current.next){
                            this.add(current.data);
                        }
                    }
                    else if(Symbol.iterator in unknownObj) this.add(...unknownObj);
                    else this.add(unknownObj);
                    break;
                }
                default: this.add(arg);
            }
        }
        return this;
    }


    /**
     * copies nodes from start to end into a new list
     * @param {number} start the start index (inclusive)
     * @param {number} [end] the end index (exclusive)
     * @returns {LinkedList} the slice from start to end
     */
    slice(start, end = this.size){
        if(!this.isInBounds(start)) return;
        const newList = new LinkedList();
        let startIndex = start;
        for(const current of this.getAt(start)){
            if(startIndex++ < end) newList.add(current.data);
            else break;
        }
        return newList;
    }


    /**
     * swaps data in nodes at indexes a and b
     * @param {number} a the first index to swap with
     * @param {number} b the second index to swap with
     * @returns {this}
     */
    swap(a, b){
        if(!this.isInBounds(a) || !this.isInBounds(b)) return;
        let nodeA, nodeB, max = Math.max(a, b);
        this.find((node, index) => { //find nodes at a and b
            if(index === a) nodeA = node;
            else if(index === b) nodeB = node;
            if(index === max) return 0;
        });
        
        //swap occurs here
        const temp = nodeA.data;
        nodeA.data = nodeB.data;
        nodeB.data = temp;
        return this;
    }


    /**
     * defines how to represent linkedList in string format
     * @return {string} the linkedList in string format
     */
    toString(){
        if(!this.head) return null;
        let string = ``;
        this.forEach((node, index) => {
            string += node.next ? `[Node: ${index}\tData: ${node.data}] ====> \n` : `[Node: ${index}\tData: ${node.data}]` 
        })
        return `${string}\n\t  Size: ${this.size}`
    }


    /**
     * sorts the list (in-place) using merge sort
     * @return {this} the now sorted list
     */
    sort(){

        /**
         * splits the list in half recusively, then calls merge on all the pieces
         * @param {Node} node 
         * @returns {Node} the head of the sorted list
         */
        const mergeSort = (node) => {
            //BASE CASE if we split list into indivdual nodes
            if(!node?.next) return node; //return the beginning of each half
            const left = node; 
            const middle = node.middle;
            const right = middle.next;//middle is last node of left
            middle.next = null;
            return merge(mergeSort(left), mergeSort(right));
        }


        /**
         * merges a and b into a sorted list by recusively adding lowest between a and b to result
         * @param {Node} a the beginning of first half
         * @param {Node} b the beginning of second half
         * @returns {Node} the head of a sorted list
         */
        const merge = (a, b) => {
            if(!a) return b;//reached the end of a half but other half could still have nodes, add it to result
            if(!b) return a;
            let result = null; //will become the head of sorted list
            if(a.data <= b.data){ 
                result = a;
                result.next = merge(a.next, b);//move through a and b seperately
            }
            else {
                result = b;
                result.next = merge(a, b.next);
            }
            return result;//a and b have now been merged into a semi-sorted list
        }


        this.head = mergeSort(this.head); //finally, set this head to the head of the sorted list
        return this;
    }//end of sort
    
}//end of LinkedList
