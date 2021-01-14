
function sleep(ms, arr){
    postMessage(arr);
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
        await sleep(0, arr);
        arr[i].color = arr[i].startColor;
        arr[j].color = arr[j].startColor;
    }
    
    async function bubbleSort(array){
        for(let end = array.length-1; end > 1; end--){
            for(let i = 0; i < end; i++){
                if(array[i].height > array[i+1].height){
                    await swap(array, i, i+1)
                }
            }
        }
        return array;
    }
    const result = await bubbleSort(e.data);
    console.log('bubble done!', result)
    postMessage(result);
    
}