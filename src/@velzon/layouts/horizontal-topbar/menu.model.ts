export interface MenuItem {
    id?: number;
    label?: any;
    icon?: string;
    link?: string;
    subItems?: any;
    isTitle?: boolean;
    badge?: any;
    parentId?: number;
    isLayout?: boolean;
    /** KC roles required to display this item (any single match is enough). Omit to show always. */
    roles?: string[];
  }