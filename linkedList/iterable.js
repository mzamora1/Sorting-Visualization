import { Node } from "./linkedList.js";

export default class Iterable {//base class for Node and LinkedList

    forEach(func){//executes a callback function on each node in the list
        for(const [current, index] of this){//'of' will call this[Symbol.iterator].next() after each pass
            func(current, index);//the callback will receive the current node and the current index
        }
    }

    [Symbol.iterator]() { //defines how this object will behave in a for-of loop and with ...(spread) syntax
        let currentNode = this instanceof Node ? this : this.head;
        let firstTime = true;
        let index = 0;
        return {
            next: () => { //next() will be called after each pass of a for-of loop
                if(firstTime){
                    if(this.head === null) {
                        console.warn("cannot iterate over empty list");
                        return { done: true };
                    }
                    firstTime = false;
                    return { value: [currentNode, index++], done: false };
                }
                else if(currentNode?.next){
                    currentNode = currentNode.next; //move to next node
                    return { value: [currentNode, index++], done: false };
                } 
                else {
                    return { done: true };
                }
            }
        } 
    }
}