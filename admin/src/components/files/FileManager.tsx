"use client";

import React, { useState, useEffect } from "react";
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import {
  FolderIcon,
  FileIcon,
  TrashBinIcon,
  PlusIcon,
  ChevronLeftIcon,
  ArrowRightIcon,
} from "@/icons";

interface FileItem {
  name: string;
  type: "file" | "directory";
  size: number | null;
  modified: string;
  path: string;
}

interface FileListResponse {
  success: boolean;
  data: {
    items: FileItem[];
    currentPath: string;
    basePath: string;
  };
}

const FileManager: React.FC = () => {
  const [items, setItems] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showNewFolderModal, setShowNewFolderModal] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadFiles = async (path: string = "") => {
    try {
      setLoading(true);
      setError("");
      const response = await apiGet<FileListResponse>(
        `/api/files/list?folder=${encodeURIComponent(path)}`
      );
      if (response.success) {
        setItems(response.data.items);
        setCurrentPath(response.data.currentPath);
      }
    } catch (err: any) {
      setError(err.message || "Dosyalar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleFolderClick = (item: FileItem) => {
    if (item.type === "directory") {
      const newPath = currentPath === "/" ? item.name : `${currentPath}/${item.name}`;
      loadFiles(newPath);
      setSelectedItems(new Set());
    }
  };

  const handleBack = () => {
    if (currentPath === "/") return;
    const pathParts = currentPath.split("/").filter(Boolean);
    pathParts.pop();
    const newPath = pathParts.length > 0 ? pathParts.join("/") : "";
    loadFiles(newPath);
    setSelectedItems(new Set());
  };

  const handleDelete = async (item: FileItem) => {
    if (!confirm(`${item.name} ${item.type === "directory" ? "klasörünü" : "dosyasını"} silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      setDeleting(item.path);
      await apiDelete(`/api/files/delete`, { path: item.path });
      await loadFiles(currentPath);
      setSelectedItems(new Set());
    } catch (err: any) {
      alert(err.message || "Silme işlemi başarısız");
    } finally {
      setDeleting(null);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      alert("Klasör adı gerekli");
      return;
    }

    try {
      await apiPost(`/api/files/mkdir`, {
        path: currentPath === "/" ? "" : currentPath,
        name: newFolderName.trim(),
      });
      setShowNewFolderModal(false);
      setNewFolderName("");
      await loadFiles(currentPath);
    } catch (err: any) {
      alert(err.message || "Klasör oluşturulamadı");
    }
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return "-";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileIcon = (item: FileItem) => {
    if (item.type === "directory") {
      return <FolderIcon className="h-6 w-6 text-yellow-500" />;
    }
    return <FileIcon className="h-6 w-6 text-gray-500" />;
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {currentPath !== "/" && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Geri
            </button>
          )}
          <button
            onClick={() => loadFiles(currentPath)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Yenile
          </button>
        </div>
        <button
          onClick={() => setShowNewFolderModal(true)}
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          <PlusIcon className="h-4 w-4" />
          Yeni Klasör
        </button>
      </div>

      {/* Path Display */}
      <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Yol:</span> /uploads{currentPath}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></div>
        </div>
      )}

      {/* File List */}
      {!loading && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Ad
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Tür
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Boyut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Değiştirilme
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    Klasör boş
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.path}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3">
                      <div
                        className="flex items-center gap-3"
                        onClick={() => handleFolderClick(item)}
                        style={{ cursor: item.type === "directory" ? "pointer" : "default" }}
                      >
                        {getFileIcon(item)}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {item.type === "directory" ? "Klasör" : "Dosya"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {formatFileSize(item.size)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(item.modified)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(item)}
                        disabled={deleting === item.path}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        title="Sil"
                      >
                        <TrashBinIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Yeni Klasör Oluştur
            </h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Klasör adı"
              className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleCreateFolder();
                }
              }}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowNewFolderModal(false);
                  setNewFolderName("");
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                İptal
              </button>
              <button
                onClick={handleCreateFolder}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;
