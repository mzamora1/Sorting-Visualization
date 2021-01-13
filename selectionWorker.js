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
        await sleep(300, arr)
        arr[i].color = arr[i].startColor;
        arr[j].color = arr[j].startColor;
    }
    
    async function selectionSort(array){
        for(let i = 0; i < array.length-1; i++){
            let min = i;
            for(let j = i + 1; j < array.length; j++){
                if(array[j].height < array[min].height){
                    min = j;
                } 
            }
            if(min != i) await swap(array, i, min);
        }
    }
    selectionSort(e.data)
}