import { Node, LinkedList } from "./linkedList.js";

export default class Iterable {//base class for Node and LinkedList

    forEach(func){//executes a callback function on each node in the list
        for(const [current, index] of this){//'of' will call this[Symbol.iterator].next() after each pass
            func(current, index);//the callback will receive the current node and the current index
        }
    }

    map(func){//similar to forEach execpt it creates and returns a new list from the return values of the callback
        const newList = new LinkedList();
        for(const [current, index] of this){
            const response = func(current, index);
            if(response instanceof Node) {
                newList.add(response.data);
            }
            else if(response !== undefined){
                newList.add(response);
            }
        }
        return newList;
    }

    find(func){//similar to forEach except it will return the first truthy value from func
        for(const [current, index] of this){
            const response = func(current, index);
            if(response || response === 0){
                return response;
            } 
        }
    }

    clone(){ //returns an identical list
        return this.map(node => node);
    }

    [Symbol.iterator]() { //defines how this object will behave in a for-of loop and with ...(spread) syntax
        let currentNode = this instanceof Node ? this : this.head;
        let firstTime = true;
        let index = 0;
        return {
            next: () => { //next() will be called after each pass of a for-of loop
                if(firstTime){
                    if(currentNode === null) {
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