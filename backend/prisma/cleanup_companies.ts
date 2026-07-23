import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const VALID_PATTERN_SLUGS = [
  'two-pointer',
  'prefix-sum-hashmap',
  'kadanes-algorithm',
  'sort-greedy',
  'xor-math-tricks',
  'matrix-simulation',
  'merge-sort-divide-conquer',
  'binary-search-on-answer',
  'monotonic-stack-queue',
  'cyclic-sort',
  'in-place-hashing',
  'event-line-sweep',
  'fast-slow-pointer',
  'in-place-reversal',
  'merge-sorted-lists',
  'dummy-node-technique',
  'cycle-detection-start',
  'recursive-vs-iterative',
  'intersection-offset-pointers',
  'sliding-window',
  'bfs-shortest-path',
  'dfs-traversal',
  'topological-sort',
  'union-find',
  'dijkstra-shortest-path',
  'bipartite-check',
  'island-grid-traversal',
  'bellman-ford',
  'minimum-spanning-tree'
];

const COMPANY_FOLDERS: { [key: string]: string } = {
  'Google': 'Google',
  'Amazon': 'Amazon',
  'Meta': 'Meta',
  'Microsoft': 'Microsoft',
  'Apple': 'Apple',
  'Adobe': 'Adobe',
  'Uber': 'Uber',
  'Bloomberg': 'Bloomberg',
  'Netflix': 'Netflix',
  'LinkedIn': 'LinkedIn',
  'Salesforce': 'Salesforce',
  'Atlassian': 'Atlassian',
  'TCS': 'tcs',
  'Infosys': 'Infosys',
  'Wipro': 'Wipro',
  'Cognizant': 'Cognizant',
  'Accenture': 'Accenture',
  'Flipkart': 'Flipkart',
  'Paytm': 'Paytm',
  'Swiggy': 'Swiggy'
};

function normalizeUrl(url: string): string {
  let cleaned = url.trim();
  if (cleaned.startsWith('http://')) {
    cleaned = 'https://' + cleaned.slice(7);
  }
  if (cleaned.endsWith('/')) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned.toLowerCase();
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
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function getPatternSlugForProblem(topicsStr: string): string | null {
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

  if (!hasLinkedList && !hasArray && !hasGraph) {
    return null;
  }

  if (hasLinkedList) {
    if (topics.some(t => t === 'Two Pointers')) return 'fast-slow-pointer';
    if (topics.some(t => t === 'Recursion')) return 'recursive-vs-iterative';
    if (topics.some(t => t === 'Divide and Conquer')) return 'merge-sorted-lists';
    if (topics.some(t => t === 'Hash Table')) return 'intersection-offset-pointers';
    return null;
  }

  if (hasArray) {
    if (topics.some(t => t === 'Sliding Window')) return 'sliding-window';
    if (topics.some(t => t === 'Two Pointers')) return 'two-pointer';
    if (topics.some(t => t === 'Prefix Sum')) return 'prefix-sum-hashmap';
    if (topics.some(t => t === 'Dynamic Programming') && topicsLower.includes('subarray')) return 'kadanes-algorithm';
    if (topics.some(t => t === 'Divide and Conquer')) return 'merge-sort-divide-conquer';
    if (topics.some(t => t === 'Sorting') || topics.some(t => t === 'Greedy')) return 'sort-greedy';
    if (topics.some(t => t === 'Bit Manipulation')) return 'xor-math-tricks';
    if (topics.some(t => t === 'Math')) return 'xor-math-tricks';
    if (topics.some(t => t === 'Matrix')) return 'matrix-simulation';
    if (topics.some(t => t === 'Monotonic Stack')) return 'monotonic-stack-queue';
    if (topics.some(t => t === 'Stack')) return 'monotonic-stack-queue';
    if (topics.some(t => t === 'Binary Search')) return 'binary-search-on-answer';
    return null;
  }

  if (hasGraph) {
    if (topicsLower.includes('union find') || topicsLower.includes('disjoint set')) {
      return 'union-find';
    }
    if (topicsLower.includes('topological sort')) {
      return 'topological-sort';
    }
    if (topicsLower.includes('minimum spanning tree')) {
      return 'minimum-spanning-tree';
    }
    if (topicsLower.includes('bipartite')) {
      return 'bipartite-check';
    }
    if (topicsLower.includes('shortest path') || topicsLower.includes('dijkstra')) {
      return 'dijkstra-shortest-path';
    }
    if (topicsLower.includes('breadth-first search')) {
      return 'bfs-shortest-path';
    }
    if (topicsLower.includes('depth-first search')) {
      return 'dfs-traversal';
    }
    if (topicsLower.includes('matrix') || topicsLower.includes('grid')) {
      return 'island-grid-traversal';
    }
    return null;
  }

  return null;
}

async function main() {
  console.log('Starting Tightened CompanyProblem cleanup...');

  // 1. Preload counts
  const totalCompanyProblemsBefore = await prisma.companyProblem.count();
  const totalProblemsBefore = await prisma.problem.count();

  // 2. Fetch original problems
  const originalProblems = await prisma.problem.findMany({
    where: { leetcodeProblemNumber: { not: null } }
  });
  const originalProblemIds = new Set(originalProblems.map(p => p.id));
  const originalProblemUrls = new Set(originalProblems.map(p => normalizeUrl(p.leetcodeUrl)));

  console.log(`Original hand-curated problems loaded: ${originalProblemIds.size}`);

  // 3. Load all company CSVs and resolve pattern slugs under tight rules
  const csvResolvedPatterns = new Map<string, string | null>(); // normalizedUrl -> patternSlug
  
  for (const [companyName, folderName] of Object.entries(COMPANY_FOLDERS)) {
    console.log(`Downloading and parsing CSV for ${companyName}...`);
    try {
      const csvUrl = `https://raw.githubusercontent.com/liquidslr/leetcode-company-wise-problems/main/${folderName}/5.%20All.csv`;
      const response = await fetch(csvUrl);
      if (!response.ok) continue;

      const csvText = await response.text();
      const lines = csvText.split(/\r?\n/).filter((line: string) => line.trim() !== '');
      if (lines.length <= 1) continue;

      const header = parseCSVLine(lines[0]);
      const linkIdx = header.findIndex(h => h.toLowerCase() === 'link');
      const topicsIdx = header.findIndex(h => h.toLowerCase() === 'topics');

      for (let i = 1; i < lines.length; i++) {
        const columns = parseCSVLine(lines[i]);
        if (columns.length < 5) continue;

        const leetcodeUrl = columns[linkIdx];
        const topicsStr = columns[topicsIdx] || '';
        if (!leetcodeUrl) continue;

        const normalizedUrl = normalizeUrl(leetcodeUrl);
        if (originalProblemUrls.has(normalizedUrl)) {
          continue; // Skip original problems from this classification
        }

        const resolvedSlug = getPatternSlugForProblem(topicsStr);
        csvResolvedPatterns.set(normalizedUrl, resolvedSlug);
      }
    } catch (err: any) {
      console.error(`Error loading CSV for ${companyName}:`, err.message);
    }
  }

  console.log(`Classified ${csvResolvedPatterns.size} imported problems under tight rules.`);

  // 4. Fetch all CompanyProblem links
  const allCompanyProblems = await prisma.companyProblem.findMany({
    include: {
      company: true,
      problem: true
    }
  });

  const companyProblemsToDelete = new Set<string>();
  const companyToLinksMap = new Map<string, any[]>();

  for (const link of allCompanyProblems) {
    const isOriginal = originalProblemIds.has(link.problemId);

    if (!isOriginal) {
      const normalizedUrl = normalizeUrl(link.problem.leetcodeUrl);
      const resolvedSlug = csvResolvedPatterns.get(normalizedUrl);

      // Rule 1: Delete if frequencyScore < 50
      if (link.frequencyScore < 50) {
        companyProblemsToDelete.add(link.id);
        continue;
      }

      // Rule 2: Delete if it resolved to null (no longer maps to our 19 patterns)
      if (!resolvedSlug || !VALID_PATTERN_SLUGS.includes(resolvedSlug)) {
        companyProblemsToDelete.add(link.id);
        continue;
      }
    }

    // Keep and group by company for the 100 limit cap
    const companyId = link.companyId;
    if (!companyToLinksMap.has(companyId)) {
      companyToLinksMap.set(companyId, []);
    }
    companyToLinksMap.get(companyId)!.push(link);
  }

  // 5. Apply the 100 links per-company cap
  const companyNamesMap = new Map<string, string>();
  const finalCompanyCounts = new Map<string, number>();

  for (const [companyId, links] of companyToLinksMap.entries()) {
    const companyName = links[0].company.name;
    companyNamesMap.set(companyId, companyName);

    // Sort by frequencyScore descending
    links.sort((a, b) => b.frequencyScore - a.frequencyScore);

    // Keep top 100, delete the rest
    const keptLinks = links.slice(0, 100);
    const rejectedLinks = links.slice(100);

    finalCompanyCounts.set(companyName, keptLinks.length);

    for (const link of rejectedLinks) {
      companyProblemsToDelete.add(link.id);
    }
  }

  // 6. Delete disqualified records
  const deleteIdsArray = Array.from(companyProblemsToDelete);
  console.log(`Deleting ${deleteIdsArray.length} disqualified company-problem links...`);
  
  if (deleteIdsArray.length > 0) {
    const deleteResult = await prisma.companyProblem.deleteMany({
      where: {
        id: { in: deleteIdsArray }
      }
    });
    console.log(`Successfully deleted ${deleteResult.count} links.`);
  }

  // 7. Verify counts after cleanup
  const totalCompanyProblemsAfter = await prisma.companyProblem.count();
  const totalProblemsAfter = await prisma.problem.count();

  console.log('----------------------------------------------------');
  console.log('CLEANUP REPORT:');
  console.log(`Total CompanyProblem rows BEFORE cleanup: ${totalCompanyProblemsBefore}`);
  console.log(`Total CompanyProblem rows AFTER cleanup:  ${totalCompanyProblemsAfter}`);
  console.log(`Total Problem rows BEFORE cleanup:        ${totalProblemsBefore}`);
  console.log(`Total Problem rows AFTER cleanup:         ${totalProblemsAfter} (should match before count)`);
  console.log('----------------------------------------------------');
  console.log('Per-Company Link Counts after cap:');
  
  const sortedCompanyCounts = Array.from(finalCompanyCounts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  sortedCompanyCounts.forEach(([name, count]) => {
    console.log(`- ${name}: ${count} links`);
  });
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
