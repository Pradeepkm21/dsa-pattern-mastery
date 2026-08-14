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

  // 2b. Upsert Graph Pattern Group
  let graphGroup = await prisma.patternGroup.findUnique({
    where: { slug: 'graph' },
  });
  if (!graphGroup) {
    graphGroup = await prisma.patternGroup.create({
      data: {
        name: 'Graph',
        slug: 'graph',
        description: 'Graph traversal, shortest path, connectivity, and optimization patterns for interview preparation',
        displayOrder: 3,
      },
    });
  } else {
    graphGroup = await prisma.patternGroup.update({
      where: { slug: 'graph' },
      data: {
        name: 'Graph',
        description: 'Graph traversal, shortest path, connectivity, and optimization patterns for interview preparation',
        displayOrder: 3,
      },
    });
  }

  // 2c. Upsert Binary Tree Pattern Group
  let binaryTreeGroup = await prisma.patternGroup.findUnique({
    where: { slug: 'binary-tree' },
  });
  if (!binaryTreeGroup) {
    binaryTreeGroup = await prisma.patternGroup.create({
      data: {
        name: 'Binary Tree',
        slug: 'binary-tree',
        description: 'Binary tree traversal, construction, path, and structural patterns for interview preparation',
        displayOrder: 4,
      },
    });
  } else {
    binaryTreeGroup = await prisma.patternGroup.update({
      where: { slug: 'binary-tree' },
      data: {
        name: 'Binary Tree',
        description: 'Binary tree traversal, construction, path, and structural patterns for interview preparation',
        displayOrder: 4,
      },
    });
  }

  // 2d. Upsert Binary Search Tree Pattern Group
  let binarySearchTreeGroup = await prisma.patternGroup.findUnique({
    where: { slug: 'binary-search-tree' },
  });
  if (!binarySearchTreeGroup) {
    binarySearchTreeGroup = await prisma.patternGroup.create({
      data: {
        name: 'Binary Search Tree',
        slug: 'binary-search-tree',
        description: 'BST search, insertion, deletion, construction, and property-based patterns for interview preparation',
        displayOrder: 5,
      },
    });
  } else {
    binarySearchTreeGroup = await prisma.patternGroup.update({
      where: { slug: 'binary-search-tree' },
      data: {
        name: 'Binary Search Tree',
        description: 'BST search, insertion, deletion, construction, and property-based patterns for interview preparation',
        displayOrder: 5,
      },
    });
  }

  // 2e. Upsert Recursion & Backtracking Pattern Group
  let recursionBacktrackingGroup = await prisma.patternGroup.findUnique({
    where: { slug: 'recursion-backtracking' },
  });
  if (!recursionBacktrackingGroup) {
    recursionBacktrackingGroup = await prisma.patternGroup.create({
      data: {
        name: 'Recursion & Backtracking',
        slug: 'recursion-backtracking',
        description: 'Recursive problem decomposition, decision trees, and constraint-based backtracking patterns for interview preparation',
        displayOrder: 6,
      },
    });
  } else {
    recursionBacktrackingGroup = await prisma.patternGroup.update({
      where: { slug: 'recursion-backtracking' },
      data: {
        name: 'Recursion & Backtracking',
        description: 'Recursive problem decomposition, decision trees, and constraint-based backtracking patterns for interview preparation',
        displayOrder: 6,
      },
    });
  }

  // 3. Create Patterns (Array + Linked List + Graph + Binary Tree + BST)
  const patternsData = [
    // --- ARRAY PATTERNS ---
    {
      name: 'Two Pointer',
      slug: 'two-pointer',
      groupSlug: 'array',
      triggerCue: 'Sorted input array; searching for pairs or triplets that meet a target sum/condition; shrinking search spaces from boundaries; or partition operations.',
      coreIdea: 'Initialize two pointer variables at indices of interest (often boundaries: 0 and N-1) and iteratively move them towards each other or in parallel to evaluate conditions.',
      whyItWorks: 'Relies on a monotonicity guarantee. In a sorted array, moving the left pointer rightward strictly increases the sum, and moving the right pointer leftward strictly decreases it. Similarly, for the Sliding Window subarray variant (e.g., finding a subarray with sum K), expanding the right pointer increases the running sum and shrinking the left pointer decreases it. This sum monotonicity guarantees that if the current window sum exceeds K, we can safely discard further expansions from the current left pointer because any expansion would only increase the sum. Crucially, this monotonicity holds ONLY if all elements are non-negative. If negative numbers are present, adding an element can decrease the sum and removing an element can increase it, breaking the monotonicity guarantee. In such cases, the sliding window fails, and we must fall back to the Prefix Sum + HashMap pattern, which does not rely on monotonicity.',
      codeSkeleton: `// Two pointer search on sorted array
vector<int> twoPointerSearch(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    while (left < right) {
        int currentSum = arr[left] + arr[right];
        if (currentSum == target) {
            return {left, right};
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    return {-1, -1};
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
      codeSkeleton: `// Find number of subarrays that sum to k
int subarraySum(const vector<int>& nums, int k) {
    unordered_map<int, int> prefixMap;
    prefixMap[0] = 1; // Base case
    int runningSum = 0;
    int count = 0;
    for (int num : nums) {
        runningSum += num;
        if (prefixMap.find(runningSum - k) != prefixMap.end()) {
            count += prefixMap[runningSum - k];
        }
        prefixMap[runningSum]++;
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
      codeSkeleton: `// Find maximum subarray sum
int maxSubArray(const vector<int>& nums) {
    int maxSoFar = nums[0];
    int currentMax = nums[0];
    for (size_t i = 1; i < nums.size(); ++i) {
        currentMax = max(nums[i], currentMax + nums[i]);
        maxSoFar = max(maxSoFar, currentMax);
    }
    return maxSoFar;
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
      codeSkeleton: `// Merge overlapping intervals
vector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {
    if (intervals.empty()) return {};
    sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {
        return a[0] < b[0];
    });
    vector<vector<int>> merged;
    merged.push_back(intervals[0]);
    for (const auto& interval : intervals) {
        if (interval[0] <= merged.back()[1]) {
            merged.back()[1] = max(merged.back()[1], interval[1]);
        } else {
            merged.push_back(interval);
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
      codeSkeleton: `// Find the element that appears once where all others appear twice
int findSingleNumber(const vector<int>& nums) {
    int singleNum = 0;
    for (int num : nums) {
        singleNum ^= num;
    }
    return singleNum;
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
      codeSkeleton: `// Spiral order traversal of matrix
vector<int> spiralOrder(const vector<vector<int>>& matrix) {
    if (matrix.empty()) return {};
    int top = 0, bottom = matrix.size() - 1;
    int left = 0, right = matrix[0].size() - 1;
    vector<int> result;
    while (top <= bottom && left <= right) {
        for (int i = left; i <= right; ++i) result.push_back(matrix[top][i]);
        top++;
        for (int i = top; i <= bottom; ++i) result.push_back(matrix[i][right]);
        right--;
        if (top <= bottom) {
            for (int i = right; i >= left; --i) result.push_back(matrix[bottom][i]);
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; --i) result.push_back(matrix[i][left]);
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
      codeSkeleton: `// Count inversions using Merge Sort
int mergeAndCount(vector<int>& arr, vector<int>& temp, int left, int mid, int right) {
    int i = left, j = mid + 1, k = left;
    int invCount = 0;
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
            invCount += (mid - i + 1); // Count inversions
        }
    }
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];
    for (i = left; i <= right; ++i) arr[i] = temp[i];
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
      codeSkeleton: `// Binary search to find minimum capacity to ship packages within D days
int shipWithinDays(const vector<int>& weights, int days) {
    auto isValid = [&](int cap) {
        int d = 1, currentWeight = 0;
        for (int w : weights) {
            if (currentWeight + w > cap) {
                d++;
                currentWeight = 0;
            }
            currentWeight += w;
        }
        return d <= days;
    };
    int low = *max_element(weights.begin(), weights.end());
    int high = accumulate(weights.begin(), weights.end(), 0);
    int ans = high;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (isValid(mid)) {
            ans = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
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
      codeSkeleton: `// Next Greater Element (NGE) using Monotonic Stack
vector<int> nextGreaterElement(const vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> s; // Stores indices
    for (int i = 0; i < n; ++i) {
        while (!s.empty() && nums[i] > nums[s.top()]) {
            result[s.top()] = nums[i];
            s.pop();
        }
        s.push(i);
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
      codeSkeleton: `// Cyclic Sort for elements from 1 to N
void cyclicSort(vector<int>& nums) {
    int i = 0, n = nums.size();
    while (i < n) {
        int correctIdx = nums[i] - 1;
        if (nums[i] > 0 && nums[i] <= n && nums[i] != nums[correctIdx]) {
            swap(nums[i], nums[correctIdx]);
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
      codeSkeleton: `// Find all duplicates in O(N) time and O(1) extra space
vector<int> findDuplicates(vector<int>& nums) {
    vector<int> duplicates;
    for (int i = 0; i < nums.size(); ++i) {
        int idx = abs(nums[i]) - 1;
        if (nums[idx] < 0) {
            duplicates.push_back(idx + 1);
        } else {
            nums[idx] = -nums[idx]; // Mark as visited
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
      codeSkeleton: `struct EventPoint {
    int time;
    int type; // +1 for arrival/start, -1 for departure/end
    bool operator<(const EventPoint& other) const {
        if (time != other.time) return time < other.time;
        return type < other.type; // process end before start if overlapping
    }
};

// Line sweep to find maximum overlapping intervals
int minMeetingRooms(vector<EventPoint>& events) {
    sort(events.begin(), events.end());
    int maxRooms = 0, currentRooms = 0;
    for (const auto& event : events) {
        currentRooms += event.type;
        maxRooms = max(maxRooms, currentRooms);
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
      codeSkeleton: `// Cycle detection using Floyd's Tortoise and Hare
bool hasCycle(ListNode* head) {
    if (!head || !head->next) return false;
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
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
      codeSkeleton: `// In-place reversal of a Singly Linked List
ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* current = head;
    while (current) {
        ListNode* nextNode = current->next;
        current->next = prev;
        prev = current;
        current = nextNode;
    }
    return prev; // New head
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
      codeSkeleton: `// Merge two sorted linked lists
ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);
    ListNode* tail = &dummy;
    while (l1 && l2) {
        if (l1->val <= l2->val) {
            tail->next = l1;
            l1 = l1->next;
        } else {
            tail->next = l2;
            l2 = l2->next;
        }
        tail = tail->next;
    }
    tail->next = l1 ? l1 : l2;
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
      codeSkeleton: `// Remove all elements with value equal to val
ListNode* removeElements(ListNode* head, int val) {
    ListNode dummy(0);
    dummy.next = head;
    ListNode* prev = &dummy;
    ListNode* current = head;
    while (current) {
        if (current->val == val) {
            prev->next = current->next;
            delete current; // Clean up memory
            current = prev->next;
        } else {
            prev = current;
            current = current->next;
        }
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
      codeSkeleton: `// Detect cycle start node in a linked list
ListNode* detectCycle(ListNode* head) {
    if (!head || !head->next) return nullptr;
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            ListNode* entry = head;
            while (entry != slow) {
                entry = entry->next;
                slow = slow->next;
            }
            return entry;
        }
    }
    return nullptr;
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
      codeSkeleton: `// Recursive Palindrome Check for Linked List
bool checkPalindrome(ListNode** left, ListNode* right) {
    if (!right) return true;
    bool isSubPalindrome = checkPalindrome(left, right->next);
    if (!isSubPalindrome) return false;
    bool isCurrentEqual = ((*left)->val == right->val);
    *left = (*left)->next;
    return isCurrentEqual;
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
      codeSkeleton: `// Find intersection node of two linked lists
ListNode* getIntersectionNode(ListNode* headA, ListNode* headB) {
    if (!headA || !headB) return nullptr;
    ListNode* pA = headA;
    ListNode* pB = headB;
    while (pA != pB) {
        pA = pA ? pA->next : headB;
        pB = pB ? pB->next : headA;
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
      codeSkeleton: `// 1. Fixed window (size K)
int maxSubarraySumOfSizeK(const vector<int>& arr, int k) {
    int n = arr.size();
    if (n < k) return -1;
    int windowSum = 0;
    for (int i = 0; i < k; ++i) windowSum += arr[i];
    int maxSum = windowSum;
    for (int i = k; i < n; ++i) {
        windowSum += arr[i] - arr[i - k];
        maxSum = max(maxSum, windowSum);
    }
    return maxSum;
}

// 2. Dynamic window (variable size)
int minSubarrayLen(const vector<int>& arr, int target) {
    int left = 0, windowSum = 0;
    int minLength = INT_MAX;
    for (int right = 0; right < arr.size(); ++right) {
        windowSum += arr[right];
        while (windowSum >= target) {
            minLength = min(minLength, right - left + 1);
            windowSum -= arr[left++];
        }
    }
    return minLength == INT_MAX ? 0 : minLength;
}`,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1) for basic sum problems; O(k) when using a frequency map or deque (e.g. Minimum Window Substring, Sliding Window Maximum)',
      commonMistake: '1. Using sliding window when negatives are present — the correct fallback is prefix sum + hashmap.\n2. For variable window, updating the result BEFORE shrinking the window rather than AFTER, which records an invalid window size.',
      comparisonNotes: "Use Sliding Window over Two Pointer when the problem involves a contiguous subarray/window and the answer is about the window's aggregate property (sum, max, count). Use Two Pointer when the problem involves finding pairs/triplets or operating on sorted arrays from both ends. Both are O(n)/O(1) — the choice is about problem structure, not efficiency.",
      displayOrder: 13,
    },
    // --- GRAPH PATTERNS ---
    {
      name: 'Breadth-First Search (BFS)',
      slug: 'bfs-shortest-path',
      groupSlug: 'graph',
      triggerCue: 'Shortest path in unweighted graph; minimum steps/moves to reach target state; level-by-level traversal of nodes; nearest/closest node queries; or multi-source shortest distance computation. Key question: Is the graph unweighted or are all edge weights equal? If yes -> BFS; if weighted -> Dijkstra\'s.',
      coreIdea: 'Utilize a FIFO queue. Enqueue the starting source node(s) and track their visited state. At each step, dequeue the current node, explore all its unvisited neighbors, record their distances, mark them visited immediately on enqueue to prevent duplicate entries, and push them to the queue.',
      whyItWorks: '1. Why BFS guarantees shortest path in unweighted graphs: Nodes are processed in strictly non-decreasing order of distance from the source. The first time a node is dequeued, it is guaranteed to have been reached via the shortest path; any subsequent path to it must contain at least as many or more edges. (Proof by contradiction: If a shorter path existed, the intermediate nodes on that path would have been enqueued earlier, meaning the node would have been dequeued and finalized sooner).\n2. Why this guarantee breaks in weighted graphs: With varying edge weights, "processed first" (fewest hops) no longer implies "reached via shortest total distance". A path with more edges and smaller weights can be shorter than a path with fewer edges and larger weights. This is why Dijkstra\'s uses a priority queue instead of a FIFO queue.\n3. Why multi-source BFS works: Enqueuing multiple sources simultaneously at distance 0 is mathematically equivalent to introducing a virtual super-source node connected to all real sources via directed edges of weight 0. Running a standard BFS from this virtual node yields the correct shortest distance to the nearest real source for all other vertices.',
      codeSkeleton: `// Breadth-First Search on adjacency list
void bfs(int start, const unordered_map<int, vector<int>>& adjList) {
    unordered_set<int> visited;
    queue<int> q;
    q.push(start);
    visited.insert(start);
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        // Process node
        for (int neighbor : adjList.at(node)) {
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
}`,
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      commonMistake: 'Failing to mark nodes as visited immediately upon enqueuing (doing it instead when dequeuing). This allows the same node to be enqueued multiple times from different paths, degrading the time complexity from O(V+E) to O(V*E) and potentially causing memory exhaustion.',
      comparisonNotes: 'Use BFS for finding shortest paths in unweighted graphs or grids. Use DFS for connectivity, cycle detection, or topological sorting. Use Dijkstra\'s for finding shortest paths in graphs with non-negative weights.',
      displayOrder: 1,
    },
    {
      name: 'Depth-First Search (DFS)',
      slug: 'dfs-traversal',
      groupSlug: 'graph',
      triggerCue: 'Connected components count; verification of path existence between two nodes; cycle detection (directed or undirected); all-paths exploration; or full component traversals. Key distinction: DFS goes deep before wide. Use DFS when you need to exhaustively explore entire paths, and BFS when you need shortest paths.',
      coreIdea: 'Use recursion (implied system stack) or an explicit LIFO stack. Mark the current node as visited, recursively traverse all its unvisited neighbors, and backtrack when no unvisited neighbors remain.',
      whyItWorks: '1. Why DFS correctly finds all connected components: By induction, any node reachable from the start vertex will eventually be visited because DFS recursively explores every adjacent neighbor. Backtracking only occurs when all neighbors are exhausted, ensuring no reachable node is left unvisited unless it was already processed.\n2. Why DFS cycle detection in directed graphs requires a recursion stack ("in-stack") set vs a simple "visited" set: A node in the general "visited" set was seen in some path but might belong to a completed, independent subtree (cross edge). A node in the "in-stack" set is active in the current recursion path. Encountering an adjacent neighbor that is currently "in-stack" indicates a back-edge, proving the existence of a cycle. General "visited" sets alone are insufficient and will yield false positives.\n3. Why DFS time complexity is O(V+E): Each vertex is pushed to the recursion stack exactly once (O(V)), and each edge is examined exactly once from each endpoint (O(E)).',
      codeSkeleton: `// Depth-First Search on adjacency list
void dfsHelper(int node, const unordered_map<int, vector<int>>& adjList, unordered_set<int>& visited) {
    visited.insert(node);
    // Process node
    for (int neighbor : adjList.at(node)) {
        if (visited.find(neighbor) == visited.end()) {
            dfsHelper(neighbor, adjList, visited);
        }
    }
}

void dfs(int start, const unordered_map<int, vector<int>>& adjList) {
    unordered_set<int> visited;
    dfsHelper(start, adjList, visited);
}`,
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V) for the recursion stack',
      commonMistake: 'Using only a general visited set instead of an active recursion stack set for cycle detection in directed graphs, which incorrectly identifies cross-edges as cycles.',
      comparisonNotes: 'Use DFS for exhaustive path-finding, topological sorting, and cycle detection. Use BFS for shortest path problems on unweighted graphs.',
      displayOrder: 2,
    },
    {
      name: 'Topological Sort',
      slug: 'topological-sort',
      groupSlug: 'graph',
      triggerCue: 'Ordering problems with dependencies; course prerequisite structures; task scheduling; build order systems; or any "if A must precede B" condition. Only applicable to Directed Acyclic Graphs (DAGs). If a cycle is present, a topological sort is impossible.',
      coreIdea: 'Two standard formulations: (1) Kahn\'s Algorithm (BFS-based): Compute in-degrees for all nodes, enqueue nodes with in-degree 0. While the queue is not empty, dequeue a node, add it to the ordering, decrement its neighbors\' in-degrees, and enqueue any neighbor whose in-degree becomes 0. (2) DFS-based: Execute DFS, and push a node onto a stack AFTER all its neighbors are fully processed (post-order). Reversing the final stack yields the topological order.',
      whyItWorks: '1. Why Kahn\'s algorithm produces a valid topological order: A node with an in-degree of 0 has no prerequisites, making it safe to schedule first. Once scheduled, removing it reduces the prerequisite counts of its neighbors. Any neighbor whose in-degree falls to 0 has had all its prerequisites met. By induction, every node is scheduled only after its dependencies.\n2. Why Kahn\'s detects cycles: In a graph with a cycle, the nodes within the cycle will never reach an in-degree of 0 because each depends on another node inside the cycle. Consequently, the queue will empty before processing all V vertices. If the final ordered list length is less than V, a cycle exists.\n3. Why DFS post-order gives a reverse topological order: If there is a dependency edge from A to B, DFS will visit and fully process B (and all its descendants) before backtracking to complete A. Thus, B is pushed onto the stack before A. When we reverse the stack, A is guaranteed to appear before B, satisfying the dependency.',
      codeSkeleton: `// Kahn's Algorithm (BFS-based Topological Sort)
vector<int> topoSort(int numNodes, const unordered_map<int, vector<int>>& adjList) {
    vector<int> inDegree(numNodes, 0);
    for (const auto& [node, neighbors] : adjList) {
        for (int neighbor : neighbors) {
            inDegree[neighbor]++;
        }
    }
    queue<int> q;
    for (int i = 0; i < numNodes; ++i) {
        if (inDegree[i] == 0) q.push(i);
    }
    vector<int> topoOrder;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        topoOrder.push_back(u);
        if (adjList.find(u) != adjList.end()) {
            for (int v : adjList.at(u)) {
                if (--inDegree[v] == 0) q.push(v);
            }
        }
    }
    return topoOrder.size() == numNodes ? topoOrder : vector<int>{}; // Cycle check
}`,
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      commonMistake: 'Failing to check if the length of the processed nodes equals V when using Kahn\'s algorithm on inputs that might contain cycles, resulting in an incomplete and invalid topological sort.',
      comparisonNotes: 'Kahn\'s algorithm is preferred when cycle detection is needed as part of the scheduling process. DFS-based is more concise for pure ordering of known DAGs.',
      displayOrder: 3,
    },
    {
      name: 'Union-Find (Disjoint Set Union)',
      slug: 'union-find',
      groupSlug: 'graph',
      triggerCue: 'Connected components; dynamic connectivity; detecting cycles in undirected graphs; minimum spanning tree (Kruskal\'s); or merging groups/clusters dynamically. Key signal: Repeated union (merging) and find (identifying group representative) queries.',
      coreIdea: 'Maintain parent pointers for elements. Representative elements are roots (parent[x] == x). `find(x)` follows pointers to the root. `union(x, y)` merges the roots of two elements. Implement path compression (point traversed nodes directly to root) and union by rank (attach shorter tree under taller tree) to keep the trees flat.',
      whyItWorks: '1. Why path compression works: In `find(x)`, setting the parent of all traversed nodes directly to the root shortens the tree depth for future searches. This preserves component membership while reducing subsequent `find` operations to O(1) complexity.\n2. Why union by rank prevents degenerate chains: Attaching the root of the tree with smaller depth (rank) to the root of the larger tree ensures tree height does not grow unless two trees of equal rank are merged. This bounds the maximum height of the tree to O(log V) even without path compression.\n3. Why the combination achieves near-O(1) amortized: Combining path compression and union by rank reduces the amortized time complexity per query to O(α(V)), where α is the inverse Ackermann function (which grows so slowly that α(V) <= 4 for all practical inputs). This is effectively O(1) in practice (proved formally using potential functions).\n4. Why Union-Find detects cycles in undirected graphs: Before merging two vertices u and v, we check if `find(u) === find(v)`. If they share a root, they already belong to the same connected component. Adding the edge (u, v) would create an alternative path, which implies a cycle.',
      codeSkeleton: `class UnionFind {
    vector<int> parent;
    vector<int> rank;
public:
    UnionFind(int n) : parent(n), rank(n, 0) {
        for (int i = 0; i < n; ++i) parent[i] = i;
    }
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]); // Path compression
    }
    bool unite(int i, int j) {
        int rootI = find(i);
        int rootJ = find(j);
        if (rootI == rootJ) return false;
        if (rank[rootI] < rank[rootJ]) {
            parent[rootI] = rootJ;
        } else if (rank[rootI] > rank[rootJ]) {
            parent[rootJ] = rootI;
        } else {
            parent[rootJ] = rootI;
            rank[rootI]++;
        }
        return true;
    }
};`,
      timeComplexity: 'O(α(V)) per operation, effectively O(1)',
      spaceComplexity: 'O(V)',
      commonMistake: 'Omitting union by rank and only implementing path compression. Without rank optimizations, a sequence of skewed unions can still degrade the tree structure to a chain of height O(V).',
      comparisonNotes: 'Use Union-Find for dynamic connectivity and cycle detection in undirected graphs. Use DFS/BFS for static connectivity. Use Kahn\'s for cycle detection in directed graphs.',
      displayOrder: 4,
    },
    {
      name: 'Dijkstra\'s Shortest Path',
      slug: 'dijkstra-shortest-path',
      groupSlug: 'graph',
      triggerCue: 'Shortest path in weighted graph; minimum cost path; all edge weights non-negative. Non-negotiable constraint: edge weights must be non-negative. If negative weights are present, Dijkstra\'s is invalid; use Bellman-Ford instead.',
      coreIdea: 'Maintain a min-priority queue storing pairs of `(distance, node)` and a `dist` array initialized to infinity. Start with source at distance 0. Greedily extract the node with the minimum current distance. For each neighbor, if `dist[u] + weight(u, v) < dist[v]`, update `dist[v]` and enqueue the neighbor with the new distance.',
      whyItWorks: '1. Why the greedy choice is safe (no negative weights): When a node u is extracted from the min-heap, its distance `dist[u]` is finalized. Because all edge weights are non-negative, any alternative path from the source to u through unvisited nodes must go through some node v currently in the frontier, where `dist[v] >= dist[u]`. Since weights are non-negative, the total distance of this alternative path must be `>= dist[v] >= dist[u]`. Hence, the current distance is optimal.\n2. Why negative edges break Dijkstra\'s: A negative weight edge can make a path through a "further" node shorter than the currently finalized "closest" path. Because Dijkstra\'s does not reprocess finalized nodes, it will miss the shorter path through the negative edge.\n3. Why lazy deletion (stale heap entries) is correct: Instead of updating priorities inside the heap (which is slow), we allow duplicate entries for the same node in the PQ. When a node is popped, if its recorded distance is greater than the current known minimum (`d > dist[u]`), we simply skip it because it represents a stale, suboptimal path.',
      codeSkeleton: `struct Edge {
    int target;
    int weight;
};

// Dijkstra's Shortest Path Algorithm
vector<int> dijkstra(int start, int numNodes, const unordered_map<int, vector<Edge>>& adjList) {
    vector<int> dist(numNodes, INT_MAX);
    dist[start] = 0;
    using pii = pair<int, int>;
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    pq.push({0, start});
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue;
        if (adjList.find(u) == adjList.end()) continue;
        for (const auto& edge : adjList.at(u)) {
            if (dist[u] + edge.weight < dist[edge.target]) {
                dist[edge.target] = dist[u] + edge.weight;
                pq.push({dist[edge.target], edge.target});
            }
        }
    }
    return dist;
}`,
      timeComplexity: 'O((V + E) log V) with binary heap',
      spaceComplexity: 'O(V + E)',
      commonMistake: 'Failing to check for the presence of negative edge weights before applying Dijkstra\'s, or not incorporating a visited check to skip stale popped entries, leading to O(E log V) redundant iterations.',
      comparisonNotes: 'Use Dijkstra\'s for shortest paths in non-negative weighted graphs. Use Bellman-Ford if negative weights exist. Use BFS for unweighted graphs.',
      displayOrder: 5,
    },
    {
      name: 'Bipartite Check / Graph Coloring',
      slug: 'bipartite-check',
      groupSlug: 'graph',
      triggerCue: 'Divide nodes into two groups; check if a graph is bipartite; can nodes be colored using 2 colors; no adjacent nodes share the same color; or conflict detection in scheduling. Key theorem: A graph is bipartite if and only if it contains no odd-length cycles.',
      coreIdea: 'Perform BFS or DFS. Assign color 0 to the source node, color 1 to all its neighbors, color 0 to their neighbors, and so on. If we attempt to color a neighbor that has already been colored, and its color matches the current node\'s color, the graph contains an odd-length cycle and is not bipartite.',
      whyItWorks: '1. Why 2-coloring detects bipartiteness: A graph is bipartite if we can partition its vertices into two independent sets such that all edges cross between the sets. BFS-based 2-coloring assigns alternating colors layer by layer. If an odd-length cycle exists, it will eventually force two adjacent nodes to be assigned the same color, generating a conflict that is detected during neighbor validation.\n2. Why we must run BFS/DFS from every unvisited node: A graph may consist of multiple disconnected components. Running the traversal from a single source only checks the reachable component; we must check all components independently to guarantee the entire graph is bipartite.',
      codeSkeleton: `// Check if graph is bipartite using BFS
bool isBipartite(int numNodes, const unordered_map<int, vector<int>>& adjList) {
    vector<int> color(numNodes, -1);
    for (int i = 0; i < numNodes; ++i) {
        if (color[i] == -1) {
            queue<int> q;
            q.push(i);
            color[i] = 0;
            while (!q.empty()) {
                int u = q.front();
                q.pop();
                if (adjList.find(u) == adjList.end()) continue;
                for (int v : adjList.at(u)) {
                    if (color[v] == -1) {
                        color[v] = 1 - color[u];
                        q.push(v);
                    } else if (color[v] == color[u]) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}`,
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      commonMistake: 'Only starting the bipartite check from node 0 and forgetting to loop through all nodes from 0 to V-1, which fails to detect odd cycles in disconnected components.',
      comparisonNotes: 'Bipartite check is a special case of graph coloring (k=2). For k > 2, graph coloring is an NP-hard problem.',
      displayOrder: 6,
    },
    {
      name: 'Island / Grid Traversal',
      slug: 'island-grid-traversal',
      groupSlug: 'graph',
      triggerCue: 'Grid-based traversals; 2D matrix paths; island counting; connected region tracking; flood fill; computing sizes of connected grid areas; or surrounded region capturing. Key model: Cells are nodes, and adjacent cells are implicit edges.',
      coreIdea: 'Perform BFS or DFS on a 2D grid. Iterate through each cell. When an unvisited land cell is found, run a traversal to visit all reachable adjacent land cells (moving in 4 or 8 directions). Mark cells visited either by mutating the grid value in-place (e.g., changing land \'1\' to water \'0\') or by using a 2D boolean visited array.',
      whyItWorks: '1. Why grid traversal maps to graph traversal: A grid is an implicit graph. Cells represent vertices, and edge relations are dynamically resolved using coordinate shifts (e.g., `[(0,1),(0,-1),(1,0),(-1,0)]`). This avoids building an explicit adjacency list.\n2. Why in-place marking is correct: Modifying a cell value directly in the grid (e.g. flipping \'1\' to \'0\') acts as a visited flag. Since the cell no longer matches the traversal condition, it will never be enqueued or processed again, saving O(R * C) auxiliary space.\n3. Why multi-source BFS is optimal for distance fields: Enqueuing all target cells simultaneously at distance 0 and propagating outward computes the minimum distance to the nearest target cell for all grid locations in a single O(R * C) pass. Running separate BFS operations from each source individually would take O(S * R * C) time, which is highly redundant.',
      codeSkeleton: `// Island Traversal using recursive DFS
void numIslandsDFS(vector<vector<char>>& grid, int r, int c) {
    int numRows = grid.size();
    int numCols = grid[0].size();
    if (r < 0 || r >= numRows || c < 0 || c >= numCols || grid[r][c] == '0') {
        return;
    }
    grid[r][c] = '0'; // Mark as visited
    numIslandsDFS(grid, r + 1, c);
    numIslandsDFS(grid, r - 1, c);
    numIslandsDFS(grid, r, c + 1);
    numIslandsDFS(grid, r, c - 1);
}`,
      timeComplexity: 'O(m * n) where m and n are the grid dimensions',
      spaceComplexity: 'O(m * n) for the visited array or recursion stack; O(1) auxiliary if mutating in-place',
      commonMistake: 'Failing to validate boundary bounds (0 <= r < rows and 0 <= c < cols) before performing array accesses, leading to index out of bounds exceptions.',
      comparisonNotes: 'Use DFS for simple connectivity counts and region marking. Use BFS for shortest path or step-count searches in a grid. Use multi-source BFS for nearest-distance matrix generations.',
      displayOrder: 7,
    },
    {
      name: 'Bellman-Ford',
      slug: 'bellman-ford',
      groupSlug: 'graph',
      triggerCue: 'Shortest path in weighted graph where negative edge weights may exist; negative cycle detection; or constraint propagation. Use this when Dijkstra\'s is disqualified due to negative edge weights.',
      coreIdea: 'Initialize distances to infinity (source to 0). Relax all E edges V-1 times. To detect negative cycles, perform one additional (V-th) relaxation pass. If any distance is updated during this V-th pass, a negative cycle exists.',
      whyItWorks: '1. Why V-1 iterations are sufficient: In a graph with V vertices, the shortest simple path between any two vertices can contain at most V-1 edges. Each iteration of the relaxation loop is guaranteed to find the shortest path of length at most k edges (where k is the iteration count). Thus, after V-1 passes, all shortest paths are finalized unless negative cycles are present.\n2. Why the V-th iteration detects negative cycles: If a node\'s distance can still be decreased after V-1 relaxations, there must exist a path of length >= V edges that is shorter than any path of length < V. This is only possible if the path contains a cycle whose sum of edge weights is negative, allowing infinite distance reductions by traversing it recursively.\n3. Why Bellman-Ford runs in O(VE) time: Because the algorithm does not rely on greedy selection or priority queues, it must relax every single edge globally in each iteration. This results in V-1 passes * E edges = O(VE) runtime.',
      codeSkeleton: `struct Edge {
    int src, dest, weight;
};

// Bellman-Ford Shortest Path Algorithm
vector<int> bellmanFord(int start, int numNodes, const vector<Edge>& edges) {
    vector<int> dist(numNodes, INT_MAX);
    dist[start] = 0;
    for (int i = 1; i <= numNodes - 1; ++i) {
        for (const auto& edge : edges) {
            if (dist[edge.src] != INT_MAX && dist[edge.src] + edge.weight < dist[edge.dest]) {
                dist[edge.dest] = dist[edge.src] + edge.weight;
            }
        }
    }
    for (const auto& edge : edges) {
        if (dist[edge.src] != INT_MAX && dist[edge.src] + edge.weight < dist[edge.dest]) {
            return {}; // Negative cycle
        }
    }
    return dist;
}`,
      timeComplexity: 'O(V * E)',
      spaceComplexity: 'O(V)',
      commonMistake: 'Omitting the V-th iteration cycle check when the problem statement requires detecting negative cycles, or failing to check if `dist[u] !== Infinity` before relaxing, which can lead to relaxing dummy unreachable paths.',
      comparisonNotes: 'Use Bellman-Ford when negative edge weights are present or when negative cycles must be detected. Use Dijkstra\'s for non-negative weighted graphs.',
      displayOrder: 8,
    },
    {
      name: 'Minimum Spanning Tree (MST)',
      slug: 'minimum-spanning-tree',
      groupSlug: 'graph',
      triggerCue: 'Connect all vertices with minimum total edge weight; build networks (cabling, pipes) at minimum cost; find minimum spanning trees. Key trait: Connecting all V vertices using exactly V-1 edges with minimum total cost.',
      coreIdea: 'Two main algorithms: (1) Kruskal\'s: Sort all E edges by weight. Greedily select the cheapest edge. If adding the edge does not create a cycle (validate using Union-Find), append it to the MST. Repeat until V-1 edges are selected. (2) Prim\'s: Start from a source node. Maintain a min-heap of candidate edges connecting visited vertices to unvisited vertices. Greedily add the minimum weight frontier edge, marking new vertices visited.',
      whyItWorks: '1. Why the cut property guarantees correctness: For any partition (cut) of vertices, the minimum weight edge that crosses the cut must belong to some MST of the graph. Prim\'s expands the cut around the growing tree, greedily choosing the cheapest frontier edge. Kruskal\'s considers cuts globally by sorting edges.\n2. Why Kruskal\'s DSU check works: Adding an edge (u, v) creates a cycle if and only if u and v are already in the same connected component. The Union-Find `find(u) === find(v)` query checks this condition in O(α(V)) time.\n3. Why Prim\'s differs from Dijkstra\'s: Dijkstra\'s minimizes cumulative distance from a source (`dist[u] + weight`); Prim\'s minimizes only the immediate edge cost to connect an unvisited node to the existing tree (`weight`). The PQ key in Prim\'s is the individual edge weight, not the cumulative distance.',
      codeSkeleton: `struct Edge {
    int src, dest, weight;
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

// Kruskal's Algorithm for Minimum Spanning Tree
vector<Edge> kruskal(int numNodes, vector<Edge>& edges) {
    sort(edges.begin(), edges.end());
    UnionFind uf(numNodes);
    vector<Edge> mst;
    for (const auto& edge : edges) {
        if (uf.unite(edge.src, edge.dest)) {
            mst.push_back(edge);
            if (mst.size() == numNodes - 1) break;
        }
    }
    return mst;
}`,
      timeComplexity: 'Kruskal\'s: O(E log E) or O(E log V); Prim\'s: O((V + E) log V) with binary heap',
      spaceComplexity: 'O(V + E)',
      commonMistake: 'Confusing MST with Single-Source Shortest Paths. An MST minimizes the sum of all edge weights in the tree; it does not guarantee the shortest path between any specific pair of nodes.',
      comparisonNotes: 'Kruskal\'s is typically faster for sparse graphs since edge sorting dominates. Prim\'s is faster for dense graphs when using Fibonacci or binary heaps.',
      displayOrder: 9,
    },
    // --- BINARY TREE PATTERNS ---
    {
      name: 'Tree Traversals',
      slug: 'tree-traversals',
      groupSlug: 'binary-tree',
      triggerCue: 'Inorder/preorder/postorder traversal; visiting all nodes in a tree; processing nodes in a specific order; or iterative traversal without recursion. Key property: Inorder traversal of a BST produces a strictly sorted sequence of values.',
      coreIdea: 'Three structural visit orderings: preorder (root->left->right), inorder (left->root->right), postorder (left->right->root). While recursive implementations are straightforward, iterative traversals use an explicit stack to simulate the call stack. For iterative inorder, go left as far as possible (pushing to stack), process the node on pop, and then move to its right child.',
      whyItWorks: '1. Why inorder traversal of a BST produces a sorted sequence: The BST property dictates that for any node, all values in its left subtree are strictly less than the node\'s value, and all values in its right subtree are strictly greater. Inorder traversal recursively visits the left subtree first (collecting all smaller values), then the node itself, and finally the right subtree (collecting all larger values). By induction on the subtree size, this ordering preserves the sorted order across all keys.\n2. Why iterative inorder uses a stack + current pointer pattern (rather than pre-pushing all nodes): Pre-pushing all nodes would require O(N) upfront work and space before processing the first node. The stack + current pointer pattern dynamically mirrors the recursive runtime call stack: pushing nodes as we "go left" until hitting null, popping to "process", and moving to the right child to initiate the next left-descending traversal.\n3. Why postorder is the natural choice for deletion/freeing nodes: To safely delete or free a node in memory, its children must be deleted first to prevent orphans or memory leaks. Postorder (left->right->root) guarantees that child subtrees are completely visited and processed before their parent node is visited.',
      codeSkeleton: `// 1. Recursive Traversals
void preorder(TreeNode* root, vector<int>& result) {
    if (!root) return;
    result.push_back(root->val);
    preorder(root->left, result);
    preorder(root->right, result);
}

// 2. Iterative Inorder Traversal
vector<int> inorderTraversal(TreeNode* root) {
    vector<int> result;
    stack<TreeNode*> s;
    TreeNode* curr = root;
    while (curr != nullptr || !s.empty()) {
        while (curr != nullptr) {
            s.push(curr);
            curr = curr->left;
        }
        curr = s.top();
        s.pop();
        result.push_back(curr->val);
        curr = curr->right;
    }
    return result;
}`,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h) where h is tree height (O(log n) balanced, O(n) worst case skewed)',
      commonMistake: 'Forgetting to include the current pointer in the outer loop condition of the iterative traversal. If you only write `while (stack.length > 0)`, the loop terminates prematurely when the stack is empty but the right child of the last processed node has not yet been explored.',
      comparisonNotes: 'Use recursive traversals for simplicity and readability. Switch to iterative traversals when call-stack overflow is a concern (e.g. extremely skewed, deep trees) or if Morris traversal is required to achieve O(1) space.',
      displayOrder: 1,
    },
    {
      name: 'Level Order / BFS on Tree',
      slug: 'level-order-bfs',
      groupSlug: 'binary-tree',
      triggerCue: 'Level by level node processing; level order traversal; right/left side view; zigzag tree traversal; average value of nodes at each level; maximum width of tree; or connecting next right pointers. Key signature: Any query that inspects or aggregates nodes sharing the same depth.',
      coreIdea: 'Use a queue-based Breadth-First Search (BFS). Before starting the processing loop for a level, snapshot the current size of the queue. This size represents the exact count of nodes belonging to that specific level. Process exactly that many nodes, enqueuing their non-null children as you go.',
      whyItWorks: '1. Why snapshotting queue size at level start correctly separates levels: At the start of processing level k, the queue contains exactly the nodes at level k (since all nodes from level k-1 were dequeued in the previous iteration, and only their children were enqueued). By running the inner loop exactly `size` times, we process all level-k nodes before evaluating the queue size again, preventing nodes of level k+1 from bleeding into the current level\'s processing.\n2. Why this approach is cleaner than null-sentinels: Null-sentinel designs require adding a null marker at the end of each level and re-adding it when encountered. This introduces edge cases (e.g., infinite loops on empty trees). The size-snapshot method requires no special sentinel values.\n3. Why right side view is the last node processed at each level: Since BFS processes children from left to right within each level, the last node dequeued in the level-processing loop is the rightmost node of that level, which is the only node visible from the right side.',
      codeSkeleton: `// Binary Tree Level Order Traversal
vector<vector<int>> levelOrder(TreeNode* root) {
    if (!root) return {};
    vector<vector<int>> result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int size = q.size();
        vector<int> currentLevel;
        for (int i = 0; i < size; ++i) {
            TreeNode* curr = q.front();
            q.pop();
            currentLevel.push_back(curr->val);
            if (curr->left) q.push(curr->left);
            if (curr->right) q.push(curr->right);
        }
        result.push_back(currentLevel);
    }
    return result;
}`,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(w) where w is the maximum width of the tree (up to O(n) for a complete binary tree\'s bottom level)',
      commonMistake: 'Directly calling `queue.length` inside the loop condition (e.g., `for (let i = 0; i < queue.length; i++)`) rather than snapshotting it beforehand. As children are enqueued, `queue.length` dynamically increases, blending levels together.',
      comparisonNotes: 'BFS/Level Order is ideal for properties tied to tree levels or depth boundaries. DFS is preferred for vertical properties like root-to-leaf paths or ancestor relationships.',
      displayOrder: 2,
    },
    {
      name: 'Tree Construction',
      slug: 'tree-construction',
      groupSlug: 'binary-tree',
      triggerCue: 'Construct a binary tree from preorder/postorder and inorder traversals; serialize and deserialize a binary tree; build a tree from a flat traversal representation; or reconstruct a tree structure. Key signature: Rebuilding trees from serialized sequences.',
      coreIdea: 'For reconstruction from traversals (e.g., preorder + inorder): The first element of the preorder array is always the root. Locate this root\'s index in the inorder array. All elements to the left of this index belong to the left subtree, and all elements to the right belong to the right subtree. Recurse. For serialization/deserialization, use a preorder traversal with null markers to explicitly capture leaf bounds.',
      whyItWorks: '1. Why preorder + inorder uniquely determines a binary tree: Preorder traversal provides the sequence of roots (first element of any slice is the subtree root), while inorder traversal provides the division of left and right subtrees. Finding the root\'s index in the inorder array reveals the exact size of the left and right subtrees, allowing us to split the preorder array correctly. Preorder + postorder is insufficient because without inorder size splits, one cannot distinguish if a node with a single child has a left or a right child.\n2. Why a HashMap is required for inorder index lookups: A naive linear scan to find the root\'s index in the inorder array takes O(N) time per recursion level, degrading the overall runtime to O(N²). Pre-populating a HashMap with `{ value: index }` reduces each lookup to O(1), achieving a linear O(N) total construction time.\n3. Why serialize with null markers allows unambiguous reconstruction: Storing null markers explicitly denotes empty children. Without them, a flat sequence of values is ambiguous (e.g., [1, 2] could be 1 with left child 2, or 1 with right child 2). Null markers represent the leaf boundaries, enabling a single-pass queue-based reconstruction.',
      codeSkeleton: `// Construct Binary Tree from Preorder and Inorder Traversal
TreeNode* buildTreeHelper(const vector<int>& preorder, int& preIdx, int inStart, int inEnd, const unordered_map<int, int>& inMap) {
    if (inStart > inEnd) return nullptr;
    int rootVal = preorder[preIdx++];
    TreeNode* root = new TreeNode(rootVal);
    int inIdx = inMap.at(rootVal);
    root->left = buildTreeHelper(preorder, preIdx, inStart, inIdx - 1, inMap);
    root->right = buildTreeHelper(preorder, preIdx, inIdx + 1, inEnd, inMap);
    return root;
}

TreeNode* buildTree(const vector<int>& preorder, const vector<int>& inorder) {
    unordered_map<int, int> inMap;
    for (int i = 0; i < inorder.size(); ++i) inMap[inorder[i]] = i;
    int preIdx = 0;
    return buildTreeHelper(preorder, preIdx, 0, inorder.size() - 1, inMap);
}`,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n) for HashMap index mapping and recursion call stack',
      commonMistake: 'OMITTING the HashMap optimization for inorder index lookups, which leads to O(N²) time complexity and results in Time Limit Exceeded (TLE) errors on large test inputs.',
      comparisonNotes: 'Preorder + Inorder and Postorder + Inorder constructions can rebuild any binary tree. A BST can be rebuilt from preorder alone because the sorted inorder sequence is implicitly known.',
      displayOrder: 3,
    },
    {
      name: 'Lowest Common Ancestor (LCA)',
      slug: 'lowest-common-ancestor',
      groupSlug: 'binary-tree',
      triggerCue: 'Find lowest common ancestor; LCA; common ancestor of two nodes; compute distance between two nodes; or locate the path connecting two nodes. Key signature: Finding the deepest node in a tree where two distinct paths diverge.',
      coreIdea: 'Use recursive DFS. If the current node is null, or matches node p, or matches node q, return the current node. Recurse left and right. If both subtrees return non-null values, the current node is the LCA. If only one returns a non-null value, propagate that non-null value upward.',
      whyItWorks: '1. Why both subtrees returning non-null proves the current node is the LCA: If recursing left yields one of the target nodes and recursing right yields the other, it means the targets are split between the left and right subtrees. The current node is the highest point where their paths intersect, making it the lowest common ancestor by definition.\n2. Why returning the one non-null result handles ancestor-descendant relationships: If p is an ancestor of q, the traversal will encounter p first. In this case, p itself is the LCA. The recursion returns p immediately, and the check on the other branch returns null. The non-null result (p) propagates up, which is correct since p contains q as a descendant.\n3. Why single-pass post-order DFS is optimal: To confirm that a node is the LCA, we must potentially inspect all subtrees to find the targets. A post-order traversal allows us to evaluate the state of both subtrees before making a decision at the parent node, completing the search in a single O(N) pass.',
      codeSkeleton: `// Lowest Common Ancestor of a Binary Tree
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);
    if (left && right) return root;
    return left ? left : right;
}`,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h) recursion call stack depth',
      commonMistake: 'Assuming the general LCA algorithm works if p or q might not exist in the tree. The standard algorithm returns p if it finds it, even if q is missing. If existence is not guaranteed, you must run a pre-check or use tracking flags.',
      comparisonNotes: 'For general Binary Trees, LCA requires exploring both subtrees, taking O(N) time. For BSTs, LCA can be found in O(H) time using the binary search property without traversing the entire tree.',
      displayOrder: 4,
    },
    {
      name: 'Tree Path Problems',
      slug: 'tree-path-problems',
      groupSlug: 'binary-tree',
      triggerCue: 'Path sum; root-to-leaf paths; maximum path sum; check if path exists with sum K; find all paths; or sum of root-to-leaf binary numbers. Key distinction: Root-to-leaf paths (must start at root and end at leaf) vs Any-to-any paths (can start and end at arbitrary nodes, going up and down).',
      coreIdea: 'For root-to-leaf paths, pass the remaining target sum down to the children and evaluate at the leaf. For any-to-any paths (such as Maximum Path Sum), calculate the maximum path sum through each node as a turning point (`val + max(0, leftGain) + max(0, rightGain)`). Track the global maximum while returning only the single-branch contribution (`val + max(leftGain, rightGain)`) to parent calls.',
      whyItWorks: '1. Why maximum path sum requires updating a global variable: An arbitrary path in a tree can have only one highest node (where it bends). We cannot return a full branching path (left + root + right) upward, as a parent node can only extend one child branch without branching. Therefore, at each node, we compute the maximum possible path that turns at that node, update a global max, and return only the best single-branch extension upward.\n2. Why clamping branch gains to 0 is correct: If a child subtree yields a negative sum, including it would reduce our path sum. Clamping negative gains to 0 (`max(0, gain)`) is equivalent to choosing to truncate the path at the current node instead of extending it into the negative subtree.\n3. Why root-to-leaf path sum passes the remaining target down: By subtracting the current node\'s value from the target sum as we descend, the check at the leaf simplifies to `leaf.val === targetSum`. This avoids having to track a running path history in memory.',
      codeSkeleton: `// 1. Root-to-Leaf Path Sum
bool hasPathSum(TreeNode* root, int targetSum) {
    if (!root) return false;
    if (!root->left && !root->right) return root->val == targetSum;
    return hasPathSum(root->left, targetSum - root->val) || hasPathSum(root->right, targetSum - root->val);
}

// 2. Binary Tree Maximum Path Sum
int maxPathSumHelper(TreeNode* root, int& maxSum) {
    if (!root) return 0;
    int leftMax = max(0, maxPathSumHelper(root->left, maxSum));
    int rightMax = max(0, maxPathSumHelper(root->right, maxSum));
    maxSum = max(maxSum, root->val + leftMax + rightMax);
    return root->val + max(leftMax, rightMax);
}

int maxPathSum(TreeNode* root) {
    int maxSum = INT_MIN;
    maxPathSumHelper(root, maxSum);
    return maxSum;
}`,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h) recursion call stack depth',
      commonMistake: 'For maximum path sum, returning the sum of both branches (`val + leftGain + rightGain`) from the helper function. This violates the path constraint because a valid path cannot contain branches (it can only extend through a single child to the parent).',
      comparisonNotes: 'Root-to-leaf paths are simple top-down traversals where state propagates downwards. Any-to-any path sum problems require a bottom-up post-order traversal to collect gains.',
      displayOrder: 5,
    },
    {
      name: 'Tree Diameter & Height',
      slug: 'tree-diameter-height',
      groupSlug: 'binary-tree',
      triggerCue: 'Height of tree; depth of tree; diameter of tree; longest path between any two nodes; check if binary tree is balanced; or minimum depth of tree. Key concept: Diameter is the length of the longest path between any two nodes, which does not necessarily pass through the root.',
      coreIdea: 'Compute heights recursively as `max(leftHeight, rightHeight) + 1`. At each node during this post-order traversal, the candidate diameter is `leftHeight + rightHeight`. Keep track of the maximum candidate diameter seen. For balanced check, return `-1` immediately if any subtree is unbalanced, avoiding redundant height checks.',
      whyItWorks: '1. Why diameter does not always pass through the root: In a tree with a deeply skewed left subtree that branches, the longest path might reside entirely within that left subtree. By calculating the diameter candidate `leftHeight + rightHeight` at every single node, we ensure we evaluate all possible bending points, not just the root.\n2. Why the balance check can be optimized with a `-1` sentinel: A naive balance check calls height at every node, resulting in O(N²) time. By returning `-1` as a sentinel value from our height helper when an imbalance is found, we propagate this failure up the call stack. Any parent node receiving `-1` from a child immediately returns `-1` without computing heights, resulting in O(N) time.\n3. Height definition variance: The height of a tree can be defined by the number of nodes or the number of edges. LeetCode defines the diameter as the number of edges on the longest path, which is equal to `leftHeight + rightHeight` if height is defined as the maximum edge depth to a leaf.',
      codeSkeleton: `// Height and Diameter in one pass
int getDiameter(TreeNode* root, int& diameter) {
    if (!root) return 0;
    int leftHeight = getDiameter(root->left, diameter);
    int rightHeight = getDiameter(root->right, diameter);
    diameter = max(diameter, leftHeight + rightHeight);
    return 1 + max(leftHeight, rightHeight);
}

int diameterOfBinaryTree(TreeNode* root) {
    int diameter = 0;
    getDiameter(root, diameter);
    return diameter;
}`,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h) recursion call stack depth',
      commonMistake: 'Only calculating `leftHeight + rightHeight` at the root node to find the diameter. This misses the longest path if it is contained entirely within a deep subtree.',
      comparisonNotes: 'Tree height is the maximum depth of a single branch. Tree diameter is the maximum distance between any two leaves, which is the sum of the heights of two branches at some node.',
      displayOrder: 6,
    },
    {
      name: 'Tree Symmetry & Comparison',
      slug: 'tree-symmetry-comparison',
      groupSlug: 'binary-tree',
      triggerCue: 'Symmetric tree; mirror image tree; same tree; subtree of another tree; or flip equivalent binary trees. Key property: Comparing structural and value invariants between two distinct trees or subtrees.',
      coreIdea: 'For same tree, check if both are null (true), one is null (false), or values mismatch (false), then recurse on their corresponding children. For symmetric tree, run a mirror comparison on the root\'s left and right subtrees, comparing `left.left` with `right.right` and `left.right` with `right.left`.',
      whyItWorks: '1. Why symmetric tree compares mirror pairs: Symmetry requires that if we fold the tree along the middle, the left and right halves match. Thus, the leftmost descendant of the left child must match the rightmost descendant of the right child (`left.left === right.right`), and the inner descendants must match (`left.right === right.left`). Comparing `left.left` with `right.left` would check for equality, not symmetry.\n2. Why naive subtree check is O(M*N) and how it can be optimized: The naive subtree check runs a `isSameTree` check at every node of the main tree, leading to O(N) nodes * O(M) same-tree comparison = O(M*N) time. While usually acceptable in interviews, it can be optimized to O(M+N) by serializing both trees with null markers and applying the KMP string matching algorithm.\n3. Why null-check order is critical: Placing the double-null check `(!p && !q)` first, followed by the single-null check `(!p || !q)`, guarantees that when we compare node values `(p.val === q.val)`, both pointers are confirmed non-null, preventing null reference errors.',
      codeSkeleton: `// 1. Same Tree
bool isSameTree(TreeNode* p, TreeNode* q) {
    if (!p && !q) return true;
    if (!p || !q) return false;
    return p->val == q->val && isSameTree(p->left, q->left) && isSameTree(p->right, q->right);
}

// 2. Symmetric Tree (Mirror Check)
bool isMirror(TreeNode* t1, TreeNode* t2) {
    if (!t1 && !t2) return true;
    if (!t1 || !t2) return false;
    return t1->val == t2->val && isMirror(t1->left, t2->right) && isMirror(t1->right, t2->left);
}

bool isSymmetric(TreeNode* root) {
    return isMirror(root, root);
}`,
      timeComplexity: 'O(n) for same/symmetric tree checks; O(m*n) for naive subtree check',
      spaceComplexity: 'O(h) recursion call stack depth',
      commonMistake: 'For symmetric tree checks, comparing `t1.left` with `t2.left` instead of `t2.right`. This checks if the subtrees are identical rather than being mirror images of each other.',
      comparisonNotes: 'Mirror symmetry checks require cross-recursing left and right branches. Equality checks recurse same-side branches.',
      displayOrder: 7,
    },
    {
      name: 'Morris Traversal',
      slug: 'morris-traversal',
      groupSlug: 'binary-tree',
      triggerCue: 'Inorder traversal in O(1) auxiliary space; traverse binary tree without recursion or stack; threaded binary tree; or constant space traversal. Key signature: The interviewer strictly prohibits stack or recursion memory allocations.',
      coreIdea: 'Traverse the tree by dynamically building temporary threads from inorder predecessors back to current nodes. For each node, if it has no left child, process it and move right. If it has a left child, find its inorder predecessor (rightmost node in the left subtree). If the predecessor\'s `right` is null, thread it to point to the current node and move left. If the predecessor\'s `right` is already pointing to current, remove the thread, process the current node, and move right.',
      whyItWorks: '1. Why threading the predecessor\'s right pointer to current node enables returning without a stack: normally, after processing the left subtree, we need to "come back" to the current node — that\'s what the call stack does in recursion. Morris creates a temporary link (thread) from the left subtree\'s rightmost node back to current, so after the left subtree is exhausted, natural right-pointer traversal returns to current automatically.\n2. Why the invariant "if thread exists -> we\'ve already processed left subtree" is safe: when we first visit a node with a left child, the predecessor\'s right is null — we set the thread. The second time we reach this node (via the thread), predecessor\'s right points to current — we know left subtree is done, so we visit current and go right. The thread is always unset before moving right, restoring the original tree structure.\n3. Why Morris traversal is genuinely O(1) space: no stack, no recursion stack, no visited array. Only two pointers (current and predecessor) used at any time. The tree itself is temporarily modified but fully restored by end of traversal.\n4. Why finding the predecessor takes O(1) amortized despite appearing O(n) per node: each node is visited as a predecessor at most twice (once to set thread, once to unset). Total predecessor-finding work across all nodes is O(n), not O(n²).',
      codeSkeleton: `// Morris Inorder Traversal
vector<int> morrisInorder(TreeNode* root) {
    vector<int> result;
    TreeNode* current = root;
    while (current != nullptr) {
        if (current->left == nullptr) {
            result.push_back(current->val);
            current = current->right;
        } else {
            TreeNode* pred = current->left;
            while (pred->right != nullptr && pred->right != current) {
                pred = pred->right;
            }
            if (pred->right == nullptr) {
                pred->right = current;
                current = current->left;
            } else {
                pred->right = nullptr;
                result.push_back(current->val);
                current = current->right;
            }
        }
    }
    return result;
}`,
      timeComplexity: 'O(n) amortized (each node is visited at most 3 times)',
      spaceComplexity: 'O(1) auxiliary space (modifies tree in-place temporarily)',
      commonMistake: 'Forgetting to restore the predecessor\'s right pointer to null when detecting an existing thread. This leaves the temporary thread in the tree, creating cyclic references and causing infinite loops in subsequent traversals.',
      comparisonNotes: 'Morris traversal is the only tree traversal algorithm that achieves O(1) auxiliary space. It does this by temporarily modifying and then restoring the tree\'s pointer structure.',
      displayOrder: 8,
    },
    // --- BINARY SEARCH TREE PATTERNS ---
    {
      name: 'BST Search & Validation',
      slug: 'bst-search-validation',
      groupSlug: 'binary-search-tree',
      triggerCue: 'Search in a Binary Search Tree; validate BST; verify if tree is a BST; find node in BST; or process nodes using the BST property. Key signature: The sorted nature of the inorder traversal (left < root < right).',
      coreIdea: 'For search, recursively move left if target is smaller than the current node, or right if it is larger. For validation, pass dynamic minimum and maximum bounds down the call stack, ensuring every node value falls strictly within `(min, max)`. Alternatively, perform an inorder traversal and verify that each node\'s value is strictly greater than the previously visited node\'s value.',
      whyItWorks: '1. Why comparing only with immediate parent is insufficient: A common mistake is validating a BST by simply comparing each node\'s value with its immediate left and right children. This approach fails to detect global subtree boundary violations. For example, consider a tree where the root is 10, the right child of the root is 15, and the left child of 15 is 8. The node 8 is greater than its parent\'s left child constraint (since it is a left child of 15, 8 < 15 is locally valid). However, because 8 is in the right subtree of the root (10), it violates the global BST property that all nodes in the right subtree of 10 must be strictly greater than 10. Locally, every node is valid, but globally the tree is invalid.\n2. Why bounds-passing catches global violations: To enforce the global BST property, we must validate that every node falls within a valid range `(min, max)`. When traversing to a left child, the maximum allowable value is updated to the parent\'s value (forcing all left descendants to be smaller than the parent). When traversing to a right child, the minimum allowable value is updated to the parent\'s value (forcing all right descendants to be larger than the parent). These bounds propagate down the recursion tree, ensuring that every node satisfies the constraints of all its ancestors, not just its immediate parent.\n3. Inorder traversal with a previous pointer as a constant-space alternative: By definition, the inorder traversal of a BST visits nodes in strictly ascending order. Thus, an alternative validation technique is to perform an inorder traversal while maintaining a reference to the previously visited node (`prev`). At each node, we assert that its value is strictly greater than `prev.val`. If this condition holds true for all nodes, the tree is a valid BST. This avoids passing min/max boundaries and can be implemented iteratively or recursively with only a single state variable tracking `prev`, achieving O(1) auxiliary space (excluding recursion stack space, or fully O(1) if combined with Morris traversal).',
      codeSkeleton: `// 1. Recursive BST Search
TreeNode* searchBST(TreeNode* root, int val) {
    if (!root || root->val == val) return root;
    return val < root->val ? searchBST(root->left, val) : searchBST(root->right, val);
}

// 2. Bounds-based BST Validation
bool validate(TreeNode* node, long long minVal, long long maxVal) {
    if (!node) return true;
    if (node->val <= minVal || node->val >= maxVal) return false;
    return validate(node->left, minVal, node->val) && validate(node->right, node->val, maxVal);
}

bool isValidBST(TreeNode* root) {
    return validate(root, LLONG_MIN, LLONG_MAX);
}`,
      timeComplexity: 'O(h) for search (where h is height); O(n) for validation',
      spaceComplexity: 'O(h) recursion call stack depth',
      commonMistake: 'Validating a BST by comparing each node only with its direct left and right children. This misses cases where a node deep inside a subtree violates a boundary defined by a higher ancestor.',
      comparisonNotes: 'Search in a balanced BST is O(log N), providing a logarithmic time advantage over general Binary Trees. Validation always requires O(N) time since every node must be visited to verify correctness.',
      displayOrder: 1,
    },
    {
      name: 'BST Insert & Delete',
      slug: 'bst-insert-delete',
      groupSlug: 'binary-search-tree',
      triggerCue: 'Insert into a Binary Search Tree; delete node from BST; remove node from BST; find inorder successor; or find inorder predecessor. Key signature: Restructuring a BST while maintaining its sorted property.',
      coreIdea: 'For insertion, search left or right until encountering null, and insert the new node. For deletion, find the target node and resolve three cases: (1) no children: remove node, (2) one child: replace node with its child, (3) two children: replace the node\'s value with its inorder successor\'s value (minimum in the right subtree), then delete the inorder successor from the right subtree.',
      whyItWorks: '1. Why the inorder successor is chosen for two-child deletions: The inorder successor is the smallest value in the right subtree. Because it is greater than all nodes in the left subtree (which are smaller than the parent) and smaller than all remaining nodes in the right subtree, replacing the deleted node\'s value with the successor\'s value preserves the BST invariants.\n2. Why deleting the inorder successor is guaranteed to be a single-child case: By definition, the inorder successor is the leftmost node in the right subtree. If it had a left child, that left child would have a smaller value, making it the successor instead. Therefore, the successor node cannot have a left child, meaning its deletion falls into case 1 (no children) or case 2 (right child only), preventing infinite recursion.\n3. Why BST insertion maintains invariants inductively: Since insertion always occurs at a leaf, we do not restructure existing subtrees. By choosing the left branch when `val < root.val` and the right branch when `val > root.val`, we guarantee that the new leaf satisfies all BST constraints along its path.',
      codeSkeleton: `// Insert node into BST
TreeNode* insertIntoBST(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) {
        root->left = insertIntoBST(root->left, val);
    } else {
        root->right = insertIntoBST(root->right, val);
    }
    return root;
}

// Delete node from BST
TreeNode* deleteNode(TreeNode* root, int key) {
    if (!root) return nullptr;
    if (key < root->val) {
        root->left = deleteNode(root->left, key);
    } else if (key > root->val) {
        root->right = deleteNode(root->right, key);
    } else {
        if (!root->left) {
            TreeNode* temp = root->right;
            delete root;
            return temp;
        }
        if (!root->right) {
            TreeNode* temp = root->left;
            delete root;
            return temp;
        }
        TreeNode* successor = root->right;
        while (successor->left != nullptr) {
            successor = successor->left;
        }
        root->val = successor->val;
        root->right = deleteNode(root->right, successor->val);
    }
    return root;
}`,
      timeComplexity: 'O(h) for insertion and deletion (where h is the tree height)',
      spaceComplexity: 'O(h) recursion call stack depth',
      commonMistake: 'For two-child deletions, trying to perform pointer surgery to swap the nodes instead of simply copying the successor\'s value into the target node. Copying the value is simpler and less prone to breaking subtree relationships.',
      comparisonNotes: 'Insertion always creates a new leaf node and is relatively simple. Deletion requires restructuring the tree when the target node has children.',
      displayOrder: 2,
    },
    {
      name: 'BST Construction',
      slug: 'bst-construction',
      groupSlug: 'binary-search-tree',
      triggerCue: 'Convert sorted array to BST; convert sorted list to BST; build a height-balanced BST; or construct BST from preorder traversal. Key signature: Building a height-balanced search tree from an ordered input sequence.',
      coreIdea: 'To construct a balanced BST from a sorted array, select the middle element as the root, and recurse on the left half (left subtree) and the right half (right subtree). To convert a sorted linked list in O(N) time, simulate an inorder traversal by building the left subtree, linking the root to the current list node, advancing the list pointer, and then building the right subtree.',
      whyItWorks: '1. Why picking the middle element ensures a height-balanced BST: At each recursion step, selecting the middle element splits the remaining items as evenly as possible. The sizes of the left and right subtrees differ by at most 1. By induction, this symmetric partitioning bounds the tree height to O(log N).\n2. Why inorder simulation converts a sorted list to BST in O(N) time: A naive divide-and-conquer approach on a linked list requires finding the middle node using slow/fast pointers at each step, resulting in O(N log N) time. The inorder simulation builds the BST in the exact order the linked list is traversed. By constructing nodes bottom-up, we convert the list in a single O(N) pass with O(log N) stack space.\n3. BST construction from preorder traversal: Since preorder lists the root first, we can reconstruct the BST in O(N) time by passing a valid range constraint down. We only consume a preorder value to create a node if it fits within the bounds for the current subtree branch.',
      codeSkeleton: `// Sorted Array to Balanced BST
TreeNode* sortedArrayToBSTHelper(const vector<int>& nums, int left, int right) {
    if (left > right) return nullptr;
    int mid = left + (right - left) / 2;
    TreeNode* node = new TreeNode(nums[mid]);
    node->left = sortedArrayToBSTHelper(nums, left, mid - 1);
    node->right = sortedArrayToBSTHelper(nums, mid + 1, right);
    return node;
}

TreeNode* sortedArrayToBST(const vector<int>& nums) {
    return sortedArrayToBSTHelper(nums, 0, nums.size() - 1);
}`,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(log n) recursion call stack depth for balanced results',
      commonMistake: 'Using a slow/fast pointer check to find the middle element of a linked list at each recursion level, which increases the time complexity to O(N log N) instead of using the O(N) inorder simulation.',
      comparisonNotes: 'Sorted arrays can be indexed in O(1) time, making divide-and-conquer construction simple. Linked lists require inorder simulation to avoid linear scanning overhead.',
      displayOrder: 3,
    },
    {
      name: 'BST Range Problems',
      slug: 'bst-range-problems',
      groupSlug: 'binary-search-tree',
      triggerCue: 'Range sum of BST; kth smallest element in BST; trim BST; or find all values between L and R. Key signature: Pruning subtrees that fall entirely outside the target range.',
      coreIdea: 'Traverse the tree, but prune subtrees based on range boundaries. For example, in range sum, if the current node\'s value is less than or equal to the lower bound L, do not recurse into the left subtree. For trimming, if the current node is less than L, discard it and return the trimmed right subtree.',
      whyItWorks: '1. Why BST range checks allow subtree pruning: The BST property guarantees that all nodes in the left subtree are smaller than the parent. If a parent node\'s value is already smaller than the range limit L, all its left descendants must also be smaller than L. Thus, we can safely prune the left subtree from our traversal, reducing the search space.\n2. Why augmented BSTs can find the K-th smallest element in O(log N) time: A standard search for the K-th smallest node runs an inorder traversal up to K nodes, taking O(K) time (which can be O(N)). If each node is augmented to store the size of its left subtree, we can binary search: if `leftSize === k - 1`, the root is the target; if `leftSize >= k`, the target lies in the left subtree; otherwise, search the right subtree with an adjusted K.',
      codeSkeleton: `// Range Sum of BST
int rangeSumBST(TreeNode* root, int low, int high) {
    if (!root) return 0;
    if (root->val < low) return rangeSumBST(root->right, low, high);
    if (root->val > high) return rangeSumBST(root->left, low, high);
    return root->val + rangeSumBST(root->left, low, high) + rangeSumBST(root->right, low, high);
}`,
      timeComplexity: 'O(n) worst case; O(log n + count) average case with pruning',
      spaceComplexity: 'O(h) recursion call stack depth',
      commonMistake: 'Visiting all nodes in a range query without using pruning checks, which negates the O(log N) search advantage of the Binary Search Tree.',
      comparisonNotes: 'Range sum queries on general Binary Trees require visiting every node. BSTs allow us to skip subtrees that fall outside the target bounds.',
      displayOrder: 4,
    },
    {
      name: 'BST to Other Structures',
      slug: 'bst-to-other-structures',
      groupSlug: 'binary-search-tree',
      triggerCue: 'Convert BST to greater sum tree; BST to doubly linked list; flatten BST; or convert BST to a sorted array. Key signature: Repurposing BST pointers to build linear structures.',
      coreIdea: 'For a Greater Sum Tree, perform a reverse inorder traversal (right->root->left) while maintaining a running sum of all visited nodes. For converting a BST to a doubly linked list, perform an inorder traversal and update the left pointers to act as `prev` and the right pointers to act as `next`.',
      whyItWorks: '1. Why reverse inorder traversal works for Greater Sum Trees: A standard inorder traversal (left->root->right) visits nodes in ascending order. Reversing the traversal (right->root->left) visits them in descending order. This means that when we visit a node, all nodes with greater values have already been processed, and the running sum represents the sum of all greater nodes.\n2. Why BST-to-doubly-linked-list can be done in O(1) auxiliary space: A BST node has left and right pointers, and a doubly linked list node has prev and next pointers. During an inorder traversal, we can update the left pointer to point to the previously visited node and the previous node\'s right pointer to point to the current node, converting the tree in-place without allocating new memory.',
      codeSkeleton: `// Flatten BST to sorted circular Doubly Linked List in-place
void helper(TreeNode* node, TreeNode*& prev, TreeNode*& first) {
    if (!node) return;
    helper(node->left, prev, first);
    if (prev) {
        prev->right = node;
        node->left = prev;
    } else {
        first = node;
    }
    prev = node;
    helper(node->right, prev, first);
}

TreeNode* treeToDoublyList(TreeNode* root) {
    if (!root) return nullptr;
    TreeNode* prev = nullptr;
    TreeNode* first = nullptr;
    helper(root, prev, first);
    first->left = prev;
    prev->right = first;
    return first;
}`,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h) recursion call stack depth; O(1) auxiliary space for in-place pointer updates',
      commonMistake: 'For Greater Sum Trees, using a standard inorder traversal instead of a reverse inorder traversal. A standard inorder traversal yields the sum of all smaller values instead of greater values.',
      comparisonNotes: 'These operations convert tree structures into linear structures by taking advantage of the sorted ordering of the nodes.',
      displayOrder: 5,
    },
    {
      name: 'Balanced BST',
      slug: 'balanced-bst',
      groupSlug: 'binary-search-tree',
      triggerCue: 'Height-balanced BST; AVL tree rebalancing; convert unbalanced BST to balanced; or balance a BST. Key signature: Ensuring the difference in height between subtrees remains at most 1.',
      coreIdea: 'To balance an unbalanced BST, extract the nodes in sorted order using an inorder traversal, and then reconstruct a balanced BST from the sorted array. AVL trees maintain balance dynamically by performing left and right rotations at unbalanced nodes after insertions and deletions.',
      whyItWorks: '1. Why inorder traversal + reconstruction balances a BST in O(N) time: An inorder traversal of any BST extracts the keys in sorted order. Rebuilding the tree from this sorted array by recursively choosing the middle element as the root guarantees a balanced tree with a height of O(log N). This approach is simple, robust, and safe for interviews.\n2. Why AVL rotations restore balance while preserving the BST property: Rotations change the tree structure locally without altering the inorder key order. A right rotation on node X with left child Y makes Y the parent and X the right child, preserving the property that left subtree < parent < right subtree.\n3. Why height balance guarantees O(log N) search times: By keeping the heights of the left and right subtrees within 1 of each other, the maximum tree height is mathematically bounded to `2 * log2(N)`. This ensures that all search, insertion, and deletion operations run in logarithmic time.',
      codeSkeleton: `// Convert unbalanced BST to a balanced BST statically
void storeInorder(TreeNode* root, vector<TreeNode*>& nodes) {
    if (!root) return;
    storeInorder(root->left, nodes);
    nodes.push_back(root);
    storeInorder(root->right, nodes);
}

TreeNode* buildBalancedTree(const vector<TreeNode*>& nodes, int start, int end) {
    if (start > end) return nullptr;
    int mid = start + (end - start) / 2;
    TreeNode* root = nodes[mid];
    root->left = buildBalancedTree(nodes, start, mid - 1);
    root->right = buildBalancedTree(nodes, mid + 1, end);
    return root;
}

TreeNode* balanceBST(TreeNode* root) {
    vector<TreeNode*> nodes;
    storeInorder(root, nodes);
    return buildBalancedTree(nodes, 0, nodes.size() - 1);
}`,
      timeComplexity: 'O(n) for static rebalancing; O(log n) for AVL rotations',
      spaceComplexity: 'O(n) space for the sorted node array',
      commonMistake: 'Failing to disconnect the left and right child pointers of nodes when collecting them in the sorted array, which can lead to cyclic references during reconstruction.',
      comparisonNotes: 'Static rebalancing is simple and runs in O(N) time but is not suitable for dynamic updates. AVL trees maintain balance dynamically on each insertion and deletion in O(log N) time.',
      displayOrder: 6,
    },
    {
      name: 'Basic Recursion',
      slug: 'basic-recursion',
      groupSlug: 'recursion-backtracking',
      triggerCue: 'compute Nth value in a sequence, break problem into identical subproblem of smaller size, no explicit undo needed, mathematical recurrence relation. Key questions: what is the base case? what is the recursive case? how does the call stack unwind to give the answer?',
      coreIdea: 'Define base case (smallest input with known answer). Define recursive case (reduce problem size by 1 or factor, combine result). Trust the recursion — assume the recursive call returns the correct answer for smaller input, build the answer for current input from it.',
      whyItWorks: '1. Why recursion is equivalent to mathematical induction: The base case of recursion corresponds to the base case of mathematical induction (proving the base statement is true for the smallest input). The recursive case corresponds to the inductive step (assuming the statement holds true for input size n-1, and proving it for n). When writing code like `return f(n-1) + something`, you rely on this inductive hypothesis: you assume the recursive call `f(n-1)` computes the correct value for n-1, and you build the correct value for n using that result.\n2. Why call stack depth = recursion depth and why this matters for space complexity: Every recursive call allocates a stack frame to store local variables, parameters, and the return address. In linear recursion (one self-call per level), the call stack grows to size O(n). In tree recursion (multiple calls per level like naive Fibonacci), the stack depth is O(h) where h is the tree height, but the total number of calls grows exponentially (e.g. O(2^n)). Exceeding the system\'s call stack frame limit (~10^4 to 10^5 frames) causes stack overflow.\n3. Why fast exponentiation reduces O(n) to O(log n) time: Naive recursion computes x^n = x * x^(n-1), requiring n multiplications. Fast exponentiation utilizes x^n = (x^(n/2))^2 for even n (and x * (x^((n-1)/2))^2 for odd n), halving the exponent at each level. This reduces the recursion tree height and total operations to O(log n), demonstrating the power of the recursive "divide by half" pattern.',
      codeSkeleton: `// Linear Recursion: Fibonacci
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

// Divide-and-Conquer Recursion: Fast Power (Pow(x, n))
double myPow(double x, long long n) {
    if (n == 0) return 1.0;
    if (n < 0) {
        x = 1.0 / x;
        n = -n;
    }
    double half = myPow(x, n / 2);
    if (n % 2 == 0) {
        return half * half;
    } else {
        return half * half * x;
    }
}`,
      timeComplexity: 'O(n) for linear recursion; O(log n) for divide-and-conquer; O(2^n) for naive tree recursion',
      spaceComplexity: 'O(n) for call stack depth (linear); O(log n) for divide-and-conquer',
      commonMistake: 'Missing or incorrect base case — infinite recursion until stack overflow. Always identify what the smallest valid input is and handle it explicitly before the recursive call.',
      comparisonNotes: 'Pure recursion for problems with no choice to undo; backtracking when exploring multiple choices and needing to undo invalid ones; dynamic programming when recursion has overlapping subproblems worth memoizing',
      displayOrder: 1,
    },
    {
      name: 'Subsequences Pattern (Pick / Not Pick)',
      slug: 'subsequences-pattern',
      groupSlug: 'recursion-backtracking',
      triggerCue: 'all subsets, all subsequences, generate all combinations, power set, sum equals target from elements, pick any number of elements. Key mental model: at each index, make a binary decision — include this element or exclude it. This generates all 2^n possible subsets.',
      coreIdea: 'At each index, two choices: pick (include current element, recurse on rest) or not pick (skip current element, recurse on rest). Base case: when index reaches end, record current subset. For duplicates (Subsets II): sort first, then skip duplicate elements at the same recursion level (same depth, same position in sorted order).',
      whyItWorks: '1. Why pick/not-pick generates exactly all 2^n subsets with no duplicates (for distinct elements): At each of the n indices, the recursion tree forks into exactly two independent choices (include or exclude the current element). By the multiplication principle of combinatorics, the total number of unique paths through the decision tree is 2 * 2 * ... * 2 (n times) = 2^n. Each path represents a distinct choice sequence, ensuring all subsets are generated exactly once.\n2. Why sorting + skipping duplicates at the same level works for Subsets II: After sorting the input array, duplicate values become adjacent. At any recursion level (same depth, same index of placement), if we have already explored the branch where we picked arr[i], choosing the same value arr[i+1] (where arr[i+1] == arr[i]) at the SAME level would generate duplicate subsets. Skipping identical elements at the same recursion level (using `if (i > start && arr[i] == arr[i-1]) continue;`) avoids duplicates, while allowing the same values to be picked at deeper levels (different positions in the subset).\n3. Why Combination Sum allows picking the same element multiple times (unbounded): The recursive call for the "pick" choice does not advance the element index (it stays at current index), allowing the same element to be chosen repeatedly. The "not pick" choice advances the index to ensure progress. The recursion is safely bounded by pruning when the running sum equals or exceeds the target.',
      codeSkeleton: `// 1. Subsets (Pick / Not Pick)
void getSubsets(vector<int>& nums, int index, vector<int>& current, vector<vector<int>>& result) {
    if (index == nums.size()) {
        result.push_back(current);
        return;
    }
    // Decision 1: Pick the element
    current.push_back(nums[index]);
    getSubsets(nums, index + 1, current, result);
    current.pop_back(); // Backtrack
    
    // Decision 2: Not Pick the element
    getSubsets(nums, index + 1, current, result);
}

// 2. Subsets II (Sorting + Duplicate Skipping at the same level)
void getSubsetsWithDup(vector<int>& nums, int start, vector<int>& current, vector<vector<int>>& result) {
    result.push_back(current);
    for (int i = start; i < nums.size(); ++i) {
        if (i > start && nums[i] == nums[i-1]) continue; // Skip duplicates at same level
        current.push_back(nums[i]);
        getSubsetsWithDup(nums, i + 1, current, result);
        current.pop_back(); // Backtrack
    }
}

// 3. Combination Sum (Unbounded pick without index advance)
void findCombinations(vector<int>& candidates, int index, int target, vector<int>& current, vector<vector<int>>& result) {
    if (target == 0) {
        result.push_back(current);
        return;
    }
    if (index == candidates.size() || target < 0) return;
    
    // Decision 1: Pick current element (do not advance index to allow reuse)
    current.push_back(candidates[index]);
    findCombinations(candidates, index, target - candidates[index], current, result);
    current.pop_back(); // Backtrack
    
    // Decision 2: Skip current element (advance index)
    findCombinations(candidates, index + 1, target, current, result);
}`,
      timeComplexity: 'O(2^n) for subsets; O(2^n * n) including copying subsets to result; O(2^(target/min_element)) for Combination Sum',
      spaceComplexity: 'O(n) recursion depth; O(2^n * n) for storing all subsets',
      commonMistake: 'For Subsets II, skipping duplicates at all levels instead of only at the same recursion level — this incorrectly prunes valid subsets that use the same value at different positions',
      comparisonNotes: 'Pure recursion generates combinations without backtrack; pick/not-pick backtracking manages a dynamic path array; DP is preferred if we only need the count of subsets instead of actual combinations',
      displayOrder: 2,
    },
    {
      name: 'Permutations Pattern',
      slug: 'permutations-pattern',
      groupSlug: 'recursion-backtracking',
      triggerCue: 'all permutations, all arrangements, all orderings, letter combinations, rearrange elements. Key distinction from subsets: ORDER matters. [1,2] and [2,1] are different permutations but the same subset.',
      coreIdea: 'Two approaches: (1) Visited array: at each position, try every unvisited element, mark visited, recurse, unmark (backtrack). (2) Swapping: swap current index with each subsequent index, recurse on rest, swap back (restore). For duplicates (Permutations II): sort + skip if same value already placed at current position in this recursion level.',
      whyItWorks: '1. Why total permutations = n! and why the recursion tree has n! leaves:\nAt the first position (index 0), we have n choices. Once the first choice is made, we are left with n - 1 choices for the second position. Continuing this process, at the k-th position we have n - k + 1 remaining choices. By the fundamental counting principle (multiplication principle), the total number of unique sequences is n * (n - 1) * (n - 2) * ... * 1 = n!. This results in a recursion tree where every root-to-leaf path is of length n, culminating in exactly n! leaf nodes, each representing a unique, complete permutation.\n2. Why the swap-and-recurse approach generates all permutations without a visited array:\nThe swap-and-recurse method partitions the array into a fixed prefix [0..d-1] and a suffix [d..n-1] to be permuted. At recursion depth d, we iterate through index i from d to n - 1, and swap the element at index d with the element at index i. This swap brings the element at index i to the front of the active suffix, making it the chosen element at position d. We then recurse on the remaining suffix [d+1..n-1]. Because i ranges across all indices of the remaining suffix, every available element is placed at position d exactly once. Once we reach depth n - 1, the suffix has length 1, representing a completed permutation. This approach avoids the O(n) auxiliary space and lookup time of a visited array by using the input array\'s layout to implicitly track available choices.\n3. Why the unmark/swap-back step (backtracking) is essential — what goes wrong without it:\nWithout the backtracking step, modifications to the shared search state spill over into sibling branches of the recursion tree, corrupting the search space.\nIn the visited-array approach, failing to unmark an element (setting visited[i] = false) after returning from a recursive call means that element remains permanently marked as \'used\' for all subsequent sibling branches. Consequently, the search tree undercounts permutations, generating only a single lexicographical path (e.g., [1, 2, 3]) while leaving all other branches at the same depth restricted from choosing those numbers.\nIn the swap-and-recurse approach, failing to swap back (re-executing swap(arr[d], arr[i]) after recursing) leaves the array in a modified, scrambled state. When the loop advances to index i + 1, it swaps from a corrupted sequence rather than the original starting state at depth d. This violates the invariant that we are swapping the original element at position d with each subsequent element, causing the algorithm to skip valid arrangements entirely, generate duplicate permutations, and leave the input array permanently scrambled.',
      codeSkeleton: `// 1. Permutations using Visited Array
void permuteVisited(vector<int>& nums, vector<bool>& visited, vector<int>& current, vector<vector<int>>& result) {
    if (current.size() == nums.size()) {
        result.push_back(current);
        return;
    }
    for (int i = 0; i < nums.size(); ++i) {
        if (visited[i]) continue;
        visited[i] = true;
        current.push_back(nums[i]);
        permuteVisited(nums, visited, current, result);
        current.pop_back(); // Backtrack
        visited[i] = false; // Backtrack
    }
}

// 2. Permutations using Swapping
void permuteSwap(vector<int>& nums, int start, vector<vector<int>>& result) {
    if (start == nums.size()) {
        result.push_back(nums);
        return;
    }
    for (int i = start; i < nums.size(); ++i) {
        swap(nums[start], nums[i]);
        permuteSwap(nums, start + 1, result);
        swap(nums[start], nums[i]); // Backtrack (Restore)
    }
}`,
      timeComplexity: 'O(n! * n) — n! permutations, each takes O(n) to copy',
      spaceComplexity: 'O(n) recursion depth + O(n) for current permutation being built',
      commonMistake: 'Forgetting the unmark/swap-back step — the single most common backtracking bug. Without it, the recursion tree doesn\'t correctly explore all branches.',
      comparisonNotes: 'Visited array is easier to maintain lexicographical order; swapping is more space-efficient (in-place) but scrambles the array during processing.',
      displayOrder: 3,
    },
    {
      name: 'Backtracking on Grid',
      slug: 'backtracking-grid',
      groupSlug: 'recursion-backtracking',
      triggerCue: 'path in grid, move through matrix, find path from source to destination, all paths in 2D grid, word in grid/matrix, explore grid with constraints. Key: grid cells are nodes, valid moves are edges — this is graph DFS with backtracking to explore ALL valid paths.',
      coreIdea: 'Mark current cell as visited (to avoid revisiting in current path). Try all valid directions (up/down/left/right). Recurse. Unmark cell (backtrack) when done exploring all directions from this cell. For Word Search: match characters as you move, backtrack when character mismatch or out of bounds.',
      whyItWorks: '1. Why marking + unmarking (backtracking) is necessary for "all paths" problems but not for "does path exist" problems: If we only need to verify if a path exists, once a cell is visited and found to lead to a dead end, it can remain marked as visited because no other path through it can lead to the target. However, in "all paths" or "all combinations" problems, a cell may be part of multiple valid paths using different routes. Permanently marking a cell as visited would block those alternative valid routes, leading to incomplete results. Backtracking (unmarking) restores the cell for other search branches.\n2. Why Word Search uses the cell itself as a visited marker (temporarily modifying the grid) to achieve O(1) auxiliary space: To avoid the O(M * N) memory overhead of a visited grid, we replace the current character in the board with a placeholder character like \'#\' before recursing. Since \'#\' does not match any character in the search string, the grid naturally prevents cycles. Upon returning from the recursion, we restore the original character, resetting the board state for other paths.\n3. Why the time complexity of Word Search is O(M * N * 4^L) vs O(M * N * 3^L): At the starting cell, we can move in 4 directions. In naive implementations that do not pass down the direction of entry to prevent reversing (or if they check all 4 neighbors indiscriminately), we branch by a factor of 4 at every cell, resulting in O(M * N * 4^L) calls where L is the word length. If the algorithm tracks and avoids returning to the immediate parent cell, the branching factor reduces to 3 for all subsequent steps, giving O(M * N * 3^L) complexity.',
      codeSkeleton: `// Word Search in Grid
bool dfs(vector<vector<char>>& board, string& word, int r, int c, int index) {
    if (index == word.length()) return true;
    if (r < 0 || c < 0 || r >= board.size() || c >= board[0].size() || board[r][c] != word[index]) {
        return false;
    }
    
    char temp = board[r][c];
    board[r][c] = '#'; // Mark visited
    
    // Explore 4 directions
    bool found = dfs(board, word, r + 1, c, index + 1) ||
                 dfs(board, word, r - 1, c, index + 1) ||
                 dfs(board, word, r, c + 1, index + 1) ||
                 dfs(board, word, r, c - 1, index + 1);
                 
    board[r][c] = temp; // Backtrack (Restore)
    return found;
}`,
      timeComplexity: 'O(4^(m*n)) for all paths; O(m * n * 4^L) (or O(m * n * 3^L) with parent pruning) for Word Search of length L',
      spaceComplexity: 'O(m*n) for visited array or O(1) extra with in-place marking; O(L) recursion depth for Word Search',
      commonMistake: 'Not restoring the grid cell after backtracking in Word Search — the \'#\' marker stays permanently, causing subsequent searches from other starting cells to find false "visited" markers',
      comparisonNotes: 'DFS on grid without backtrack (e.g. Number of Islands) finds connected components; DFS with backtrack (e.g. Word Search) explores paths and cycles.',
      displayOrder: 4,
    },
    {
      name: 'Constraint Satisfaction',
      slug: 'constraint-satisfaction',
      groupSlug: 'recursion-backtracking',
      triggerCue: 'place N items with no conflicts, N-Queens, Sudoku, coloring with constraints, fill grid satisfying rules, is there a valid assignment. Key: at each step, check if placing an item here violates any constraint BEFORE recursing — this pruning is what makes backtracking efficient vs brute force.',
      coreIdea: 'Try placing an item at current position. Check all constraints (row, column, diagonal for N-Queens; row, column, 3x3 box for Sudoku). If valid, place and recurse to next position. If recursion returns false (no solution from here) or after exploring all options, remove placement and try next option (backtrack).',
      whyItWorks: '1. Why constraint checking BEFORE recursing (pruning) is the key efficiency gain over brute force:\nA brute-force generator explores all possible assignments down to the leaves before checking validity. For instance, placing n items on an n * n board yields n^n configurations, checking each at the leaf (a search space of O(n^n)). Backtracking checks constraints at each step BEFORE recursing. If placing an item at depth i violates a constraint, we discard the branch immediately. This pruning eliminates all n^(n-i) sub-arrangements branching underneath that node without ever visiting them. In N-Queens, pruning based on row/column/diagonal conflicts reduces the search space from n^n to roughly O(n!) in the worst case, and in practice, narrows the search tree for 8-Queens from 8^8 = 16,777,216 leaf checks to just 2,057 nodes visited.\n2. Why N-Queens tracks three sets for O(1) conflict checking:\nTo check if a candidate cell (row, col) is valid in O(1) instead of an O(n) scan of existing queens, we exploit geometric invariants:\n- Column conflicts: Checked via a set storing the column index \'col\'.\n- Left-to-right (major) diagonals (↖ to ↘): For any cell on the same major diagonal, the value (row - col) is constant. Since row - col can range from -(n-1) to (n-1), we map this to a set or shift it by n-1.\n- Right-to-left (minor) diagonals (↗ to ↙): For any cell on the same minor diagonal, the value (row + col) is constant, ranging from 0 to 2n-2.\nBy maintaining three hash sets or boolean arrays (\'cols\', \'diag_major\', \'diag_minor\'), we can verify if a candidate cell is attacked in O(1) time before placing a queen, keeping the state updates and lookups extremely cheap.\n3. Why Sudoku\'s three constraints guarantee solution correctness at the leaf:\nA solved Sudoku grid is valid if and only if every row, column, and 3x3 subgrid contains the numbers 1-9 exactly once with no duplicates. Backtracking maintains this global invariant locally: we only place digit d in cell (row, col) if it is not already present in the current row, column, and corresponding 3x3 subgrid. Since we only make valid moves at each step and propagate these constraints, any state that successfully reaches a leaf node (where all 81 cells are filled) is mathematically guaranteed to be a globally valid solution. Because invalid placements are pruned immediately and never allowed to persist, reaching the end of the recursion guarantees correctness without needing a post-hoc verification step.',
      codeSkeleton: `// N-Queens Solver with O(1) conflict sets
int n;
vector<vector<string>> solutions;
unordered_set<int> cols;
unordered_set<int> diag1; // row - col
unordered_set<int> diag2; // row + col

void solveNQueens(int row, vector<string>& board) {
    if (row == n) {
        solutions.push_back(board);
        return;
    }
    for (int col = 0; col < n; ++col) {
        if (cols.count(col) || diag1.count(row - col) || diag2.count(row + col)) {
            continue; // Pruned: conflict detected
        }
        
        // Place queen
        board[row][col] = 'Q';
        cols.insert(col);
        diag1.insert(row - col);
        diag2.insert(row + col);
        
        solveNQueens(row + 1, board);
        
        // Backtrack (Undo placement)
        board[row][col] = '.';
        cols.erase(col);
        diag1.erase(row - col);
        diag2.erase(row + col);
    }
}`,
      timeComplexity: 'O(n!) for N-Queens; O(9^(empty cells)) for Sudoku',
      spaceComplexity: 'O(n) for N-Queens (column and diagonal sets); O(1) extra for Sudoku (board modified in place)',
      commonMistake: 'For N-Queens, only checking column conflicts and forgetting diagonal conflicts — diagonals are what make N-Queens hard; without them it degenerates to trivial placement',
      comparisonNotes: 'Constraint satisfaction backtracking relies on pruning branches early; brute-force searches the entire state space and checks validity only at the leaves.',
      displayOrder: 5,
    },
    {
      name: 'String Backtracking',
      slug: 'string-backtracking',
      groupSlug: 'recursion-backtracking',
      triggerCue: 'partition string into valid parts, generate valid strings, all valid parentheses combinations, palindrome partitioning, split string satisfying condition. Key: string index as the "position" in the decision tree — at each index, decide how to split or extend.',
      coreIdea: 'Generate Parentheses: track open and close counts, add \'(\' if open < n, add \')\' if close < open. Palindrome Partitioning: at each index, try all possible end indices for current partition — if substring is palindrome, recurse on rest. Word Search II (Trie + Backtracking): build Trie from word list, DFS on grid matching Trie paths — prune when no Trie prefix matches current path.',
      whyItWorks: '1. Why Generate Parentheses produces exactly the Catalan number C(n) valid strings: The constraint open < n ensures we never place more than n open brackets, and the constraint close < open ensures we never place a close bracket without a matching open one. These two local invariants guarantee that any generated string is valid. The number of valid combinations of length 2n matches the nth Catalan number C(n) = (2n choose n) / (n + 1). The backtracking algorithm naturally explores exactly these valid paths without generating invalid strings.\n2. Why palindrome checking during partitioning (not after) gives O(n^2 * 2^n) instead of O(n * 2^n * n) brute force: A naive approach generates all 2^(n-1) partition schemes and checks each segment at the end. By checking if the current prefix `s[start..i]` is a palindrome BEFORE recursing on `s[i+1..end]`, the backtracking algorithm prunes invalid partition paths immediately. This narrows down the active branches of the recursion tree significantly. The O(n^2) cost can be optimized further using a dynamic programming lookup table for palindrome checks.\n3. Why Word Search II uses a Trie instead of checking each word separately: Checking W words independently on a grid of size M × N requires O(W × M × N × 4^L) operations. By storing all W words in a Trie, we run a single DFS on the grid. At each step, we look up the grid path in the Trie in O(1) time. If the current character path is not a prefix in the Trie, the entire search subtree is pruned immediately. This prevents searching for non-existent word prefixes and reduces worst-case complexity significantly when word list size is large.',
      codeSkeleton: `// 1. Generate Parentheses
void backtrack(int open, int close, int n, string& current, vector<string>& result) {
    if (current.length() == 2 * n) {
        result.push_back(current);
        return;
    }
    if (open < n) {
        current.push_back('(');
        backtrack(open + 1, close, n, current, result);
        current.pop_back(); // Backtrack
    }
    if (close < open) {
        current.push_back(')');
        backtrack(open, close + 1, n, current, result);
        current.pop_back(); // Backtrack
    }
}

// 2. Palindrome Partitioning
bool isPalindrome(const string& s, int l, int r) {
    while (l < r) {
        if (s[l++] != s[r--]) return false;
    }
    return true;
}

void partitionBacktrack(string& s, int start, vector<string>& current, vector<vector<string>>& result) {
    if (start == s.length()) {
        result.push_back(current);
        return;
    }
    for (int i = start; i < s.length(); ++i) {
        if (isPalindrome(s, start, i)) {
            current.push_back(s.substr(start, i - start + 1));
            partitionBacktrack(s, i + 1, current, result);
            current.pop_back(); // Backtrack
        }
    }
}`,
      timeComplexity: 'O(4^n / (n * sqrt(n))) for Generate Parentheses (Catalan growth); O(n * 2^n) for Palindrome Partitioning; O(m * n * 4^L) for Word Search II',
      spaceComplexity: 'O(n) recursion depth for parentheses; O(n^2) for palindrome cache; O(W*L) for Trie',
      commonMistake: 'For Palindrome Partitioning, checking if the entire string forms a palindrome instead of checking each partition segment — you need to check each individual partition piece, not the whole string',
      comparisonNotes: 'Trie + Backtracking combines efficient prefix pruning with spatial grid traversal, making it highly effective for multi-keyword searches in grids.',
      displayOrder: 6,
    },
  ];

  const dbPatterns: { [key: string]: string } = {};

  for (const p of patternsData) {
    const groupId = p.groupSlug === 'array'
      ? arrayGroup.id
      : p.groupSlug === 'linked-list'
        ? linkedListGroup.id
        : p.groupSlug === 'graph'
          ? graphGroup.id
          : p.groupSlug === 'binary-tree'
            ? binaryTreeGroup.id
            : p.groupSlug === 'binary-search-tree'
              ? binarySearchTreeGroup.id
              : recursionBacktrackingGroup.id;
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
    // --- GRAPH PROBLEMS (p80 to p120) ---
    { id: 'p80', title: 'Number of Islands', leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/', leetcodeProblemNumber: 200, difficulty: Difficulty.MEDIUM, descriptionShort: 'Count the number of islands in a 2D grid of 1s and 0s.' },
    { id: 'p81', title: 'Rotting Oranges', leetcodeUrl: 'https://leetcode.com/problems/rotting-oranges/', leetcodeProblemNumber: 994, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the minimum time elapsed until all oranges are rotten.' },
    { id: 'p82', title: 'Word Ladder', leetcodeUrl: 'https://leetcode.com/problems/word-ladder/', leetcodeProblemNumber: 127, difficulty: Difficulty.HARD, descriptionShort: 'Find the length of the shortest transformation sequence from beginWord to endWord.' },
    { id: 'p83', title: 'Shortest Path in Binary Matrix', leetcodeUrl: 'https://leetcode.com/problems/shortest-path-in-binary-matrix/', leetcodeProblemNumber: 1091, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the length of the shortest clear path in a binary matrix.' },
    { id: 'p84', title: '01 Matrix', leetcodeUrl: 'https://leetcode.com/problems/01-matrix/', leetcodeProblemNumber: 542, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the distance of the nearest 0 for each cell.' },
    { id: 'p85', title: 'Number of Connected Components in an Undirected Graph', leetcodeUrl: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/', leetcodeProblemNumber: 323, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the number of connected components in an undirected graph.' },
    { id: 'p86', title: 'Course Schedule', leetcodeUrl: 'https://leetcode.com/problems/course-schedule/', leetcodeProblemNumber: 207, difficulty: Difficulty.MEDIUM, descriptionShort: 'Determine if it is possible to finish all courses given prerequisite dependencies.' },
    { id: 'p87', title: 'All Paths From Source to Target', leetcodeUrl: 'https://leetcode.com/problems/all-paths-from-source-to-target/', leetcodeProblemNumber: 797, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find all possible paths from node 0 to node n-1.' },
    { id: 'p88', title: 'Clone Graph', leetcodeUrl: 'https://leetcode.com/problems/clone-graph/', leetcodeProblemNumber: 133, difficulty: Difficulty.MEDIUM, descriptionShort: 'Deep copy a connected undirected graph.' },
    { id: 'p89', title: 'Pacific Atlantic Water Flow', leetcodeUrl: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', leetcodeProblemNumber: 417, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find grid cells where water can flow to both Pacific and Atlantic oceans.' },
    { id: 'p90', title: 'Course Schedule II', leetcodeUrl: 'https://leetcode.com/problems/course-schedule-ii/', leetcodeProblemNumber: 210, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the order of courses to finish all courses given prerequisites.' },
    { id: 'p91', title: 'Alien Dictionary', leetcodeUrl: 'https://leetcode.com/problems/alien-dictionary/', leetcodeProblemNumber: 269, difficulty: Difficulty.HARD, descriptionShort: 'Derive alphabet order from a sorted dictionary of an alien language.' },
    { id: 'p92', title: 'Minimum Height Trees', leetcodeUrl: 'https://leetcode.com/problems/minimum-height-trees/', leetcodeProblemNumber: 310, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the root labels of all trees with minimum height.' },
    { id: 'p93', title: 'Find Eventual Safe States', leetcodeUrl: 'https://leetcode.com/problems/find-eventual-safe-states/', leetcodeProblemNumber: 802, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find all nodes that eventually lead to terminal nodes.' },
    { id: 'p94', title: 'Sequence Reconstruction', leetcodeUrl: 'https://leetcode.com/problems/sequence-reconstruction/', leetcodeProblemNumber: 444, difficulty: Difficulty.MEDIUM, descriptionShort: 'Check if the unique sequence can be reconstructed from subsequences.' },
    { id: 'p95', title: 'Number of Provinces', leetcodeUrl: 'https://leetcode.com/problems/number-of-provinces/', leetcodeProblemNumber: 547, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the total number of connected groups of cities.' },
    { id: 'p96', title: 'Redundant Connection', leetcodeUrl: 'https://leetcode.com/problems/redundant-connection/', leetcodeProblemNumber: 684, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find an edge that can be removed so the remaining graph is a tree.' },
    { id: 'p97', title: 'Accounts Merge', leetcodeUrl: 'https://leetcode.com/problems/accounts-merge/', leetcodeProblemNumber: 721, difficulty: Difficulty.MEDIUM, descriptionShort: 'Merge email accounts belonging to the same person.' },
    { id: 'p98', title: 'Number of Operations to Make Network Connected', leetcodeUrl: 'https://leetcode.com/problems/number-of-operations-to-make-network-connected/', leetcodeProblemNumber: 1319, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the minimum operations to connect all computers.' },
    { id: 'p99', title: 'Satisfiability of Equality Equations', leetcodeUrl: 'https://leetcode.com/problems/satisfiability-of-equality-equations/', leetcodeProblemNumber: 990, difficulty: Difficulty.MEDIUM, descriptionShort: 'Check if equations of variables can be satisfied.' },
    { id: 'p100', title: 'Network Delay Time', leetcodeUrl: 'https://leetcode.com/problems/network-delay-time/', leetcodeProblemNumber: 743, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the time it takes for all nodes to receive a signal.' },
    { id: 'p101', title: 'Path With Minimum Effort', leetcodeUrl: 'https://leetcode.com/problems/path-with-minimum-effort/', leetcodeProblemNumber: 1631, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find a route from top-left to bottom-right with minimum effort.' },
    { id: 'p102', title: 'Cheapest Flights Within K Stops', leetcodeUrl: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/', leetcodeProblemNumber: 787, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the cheapest price from src to dst with at most k stops.' },
    { id: 'p103', title: 'Find the City With the Smallest Number of Neighbors', leetcodeUrl: 'https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/', leetcodeProblemNumber: 1334, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the city with the fewest reachable neighbors within distance threshold.' },
    { id: 'p104', title: 'Swim in Rising Water', leetcodeUrl: 'https://leetcode.com/problems/swim-in-rising-water/', leetcodeProblemNumber: 778, difficulty: Difficulty.HARD, descriptionShort: 'Find the minimum time to reach the bottom-right cell in a grid.' },
    { id: 'p105', title: 'Is Graph Bipartite?', leetcodeUrl: 'https://leetcode.com/problems/is-graph-bipartite/', leetcodeProblemNumber: 785, difficulty: Difficulty.MEDIUM, descriptionShort: 'Check if a graph can be partitioned into two independent sets.' },
    { id: 'p106', title: 'Possible Bipartition', leetcodeUrl: 'https://leetcode.com/problems/possible-bipartition/', leetcodeProblemNumber: 886, difficulty: Difficulty.MEDIUM, descriptionShort: 'Check if a group of people can be split into two groups with no conflicts.' },
    { id: 'p107', title: 'Flower Planting With No Adjacent', leetcodeUrl: 'https://leetcode.com/problems/flower-planting-with-no-adjacent/', leetcodeProblemNumber: 1042, difficulty: Difficulty.MEDIUM, descriptionShort: 'Plant 4 types of flowers in gardens such that no two connected gardens have the same.' },
    { id: 'p108', title: 'Maximum Students Taking Exam', leetcodeUrl: 'https://leetcode.com/problems/maximum-students-taking-exam/', leetcodeProblemNumber: 1349, difficulty: Difficulty.HARD, descriptionShort: 'Find the maximum number of students who can take an exam without cheating.' },
    { id: 'p109', title: 'Check if There is a Valid Path in a Grid', leetcodeUrl: 'https://leetcode.com/problems/check-if-there-is-a-valid-path-in-a-grid/', leetcodeProblemNumber: 1391, difficulty: Difficulty.MEDIUM, descriptionShort: 'Determine if there is a valid path from top-left to bottom-right cell.' },
    { id: 'p110', title: 'Max Area of Island', leetcodeUrl: 'https://leetcode.com/problems/max-area-of-island/', leetcodeProblemNumber: 695, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the maximum area of an island in a grid.' },
    { id: 'p111', title: 'Surrounded Regions', leetcodeUrl: 'https://leetcode.com/problems/surrounded-regions/', leetcodeProblemNumber: 130, difficulty: Difficulty.MEDIUM, descriptionShort: 'Capture all regions surrounded by water.' },
    { id: 'p112', title: 'Flood Fill', leetcodeUrl: 'https://leetcode.com/problems/flood-fill/', leetcodeProblemNumber: 733, difficulty: Difficulty.EASY, descriptionShort: 'Perform a flood fill on an image starting from a coordinate.' },
    { id: 'p113', title: 'Find the Safest Path in a Grid', leetcodeUrl: 'https://leetcode.com/problems/find-the-safest-path-in-a-grid/', leetcodeProblemNumber: 2812, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find a path from top-left to bottom-right that maximizes the minimum distance to any thief.' },
    { id: 'p114', title: 'Minimum Cost to Reach City With Discounts', leetcodeUrl: 'https://leetcode.com/problems/minimum-cost-to-reach-city-with-discounts/', leetcodeProblemNumber: 2093, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the minimum cost to travel from city 0 to city n-1 with k discount coupons.' },
    { id: 'p115', title: 'Negative Weight Cycle Detection', leetcodeUrl: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/#negative-cycle', leetcodeProblemNumber: null, difficulty: Difficulty.MEDIUM, descriptionShort: 'Detect if a negative weight cycle exists in a graph. Note: modeled on LC 787 with an explanation note.' },
    { id: 'p116', title: 'Min Cost to Connect All Points (Kruskal\'s)', leetcodeUrl: 'https://leetcode.com/problems/min-cost-to-connect-all-points/', leetcodeProblemNumber: 1584, difficulty: Difficulty.MEDIUM, descriptionShort: 'Connect all points with minimum cost using Kruskal\'s algorithm (sorting and Union-Find).' },
    { id: 'p117', title: 'Connecting Cities With Minimum Cost', leetcodeUrl: 'https://leetcode.com/problems/connecting-cities-with-minimum-cost/', leetcodeProblemNumber: 1135, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the minimum cost to connect all cities such that there is a path between any two.' },
    { id: 'p118', title: 'Optimize Water Distribution in a Village', leetcodeUrl: 'https://leetcode.com/problems/optimize-water-distribution-in-a-village/', leetcodeProblemNumber: 1168, difficulty: Difficulty.HARD, descriptionShort: 'Find the minimum cost to supply water to all houses in a village by building wells or pipes.' },
    { id: 'p119', title: 'Min Cost to Connect All Points (Prim\'s)', leetcodeUrl: 'https://leetcode.com/problems/min-cost-to-connect-all-points/#prims', leetcodeProblemNumber: 1584, difficulty: Difficulty.MEDIUM, descriptionShort: 'Connect all points with minimum cost using Prim\'s algorithm (min-heap approach).' },
    { id: 'p120', title: 'Find Critical and Pseudo-Critical Edges in MST', leetcodeUrl: 'https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/', leetcodeProblemNumber: 1489, difficulty: Difficulty.HARD, descriptionShort: 'Identify critical and pseudo-critical edges in a graph\'s minimum spanning tree.' },

    // --- TREE PROBLEMS (p121 to p158) ---
    { id: 'p121', title: 'Binary Tree Inorder Traversal', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-inorder-traversal/', leetcodeProblemNumber: 94, difficulty: Difficulty.EASY, descriptionShort: 'Return the inorder traversal of its nodes\' values.' },
    { id: 'p122', title: 'Binary Tree Preorder Traversal', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-preorder-traversal/', leetcodeProblemNumber: 144, difficulty: Difficulty.EASY, descriptionShort: 'Return the preorder traversal of its nodes\' values.' },
    { id: 'p123', title: 'Binary Tree Postorder Traversal', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-postorder-traversal/', leetcodeProblemNumber: 145, difficulty: Difficulty.EASY, descriptionShort: 'Return the postorder traversal of its nodes\' values.' },
    { id: 'p124', title: 'Binary Tree Level Order Traversal', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', leetcodeProblemNumber: 102, difficulty: Difficulty.MEDIUM, descriptionShort: 'Return the level order traversal of its nodes\' values.' },
    { id: 'p125', title: 'Binary Tree Right Side View', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-right-side-view/', leetcodeProblemNumber: 199, difficulty: Difficulty.MEDIUM, descriptionShort: 'Return the values of the nodes you can see ordered from top to bottom.' },
    { id: 'p126', title: 'Binary Tree Zigzag Level Order Traversal', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/', leetcodeProblemNumber: 103, difficulty: Difficulty.MEDIUM, descriptionShort: 'Return the zigzag level order traversal of its nodes\' values.' },
    { id: 'p127', title: 'Construct Binary Tree from Preorder and Inorder Traversal', leetcodeUrl: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', leetcodeProblemNumber: 105, difficulty: Difficulty.MEDIUM, descriptionShort: 'Reconstruct a binary tree from its preorder and inorder traversals.' },
    { id: 'p128', title: 'Serialize and Deserialize Binary Tree', leetcodeUrl: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', leetcodeProblemNumber: 297, difficulty: Difficulty.HARD, descriptionShort: 'Design an algorithm to serialize and deserialize a binary tree.' },
    { id: 'p129', title: 'Construct Binary Tree from Inorder and Postorder Traversal', leetcodeUrl: 'https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/', leetcodeProblemNumber: 106, difficulty: Difficulty.MEDIUM, descriptionShort: 'Reconstruct a binary tree from its inorder and postorder traversals.' },
    { id: 'p130', title: 'Lowest Common Ancestor of a Binary Tree', leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', leetcodeProblemNumber: 236, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the lowest common ancestor node of two given nodes in the tree.' },
    { id: 'p131', title: 'Lowest Common Ancestor of Deepest Leaves', leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-deepest-leaves/', leetcodeProblemNumber: 1123, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the lowest common ancestor of the deepest leaves in the tree.' },
    { id: 'p132', title: 'Distance Between BST Nodes', leetcodeUrl: 'https://leetcode.com/problems/find-distance-in-a-binary-tree/', leetcodeProblemNumber: 1740, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the distance (number of edges) between two nodes in a binary tree.' },
    { id: 'p133', title: 'Path Sum', leetcodeUrl: 'https://leetcode.com/problems/path-sum/', leetcodeProblemNumber: 112, difficulty: Difficulty.EASY, descriptionShort: 'Determine if the tree has a root-to-leaf path such that adding up all the values equals targetSum.' },
    { id: 'p134', title: 'Path Sum II', leetcodeUrl: 'https://leetcode.com/problems/path-sum-ii/', leetcodeProblemNumber: 113, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find all root-to-leaf paths where each path\'s sum equals targetSum.' },
    { id: 'p135', title: 'Binary Tree Maximum Path Sum', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', leetcodeProblemNumber: 124, difficulty: Difficulty.HARD, descriptionShort: 'Find the maximum path sum of any non-empty path in the tree.' },
    { id: 'p136', title: 'Maximum Depth of Binary Tree', leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', leetcodeProblemNumber: 104, difficulty: Difficulty.EASY, descriptionShort: 'Find the maximum depth of a binary tree.' },
    { id: 'p137', title: 'Balanced Binary Tree', leetcodeUrl: 'https://leetcode.com/problems/balanced-binary-tree/', leetcodeProblemNumber: 110, difficulty: Difficulty.EASY, descriptionShort: 'Determine if a binary tree is height-balanced.' },
    { id: 'p138', title: 'Diameter of Binary Tree', leetcodeUrl: 'https://leetcode.com/problems/diameter-of-binary-tree/', leetcodeProblemNumber: 543, difficulty: Difficulty.EASY, descriptionShort: 'Find the length of the diameter of the tree.' },
    { id: 'p139', title: 'Symmetric Tree', leetcodeUrl: 'https://leetcode.com/problems/symmetric-tree/', leetcodeProblemNumber: 101, difficulty: Difficulty.EASY, descriptionShort: 'Check whether a binary tree is a mirror of itself.' },
    { id: 'p140', title: 'Same Tree', leetcodeUrl: 'https://leetcode.com/problems/same-tree/', leetcodeProblemNumber: 100, difficulty: Difficulty.EASY, descriptionShort: 'Check if two binary trees are structurally identical and have the same node values.' },
    { id: 'p141', title: 'Subtree of Another Tree', leetcodeUrl: 'https://leetcode.com/problems/subtree-of-another-tree/', leetcodeProblemNumber: 572, difficulty: Difficulty.EASY, descriptionShort: 'Check if a tree is a subtree of another tree.' },
    { id: 'p142', title: 'Recover Binary Search Tree', leetcodeUrl: 'https://leetcode.com/problems/recover-binary-search-tree/', leetcodeProblemNumber: 99, difficulty: Difficulty.MEDIUM, descriptionShort: 'Recover the BST where exactly two nodes were swapped by mistake.' },
    { id: 'p143', title: 'Convert Binary Search Tree to Sorted Doubly Linked List', leetcodeUrl: 'https://leetcode.com/problems/convert-binary-search-tree-to-sorted-doubly-linked-list/', leetcodeProblemNumber: 426, difficulty: Difficulty.MEDIUM, descriptionShort: 'Convert a BST to a sorted circular doubly linked list in-place.' },
    { id: 'p144', title: 'Search in a Binary Search Tree', leetcodeUrl: 'https://leetcode.com/problems/search-in-a-binary-search-tree/', leetcodeProblemNumber: 700, difficulty: Difficulty.EASY, descriptionShort: 'Find the node in the BST that the node\'s value equals val and return the subtree.' },
    { id: 'p145', title: 'Validate Binary Search Tree', leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/', leetcodeProblemNumber: 98, difficulty: Difficulty.MEDIUM, descriptionShort: 'Determine if a binary tree is a valid binary search tree.' },
    { id: 'p146', title: 'Kth Smallest Element in a BST', leetcodeUrl: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', leetcodeProblemNumber: 230, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the kth smallest element in a BST (1-indexed).' },
    { id: 'p147', title: 'Insert into a Binary Search Tree', leetcodeUrl: 'https://leetcode.com/problems/insert-into-a-binary-search-tree/', leetcodeProblemNumber: 701, difficulty: Difficulty.MEDIUM, descriptionShort: 'Insert a value into a binary search tree.' },
    { id: 'p148', title: 'Delete Node in a BST', leetcodeUrl: 'https://leetcode.com/problems/delete-node-in-a-bst/', leetcodeProblemNumber: 450, difficulty: Difficulty.MEDIUM, descriptionShort: 'Delete the node with the given key in the BST.' },
    { id: 'p149', title: 'Inorder Successor in BST', leetcodeUrl: 'https://leetcode.com/problems/inorder-successor-in-bst/', leetcodeProblemNumber: 285, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the inorder successor of a given node in the BST.' },
    { id: 'p150', title: 'Convert Sorted Array to Binary Search Tree', leetcodeUrl: 'https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/', leetcodeProblemNumber: 108, difficulty: Difficulty.EASY, descriptionShort: 'Convert a sorted array to a height-balanced BST.' },
    { id: 'p151', title: 'Convert Sorted List to Binary Search Tree', leetcodeUrl: 'https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/', leetcodeProblemNumber: 109, difficulty: Difficulty.MEDIUM, descriptionShort: 'Convert a sorted linked list to a height-balanced BST.' },
    { id: 'p152', title: 'Construct BST from Preorder Traversal', leetcodeUrl: 'https://leetcode.com/problems/construct-bst-from-preorder-traversal/', leetcodeProblemNumber: 1008, difficulty: Difficulty.MEDIUM, descriptionShort: 'Reconstruct a BST from its preorder traversal.' },
    { id: 'p153', title: 'Range Sum of BST', leetcodeUrl: 'https://leetcode.com/problems/range-sum-of-bst/', leetcodeProblemNumber: 938, difficulty: Difficulty.EASY, descriptionShort: 'Return the sum of values of all nodes in the BST with a value in the range [low, high].' },
    { id: 'p154', title: 'Trim a Binary Search Tree', leetcodeUrl: 'https://leetcode.com/problems/trim-a-binary-search-tree/', leetcodeProblemNumber: 669, difficulty: Difficulty.MEDIUM, descriptionShort: 'Trim the tree so that all its elements lie in [low, high].' },
    { id: 'p155', title: 'Convert BST to Greater Tree', leetcodeUrl: 'https://leetcode.com/problems/convert-bst-to-greater-tree/', leetcodeProblemNumber: 538, difficulty: Difficulty.MEDIUM, descriptionShort: 'Convert BST to Greater Tree where every key is original key plus sum of all keys greater.' },
    { id: 'p156', title: 'Flatten Binary Tree to Linked List', leetcodeUrl: 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/', leetcodeProblemNumber: 114, difficulty: Difficulty.MEDIUM, descriptionShort: 'Flatten the binary tree to a "linked list" in-place.' },
    { id: 'p157', title: 'Balance a Binary Search Tree', leetcodeUrl: 'https://leetcode.com/problems/balance-a-binary-search-tree/', leetcodeProblemNumber: 1382, difficulty: Difficulty.MEDIUM, descriptionShort: 'Convert an unbalanced BST to a balanced BST with minimum height.' },
    { id: 'p158', title: 'Minimum Absolute Difference in BST', leetcodeUrl: 'https://leetcode.com/problems/minimum-absolute-difference-in-bst/', leetcodeProblemNumber: 530, difficulty: Difficulty.EASY, descriptionShort: 'Find the minimum absolute difference between values of any two different nodes in the BST.' },
    // --- RECURSION & BACKTRACKING PROBLEMS ---
    { id: 'p159', title: 'Fibonacci Number', leetcodeUrl: 'https://leetcode.com/problems/fibonacci-number/', leetcodeProblemNumber: 509, difficulty: Difficulty.EASY, descriptionShort: 'Compute the Nth Fibonacci number.' },
    { id: 'p160', title: 'Pow(x, n)', leetcodeUrl: 'https://leetcode.com/problems/powx-n/', leetcodeProblemNumber: 50, difficulty: Difficulty.MEDIUM, descriptionShort: 'Implement pow(x, n), which calculates x raised to the power n.' },
    { id: 'p161', title: 'Subsets', leetcodeUrl: 'https://leetcode.com/problems/subsets/', leetcodeProblemNumber: 78, difficulty: Difficulty.MEDIUM, descriptionShort: 'Return all possible subsets (the power set).' },
    { id: 'p162', title: 'Subsets II', leetcodeUrl: 'https://leetcode.com/problems/subsets-ii/', leetcodeProblemNumber: 90, difficulty: Difficulty.MEDIUM, descriptionShort: 'Return all possible subsets where the input array contains duplicates.' },
    { id: 'p163', title: 'Combination Sum', leetcodeUrl: 'https://leetcode.com/problems/combination-sum/', leetcodeProblemNumber: 39, difficulty: Difficulty.MEDIUM, descriptionShort: 'Return all unique combinations of candidates that sum to target.' },
    { id: 'p164', title: 'Permutations', leetcodeUrl: 'https://leetcode.com/problems/permutations/', leetcodeProblemNumber: 46, difficulty: Difficulty.MEDIUM, descriptionShort: 'Return all possible permutations of an array of distinct integers.' },
    { id: 'p165', title: 'Permutations II', leetcodeUrl: 'https://leetcode.com/problems/permutations-ii/', leetcodeProblemNumber: 47, difficulty: Difficulty.MEDIUM, descriptionShort: 'Return all unique permutations of a collection of numbers that might contain duplicates.' },
    { id: 'p166', title: 'Letter Combinations of a Phone Number', leetcodeUrl: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', leetcodeProblemNumber: 17, difficulty: Difficulty.MEDIUM, descriptionShort: 'Return all possible letter combinations that the number could represent from the telephone buttons.' },
    { id: 'p167', title: 'Unique Paths III', leetcodeUrl: 'https://leetcode.com/problems/unique-paths-iii/', leetcodeProblemNumber: 980, difficulty: Difficulty.HARD, descriptionShort: 'Find the number of 4-directional paths from the starting square to the ending square, visiting every non-obstacle square exactly once.' },
    { id: 'p168', title: 'Word Search', leetcodeUrl: 'https://leetcode.com/problems/word-search/', leetcodeProblemNumber: 79, difficulty: Difficulty.MEDIUM, descriptionShort: 'Determine if the word exists in the 2D grid.' },
    { id: 'p169', title: 'Number of Distinct Islands', leetcodeUrl: 'https://leetcode.com/problems/number-of-distinct-islands/', leetcodeProblemNumber: 694, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find the number of distinct island shapes in a 2D grid.' },
    { id: 'p170', title: 'N-Queens', leetcodeUrl: 'https://leetcode.com/problems/n-queens/', leetcodeProblemNumber: 51, difficulty: Difficulty.HARD, descriptionShort: 'Place n queens on an n x n chessboard such that no two queens attack each other.' },
    { id: 'p171', title: 'Sudoku Solver', leetcodeUrl: 'https://leetcode.com/problems/sudoku-solver/', leetcodeProblemNumber: 37, difficulty: Difficulty.HARD, descriptionShort: 'Solve a Sudoku puzzle by filling the empty cells.' },
    { id: 'p172', title: 'Combination Sum II', leetcodeUrl: 'https://leetcode.com/problems/combination-sum-ii/', leetcodeProblemNumber: 40, difficulty: Difficulty.MEDIUM, descriptionShort: 'Find all unique combinations in candidates where the candidate numbers sum to target (each number used once).' },
    { id: 'p173', title: 'Generate Parentheses', leetcodeUrl: 'https://leetcode.com/problems/generate-parentheses/', leetcodeProblemNumber: 22, difficulty: Difficulty.MEDIUM, descriptionShort: 'Generate all combinations of well-formed parentheses.' },
    { id: 'p174', title: 'Palindrome Partitioning', leetcodeUrl: 'https://leetcode.com/problems/palindrome-partitioning/', leetcodeProblemNumber: 131, difficulty: Difficulty.MEDIUM, descriptionShort: 'Partition a string such that every substring of the partition is a palindrome.' },
    { id: 'p175', title: 'Word Search II', leetcodeUrl: 'https://leetcode.com/problems/word-search-ii/', leetcodeProblemNumber: 212, difficulty: Difficulty.HARD, descriptionShort: 'Return all words on the board from a given dictionary.' },
  ];

  const dbProblems: { [key: string]: string } = {};

  for (const prob of problemsData) {
    const normUrl = normalizeUrl(prob.leetcodeUrl);
    let existingProb = await prisma.problem.findFirst({
      where: {
        OR: [
          { leetcodeUrl: prob.leetcodeUrl },
          { leetcodeUrl: normUrl },
          { leetcodeUrl: normUrl + '/' }
        ]
      },
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

    // === GRAPH MAPPINGS ===
    // 1. BFS
    { problemId: 'p80', patternSlug: 'bfs-shortest-path', isPrimary: false }, // Number of Islands (Secondary)
    { problemId: 'p81', patternSlug: 'bfs-shortest-path', isPrimary: true }, // Rotting Oranges (Primary)
    { problemId: 'p82', patternSlug: 'bfs-shortest-path', isPrimary: true }, // Word Ladder (Primary)
    { problemId: 'p83', patternSlug: 'bfs-shortest-path', isPrimary: true }, // Shortest Path in Binary Matrix (Primary)
    { problemId: 'p84', patternSlug: 'bfs-shortest-path', isPrimary: false }, // 01 Matrix (Secondary)

    // 2. DFS
    { problemId: 'p85', patternSlug: 'dfs-traversal', isPrimary: true }, // Number of Connected Components
    { problemId: 'p86', patternSlug: 'dfs-traversal', isPrimary: true }, // Course Schedule (Primary)
    { problemId: 'p87', patternSlug: 'dfs-traversal', isPrimary: true }, // All Paths From Source to Target (Primary)
    { problemId: 'p88', patternSlug: 'dfs-traversal', isPrimary: true }, // Clone Graph (Primary)
    { problemId: 'p89', patternSlug: 'dfs-traversal', isPrimary: true }, // Pacific Atlantic Water Flow (Primary)
    { problemId: 'p80', patternSlug: 'dfs-traversal', isPrimary: false }, // Number of Islands (Secondary)

    // 3. Topological Sort
    { problemId: 'p90', patternSlug: 'topological-sort', isPrimary: true }, // Course Schedule II (Primary)
    { problemId: 'p91', patternSlug: 'topological-sort', isPrimary: true }, // Alien Dictionary (Primary)
    { problemId: 'p92', patternSlug: 'topological-sort', isPrimary: true }, // Minimum Height Trees (Primary)
    { problemId: 'p93', patternSlug: 'topological-sort', isPrimary: true }, // Find Eventual Safe States (Primary)
    { problemId: 'p94', patternSlug: 'topological-sort', isPrimary: true }, // Sequence Reconstruction (Primary)
    { problemId: 'p86', patternSlug: 'topological-sort', isPrimary: false }, // Course Schedule (Secondary)

    // 4. Union-Find
    { problemId: 'p95', patternSlug: 'union-find', isPrimary: true }, // Number of Provinces
    { problemId: 'p96', patternSlug: 'union-find', isPrimary: true }, // Redundant Connection
    { problemId: 'p97', patternSlug: 'union-find', isPrimary: true }, // Accounts Merge
    { problemId: 'p98', patternSlug: 'union-find', isPrimary: true }, // Number of Operations to Make Network Connected
    { problemId: 'p99', patternSlug: 'union-find', isPrimary: true }, // Satisfiability of Equality Equations

    // 5. Dijkstra
    { problemId: 'p100', patternSlug: 'dijkstra-shortest-path', isPrimary: true }, // Network Delay Time (Primary)
    { problemId: 'p101', patternSlug: 'dijkstra-shortest-path', isPrimary: true }, // Path With Minimum Effort
    { problemId: 'p102', patternSlug: 'dijkstra-shortest-path', isPrimary: true }, // Cheapest Flights Within K Stops (Primary)
    { problemId: 'p103', patternSlug: 'dijkstra-shortest-path', isPrimary: true }, // Find the City With the Smallest Number of Neighbors
    { problemId: 'p104', patternSlug: 'dijkstra-shortest-path', isPrimary: true }, // Swim in Rising Water

    // 6. Bipartite Check
    { problemId: 'p105', patternSlug: 'bipartite-check', isPrimary: true }, // Is Graph Bipartite?
    { problemId: 'p106', patternSlug: 'bipartite-check', isPrimary: true }, // Possible Bipartition
    { problemId: 'p107', patternSlug: 'bipartite-check', isPrimary: true }, // Flower Planting With No Adjacent
    { problemId: 'p108', patternSlug: 'bipartite-check', isPrimary: true }, // Maximum Students Taking Exam
    { problemId: 'p109', patternSlug: 'bipartite-check', isPrimary: true }, // Check if There is a Valid Path in a Grid

    // 7. Island / Grid Traversal
    { problemId: 'p80', patternSlug: 'island-grid-traversal', isPrimary: true }, // Number of Islands (Primary)
    { problemId: 'p110', patternSlug: 'island-grid-traversal', isPrimary: true }, // Max Area of Island
    { problemId: 'p111', patternSlug: 'island-grid-traversal', isPrimary: true }, // Surrounded Regions
    { problemId: 'p112', patternSlug: 'island-grid-traversal', isPrimary: true }, // Flood Fill
    { problemId: 'p84', patternSlug: 'island-grid-traversal', isPrimary: true }, // 01 Matrix (Primary)

    // 8. Bellman-Ford
    { problemId: 'p102', patternSlug: 'bellman-ford', isPrimary: false }, // Cheapest Flights Within K Stops (Secondary)
    { problemId: 'p100', patternSlug: 'bellman-ford', isPrimary: false }, // Network Delay Time (Secondary)
    { problemId: 'p113', patternSlug: 'bellman-ford', isPrimary: true }, // Find the Safest Path in a Grid
    { problemId: 'p114', patternSlug: 'bellman-ford', isPrimary: true }, // Minimum Cost to Reach City With Discounts
    { problemId: 'p115', patternSlug: 'bellman-ford', isPrimary: true }, // Negative Weight Cycle Detection

    // 9. MST
    { problemId: 'p116', patternSlug: 'minimum-spanning-tree', isPrimary: true }, // Min Cost to Connect All Points (Kruskal's)
    { problemId: 'p117', patternSlug: 'minimum-spanning-tree', isPrimary: true }, // Connecting Cities With Minimum Cost
    { problemId: 'p118', patternSlug: 'minimum-spanning-tree', isPrimary: true }, // Optimize Water Distribution in a Village
    { problemId: 'p119', patternSlug: 'minimum-spanning-tree', isPrimary: true }, // Min Cost to Connect All Points (Prim's)
    { problemId: 'p120', patternSlug: 'minimum-spanning-tree', isPrimary: true }, // Find Critical and Pseudo-Critical Edges in MST

    // === BINARY TREE MAPPINGS ===
    // 1. Tree Traversals
    { problemId: 'p121', patternSlug: 'tree-traversals', isPrimary: true }, // Binary Tree Inorder Traversal
    { problemId: 'p122', patternSlug: 'tree-traversals', isPrimary: true }, // Binary Tree Preorder Traversal
    { problemId: 'p123', patternSlug: 'tree-traversals', isPrimary: true }, // Binary Tree Postorder Traversal

    // 2. Level Order / BFS on Tree
    { problemId: 'p124', patternSlug: 'level-order-bfs', isPrimary: true }, // Binary Tree Level Order Traversal
    { problemId: 'p125', patternSlug: 'level-order-bfs', isPrimary: true }, // Binary Tree Right Side View
    { problemId: 'p126', patternSlug: 'level-order-bfs', isPrimary: true }, // Binary Tree Zigzag Level Order Traversal

    // 3. Tree Construction
    { problemId: 'p127', patternSlug: 'tree-construction', isPrimary: true }, // Construct Binary Tree from Preorder and Inorder
    { problemId: 'p128', patternSlug: 'tree-construction', isPrimary: true }, // Serialize and Deserialize Binary Tree
    { problemId: 'p129', patternSlug: 'tree-construction', isPrimary: true }, // Construct Binary Tree from Inorder and Postorder

    // 4. Lowest Common Ancestor (LCA)
    { problemId: 'p130', patternSlug: 'lowest-common-ancestor', isPrimary: true }, // LCA of a Binary Tree
    { problemId: 'p131', patternSlug: 'lowest-common-ancestor', isPrimary: true }, // LCA of Deepest Leaves
    { problemId: 'p132', patternSlug: 'lowest-common-ancestor', isPrimary: true }, // Distance Between BST Nodes (Primary)

    // 5. Tree Path Problems
    { problemId: 'p133', patternSlug: 'tree-path-problems', isPrimary: true }, // Path Sum
    { problemId: 'p134', patternSlug: 'tree-path-problems', isPrimary: true }, // Path Sum II
    { problemId: 'p135', patternSlug: 'tree-path-problems', isPrimary: true }, // Binary Tree Maximum Path Sum

    // 6. Tree Diameter & Height
    { problemId: 'p136', patternSlug: 'tree-diameter-height', isPrimary: true }, // Maximum Depth of Binary Tree
    { problemId: 'p137', patternSlug: 'tree-diameter-height', isPrimary: true }, // Balanced Binary Tree (Primary)
    { problemId: 'p138', patternSlug: 'tree-diameter-height', isPrimary: true }, // Diameter of Binary Tree

    // 7. Tree Symmetry & Comparison
    { problemId: 'p139', patternSlug: 'tree-symmetry-comparison', isPrimary: true }, // Symmetric Tree
    { problemId: 'p140', patternSlug: 'tree-symmetry-comparison', isPrimary: true }, // Same Tree
    { problemId: 'p141', patternSlug: 'tree-symmetry-comparison', isPrimary: true }, // Subtree of Another Tree

    // 8. Morris Traversal
    { problemId: 'p121', patternSlug: 'morris-traversal', isPrimary: false }, // Binary Tree Inorder Traversal (Secondary)
    { problemId: 'p142', patternSlug: 'morris-traversal', isPrimary: true }, // Recover Binary Search Tree (Primary)
    { problemId: 'p143', patternSlug: 'morris-traversal', isPrimary: false }, // Convert BST to Sorted DLL (Secondary)

    // === BINARY SEARCH TREE MAPPINGS ===
    // 1. BST Search & Validation
    { problemId: 'p144', patternSlug: 'bst-search-validation', isPrimary: true }, // Search in a BST
    { problemId: 'p145', patternSlug: 'bst-search-validation', isPrimary: true }, // Validate BST
    { problemId: 'p146', patternSlug: 'bst-search-validation', isPrimary: false }, // Kth Smallest Element in a BST (Secondary)
    { problemId: 'p149', patternSlug: 'bst-search-validation', isPrimary: false }, // Inorder Successor in BST (Secondary)
    { problemId: 'p132', patternSlug: 'bst-search-validation', isPrimary: false }, // Distance Between BST Nodes (Secondary)

    // 2. BST Insert & Delete
    { problemId: 'p147', patternSlug: 'bst-insert-delete', isPrimary: true }, // Insert into a BST
    { problemId: 'p148', patternSlug: 'bst-insert-delete', isPrimary: true }, // Delete Node in a BST
    { problemId: 'p149', patternSlug: 'bst-insert-delete', isPrimary: true }, // Inorder Successor in BST (Primary)
    { problemId: 'p142', patternSlug: 'bst-insert-delete', isPrimary: false }, // Recover BST (Secondary)

    // 3. BST Construction
    { problemId: 'p150', patternSlug: 'bst-construction', isPrimary: true }, // Convert Sorted Array to BST
    { problemId: 'p151', patternSlug: 'bst-construction', isPrimary: true }, // Convert Sorted List to BST
    { problemId: 'p152', patternSlug: 'bst-construction', isPrimary: true }, // Construct BST from Preorder

    // 4. BST Range Problems
    { problemId: 'p153', patternSlug: 'bst-range-problems', isPrimary: true }, // Range Sum of BST
    { problemId: 'p146', patternSlug: 'bst-range-problems', isPrimary: true }, // Kth Smallest Element in a BST (Primary)
    { problemId: 'p154', patternSlug: 'bst-range-problems', isPrimary: true }, // Trim a BST

    // 5. BST to Other Structures
    { problemId: 'p155', patternSlug: 'bst-to-other-structures', isPrimary: true }, // Convert BST to Greater Tree
    { problemId: 'p143', patternSlug: 'bst-to-other-structures', isPrimary: true }, // Convert BST to Sorted DLL (Primary)
    { problemId: 'p156', patternSlug: 'bst-to-other-structures', isPrimary: true }, // Flatten Binary Tree to Linked List (Primary)
    { problemId: 'p156', patternSlug: 'tree-traversals', isPrimary: false }, // Flatten Binary Tree to Linked List (Secondary)

    // 6. Balanced BST
    { problemId: 'p157', patternSlug: 'balanced-bst', isPrimary: true }, // Balance a BST
    { problemId: 'p137', patternSlug: 'balanced-bst', isPrimary: false }, // Height-Balanced Binary Tree check (Secondary)
    { problemId: 'p158', patternSlug: 'balanced-bst', isPrimary: true }, // Minimum Absolute Difference in BST

    // === RECURSION & BACKTRACKING MAPPINGS ===
    // 1. Basic Recursion
    { problemId: 'p159', patternSlug: 'basic-recursion', isPrimary: true },  // Fibonacci Number
    { problemId: 'p160', patternSlug: 'basic-recursion', isPrimary: true },  // Pow(x, n)
    { problemId: 'p61',  patternSlug: 'basic-recursion', isPrimary: false }, // Reverse Linked List (Secondary)

    // 2. Subsequences Pattern (Pick / Not Pick)
    { problemId: 'p161', patternSlug: 'subsequences-pattern', isPrimary: true },  // Subsets
    { problemId: 'p162', patternSlug: 'subsequences-pattern', isPrimary: true },  // Subsets II
    { problemId: 'p163', patternSlug: 'subsequences-pattern', isPrimary: true },  // Combination Sum
    { problemId: 'p172', patternSlug: 'subsequences-pattern', isPrimary: false }, // Combination Sum II (Secondary)

    // 3. Permutations Pattern
    { problemId: 'p164', patternSlug: 'permutations-pattern', isPrimary: true }, // Permutations
    { problemId: 'p165', patternSlug: 'permutations-pattern', isPrimary: true }, // Permutations II
    { problemId: 'p166', patternSlug: 'permutations-pattern', isPrimary: true }, // Letter Combinations of a Phone Number

    // 4. Backtracking on Grid
    { problemId: 'p167', patternSlug: 'backtracking-grid', isPrimary: true },  // Unique Paths III
    { problemId: 'p168', patternSlug: 'backtracking-grid', isPrimary: true },  // Word Search
    { problemId: 'p169', patternSlug: 'backtracking-grid', isPrimary: true },  // Number of Distinct Islands
    { problemId: 'p175', patternSlug: 'backtracking-grid', isPrimary: false }, // Word Search II (Secondary)

    // 5. Constraint Satisfaction
    { problemId: 'p170', patternSlug: 'constraint-satisfaction', isPrimary: true }, // N-Queens
    { problemId: 'p171', patternSlug: 'constraint-satisfaction', isPrimary: true }, // Sudoku Solver
    { problemId: 'p172', patternSlug: 'constraint-satisfaction', isPrimary: true }, // Combination Sum II (Primary)

    // 6. String Backtracking
    { problemId: 'p173', patternSlug: 'string-backtracking', isPrimary: true }, // Generate Parentheses
    { problemId: 'p174', patternSlug: 'string-backtracking', isPrimary: true }, // Palindrome Partitioning
    { problemId: 'p175', patternSlug: 'string-backtracking', isPrimary: true }, // Word Search II (Primary)
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

function getPatternSlugForProblem(topicsStr: string): { slug: string; group: 'array' | 'linked-list' | 'graph' | 'binary-tree' | 'binary-search-tree' } | null {
  const topics = topicsStr.split(',').map(t => t.trim());
  const topicsLower = topics.map(t => t.toLowerCase());

  const hasLinkedList = topicsLower.includes('linked list');
  const hasArray = topicsLower.includes('array');
  const hasGraph = topicsLower.includes('graph') || 
                    topicsLower.includes('breadth-first search') || 
                    topicsLower.includes('depth-first search') || 
                    topicsLower.includes('union find') || 
                    topicsLower.includes('minimum spanning tree') || 
                    topicsLower.includes('topological sort') || 
                    topicsLower.includes('bipartite');
  const hasBST = topicsLower.includes('binary search tree') || topicsLower.includes('bst');
  const hasBinaryTree = topicsLower.includes('binary tree') || (topicsLower.includes('tree') && !hasBST);

  if (!hasLinkedList && !hasArray && !hasGraph && !hasBST && !hasBinaryTree) {
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

  if (hasGraph) {
    if (topicsLower.includes('union find') || topicsLower.includes('disjoint set')) {
      return { slug: 'union-find', group: 'graph' };
    }
    if (topicsLower.includes('topological sort')) {
      return { slug: 'topological-sort', group: 'graph' };
    }
    if (topicsLower.includes('minimum spanning tree')) {
      return { slug: 'minimum-spanning-tree', group: 'graph' };
    }
    if (topicsLower.includes('bipartite')) {
      return { slug: 'bipartite-check', group: 'graph' };
    }
    if (topicsLower.includes('shortest path') || topicsLower.includes('dijkstra')) {
      return { slug: 'dijkstra-shortest-path', group: 'graph' };
    }
    if (topicsLower.includes('breadth-first search')) {
      return { slug: 'bfs-shortest-path', group: 'graph' };
    }
    if (topicsLower.includes('depth-first search')) {
      return { slug: 'dfs-traversal', group: 'graph' };
    }
    if (topicsLower.includes('matrix') || topicsLower.includes('grid')) {
      return { slug: 'island-grid-traversal', group: 'graph' };
    }
    return null;
  }

  if (hasBST) {
    if (topicsLower.includes('search') || topicsLower.includes('validate') || topicsLower.includes('validation')) {
      return { slug: 'bst-search-validation', group: 'binary-search-tree' };
    }
    if (topicsLower.includes('insert') || topicsLower.includes('delete') || topicsLower.includes('remove') || topicsLower.includes('successor')) {
      return { slug: 'bst-insert-delete', group: 'binary-search-tree' };
    }
    if (topicsLower.includes('construct') || topicsLower.includes('build')) {
      return { slug: 'bst-construction', group: 'binary-search-tree' };
    }
    if (topicsLower.includes('range') || topicsLower.includes('kth') || topicsLower.includes('trim')) {
      return { slug: 'bst-range-problems', group: 'binary-search-tree' };
    }
    if (topicsLower.includes('convert') || topicsLower.includes('flatten') || topicsLower.includes('doubly linked list')) {
      return { slug: 'bst-to-other-structures', group: 'binary-search-tree' };
    }
    if (topicsLower.includes('balance') || topicsLower.includes('avl')) {
      return { slug: 'balanced-bst', group: 'binary-search-tree' };
    }
    return { slug: 'bst-search-validation', group: 'binary-search-tree' };
  }

  if (hasBinaryTree) {
    if (topicsLower.includes('level order') || topicsLower.includes('breadth-first search') || topicsLower.includes('bfs')) {
      return { slug: 'level-order-bfs', group: 'binary-tree' };
    }
    if (topicsLower.includes('construct') || topicsLower.includes('serialize') || topicsLower.includes('reconstruct')) {
      return { slug: 'tree-construction', group: 'binary-tree' };
    }
    if (topicsLower.includes('lowest common ancestor') || topicsLower.includes('lca')) {
      return { slug: 'lowest-common-ancestor', group: 'binary-tree' };
    }
    if (topicsLower.includes('path') || topicsLower.includes('sum')) {
      return { slug: 'tree-path-problems', group: 'binary-tree' };
    }
    if (topicsLower.includes('height') || topicsLower.includes('depth') || topicsLower.includes('diameter') || topicsLower.includes('balanced')) {
      return { slug: 'tree-diameter-height', group: 'binary-tree' };
    }
    if (topicsLower.includes('symmetric') || topicsLower.includes('same') || topicsLower.includes('subtree')) {
      return { slug: 'tree-symmetry-comparison', group: 'binary-tree' };
    }
    if (topicsLower.includes('morris') || topicsLower.includes('constant space')) {
      return { slug: 'morris-traversal', group: 'binary-tree' };
    }
    return { slug: 'tree-traversals', group: 'binary-tree' };
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

