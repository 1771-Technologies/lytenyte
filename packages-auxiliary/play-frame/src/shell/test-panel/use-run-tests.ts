import { useCallback, useEffect, useRef, useState } from "react";

export type TestState = "passed" | "failed" | "skipped" | "pending" | "running";

export interface TestCaseNode {
  kind: "test";
  name: string;
  fullName: string;
  state: TestState;
  duration?: number;
  errors: string[];
}

export interface TestSuiteNode {
  kind: "suite";
  name: string;
  state: TestState;
  children: TestNode[];
}

export type TestNode = TestSuiteNode | TestCaseNode;

export interface TestFileResult {
  filepath: string;
  projectName: string;
  state: TestState;
  nodes: TestNode[];
}

export interface TestSummary {
  success: boolean;
  numPassed: number;
  numFailed: number;
  numTotal: number;
}

export type RunStatus = "idle" | "collecting" | "running" | "done" | "error";

export type RunningScope =
  | { kind: "project"; projectName: string }
  | { kind: "test"; name: string; projectName: string };

export interface UseRunTestsResult {
  status: RunStatus;
  modules: TestFileResult[];
  summary: TestSummary | null;
  error: string | null;
  testFiles: string[];
  runningScope: RunningScope | null;
  run: () => void;
  runProject: (projectName: string) => void;
  runTest: (testName: string, projectName: string) => void;
}

interface TestCaseUpdate {
  filepath: string;
  projectName: string;
  fullName: string;
  state: TestState;
  duration?: number;
  errors: string[];
}

function updateTestNode(nodes: TestNode[], update: TestCaseUpdate): TestNode[] {
  return nodes.map((node) => {
    if (node.kind === "suite") return { ...node, children: updateTestNode(node.children, update) };
    if (node.fullName === update.fullName)
      return { ...node, state: update.state, duration: update.duration, errors: update.errors };
    return node;
  });
}

function resetNodes(nodes: TestNode[]): TestNode[] {
  return nodes.map((node) => {
    if (node.kind === "suite") return { ...node, children: resetNodes(node.children) };
    return { ...node, state: "pending" as const, errors: [], duration: undefined };
  });
}

function resetModules(modules: TestFileResult[]): TestFileResult[] {
  return modules.map((mod) => ({ ...mod, nodes: resetNodes(mod.nodes) }));
}

export function useRunTests(filePath: string | null): UseRunTestsResult {
  const wsRef = useRef<WebSocket | null>(null);
  const filePathRef = useRef(filePath);
  filePathRef.current = filePath;

  const [status, setStatus] = useState<RunStatus>("idle");
  const [modules, setModules] = useState<TestFileResult[]>([]);
  const [summary, setSummary] = useState<TestSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testFiles, setTestFiles] = useState<string[]>([]);
  const [runningScope, setRunningScope] = useState<RunningScope | null>(null);

  const send = useCallback((obj: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(obj));
    }
  }, []);

  useEffect(() => {
    let destroyed = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      if (destroyed) return;

      const ws = new WebSocket(`ws://${window.location.host}/ws`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (filePathRef.current) {
          setStatus("collecting");
          ws.send(JSON.stringify({ type: "discover", filePath: filePathRef.current }));
        }
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        // Discard responses that belong to a previous file selection
        if (msg.filePath && msg.filePath !== filePathRef.current) return;

        if (msg.type === "discovered") {
          setTestFiles(msg.testFiles);
          setStatus("collecting");
          setModules([]);
          setSummary(null);
          setError(null);
        } else if (msg.type === "collected") {
          setStatus("idle");
        } else if (msg.type === "test-case-start") {
          const tc = msg.testCase;
          setModules((prev) =>
            prev.map((mod) => {
              if (mod.filepath !== tc.filepath || mod.projectName !== tc.projectName) return mod;
              return { ...mod, nodes: updateTestNode(mod.nodes, { ...tc, state: "running", errors: [], duration: undefined }) };
            }),
          );
        } else if (msg.type === "test-case") {
          const tc = msg.testCase;
          setModules((prev) =>
            prev.map((mod) => {
              if (mod.filepath !== tc.filepath || mod.projectName !== tc.projectName) return mod;
              return { ...mod, nodes: updateTestNode(mod.nodes, tc) };
            }),
          );
        } else if (msg.type === "module") {
          setModules((prev) => {
            const idx = prev.findIndex(
              (m) =>
                m.filepath === msg.module.filepath && m.projectName === msg.module.projectName,
            );
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = msg.module;
              return next;
            }
            return [...prev, msg.module];
          });
        } else if (msg.type === "done") {
          setSummary(msg.summary);
          setStatus("done");
          setRunningScope(null);
        } else if (msg.type === "error") {
          setError(msg.error);
          setStatus("error");
          setRunningScope(null);
        }
      };

      ws.onclose = () => {
        if (!destroyed) {
          reconnectTimer = setTimeout(connect, 2000);
        }
      };
    };

    connect();

    return () => {
      destroyed = true;
      if (reconnectTimer != null) clearTimeout(reconnectTimer);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []);

  // Re-discover when the selected play file changes
  useEffect(() => {
    if (!filePath) return;
    send({ type: "discover", filePath });
    setModules([]);
    setSummary(null);
    setError(null);
    setStatus("collecting");
    setTestFiles([]);
  }, [filePath, send]);

  const startRun = useCallback(
    (scope: RunningScope | null, msg: unknown) => {
      if (!filePath) return;
      setStatus("running");
      setRunningScope(scope);
      setSummary(null);
      setError(null);
      setModules((prev) => resetModules(prev));
      send(msg);
    },
    [filePath, send],
  );

  const run = useCallback(() => {
    startRun(null, { type: "run", filePath });
  }, [filePath, startRun]);

  const runProject = useCallback(
    (projectName: string) => {
      startRun({ kind: "project", projectName }, { type: "run-project", filePath, projectName });
    },
    [filePath, startRun],
  );

  const runTest = useCallback(
    (testName: string, projectName: string) => {
      startRun(
        { kind: "test", name: testName, projectName },
        { type: "run-test", filePath, testName, projectName },
      );
    },
    [filePath, startRun],
  );

  return { status, modules, summary, error, testFiles, runningScope, run, runProject, runTest };
}
