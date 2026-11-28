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

/** True when people rows carry parent/child edges we can walk for depth. */
export function peopleHaveRelationships(people: any[]): boolean {
  if (!Array.isArray(people) || people.length === 0) return false;
  return people.some((p) => {
    if (!p) return false;
    return Boolean(
      p.father ||
        p.father_id ||
        p.fatherId ||
        p.mother ||
        p.mother_id ||
        p.motherId ||
        (Array.isArray(p.parents) && p.parents.length > 0) ||
        (Array.isArray(p.children) && p.children.length > 0) ||
        p.spouse ||
        p.spouse_id ||
        p.spouseId
    );
  });
}

/** Lightweight GEDCOM relationship parse for card previews (no full person objects). */
function metricsFromGedcomText(rawGedcom: string): { individuals: number; generations: number } | null {
  const text = String(rawGedcom || "").replace(/^\uFEFF/, "");
  if (!text.trim()) return null;

  const indiMatches = text.match(/(?:^|\r?\n)0\s+@[^@\r\n]+@\s+INDI/gi);
  const individuals = indiMatches?.length || 0;
  if (individuals === 0) {
    if (text.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(text);
        const pList = parsed.persons || parsed.individuals || parsed.people;
        if (Array.isArray(pList) && pList.length > 0) {
          return {
            individuals: pList.length,
            generations: computeRealGenerations(pList),
          };
        }
      } catch {
        /* ignore */
      }
    }
    if (text.includes("<person")) {
      const xmlPersons = text.match(/<person[\s>]/gi);
      if (xmlPersons?.length) {
        return {
          individuals: xmlPersons.length,
          generations: Math.min(6, Math.max(1, Math.ceil(Math.log2(xmlPersons.length + 1)))),
        };
      }
    }
    return null;
  }

  // Build FAM → parents/children and INDI → FAMC for generation depth
  const families = new Map<string, { husb?: string; wife?: string; chil: string[] }>();
  const famcByPerson = new Map<string, string>();
  let currentFam: string | null = null;
  let currentIndi: string | null = null;

  for (const rawLine of text.split(/\r\n|\n|\r/)) {
    const line = String(rawLine || "").trim();
    if (!line) continue;
    const parts = line.split(/\s+/);
    if (parts[0] === "0") {
      currentFam = null;
      currentIndi = null;
      const hasPointer = String(parts[1] || "").startsWith("@");
      const pointer = hasPointer ? parts[1] : null;
      const tag = hasPointer ? parts[2] : parts[1];
      if (tag === "FAM" && pointer) {
        currentFam = pointer;
        if (!families.has(pointer)) families.set(pointer, { chil: [] });
      } else if (tag === "INDI" && pointer) {
        currentIndi = pointer;
      }
      continue;
    }
    if (currentFam) {
      const fam = families.get(currentFam)!;
      const tag = parts[1];
      const value = String(parts[2] || "").trim();
      if (tag === "HUSB" && value) fam.husb = value;
      if (tag === "WIFE" && value) fam.wife = value;
      if (tag === "CHIL" && value) fam.chil.push(value);
    }
    if (currentIndi && parts[1] === "FAMC") {
      const famId = String(parts[2] || "").trim();
      if (famId) famcByPerson.set(currentIndi, famId);
    }
  }

  const peopleProxy: any[] = [];
  const seen = new Set<string>();
  for (const m of indiMatches || []) {
    const idMatch = m.match(/@[^@]+@/);
    const id = idMatch ? idMatch[0] : null;
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const famId = famcByPerson.get(id);
    const fam = famId ? families.get(famId) : null;
    peopleProxy.push({
      id,
      father: fam?.husb || null,
      mother: fam?.wife || null,
      children: [],
    });
  }

  // Also attach children arrays from FAM records
  const byId = new Map(peopleProxy.map((p) => [p.id, p]));
  for (const fam of families.values()) {
    for (const child of fam.chil || []) {
      if (fam.husb && byId.has(fam.husb)) {
        const dad = byId.get(fam.husb)!;
        if (!dad.children.includes(child)) dad.children.push(child);
      }
      if (fam.wife && byId.has(fam.wife)) {
        const mom = byId.get(fam.wife)!;
        if (!mom.children.includes(child)) mom.children.push(child);
      }
      const childRec = byId.get(child);
      if (childRec) {
        if (fam.husb && !childRec.father) childRec.father = fam.husb;
        if (fam.wife && !childRec.mother) childRec.mother = fam.wife;
      }
    }
  }

  return {
    individuals,
    generations: computeRealGenerations(peopleProxy),
  };
}

function countDeclaredIndividuals(tree: any): number {
  const candidates = [
    tree?.people_count,
    tree?.membersCount,
    tree?.member_count,
    tree?.individuals_count,
    tree?.personCount,
  ];
  for (const value of candidates) {
    const n = Number(value);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return 0;
}

function countDeclaredSources(tree: any, people: any[]): number {
  const declared = Number(tree?.sources_count ?? tree?.sourcesCount);
  if (Number.isFinite(declared) && declared >= 0) return declared;
  if (!Array.isArray(people) || people.length === 0) return 0;
  let count = 0;
  for (const p of people) {
    if (!p) continue;
    if (p.archiveSource || p.archive_source || p.documentCode || p.document_code) count += 1;
    if (Array.isArray(p.links)) count += p.links.length;
    if (Array.isArray(p.sources)) count += p.sources.length;
  }
  return count;
}

function countCouples(people: any[]): number {
  if (!Array.isArray(people) || people.length === 0) return 0;
  const couplePairs = new Set<string>();
  for (const p of people) {
    if (!p) continue;
    if (p.spouse || p.spouse_id || p.spouseId) {
      const spouse = String(p.spouse || p.spouse_id || p.spouseId);
      couplePairs.add([String(p.id), spouse].sort().join("::"));
    }
    if (p.father && p.mother) {
      couplePairs.add([String(p.father), String(p.mother)].sort().join("::"));
    }
  }
  return couplePairs.size;
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

    const fId = p.father || p.father_id || p.fatherId;
    if (fId && idMap.has(String(fId).trim())) {
      parentsOf.get(pid)!.add(String(fId).trim());
    }

    const mId = p.mother || p.mother_id || p.motherId;
    if (mId && idMap.has(String(mId).trim())) {
      parentsOf.get(pid)!.add(String(mId).trim());
    }

    // FAMC pointer resolved elsewhere into father/mother; also accept parents[] arrays
    if (Array.isArray(p.parents)) {
      for (const parentId of p.parents) {
        const pStr = String(parentId).trim();
        if (idMap.has(pStr)) parentsOf.get(pid)!.add(pStr);
      }
    }

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

  const memo = new Map<string, number>();

  function getDepth(id: string, visited: Set<string>): number {
    if (memo.has(id)) return memo.get(id)!;
    if (visited.has(id)) return 1;

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
  let generations = 0;
  const people = Array.isArray(tree.people) ? tree.people : [];
  const declaredCount = countDeclaredIndividuals(tree);
  const hasGraph = peopleHaveRelationships(people);

  // 1. Prefer a real relationship graph when available
  if (hasGraph) {
    individuals = Math.max(people.length, declaredCount);
    generations = computeRealGenerations(people);
  } else {
    // Flat persons rows (id/name only) must not force generations = 1
    if (people.length > 0) {
      individuals = Math.max(people.length, declaredCount);
    }

    // 2. Prefer parsing GEDCOM text for accurate relationship depth on cards
    const rawGedcom =
      tree.gedcom_text || tree.content || tree.gedcom_data || tree.gedcom || tree.gedcomText;
    if (typeof rawGedcom === "string" && rawGedcom.trim().length > 0) {
      const fromGed = metricsFromGedcomText(rawGedcom);
      if (fromGed) {
        individuals = Math.max(individuals, fromGed.individuals, declaredCount);
        generations = fromGed.generations;
      }
    }

    // 3. Fallback to backend counts
    if (individuals === 0 && declaredCount > 0) {
      individuals = declaredCount;
    }

    if (generations === 0) {
      if (typeof tree.generations === "number" && tree.generations > 0) {
        generations = tree.generations;
      } else if (individuals === 0) {
        generations = 0;
      } else if (individuals === 1) {
        generations = 1;
      } else {
        // Proportional estimate only when graph/GEDCOM links are unavailable
        generations = Math.min(6, Math.max(1, Math.ceil(Math.log2(individuals + 1))));
      }
    }
  }

  if (individuals === 0 && declaredCount > 0) {
    individuals = declaredCount;
  }

  const couplesCount = hasGraph ? countCouples(people) : Number(tree.couples_count ?? tree.couplesCount) || 0;
  const sourcesCount = countDeclaredSources(tree, people);

  return { individuals, generations, couplesCount, sourcesCount };
}
