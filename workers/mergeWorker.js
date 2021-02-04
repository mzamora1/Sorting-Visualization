
function sleep(ms, arr){
    postMessage(arr);
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
let d = []
onmessage = async (e) => {
    async function merge(left, right){
        let resultArray = [], leftIndex = 0, rightIndex = 0;
        while (leftIndex < left.length && rightIndex < right.length) {//while in bounds of each half

            if(resultArray.length){
                left[leftIndex].color = 'rgb(255,0,0)';
                right[rightIndex].color = 'rgb(0,0,255)';
                //await sleep(0, resultArray.concat(left.slice(leftIndex), right.slice(rightIndex)));
                await sleep(0, resultArray.concat(left, right));
                left[leftIndex].color = left[leftIndex].startColor;
                right[rightIndex].color = right[rightIndex].startColor;
            }
            
            if (left[leftIndex].height < right[rightIndex].height) { //fill resultArray with sorted values
                resultArray.push(left[leftIndex]);
                leftIndex++; //move to next value in left array
            } else {
                resultArray.push(right[rightIndex]);   
                rightIndex++; //move to next value in right array
            }                
        }
        return resultArray.concat(left.slice(leftIndex), right.slice(rightIndex)) //
    }
    async function mergeSort(array){
        if (array.length <= 1) return array;
        const middle = Math.floor(array.length / 2); //split array in half recursively
        const left = array.slice(0, middle);
        const right = array.slice(middle);
        return await merge(await mergeSort(left), await mergeSort(right));
    }
    const result = await mergeSort(e.data);
    console.log('merge done!', result)
    postMessage(result)
}