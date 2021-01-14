function sleep(ms, arr){
    if (arr) postMessage(arr);
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

onmessage = async (e) => {
    async function swap(arr, i, j){
        arr[i].color = 'rgb(255, 0, 0)';
        arr[j].color = 'rgb(0, 0, 255)';
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        await sleep(0, arr)
        //await sleep(10, arr)
        arr[i].color = arr[i].startColor;
        arr[j].color = arr[j].startColor;
    }
    
    async function selectionSort(array){
        for(let i = 0; i < array.length - 1; i++){//starting at the begining
            let min = i;
            for(let j = i + 1; j < array.length; j++){ //find minimum value in unchecked section
                if(array[j].height < array[min].height){
                    min = j;
                } 
                await sleep(0)
                //await sleep(4)
            }
            if(min != i) await swap(array, i, min); //swap current value with the min value
            //else await sleep(0)
            //else await sleep(10)
        }
        return array;
    }
    const result = await selectionSort(e.data);
    console.log('selection', result);
    postMessage(result);
}