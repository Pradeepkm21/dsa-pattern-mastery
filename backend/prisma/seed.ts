// IMPORTANT SAFETY CONSTRAINT:
// This script must never delete User or UserProblemProgress data — only catalog data (PatternGroup, Pattern, Problem, ProblemPattern).
// To achieve idempotency and preserve user notes/progress, all reference data is upserted rather than wiped.

import { PrismaClient, Difficulty, ProgressStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // 1. Upsert Array Pattern Group
  let arrayGroup = await prisma.patternGroup.findUnique({
    where: { slug: 'array' },
  });
  if (!arrayGroup) {
    arrayGroup = await prisma.patternGroup.create({
      data: {
        name: 'Array',
        slug: 'array',
        description: 'Array manipulation, search, sorting, and traversal techniques.',
        displayOrder: 1,
      },
    });
  } else {
    arrayGroup = await prisma.patternGroup.update({
      where: { slug: 'array' },
      data: {
        name: 'Array',
        description: 'Array manipulation, search, sorting, and traversal techniques.',
        displayOrder: 1,
      },
    });
  }

  // 2. Upsert Linked List Pattern Group
  let linkedListGroup = await prisma.patternGroup.findUnique({
    where: { slug: 'linked-list' },
  });
  if (!linkedListGroup) {
    linkedListGroup = await prisma.patternGroup.create({
      data: {
        name: 'Linked List',
        slug: 'linked-list',
        description: 'Linked list structures, pointer manipulation, and traversal techniques.',
        displayOrder: 2,
      },
    });
  } else {
    linkedListGroup = await prisma.patternGroup.update({
      where: { slug: 'linked-list' },
      data: {
        name: 'Linked List',
        description: 'Linked list structures, pointer manipulation, and traversal techniques.',
        displayOrder: 2,
      },
    });
  }

  // 3. Create Patterns (Array + Linked List)
  const patternsData = [
    // --- ARRAY PATTERNS ---
    {
      name: 'Two Pointer',
      slug: 'two-pointer',
      groupSlug: 'array',
      triggerCue: 'Sorted input array; searching for pairs or triplets that meet a target sum/condition; shrinking search spaces from boundaries; or partition operations.',
      coreIdea: 'Initialize two pointer variables at indices of interest (often boundaries: 0 and N-1) and iteratively move them towards each other or in parallel to evaluate conditions.',
      whyItWorks: 'Relies on a monotonicity guarantee. In a sorted array, moving the left pointer rightward strictly increases the sum, and moving the right pointer leftward strictly decreases it. Similarly, for the Sliding Window subarray variant (e.g., finding a subarray with sum K), expanding the right pointer increases the running sum and shrinking the left pointer decreases it. This sum monotonicity guarantees that if the current window sum exceeds K, we can safely discard further expansions from the current left pointer because any expansion would only increase the sum. Crucially, this monotonicity holds ONLY if all elements are non-negative. If negative numbers are present, adding an element can decrease the sum and removing an element can increase it, breaking the monotonicity guarantee. In such cases, the sliding window fails, and we must fall back to the Prefix Sum + HashMap pattern, which does not rely on monotonicity.',
      codeSkeleton: `function twoPointerSearch(arr: number[], target: number): number[] {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const currentSum = arr[left] + arr[right];
    if (currentSum === target) {
      return [left, right];
    } else if (currentSum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [-1, -1];
}`,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1) (excluding sorting if sorting is required)',
      commonMistake: 'Using the two-pointer technique on unsorted arrays without sorting them first, or failing to bypass duplicate elements when advancing pointers (which causes duplicate results in multi-pair searches).',
      comparisonNotes: 'Unlike the Sliding Window which evaluates contiguous subarrays, the Two Pointer technique often evaluates non-contiguous pairs. When compared to Binary Search, Two Pointers is used when the target condition is relative to pairs/elements combinations, whereas Binary Search targets single-element locations or specific threshold decisions.',
      displayOrder: 1,
    },
    {
      name: 'Prefix Sum + HashMap',
      slug: 'prefix-sum-hashmap',
      groupSlug: 'array',
      triggerCue: 'Subarrays summing to K or a multiple of K; counting subarrays with a specific relationship; or finding subarrays with equal frequencies of two values.',
      coreIdea: 'Compute running prefix sums of the array, and store the cumulative sums along with their frequency or first occurrence index inside a hash map for constant-time lookup.',
      whyItWorks: 'The sum of elements in a contiguous subarray from index i to j is computed as Prefix[j] - Prefix[i - 1]. If we search for a subarray summing to K, we need Prefix[j] - Prefix[i - 1] = K, which rearranges to Prefix[i - 1] = Prefix[j] - K. By storing prefix sums in a HashMap, we can query if Prefix[j] - K has occurred in the past in O(1) time. To find the MAXIMUM length subarray summing to K, we must store only the FIRST occurrence index of each prefix sum in the HashMap and never overwrite it with later occurrences. This is because for a fixed endpoint j, to maximize j - (i - 1), we must minimize i - 1 (the index of the first occurrence of Prefix[j] - K). Furthermore, the HashMap must be pre-populated with {0: -1}. This represents a dummy prefix sum of 0 at index -1, ensuring that if a subarray starting exactly at index 0 sums to K (meaning Prefix[j] - K = 0), its length is correctly calculated as j - (-1) = j + 1.',
      codeSkeleton: `function subarraySum(nums: number[], k: number): number {
  const prefixMap = new Map<number, number>();
  prefixMap.set(0, 1); // Base case: prefix sum of 0 has occurred 1 time
  let runningSum = 0;
  let count = 0;
  
  for (let i = 0; i < nums.length; i++) {
    runningSum += nums[i];
    if (prefixMap.has(runningSum - k)) {
      count += prefixMap.get(runningSum - k)!;
    }
    prefixMap.set(runningSum, (prefixMap.get(runningSum) || 0) + 1);
  }
  return count;
}`,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      commonMistake: 'Forgetting to seed the Hash Map with {0: 1} (prefix sum 0 occurring once). Without this seed, subarrays that sum to K starting exactly at index 0 will not be counted, because Prefix[j] - K = 0 is not found in the map.',
      comparisonNotes: 'While Sliding Window can find subarrays summing to K in O(N) time and O(1) space, it ONLY works when all array elements are non-negative (ensuring sum monotonicity). Prefix Sum + HashMap works for negative numbers as well, trading O(N) space to overcome the loss of monotonicity.',
      displayOrder: 2,
    },
    {
      name: "Kadane's / DP on Array",
      slug: 'kadanes-algorithm',
      groupSlug: 'array',
      triggerCue: 'Maximum sum of a contiguous subarray; maximum product subarray; or finding optimal subsegment values under state transitions.',
      coreIdea: 'Iterate through the array while calculating the maximum subarray sum ending at each index, choosing whether to extend the previous subarray or start a new one.',
      whyItWorks: 'Based on optimal substructure and inductive proof. Let LocalMax[i] be the maximum sum of any contiguous subarray ending at index i. Any subarray ending at i must either consist of just nums[i] (starting a new subarray), or be an extension of a subarray ending at i-1. Thus, the search space for LocalMax[i] is defined by LocalMax[i] = max(nums[i], LocalMax[i-1] + nums[i]). This extend or restart rule is provably correct: if LocalMax[i-1] is negative, it can only decrease the sum of any subarray ending at i. Therefore, any subarray ending at i that includes elements before i will have a sum strictly less than nums[i] alone. Hence, restarting at nums[i] is the optimal decision. If LocalMax[i-1] is non-negative, adding it to nums[i] will always yield a sum greater than or equal to nums[i] alone. Thus, extending the previous optimal subarray is guaranteed to be optimal. By induction, computing this local choice at each index from 0 to N-1 covers all possible end positions of subarrays, and the global maximum of these local choices must be the absolute maximum subarray sum.',
      codeSkeleton: `function maxSubArray(nums: number[]): number {
  let globalMax = nums[0];
  let localMax = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    localMax = Math.max(nums[i], localMax + nums[i]);
    globalMax = Math.max(globalMax, localMax);
  }
  return globalMax;
}`,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      commonMistake: 'Initializing the global maximum to 0 instead of the first element of the array. If the array consists entirely of negative numbers, this incorrect initialization results in returning 0, whereas the correct maximum is the least negative single element.',
      comparisonNotes: "Kadane's is a specialized form of single-variable Dynamic Programming. When compared to the Divide and Conquer approach for maximum subarray sum (which runs in O(N log N)), Kadane's achieves O(N) complexity by carrying forward local state information instead of splitting and rebuilding subarrays.",
      displayOrder: 3,
    },
    {
      name: 'Sort + Greedy',
      slug: 'sort-greedy',
      groupSlug: 'array',
      triggerCue: 'Interval operations (merging, inserting); scheduling events; minimizing overlapping ranges; or maximizing items matching constraints.',
      coreIdea: 'Establish a globally optimal order by sorting input items (typically by start time, end time, or value) and processing them sequentially to make locally optimal choices.',
      whyItWorks: 'Sorting elements imposes a strict ordering constraint that removes the need to look back or backtrack. In interval problems, sorting by start time guarantees that for any interval i, any overlap can only occur with previous intervals or intervals adjacent in sorted order. This reduces the overlapping check from all pairs O(N^2) to adjacent pairs O(N).',
      codeSkeleton: `function mergeIntervals(intervals: number[][]): number[][] {
  if (intervals.length <= 1) return intervals;
  // Sort by start times
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [intervals[0]];
  
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const lastMerged = merged[merged.length - 1];
    
    if (current[0] <= lastMerged[1]) {
      // Overlap: merge by updating end boundary
      lastMerged[1] = Math.max(lastMerged[1], current[1]);
    } else {
      // No overlap: add new interval
      merged.push(current);
    }
  }
  return merged;
}`,
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N) (or O(log N) for sorting stack space)',
      commonMistake: 'Sorting by start times when the greedy strategy requires sorting by end times (e.g., in scheduling problems where you want to free up resources as early as possible), or failing to handle edge cases where intervals touch at boundary points.',
      comparisonNotes: 'Sort + Greedy is often compared to dynamic programming. Dynamic programming makes decisions after solving all subproblems, whereas Greedy makes the locally optimal choice immediately. Sorting is the prerequisite that enables these local choices to be globally optimal.',
      displayOrder: 4,
    },
    {
      name: 'XOR / Math Tricks',
      slug: 'xor-math-tricks',
      groupSlug: 'array',
      triggerCue: 'Finding a number that appears an odd number of times; identifying a single missing/duplicate value; or operations involving binary bit cancellations.',
      coreIdea: 'Leverage the algebraic properties of operators—particularly bitwise XOR (^) or arithmetic series formulas—to isolate target values through cancellation.',
      whyItWorks: 'Bitwise XOR is commutative (A ^ B = B ^ A) and associative (A ^ (B ^ C) = (A ^ B) ^ C). Furthermore, it satisfies two key identities: A ^ A = 0 (self-cancellation) and A ^ 0 = A (identity). Thus, if we XOR all elements in an array where every element appears exactly twice except one, the duplicates cancel out to 0, leaving only the unique element. For missing numbers in range [0, N], XORing the array with all numbers in [0, N] cancels the present numbers, isolating the missing one.',
      codeSkeleton: `function findSingleNumber(nums: number[]): number {
  let xorResult = 0;
  for (const num of nums) {
    xorResult ^= num;
  }
  return xorResult;
}`,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      commonMistake: 'Assuming XOR works when duplicate elements appear an odd number of times (like 3 or 5), or trying to use it when there are multiple distinct non-duplicate numbers, as their bits will blend and become inseparable.',
      comparisonNotes: 'XOR tricks replace the need for HashSets or HashMaps. While a HashSet can find a unique element in O(N) time and O(N) space, XOR achieves the same in O(N) time and O(1) space by utilizing hardware-level bit operations.',
      displayOrder: 5,
    },
    {
      name: 'Matrix Simulation',
      slug: 'matrix-simulation',
      groupSlug: 'array',
      triggerCue: 'Grid-based traversals (spiral, diagonal); rotating matrix cells in layers; or simulation of game grids (e.g., Conway\'s Game of Life, Minesweeper).',
      coreIdea: 'Maintain boundary variables (top, bottom, left, right) representing the unvisited grid margins, and run a structured loop to sweep through rows and columns while adjusting those boundaries.',
      whyItWorks: 'By explicitly tracking four state variables (top, bottom, left, right) that delimit the active window, we can translate complex geometric paths into sequential loops. Shrinking a boundary variable (e.g., top++) after completing a row segment prevents subsequent sweeps from re-visiting those cells, guaranteeing that each matrix element is visited exactly once.',
      codeSkeleton: `function spiralOrder(matrix: number[][]): number[] {
  const result: number[] = [];
  if (matrix.length === 0) return result;
  
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  
  while (top <= bottom && left <= right) {
    // 1. Traverse Right
    for (let i = left; i <= right; i++) result.push(matrix[top][i]);
    top++;
    
    // 2. Traverse Down
    for (let i = top; i <= bottom; i++) result.push(matrix[i][right]);
    right--;
    
    // 3. Traverse Left (with guard)
    if (top <= bottom) {
      for (let i = right; i >= left; i--) result.push(matrix[bottom][i]);
      bottom--;
    }
    
    // 4. Traverse Up (with guard)
    if (left <= right) {
      for (let i = bottom; i >= top; i--) result.push(matrix[i][left]);
      left++;
    }
  }
  return result;
}`,
      timeComplexity: 'O(N * M) where N is rows and M is columns',
      spaceComplexity: 'O(1) (excluding output array)',
      commonMistake: 'Failing to include boundary guards (like `if (top <= bottom)`) before running the leftward and upward sweeps. In non-square matrices, this omission leads to traversing rows or columns that were already processed and incremented, producing duplicate values.',
      comparisonNotes: 'Matrix Simulation is a deterministic path tracking pattern. Unlike BFS/DFS, which explore cells dynamically based on connectivity or pathfinding, simulation traverses cells in a predefined geometric pattern independent of cell contents.',
      displayOrder: 6,
    },
    {
      name: 'Merge Sort (Divide & Conquer)',
      slug: 'merge-sort-divide-conquer',
      groupSlug: 'array',
      triggerCue: 'Counting inversion pairs (i < j and A[i] > A[j]); counting modified pairs (A[i] > 2*A[j]); or sorting arrays with custom merge-time logic.',
      coreIdea: 'Recursively split the array into halves, solve the subproblems, and merge the sorted halves while counting relationships between elements in the left and right divisions.',
      whyItWorks: 'Relies on sorted sub-arrays. If we split an array into two sorted sub-arrays: Left and Right. During the merge step, if we find an element Left[i] > Right[j], it implies that all subsequent elements in the Left sub-array (from index i to the end of Left) are also greater than Right[j] because Left is sorted. This mathematical deduction allows us to count index relationships in O(1) per element, avoiding O(N^2) comparison operations.',
      codeSkeleton: `function mergeAndCount(arr: number[], temp: number[], left: number, mid: number, right: number): number {
  let i = left, j = mid + 1, k = left;
  let invCount = 0;
  
  while (i <= mid && j <= right) {
    if (arr[i] <= arr[j]) {
      temp[k++] = arr[i++];
    } else {
      temp[k++] = arr[j++];
      invCount += (mid - i + 1); // Key step: count all elements in left subarray
    }
  }
  while (i <= mid) temp[k++] = arr[i++];
  while (j <= right) temp[k++] = arr[j++];
  for (i = left; i <= right; i++) arr[i] = temp[i];
  
  return invCount;
}`,
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N) for the auxiliary merge array',
      commonMistake: 'Failing to copy the merged items back from the temporary array to the original array, or miscalculating index ranges when dividing the search space.',
      comparisonNotes: 'Merge Sort divide-and-conquer is chosen over simple nested loops for counting pairs. Simple nested loops evaluate all pairs in O(N^2) time. Merge Sort achieves O(N log N) by sorting elements, which turns search space pruning into simple index arithmetic.',
      displayOrder: 7,
    },
    {
      name: 'Binary Search on Answer',
      slug: 'binary-search-on-answer',
      groupSlug: 'array',
      triggerCue: 'Optimization problems asking to "minimize the maximum value" or "maximize the minimum value"; and a search space that exhibits a monotonic yes/no behavior.',
      coreIdea: 'Define a bound [Low, High] of all possible answers, select the middle value, validate if it is possible to achieve using a validation helper, and shrink the search range.',
      whyItWorks: 'Relies on search space monotonicity. If an answer X is possible, then for a minimization problem, all values Y > X are also guaranteed to be possible. Conversely, if X is impossible, all values Y < X are also impossible. This binary transition (No, No, No, Yes, Yes, Yes) allows us to perform a binary search on the range of answers, finding the boundary value in O(log(Range)) steps.',
      codeSkeleton: `function shipWithinDays(weights: number[], days: number): number {
  let low = Math.max(...weights);
  let high = weights.reduce((a, b) => a + b, 0);
  let ans = high;
  
  function canShip(capacity: number): boolean {
    let currentWeight = 0, currentDays = 1;
    for (const w of weights) {
      if (currentWeight + w > capacity) {
        currentDays++;
        currentWeight = w;
      } else {
        currentWeight += w;
      }
    }
    return currentDays <= days;
  }
  
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (canShip(mid)) {
      ans = mid;
      high = mid - 1; // Try to find a smaller valid capacity
    } else {
      low = mid + 1;  // Increase capacity
    }
  }
  return ans;
}`,
      timeComplexity: 'O(N * log(High - Low)) where N is the array size and High-Low is the search space range',
      spaceComplexity: 'O(1)',
      commonMistake: 'Setting the low and high boundaries incorrectly (e.g., setting low to 0 instead of the maximum single element weight), which results in invalid configurations during feasibility checks.',
      comparisonNotes: 'Unlike standard Binary Search which searches for an index in a sorted array, Binary Search on Answer searches for a threshold value across an arbitrary logical scale. The input array does not need to be sorted; only the feasibility of the answer range must be monotonic.',
      displayOrder: 8,
    },
    {
      name: 'Monotonic Stack / Queue',
      slug: 'monotonic-stack-queue',
      groupSlug: 'array',
      triggerCue: 'Finding the next greater or previous smaller element; calculating the maximum area in a histogram; or tracking the maximum element in a sliding window.',
      coreIdea: 'Maintain a stack or double-ended queue whose elements are kept in strictly increasing or decreasing order of values by popping elements that violate this ordering before pushing the new element.',
      whyItWorks: 'Prunes redundant candidates. If we are looking for the next greater element, and we encounter a new element nums[i] that is larger than the element at the top of the stack, it means nums[i] is the next greater element for those stack items. Those items are resolved and popped. This ensures that every element is pushed onto the stack once and popped at most once, reducing an O(N^2) lookahead check to O(N) amortized time.',
      codeSkeleton: `function nextGreaterElement(nums: number[]): number[] {
  const result: number[] = new Array(nums.length).fill(-1);
  const stack: number[] = []; // Stores indices
  
  for (let i = 0; i < nums.length; i++) {
    while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {
      const idx = stack.pop()!;
      result[idx] = nums[i];
    }
    stack.push(i);
  }
  return result;
}`,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      commonMistake: 'Storing values inside the stack instead of index numbers. Storing indices is crucial because it allows us to calculate relative widths (distance between elements) and write values back to correct positions in the result array.',
      comparisonNotes: 'Monotonic Stack is a spatial comparison optimizer. While a nested loop checks all elements ahead (O(N^2)), a Monotonic Stack dynamically discards elements that have been overridden, meaning we only compare against a small, sorted active subset.',
      displayOrder: 9,
    },
    {
      name: 'Cyclic Sort',
      slug: 'cyclic-sort',
      groupSlug: 'array',
      triggerCue: 'Unsorted array containing numbers strictly in a range from 1 to N (or 0 to N); finding missing, duplicate, or misplaced integers.',
      coreIdea: 'Iterate through the array. For each element, check if it is at its correct index (i.e. number X belongs at index X-1). If not, swap it with the element at its target index. Repeat this check until the element is correct before moving to the next index.',
      whyItWorks: 'Based on the invariant of cycle decomposition in permutations. Any permutation of N elements can be decomposed into a set of disjoint cycles. The cyclic sort algorithm works by traversing the array and resolving these cycles. For any misplaced element nums[i], we swap it with the element at its correct index correctIdx = nums[i] - 1. Each swap is guaranteed to place at least one element in its final sorted position. Once an element is placed at its correct position, the size of the remaining unsorted cycles decreases by 1. Since there are at most N elements, the algorithm performs at most N - 1 swaps before all cycles are resolved (elements are at their correct index), ensuring termination in O(N) operations. To handle duplicates without infinite looping, we check the condition nums[i] !== nums[correctIdx]. If the element we want to swap is identical to the element already at the target index (i.e. nums[i] === nums[nums[i]-1]), we do not swap (since swapping would not progress the cycle resolution). Instead, we simply increment our pointer i++, successfully breaking what would otherwise be an infinite cycle loop.',
      codeSkeleton: `function cyclicSort(nums: number[]): void {
  let i = 0;
  while (i < nums.length) {
    const correctIdx = nums[i] - 1;
    if (nums[i] > 0 && nums[i] <= nums.length && nums[i] !== nums[correctIdx]) {
      const temp = nums[i];
      nums[i] = nums[correctIdx];
      nums[correctIdx] = temp;
    } else {
      i++;
    }
  }
}`,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      commonMistake: 'Incrementing the index counter `i` inside a standard `for` loop. If you increment the counter before checking the swapped element, you will skip checking the new element that was swapped into index `i`, leaving it unsorted.',
      comparisonNotes: 'Standard sorting algorithms (QuickSort, MergeSort) require O(N log N) time because they make comparison-based decisions. Cyclic Sort achieves O(N) by exploiting the value-to-index mapping constraint present in range-bound arrays.',
      displayOrder: 10,
    },
    {
      name: 'In-place Hashing / Index Marking',
      slug: 'in-place-hashing',
      groupSlug: 'array',
      triggerCue: 'Finding duplicates or missing numbers in an array of size N where all elements are positive and lie in the range [1, N]; modifying a matrix under constraints without using extra space.',
      coreIdea: 'Use the absolute values of the array elements as indices, and negate the elements at those target indices to mark that the corresponding index has been seen.',
      whyItWorks: 'Leverages the sign bit as a separate Boolean indicator. Since all valid elements are positive integers and lie within the array bounds [1, N], we can mark a number X as "seen" by negating the value at index X-1. The original number remains recoverable by taking the absolute value `Math.abs(nums[i])`, while the sign (positive/negative) acts as an in-place Boolean flag, eliminating the need for an external Boolean array.',
      codeSkeleton: `function findDuplicates(nums: number[]): number[] {
  const duplicates: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    const targetIdx = Math.abs(nums[i]) - 1;
    if (nums[targetIdx] < 0) {
      duplicates.push(targetIdx + 1);
    } else {
      nums[targetIdx] = -nums[targetIdx];
    }
  }
  return duplicates;
}`,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1) auxiliary space',
      commonMistake: 'Forgetting to use `Math.abs(nums[i])` when reading the current element. If a prior step negated `nums[i]`, resolving the index without taking its absolute value will lead to an out-of-bounds array access index.',
      comparisonNotes: 'Like Cyclic Sort, In-place Hashing operates in O(N) time and O(1) space. However, Cyclic Sort actively reorders elements by swapping them, whereas In-place Hashing leaves elements in their original positions and uses signs to record occurrences.',
      displayOrder: 11,
    },
    {
      name: 'Event Line / Sweep',
      slug: 'event-line-sweep',
      groupSlug: 'array',
      triggerCue: 'Finding the maximum number of overlapping intervals; calculating active resource consumption on a timeline; or checking interval intersections.',
      coreIdea: 'Convert intervals into discrete boundary events (start events and end events), sort these events chronologically, and sweep through them while maintaining a running sum of active overlaps.',
      whyItWorks: 'Translates 2D interval intersections into a 1D running prefix sum. Each interval starting at T1 and ending at T2 is represented as a point source `+1` at T1 and a point sink `-1` at T2. Sorting these events ensures we process timeline changes in chronological order. Sweeping through the sorted events and tracking the cumulative sum yields the exact number of active intervals at any point in time.',
      codeSkeleton: `interface EventPoint {
  time: number;
  type: number;
}

function minMeetingRooms(intervals: number[][]): number {
  const events: EventPoint[] = [];
  for (const interval of intervals) {
    events.push({ time: interval[0], type: 1 });
    events.push({ time: interval[1], type: -1 });
  }
  events.sort((a, b) => a.time - b.time || a.type - b.type);
  let activeRooms = 0;
  let maxRooms = 0;
  for (const event of events) {
    activeRooms += event.type;
    maxRooms = Math.max(maxRooms, activeRooms);
  }
  return maxRooms;
}`,
      timeComplexity: 'O(N log N) due to sorting',
      spaceComplexity: 'O(N) to store events',
      commonMistake: 'Sorting event points solely by time without a tie-breaker. If a start event and an end event occur at the same time, processing the start (+1) before the end (-1) will create a temporary, incorrect peak value in overlaps.',
      comparisonNotes: 'Event Line / Sweep is a coordinate projection pattern. Unlike Greedy interval merging (which maintains active interval windows and resolves them pairwise), Sweep Line flattens intervals into a sequence of points, turning overlap detection into a cumulative counter.',
      displayOrder: 12,
    },

    // --- LINKED LIST PATTERNS ---
    {
      name: 'Fast & Slow Pointer (Tortoise and Hare)',
      slug: 'fast-slow-pointer',
      groupSlug: 'linked-list',
      triggerCue: 'Cycle detection; finding the middle node of a list; finding the k-th node from the end of a list.',
      coreIdea: 'Traverse the list with two pointers moving at different speeds (usually the fast pointer advances by two nodes per step while the slow pointer advances by one node).',
      whyItWorks: 'Relies on relative speed propagation in a closed loop. If a cycle of length C exists, once both pointers enter the cycle, the fast pointer is at a relative distance D (0 <= D < C) behind the slow pointer. In each step, the slow pointer advances by 1 node and the fast pointer advances by 2. The relative distance between them decreases by exactly 2 - 1 = 1 node per step. Because the distance decreases monotonically by exactly 1 in each step (modulo C), the distance must eventually shrink to 0. This mathematically guarantees that the fast pointer will catch the slow pointer within at most C steps after both enter the loop, preventing an infinite traversal.',
      codeSkeleton: `function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) {
      return true;
    }
  }
  return false;
}`,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      commonMistake: 'Accessing fast.next.next when fast or fast.next is null, leading to runtime type errors.',
      comparisonNotes: 'Unlike iterative traversal with a HashSet (which finds cycle nodes by storing node references in O(N) memory), the Tortoise and Hare algorithm achieves cycle detection in O(1) space by trading off lookup time for mechanical speed differentials.',
      displayOrder: 1,
    },
    {
      name: 'Reversal (In-place)',
      slug: 'in-place-reversal',
      groupSlug: 'linked-list',
      triggerCue: 'Reversing a whole list; reversing a contiguous subsegment of a list; or reversing alternate nodes.',
      coreIdea: 'Mutate the next pointers of list nodes dynamically to point to their predecessors using three tracking pointers (prev, curr, next).',
      whyItWorks: 'In a singly linked list, each node contains a reference only to its successor. Modifying a node\'s pointer in-place (curr.next = prev) immediately breaks the link pointing forward. Without keeping a reference to the remaining unreversed portion of the list, we lose access to the rest of the list. To preserve reference continuity, we maintain a three-pointer invariant: \'prev\' tracks the reversed sublist head, \'curr\' is the active node being mutated, and \'nextTemp\' is a temporary variable storing curr.next before mutation. This allows us to reassign curr.next to prev and then advance the pointers to the rest of the list safely in O(1) auxiliary space.',
      codeSkeleton: `function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;
  while (curr) {
    const nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      commonMistake: 'Forgetting to update the final head of the list to the last non-null node (prev), or failing to sever the tail node\'s original forward link, resulting in cyclic loops.',
      comparisonNotes: 'While a recursive stack reversal is elegant, in-place pointer manipulation is preferred for large lists to prevent memory overhead and potential Stack Overflow errors.',
      displayOrder: 2,
    },
    {
      name: 'Merge Two Sorted Lists',
      slug: 'merge-sorted-lists',
      groupSlug: 'linked-list',
      triggerCue: 'Merging two sorted linked lists; sorting a list using Merge Sort; or interleaving sorted lists.',
      coreIdea: 'Iteratively compare the head nodes of two sorted lists, append the smaller node to the end of the new merged list, and advance that list\'s pointer.',
      whyItWorks: 'Sorted list merging relies on structural comparison. At any stage, the smallest element of the remaining sorted lists must be at the head of one of the two input lists. By comparing the heads, we greedily build the merged list. Using a dummy head node simplifies this by establishing a non-null, permanent anchor. This eliminates the need for separate conditional branches to initialize the head and tail pointers of the merged list, allowing all updates to use a uniform tail.next assignment. Once one list is exhausted, we attach the remaining sorted list in O(1) time by linking the tail directly to it.',
      codeSkeleton: `function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(-1);
  let tail = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      tail.next = l1;
      l1 = l1.next;
    } else {
      tail.next = l2;
      l2 = l2.next;
    }
    tail = tail.next;
  }
  tail.next = l1 || l2;
  return dummy.next;
}`,
      timeComplexity: 'O(N + M)',
      spaceComplexity: 'O(1)',
      commonMistake: 'Failing to advance the tail pointer after appending a node, which results in overwriting the same node repeatedly.',
      comparisonNotes: 'Unlike array merging which requires allocating a new array of size N+M, linked list merging is done in-place by mutating existing pointers, requiring only O(1) auxiliary space.',
      displayOrder: 3,
    },
    {
      name: 'Dummy Node Technique',
      slug: 'dummy-node-technique',
      groupSlug: 'linked-list',
      triggerCue: 'Deleting elements matching a value; removing the nth node from the end; or partitioning a list around a pivot.',
      coreIdea: 'Prepend a temporary sentinel (dummy) node before the real head of the list, perform manipulations relative to this node, and return dummy.next.',
      whyItWorks: 'Modifying a singly linked list node (deletion or insertion) requires modifying its predecessor\'s next pointer. However, the first node (head) has no predecessor. Therefore, operations affecting the head node (e.g. deleting it, or inserting before it) require separate conditional check branches. Prepending a dummy node guarantees that every node, including the original head, has a predecessor. This allows us to apply the same mutation logic to the entire list uniformly without branching, and return the modified head via dummy.next.',
      codeSkeleton: `function removeElements(head: ListNode | null, val: number): ListNode | null {
  const dummy = new ListNode(-1);
  dummy.next = head;
  let prev = dummy;
  let curr = head;
  while (curr) {
    if (curr.val === val) {
      prev.next = curr.next;
    } else {
      prev = curr;
    }
    curr = curr.next;
  }
  return dummy.next;
}`,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      commonMistake: 'Returning the dummy node itself instead of dummy.next, or leaving memory uncleaned in environments without automatic garbage collection.',
      comparisonNotes: 'Using a dummy node is the standard approach to prevent boundary errors and code bloating when the head of a list is subject to change.',
      displayOrder: 4,
    },
    {
      name: 'Cycle Detection & Cycle Start (Floyd\'s)',
      slug: 'cycle-detection-start',
      groupSlug: 'linked-list',
      triggerCue: 'Finding the cycle start node; finding the duplicate number where elements form a cycle of pointers.',
      coreIdea: 'Use Floyd\'s tortoise and hare speed differential to detect a meeting point. Once met, reset one pointer to the head of the list, advance both at a speed of 1 step, and they will meet at the cycle start.',
      whyItWorks: 'Let L be the distance from list head to cycle start. Let C be cycle length. Let the pointers meet at distance X from the cycle start (inside the cycle). The slow pointer travels S = L + k1*C + X steps. The fast pointer travels F = L + k2*C + X steps. Since fast travels twice as fast as slow: F = 2*S => L + k2*C + X = 2*(L + k1*C + X) => L + X = (k2 - 2*k1)*C. This means L = M*C - X = (M - 1)*C + (C - X). The distance C - X is the remaining distance from the meeting point back to the cycle start. This equation shows that the distance L from the head to the cycle start is mathematically equivalent to traversing (M-1) full cycle loops plus the remaining distance C-X from the meeting point. Therefore, if we reset one pointer to the head and leave the other at the meeting point X, and advance both at the same speed of 1 step per iteration, they must meet precisely at the cycle start node.',
      codeSkeleton: `function detectCycle(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) {
      let entry = head;
      while (entry !== slow) {
        entry = entry!.next;
        slow = slow!.next;
      }
      return entry;
    }
  }
  return null;
}`,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      commonMistake: 'Resetting the wrong pointer or advancing them at incorrect speeds in the second traversal phase.',
      comparisonNotes: 'Cycle start detection is an extension of simple cycle detection. It relies on the identical distance arithmetic of the modular loop coordinates.',
      displayOrder: 5,
    },
    {
      name: 'Recursive vs Iterative Traversal',
      slug: 'recursive-vs-iterative',
      groupSlug: 'linked-list',
      triggerCue: 'Checking list palindrome properties; printing lists backward; or recursive node sorting/reconstruction.',
      coreIdea: 'Utilize the system call stack via recursion to traverse the list in post-order (backward), or use iteration with an auxiliary stack or pointer mutations.',
      whyItWorks: 'Because singly linked lists only have links in the forward direction, traversing them backward iteratively requires reversing them or allocating space. Recursion naturally builds a stack of activation records. As the recursive function calls itself, it advances to the tail. Once the base case is reached, the stack frames unwind in reverse order. This allows us to compare or process nodes from tail to head (e.g. comparing the left pointer, moved forward iteratively, with the right pointer, returning via recursive stack unwinding). However, recursion uses O(N) stack memory. For long lists, this can cause a Stack Overflow. Iteration avoids this by using pointer mutation (like reversing the second half in-place) or an explicit stack array in heap memory.',
      codeSkeleton: `function isPalindrome(head: ListNode | null): boolean {
  let left = head;
  function check(right: ListNode | null): boolean {
    if (!right) return true;
    const isSubPal = check(right.next);
    if (!isSubPal) return false;
    const isEqual = left!.val === right.val;
    left = left!.next;
    return isEqual;
  }
  return check(head);
}`,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N) due to stack depth',
      commonMistake: 'Neglecting stack size limitations on very large lists, or failing to pass return flags correctly through recursive levels.',
      comparisonNotes: 'Recursive solutions are elegant and require no manual pointer mutation, but iterative solutions with pointer reversals are preferred in production for O(1) space efficiency.',
      displayOrder: 6,
    },
    {
      name: 'Intersection of Two Lists (Offset Pointers)',
      slug: 'intersection-offset-pointers',
      groupSlug: 'linked-list',
      triggerCue: 'Finding the meeting node of two intersecting lists; common parent pointer intersections.',
      coreIdea: 'Determine the lengths of both lists, calculate length difference D, advance the longer list pointer by D steps to align them, then advance both at speed 1 until they meet.',
      whyItWorks: 'Let List A have a non-shared head length A, List B have non-shared head length B, and they share a tail of length C. The total lengths are A+C and B+C. The length difference is (A+C) - (B+C) = A-B. By advancing the pointer on the longer list (e.g. List A) by D = |A-B| steps, the remaining distances to the intersection node are equalized: A - D = B. Advancing both at speed 1 from this aligned state guarantees they meet at the intersection node. Alternatively, in the pointer-swapping approach, pointer pA traverses List A and redirects to head B (distance A+C+B), and pB traverses List B and redirects to head A (distance B+C+A). Since A+C+B = B+C+A, they cover the exact same total distance and must meet at the intersection node during the second traversal.',
      codeSkeleton: `function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {
  if (!headA || !headB) return null;
  let pA: ListNode | null = headA;
  let pB: ListNode | null = headB;
  while (pA !== pB) {
    pA = pA ? pA.next : headB;
    pB = pB ? pB.next : headA;
  }
  return pA;
}`,
      timeComplexity: 'O(N + M)',
      spaceComplexity: 'O(1)',
      commonMistake: 'Failing to redirect to the opposite head when reaching null, or using pA.next instead of pA to check null (which prevents them from reaching null simultaneously to terminate when there is no intersection).',
      displayOrder: 7,
    },
    {
      name: 'Sliding Window',
      slug: 'sliding-window',
      groupSlug: 'array',
      triggerCue: 'Recognition signals: "subarray", "contiguous", "maximum/minimum of subarray", "longest/shortest subarray satisfying condition", "window of size K". Critical constraint check: "are all elements non-negative?" → if yes, sliding window is safe; if negatives possible → use prefix sum + hashmap instead.',
      coreIdea: 'Two pointers (left, right) define a window. Right pointer expands the window by moving forward. When the window violates the target condition, left pointer shrinks it. Track the optimal (max/min) window size during traversal. Fixed window: right - left + 1 == K always. Variable window: shrink until condition is restored.',
      whyItWorks: '1. Monotonicity guarantee: In a non-negative array, adding an element to the window can only increase (or maintain) the sum, and removing an element can only decrease it. This one-directional property means when the sum exceeds the target, shrinking from the left is guaranteed to help — there is no need to check all possible windows.\n2. Negative numbers failure: Adding a negative element decreases the sum even as the window grows, so "sum > target" no longer means "shrinking left will fix it" — the shrink might make things worse. This is why sliding window requires non-negative values.\n3. O(n) Time Complexity: Each element is added to the window exactly once (when right passes it) and removed at most once (when left passes it). Total operations across the entire traversal are at most 2n, yielding O(n) regardless of how many times the inner loop runs.\n4. Fixed vs Variable: For fixed window (size K), left = right - K + 1 always, so no shrink condition is needed — just slide right and left together. For variable window, left only moves when the condition is violated, relying on the monotonicity guarantee.',
      codeSkeleton: `// Fixed window (size K)
left = 0, windowSum = 0, maxSum = 0
for right in range(n):
    windowSum += arr[right]
    if right >= K - 1:
        maxSum = max(maxSum, windowSum)
        windowSum -= arr[left]
        left++

// Variable window (find longest/shortest satisfying condition)
left = 0, windowSum = 0, result = 0
for right in range(n):
    windowSum += arr[right]
    while windowSum > target:   // shrink condition
        windowSum -= arr[left]
        left++
    result = max(result, right - left + 1)`,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1) for basic sum problems; O(k) when using a frequency map or deque (e.g. Minimum Window Substring, Sliding Window Maximum)',
      commonMistake: '1. Using sliding window when negatives are present — the correct fallback is prefix sum + hashmap.\n2. For variable window, updating the result BEFORE shrinking the window rather than AFTER, which records an invalid window size.',
      comparisonNotes: "Use Sliding Window over Two Pointer when the problem involves a contiguous subarray/window and the answer is about the window's aggregate property (sum, max, count). Use Two Pointer when the problem involves finding pairs/triplets or operating on sorted arrays from both ends. Both are O(n)/O(1) — the choice is about problem structure, not efficiency.",
      displayOrder: 13,
    },
  ];

  const dbPatterns: { [key: string]: string } = {};

  for (const p of patternsData) {
    const groupId = p.groupSlug === 'array' ? arrayGroup.id : linkedListGroup.id;
    let existingPattern = await prisma.pattern.findUnique({
      where: { slug: p.slug },
    });
    if (existingPattern) {
      existingPattern = await prisma.pattern.update({
        where: { slug: p.slug },
        data: {
          patternGroupId: groupId,
          name: p.name,
          triggerCue: p.triggerCue,
          coreIdea: p.coreIdea,
          whyItWorks: p.whyItWorks,
          codeSkeleton: p.codeSkeleton,
          timeComplexity: p.timeComplexity,
          spaceComplexity: p.spaceComplexity,
          commonMistake: p.commonMistake,
          comparisonNotes: p.comparisonNotes,
          displayOrder: p.displayOrder,
        },
      });
    } else {
      existingPattern = await prisma.pattern.create({
        data: {
          patternGroupId: groupId,
          name: p.name,
          slug: p.slug,
          triggerCue: p.triggerCue,
          coreIdea: p.coreIdea,
          whyItWorks: p.whyItWorks,
          codeSkeleton: p.codeSkeleton,
          timeComplexity: p.timeComplexity,
          spaceComplexity: p.spaceComplexity,
          commonMistake: p.commonMistake,
          comparisonNotes: p.comparisonNotes,
          displayOrder: p.displayOrder,
        },
      });
    }
    dbPatterns[p.slug] = existingPattern.id;
  }

  console.log('Seeded patterns successfully.');

  // 4. Create Problems (Unique rows - Array + Linked List)
  const problemsData = [
    // --- ARRAY PROBLEMS (p1 to p57) ---
    { id: 'p1', title: 'Two Sum', leetcodeUrl: 'https://leetcode.com/problems/two-sum/', leetcodeProblemNumber: 1, difficulty: Difficulty.EASY, descriptionShort: 'Find two numbers that add up to a specific target.' },
    { id: 'p2', title: '3Sum', leetcodeUrl: 'https://leetcode.com/problems/3sum/', leetcodeProblemNumber: 15, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find all unique triplets in the array that sum to zero.' },
    { id: 'p3', title: 'Container With Most Water', leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/', leetcodeProblemNumber: 11, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find two lines that together with the x-axis forms a container containing the most water.' },
    { id: 'p4', title: 'Remove Duplicates from Sorted Array', leetcodeUrl: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', leetcodeProblemNumber: 26, difficulty: Difficulty.EASY, descriptionShort: 'Remove duplicates in-place such that each unique element appears only once.' },
    { id: 'p5', title: 'Subarray Sum Equals K', leetcodeUrl: 'https://leetcode.com/problems/subarray-sum-equals-k/', leetcodeProblemNumber: 560, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the total number of continuous subarrays whose sum equals to k.' },
    { id: 'p6', title: 'Subarray Sums Divisible by K', leetcodeUrl: 'https://leetcode.com/problems/subarray-sums-divisible-by-k/', leetcodeProblemNumber: 974, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the number of non-empty subarrays that have a sum divisible by k.' },
    { id: 'p7', title: 'Contiguous Array', leetcodeUrl: 'https://leetcode.com/problems/contiguous-array/', leetcodeProblemNumber: 525, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the maximum length of a contiguous subarray with an equal number of 0 and 1.' },
    { id: 'p8', title: 'Range Sum Query - Immutable', leetcodeUrl: 'https://leetcode.com/problems/range-sum-query-immutable/', leetcodeProblemNumber: 303, difficulty: Difficulty.EASY, descriptionShort: 'Calculate the sum of the elements of an array between indices left and right inclusive.' },
    { id: 'p9', title: 'Maximum Subarray', leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/', leetcodeProblemNumber: 53, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the contiguous subarray which has the largest sum and return its sum.' },
    { id: 'p10', title: 'Maximum Product Subarray', leetcodeUrl: 'https://leetcode.com/problems/maximum-product-subarray/', leetcodeProblemNumber: 152, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find a contiguous non-empty subarray within a numeric array that has the largest product.' },
    { id: 'p11', title: 'Best Time to Buy and Sell Stock', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', leetcodeProblemNumber: 121, difficulty: Difficulty.EASY, descriptionShort: 'Maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.' },
    { id: 'p12', title: 'Merge Intervals', leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/', leetcodeProblemNumber: 56, difficulty: Difficulty.MEDIUM, descriptionShort: 'Merge all overlapping intervals.' },
    { id: 'p13', title: 'Non-overlapping Intervals', leetcodeUrl: 'https://leetcode.com/problems/non-overlapping-intervals/', leetcodeProblemNumber: 435, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.' },
    { id: 'p14', title: 'Minimum Number of Arrows to Burst Balloons', leetcodeUrl: 'https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/', leetcodeProblemNumber: 452, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the minimum number of arrows that must be shot to burst all balloons.' },
    { id: 'p15', title: 'Single Number', leetcodeUrl: 'https://leetcode.com/problems/single-number/', leetcodeProblemNumber: 136, difficulty: Difficulty.EASY, descriptionShort: 'Find the single element in an array where every other element appears twice.' },
    { id: 'p16', title: 'Missing Number', leetcodeUrl: 'https://leetcode.com/problems/missing-number/', leetcodeProblemNumber: 268, difficulty: Difficulty.EASY, descriptionShort: 'Find the only number in the range [0, n] that is missing from the array.' },
    { id: 'p17', title: 'Find the Duplicate Number', leetcodeUrl: 'https://leetcode.com/problems/find-the-duplicate-number/', leetcodeProblemNumber: 287, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the duplicate number in an array containing n + 1 integers where each integer is in the range [1, n].' },
    { id: 'p18', title: 'Spiral Matrix', leetcodeUrl: 'https://leetcode.com/problems/spiral-matrix/', leetcodeProblemNumber: 54, difficulty: Difficulty.MEDIUM, descriptionShort: 'Return all elements of the matrix in spiral order.' },
    { id: 'p19', title: 'Rotate Image', leetcodeUrl: 'https://leetcode.com/problems/rotate-image/', leetcodeProblemNumber: 48, difficulty: Difficulty.MEDIUM, descriptionShort: 'Rotate a 2D image matrix by 90 degrees clockwise in-place.' },
    { id: 'p20', title: 'Set Matrix Zeroes', leetcodeUrl: 'https://leetcode.com/problems/set-matrix-zeroes/', leetcodeProblemNumber: 73, difficulty: Difficulty.MEDIUM, descriptionShort: 'If an element in an m x n matrix is 0, set its entire row and column to 0 in-place.' },
    { id: 'p21', title: 'Reverse Pairs', leetcodeUrl: 'https://leetcode.com/problems/reverse-pairs/', leetcodeProblemNumber: 493, difficulty: Difficulty.HARD, descriptionShort: 'Given an integer array, return the number of reverse pairs in the array.' },
    { id: 'p22', title: 'Count of Smaller Numbers After Self', leetcodeUrl: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self/', leetcodeProblemNumber: 315, difficulty: Difficulty.HARD, descriptionShort: 'Return an integer array counts where counts[i] is the number of smaller elements to the right of nums[i].' },
    { id: 'p23', title: 'Sort an Array', leetcodeUrl: 'https://leetcode.com/problems/sort-an-array/', leetcodeProblemNumber: 912, difficulty: Difficulty.MEDIUM, descriptionShort: 'Sort an array of integers in ascending order using O(n log n) time.' },
    { id: 'p24', title: 'Koko Eating Bananas', leetcodeUrl: 'https://leetcode.com/problems/koko-eating-bananas/', leetcodeProblemNumber: 875, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the minimum integer speed K to eat all bananas within H hours.' },
    { id: 'p25', title: 'Split Array Largest Sum', leetcodeUrl: 'https://leetcode.com/problems/split-array-largest-sum/', leetcodeProblemNumber: 410, difficulty: Difficulty.HARD, descriptionShort: 'Split an array into m non-empty continuous subarrays such that the minimized maximum sum is found.' },
    { id: 'p26', title: 'Capacity To Ship Packages Within D Days', leetcodeUrl: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/', leetcodeProblemNumber: 1011, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the least weight capacity of a ship that will result in all the packages on the conveyor belt being shipped within D days.' },
    { id: 'p27', title: 'Next Greater Element I', leetcodeUrl: 'https://leetcode.com/problems/next-greater-element-i/', leetcodeProblemNumber: 496, difficulty: Difficulty.EASY, descriptionShort: 'Find the next greater element for each value in a subset array.' },
    { id: 'p28', title: 'Largest Rectangle in Histogram', leetcodeUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', leetcodeProblemNumber: 84, difficulty: Difficulty.HARD, descriptionShort: 'Find the area of the largest rectangle in a histogram.' },
    { id: 'p29', title: 'Sliding Window Maximum', leetcodeUrl: 'https://leetcode.com/problems/sliding-window-maximum/', leetcodeProblemNumber: 239, difficulty: Difficulty.HARD, descriptionShort: 'Find the maximum value inside each sliding window of size K.' },
    { id: 'p30', title: 'Find All Numbers Disappeared in an Array', leetcodeUrl: 'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/', leetcodeProblemNumber: 448, difficulty: Difficulty.EASY, descriptionShort: 'Find all the elements of [1, n] inclusive that do not appear in an array.' },
    { id: 'p31', title: 'First Missing Positive', leetcodeUrl: 'https://leetcode.com/problems/first-missing-positive/', leetcodeProblemNumber: 41, difficulty: Difficulty.HARD, descriptionShort: 'Find the smallest missing positive integer in an unsorted integer array.' },
    { id: 'p32', title: 'Find All Duplicates in an Array', leetcodeUrl: 'https://leetcode.com/problems/find-all-duplicates-in-an-array/', leetcodeProblemNumber: 442, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find all elements that appear twice in an array of integers.' },
    { id: 'p33', title: 'Car Pooling', leetcodeUrl: 'https://leetcode.com/problems/car-pooling/', leetcodeProblemNumber: 1094, difficulty: Difficulty.MEDIUM, descriptionShort: 'Determine if it is possible to pick up and drop off all passengers without exceeding capacity.' },
    { id: 'p34', title: 'My Calendar Three', leetcodeUrl: 'https://leetcode.com/problems/my-calendar-iii/', leetcodeProblemNumber: 732, difficulty: Difficulty.HARD, descriptionShort: 'Find the maximum k-booking that can be made in the calendar.' },
    { id: 'p35', title: 'Sort Colors', leetcodeUrl: 'https://leetcode.com/problems/sort-colors/', leetcodeProblemNumber: 75, difficulty: Difficulty.MEDIUM, descriptionShort: 'Sort an array of red, white, and blue objects in-place.' },
    { id: 'p36', title: 'Trapping Rain Water', leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/', leetcodeProblemNumber: 42, difficulty: Difficulty.HARD, descriptionShort: 'Compute how much water can be trapped after raining.' },
    { id: 'p37', title: 'Continuous Subarray Sum', leetcodeUrl: 'https://leetcode.com/problems/continuous-subarray-sum/', leetcodeProblemNumber: 523, difficulty: Difficulty.MEDIUM, descriptionShort: 'Check if the array has a continuous subarray of size at least two whose sum is a multiple of k.' },
    { id: 'p38', title: 'Product of Array Except Self', leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/', leetcodeProblemNumber: 238, difficulty: Difficulty.MEDIUM, descriptionShort: 'Return an array such that each element is equal to the product of all elements except itself.' },
    { id: 'p39', title: 'Maximum Sum Circular Subarray', leetcodeUrl: 'https://leetcode.com/problems/maximum-sum-circular-subarray/', leetcodeProblemNumber: 918, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the maximum possible sum of a non-empty contiguous subarray in a circular array.' },
    { id: 'p40', title: 'House Robber', leetcodeUrl: 'https://leetcode.com/problems/house-robber/', leetcodeProblemNumber: 198, difficulty: Difficulty.MEDIUM, descriptionShort: 'Maximize the amount of money you can rob tonight without alerting the police.' },
    { id: 'p41', title: 'Insert Interval', leetcodeUrl: 'https://leetcode.com/problems/insert-interval/', leetcodeProblemNumber: 57, difficulty: Difficulty.MEDIUM, descriptionShort: 'Insert a new interval into a sorted list of non-overlapping intervals.' },
    { id: 'p42', title: 'Interval List Intersections', leetcodeUrl: 'https://leetcode.com/problems/interval-list-intersections/', leetcodeProblemNumber: 986, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the intersection of two sorted lists of closed intervals.' },
    { id: 'p43', title: 'Single Number II', leetcodeUrl: 'https://leetcode.com/problems/single-number-ii/', leetcodeProblemNumber: 137, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the single element in an array where every other element appears three times.' },
    { id: 'p44', title: 'Single Number III', leetcodeUrl: 'https://leetcode.com/problems/single-number-iii/', leetcodeProblemNumber: 260, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the two elements that appear only once in an array where every other element appears twice.' },
    { id: 'p45', title: 'Diagonal Traverse', leetcodeUrl: 'https://leetcode.com/problems/diagonal-traverse/', leetcodeProblemNumber: 498, difficulty: Difficulty.MEDIUM, descriptionShort: 'Return all elements of the matrix in diagonal order.' },
    { id: 'p46', title: 'Game of Life', leetcodeUrl: 'https://leetcode.com/problems/game-of-life/', leetcodeProblemNumber: 289, difficulty: Difficulty.MEDIUM, descriptionShort: 'Simulate the next state of Conways Game of Life board in-place.' },
    { id: 'p47', title: 'Global and Local Inversions', leetcodeUrl: 'https://leetcode.com/problems/global-and-local-inversions/', leetcodeProblemNumber: 775, difficulty: Difficulty.MEDIUM, descriptionShort: 'Check if the number of global inversions is equal to the number of local inversions.' },
    { id: 'p48', title: 'Maximum Gap', leetcodeUrl: 'https://leetcode.com/problems/maximum-gap/', leetcodeProblemNumber: 164, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the maximum difference between successive elements in its sorted form in linear time.' },
    { id: 'p49', title: 'Find the Smallest Divisor Given a Threshold', leetcodeUrl: 'https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/', leetcodeProblemNumber: 1283, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the smallest divisor such that the sum of division results is less than or equal to a threshold.' },
    { id: 'p50', title: 'Minimum Number of Days to Make m Bouquets', leetcodeUrl: 'https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/', leetcodeProblemNumber: 1482, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the minimum number of days to wait to make m bouquets of k adjacent flowers.' },
    { id: 'p51', title: 'Daily Temperatures', leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/', leetcodeProblemNumber: 739, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the number of days you have to wait after the i-th day to get a warmer temperature.' },
    { id: 'p52', title: 'Remove K Digits', leetcodeUrl: 'https://leetcode.com/problems/remove-k-digits/', leetcodeProblemNumber: 402, difficulty: Difficulty.MEDIUM, descriptionShort: 'Remove k digits from the number so that the new number is the smallest possible.' },
    { id: 'p53', title: 'Set Mismatch', leetcodeUrl: 'https://leetcode.com/problems/set-mismatch/', leetcodeProblemNumber: 645, difficulty: Difficulty.EASY, descriptionShort: 'Find the number that occurs twice and the number that is missing in an array containing numbers from 1 to n.' },
    { id: 'p54', title: 'Contains Duplicate II', leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate-ii/', leetcodeProblemNumber: 219, difficulty: Difficulty.EASY, descriptionShort: 'Check if there are two distinct indices i and j in the array such that nums[i] == nums[j] and abs(i - j) <= k.' },
    { id: 'p55', title: 'Squares of a Sorted Array', leetcodeUrl: 'https://leetcode.com/problems/squares-of-a-sorted-array/', leetcodeProblemNumber: 977, difficulty: Difficulty.EASY, descriptionShort: 'Return an array of the squares of each number sorted in non-decreasing order.' },
    { id: 'p56', title: 'Meeting Rooms II', leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms-ii/', leetcodeProblemNumber: 253, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the minimum number of conference rooms required.' },
    { id: 'p57', title: 'My Calendar I', leetcodeUrl: 'https://leetcode.com/problems/my-calendar-i/', leetcodeProblemNumber: 729, difficulty: Difficulty.MEDIUM, descriptionShort: 'Implement a calendar class where you can book non-overlapping events.' },

    // --- LINKED LIST PROBLEMS (p58 to p75) ---
    { id: 'p58', title: 'Linked List Cycle', leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/', leetcodeProblemNumber: 141, difficulty: Difficulty.EASY, descriptionShort: 'Detect if a cycle exists in a linked list.' },
    { id: 'p59', title: 'Middle of the Linked List', leetcodeUrl: 'https://leetcode.com/problems/middle-of-the-linked-list/', leetcodeProblemNumber: 876, difficulty: Difficulty.EASY, descriptionShort: 'Find the middle node of a linked list.' },
    { id: 'p60', title: 'Happy Number', leetcodeUrl: 'https://leetcode.com/problems/happy-number/', leetcodeProblemNumber: 202, difficulty: Difficulty.EASY, descriptionShort: 'Determine if a number is happy using cycle detection.' },
    { id: 'p61', title: 'Reverse Linked List', leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/', leetcodeProblemNumber: 206, difficulty: Difficulty.EASY, descriptionShort: 'Reverse a singly linked list in-place.' },
    { id: 'p62', title: 'Reverse Linked List II', leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list-ii/', leetcodeProblemNumber: 92, difficulty: Difficulty.MEDIUM, descriptionShort: 'Reverse a portion of a linked list in-place.' },
    { id: 'p63', title: 'Swap Nodes in Pairs', leetcodeUrl: 'https://leetcode.com/problems/swap-nodes-in-pairs/', leetcodeProblemNumber: 24, difficulty: Difficulty.MEDIUM, descriptionShort: 'Swap every two adjacent nodes in a linked list.' },
    { id: 'p64', title: 'Reorder List', leetcodeUrl: 'https://leetcode.com/problems/reorder-list/', leetcodeProblemNumber: 143, difficulty: Difficulty.MEDIUM, descriptionShort: 'Reorder a linked list to alternate first and last nodes.' },
    { id: 'p65', title: 'Merge Two Sorted Lists', leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/', leetcodeProblemNumber: 21, difficulty: Difficulty.EASY, descriptionShort: 'Merge two sorted linked lists.' },
    { id: 'p66', title: 'Merge k Sorted Lists', leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/', leetcodeProblemNumber: 23, difficulty: Difficulty.HARD, descriptionShort: 'Merge k sorted linked lists.' },
    { id: 'p67', title: 'Sort List', leetcodeUrl: 'https://leetcode.com/problems/sort-list/', leetcodeProblemNumber: 148, difficulty: Difficulty.MEDIUM, descriptionShort: 'Sort a linked list in O(n log n) time using constant space.' },
    { id: 'p68', title: 'Remove Nth Node From End of List', leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', leetcodeProblemNumber: 19, difficulty: Difficulty.MEDIUM, descriptionShort: 'Remove the nth node from the end of the list.' },
    { id: 'p69', title: 'Remove Duplicates from Sorted List II', leetcodeUrl: 'https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/', leetcodeProblemNumber: 82, difficulty: Difficulty.MEDIUM, descriptionShort: 'Remove all duplicate values from a sorted linked list.' },
    { id: 'p70', title: 'Partition List', leetcodeUrl: 'https://leetcode.com/problems/partition-list/', leetcodeProblemNumber: 86, difficulty: Difficulty.MEDIUM, descriptionShort: 'Partition a linked list around a value x.' },
    { id: 'p71', title: 'Linked List Cycle II', leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle-ii/', leetcodeProblemNumber: 142, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the node where the cycle begins.' },
    { id: 'p72', title: 'Palindrome Linked List', leetcodeUrl: 'https://leetcode.com/problems/palindrome-linked-list/', leetcodeProblemNumber: 234, difficulty: Difficulty.EASY, descriptionShort: 'Check if a linked list is a palindrome.' },
    { id: 'p73', title: 'Reverse Nodes in k-Group', leetcodeUrl: 'https://leetcode.com/problems/reverse-nodes-in-k-group/', leetcodeProblemNumber: 25, difficulty: Difficulty.HARD, descriptionShort: 'Reverse nodes of a linked list k at a time.' },
    { id: 'p74', title: 'Intersection of Two Linked Lists', leetcodeUrl: 'https://leetcode.com/problems/intersection-of-two-linked-lists/', leetcodeProblemNumber: 160, difficulty: Difficulty.EASY, descriptionShort: 'Find the node at which the intersection of two singly linked lists begins.' },
    { id: 'p75', title: 'Lowest Common Ancestor of a Binary Tree III', leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-iii/', leetcodeProblemNumber: 1650, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the lowest common ancestor of two nodes in a binary tree where each node has a parent pointer.' },
    { id: 'p76', title: 'Maximum Sum Subarray of Size K', leetcodeUrl: 'https://leetcode.com/problems/maximum-average-subarray-i/', leetcodeProblemNumber: 643, difficulty: Difficulty.EASY, descriptionShort: 'Find the maximum sum of any contiguous subarray of size K. Classic fixed-window introduction.' },
    { id: 'p77', title: 'Longest Subarray with Sum K', leetcodeUrl: 'https://leetcode.com/problems/longest-subarray-with-sum-k/', leetcodeProblemNumber: null, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the length of the longest subarray with sum equal to K.' },
    { id: 'p78', title: 'Longest Substring Without Repeating Characters', leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', leetcodeProblemNumber: 3, difficulty: Difficulty.MEDIUM, descriptionShort: 'Variable window — expand right, shrink left when a duplicate character enters the window. Uses a HashSet or frequency map.' },
    { id: 'p79', title: 'Minimum Window Substring', leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/', leetcodeProblemNumber: 76, difficulty: Difficulty.HARD, descriptionShort: 'Find the smallest window in s containing all characters of t. Variable window with two frequency maps and a "valid" counter — the hardest standard sliding window problem.' },
  ];

  const dbProblems: { [key: string]: string } = {};

  for (const prob of problemsData) {
    let existingProb = await prisma.problem.findFirst({
      where: { leetcodeUrl: prob.leetcodeUrl },
    });
    if (existingProb) {
      existingProb = await prisma.problem.update({
        where: { id: existingProb.id },
        data: {
          title: prob.title,
          leetcodeProblemNumber: prob.leetcodeProblemNumber,
          difficulty: prob.difficulty,
          descriptionShort: prob.descriptionShort,
        },
      });
    } else {
      existingProb = await prisma.problem.create({
        data: {
          title: prob.title,
          leetcodeUrl: prob.leetcodeUrl,
          leetcodeProblemNumber: prob.leetcodeProblemNumber,
          difficulty: prob.difficulty,
          descriptionShort: prob.descriptionShort,
        },
      });
    }
    dbProblems[prob.id] = existingProb.id;
  }

  console.log('Seeded unique problems successfully.');

  // 5. Connect Problems to Patterns (with isPrimary flags, supporting shared problems)
  const problemPatternsRelations = [
    // === ARRAY MAPPINGS ===
    // 1. Two Pointer
    { problemId: 'p1', patternSlug: 'two-pointer', isPrimary: true }, // Two Sum
    { problemId: 'p2', patternSlug: 'two-pointer', isPrimary: true }, // 3Sum
    { problemId: 'p3', patternSlug: 'two-pointer', isPrimary: true }, // Container With Most Water
    { problemId: 'p4', patternSlug: 'two-pointer', isPrimary: true }, // Remove Duplicates

    // 2. Prefix Sum + HashMap
    { problemId: 'p5', patternSlug: 'prefix-sum-hashmap', isPrimary: true }, // Subarray Sum Equals K
    { problemId: 'p6', patternSlug: 'prefix-sum-hashmap', isPrimary: true }, // Subarray Sums Divisible by K
    { problemId: 'p7', patternSlug: 'prefix-sum-hashmap', isPrimary: true }, // Contiguous Array
    { problemId: 'p8', patternSlug: 'prefix-sum-hashmap', isPrimary: true }, // Range Sum Query

    // 3. Kadane's
    { problemId: 'p9', patternSlug: 'kadanes-algorithm', isPrimary: true }, // Maximum Subarray
    { problemId: 'p10', patternSlug: 'kadanes-algorithm', isPrimary: true }, // Maximum Product Subarray
    { problemId: 'p11', patternSlug: 'kadanes-algorithm', isPrimary: true }, // Stock Buy-Sell

    // 4. Sort + Greedy
    { problemId: 'p12', patternSlug: 'sort-greedy', isPrimary: true }, // Merge Intervals (Primary)
    { problemId: 'p13', patternSlug: 'sort-greedy', isPrimary: true }, // Non-overlapping Intervals
    { problemId: 'p14', patternSlug: 'sort-greedy', isPrimary: true }, // Arrow burst

    // 5. XOR / Math
    { problemId: 'p15', patternSlug: 'xor-math-tricks', isPrimary: true }, // Single Number
    { problemId: 'p16', patternSlug: 'xor-math-tricks', isPrimary: true }, // Missing Number (Primary)
    { problemId: 'p17', patternSlug: 'xor-math-tricks', isPrimary: true }, // Find Duplicate

    // 6. Matrix Simulation
    { problemId: 'p18', patternSlug: 'matrix-simulation', isPrimary: true }, // Spiral Matrix
    { problemId: 'p19', patternSlug: 'matrix-simulation', isPrimary: true }, // Rotate Image
    { problemId: 'p20', patternSlug: 'matrix-simulation', isPrimary: true }, // Set Matrix Zeroes (Primary)

    // 7. Merge Sort (Divide & Conquer)
    { problemId: 'p21', patternSlug: 'merge-sort-divide-conquer', isPrimary: true }, // Reverse Pairs
    { problemId: 'p22', patternSlug: 'merge-sort-divide-conquer', isPrimary: true }, // Count Smaller
    { problemId: 'p23', patternSlug: 'merge-sort-divide-conquer', isPrimary: true }, // Sort an Array

    // 8. Binary Search on Answer
    { problemId: 'p24', patternSlug: 'binary-search-on-answer', isPrimary: true }, // Koko eating
    { problemId: 'p25', patternSlug: 'binary-search-on-answer', isPrimary: true }, // Split Array
    { problemId: 'p26', patternSlug: 'binary-search-on-answer', isPrimary: true }, // Ship Packages

    // 9. Monotonic Stack
    { problemId: 'p27', patternSlug: 'monotonic-stack-queue', isPrimary: true }, // Next Greater
    { problemId: 'p28', patternSlug: 'monotonic-stack-queue', isPrimary: true }, // Histogram
    { problemId: 'p29', patternSlug: 'monotonic-stack-queue', isPrimary: false }, // Sliding Window Max (Secondary)

    // 10. Cyclic Sort
    { problemId: 'p16', patternSlug: 'cyclic-sort', isPrimary: false }, // Missing Number (Secondary)
    { problemId: 'p30', patternSlug: 'cyclic-sort', isPrimary: true }, // Disappeared Numbers
    { problemId: 'p31', patternSlug: 'cyclic-sort', isPrimary: true }, // First Missing Positive (Primary)

    // 11. In-place Hashing
    { problemId: 'p32', patternSlug: 'in-place-hashing', isPrimary: true }, // Find all Duplicates
    { problemId: 'p31', patternSlug: 'in-place-hashing', isPrimary: false }, // First Missing Positive (Secondary)
    { problemId: 'p20', patternSlug: 'in-place-hashing', isPrimary: false }, // Set Matrix Zeroes (Secondary)

    // 12. Event Line / Sweep
    { problemId: 'p12', patternSlug: 'event-line-sweep', isPrimary: false }, // Merge Intervals (Secondary)
    { problemId: 'p33', patternSlug: 'event-line-sweep', isPrimary: true }, // Car Pooling
    { problemId: 'p34', patternSlug: 'event-line-sweep', isPrimary: true }, // My Calendar III

    // Additional Problems (Phase 1 Ext)
    { problemId: 'p35', patternSlug: 'two-pointer', isPrimary: true }, // Sort Colors
    { problemId: 'p36', patternSlug: 'two-pointer', isPrimary: true }, // Trapping Rain Water
    { problemId: 'p37', patternSlug: 'prefix-sum-hashmap', isPrimary: true }, // Continuous Subarray Sum
    { problemId: 'p38', patternSlug: 'prefix-sum-hashmap', isPrimary: true }, // Product of Array Except Self
    { problemId: 'p39', patternSlug: 'kadanes-algorithm', isPrimary: true }, // Maximum Sum Circular Subarray
    { problemId: 'p40', patternSlug: 'kadanes-algorithm', isPrimary: true }, // House Robber
    { problemId: 'p41', patternSlug: 'sort-greedy', isPrimary: true }, // Insert Interval
    { problemId: 'p42', patternSlug: 'sort-greedy', isPrimary: true }, // Interval List Intersections
    { problemId: 'p43', patternSlug: 'xor-math-tricks', isPrimary: true }, // Single Number II
    { problemId: 'p44', patternSlug: 'xor-math-tricks', isPrimary: true }, // Single Number III
    { problemId: 'p45', patternSlug: 'matrix-simulation', isPrimary: true }, // Diagonal Traverse
    { problemId: 'p46', patternSlug: 'matrix-simulation', isPrimary: true }, // Game of Life
    { problemId: 'p47', patternSlug: 'merge-sort-divide-conquer', isPrimary: true }, // Global and Local Inversions
    { problemId: 'p48', patternSlug: 'merge-sort-divide-conquer', isPrimary: true }, // Maximum Gap
    { problemId: 'p49', patternSlug: 'binary-search-on-answer', isPrimary: true }, // Find Smallest Divisor
    { problemId: 'p50', patternSlug: 'binary-search-on-answer', isPrimary: true }, // Bouquets
    { problemId: 'p51', patternSlug: 'monotonic-stack-queue', isPrimary: true }, // Daily Temperatures
    { problemId: 'p52', patternSlug: 'monotonic-stack-queue', isPrimary: true }, // Remove K Digits
    { problemId: 'p17', patternSlug: 'cyclic-sort', isPrimary: false }, // Find the Duplicate Number (Reused - Secondary link)
    { problemId: 'p53', patternSlug: 'cyclic-sort', isPrimary: true }, // Set Mismatch
    { problemId: 'p54', patternSlug: 'in-place-hashing', isPrimary: true }, // Contains Duplicate II
    { problemId: 'p55', patternSlug: 'in-place-hashing', isPrimary: true }, // Squares of a Sorted Array
    { problemId: 'p56', patternSlug: 'event-line-sweep', isPrimary: true }, // Meeting Rooms II
    { problemId: 'p57', patternSlug: 'event-line-sweep', isPrimary: true }, // My Calendar I

    // === LINKED LIST MAPPINGS ===
    // 1. Fast & Slow Pointer
    { problemId: 'p58', patternSlug: 'fast-slow-pointer', isPrimary: true }, // Linked List Cycle
    { problemId: 'p59', patternSlug: 'fast-slow-pointer', isPrimary: true }, // Middle of the Linked List
    { problemId: 'p60', patternSlug: 'fast-slow-pointer', isPrimary: true }, // Happy Number

    // 2. Reversal (In-place)
    { problemId: 'p61', patternSlug: 'in-place-reversal', isPrimary: true }, // Reverse Linked List
    { problemId: 'p62', patternSlug: 'in-place-reversal', isPrimary: true }, // Reverse Linked List II
    { problemId: 'p63', patternSlug: 'in-place-reversal', isPrimary: true }, // Swap Nodes in Pairs
    { problemId: 'p64', patternSlug: 'in-place-reversal', isPrimary: true }, // Reorder List

    // 3. Merge Sorted Lists
    { problemId: 'p65', patternSlug: 'merge-sorted-lists', isPrimary: true }, // Merge Two Sorted Lists
    { problemId: 'p66', patternSlug: 'merge-sorted-lists', isPrimary: true }, // Merge k Sorted Lists
    { problemId: 'p67', patternSlug: 'merge-sorted-lists', isPrimary: true }, // Sort List

    // 4. Dummy Node Technique
    { problemId: 'p68', patternSlug: 'dummy-node-technique', isPrimary: true }, // Remove Nth Node From End of List
    { problemId: 'p69', patternSlug: 'dummy-node-technique', isPrimary: true }, // Remove Duplicates II
    { problemId: 'p70', patternSlug: 'dummy-node-technique', isPrimary: true }, // Partition List

    // 5. Cycle Detection & Cycle Start (Floyd's)
    { problemId: 'p71', patternSlug: 'cycle-detection-start', isPrimary: true }, // Linked List Cycle II
    { problemId: 'p17', patternSlug: 'cycle-detection-start', isPrimary: false }, // Find the Duplicate Number (Reused - Secondary link)
    { problemId: 'p58', patternSlug: 'cycle-detection-start', isPrimary: false }, // Linked List Cycle (Reused - Secondary link)

    // 6. Recursive vs Iterative Traversal
    { problemId: 'p72', patternSlug: 'recursive-vs-iterative', isPrimary: true }, // Palindrome Linked List
    { problemId: 'p73', patternSlug: 'recursive-vs-iterative', isPrimary: true }, // Reverse Nodes in k-Group
    { problemId: 'p61', patternSlug: 'recursive-vs-iterative', isPrimary: false }, // Reverse Linked List (Reused - Secondary link)

    // 7. Intersection of Two Lists (Offset Pointers)
    { problemId: 'p74', patternSlug: 'intersection-offset-pointers', isPrimary: true }, // Intersection of Two Linked Lists
    { problemId: 'p75', patternSlug: 'intersection-offset-pointers', isPrimary: true }, // LCA of Binary Tree III
    { problemId: 'p71', patternSlug: 'intersection-offset-pointers', isPrimary: false }, // Linked List Cycle II (Reused - Secondary link)

    // === SLIDING WINDOW MAPPINGS ===
    { problemId: 'p76', patternSlug: 'sliding-window', isPrimary: true }, // Maximum Sum Subarray (Primary)
    { problemId: 'p77', patternSlug: 'sliding-window', isPrimary: false }, // Longest Subarray with Sum K (Secondary)
    { problemId: 'p77', patternSlug: 'two-pointer', isPrimary: true }, // Longest Subarray with Sum K (Primary)
    { problemId: 'p78', patternSlug: 'sliding-window', isPrimary: true }, // Longest Substring Without Repeating Characters (Primary)
    { problemId: 'p79', patternSlug: 'sliding-window', isPrimary: true }, // Minimum Window Substring (Primary)
    { problemId: 'p29', patternSlug: 'sliding-window', isPrimary: true }, // Sliding Window Max (Primary)
  ];

  for (const rel of problemPatternsRelations) {
    const pId = dbProblems[rel.problemId];
    const patId = dbPatterns[rel.patternSlug];
    if (!pId || !patId) {
      console.warn(`Skipping relation: problemId=${rel.problemId}, patternSlug=${rel.patternSlug} (pId=${pId}, patId=${patId})`);
      continue;
    }

    const existingRel = await prisma.problemPattern.findUnique({
      where: {
        problemId_patternId: {
          problemId: pId,
          patternId: patId,
        },
      },
    });

    if (existingRel) {
      await prisma.problemPattern.update({
        where: {
          problemId_patternId: {
            problemId: pId,
            patternId: patId,
          },
        },
        data: {
          isPrimary: rel.isPrimary,
        },
      });
    } else {
      await prisma.problemPattern.create({
        data: {
          problemId: pId,
          patternId: patId,
          isPrimary: rel.isPrimary,
        },
      });
    }
  }

  console.log('Seeded problem-pattern relationships successfully.');

  // --- SEED COMPANIES AND COMPANY-WISE PROBLEMS (OPTIMIZED) ---
  console.log('Starting Company and CompanyProblem Seeding (Optimized)...');

  const COMPANY_FOLDERS: Record<string, string> = {
    'Google': 'Google',
    'Amazon': 'Amazon',
    'Meta': 'Meta',
    'Microsoft': 'Microsoft',
    'Apple': 'Apple',
    'Netflix': 'Netflix',
    'Adobe': 'Adobe',
    'Uber': 'Uber',
    'Bloomberg': 'Bloomberg',
    'LinkedIn': 'LinkedIn',
    'Atlassian': 'Atlassian',
    'Salesforce': 'Salesforce',
    'TCS': 'tcs',
    'Infosys': 'Infosys',
    'Wipro': 'Wipro',
    'Cognizant': 'Cognizant',
    'Accenture': 'Accenture',
    'Flipkart': 'Flipkart',
    'Paytm': 'Paytm',
    'Swiggy': 'Swiggy'
  };

  // 1. Preload all existing problems and patterns to build lookup maps
  let existingProblems = await prisma.problem.findMany();
  const urlToIdMap = new Map<string, string>();
  existingProblems.forEach((p) => {
    urlToIdMap.set(normalizeUrl(p.leetcodeUrl), p.id);
  });

  const allPatterns = await prisma.pattern.findMany();
  const slugToPatternMap = new Map<string, any>();
  allPatterns.forEach((pat) => {
    slugToPatternMap.set(pat.slug, pat);
  });

  // Extract URLs of the original 75 problems
  const originalProblems = await prisma.problem.findMany({
    where: { leetcodeProblemNumber: { not: null } }
  });
  const originalUrls = new Set<string>();
  originalProblems.forEach((p) => {
    originalUrls.add(normalizeUrl(p.leetcodeUrl));
  });

  // 2. Pre-create the 20 target companies
  const companySlugToId = new Map<string, string>();
  const companySlugs: string[] = [];
  for (const companyName of Object.keys(COMPANY_FOLDERS)) {
    const slug = companyName.toLowerCase().replace(/\s+/g, '-');
    companySlugs.push(slug);
    const company = await prisma.company.upsert({
      where: { slug },
      update: { name: companyName },
      create: { name: companyName, slug },
    });
    companySlugToId.set(slug, company.id);
  }

  // 3. Clear existing CompanyProblem links for these companies/timeframe to allow clean bulk insert of fresh scores
  await prisma.companyProblem.deleteMany({
    where: {
      timeframe: 'all',
      company: {
        slug: { in: companySlugs }
      }
    }
  });
  console.log('Cleared existing company problems for fresh bulk import.');

  const newProblemsMap = new Map<string, { title: string; difficulty: Difficulty; patternSlug: string }>();
  const companyProblemsToCreate: Array<{ companySlug: string; normalizedUrl: string; frequencyScore: number }> = [];

  for (const [companyName, folderName] of Object.entries(COMPANY_FOLDERS)) {
    console.log(`Fetching CSV data for ${companyName}...`);
    try {
      const companySlug = companyName.toLowerCase().replace(/\s+/g, '-');
      const csvUrl = `https://raw.githubusercontent.com/liquidslr/leetcode-company-wise-problems/main/${folderName}/5.%20All.csv`;
      const response = await fetch(csvUrl);
      if (!response.ok) {
        console.warn(`Failed to fetch CSV for ${companyName}: ${response.statusText}`);
        continue;
      }

      const csvText = await response.text();
      const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length <= 1) continue;

      const header = parseCSVLine(lines[0]);
      const diffIdx = header.findIndex(h => h.toLowerCase() === 'difficulty');
      const titleIdx = header.findIndex(h => h.toLowerCase() === 'title');
      const freqIdx = header.findIndex(h => h.toLowerCase() === 'frequency');
      const linkIdx = header.findIndex(h => h.toLowerCase() === 'link');
      const topicsIdx = header.findIndex(h => h.toLowerCase() === 'topics');

      const candidates: Array<{
        title: string;
        leetcodeUrl: string;
        normalizedUrl: string;
        difficulty: Difficulty;
        frequencyScore: number;
        patternSlug: string | null;
        isOriginal: boolean;
      }> = [];

      for (let i = 1; i < lines.length; i++) {
        const columns = parseCSVLine(lines[i]);
        if (columns.length < 5) continue;

        const rawDifficulty = columns[diffIdx] || 'MEDIUM';
        const title = columns[titleIdx];
        const rawFrequency = parseFloat(columns[freqIdx] || '0');
        const leetcodeUrl = columns[linkIdx];
        const topicsStr = columns[topicsIdx] || '';

        if (!title || !leetcodeUrl) continue;

        const normalizedUrl = normalizeUrl(leetcodeUrl);
        const isOriginal = originalUrls.has(normalizedUrl);

        let difficulty: Difficulty = Difficulty.MEDIUM;
        const diffUpper = rawDifficulty.toUpperCase();
        if (diffUpper === 'EASY') difficulty = Difficulty.EASY;
        else if (diffUpper === 'HARD') difficulty = Difficulty.HARD;

        if (isOriginal) {
          candidates.push({
            title,
            leetcodeUrl,
            normalizedUrl,
            difficulty,
            frequencyScore: rawFrequency,
            patternSlug: null,
            isOriginal: true,
          });
        } else {
          // Rule 1: Skip if frequency < 50
          if (rawFrequency < 50) continue;

          // Rule 2: Skip if pattern is not in the 19 valid slugs
          const patternMapping = getPatternSlugForProblem(topicsStr);
          if (!patternMapping || !slugToPatternMap.has(patternMapping.slug)) {
            continue;
          }

          candidates.push({
            title,
            leetcodeUrl,
            normalizedUrl,
            difficulty,
            frequencyScore: rawFrequency,
            patternSlug: patternMapping.slug,
            isOriginal: false,
          });
        }
      }

      // Sort by frequencyScore descending and keep top 100
      candidates.sort((a, b) => b.frequencyScore - a.frequencyScore);
      const topCandidates = candidates.slice(0, 100);

      for (const candidate of topCandidates) {
        // Queue CompanyProblem relation link
        companyProblemsToCreate.push({
          companySlug,
          normalizedUrl: candidate.normalizedUrl,
          frequencyScore: candidate.frequencyScore,
        });

        // Queue new Problem if it doesn't exist in either DB or newProblemsMap
        if (!candidate.isOriginal && candidate.patternSlug) {
          if (!urlToIdMap.has(candidate.normalizedUrl) && !newProblemsMap.has(candidate.normalizedUrl)) {
            newProblemsMap.set(candidate.normalizedUrl, {
              title: candidate.title,
              difficulty: candidate.difficulty,
              patternSlug: candidate.patternSlug,
            });
          }
        }
      }
    } catch (err: any) {
      console.error(`Error processing company ${companyName}:`, err.message);
    }
  }

  // 4. Bulk Create New Problems
  const newlyCreatedProblems: Array<{ title: string; topics: string; url: string; patternSlug: string }> = [];
  if (newProblemsMap.size > 0) {
    console.log(`Bulk creating ${newProblemsMap.size} new problems...`);
    const problemsData = Array.from(newProblemsMap.entries()).map(([url, data]) => ({
      title: data.title,
      leetcodeUrl: url,
      difficulty: data.difficulty,
    }));

    await prisma.problem.createMany({
      data: problemsData,
      skipDuplicates: true,
    });

    // Re-fetch all problems to get the newly generated IDs
    existingProblems = await prisma.problem.findMany();
    urlToIdMap.clear();
    existingProblems.forEach((p) => {
      urlToIdMap.set(normalizeUrl(p.leetcodeUrl), p.id);
    });

    // 5. Bulk Create ProblemPattern Relations
    console.log('Bulk creating problem-pattern relations...');
    const patternRelationsData: Array<{ problemId: string; patternId: string; isPrimary: boolean }> = [];
    for (const [url, data] of newProblemsMap.entries()) {
      const problemId = urlToIdMap.get(url);
      const pattern = slugToPatternMap.get(data.patternSlug);
      if (problemId && pattern) {
        patternRelationsData.push({
          problemId,
          patternId: pattern.id,
          isPrimary: true,
        });

        newlyCreatedProblems.push({
          title: data.title,
          topics: '', // We can leave empty or reconstruct
          url,
          patternSlug: data.patternSlug,
        });
      }
    }

    if (patternRelationsData.length > 0) {
      await prisma.problemPattern.createMany({
        data: patternRelationsData,
        skipDuplicates: true,
      });
    }
  }

  // 6. Bulk Create CompanyProblem Relations
  if (companyProblemsToCreate.length > 0) {
    console.log(`Bulk creating ${companyProblemsToCreate.length} company problem links...`);
    
    // Deduplicate company-problem combinations to prevent unique constraint failures
    const uniqueCompanyProblems = new Map<string, { companyId: string; problemId: string; frequencyScore: number; timeframe: string }>();
    
    for (const cp of companyProblemsToCreate) {
      const companyId = companySlugToId.get(cp.companySlug);
      const problemId = urlToIdMap.get(cp.normalizedUrl);
      if (companyId && problemId) {
        const uniqueKey = `${companyId}_${problemId}_all`;
        // Prefer higher frequency score if duplicate combination occurs
        const existing = uniqueCompanyProblems.get(uniqueKey);
        if (!existing || cp.frequencyScore > existing.frequencyScore) {
          uniqueCompanyProblems.set(uniqueKey, {
            companyId,
            problemId,
            frequencyScore: cp.frequencyScore,
            timeframe: 'all',
          });
        }
      }
    }

    const companyProblemsData = Array.from(uniqueCompanyProblems.values());
    await prisma.companyProblem.createMany({
      data: companyProblemsData,
      skipDuplicates: true,
    });
  }

  console.log('----------------------------------------------------');
  console.log('Company and CompanyProblem Seeding Completed.');
  console.log(`Total CompanyProblem links created/updated: ${companyProblemsToCreate.length}`);
  console.log(`Total newly created problems: ${newProblemsMap.size}`);
  console.log('----------------------------------------------------');
  console.log('Sample of 5 newly created problems with their pattern slugs:');
  const sample = newlyCreatedProblems.slice(0, 5);
  sample.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.title}]`);
    console.log(`   URL: ${p.url}`);
    console.log(`   Assigned Pattern Slug: ${p.patternSlug}`);
  });
  console.log('----------------------------------------------------');
  console.log('Database Seeding Completed.');
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function normalizeUrl(url: string): string {
  let cleaned = url.trim();
  if (cleaned.endsWith('/')) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned.toLowerCase();
}

function getPatternSlugForProblem(topicsStr: string): { slug: string; group: 'array' | 'linked-list' } | null {
  const topics = topicsStr.split(',').map(t => t.trim());
  const topicsLower = topics.map(t => t.toLowerCase());

  const hasLinkedList = topicsLower.includes('linked list');
  const hasArray = topicsLower.includes('array');

  if (!hasLinkedList && !hasArray) {
    return null; // Skip it!
  }

  // Priority rule: check Linked List first
  if (hasLinkedList) {
    if (topics.some(t => t === 'Two Pointers')) {
      return { slug: 'fast-slow-pointer', group: 'linked-list' };
    }
    if (topics.some(t => t === 'Recursion')) {
      return { slug: 'recursive-vs-iterative', group: 'linked-list' };
    }
    if (topics.some(t => t === 'Divide and Conquer')) {
      return { slug: 'merge-sorted-lists', group: 'linked-list' };
    }
    if (topics.some(t => t === 'Hash Table')) {
      return { slug: 'intersection-offset-pointers', group: 'linked-list' };
    }
    return null; // No default fallback!
  }

  if (hasArray) {
    if (topics.some(t => t === 'Sliding Window')) {
      return { slug: 'sliding-window', group: 'array' };
    }
    if (topics.some(t => t === 'Two Pointers')) {
      return { slug: 'two-pointer', group: 'array' };
    }
    if (topics.some(t => t === 'Prefix Sum')) {
      return { slug: 'prefix-sum-hashmap', group: 'array' };
    }
    if (topics.some(t => t === 'Dynamic Programming') && topicsLower.includes('subarray')) {
      return { slug: 'kadanes-algorithm', group: 'array' };
    }
    if (topics.some(t => t === 'Divide and Conquer')) {
      return { slug: 'merge-sort-divide-conquer', group: 'array' };
    }
    if (topics.some(t => t === 'Sorting') || topics.some(t => t === 'Greedy')) {
      return { slug: 'sort-greedy', group: 'array' };
    }
    if (topics.some(t => t === 'Bit Manipulation')) {
      return { slug: 'xor-math-tricks', group: 'array' };
    }
    if (topics.some(t => t === 'Math')) {
      return { slug: 'xor-math-tricks', group: 'array' };
    }
    if (topics.some(t => t === 'Matrix')) {
      return { slug: 'matrix-simulation', group: 'array' };
    }
    if (topics.some(t => t === 'Monotonic Stack')) {
      return { slug: 'monotonic-stack-queue', group: 'array' };
    }
    if (topics.some(t => t === 'Stack')) {
      return { slug: 'monotonic-stack-queue', group: 'array' };
    }
    if (topics.some(t => t === 'Binary Search')) {
      return { slug: 'binary-search-on-answer', group: 'array' };
    }
    return null; // No default fallback!
  }

  return null;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

