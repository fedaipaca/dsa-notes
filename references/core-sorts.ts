function bubbleSort(numbers: number[]) {

    for (let i = 0; i < numbers.length; i++) {
        let swapped = false;

        for (let j = 0; j < numbers.length - 1 - i; j++) {
            if (numbers[j] > numbers[j + 1]) {
                [numbers[j], numbers[j + 1]] = [numbers[j + 1], numbers[j]];
                swapped = true;
            }
        }

        if (!swapped) {
            return numbers;
        }

    }

    return numbers; // no need to return because the sort will be in place.

}

// console.log(bubbleSort([]))
// console.log(bubbleSort([1]))
// console.log(bubbleSort([1, 2]))
// console.log(bubbleSort([3, 4, 2, 1]))


function selectionSort(numbers: number[]) {
    for (let i = 0; i < numbers.length - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < numbers.length; j++) {
            if (numbers[j] < numbers[minIndex]) {
                minIndex = j;
            }
        }

        if (minIndex !== i) {
            [numbers[i], numbers[minIndex]] = [numbers[minIndex], numbers[i]]
        }
    }

    return numbers; // no need to return actually.
}


// console.log(selectionSort([]))
// console.log(selectionSort([1]))
// console.log(selectionSort([1, 2]))
// console.log(selectionSort([3, 4, 2, 1]))

function insertionSort(numbers: number[]) {
    for (let i = 1; i < numbers.length; i++) {
        let j = i - 1;
        while (j >= 0 && numbers[j + 1] < numbers[j]) {
            [numbers[j + 1], numbers[j]] = [numbers[j], numbers[j + 1]];
            j--;
        }
    }

    return numbers; // no need to retun numbers. 
}

// console.log(insertionSort([]))
// console.log(insertionSort([1]))
// console.log(insertionSort([1, 2]))
// console.log(insertionSort([3, 4, 2, 1]))


function mergeSort(numbers: number[]): number[] {
    if (numbers.length <= 1) {
        return numbers;
    }

    // divide
    const mid = Math.trunc(numbers.length / 2);

    const left = mergeSort(numbers.slice(0, mid));
    const right = mergeSort(numbers.slice(mid));

    return merge(left, right);
}

function merge(left: number[], right: number[]) {
    const result: number[] = []

    let pl = 0;
    let pr = 0;

    while (pl < left.length && pr < right.length) {
        if (left[pl] <= right[pr]) {
            result.push(left[pl]);
            pl++;
        } else {
            result.push(right[pr]);
            pr++;
        }
    }

    while (pl < left.length) {
        result.push(left[pl]);
        pl++;
    }
    while (pr < right.length) {
        result.push(right[pr]);
        pr++;
    }

    return result;
}

// console.log(mergeSort([]))
// console.log(mergeSort([1]))
// console.log(mergeSort([1, 2]))
// console.log(mergeSort([3, 4, 2, 1]))


function quickSort(numbers: number[], left = 0, right = numbers.length - 1) {
    if (left >= right) {
        return numbers;
    }
    //  5, 3, 8, 2

    const pivot = numbers[right] // last element is the pivot
    let partitionIndex = left; // partition index (writer) start from the left

    for (let i = left; i < right; i++) {
        // for each element, if it is less than pivot, then move it to the left side.
        if (numbers[i] < pivot) {
            [numbers[i], numbers[partitionIndex]] = [numbers[partitionIndex], numbers[i]];
            partitionIndex++;
        }
    }

    // after the loop above the smallest than pivot are on the left side. Then move the pivot right after them.
    // partitionIndex is at the position where pivot should be
    [numbers[partitionIndex], numbers[right]] = [numbers[right], numbers[partitionIndex]];

    // now do the same process for the left side and the right side of the partitionIndex. 
    // because partitionIndex is positioned correctly.
    quickSort(numbers, left, partitionIndex - 1);
    quickSort(numbers, partitionIndex + 1, right);


    return numbers; // no need to return because of in place logic. Doing this for testing.
}


// console.log(quickSort([]))
// console.log(quickSort([1]))
// console.log(quickSort([1, 2]))
// console.log(quickSort([3, 4, 2, 1]))


function bucketSort(numbers: number[]) {
    // Assuming numbers only contains 0, 1 or 2
    const counts = [0, 0, 0];

    // Count the quantity of each val in numbers
    for (let i = 0; i < numbers.length; i++) {
        counts[numbers[i]] += 1;
    }

    // Fill each bucket in the original numbers
    let i = 0;
    for (let n = 0; n < counts.length; n++) {
        for (let j = 0; j < counts[n]; j++) {
            numbers[i] = n;
            i++;
        }
    }
    return numbers;
}

console.log(bucketSort([]))
console.log(bucketSort([0]))
console.log(bucketSort([1]))
console.log(bucketSort([0, 1]))
console.log(bucketSort([0, 1, 0, 0, 2, 2]))
console.log(bucketSort([2, 0, 2, 1, 0, 0, 1, 2]))