import React, { useEffect, useState } from 'react';
import { getUserDocuments, SavedDocument, deleteUserDocument, toggleDocumentStar } from '../db';
import { FileText, Loader2, Trash2, X, AlertCircle, Bookmark, Search, Star } from 'lucide-react';
import { DocumentType } from '../types';

interface Props {
  onClose: () => void;
  onSelect: (doc: SavedDocument) => void;
}

const TYPE_LABELS: Record<DocumentType, string> = {
  QUOTATION: 'ใบเสนอราคา',
  INVOICE: 'ใบแจ้งหนี้',
  RECEIPT: 'ใบเสร็จรับเงิน',
};

export default function SavedDocumentsList({ onClose, onSelect }: Props) {
  const [docs, setDocs] = useState<SavedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<DocumentType | 'ALL'>('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST'>('NEWEST');
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);

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

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDocToDelete(id);
  };

  const confirmDelete = async () => {
    if (!docToDelete) return;
    try {
      await deleteUserDocument(docToDelete);
      const newDocs = docs.filter(d => d.id !== docToDelete);
      setDocs(newDocs);
      if (newDocs.length === 0) {
        onClose();
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการลบเอกสาร');
    } finally {
      setDocToDelete(null);
    }
  };
  
  const handleToggleStar = async (e: React.MouseEvent, docId: string, currentStarredStatus: boolean) => {
    e.stopPropagation();
    try {
      await toggleDocumentStar(docId, currentStarredStatus);
      const updatedDocs = docs.map(d => 
        d.id === docId ? { ...d, starred: !currentStarredStatus } : d
      );
      setDocs(updatedDocs);
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการติดดาว');
    }
  };
  
  // Filter and sort docs
  const filteredDocs = docs.filter(doc => {
    if (filterType !== 'ALL' && doc.type !== filterType) return false;
    if (showStarredOnly && !doc.starred) return false;
    
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const nameMatch = (doc.to.name || '').toLowerCase().includes(query);
    const dateMatch = (doc.date || '').includes(query);
    const numMatch = (doc.documentNumber || '').toLowerCase().includes(query);
    return nameMatch || dateMatch || numMatch;
  }).sort((a, b) => {
    const timeA = a.createdAt || 0;
    const timeB = b.createdAt || 0;
    return sortOrder === 'NEWEST' ? timeB - timeA : timeA - timeB;
  });

  // Group docs by type
  const groupedDocs = filteredDocs.reduce((acc, doc) => {
    if (!acc[doc.type]) acc[doc.type] = [];
    acc[doc.type].push(doc);
    return acc;
  }, {} as Record<string, SavedDocument[]>);

  // Sorting order for types
  const typeOrder: DocumentType[] = ['QUOTATION', 'INVOICE', 'RECEIPT'];

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-stone-100">
        <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
          <Bookmark size={20} className="text-leaf-600" /> คลังเอกสาร
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full text-stone-400 hover:text-stone-600 transition-colors">
          <X size={20} />
        </button>
      </div>
      
      {!loading && !error && docs.length > 0 && (
        <div className="px-4 md:px-6 pt-4 pb-2 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              placeholder="ค้นหาชื่อลูกค้า, วันที่, เลขที่เอกสาร..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-400 transition-all text-stone-700"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filterType === 'ALL' 
                    ? 'bg-stone-800 text-white' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                ทั้งหมด
              </button>
              {typeOrder.map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filterType === type 
                      ? 'bg-leaf-600 text-white' 
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {TYPE_LABELS[type]}
                </button>
              ))}
              <button
                onClick={() => setShowStarredOnly(!showStarredOnly)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                  showStarredOnly 
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-transparent'
                }`}
              >
                <Star size={12} className={showStarredOnly ? 'fill-yellow-500 text-yellow-500' : ''} />
                ติดดาว
              </button>
            </div>
            
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'NEWEST' | 'OLDEST')}
              className="text-xs bg-stone-50 border border-stone-200 text-stone-600 rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-leaf-500/20"
            >
              <option value="NEWEST">ใหม่สุด</option>
              <option value="OLDEST">เก่าสุด</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
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
          <div className="text-center p-12 text-stone-400 border-2 border-dashed border-stone-100 rounded-3xl mt-4">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-sm font-medium">ยังไม่มีเอกสารที่บันทึกไว้ในระบบ</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center p-12 text-stone-400 rounded-3xl mt-4">
            <Search size={32} className="mx-auto mb-4 opacity-50" />
            <p className="text-sm font-medium">ไม่พบเอกสารที่ค้นหา</p>
          </div>
        ) : (
          <div className="space-y-8 pb-8">
            {typeOrder.map(type => {
              const items = groupedDocs[type];
              if (!items || items.length === 0) return null;

              return (
                <div key={type} className="space-y-3">
                  <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2 border-b border-stone-100 pb-2">
                    <span className="w-2 h-2 rounded-full bg-leaf-500"></span>
                    หมวด: {TYPE_LABELS[type]}
                  </h3>
                  <div className="grid gap-3">
                    {items.map(doc => (
                      <div 
                        key={doc.id}
                        onClick={() => onSelect(doc)}
                        className="p-4 rounded-2xl border border-stone-200 hover:border-leaf-300 hover:shadow-md transition-all cursor-pointer group bg-stone-50/50 hover:bg-white flex flex-col gap-2"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-stone-800 line-clamp-1 pr-4 flex items-center gap-2">
                              {doc.starred && <Star size={14} className="fill-yellow-400 text-yellow-400" />}
                              {doc.to.name || 'ไม่ได้ระบุผู้รับ'}
                            </h4>
                            <p className="text-sm text-stone-500 font-medium font-mono mt-0.5">{doc.documentNumber || 'ไม่มีเลขที่'}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={(e) => handleToggleStar(e, doc.id, !!doc.starred)} 
                              className={`p-2 -mt-2 rounded-lg transition-all ${
                                doc.starred 
                                  ? 'text-yellow-500 hover:bg-yellow-50 opacity-100' 
                                  : 'text-stone-300 hover:text-yellow-500 hover:bg-yellow-50 opacity-0 group-hover:opacity-100'
                              }`}
                              title={doc.starred ? 'เลิกติดดาว' : 'ติดดาว'}
                            >
                              <Star size={16} className={doc.starred ? 'fill-current' : ''} />
                            </button>
                            <button 
                              onClick={(e) => handleDelete(e, doc.id)} 
                              className="p-2 -mr-2 -mt-2 text-stone-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 rounded-lg transition-all"
                              title="ลบเอกสาร"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] text-stone-400 mt-1">
                          <span className="flex items-center gap-1.5 px-2 py-1 bg-stone-100 rounded-md">
                            วันที่: {doc.date || '-'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {docToDelete && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border border-stone-200/50">
            <h3 className="text-lg font-bold text-stone-800 mb-2">ยืนยันการลบเอกสาร</h3>
            <p className="text-sm text-stone-600 mb-6 leading-relaxed">คุณแน่ใจหรือไม่ว่าต้องการลบเอกสารนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้</p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setDocToDelete(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                ลบเอกสาร
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
