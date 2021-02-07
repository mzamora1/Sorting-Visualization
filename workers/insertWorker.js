
function sleep(ms, arr){
    if(arr) postMessage(arr);
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
        //await sleep(10, arr);
        arr[i].color = arr[i].startColor;
        arr[j].color = arr[j].startColor;
    }
    
    async function insertionSort(array){
        for(let i = 0; i < array.length - 1; i++){
            for(let j = i; j >= 0; j--){
                if(array[j].height > array[j+1].height){
                    await swap(array, j, j+1);
                }
                array[j].color = array[j].startColor;
                array[i].color = array[i].startColor;
            }
            await sleep(0);
        }
        
        return array;
    }
    const reuslt = await insertionSort(e.data);
    console.log('insert done!', reuslt);
    postMessage(reuslt);
    self.close();
}