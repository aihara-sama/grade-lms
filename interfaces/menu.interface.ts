import type { FunctionComponent, ReactNode } from "react";

export interface INavItem {
  title: string;
  href: string;
  Icon: FunctionComponent;
}
export interface ISelectItem {
  title: string;
  id: string;
}
export interface ITabItem {
  title: string;
  href: string;
  Icon: ReactNode;
}
