import "./tree-view.css";
import type { Meta, StoryObj } from "@storybook/react";
import { TreeRoot } from "../root.js";
import { TreePanel } from "../panel/panel.js";
import { TreeLeaf } from "../leaf.js";
import { TreeBranch } from "../branch/branch.js";
import { useTreeViewPaths } from "../hooks/use-tree-view-paths.js";
import type { PathBranch, PathLeaf } from "@1771technologies/lytenyte-path";
import { useVirtualizedTree } from "../virtualized/use-virtualized-tree.js";
import { figmaData } from "./data.js";
import type { TreeVirtualItem } from "../virtualized/make-virtual-tree.js";
import { useState } from "react";
import { ForceSyncScrolling } from "../virtualized/force-sync-scrolling.js";

const meta: Meta = {
  title: "Components/TreeView",
};

export default meta;

export const Main: StoryObj = {
  render: () => {
    return (
      <TreeRoot
        selectMode="multiple"
        gridWrappedBranches
        transitionEnter={200}
        transitionExit={200}
        expansionDefault
      >
        <TreePanel>
          <TreeBranch itemId="x" label={<div>Run twice</div>}>
            <TreeLeaf itemId="x1">Profile</TreeLeaf>
            <TreeLeaf itemId="x2">Security</TreeLeaf>
            <TreeLeaf itemId="x3">Email Alerts</TreeLeaf>
          </TreeBranch>
          <TreeBranch itemId="y" label={<div>Projects</div>}>
            <TreeLeaf itemId="y1">New Project</TreeLeaf>
            <TreeLeaf itemId="y2">Archived Projects</TreeLeaf>
            <TreeLeaf itemId="y3">Monthly Report</TreeLeaf>
            <TreeBranch itemId="z" label={<div>Sales</div>}>
              <TreeLeaf itemId="z1">Sales</TreeLeaf>
              <TreeLeaf itemId="z2">Customer Feedback</TreeLeaf>
              <TreeLeaf itemId="z3">Billing</TreeLeaf>
            </TreeBranch>
          </TreeBranch>
        </TreePanel>
      </TreeRoot>
    );
  },
};

interface PathData {
  readonly id: string;
  readonly groupPath?: string[];
  readonly label: string;
}

function RenderNode({ node: p }: { node: PathBranch<PathData> | PathLeaf<PathData> }) {
  if (p.kind === "leaf") {
    return <TreeLeaf itemId={p.data.id}>{p.data.label}</TreeLeaf>;
  }

  const values = [...p.children.values()];

  return (
    <TreeBranch itemId={p.id} label={<div>{p.id.split("#").at(-1)}</div>}>
      {values.map((c) => {
        return <RenderNode node={c} key={c.kind === "branch" ? c.id : c.data.id}></RenderNode>;
      })}
    </TreeBranch>
  );
}

function ViewFromPathHookComp() {
  const nodes = useTreeViewPaths(figmaData.slice(0, 60));

  return (
    <TreeRoot selectMode="multiple" gridWrappedBranches transitionEnter={200} transitionExit={200}>
      <TreePanel>
        {nodes.map((c) => {
          return <RenderNode node={c} key={c.kind === "branch" ? c.id : c.data.id} />;
        })}
      </TreePanel>
    </TreeRoot>
  );
}

export const ViewFromPathHook: StoryObj = {
  render: () => {
    return <ViewFromPathHookComp />;
  },
};

function VirtRenderNode({ node: p }: { node: TreeVirtualItem<PathData> }) {
  if (p.kind === "leaf") {
    return (
      <TreeLeaf {...p.attrs} itemId={p.leaf.data.id}>
        <button>Y</button>
        {p.leaf.data.label}
        <button>X</button>
      </TreeLeaf>
    );
  }

  const values = [...p.children.values()];

  return (
    <TreeBranch
      {...p.attrs}
      itemId={p.branch.id}
      label={
        <div>
          {p.branch.id.split("#").at(-1)} <button>Run twice</button>
        </div>
      }
    >
      {values.map((c) => {
        return <VirtRenderNode node={c} key={c.kind === "branch" ? c.branch.id : c.leaf.data.id} />;
      })}
    </TreeBranch>
  );
}

function VirtualizedView() {
  const [expansions, onExpansionChange] = useState<Record<string, boolean>>({});

  const { ref, virtualTree, spacer, rootProps } = useVirtualizedTree({
    paths: figmaData,
    expansions,
    itemHeight: 24,
    expansionDefault: true,
  });

  return (
    <TreeRoot
      selectMode="multiple"
      transitionEnter={200}
      transitionExit={200}
      onExpansionChange={onExpansionChange}
      expansions={expansions}
      expansionDefault
      ref={ref}
      {...rootProps}
    >
      <TreePanel
        style={{
          overflow: "auto",
          height: 600,
          border: "1px solid black",
          width: "500px",
          position: "relative",
        }}
      >
        <ForceSyncScrolling>
          {virtualTree.map((c) => {
            return (
              <VirtRenderNode node={c} key={c.kind === "branch" ? c.branch.id : c.leaf.data.id} />
            );
          })}
        </ForceSyncScrolling>
        {spacer}
      </TreePanel>
    </TreeRoot>
  );
}

export const VirtualizedViewTree: StoryObj = {
  render: () => {
    return <VirtualizedView />;
  },
};
