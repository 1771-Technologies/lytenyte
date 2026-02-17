//#start
import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import { SmartSelect } from "@1771technologies/lytenyte-pro";
import { useState } from "react";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
//#end

export default function ComponentDemo() {
  const [value, setValue] = useState(options[0]);

  return (
    <div style={{ height: "400px" }} className="ln-grid flex justify-center pt-8">
      <SmartSelect
        kind="basic"
        value={value}
        options={options}
        onOptionChange={(v) => {
          if (!v) return;
          setValue(v);
        }}
        container={
          <SmartSelect.Container className="max-h-75 overflow-auto" style={{ scrollbarWidth: "thin" }} />
        }
        trigger={
          <SmartSelect.BasicTrigger
            data-ln-button="website"
            data-ln-size="md"
            className="flex min-w-48 justify-between gap-2 ps-2.5"
          >
            {value.label}
            <div className="flex items-center justify-center">
              <ChevronDownIcon className="size-4" />
            </div>
          </SmartSelect.BasicTrigger>
        }
      >
        {(p) => {
          return (
            <SmartSelect.Option {...p} className="flex items-center justify-between">
              <div>{p.option.label}</div>
              {p.selected && <CheckIcon className="text-ln-primary-50" />}
            </SmartSelect.Option>
          );
        }}
      </SmartSelect>
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
