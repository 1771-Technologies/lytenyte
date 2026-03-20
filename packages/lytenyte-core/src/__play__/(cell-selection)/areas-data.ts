// ── Types ────────────────────────────────────────────────────────────────────

export interface Employee {
  id: number;
  name: string;
  department: string;
  role: string;
  salary: number;
  age: number;
  startDate: string;
  country: string;
  city: string;
  email: string;
  phone: string;
  status: string;
  score: number;
  rating: string;
  manager: string;
  team: string;
  budget: number;
  active: string;
  notes: string;
  quarter: string;
  timezone: string;
  language: string;
  seniority: string;
  yearsExp: number;
  lastReview: string;
  contractType: string;
  projects: number;
  overtime: string;
  certification: string;
  region: string;
}

export interface EmployeeSpec {
  readonly data: Employee;
}

// ── Seed data ─────────────────────────────────────────────────────────────────

const FIRST_NAMES = [
  "Alice", "Bob", "Carol", "David", "Eve", "Frank", "Grace", "Henry",
  "Iris", "Jack", "Kate", "Liam", "Mia", "Noah", "Olivia", "Paul",
  "Quinn", "Rachel", "Sam", "Tara", "Uma", "Victor", "Wendy", "Xander",
];
const LAST_NAMES = [
  "Chen", "Williams", "Davis", "Kim", "Martinez", "Johnson", "Brown",
  "Taylor", "Wilson", "Moore", "Anderson", "Thomas", "Jackson", "White",
];
const DEPARTMENTS = ["Engineering", "Marketing", "Sales", "Finance", "HR", "Operations", "Design", "Legal"];
const ROLES = ["Engineer", "Senior Engineer", "Manager", "Director", "Analyst", "Coordinator", "Designer", "Specialist"];
const COUNTRIES = ["USA", "UK", "Canada", "Germany", "France", "Australia", "Japan", "Brazil"];
const CITIES = ["New York", "London", "Toronto", "Berlin", "Paris", "Sydney", "Tokyo", "São Paulo"];
const STATUSES = ["Active", "Remote", "On Leave", "Contract"];
const RATINGS = ["Excellent", "Good", "Average", "Below Average"];
const QUARTERS = ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024", "Q1 2025"];
const MANAGERS = ["Alice Chen", "Bob Williams", "Carol Davis", "David Kim", "Eve Martinez"];
const TEAMS = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta"];
const TIMEZONES = ["UTC-8", "UTC-5", "UTC+0", "UTC+1", "UTC+2", "UTC+5:30", "UTC+8", "UTC+9", "UTC-3"];
const LANGUAGES = ["English", "French", "German", "Spanish", "Japanese", "Mandarin", "Portuguese", "Korean"];
const SENIORITIES = ["Junior", "Mid", "Senior", "Lead", "Principal", "Staff"];
const CONTRACT_TYPES = ["Full-time", "Part-time", "Freelance", "Fixed-term"];
const CERTIFICATIONS = ["AWS", "PMP", "Scrum", "GCP", "Azure", "CPA", "CISSP", "None"];
const REGIONS = ["AMER", "EMEA", "APAC", "LATAM"];

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

// ── Generated data ────────────────────────────────────────────────────────────

export const employeeData: Employee[] = Array.from({ length: 150 }, (_, i) => {
  const first = pick(FIRST_NAMES, i * 3);
  const last = pick(LAST_NAMES, i * 7 + 3);
  return {
    id: i + 1,
    name: `${first} ${last}`,
    department: pick(DEPARTMENTS, i),
    role: pick(ROLES, i + 2),
    salary: 50_000 + ((i * 2_137) % 80_000),
    age: 22 + ((i * 13) % 40),
    startDate: `202${i % 4}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    country: pick(COUNTRIES, i + 1),
    city: pick(CITIES, i + 1),
    email: `${first.toLowerCase()}.${last.toLowerCase()}@company.com`,
    phone: `+1-555-${String(1000 + i).padStart(4, "0")}`,
    status: pick(STATUSES, i + 3),
    score: 40 + ((i * 11) % 60),
    rating: pick(RATINGS, i + 4),
    manager: pick(MANAGERS, i),
    team: pick(TEAMS, i + 5),
    budget: 10_000 + ((i * 3_571) % 90_000),
    active: i % 5 !== 0 ? "Yes" : "No",
    notes: `Performance review due ${pick(QUARTERS, i + 1)}`,
    quarter: pick(QUARTERS, i),
    timezone: pick(TIMEZONES, i + 6),
    language: pick(LANGUAGES, i + 7),
    seniority: pick(SENIORITIES, i + 8),
    yearsExp: 1 + ((i * 7) % 20),
    lastReview: `202${(i + 2) % 4}-${String((i % 12) + 1).padStart(2, "0")}-01`,
    contractType: pick(CONTRACT_TYPES, i + 9),
    projects: 1 + ((i * 3) % 12),
    overtime: i % 3 === 0 ? "Yes" : "No",
    certification: pick(CERTIFICATIONS, i + 10),
    region: pick(REGIONS, i + 11),
  };
});
