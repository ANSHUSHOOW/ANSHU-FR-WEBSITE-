import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Upload, Check, AlertCircle, FileText } from 'lucide-react';
import { exportAllStudyData, importAllStudyData, ExportData } from '../utils/storage';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReload: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  onDataReload,
}) => {
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleDownload = () => {
    const data = exportAllStudyData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ACCA_FR_Study_Progress_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as ExportData;
        if (!parsed.chapters || !parsed.progress) {
          throw new Error('Invalid study backup file structure.');
        }
        importAllStudyData(parsed);
        setImportStatus('success');
        onDataReload();
        setTimeout(() => {
          onClose();
        }, 1200);
      } catch (err: unknown) {
        setImportStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white">Backup &amp; Restore</span>
              <span className="text-xs text-slate-400">ACCA FR Data</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {/* Export Section */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <h4 className="text-sm font-semibold text-white">Export Progress</h4>
              <p className="mt-1 text-xs text-slate-400">
                Download your chapters, today's tasks, and book/website ticks as a JSON file.
              </p>
              <button
                onClick={handleDownload}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-400"
              >
                <Download className="h-4 w-4" />
                <span>Download Study Backup (.json)</span>
              </button>
            </div>

            {/* Import Section */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <h4 className="text-sm font-semibold text-white">Restore Backup</h4>
              <p className="mt-1 text-xs text-slate-400">
                Upload a previous backup file to restore all your study progress.
              </p>
              <label className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-750">
                <Upload className="h-4 w-4" />
                <span>Select Backup JSON</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {importStatus === 'success' && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-500/10 p-2 text-xs text-emerald-400">
                  <Check className="h-4 w-4" />
                  <span>Study progress successfully restored!</span>
                </div>
              )}

              {importStatus === 'error' && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-rose-500/10 p-2 text-xs text-rose-400">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
