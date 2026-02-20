//#start
import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import { SmartSelect } from "@1771technologies/lytenyte-pro/components";
import { useState } from "react";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
//#end

export default function ComponentDemo() {
  const [values, setValues] = useState([options[0]]);

  return (
    <div style={{ height: "400px" }} className="ln-grid flex justify-center pt-8">
      <div>
        <SmartSelect
          kind="multi-combo"
          onOptionChange={setValues}
          value={values}
          container={({ options, children }) => {
            return (
              <SmartSelect.Container className="max-h-80 overflow-auto">
                {options.length > 0 && children}
                {options.length === 0 && <div className="px-2 py-2">No options match query</div>}
              </SmartSelect.Container>
            );
          }}
          options={(query) => {
            if (!query) return options;

            return options.filter((x) => x.label.toLowerCase().includes(query?.toLowerCase()));
          }}
          trigger={
            <SmartSelect.MultiComboTrigger
              data-ln-input
              className="flex h-fit max-w-full flex-wrap items-center gap-2 rounded-lg px-2 py-2"
              renderInput={
                <input
                  placeholder="Search..."
                  type="text"
                  autoComplete="off"
                  className="h-full w-32 py-1.5 focus:outline-none"
                />
              }
            >
              {values.map((x) => {
                return (
                  <SmartSelect.Chip
                    key={x.id}
                    option={x}
                    className="bg-ln-column-fill border-ln-column-stroke flex items-center gap-1 text-nowrap rounded-lg border px-1 py-0.5 ps-2 text-xs"
                  >
                    <span className="relative top-px">{x.label}</span>
                    <SmartSelect.ChipRemove data-ln-button="secondary" data-ln-icon data-ln-size="xs">
                      <Cross1Icon />
                    </SmartSelect.ChipRemove>
                  </SmartSelect.Chip>
                );
              })}
            </SmartSelect.MultiComboTrigger>
          }
        >
          {(p) => {
            return (
              <SmartSelect.Option key={p.option.id} {...p} className="flex items-center justify-between">
                {p.option.label}
                {p.selected && <CheckIcon className="text-ln-primary-50" />}
              </SmartSelect.Option>
            );
          }}
        </SmartSelect>
      </div>
    </div>
  );
}

//#start
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
  { id: "c", label: "C" },
  { id: "kotlin", label: "Kotlin" },
  { id: "scala", label: "Scala" },
  { id: "dart", label: "Dart" },
  { id: "r", label: "R" },
  { id: "sql", label: "SQL" },
  { id: "perl", label: "Perl" },
  { id: "lua", label: "Lua" },
  { id: "haskell", label: "Haskell" },
  { id: "elixir", label: "Elixir" },
  { id: "clojure", label: "Clojure" },
  { id: "erlang", label: "Erlang" },
  { id: "fsharp", label: "F#" },
  { id: "ocaml", label: "OCaml" },
  { id: "zig", label: "Zig" },
  { id: "nim", label: "Nim" },
  { id: "julia", label: "Julia" },
  { id: "matlab", label: "MATLAB" },
  { id: "fortran", label: "Fortran" },
  { id: "cobol", label: "COBOL" },
  { id: "ada", label: "Ada" },
  { id: "lisp", label: "Lisp" },
  { id: "scheme", label: "Scheme" },
  { id: "prolog", label: "Prolog" },
  { id: "bash", label: "Bash" },
  { id: "powershell", label: "PowerShell" },
  { id: "solidity", label: "Solidity" },
  { id: "verilog", label: "Verilog" },
  { id: "vhdl", label: "VHDL" },
  { id: "assembly", label: "Assembly" },
  { id: "objectivec", label: "Objective-C" },
  { id: "groovy", label: "Groovy" },
  { id: "visualbasic", label: "Visual Basic" },
  { id: "delphi", label: "Delphi" },
  { id: "smalltalk", label: "Smalltalk" },
  { id: "racket", label: "Racket" },
  { id: "elm", label: "Elm" },
  { id: "purescript", label: "PureScript" },
  { id: "crystal", label: "Crystal" },
];
//#end
