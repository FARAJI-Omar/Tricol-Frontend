export interface SidebarItem {
  label: string;
  route?: string;
  icon?: string;
  children?: SidebarItem[]; // for sub-menus
  separator?: boolean; // adds spacing before this item
  action?: () => void; // optional action on click
  iconColor?: string; // custom icon color
  activeBgColor?: string; // custom background color when active
  activeTextColor?: string; // custom text color when active
}
