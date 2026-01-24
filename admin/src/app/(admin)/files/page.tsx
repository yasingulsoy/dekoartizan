"use client";
import React from "react";
import FileManager from "@/components/files/FileManager";

export default function FilesPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <h1 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Dosya Yöneticisi
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Uploads klasöründeki dosya ve klasörleri yönetin
        </p>
      </div>
      <FileManager />
    </div>
  );
}
