
function sleep(ms, arr){
    postMessage(arr);
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
let d = []
onmessage = (e) => {
    async function mergeSort(array){
        async function merge(left, right){
            let resultArray = [], leftIndex = 0, rightIndex = 0;
            while (leftIndex < left.length && rightIndex < right.length) {

                if(resultArray.length){
                    left[leftIndex].color = 'rgb(255,0,0)';
                    right[rightIndex].color = 'rgb(0,0,255)';
                    resultArray[resultArray.length-1].color = 'rgb(0,255,0)';
                    await sleep(20, resultArray.concat(left, right));
                    left[leftIndex].color = left[leftIndex].startColor;
                    right[rightIndex].color = right[rightIndex].startColor;
                    resultArray[resultArray.length-1].color = resultArray[resultArray.length-1].startColor;
                }
                
                if (left[leftIndex].height < right[rightIndex].height) {
                    resultArray.push(left[leftIndex]);
                    leftIndex++;
                } else {
                    resultArray.push(right[rightIndex]);   
                    rightIndex++;
                }
            }
            const r = resultArray.concat(left.slice(leftIndex), right.slice(rightIndex))
            return r;
        }
        if (array.length <= 1) return array;
        const middle = Math.floor(array.length / 2);
        const left = await mergeSort(array.slice(0, middle));
        const right = await mergeSort(array.slice(middle));
        const m = await merge(left, right);
        await sleep(50, m)
        return m;
    }
    mergeSort(e.data);
}