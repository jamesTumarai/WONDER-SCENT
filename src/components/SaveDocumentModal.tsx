import React from 'react';
import { X, Save, Copy } from 'lucide-react';

interface SaveDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAsNew: () => void;
  onOverwrite: () => void;
}

export default function SaveDocumentModal({ isOpen, onClose, onSaveAsNew, onOverwrite }: SaveDocumentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#1c191766] backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            <Save size={20} className="text-leaf-600" />
            ตัวเลือกการบันทึก
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500"
          >
            <X size={18} />
          </button>
        </div>
        
        <p className="text-stone-600 text-sm mb-6">
          เอกสารนี้เคยถูกบันทึกไว้แล้ว คุณต้องการบันทึกทับเอกสารเดิม หรือบันทึกแยกเป็นเอกสารใหม่?
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onOverwrite();
            }}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 text-leaf-700 bg-leaf-50 hover:bg-leaf-100 border border-leaf-200 font-medium rounded-xl transition-colors shadow-sm"
          >
            <Save size={18} />
            บันทึกแทนที่อันเดิม
          </button>
          
          <button
            onClick={() => {
              onSaveAsNew();
            }}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 text-white bg-leaf-600 hover:bg-leaf-700 font-medium rounded-xl transition-colors shadow-sm"
          >
            <Copy size={18} />
            บันทึกเป็นอันใหม่
          </button>
        </div>
      </div>
    </div>
  );
}
