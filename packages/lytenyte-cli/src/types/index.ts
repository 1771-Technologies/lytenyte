export type AIType =
  | "claude"
  | "cursor"
  | "windsurf"
  | "antigravity"
  | "copilot"
  | "kiro"
  | "roocode"
  | "codex"
  | "qoder"
  | "gemini"
  | "trae"
  | "opencode"
  | "continue"
  | "codebuddy"
  | "droid"
  | "kilocode"
  | "warp"
  | "augment"
  | "all";

export interface AIConfig {
  label: string;
  skillsPath: string;
  detectPaths: string[];
}

export const AI_CONFIGS: Record<Exclude<AIType, "all">, AIConfig> = {
  claude: { label: "Claude Code", skillsPath: ".claude/skills", detectPaths: [".claude"] },
  cursor: { label: "Cursor", skillsPath: ".cursor/skills", detectPaths: [".cursor"] },
  windsurf: { label: "Windsurf", skillsPath: ".windsurf/skills", detectPaths: [".windsurf"] },
  antigravity: { label: "Antigravity", skillsPath: ".agents/skills", detectPaths: [".agents", ".agent"] },
  copilot: { label: "GitHub Copilot", skillsPath: ".github/skills", detectPaths: [".github/skills"] },
  kiro: { label: "Kiro", skillsPath: ".kiro/steering", detectPaths: [".kiro"] },
  codex: { label: "Codex", skillsPath: ".codex/skills", detectPaths: [".codex"] },
  roocode: { label: "RooCode", skillsPath: ".roo/skills", detectPaths: [".roo"] },
  qoder: { label: "Qoder", skillsPath: ".qoder/skills", detectPaths: [".qoder"] },
  gemini: { label: "Gemini CLI", skillsPath: ".gemini/skills", detectPaths: [".gemini"] },
  trae: { label: "Trae", skillsPath: ".trae/skills", detectPaths: [".trae"] },
  opencode: { label: "OpenCode", skillsPath: ".opencode/skills", detectPaths: [".opencode"] },
  continue: { label: "Continue", skillsPath: ".continue/skills", detectPaths: [".continue"] },
  codebuddy: { label: "CodeBuddy", skillsPath: ".codebuddy/skills", detectPaths: [".codebuddy"] },
  droid: { label: "Droid (Factory)", skillsPath: ".factory/skills", detectPaths: [".factory"] },
  kilocode: { label: "KiloCode", skillsPath: ".kilocode/skills", detectPaths: [".kilocode"] },
  warp: { label: "Warp", skillsPath: ".warp/skills", detectPaths: [".warp"] },
  augment: { label: "Augment", skillsPath: ".augment/skills", detectPaths: [".augment"] },
};
