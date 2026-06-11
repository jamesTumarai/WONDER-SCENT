import React, { useEffect, useState } from 'react';
import { getUserDocuments, SavedDocument, deleteUserDocument } from '../db';
import { FileText, Loader2, Trash2, X, AlertCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSelect: (doc: SavedDocument) => void;
}

export default function SavedDocumentsList({ onClose, onSelect }: Props) {
  const [docs, setDocs] = useState<SavedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserDocuments();
      setDocs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(window.confirm('ลบเอกสารนี้หรือไม่?')) {
      try {
        await deleteUserDocument(id);
        const newDocs = docs.filter(d => d.id !== id);
        setDocs(newDocs);
        if (newDocs.length === 0) {
          onClose();
        }
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการลบเอกสาร');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-stone-100">
        <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
          <FileText size={20} className="text-leaf-600" /> เอกสารใน Cloud
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full text-stone-400 hover:text-stone-600 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="text-sm">กำลังโหลดคลังเอกสาร...</p>
          </div>
        ) : error ? (
           <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-start gap-3 text-sm">
             <AlertCircle size={18} className="shrink-0 mt-0.5" />
             <div>เกิดข้อผิดพลาด <br/><span className="opacity-70 text-xs">{error}</span></div>
           </div>
        ) : docs.length === 0 ? (
          <div className="text-center p-12 text-stone-400">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-sm font-medium">ยังไม่มีเอกสารที่บันทึกไว้ในระบบ</p>
          </div>
        ) : (
          docs.map(doc => (
            <div 
              key={doc.id}
              onClick={() => onSelect(doc)}
              className="p-4 rounded-2xl border border-stone-200 hover:border-leaf-300 hover:shadow-md transition-all cursor-pointer group bg-white flex flex-col gap-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-leaf-600 bg-leaf-50 px-2 py-0.5 rounded-md">
                    {doc.type}
                  </span>
                  <h3 className="font-bold text-stone-800 mt-2">{doc.to.name || 'ไม่ได้ระบุผู้รับ'}</h3>
                  <p className="text-sm text-stone-500 font-medium">{doc.documentNumber || 'ไม่มีเลขที่'}</p>
                </div>
                <button 
                  onClick={(e) => handleDelete(e, doc.id)} 
                  className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-stone-400 mt-2">
                <span>วันที่: {doc.date}</span>
                <span>ยอดเงิน: {doc.items.length > 0 ? 'มีรายการ' : 'ไม่มีรายการ'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
