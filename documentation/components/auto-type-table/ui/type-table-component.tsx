"use client";

import { ChevronDown } from "lucide-react";
import Link from "fumadocs-core/link";
import { cva } from "class-variance-authority";
import { type ReactNode, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/components/cn";

export interface ParameterNode {
  name: string;
  description: ReactNode;
}

export interface TypeNode {
  /**
   * Additional description of the field
   */
  description?: ReactNode;

  /**
   * type signature (short)
   */
  type: ReactNode;

  /**
   * type signature (full)
   */
  typeDescription?: ReactNode;

  /**
   * Optional `href` for the type
   */
  typeDescriptionLink?: string;

  default?: ReactNode;

  required?: boolean;
  deprecated?: boolean;

  parameters?: ParameterNode[];

  returns?: ReactNode;
}

const keyVariants = cva("text-fd-primary", {
  variants: {
    deprecated: {
      true: "line-through text-fd-primary/50",
    },
  },
});

export function TypeTable({ type }: { type: Record<string, TypeNode> }) {
  return (
    <div className="@container bg-fd-card text-fd-card-foreground p-t my-6 flex flex-col overflow-hidden rounded-2xl border-x border-t p-1 text-sm">
      <div className="not-prose text-fd-muted-foreground flex items-center px-3 py-1 font-medium">
        <p className="w-[25%]">Prop</p>
      </div>
      {Object.entries(type)
        .sort((l, r) => {
          if (l[1].required && r[1].required) return l[0].localeCompare(r[0]);
          if (l[1].required) return -1;
          if (r[1].required) return 1;
          return l[0].localeCompare(r[0]);
        })
        .map(([key, value]) => (
          <Item key={key} name={key} item={value} />
        ))}
    </div>
  );
}

function Item({
  name,
  item: { description, required = false, deprecated, type, typeDescriptionLink },
}: {
  name: string;
  item: TypeNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={cn("overflow-hidden border-b transition-all", open && "not-last:mb-2")}
    >
      <div className="py-1">
        <CollapsibleTrigger className="not-prose hover:bg-fd-accent group relative flex w-full flex-row items-center gap-2 rounded-xl px-3 py-2 text-start">
          <div className="flex flex-1 items-center gap-2">
            <code
              className={cn(
                keyVariants({
                  deprecated,
                  className: "min-w-fit flex-1 font-medium",
                }),
              )}
            >
              {name}
              {!required && (
                <span className="bg-primary-300/20 text-primary-700 border-primary-500/60 ml-1 rounded border px-1 py-1 text-[10px]">
                  optional
                </span>
              )}
            </code>
            {typeDescriptionLink ? (
              <Link href={typeDescriptionLink} className="@max-xl:hidden underline">
                {type}
              </Link>
            ) : (
              <div className="@max-xl:hidden">{type}</div>
            )}
          </div>
          <ChevronDown className="text-fd-muted-foreground end-2 size-4 transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="fd-scroll-container bg-fd-background grid grid-cols-[1fr_3fr] gap-y-4 overflow-auto border-b border-t p-3 text-sm">
          <div className="prose prose-no-margin col-span-full text-sm empty:hidden">
            {description}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
