import { useState, useEffect, useRef } from 'react';
import { DocumentData } from './types';
import DocumentForm from './components/DocumentForm';
import DocumentPreview from './components/DocumentPreview';
import SavedDocumentsList from './components/SavedDocumentsList';
import LoginModal from './components/LoginModal';
import PdfDownloadModal from './components/PdfDownloadModal';
import SaveDocumentModal from './components/SaveDocumentModal';
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
  columnSettings: {
    price1Label: 'ราคา/หน่วย',
    showPrice2: false,
    price2Label: 'ราคา/ปี',
    amountLabel: 'จำนวนเงิน',
  },
  paymentTerms: 'ช่องทางการชำระเงิน\nธนาคาร:\tกรุงไทย\tสาขา:\tซีคอนสแควร์\nชื่อบัญชี:\tวอนเดอร์ เซ้นท์\nเลขที่บัญชี:\t664-3-99101-3',
  notes: '',
  additionalDetails: '',
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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSavedDocs, setShowSavedDocs] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (showSavedDocs && window.innerWidth < 1280) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    }
  }, [showSavedDocs]);

  const latestData = useRef(data);
  useEffect(() => {
    latestData.current = data;
  }, [data]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      localStorage.setItem('documentData', JSON.stringify(latestData.current));
    }, 5000);

    const handleBeforeUnload = () => {
      localStorage.setItem('documentData', JSON.stringify(latestData.current));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handlePrint = async (useNativePrint = false) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const inIframe = window !== window.parent;
    
    if (isIOS && inIframe) {
      alert("⚠️ เนื่องจากข้อจำกัดของ iPad/iOS ในโหมดจำลองหน้าจอ\n\nกรุณากดไอคอน 'เปิดแท็บใหม่' (รูปลูกศรชี้ขึ้น) ที่มุมขวาบนของ AI Studio ก่อน เพื่อให้หน้ากระดาษไม่ติดขอบครับ");
      return; 
    }

    if (useNativePrint) {
      setTimeout(() => {
        window.print();
      }, 100);
      return;
    }

    // Open Modal instead of window.prompt
    setShowPdfModal(true);
  };

  const executePdfGeneration = async (filename: string) => {
    setShowPdfModal(false);
    
    // Ensure filename has .pdf extension
    const finalFilename = filename.endsWith('.pdf') ? filename : filename + '.pdf';
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    try {
      setIsGeneratingPdf(true);
      // พัก thread เล็กน้อยให้ UI อัพเดทสถานะ loading
      await new Promise(resolve => setTimeout(resolve, 50));

      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('document-preview-container');
      if (!element) return;

      const originalBg = element.style.backgroundColor;
      element.style.backgroundColor = 'white';

      const opt: any = {
        margin:       0,
        filename:     finalFilename,
        image:        { type: 'jpeg', quality: 1 },
        // เพิ่ม scale ให้ชัดขึ้นบน ipad และเซ็ต scrollY: 0 ป้องกันหน้าขาว
        html2canvas:  { scale: 3, useCORS: true, letterRendering: true, logging: false, scrollY: 0 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
      element.style.backgroundColor = originalBg;
    } catch (error) {
      console.error("Failed to generate PDF", error);
      alert("ไม่สามารถสร้างไฟล์ PDF ได้ ระบบจะทำการพิมพ์แบบปกติแทน");
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const resetForm = () => {
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
      columnSettings: {
        price1Label: 'ราคา/หน่วย',
        showPrice2: false,
        price2Label: 'ราคา/ปี',
        amountLabel: 'จำนวนเงิน',
      },
      paymentTerms: 'ช่องทางการชำระเงิน\nธนาคาร:\tกรุงไทย\tสาขา:\tซีคอนสแควร์\nชื่อบัญชี:\tวอนเดอร์ เซ้นท์\nเลขที่บัญชี:\t664-3-99101-3',
      notes: '',
      additionalDetails: '',
      discount: 0,
      taxRate: 7,
      includeTax: false,
    };
    setData(emptyData);
    setCurrentDocId(undefined);
  };

  const loadExample = () => {
    setData(initialData);
    setCurrentDocId(undefined);
  };

  const handleSaveClick = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    
    if (currentDocId) {
      setShowSaveModal(true);
    } else {
      executeSave(false);
    }
  };

  const executeSave = async (saveAsNew = false) => {
    setShowSaveModal(false);
    if (!user) return;

    try {
      setIsSaving(true);
      const idToSave = saveAsNew ? undefined : currentDocId;
      const id = await saveDocument(data, idToSave);
      setCurrentDocId(id);
      showToast(saveAsNew ? 'บันทึกเป็นเอกสารใหม่สำเร็จ' : 'บันทึกเอกสารสำเร็จ');
    } catch (error) {
      console.error('Error saving: ', error);
      showToast('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-leaf-500" /></div>;
  }

  return (
    <div className="flex flex-col min-h-screen xl:h-screen xl:overflow-hidden bg-sand-100 text-stone-800 font-sans print:bg-white print:block print:h-auto print:min-h-0">
      {/* Header */}
      <header className="bg-sand-50 border-b border-sand-200 px-4 md:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between z-[100] no-print gap-4 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-leaf-200 group overflow-hidden shrink-0 p-1">
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
              className="px-4 py-2 text-sm font-medium text-stone-600 bg-white border border-stone-200 hover:bg-sand-50 hover:text-stone-800 rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-stone-200 shadow-sm"
            >
              คลังเอกสาร
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-stone-600 bg-white border border-stone-200 hover:bg-sand-50 hover:text-stone-800 rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-stone-200 shadow-sm"
            >
              <LogIn size={16} /> เข้าสู่ระบบ
            </button>
          )}

          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-leaf-700 bg-leaf-50 border border-leaf-200 hover:bg-leaf-100 active:bg-leaf-200 rounded-xl transition-all duration-200 active:scale-95 shadow-sm focus:outline-none focus:ring-2 focus:ring-leaf-200 flex-1 md:flex-none"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {user ? 'บันทึก Cloud' : 'เข้าสู่ระบบเพื่อบันทึก'}
          </button>

          <button
            type="button"
            onClick={() => handlePrint(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-leaf-700 bg-leaf-50 hover:bg-leaf-100 active:bg-leaf-200 border border-leaf-200 rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:ring-offset-2 flex-1 md:flex-none cursor-pointer"
          >
            <Printer size={18} />
            พิมพ์
          </button>
          
          <button
            type="button"
            onClick={() => handlePrint(false)}
            disabled={isGeneratingPdf}
            className="flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium text-white bg-leaf-600 hover:bg-leaf-700 active:bg-leaf-800 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl transition-all duration-200 active:scale-95 shadow-sm shadow-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:ring-offset-2 flex-1 md:flex-none cursor-pointer"
          >
            {isGeneratingPdf ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
            {isGeneratingPdf ? 'กำลังโหลด...' : 'โหลด PDF'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-h-0 flex flex-col xl:flex-row w-full mx-auto relative xl:overflow-hidden print:overflow-visible print:block">
        
        {/* Form Panel (Left) */}
        <section className={`w-full xl:w-[450px] 2xl:w-[500px] flex-shrink-0 bg-sand-50 border-r border-sand-200 no-print xl:overflow-y-auto custom-scrollbar transition-all duration-300 ${showSavedDocs ? '-ml-[500px]' : 'ml-0'} ${showMobilePreview ? 'hidden xl:block' : 'block'}`}>
          <div className="p-6 md:p-8">
            <DocumentForm data={data} onChange={setData} />
          </div>
        </section>

        {/* Saved Docs Panel (Slide in from left) */}
        {user && showSavedDocs && (
          <>
            {/* Backdrop for mobile/tablet */}
            <div 
              className="fixed inset-0 bg-[#1c191766] z-[110] xl:hidden backdrop-blur-sm animate-in fade-in transition-opacity"
              onClick={() => setShowSavedDocs(false)}
            />
            <section className="fixed inset-y-0 left-0 z-[120] xl:absolute xl:inset-auto xl:left-0 xl:top-0 xl:bottom-0 xl:z-20 w-[85%] max-w-[400px] sm:max-w-[450px] xl:w-[450px] 2xl:w-[500px] bg-white border-r border-stone-200 shadow-2xl animate-in slide-in-from-left xl:h-full overflow-hidden flex flex-col">
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
          </>
        )}

        {/* Preview Panel (Right) */}
        <section className={`flex-1 p-0 sm:p-6 md:p-8 xl:p-12 xl:overflow-y-auto print:h-auto print:overflow-visible justify-center bg-sand-100 print:bg-white print:p-0 print:block custom-scrollbar items-start relative z-0 ${showMobilePreview ? 'flex' : 'hidden xl:flex'} print:!flex`}>
          <div className="w-full overflow-x-auto overflow-y-hidden custom-scrollbar pb-6 xl:pb-0 px-4 sm:px-0">
            <div className="bg-white shadow-xl shadow-stone-200 rounded-2xl print:shadow-none print:rounded-none w-[794px] min-h-[1123px] mx-auto border border-sand-200 print:border-none print:w-full print:min-h-0 relative">
              {/* Aspect ratio A4 for realistic preview */}
              <div id="document-preview-container" className="print-area print:min-h-0 bg-white w-full min-h-[1123px] flex flex-col justify-between print:static print:w-full overflow-hidden rounded-2xl print:rounded-none">
                 <DocumentPreview data={data} />
              </div>
            </div>
          </div>
        </section>
        
      </main>

      {/* Mobile Toggle Preview Button */}
      <div className="fixed bottom-6 right-6 z-[100] xl:hidden no-print">
        <button
          onClick={() => setShowMobilePreview(!showMobilePreview)}
          className="flex items-center gap-2 bg-leaf-600 hover:bg-leaf-700 text-white shadow-lg shadow-leaf-600/30 px-5 py-3 rounded-full font-medium transition-all transform active:scale-95"
        >
          {showMobilePreview ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              กลับไปแก้ไข
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
              ดูตัวอย่าง
            </>
          )}
        </button>
      </div>

      {(showLogin || (!loading && !user)) && (
        <LoginModal 
          onClose={() => setShowLogin(false)} 
          closable={!!user} 
        />
      )}
      <PdfDownloadModal 
        isOpen={showPdfModal} 
        onClose={() => setShowPdfModal(false)} 
        onConfirm={executePdfGeneration}
        defaultFilename={data.documentNumber ? `${data.documentNumber}` : 'เอกสาร'}
      />
      <SaveDocumentModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSaveAsNew={() => executeSave(true)}
        onOverwrite={() => executeSave(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] bg-stone-800 text-white px-6 py-3 rounded-full shadow-lg shadow-black/20 font-medium text-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-leaf-400"></div>
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
