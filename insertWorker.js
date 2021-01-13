
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
        await sleep(10, arr);
        arr[i].color = arr[i].startColor;
        arr[j].color = arr[j].startColor;
    }
    
    async function insertionSort(array){
        let i = 1; 
        while(i < array.length){
            let j = i;
            while(j > 0 && (array[j-1].height > array[j].height)){
                await swap(array, j, j-1);
                j = j-1;
            }
            i++;
        }
        return array;
    }
    insertionSort(e.data);
}