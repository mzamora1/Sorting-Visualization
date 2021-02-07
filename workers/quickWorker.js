//import globalSleep from '../helpers.js';



function sleep(ms, arr){
    if(arr) postMessage(arr);
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

onmessage =async (e) => {
    //console.log(globalSleep)
    async function swap(arr, i, j){
        arr[i].color = 'rgb(255, 0, 0)';
        arr[j].color = 'rgb(0, 0, 255)';
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        await sleep(0, arr);
        //await sleep(10, arr);
        arr[i].color = arr[i].startColor;
        arr[j].color = arr[j].startColor;
    }
    
    async function quickSort(array, start = 0, end = array.length-1){
        async function partition(arr, start, end){//sort arr so that values less than pivot come before pivot and values greater come after
            let index = start; //remembers how many swaps, will become the final index of the pivot
            for(let j = start; j < end; j++){//for values in arr from indexs start to end-1
                if(arr[j].height < arr[end].height){//if current value is less than pivot value
                    await swap(arr, index, j) //swap value at num of swaps with value at current value
                    index++; //increase num of swaps
                }
            }
            await swap(arr, index, end)//swap value at num of swaps with pivot value
            await sleep(0, arr);
            //await sleep(10, arr)
            return index;//value at this index is now in the correct place
        }
        
        if(start >= end) return array; 
        const pivotIndex = await partition(array, start, end);
        await quickSort(array, start, pivotIndex - 1)
        return await quickSort(array, pivotIndex + 1, end);
    }
    const result = await quickSort(e.data)
    console.log('quick done', result)
    self.close();
}