export interface SidebarItem {
  label: string;
  route?: string;
  icon?: string;
  children?: SidebarItem[]; // for sub-menus
  separator?: boolean; // adds spacing before this item
  action?: () => void; // optional action on click
}
