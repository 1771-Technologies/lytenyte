import { useControlled, useEvent } from "@1771technologies/lytenyte-core-experimental/internal";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { SmartSelectProvider, type SmartSelectContext } from "./context.js";
import { Popover } from "../headless/popover/index.js";
import type { SlotComponent } from "../../hooks/use-slot/types.js";
import { useSlot } from "../../hooks/use-slot/use-slot.js";
import { SmartSelectContainer } from "./container.js";
import { Option } from "./option.js";
import type { BaseOption, ComboSelect, OptionRenderProps, SmartSelectKinds } from "./type.js";
import { useAsyncOptions, type ComboOptionState } from "./use-async-options.js";
import { getNearestMatching } from "@1771technologies/lytenyte-shared";

export type SmartSelectRootProps<T extends BaseOption> = {
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;

  readonly trigger: SlotComponent;
  readonly container?: SlotComponent<PropsWithChildren<ComboOptionState<T>>>;

  readonly closeOnSelect?: boolean;

  readonly children?: (params: OptionRenderProps<T>) => ReactNode;
} & SmartSelectKinds<T>;

export function SmartSelectRoot<T extends BaseOption>(p: SmartSelectRootProps<T>) {
  const [open, setOpen] = useControlled({ controlled: p.open, default: false });
  const [query, setQuery] = useControlled({ controlled: (p as any).query as string, default: "" });

  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);
  const [activeId, setActiveId] = useState<null | string>(null);
  const [containerEl, setContainerEl] = useState<HTMLElement | null>(null);

  const onOpenChange = useEvent((b: boolean) => {
    setOpen(b);
    p.onOpenChange?.(b);
  });

  const onQueryChange = useEvent((change: string) => {
    setQuery(change);
    (p as any).onQueryChange?.(change);
  });

  const normalizedValue = useMemo(() => {
    if (p.kind === "basic" || p.kind === "combo") return [p.value];
    return p.value;
  }, [p.kind, p.value]);

  const onOptionSelect = useEvent((change: BaseOption) => {
    if (p.kind === "basic" || p.kind === "combo") {
      const isSelected = p.value.id === change.id;
      if (isSelected) p.onOptionChange(null);
      else p.onOptionChange(change as T);
    } else {
      const isSelected = p.value.find((x) => x.id === change.id);
      const next = isSelected ? p.value.filter((x) => x.id !== change.id) : [...p.value, change as T];
      p.onOptionChange(next);
    }
  });

  const optValue = typeof p.options === "function" ? null : p.options;
  const basicSelectOptions = useMemo(() => {
    return optValue ?? [];
  }, [optValue]);

  const comboState = useAsyncOptions(
    typeof p.options === "function" ? p.options : null,
    (p as any).clearOnQuery ?? false,
  );

  const options = typeof p.options === "function" ? comboState.options : basicSelectOptions;

  const debounce =
    p.kind === "multi" || p.kind === "multi-combo"
      ? ((p as unknown as ComboSelect<T>).searchDebounceMs ?? 500)
      : 0;

  useEffect(() => {
    if (p.kind !== "multi-combo" && p.kind !== "multi") return;

    setTimeout(() => {
      comboState.loadOptions(query);
    }, debounce);
  }, [comboState, debounce, p.kind, query]);

  useEffect(() => {
    if (!open) return;

    comboState.loadOptions(query);

    setActiveId((prev) => {
      const active = prev ? (options.find((x) => x.id === prev) ?? null) : null;

      if (!active) queueMicrotask(() => setActiveId(options.at(0)?.id ?? null));
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comboState, open, options]);

  const renderedOptions = useMemo(() => {
    const render = p.children ?? DefaultChildren;

    return options.map((x) => {
      const selected = !!normalizedValue.find((v) => x.id === v.id);
      const active = x.id === activeId;
      return <Fragment key={x.id}>{render({ option: x, selected, active })}</Fragment>;
    });
  }, [activeId, normalizedValue, options, p.children]);

  const trigger = useSlot({ slot: p.trigger });

  const container = useSlot({
    props: [{ children: renderedOptions }],
    slot: p.container ?? <SmartSelectContainer />,
    state: {
      children: renderedOptions,
      ...comboState,
      options,
    },
  });

  const value = useMemo(() => {
    return {
      onOpenChange,
      open,
      closeOnSelect: p.closeOnSelect ?? true,
      onOptionSelect,
      kindAndValue: { kind: p.kind, value: p.value } as any,

      trigger: triggerEl,
      setTrigger: setTriggerEl,

      activeId: activeId,
      setActiveId: setActiveId,

      container: containerEl,
      setContainer: setContainerEl,

      query,
      onQueryChange,

      comboState,
    } satisfies SmartSelectContext;
  }, [
    activeId,
    comboState,
    containerEl,
    onOpenChange,
    onOptionSelect,
    onQueryChange,
    open,
    p.closeOnSelect,
    p.kind,
    p.value,
    query,
    triggerEl,
  ]);

  const lightDismiss = useCallback((el: HTMLElement) => {
    const closest = getNearestMatching(
      el,
      (el) => el.getAttribute("data-ln-smart-select-trigger") === "true",
    );
    if (!closest) return true;

    return false;
  }, []);

  return (
    <SmartSelectProvider value={value}>
      <Popover
        open={open}
        onOpenChange={onOpenChange}
        focusTrap={false}
        modal={false}
        anchor={triggerEl}
        lightDismiss={lightDismiss}
      >
        {trigger}
        {container}
      </Popover>
    </SmartSelectProvider>
  );
}

function DefaultChildren<T extends BaseOption>(p: OptionRenderProps<T>) {
  return <Option {...p} />;
}
