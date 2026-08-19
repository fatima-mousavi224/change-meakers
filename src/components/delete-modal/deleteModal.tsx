"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Trash2 } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  isDeleting?: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onDelete,
  title = "Delete this section?",
  description = "Are you sure you want to delete this section? This action cannot be undone.",
  itemName,
  isDeleting = false,
}: DeleteModalProps) {
  return (
    <Dialog open={isOpen} onClose={isDeleting ? () => {} : onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-900/50 backdrop-blur-[2px] transition-opacity" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-50">
              <ExclamationTriangleIcon className="size-6 text-red-600" aria-hidden />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-plusJakartaSans text-lg font-semibold text-gray-900">
                {title}
              </h2>
              <p className="mt-2 font-plusJakartaSans text-sm leading-relaxed text-gray-600">
                {description}
              </p>

              {itemName ? (
                <p className="mt-3 rounded-xl border border-red-100 bg-red-50/60 px-3 py-2 font-plusJakartaSans text-sm font-medium text-gray-900">
                  {itemName}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="rounded-xl border border-gray-300 px-4 py-2.5 font-plusJakartaSans text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={isDeleting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 font-plusJakartaSans text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="size-4" aria-hidden />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
