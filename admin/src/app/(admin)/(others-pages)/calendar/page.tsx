import Calendar from "../../../../components/calendar/Calendar";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Takvim - dekoartizan Admin",
  description: "dekoartizan Admin Paneli Takvim",
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Takvim" />
      <Calendar />
    </div>
  );
}
