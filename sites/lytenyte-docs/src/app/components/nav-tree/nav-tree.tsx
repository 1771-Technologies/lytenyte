"use client";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { IconButton } from "../ui/icon-button";
import { tw } from "../utils";
import { Fragment, useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { NavTreeLink } from "./nav-link";
import { DocNode, SectionNode } from "../lib/routing/get-doc-tree";

export function NavTree(props: { sections: SectionNode[]; path: string }) {
  return (
    <div className="flex w-full select-none flex-col gap-2 p-3 text-sm leading-5 tracking-tight">
      {props.sections.map((c) => {
        if (!c.name) {
          return (
            <Fragment key={c.name}>
              {c.children.map((v, i) => (
                <RenderSection node={v} key={i} path={props.path} />
              ))}
              <Separator orientation="horizontal" className="bg-gray-200" />
            </Fragment>
          );
        }
        return (
          <Fragment key={c.name}>
            <RenderSection node={c} path={props.path} />
            <Separator orientation="horizontal" className="bg-gray-200" />
          </Fragment>
        );
      })}
    </div>
  );
}

function RenderSection({ node, path }: { node: SectionNode | DocNode; path: string }) {
  const link = node.doc?.url;

  const [expanded, setValue] = useState(true);

  const toggle = () => setValue((prev) => !prev);

  if (node.type === "doc") {
    return (
      <NavTreeLink isLeaf href={link!} path={path}>
        {node.doc.navKey ?? node.doc.title}
      </NavTreeLink>
    );
  }

  return (
    <div className={tw("pl-3")}>
      <div className="m -ml-5 flex items-center gap-1">
        {link != null && (
          <>
            <IconButton className="size-6" onClick={toggle}>
              {!expanded && <ChevronRightIcon className="size-4" />}
              {expanded && <ChevronDownIcon className="size-4" />}
              <span className="sr-only">Expanded section {node.name}</span>
            </IconButton>
            <NavTreeLink href={link} className="hover:text-primary-600" path={path}>
              {node.name}
            </NavTreeLink>
          </>
        )}
        {link == null && (
          <>
            <IconButton className="size-6" onClick={toggle}>
              {!expanded && <ChevronRightIcon className="size-4" />}
              {expanded && <ChevronDownIcon className="size-4" />}
              <span className="sr-only">Expanded section {node.name}</span>
            </IconButton>

            <Button onClick={toggle} className="hover:text-primary-600" tabIndex={-1}>
              <span>{node.name}</span>
            </Button>
          </>
        )}
      </div>

      <div
        className={tw(
          "grid overflow-hidden transition-[grid-template-rows]",
          !expanded && "grid-rows-[0fr]",
          expanded && "grid-rows-[1fr]",
        )}
      >
        <nav className="min-h-0">
          <ul className="ml-3 mt-2 flex flex-col gap-2 border-l border-gray-200 pl-3">
            {node.children.map((c, i) => {
              return (
                <li key={i}>
                  <RenderSection node={c} path={path} />
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
