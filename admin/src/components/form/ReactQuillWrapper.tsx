"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// react-quill-new kullan (React 19 uyumlu)
// react-quill yerine react-quill-new kullanıyoruz çünkü React 19'da findDOMNode kaldırıldı
const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
});

import "react-quill-new/dist/quill.snow.css";

interface ReactQuillWrapperProps {
  value: string;
  onChange: (value: string) => void;
  modules?: any;
  formats?: string[];
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ReactQuillWrapper: React.FC<ReactQuillWrapperProps> = ({
  value,
  onChange,
  modules,
  formats,
  placeholder,
  className,
  style,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Client-side'da mount olduktan sonra ReactQuill'i render et
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg ${className || ""}`}
        style={{ minHeight: "400px", ...style }}
      >
        <div className="h-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white dark:bg-gray-800"
      />
    </div>
  );
};

export default ReactQuillWrapper;
