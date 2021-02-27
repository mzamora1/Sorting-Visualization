import {canIterate, canAdd} from './methods.js';
import {compose} from '../helpers.js';


const Iterable = canIterate(Object);
/**
 * represents a Node in a LinkedList
 * @extends {any} annon class with methods for iterating
 */
export class Node extends Iterable{
    /**
     * @param {any} data the starting data
     * @param {Node} [next] the starting next node
     */
    constructor(data, next = null){
        super();
        this.data = data;
        /**@type {Node} */
        this.next = next;
    }
    get childCount() {
        let count = 0;
        this.forEach(() => count++);
        return count;
    }

    /**@returns {Node} */
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
 * Composes seperate classes into one and then extends that single class with base Object.
 */
const IterableAdder = compose(canIterate, canAdd)(Object);
console.log(IterableAdder);
/**
 * composed of an Iterator and an Adder
 * Prototype chain ressembles the order of class declaration.
 *      this->->Iterator->Adder->Object
 * @param  {...any} iterables 
 */
export class LinkedList extends IterableAdder{
    constructor(...iterables){
        super();
        /**@type {Node} */
        this.head = null;
        /**@type {Node} */
        this.tail = null;
        if(iterables[0] !== undefined) this.join(...iterables);
    }
    static Of(numOfNodes){
        const newList = new LinkedList()
        for(let i = 0; i < numOfNodes; i++) newList.add(undefined);
        return newList;
    }
    toString(){
        if(!this.head) return null;
        let string = ``;
        this.forEach((node, index) => {
            string += node.next ? `[Node: ${index}\tData: ${node.data}] ====> \n` : `[Node: ${index}\tData: ${node.data}]` 
        })
        return `${string}\n\t  Size: ${this.size}`
    }
}
