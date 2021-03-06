import {canIterate, canAdd, canRemove} from './methods.js';
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
    get size() {
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
const IterableAdderRemover = compose(canIterate, canAdd, canRemove)(Object);
console.log(IterableAdderRemover);
/**
 * composed of an Iterator and an Adder
 * Prototype chain ressembles the order of class declaration.
 *      this->LinkedList->Iterator->Adder->Object
 * @param  {...any} iterables 
 */
export class LinkedList extends IterableAdderRemover{
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
    reverse(){
        const newList = new LinkedList();
        this.forEach(node => void newList.addFirst(node));
        this.head = newList.head;
        return this;
    }
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
            let result = null;
            if(a.data <= b.data){ 
                result = a;
                result.next = merge(a.next, b);//move through a and b seperately
            }
            else {
                result = b;
                result.next = merge(a, b.next);
            }
            return result;
        }

        this.head = mergeSort(this.head); //finally, set this head to the head of the sorted list
        return this;
    }//end of sort
}
