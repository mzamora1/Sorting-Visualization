import { Node, LinkedList } from "./linkedList.js";
/**
 * base class for Node and Linked List
 */
export default class Iterable {
    /**
     * defines how this object will behave in a for-of loop and with ...(spread) syntax
     * @yields {Node} the current node
     */
    *[Symbol.iterator]() {
        for(let currentNode = this.head || this; currentNode !== null; currentNode = currentNode.next){
            if(currentNode === undefined) {
                console.warn('Iterable has been corrupted', 'color: red; font-size: 50px');
                break;
            }
            else yield currentNode; // passes currentNode back to calling function
        }
    }


    /**
     * calls func on each node in the list
     * @param {(currentNode: Node, currentIndex: number) => void} func called after each pass of for loop
     */
    forEach(func){
        let index = 0;
        for(const current of this) func(current, index++);
        return this;
    }

    
    /**
     * creates a new list from return values of func
     * @param {(currentNode: Node, currentIndex: number) => (Node|any)} func called after each pass of for loop
     *      if it returns a Node then a new identical Node will be created
     * @return {LinkedList} LinkedList filled with responses from func 
     */
    map(func){
        const newList = new LinkedList();
        this.forEach((current, index) => {
            const response = func(current, index);
            if(response !== undefined) {
                newList.add(response?.data ?? response);
            }
        })
        return newList;
    }


    /**
     * returns the first truthy or 0 value from func while looping through list
     * @param {(currentNode: Node, currentIndex: number) => any} func called after each pass of for loop
     * @return {(undefined|any)} the response, if any, from func
     */
    find(func){
        let index = 0;
        for(const current of this){
            const response = func(current, index++);
            if(response || response === 0) return response;
        }
    }


    /**
     * creates a new identical list
     * @return {LinkedList} an identical list
     */
    clone(){
        return this.map(node => node);
    }

}//end of Iterable
