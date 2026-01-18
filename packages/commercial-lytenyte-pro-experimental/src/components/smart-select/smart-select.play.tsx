import "../../../css/components.css";

import { useState } from "react";
import { SmartSelectRoot } from "./root.js";
import { Option } from "./option.js";
import { SmartSelectContainer } from "./container.js";
import { MultiComboTrigger } from "./triggers/multi-combo-trigger.js";

const options = [
  { id: "x", label: "One" },
  { id: "y", label: "Two" },
  { id: "z", label: "Three" },
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
            }, 2000);
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
              return <div>{x.label}</div>;
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
