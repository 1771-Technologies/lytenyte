/* eslint-disable react-refresh/only-export-components */
import type { ComponentProps } from "react";
import { Menu as Me } from "../components-headless/menu/index.js";
import { tw } from "./tw.js";

const menuItemClassName =
  "px-2 rounded-lg cursor-pointer text-gray-800 active:bg-gray-300/70 focus:outline-none text-nowrap";

const MenuItem = (props: ComponentProps<typeof Me.Item>) => {
  return <Me.Item {...props} className={tw(menuItemClassName, props.className)} />;
};

const Root = (props: ComponentProps<typeof Me.Root>) => {
  return (
    <Me.Root
      {...props}
      className={tw(
        "px-1 py-1 bg-gray-100 w-fit border border-gray-300/70 rounded-lg flex flex-col gap-1",
        props.className
      )}
    />
  );
};
const SubItem = (props: ComponentProps<typeof Me.SubItem>) => {
  return (
    <Me.SubItem
      {...props}
      className={tw(
        menuItemClassName,

        props.className
      )}
    />
  );
};

export const Menu = {
  Item: MenuItem,
  Root: Root,
  SubItem: SubItem,
};
