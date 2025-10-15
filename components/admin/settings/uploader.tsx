"use client";

import React from "react";
import Image from "next/image";
import { useDropzone, FileRejection } from "react-dropzone";
import Button from "@/components/ui/custom-btn";
import Text from "@/components/ui/text";
import { LuFileCheck2, LuX, LuFileText } from "react-icons/lu";
import { IoImageOutline } from "react-icons/io5";

export type FileUploaderProps = {
  onClick?: () => void;
  onFiles?: (files: File[]) => void;
  acceptedFormats?: string;
  accept?: string; // e.g. "image/*,application/pdf,.docx"
  multiple?: boolean;
  maxSizeMB?: number;
  enableDragDrop?: boolean;
  maxFiles?: number;
};

type PreviewItem = {
  file: File;
  url?: string;
  kind: "image" | "other";
};

const toAcceptMap = (accept?: string) => {
  if (!accept) return undefined;
  const map: Record<string, string[]> = {};
  accept
    .split(",")
    .map((s) => s.trim())
    .forEach((t) => {
      if (t) map[t] = [];
    });
  return Object.keys(map).length ? map : undefined;
};

const Chip = ({ p, onRemove }: { p: PreviewItem; onRemove: () => void }) => {
  const isImg = p.kind === "image";
  return (
    <div
      className="group relative inline-flex items-center gap-2 rounded-full border bg-white/95 pl-1.5 pr-2 py-1 shadow-sm
                 ring-1 ring-black/5"
    >
      {/* tiny thumbnail / icon */}
      <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full bg-gray-100 border">
        {isImg && p.url ? (
          <Image
            src={p.url}
            alt={p.file.name}
            fill
            sizes="24px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <LuFileText className="text-gray-500" size={14} />
          </div>
        )}
      </div>

      {/* filename */}
      <span className="max-w-[140px] truncate text-xs text-gray-700">
        {p.file.name}
      </span>

      {/* remove btn */}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${p.file.name}`}
        className="rounded-full p-1 hover:bg-gray-100 transition-colors"
        title="Remove"
      >
        <LuX className="text-gray-700" size={14} />
      </button>
    </div>
  );
};

export const FileUploader: React.FC<FileUploaderProps> = ({
  onClick,
  onFiles,
  acceptedFormats = "Accepted formats: PNG, JPG, PDF, DOCX",
  accept = "image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  multiple = true,
  maxSizeMB = 10,
  enableDragDrop = true,
  maxFiles = 10,
}) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [dragActive, setDragActive] = React.useState(false);

  const maxSize = maxSizeMB * 1024 * 1024;
  const acceptMap = toAcceptMap(accept);

  const onDrop = React.useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      const msgs: string[] = [];
      rejected.forEach((rej) =>
        rej.errors.forEach((e) => msgs.push(`${rej.file.name}: ${e.message}`))
      );
      setErrors(msgs);

      const remaining = Math.max(0, maxFiles - files.length);
      const nextAccepted = accepted.slice(0, remaining);
      const next = multiple
        ? [...files, ...nextAccepted]
        : nextAccepted.slice(0, 1);
      setFiles(next);
      onFiles?.(next);
    },
    [files, maxFiles, multiple, onFiles]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: acceptMap,
    multiple,
    maxFiles,
    maxSize,
    noClick: true, // we handle via Browse button
    noKeyboard: true,
    noDrag: !enableDragDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false),
  });

  // Build lightweight preview model (blob URLs for images)
  const previews = React.useMemo<PreviewItem[]>(
    () =>
      files.map((file) => ({
        file,
        kind: file.type.startsWith("image/") ? "image" : "other",
        url: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      })),
    [files]
  );

  // Cleanup blob URLs when files change/unmount
  React.useEffect(() => {
    return () => {
      previews.forEach((p) => p.url && URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeAt = (idx: number) => {
    const next = files.slice();
    const removed = next.splice(idx, 1);
    const p = previews[idx];
    if (p?.url) URL.revokeObjectURL(p.url);
    setFiles(next);
    onFiles?.(next);
  };

  const clearAll = () => {
    previews.forEach((p) => p.url && URL.revokeObjectURL(p.url));
    setFiles([]);
    onFiles?.([]);
  };

  const triggerBrowse = () => {
    onClick?.();
    open();
  };

  return (
    <div className="relative">
      {/* Chip rail pinned along the TOP border */}
      {previews.length > 0 && (
        <div
          className="
            absolute -top-3 left-3 right-3 z-10
            flex items-center gap-2 overflow-x-auto scrollbar-hide
            px-1 py-0.5
          "
          // optional soft mask so chips fade near edges:
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
            maskImage:
              "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
          }}
        >
          {previews.map((p, i) => (
            <Chip key={p.file.name + i} p={p} onRemove={() => removeAt(i)} />
          ))}

          {/* quick clear chip */}
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 rounded-full border bg-white/95 px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-50 shadow-sm"
            title="Clear all"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Uploader surface (drop target) */}
      <div className="space-y-2 pt-3">
        <div
          {...getRootProps()}
          className={`flex items-center justify-between rounded-lg px-4 py-4 transition-colors duration-200
            ${
              enableDragDrop
                ? `border-2 border-dashed ${
                    dragActive
                      ? "border-primary-500 bg-primary-50/60"
                      : "border-gray-300 hover:border-gray-400"
                  }`
                : "border border-gray-300"
            }`}
          aria-label="Upload files by dragging here or using the browse button"
        >
          <input {...getInputProps()} />

          <div className="flex items-center gap-2">
            <IoImageOutline className="text-primary-600" size={28} />

            <div className="flex flex-col justify-center gap-1">
              <Text.Paragraph className="text-sm text-gray-600">
                {acceptedFormats}
              </Text.Paragraph>
              <Text.SmallText className="text-xs text-gray-400">
                (Max file size: {maxSizeMB}MB
                {maxFiles ? ` • Max ${maxFiles} files` : ""})
              </Text.SmallText>
              {enableDragDrop && (
                <Text.SmallText className="text-[11px] text-gray-400">
                  Drag & drop or click Browse
                </Text.SmallText>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {files.length > 0 && (
              <Button
                variant="secondary_2"
                onClick={(e) => {
                  e.stopPropagation();
                  clearAll();
                }}
                className="flex items-center gap-1 text-red-600"
                title="Clear all"
              >
                <LuX size={16} />
                Clear
              </Button>
            )}
            <Button
              variant="secondary_2"
              onClick={(e) => {
                e.stopPropagation();
                triggerBrowse();
              }}
            >
              Browse
            </Button>
          </div>
        </div>

        {/* Errors under the surface */}
        {errors.length > 0 && (
          <ul className="list-disc pl-5 text-sm text-red-600">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
