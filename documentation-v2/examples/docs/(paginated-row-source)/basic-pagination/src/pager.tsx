import React, { useEffect, useState } from "react";
import "@1771technologies/lytenyte-pro/components.css";
import { useMemo } from "react";

const formatter = Intl.NumberFormat("en-Us", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export function Pager({
  page,
  pageSize,
  count,
  onPageChange,
}: {
  pageSize: number;
  page: number;
  count: number;
  onPageChange: (page: number) => void;
}) {
  const pageCount = useMemo(() => {
    return Math.ceil(count / pageSize);
  }, [count, pageSize]);

  return (
    <div className="flex w-full items-center justify-between">
      <div className="ms-3 text-xs tabular-nums md:text-sm">
        Rows{" "}
        <span className="font-bold">
          {formatter.format((page - 1) * pageSize + 1)}-{formatter.format(page * pageSize)}
        </span>{" "}
        of <span className="font-bold">{formatter.format(count)}</span>
      </div>

      <div className="flex items-center gap-1">
        <button data-ln-button="secondary" data-ln-size="md" onClick={() => onPageChange(1)}>
          <span className="sr-only">To first page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentcolor"
            viewBox="0 0 256 256"
          >
            <path d="M200,48V208a8,8,0,0,1-13.66,5.66l-80-80a8,8,0,0,1,0-11.32l80-80A8,8,0,0,1,200,48ZM72,40a8,8,0,0,0-8,8V208a8,8,0,0,0,16,0V48A8,8,0,0,0,72,40Z"></path>
          </svg>
        </button>
        <button
          data-ln-button="secondary"
          data-ln-size="md"
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          <span className="sr-only">Previous Page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentcolor"
            viewBox="0 0 256 256"
          >
            <path d="M168,48V208a8,8,0,0,1-13.66,5.66l-80-80a8,8,0,0,1,0-11.32l80-80A8,8,0,0,1,168,48Z"></path>
          </svg>
        </button>
        <div className="hidden items-center gap-1 px-2 tabular-nums md:flex">
          Page <IntegerNumberInput page={page} onPageChange={onPageChange} pageCount={pageCount} />
          of <span className="font-bold">{pageCount}</span>
        </div>

        <button
          data-ln-button="secondary"
          data-ln-size="md"
          onClick={() => onPageChange(Math.min(page + 1, pageCount))}
        >
          <span className="sr-only">Next page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentcolor"
            viewBox="0 0 256 256"
          >
            <path d="M181.66,133.66l-80,80A8,8,0,0,1,88,208V48a8,8,0,0,1,13.66-5.66l80,80A8,8,0,0,1,181.66,133.66Z"></path>
          </svg>
        </button>
        <button data-ln-button="secondary" data-ln-size="md" onClick={() => onPageChange(pageCount)}>
          <span className="sr-only">To last page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentcolor"
            viewBox="0 0 256 256"
          >
            <path d="M149.66,122.34a8,8,0,0,1,0,11.32l-80,80A8,8,0,0,1,56,208V48a8,8,0,0,1,13.66-5.66ZM184,40a8,8,0,0,0-8,8V208a8,8,0,0,0,16,0V48A8,8,0,0,0,184,40Z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

interface IntegerNumberInputProps {
  page: number;
  onPageChange: (value: number) => void;
  pageCount: number;
}

function IntegerNumberInput({ page, onPageChange, pageCount }: IntegerNumberInputProps) {
  const [inputValue, setInputValue] = useState<string>(String(page));

  // Keep internal state in sync if page prop changes externally
  useEffect(() => {
    setInputValue(String(page));
  }, [page]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setInputValue("");
      return;
    }

    if (/^\d+$/.test(value)) {
      const v = Math.max(Math.min(parseInt(value, 10), pageCount), 1);
      setInputValue(String(v));
      onPageChange(v);
    }
  };

  const handleBlur = () => {
    if (inputValue === "") {
      setInputValue(String(page));
      onPageChange(page);
    }
  };

  return (
    <input
      type="text"
      style={{ width: Math.max(`${inputValue}`.length, 3) * 12 + 18 }}
      className="text-center"
      data-ln-input
      inputMode="numeric"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}
