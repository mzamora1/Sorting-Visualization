import {Node, LinkedList} from './tempLinkedList.js';
/**
 * defines mixins that can be used to create a Node or Linked List
 * @module methods
 */



/**
* @param {*} supperClass constructor to inherit from
* @returns a new class with methods for adding new nodes
*/
export const canAdd = supperClass => {
    /**
     * @mixin Adder
     * @memberof LinkedList.prototype
     * @this {LinkedList}  
     */
    return class Adder extends supperClass{
        constructor(){
            super();
            this.size = 0;
        }
        addFirst(...args) {
            for(const data of args){
                this.head = new Node(data, this.head);
                if(this.size === 0) this.tail = this.head;
                this.size++;
            }
            return this;
        }
        add(...args) {
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
        insertAt(data, index = this.size - 1){
            const prevNode = this.getAt(index);
            if(data instanceof Iterator){
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
    }
}//end of canAdd and annon class

/**
* @param {*} supperClass constructor to inherit from
* @returns a new class with methods for looping through nodes
*/
export const canIterate = supperClass => {
    console.log('made new Iterator')
    function isInBounds(index, self){
        if(typeof index !== 'number' || index >= self.size || index < 0){
            console.warn(`%cIndex ${index} is out of bounds\n`, 'color: yellow', self); 
            return false;
        } 
        else return true;
    }
    /**
     * @mixin Iterator
     * @memberof LinkedList.prototype
     * @memberof Node.prototype
     * @this {(Node|LinkedList)} 
     */
    return class Iterator extends supperClass {
        constructor() {
            super();
        }
        *[Symbol.iterator](){
            for(let currentNode = this.head ?? this; currentNode !== null; currentNode = currentNode.next){
                if(currentNode === undefined) {
                    console.warn('Iterable has been corrupted', 'color: red; font-size: 50px');
                    break;
                }
                else yield currentNode; // passes currentNode back to calling scope
            }
        }
        forEach(func){
            let index = 0;
            for(const current of this) func(current, index++);
            return this;
        }
        find(func){
            let index = 0;
            for(const current of this){
                const response = func(current, index++);
                if(response || response === 0) return response;
            }
        }
        reduce(func, initalValue = 0){ //similar to forEach except it provides an accumulator while looping through list
            let accumulator = initalValue;//will 'reduce' the list down to one value
            this.forEach((node, index) => void (accumulator = func(accumulator, node, index)));
            return accumulator;
        }
        map(func){
            const newList = new LinkedList();
            this.forEach((current, index) => {
                const response = func(current, index);
                if(response !== undefined) newList.add(response?.data ?? response);
            })
            return newList;
        }
        clone(){ this.map(node => node)}
        fill(){ value => this.forEach(node => node.data = value)}
        getAt(index){
            if(!isInBounds(index, this)) return;
            if(index === this.size - 1) return this.tail;
            return this.find((node, i) => i === index ? node : false)
        }
        indexOf(value){
            const index = this.find((node, index) => node.data === value && index);
            return index === undefined ? -1 : index;
        }
        occurancesOf(value){
            const indexes = this.map(node => node.data === value ? node : undefined);
            return indexes.size;
        }
    };
}// end of canIterate

export const canRemove = superClass => {
    /**
     * @mixin Remover
     * @memberof LinkedList.prototype
     * @this {LinkedList} 
     */
    return class Remover extends superClass {
        constructor(){
            super();
        }
        clear(){
            this.head = null;
            this.tail = null;
            this.size = 0;
            return this;
        }
        popFirst(){
            if(!this.head) return;
            const removed = this.head;
            this.head = this.head.next;
            this.size--;
            if(this.size === 0) this.tail = null;
            return removed;
        }
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
        pop(){
            return this.removeAt(this.size-1);
        }
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
        removeAllOf(data){
            return this.filter(node => node.data == data);
        }
    }
}