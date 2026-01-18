import "../../../css/components.css";

import { useState } from "react";
import { SmartSelectRoot } from "./root.js";
import { Option } from "./option.js";
import { SmartSelectContainer } from "./container.js";
import { MultiComboTrigger } from "./triggers/multi-combo-trigger.js";
import { Chip } from "./chip.js";

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
  const [value, setValue] = useState([options[0]]);
  void setValue;

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
      <SmartSelectRoot
        options={() =>
          new Promise<typeof options>((res) => {
            setTimeout(() => {
              res(options);
            }, 0);
          })
        }
        value={value}
        onOptionChange={(v) => {
          if (!v) return;
          setValue(v);
        }}
        closeOnSelect={false}
        kind="multi-combo"
        container={(p) => {
          return (
            <SmartSelectContainer>
              {p.loading && <div>Loading....</div>}
              {p.children}
            </SmartSelectContainer>
          );
        }}
        trigger={
          <MultiComboTrigger>
            {value.map((x) => {
              return (
                <Chip
                  key={x.id}
                  option={x}
                  render={(p) => (
                    <div>
                      {x.label}

                      {p.active && "A"}

                      <button
                        onClick={() => {
                          p.remove();
                        }}
                      >
                        x
                      </button>
                    </div>
                  )}
                />
              );
            })}
          </MultiComboTrigger>
        }
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
