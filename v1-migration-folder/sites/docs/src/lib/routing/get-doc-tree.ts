export interface DocItem {
  readonly slug: string[];
  readonly priority: number;
  readonly sections: { priority: number; name: string; expanded: boolean }[];
  readonly navKey?: string | undefined;
  readonly navTitle?: string | undefined;
  readonly title: string;
}

export interface SectionNode {
  type: "section";
  id: string;
  name: string;
  priority: number;
  doc?: DocItem;
  children: DocTreeNode[];
  expanded: boolean;
}
export interface DocNode {
  type: "doc";
  doc: DocItem;
}

export function getDocTree<T extends DocItem>(docs: T[]): SectionNode[] {
  const tree = buildDocItemTree(docs);

  return tree as SectionNode[];
}

type DocTreeNode = SectionNode | DocNode;

export function buildDocItemTree(docItems: DocItem[]): DocTreeNode[] {
  const root: DocTreeNode[] = [];
  const counts: Record<string, number> = {};

  function insertSectionPath(
    nodes: DocTreeNode[],
    sectionPath: { priority: number; name: string; expanded: boolean }[],
    attachAsSectionDoc: boolean,
    doc: DocItem,
  ) {
    let currentNodes = nodes;
    let currentNode: DocTreeNode | undefined;

    for (const section of sectionPath) {
      let sectionNode = currentNodes.find(
        (n): n is Extract<DocTreeNode, { type: "section" }> =>
          n.type === "section" && n.name === section.name,
      );

      counts[section.name] ??= 0;
      if (!sectionNode) {
        sectionNode = {
          id: `${section.name}-${counts[section.name]++}`,
          type: "section",
          name: section.name,
          priority: section.priority,
          children: [],
          expanded: section.expanded,
        };
        currentNodes.push(sectionNode);
      }

      currentNode = sectionNode;
      currentNodes = sectionNode.children;
    }

    if (!currentNode || currentNode.type !== "section") return;

    if (attachAsSectionDoc) {
      currentNode.doc = doc;
    } else {
      currentNode.children.push({ type: "doc", doc });
    }
  }

  for (const doc of docItems) {
    const sections = doc.sections;

    if (doc.navKey) {
      // Attach the doc as the section root of: sections + navKey
      const lastPriority = sections.length > 0 ? sections[sections.length - 1].priority : 1;

      const extendedSections = [
        ...sections,
        { priority: lastPriority, name: doc.navKey, expanded: true },
      ];

      insertSectionPath(root, extendedSections, true, doc);
    } else {
      // Standard leaf doc insertion
      insertSectionPath(root, sections, false, doc);
    }
  }

  // Sort all children by: sections first, then docs, then by priority
  function sortTree(nodes: DocTreeNode[]): DocTreeNode[] {
    return nodes
      .sort((a, b) => {
        const aPrio = a.type === "section" ? a.priority : a.doc.priority;
        const bPrio = b.type === "section" ? b.priority : b.doc.priority;

        if (a.type !== b.type) {
          return a.type === "section" ? -1 : 1; // Sections before docs
        }

        if (aPrio !== bPrio) return aPrio - bPrio;

        const aName = a.type === "section" ? a.name : a.doc.slug.join("/");
        const bName = b.type === "section" ? b.name : b.doc.slug.join("/");

        return aName.localeCompare(bName);
      })
      .map((n) => {
        if (n.type === "section") {
          return {
            ...n,
            children: sortTree(n.children),
          };
        }
        return n;
      });
  }

  return sortTree(root);
}
