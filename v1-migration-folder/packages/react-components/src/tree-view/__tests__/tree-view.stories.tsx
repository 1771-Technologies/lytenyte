import "./tree-view.css";
import type { Meta, StoryObj } from "@storybook/react";
import { TreeRoot } from "../root";
import { TreePanel } from "../panel/panel";
import { TreeLeaf } from "../leaf";
import { TreeBranch } from "../branch/branch";

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
      >
        <TreePanel>
          <TreeBranch itemId="x" label={<div>Run twice</div>} expandedDefault>
            <TreeLeaf itemId="x1">Profile</TreeLeaf>
            <TreeLeaf itemId="x2">Security</TreeLeaf>
            <TreeLeaf itemId="x3">Email Alerts</TreeLeaf>
          </TreeBranch>
          <TreeBranch itemId="y" label={<div>Projects</div>} expandedDefault>
            <TreeLeaf itemId="y1">New Project</TreeLeaf>
            <TreeLeaf itemId="y2">Archived Projects</TreeLeaf>
            <TreeLeaf itemId="y3">Monthly Report</TreeLeaf>
            <TreeBranch itemId="z" label={<div>Sales</div>} expandedDefault>
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

// const fakeData = [
//   { id: "1", label: "Dashboard" },
//   { id: "2", groupPath: ["Settings"], label: "Profile" },
//   { id: "3", groupPath: ["Settings"], label: "Security" },
//   { id: "4", groupPath: ["Settings", "Notifications"], label: "Email Alerts" },
//   { id: "5", groupPath: ["Settings", "Notifications"], label: "SMS Alerts" },
//   { id: "6", groupPath: ["Projects"], label: "New Project" },
//   { id: "7", groupPath: ["Projects"], label: "Archived Projects" },
//   { id: "8", groupPath: ["Reports"], label: "Monthly Report" },
//   { id: "9", groupPath: ["Reports", "2025"], label: "Q1" },
//   { id: "10", groupPath: ["Reports", "2025"], label: "Q2" },
//   { id: "11", groupPath: ["Reports", "2025", "Q2"], label: "Sales" },
//   { id: "12", groupPath: ["Reports", "2025", "Q2"], label: "Customer Feedback" },
//   { id: "13", label: "Help Center" },
//   { id: "14", groupPath: ["Account"], label: "Billing" },
//   { id: "15", groupPath: ["Account"], label: "Usage" },
// ];

/**
 *
 * Virtualization
 * - Need to provide the tree with the ability to select ranges of nodes
 * - Get the index of a specific node
 * - Add aria posinset values
 * - Keep the first selected node present
 * - Keep first and last node present
 * - Render tree virtually
 *
 *
 * Other Loading:
 * - Add async expansion to a tree
 * - Add imperative ref to tree
 * - Add disabled functionality to tree
 * - Final css improvements
 */
