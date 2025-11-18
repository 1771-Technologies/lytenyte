export type PerformanceData = (typeof performance)[number];

const performance = [
  {
    name: "John Smith",
    performance: {
      q1: 87,
      q2: 92,
      q3: 85,
      q4: 91,
    },
    revenue: [12e4, 145e3, 115e3, 16e4],
  },
  {
    name: "Emily Johnson",
    performance: {
      q1: 94,
      q2: 95,
      q3: 93,
      q4: 97,
    },
    revenue: [18e4, 195e3, 176e3, 23e4],
  },
  {
    name: "Michael Chen",
    performance: {
      q1: 78,
      q2: 82,
      q3: 88,
      q4: 92,
    },
    revenue: [95e3, 11e4, 13e4, 142e3],
  },
  {
    name: "Sarah Williams",
    performance: {
      q1: 91,
      q2: 89,
      q3: 90,
      q4: 93,
    },
    revenue: [15e4, 142e3, 155e3, 168e3],
  },
  {
    name: "David Rodriguez",
    performance: {
      q1: 85,
      q2: 83,
      q3: 81,
      q4: 90,
    },
    revenue: [125e3, 118e3, 105e3, 14e4],
  },
  {
    name: "Lisa Thompson",
    performance: {
      q1: 96,
      q2: 94,
      q3: 95,
      q4: 98,
    },
    revenue: [21e4, 205e3, 215e3, 245e3],
  },
  {
    name: "Robert Kim",
    performance: {
      q1: 82,
      q2: 85,
      q3: 89,
      q4: 87,
    },
    revenue: [105e3, 112e3, 128e3, 122e3],
  },
  {
    name: "Jennifer Singh",
    performance: {
      q1: 90,
      q2: 93,
      q3: 91,
      q4: 94,
    },
    revenue: [162e3, 177e3, 17e4, 185e3],
  },
  {
    name: "Thomas Jackson",
    performance: {
      q1: 79,
      q2: 84,
      q3: 88,
      q4: 86,
    },
    revenue: [98e3, 114e3, 132e3, 126e3],
  },
  {
    name: "Amanda Martinez",
    performance: {
      q1: 93,
      q2: 92,
      q3: 95,
      q4: 96,
    },
    revenue: [175e3, 172e3, 188e3, 194e3],
  },
  {
    name: "Kevin Wong",
    performance: {
      q1: 80,
      q2: 83,
      q3: 87,
      q4: 91,
    },
    revenue: [102e3, 109e3, 125e3, 138e3],
  },
  {
    name: "Michelle Brown",
    performance: {
      q1: 88,
      q2: 90,
      q3: 89,
      q4: 92,
    },
    revenue: [135e3, 148e3, 14e4, 157e3],
  },
  {
    name: "Brandon Lee",
    performance: {
      q1: 92,
      q2: 94,
      q3: 91,
      q4: 95,
    },
    revenue: [17e4, 182e3, 165e3, 19e4],
  },
  {
    name: "Sophia Patel",
    performance: {
      q1: 86,
      q2: 89,
      q3: 92,
      q4: 90,
    },
    revenue: [13e4, 145e3, 155e3, 148e3],
  },
  {
    name: "Christopher Wilson",
    performance: {
      q1: 81,
      q2: 85,
      q3: 84,
      q4: 86,
    },
    revenue: [11e4, 12e4, 118e3, 125e3],
  },
  {
    name: "Olivia Garcia",
    performance: {
      q1: 95,
      q2: 93,
      q3: 96,
      q4: 97,
    },
    revenue: [19e4, 185e3, 2e5, 21e4],
  },
  {
    name: "Daniel Taylor",
    performance: {
      q1: 84,
      q2: 87,
      q3: 90,
      q4: 89,
    },
    revenue: [115e3, 128e3, 142e3, 138e3],
  },
  {
    name: "Rachel Davis",
    performance: {
      q1: 89,
      q2: 91,
      q3: 88,
      q4: 93,
    },
    revenue: [14e4, 152e3, 137e3, 165e3],
  },
  {
    name: "Matthew Anderson",
    performance: {
      q1: 77,
      q2: 82,
      q3: 85,
      q4: 88,
    },
    revenue: [92e3, 107e3, 12e4, 132e3],
  },
  {
    name: "Emma Foster",
    performance: {
      q1: 94,
      q2: 96,
      q3: 95,
      q4: 98,
    },
    revenue: [185e3, 195e3, 19e4, 225e3],
  },
  {
    name: "Ryan Moore",
    performance: {
      q1: 83,
      q2: 81,
      q3: 86,
      q4: 89,
    },
    revenue: [112e3, 105e3, 124e3, 136e3],
  },
  {
    name: "Julia Nguyen",
    performance: {
      q1: 90,
      q2: 88,
      q3: 92,
      q4: 94,
    },
    revenue: [145e3, 138e3, 155e3, 17e4],
  },
  {
    name: "Andrew Scott",
    performance: {
      q1: 85,
      q2: 88,
      q3: 87,
      q4: 90,
    },
    revenue: [125e3, 135e3, 13e4, 145e3],
  },
  {
    name: "Jessica Parker",
    performance: {
      q1: 91,
      q2: 90,
      q3: 93,
      q4: 95,
    },
    revenue: [155e3, 15e4, 165e3, 18e4],
  },
  {
    name: "Eric Turner",
    performance: {
      q1: 82,
      q2: 84,
      q3: 86,
      q4: 85,
    },
    revenue: [11e4, 117e3, 125e3, 122e3],
  },
  {
    name: "Nicole Adams",
    performance: {
      q1: 88,
      q2: 90,
      q3: 91,
      q4: 93,
    },
    revenue: [135e3, 145e3, 15e4, 16e4],
  },
  {
    name: "James Howard",
    performance: {
      q1: 86,
      q2: 85,
      q3: 89,
      q4: 92,
    },
    revenue: [128e3, 125e3, 138e3, 152e3],
  },
  {
    name: "Stephanie Lewis",
    performance: {
      q1: 93,
      q2: 91,
      q3: 94,
      q4: 96,
    },
    revenue: [165e3, 158e3, 175e3, 19e4],
  },
  {
    name: "Tyler Campbell",
    performance: {
      q1: 80,
      q2: 84,
      q3: 82,
      q4: 85,
    },
    revenue: [1e5, 115e3, 108e3, 12e4],
  },
  {
    name: "Megan Wright",
    performance: {
      q1: 89,
      q2: 92,
      q3: 90,
      q4: 94,
    },
    revenue: [142e3, 155e3, 148e3, 172e3],
  },
];
export { performance };
