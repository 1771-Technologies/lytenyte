import "../../../css/components.css";

import { useState } from "react";
import { SmartSelectRoot } from "./root.js";
import { Option } from "./option.js";
import { SmartSelectContainer } from "./container.js";
import { BasicSelectTrigger } from "./triggers/basic-trigger.js";

const options = [
  { id: "js", label: "JavaScript" },
  { id: "ts", label: "TypeScript" },
  { id: "py", label: "Python" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "cs", label: "C#" },
  { id: "php", label: "PHP" },
  { id: "ruby", label: "Ruby" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },
  { id: "swift", label: "Swift" },
];

export default function SmartSelect() {
  const [value, setValue] = useState(options[0]);
  void setValue;

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
      <SmartSelectRoot
        options={options}
        value={value}
        onOptionChange={(v) => {
          if (!v) return;
          setValue(v);
        }}
        closeOnSelect={false}
        kind="basic"
        container={(p) => {
          return (
            <SmartSelectContainer>
              {p.loading && <div>Loading....</div>}
              {p.children}
            </SmartSelectContainer>
          );
        }}
        trigger={<BasicSelectTrigger>{value.label}</BasicSelectTrigger>}
      >
        {(p) => {
          return (
            <Option {...p}>
              <div>{p.option.label}</div>
              <div>{p.selected && "✔️"}</div>
            </Option>
          );
        }}
      </SmartSelectRoot>
    </div>
  );
}
