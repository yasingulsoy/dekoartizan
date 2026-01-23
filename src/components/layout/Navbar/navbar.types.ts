import React from "react";

export type MenuItem = {
  id: number;
  type: "MenuItem" | "MenuList";
  label: string;
  url?: string;
  children:
    | (Omit<MenuItem, "children" | "type"> & {
        description?: string | React.ReactNode;
      })[]
    | [];
};

export type SubCategoryItem = {
  id: number;
  name: string;
  slug: string;
};

export type MenuListData = (Omit<MenuItem, "children" | "type"> & {
  description?: string | React.ReactNode;
  image_url?: string | null;
  subCategories?: SubCategoryItem[];
})[];

export type NavMenu = MenuItem[];
