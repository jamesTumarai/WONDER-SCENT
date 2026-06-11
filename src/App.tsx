import { useState, useEffect } from 'react';
import { DocumentData } from './types';
import DocumentForm from './components/DocumentForm';
import DocumentPreview from './components/DocumentPreview';
import SavedDocumentsList from './components/SavedDocumentsList';
import LoginModal from './components/LoginModal';
import { FileText, Printer, Cloud, LogIn, LogOut, Loader2, Save } from 'lucide-react';
import { useAuth } from './AuthContext';
import { saveDocument, getUserDocuments, deleteUserDocument, SavedDocument } from './db';

const initialData: DocumentData = {
  type: 'INVOICE',
  documentNumber: 'INV-2026-001',
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  from: {
    name: 'วอนเดอร์ เซ้นท์',
    address: 'เลขที่ 69 ซอย เฉลิมพระเกียรติร.9 ซ.8 แขวงหนองบอน เขตประเวศ กรุงเทพมหานคร 10250',
    taxId: '3350800908238',
    phone: '0962464280',
    email: 'wonderscent69@gmail.com',
    logo: '/33.png'
  },
  to: {
    name: 'บริษัท อิเทอนิตี้แอทวัน จำกัด',
    address: 'เลขที่ 668 ถนนพระรามที่6 แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพ 10400',
    taxId: '0-1055-66163-73-3',
    phone: '02-7533888',
    email: '',
    branch: 'สำนักงานใหญ่',
    contactPerson: 'คุณนิดหน่อย',
  },
  items: [
    {
      id: "1",
      description: 'น้ำหอมกลิ่น chanel mademoiselle สำหรับใช้ 1 เดือน',
      quantity: 1,
      unitPrice: 2500,
    }
  ],
  paymentTerms: 'ช่องทางการชำระเงิน\nธนาคาร:\tกรุงไทย\tสาขา:\tซีคอนสแควร์\nชื่อบัญชี:\tวอนเดอร์ เซ้นท์\nเลขที่บัญชี:\t664-3-99101-3',
  notes: '',
  discount: 0,
  taxRate: 0,
  includeTax: false,
};

export default function App() {
  const { user, loading, signIn, logOut } = useAuth();
  const [data, setData] = useState<DocumentData>(() => {
    const saved = localStorage.getItem('documentData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialData;
      }
    }
    return initialData;
  });

  const [currentDocId, setCurrentDocId] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedDocs, setShowSavedDocs] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    localStorage.setItem('documentData', JSON.stringify(data));
  }, [data]);

  const handlePrint = () => {
    window.print();
  };

  const resetForm = () => {
    if(window.confirm('คุณต้องการล้างข้อมูลเพื่อเริ่มต้นใหม่ทั้งหมดหรือไม่?')) {
      const emptyData: DocumentData = {
        type: 'QUOTATION',
        documentNumber: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: '',
        from: { 
          name: 'วอนเดอร์ เซ้นท์', 
          address: 'เลขที่ 69 ซอย เฉลิมพระเกียรติร.9 ซ.8 แขวงหนองบอน เขตประเวศ กรุงเทพมหานคร 10250', 
          taxId: '3350800908238', 
          phone: '0962464280', 
          email: 'wonderscent69@gmail.com', 
          branch: '', 
          contactPerson: '' 
        },
        to: { name: '', address: '', taxId: '', phone: '', email: '', branch: '', contactPerson: '' },
        items: [{ id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0 }],
        paymentTerms: 'ช่องทางการชำระเงิน\nธนาคาร:\tกรุงไทย\tสาขา:\tซีคอนสแควร์\nชื่อบัญชี:\tวอนเดอร์ เซ้นท์\nเลขที่บัญชี:\t664-3-99101-3',
        notes: '',
        discount: 0,
        taxRate: 7,
        includeTax: false,
      };
      setData(emptyData);
      setCurrentDocId(undefined);
    }
  };

  const loadExample = () => {
    if(window.confirm('แทนที่ข้อมูลปัจจุบันด้วยตัวอย่างเริ่มต้นหรือไม่?')) {
      setData(initialData);
      setCurrentDocId(undefined);
    }
  };

  const handleSaveToCloud = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    try {
      setIsSaving(true);
      const id = await saveDocument(data, currentDocId);
      setCurrentDocId(id);
      alert('บันทึกเอกสารลง Cloud สำเร็จ');
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึกเอกสาร: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-leaf-500" /></div>;
  }

  return (
    <div className="min-h-screen bg-sand-100 text-stone-800 font-sans print:bg-white flex flex-col print:block print:h-auto print:min-h-0">
      {/* Header */}
      <header className="bg-sand-50 border-b border-sand-200 px-4 md:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between sticky top-0 z-10 no-print gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-leaf-200/50 group overflow-hidden shrink-0 p-1">
            <img src="/33.png" alt="Wonder Scent" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-800 tracking-tight flex items-baseline gap-1.5 uppercase font-serif">
                WONDER <span className="text-leaf-600 font-medium">SCENT</span>
              </h1>
              {user ? (
                <span className="bg-leaf-50 text-leaf-700 border border-leaf-200 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider flex items-center gap-1"><Cloud size={12}/> Cloud</span>
              ) : (
                <span className="bg-stone-100 text-stone-600 border border-stone-200 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">Local</span>
              )}
            </div>
            {user ? (
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-[11px] text-stone-500 font-medium">{user.email}</p>
                <button onClick={logOut} className="text-[10px] text-clay-500 hover:text-clay-700 underline">ออกจากระบบ</button>
              </div>
            ) : (
              <p className="text-xs text-stone-500 font-medium mt-0.5 tracking-wide">DOCUMENT GENERATOR</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <button
            onClick={resetForm}
            className="px-4 py-2 text-sm font-medium text-stone-600 bg-white border border-stone-200 hover:bg-sand-50 hover:text-stone-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-stone-200 shadow-sm"
          >
            สร้างใหม่
          </button>
          
          {user ? (
            <button
              onClick={() => setShowSavedDocs(true)}
              className="px-4 py-2 text-sm font-medium text-stone-600 bg-white border border-stone-200 hover:bg-sand-50 hover:text-stone-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-stone-200 shadow-sm"
            >
              คลังเอกสาร
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-stone-600 bg-white border border-stone-200 hover:bg-sand-50 hover:text-stone-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-stone-200 shadow-sm"
            >
              <LogIn size={16} /> เข้าสู่ระบบ
            </button>
          )}

          <button
            onClick={handleSaveToCloud}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-leaf-700 bg-leaf-50 border border-leaf-200 hover:bg-leaf-100 rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-leaf-200"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {user ? 'บันทึก Cloud' : 'เข้าสู่ระบบเพื่อบันทึก'}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium text-white bg-leaf-600 hover:bg-leaf-700 rounded-xl transition-all shadow-sm shadow-leaf-500/20 focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:ring-offset-2 flex-1 md:flex-none"
          >
            <Printer size={18} />
            พิมพ์ / PDF
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col xl:flex-row w-full mx-auto relative overflow-hidden print:overflow-visible print:block">
        
        {/* Form Panel (Left) */}
        <section className={`w-full xl:w-[450px] 2xl:w-[500px] flex-shrink-0 bg-sand-50 border-r border-sand-200 no-print h-[calc(100vh-73px)] overflow-y-auto custom-scrollbar transition-all duration-300 ${showSavedDocs ? '-ml-[500px]' : 'ml-0'}`}>
          <div className="p-6 md:p-8">
            <DocumentForm data={data} onChange={setData} />
          </div>
        </section>

        {/* Saved Docs Panel (Slide in from left) */}
        {user && showSavedDocs && (
          <section className="absolute left-0 top-0 bottom-0 w-full xl:w-[450px] 2xl:w-[500px] bg-white border-r border-stone-200 z-20 shadow-2xl animate-in slide-in-from-left">
            <SavedDocumentsList 
              onClose={() => setShowSavedDocs(false)} 
              onSelect={(docData) => {
                const { id, userId, createdAt, updatedAt, ...rest } = docData;
                setData(rest as DocumentData);
                setCurrentDocId(id);
                setShowSavedDocs(false);
              }}
            />
          </section>
        )}

        {/* Preview Panel (Right) */}
        <section className="flex-1 p-6 md:p-8 xl:p-12 h-[calc(100vh-73px)] print:h-auto print:overflow-visible overflow-y-auto flex justify-center bg-sand-100 print:bg-white print:p-0 print:block custom-scrollbar items-start relative z-0">
          <div className="bg-white shadow-xl shadow-stone-200/50 rounded-2xl print:shadow-none print:rounded-none w-full max-w-[210mm] max-h-min self-start print:max-w-none print:w-full overflow-hidden border border-sand-200 print:border-none">
            {/* Aspect ratio A4 for realistic preview */}
            <div className="print-area min-h-[297mm] print:min-h-0">
               <DocumentPreview data={data} />
            </div>
          </div>
        </section>
        
      </main>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}
