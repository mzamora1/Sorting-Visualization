
function sleep(ms, arr){
    postMessage(arr);
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

onmessage = (e) => {
    async function swap(arr, i, j){
        arr[i].color = 'rgb(255, 0, 0)';
        arr[j].color = 'rgb(0, 0, 255)';
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        await sleep(50, arr)
        arr[i].color = arr[i].startColor;
        arr[j].color = arr[j].startColor;
    }
    
    async function quickSort(array, start = 0, end = array.length-1){
        async function partition(arr, start, end){
            const pivot = arr[end]
            let index = start;
            for(let j = start; j < end; j++){
                if(arr[j].height < pivot.height){
                    await swap(arr, index, j)
                    index++
                }
            }
            await swap(arr, index, end)
            return index;
        }
        
        if(start >= end) return;
        const pivotIndex = await partition(array, start, end);
        quickSort(array, start, pivotIndex - 1);
        quickSort(array, pivotIndex + 1, end);
    }
    quickSort(e.data)
}