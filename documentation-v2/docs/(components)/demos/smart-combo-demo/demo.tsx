//#start
import "@1771technologies/lytenyte-pro-experimental/components.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { SmartSelect } from "@1771technologies/lytenyte-pro-experimental";
import { useState } from "react";
import { CheckIcon } from "@radix-ui/react-icons";
//#end

export default function ComponentDemo() {
  const [value, setValue] = useState(options[0]);

  const [query, setQuery] = useState(value.label);

  return (
    <div style={{ height: "400px" }} className="ln-grid flex justify-center gap-2 pt-8">
      <div>
        <SmartSelect
          kind="combo"
          value={value}
          options={(query) => {
            if (!query) return options;
            return options.filter((x) => x.label.toLowerCase().includes(query.toLowerCase()));
          }}
          query={query}
          clearOnSelect={false}
          onQueryChange={setQuery}
          onOptionChange={(v) => {
            if (!v) return;
            setValue(v);
            setQuery(v.label);
          }}
          container={
            <SmartSelect.Container className="max-h-75 overflow-auto" style={{ scrollbarWidth: "thin" }} />
          }
          trigger={<SmartSelect.ComboTrigger data-ln-input />}
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
