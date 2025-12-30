export const data: Record<string, any> = {
  "README.md": {
    kind: "file",
    size: 2450,
    last_modified: "2025-01-01T09:00:00Z",
    type: "md",
  },
  Documents: {
    "overview.txt": {
      kind: "file",
      size: 1200,
      last_modified: "2025-01-02T08:10:00Z",
      type: "txt",
    },
    Reports: {
      "annual_summary_2024.pdf": {
        kind: "file",
        size: 901230,
        last_modified: "2025-01-03T11:00:00Z",
        type: "pdf",
      },
      Financials: {
        Q1: {
          "revenue.xlsx": {
            kind: "file",
            size: 204800,
            last_modified: "2024-04-01T12:00:00Z",
            type: "xlsx",
          },
          "expenses.xlsx": {
            kind: "file",
            size: 189000,
            last_modified: "2024-04-01T12:10:00Z",
            type: "xlsx",
          },
        },
        Q2: {
          "summary.docx": {
            kind: "file",
            size: 54321,
            last_modified: "2024-07-01T09:00:00Z",
            type: "docx",
          },
        },
      },
    },
    Policies: {
      HR: {
        "handbook.pdf": {
          kind: "file",
          size: 502341,
          last_modified: "2024-09-02T09:15:00Z",
          type: "pdf",
        },
      },
      Legal: {
        contracts: {
          "nda_template.docx": {
            kind: "file",
            size: 39213,
            last_modified: "2024-09-05T10:00:00Z",
            type: "docx",
          },
          "employee_agreement.docx": {
            kind: "file",
            size: 48200,
            last_modified: "2024-09-06T10:05:00Z",
            type: "docx",
          },
        },
      },
    },
  },
  Projects: {
    Project_Nova: {
      docs: {
        specifications: {
          "architecture_v1.pdf": {
            kind: "file",
            size: 700500,
            last_modified: "2025-01-15T10:00:00Z",
            type: "pdf",
          },
          "architecture_v2.pdf": {
            kind: "file",
            size: 720400,
            last_modified: "2025-01-20T11:15:00Z",
            type: "pdf",
          },
          deep: {
            nested: {
              notes: {
                "draft_outline.txt": {
                  kind: "file",
                  size: 1500,
                  last_modified: "2025-01-21T13:00:00Z",
                  type: "txt",
                },
                "references.md": {
                  kind: "file",
                  size: 3800,
                  last_modified: "2025-01-22T08:00:00Z",
                  type: "md",
                },
              },
            },
          },
        },
      },
      src: {
        frontend: {
          "index.html": {
            kind: "file",
            size: 10400,
            last_modified: "2025-01-15T09:00:00Z",
            type: "html",
          },
          assets: {
            images: {
              "logo.svg": {
                kind: "file",
                size: 1234,
                last_modified: "2025-01-15T09:05:00Z",
                type: "svg",
              },
              "background.png": {
                kind: "file",
                size: 154000,
                last_modified: "2025-01-15T09:10:00Z",
                type: "png",
              },
            },
            styles: {
              "main.css": {
                kind: "file",
                size: 7200,
                last_modified: "2025-01-15T09:15:00Z",
                type: "css",
              },
            },
          },
        },
        backend: {
          api: {
            routes: {
              "auth.js": {
                kind: "file",
                size: 34000,
                last_modified: "2025-01-16T10:00:00Z",
                type: "js",
              },
              "users.js": {
                kind: "file",
                size: 42000,
                last_modified: "2025-01-16T10:10:00Z",
                type: "js",
              },
            },
            db: {
              models: {
                "userModel.js": {
                  kind: "file",
                  size: 18000,
                  last_modified: "2025-01-16T10:20:00Z",
                  type: "js",
                },
                "orderModel.js": {
                  kind: "file",
                  size: 17000,
                  last_modified: "2025-01-16T10:25:00Z",
                  type: "js",
                },
              },
              "connections.js": {
                kind: "file",
                size: 11000,
                last_modified: "2025-01-16T10:30:00Z",
                type: "js",
              },
            },
          },
          tests: {
            "auth.test.js": {
              kind: "file",
              size: 12000,
              last_modified: "2025-01-17T09:00:00Z",
              type: "js",
            },
            "users.test.js": {
              kind: "file",
              size: 14000,
              last_modified: "2025-01-17T09:15:00Z",
              type: "js",
            },
          },
        },
      },
    },
    Project_Orion: {
      data: {
        raw: {
          "data_01.csv": {
            kind: "file",
            size: 44000,
            last_modified: "2025-02-01T10:00:00Z",
            type: "csv",
          },
          "data_02.csv": {
            kind: "file",
            size: 39000,
            last_modified: "2025-02-01T10:05:00Z",
            type: "csv",
          },
        },
        processed: {
          "clean_data.csv": {
            kind: "file",
            size: 56000,
            last_modified: "2025-02-02T12:00:00Z",
            type: "csv",
          },
          insights: {
            graphs: {
              "plot1.png": {
                kind: "file",
                size: 89000,
                last_modified: "2025-02-02T12:30:00Z",
                type: "png",
              },
              "plot2.png": {
                kind: "file",
                size: 102000,
                last_modified: "2025-02-02T12:45:00Z",
                type: "png",
              },
            },
            "report.pdf": {
              kind: "file",
              size: 780000,
              last_modified: "2025-02-03T08:00:00Z",
              type: "pdf",
            },
          },
        },
      },
    },
  },
  System: {
    configs: {
      "app.json": {
        kind: "file",
        size: 4300,
        last_modified: "2025-02-10T10:00:00Z",
        type: "json",
      },
      deep: {
        nested: {
          settings: {
            dev: {
              "config.yaml": {
                kind: "file",
                size: 6500,
                last_modified: "2025-02-11T11:00:00Z",
                type: "yaml",
              },
            },
            prod: {
              "config.yaml": {
                kind: "file",
                size: 7200,
                last_modified: "2025-02-11T11:05:00Z",
                type: "yaml",
              },
            },
          },
        },
      },
    },
    logs: {
      "2025": {
        January: {
          "week_1.log": {
            kind: "file",
            size: 112000,
            last_modified: "2025-01-07T09:00:00Z",
            type: "log",
          },
          "week_2.log": {
            kind: "file",
            size: 121000,
            last_modified: "2025-01-14T09:00:00Z",
            type: "log",
          },
          "week_3.log": {
            kind: "file",
            size: 134000,
            last_modified: "2025-01-21T09:00:00Z",
            type: "log",
          },
        },
        February: {
          "week_1.log": {
            kind: "file",
            size: 108000,
            last_modified: "2025-02-04T09:00:00Z",
            type: "log",
          },
        },
      },
    },
  },
  Temp: {
    "cache.tmp": {
      kind: "file",
      size: 1400,
      last_modified: "2025-02-12T09:00:00Z",
      type: "tmp",
    },
    downloads: {
      "update_patch_v2.zip": {
        kind: "file",
        size: 11200000,
        last_modified: "2025-02-12T09:30:00Z",
        type: "zip",
      },
    },
  },
};
