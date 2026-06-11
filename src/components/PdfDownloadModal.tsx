import React, { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';

interface PdfDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (filename: string) => void;
  defaultFilename: string;
}

export default function PdfDownloadModal({ isOpen, onClose, onConfirm, defaultFilename }: PdfDownloadModalProps) {
  const [filename, setFilename] = useState(defaultFilename);

  useEffect(() => {
    if (isOpen) {
      setFilename(defaultFilename);
    }
  }, [isOpen, defaultFilename]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(filename.trim() || defaultFilename);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#1c191766] backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            <FileText size={20} className="text-leaf-600" />
            ตั้งชื่อไฟล์ PDF
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full transition-all duration-200 active:scale-90 text-stone-500"
          >
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              ชื่อไฟล์ (ไม่ต้องใส่ .pdf)
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-3 border outline-none text-sm transition-all"
              placeholder={defaultFilename}
              autoFocus
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 text-stone-600 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 font-medium rounded-xl transition-all duration-200 active:scale-95"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 text-white bg-leaf-600 hover:bg-leaf-700 active:bg-leaf-800 font-medium rounded-xl transition-all duration-200 active:scale-95 shadow-sm"
            >
              ดาวน์โหลด
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
