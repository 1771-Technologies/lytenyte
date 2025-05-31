/*
Copyright 2025 1771 Technologies

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { Bench, hrtimeNow } from "tinybench";
import type { PathProvidedItem } from "./+types.path-table.js";
import { computePathMatrix } from "./compute-path-matrix.js";
import { transposePathMatrix } from "./transpose-path-table.js";
import { computePathTable } from "./compute-path-table.js";

const bench = new Bench({
  name: "Compute Path Table",
  time: 1_000,
  now: hrtimeNow,
  warmup: true,
});

const pathsSmall = generatePaths(30);
const pathsMedium = generatePaths(100);
const pathsLarge = generatePaths(500);
const pathsInsane = generatePaths(2000);

bench.add("computePathMatrix: small table", () => {
  computePathMatrix(pathsSmall);
});
bench.add("computePathMatrix: medium table", () => {
  computePathMatrix(pathsMedium);
});
bench.add("computePathMatrix: large table", () => {
  computePathMatrix(pathsLarge);
});
bench.add("computePathMatrix: insane table", () => {
  computePathMatrix(pathsInsane);
});

const tableSmall = computePathMatrix(pathsSmall);
const tableMedium = computePathMatrix(pathsMedium);
const tableLarge = computePathMatrix(pathsLarge);
const tableInsane = computePathMatrix(pathsInsane);

bench.add("transposePathTable: small table", () => {
  transposePathMatrix(tableSmall);
});
bench.add("transposePathTable: medium table", () => {
  transposePathMatrix(tableMedium);
});
bench.add("transposePathTable: large table", () => {
  transposePathMatrix(tableLarge);
});
bench.add("transposePathTable: insane table", () => {
  transposePathMatrix(tableInsane);
});

bench.add("computePathMatrix and transposePathTable: small table", () => {
  const t = computePathMatrix(pathsSmall);
  transposePathMatrix(t);
});
bench.add("computePathMatrix and transposePathTable: medium table", () => {
  const t = computePathMatrix(pathsMedium);
  transposePathMatrix(t);
});
bench.add("computePathMatrix and transposePathTable: large table", () => {
  const t = computePathMatrix(pathsLarge);
  transposePathMatrix(t);
});
bench.add("computePathMatrix and transposePathTable: insane table", () => {
  const t = computePathMatrix(pathsInsane);
  transposePathMatrix(t);
});

bench.add("computePathTable: small table", () => {
  computePathTable(pathsSmall);
});
bench.add("computePathTable: medium table", () => {
  computePathTable(pathsMedium);
});
bench.add("computePathTable: large table", () => {
  computePathTable(pathsLarge);
});
bench.add("computePathTable: insane table", () => {
  computePathTable(pathsInsane);
});

await bench.run();

console.log(bench.name);
console.table(bench.table());

// Function to generate the large array
function generatePaths(count: number): PathProvidedItem[] {
  const result: PathProvidedItem[] = [];

  // Define some categories and subcategories for variety
  const categories = [
    "Products",
    "Services",
    "Support",
    "Information",
    "Partners",
    "Resources",
    "Marketing",
    "Sales",
    "Engineering",
    "Operations",
    "Finance",
    "HR",
    "Legal",
    "Security",
    "Development",
  ];

  const subcategories: Record<string, string[]> = {
    Products: [
      "Electronics",
      "Clothing",
      "Home",
      "Office",
      "Sports",
      "Toys",
      "Beauty",
      "Health",
      "Food",
      "Automotive",
    ],
    Services: [
      "Maintenance",
      "Consulting",
      "Training",
      "Installation",
      "Repair",
      "Design",
      "Analysis",
      "Management",
      "Advisory",
      "Planning",
    ],
    Support: [
      "Technical",
      "Customer",
      "Documentation",
      "FAQ",
      "Troubleshooting",
      "Guides",
      "Tutorials",
      "Forums",
      "Chat",
      "Email",
    ],
    Information: [
      "Company",
      "Legal",
      "Privacy",
      "Terms",
      "Policies",
      "News",
      "Events",
      "Blog",
      "Press",
      "Announcements",
    ],
    Partners: [
      "Vendors",
      "Resellers",
      "Distributors",
      "Affiliates",
      "Collaborators",
      "Sponsors",
      "Integrators",
      "Consultants",
      "Agencies",
      "Franchises",
    ],
    Resources: [
      "Documentation",
      "Downloads",
      "Tools",
      "Templates",
      "Samples",
      "Whitepapers",
      "Reports",
      "Studies",
      "Webinars",
      "Videos",
    ],
    Marketing: [
      "Campaigns",
      "Brand",
      "Digital",
      "Content",
      "Social",
      "Events",
      "Analytics",
      "Strategy",
      "Creative",
      "Media",
    ],
    Sales: [
      "Retail",
      "Wholesale",
      "Enterprise",
      "SMB",
      "Direct",
      "Channel",
      "International",
      "Domestic",
      "Online",
      "Offline",
    ],
    Engineering: [
      "Software",
      "Hardware",
      "Systems",
      "Testing",
      "QA",
      "Research",
      "Development",
      "Design",
      "Architecture",
      "Infrastructure",
    ],
    Operations: [
      "Logistics",
      "Facilities",
      "Production",
      "Supply",
      "Inventory",
      "Shipping",
      "Quality",
      "Safety",
      "Compliance",
      "Maintenance",
    ],
    Finance: [
      "Accounting",
      "Budgeting",
      "Reporting",
      "Taxes",
      "Investments",
      "Treasury",
      "Audit",
      "Payroll",
      "Billing",
      "Planning",
    ],
    HR: [
      "Recruiting",
      "Benefits",
      "Training",
      "Performance",
      "Culture",
      "Compensation",
      "Employee",
      "Wellness",
      "Development",
      "Relations",
    ],
    Legal: [
      "Contracts",
      "IP",
      "Compliance",
      "Regulatory",
      "Litigation",
      "Corporate",
      "International",
      "Risk",
      "Ethics",
      "Governance",
    ],
    Security: [
      "Physical",
      "Digital",
      "Network",
      "Application",
      "Data",
      "Cloud",
      "Identity",
      "Access",
      "Monitoring",
      "Response",
    ],
    Development: [
      "Frontend",
      "Backend",
      "Mobile",
      "Web",
      "API",
      "Database",
      "DevOps",
      "QA",
      "UI/UX",
      "Testing",
    ],
  };

  const subsubcategories: Record<string, string[]> = {
    Electronics: [
      "Computers",
      "Phones",
      "Audio",
      "Video",
      "Gaming",
      "Wearables",
      "Cameras",
      "TVs",
      "Accessories",
      "Smart Home",
    ],
    Clothing: [
      "Men",
      "Women",
      "Kids",
      "Shoes",
      "Outerwear",
      "Sports",
      "Formal",
      "Casual",
      "Accessories",
      "Seasonal",
    ],
    Maintenance: [
      "Home",
      "Auto",
      "Office",
      "Equipment",
      "Preventive",
      "Scheduled",
      "Emergency",
      "Inspection",
      "Cleaning",
      "Repair",
    ],
    Customer: [
      "Returns",
      "Exchanges",
      "Complaints",
      "Feedback",
      "Loyalty",
      "Service",
      "Support",
      "Help",
      "Assistance",
      "Care",
    ],
    Company: [
      "About",
      "Team",
      "History",
      "Mission",
      "Values",
      "Culture",
      "Careers",
      "Locations",
      "Leadership",
      "Diversity",
    ],
    Documentation: [
      "API",
      "Guides",
      "Manuals",
      "Specifications",
      "References",
      "Standards",
      "Procedures",
      "Instructions",
      "Tutorials",
      "Examples",
    ],
  };

  // Generate items with varied paths
  for (let i = 1; i <= count; i++) {
    const id = `item${i}`;

    // About 10% of items will have no groupPath
    if (Math.random() < 0.1) {
      result.push({ id });
      continue;
    }

    // Choose a random category
    const category = categories[Math.floor(Math.random() * categories.length)];

    // 30% chance of only category level
    if (Math.random() < 0.3) {
      result.push({ id, groupPath: [category] });
      continue;
    }

    // Choose a random subcategory
    const subcategoryArray = subcategories[category] || [];
    const subcategory = subcategoryArray[Math.floor(Math.random() * subcategoryArray.length)];

    // 40% chance of stopping at subcategory level
    if (Math.random() < 0.4) {
      result.push({ id, groupPath: [category, subcategory] });
      continue;
    }

    // Choose a random subsubcategory
    const subsubcategoryArray = subsubcategories[subcategory] || [];
    if (subsubcategoryArray.length === 0) {
      result.push({ id, groupPath: [category, subcategory] });
      continue;
    }

    const subsubcategory =
      subsubcategoryArray[Math.floor(Math.random() * subsubcategoryArray.length)];
    result.push({ id, groupPath: [category, subcategory, subsubcategory] });
  }

  return result;
}
