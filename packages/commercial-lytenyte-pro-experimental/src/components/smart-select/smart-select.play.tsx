import "../../../css/components.css";

import { useState } from "react";
import { SmartSelectRoot } from "./root.js";
import { Option } from "./option.js";
import { MultiTrigger } from "./triggers/multi-trigger.js";

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
        options={options}
        value={value}
        onOptionChange={setValue}
        closeOnSelect={false}
        kind="multi"
        trigger={
          <MultiTrigger data-ln-button="secondary" data-ln-size="md" style={{ display: "flex", gap: 8 }}>
            {value.map((x) => {
              return <div key={x.id}>{x.label}</div>;
            })}
          </MultiTrigger>
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
