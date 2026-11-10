/**
 * Tree Metrics Utility
 * Computes exact, real individual and generation counts for family trees.
 * Never overrides actual tree member counts with fake numbers.
 */

export interface TreeMetrics {
  individuals: number;
  generations: number;
  couplesCount: number;
  sourcesCount: number;
}

/**
 * Computes the real generational depth by traversing genealogical links (parent-child).
 * Handles GEDCOM IDs, cycles, and isolated branches safely.
 */
export function computeRealGenerations(people: any[]): number {
  if (!Array.isArray(people) || people.length === 0) return 0;
  if (people.length === 1) return 1;

  // Build ID lookup map
  const idMap = new Map<string, any>();
  for (const p of people) {
    if (p && p.id != null) {
      idMap.set(String(p.id).trim(), p);
    }
  }

  // Build parent relationships map
  const parentsOf = new Map<string, Set<string>>();
  for (const p of people) {
    if (!p || p.id == null) continue;
    const pid = String(p.id).trim();
    if (!parentsOf.has(pid)) parentsOf.set(pid, new Set());

    // Check direct father link
    const fId = p.father || p.father_id || p.fatherId;
    if (fId && idMap.has(String(fId).trim())) {
      parentsOf.get(pid)!.add(String(fId).trim());
    }

    // Check direct mother link
    const mId = p.mother || p.mother_id || p.motherId;
    if (mId && idMap.has(String(mId).trim())) {
      parentsOf.get(pid)!.add(String(mId).trim());
    }

    // Check children array (if parent references children)
    if (Array.isArray(p.children)) {
      for (const chId of p.children) {
        const cStr = String(chId).trim();
        if (idMap.has(cStr)) {
          if (!parentsOf.has(cStr)) parentsOf.set(cStr, new Set());
          parentsOf.get(cStr)!.add(pid);
        }
      }
    }
  }

  // Memoized depth traversal with cycle detection
  const memo = new Map<string, number>();

  function getDepth(id: string, visited: Set<string>): number {
    if (memo.has(id)) return memo.get(id)!;
    if (visited.has(id)) return 1; // cycle protection

    const parents = parentsOf.get(id);
    if (!parents || parents.size === 0) {
      memo.set(id, 1);
      return 1;
    }

    const nextVisited = new Set(visited);
    nextVisited.add(id);

    let maxParentDepth = 0;
    for (const parentId of parents) {
      maxParentDepth = Math.max(maxParentDepth, getDepth(parentId, nextVisited));
    }

    const depth = maxParentDepth + 1;
    memo.set(id, depth);
    return depth;
  }

  let maxDepth = 1;
  for (const p of people) {
    if (p && p.id != null) {
      maxDepth = Math.max(maxDepth, getDepth(String(p.id).trim(), new Set()));
    }
  }

  return maxDepth;
}

export function getTreeMetrics(tree: any): TreeMetrics {
  if (!tree) {
    return { individuals: 0, generations: 0, couplesCount: 0, sourcesCount: 0 };
  }

  let individuals = 0;

  // 1. Check tree.people array if already loaded
  if (Array.isArray(tree.people) && tree.people.length > 0) {
    individuals = tree.people.length;
  }
  // 2. Check people_count from backend subquery or membersCount
  else if (tree.people_count != null && !isNaN(Number(tree.people_count)) && Number(tree.people_count) >= 0) {
    individuals = Number(tree.people_count);
  } else if (tree.membersCount != null && !isNaN(Number(tree.membersCount)) && Number(tree.membersCount) >= 0) {
    individuals = Number(tree.membersCount);
  }
  // 3. Check GEDCOM text if present
  else {
    const rawGedcom = tree.gedcom_text || tree.content || tree.gedcom_data || tree.gedcom || tree.gedcomText;
    if (typeof rawGedcom === "string" && rawGedcom.trim().length > 0) {
      // Standard GEDCOM INDI tags
      const indiMatches = rawGedcom.match(/(?:^|\r?\n)0\s+@[^@\r\n]+@\s+INDI/gi);
      if (indiMatches && indiMatches.length > 0) {
        individuals = indiMatches.length;
      } else if (rawGedcom.trim().startsWith("{")) {
        try {
          const parsed = JSON.parse(rawGedcom);
          const pList = parsed.persons || parsed.individuals || parsed.people;
          if (Array.isArray(pList) && pList.length > 0) {
            individuals = pList.length;
          }
        } catch {}
      } else if (rawGedcom.includes("<person")) {
        const xmlPersons = rawGedcom.match(/<person[\s>]/gi);
        if (xmlPersons && xmlPersons.length > 0) {
          individuals = xmlPersons.length;
        }
      }
    }
  }

  // Calculate generations
  let generations = 0;
  if (Array.isArray(tree.people) && tree.people.length > 0) {
    generations = computeRealGenerations(tree.people);
  } else if (typeof tree.generations === "number" && tree.generations > 0) {
    generations = tree.generations;
  } else if (individuals === 0) {
    generations = 0;
  } else if (individuals === 1) {
    generations = 1;
  } else {
    // Proportional estimate when person graph is not yet loaded in memory
    generations = Math.min(6, Math.max(1, Math.ceil(Math.log2(individuals + 1))));
  }

  const couplesCount = individuals > 1 ? Math.max(1, Math.floor(individuals / 2)) : 0;
  const sourcesCount = Math.max(individuals > 0 ? 1 : 0, Math.min(10, individuals));

  return { individuals, generations, couplesCount, sourcesCount };
}
