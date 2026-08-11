"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CircleDashed, FileCheck, UploadCloud } from "lucide-react";
import axios from "axios";

type docsType = "aadhar" | "license" | "rc";

const DOCS_COPY: Record<docsType, { title: string; subtitle: string }> = {
  aadhar: {
    title: "Aadhar / ID Proof",
    subtitle: "Government issued ID",
  },
  license: {
    title: "Driving License",
    subtitle: "Valid driving license",
  },
  rc: {
    title: "Vehicle RC",
    subtitle: "Registration Certificate",
  },
};

const DOC_KEYS = Object.keys(DOCS_COPY) as docsType[];
const EMPTY_DOCS_STATE: Record<docsType, File | null> = {
  aadhar: null,
  license: null,
  rc: null,
};
const EMPTY_URLS_STATE: Record<docsType, string | null> = {
  aadhar: null,
  license: null,
  rc: null,
};

function page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [docs, setDocs] =
    useState<Record<docsType, File | null>>(EMPTY_DOCS_STATE);
  const [uploadedUrls, setUploadedUrls] =
    useState<Record<docsType, string | null>>(EMPTY_URLS_STATE);
  const [selectedPreviewUrls, setSelectedPreviewUrls] =
    useState<Record<docsType, string | null>>(EMPTY_URLS_STATE);
  const [selectedPreviewTypes, setSelectedPreviewTypes] = useState<
    Record<docsType, "image" | "pdf" | null>
  >(EMPTY_URLS_STATE as Record<docsType, "image" | "pdf" | null>);
  const [preview, setPreview] = useState<{
    url: string;
    title: string;
    type: "image" | "pdf";
  } | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const { data } = await axios.get("/api/partner/onboarding/documents");
        setUploadedUrls({
          aadhar: data?.aadharUrl ?? null,
          license: data?.licenseUrl ?? null,
          rc: data?.rcUrl ?? null,
        });
      } catch (fetchError: any) {
        if (fetchError?.response?.status !== 404) {
          console.log("documents fetch error", fetchError);
        }
      }
    };

    fetchDocs();
  }, []);

  const handleImage = (doc: docsType, file: File | null) => {
    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const previewType =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
        ? "pdf"
        : "image";

    setSelectedPreviewUrls((prev) => {
      const previousPreview = prev[doc];
      if (previousPreview) {
        URL.revokeObjectURL(previousPreview);
      }
      return { ...prev, [doc]: previewUrl };
    });

    setSelectedPreviewTypes((prev) => ({
      ...prev,
      [doc]: previewType,
    }));

    setDocs((prev) => ({ ...prev, [doc]: file }));
  };

  const canContinueFromSavedDocs = DOC_KEYS.every((docKey) =>
    Boolean(uploadedUrls[docKey]),
  );
  const hasSelectedFilesForUpload = DOC_KEYS.every((docKey) =>
    Boolean(docs[docKey]),
  );
  const isReadyForContinue =
    hasSelectedFilesForUpload || canContinueFromSavedDocs;

  const handleDocs = async () => {
    setLoading(true);
    setError("");

    const missingDocs = DOC_KEYS.filter(
      (docKey) => !docs[docKey] && !uploadedUrls[docKey],
    );
    if (missingDocs.length > 0) {
      setError("all documents are required");
      setLoading(false);
      return;
    }

    if (!hasSelectedFilesForUpload && canContinueFromSavedDocs) {
      setLoading(false);
      router.push("/partner/onboarding/bank");
      return;
    }

    try {
      const formData = new FormData();
      DOC_KEYS.forEach((docKey) => {
        const file = docs[docKey];
        if (file) {
          formData.append(docKey, file);
        }
      });

      const { data } = await axios.post(
        "/api/partner/onboarding/documents",
        formData,
      );

      const uploaded = data?.partnerDocs;
      setUploadedUrls({
        aadhar: uploaded?.aadharUrl ?? null,
        license: uploaded?.licenseUrl ?? null,
        rc: uploaded?.rcUrl ?? null,
      });

      setSelectedPreviewUrls((prev) => {
        Object.values(prev).forEach((previewUrl) => {
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }
        });
        return { ...EMPTY_URLS_STATE };
      });

      setSelectedPreviewTypes((prev) => ({
        ...prev,
        aadhar: null,
        license: null,
        rc: null,
      }));

      setLoading(false);
      router.push("/partner/onboarding/bank");
    } catch (error: any) {
      setError(error.response?.data?.message ?? "something went wrong");
      setLoading(false);
      console.log("1", error);
    }
  };

  const openPreview = (url: string, title: string, type?: "image" | "pdf") => {
    if (!url) {
      return;
    }

    const resolvedType = type
      ? type
      : url.toLowerCase().endsWith(".pdf")
        ? "pdf"
        : "image";

    setPreview({ url, title, type: resolvedType });
  };
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8"
      >
        <div className="relative text-center">
          <button
            onClick={() => router.back()}
            className="absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 tranition"
          >
            <ArrowLeft size={18} />
          </button>
          <p className="text-sx text-gray-500 font-medium">step 2 of 3</p>
          <h1 className="text2xl font-bold mt-1">Upload Documents</h1>
          <p className="text-sm text-gray-500 mt-2">Upload your Documents</p>
        </div>
        <div className="mt-8 space-y-5">
          {DOC_KEYS.map((docKey) => {
            const file = docs[docKey];
            const uploadedDocUrl = uploadedUrls[docKey];
            const pendingPreviewUrl = selectedPreviewUrls[docKey];
            const viewDocUrl = pendingPreviewUrl ?? uploadedDocUrl;
            const pendingPreviewType = selectedPreviewTypes[docKey];

            return (
              <div
                key={docKey}
                className="p-4 rounded-2xl border border-gray-200 transition"
              >
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between cursor-pointer hover:border-black transition"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {DOCS_COPY[docKey].title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {DOCS_COPY[docKey].subtitle}
                    </p>
                    {file && (
                      <p className="mt-2 text-[11px] font-medium text-emerald-700">
                        Selected: {file.name}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-400">Upload</span>
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                      <UploadCloud size={18} />
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    hidden
                    onChange={(e) =>
                      handleImage(docKey, e.target?.files?.[0] || null)
                    }
                  />
                </motion.label>

                {(viewDocUrl || uploadedDocUrl) && (
                  <div className="mt-1 flex items-center justify-between rounded-xl bg-slate-50 px-2 py-2">
                    <span className="text-[11px] font-semibold text-slate-600">
                      {pendingPreviewUrl ? "Selected" : "Uploaded"}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        openPreview(
                          viewDocUrl!,
                          DOCS_COPY[docKey].title,
                          pendingPreviewType ??
                            (uploadedDocUrl?.toLowerCase().endsWith(".pdf")
                              ? "pdf"
                              : "image"),
                        )
                      }
                      className="text-xs font-semibold text-black underline underline-offset-4"
                    >
                      View document
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex items-start gap-3 text-xs text-gray-500">
          <FileCheck size={16} className="mt-0.5" />
          <p>
            Documents are securely stored and manually verified by our team.
          </p>
        </div>
        {error && <p className="text-red-500">*{error}</p>}

        <motion.button
          disabled={!isReadyForContinue || loading}
          onClick={handleDocs}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition"
        >
          {loading ? (
            <CircleDashed className="text-white animate-spin" />
          ) : (
            "Continue"
          )}
        </motion.button>
      </motion.div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="w-full max-w-4xl rounded-3xl border border-white/20 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.20em] text-slate-500">
                  Document Preview
                </p>
                <h2 className="text-sm font-bold text-slate-900">
                  {preview.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto bg-slate-50 p-4">
              {preview.type === "pdf" ? (
                <iframe
                  src={preview.url}
                  title={preview.title}
                  className="min-h-[60vh] w-full rounded-2xl border border-slate-200 bg-white"
                />
              ) : (
                <img
                  src={preview.url}
                  alt={preview.title}
                  className="mx-auto max-h-[60vh] w-auto rounded-2xl object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
