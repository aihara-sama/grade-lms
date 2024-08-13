import type { FunctionComponent } from "react";

export interface INavItem {
  title: string;
  href: string;
  Icon: FunctionComponent;
}
export interface ISelectItem {
  title: string;
  id: string;
}
