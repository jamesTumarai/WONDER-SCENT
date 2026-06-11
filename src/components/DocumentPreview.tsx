import { DocumentData } from '../types';

interface Props {
  data: DocumentData;
}

export default function DocumentPreview({ data }: Props) {
  const isInvoice = data.type === 'INVOICE';
  const isQuotation = data.type === 'QUOTATION';
  const isReceipt = data.type === 'RECEIPT';

  const title = {
    th: isQuotation ? 'ใบเสนอราคา' : isInvoice ? 'ใบแจ้งหนี้' : 'ใบเสร็จรับเงิน',
    en: isQuotation ? 'Quotation' : isInvoice ? 'Invoice' : 'Receipt'
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    // Format to DD/MM/YYYY
    const [y, m, d] = dateStr.split('-');
    return `${d} ${getMonthName(m)} ${parseInt(y) + 543}`;
  };

  const getMonthName = (m: string) => {
    const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    return months[parseInt(m) - 1];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount).replace('THB', '฿');
  };

  // Calculate totals
  const subTotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const afterDiscount = subTotal - (data.discount || 0);
  const taxAmount = data.includeTax ? (afterDiscount * (data.taxRate || 0)) / 100 : 0;
  const grandTotal = afterDiscount + taxAmount;

  return (
    <div className="font-sans text-[13px] md:text-[14px] text-stone-800 bg-white h-full relative flex flex-col justify-between shadow-inner" style={{ minHeight: '297mm' }}>
      {/* Top Border Bar */}
      <div className="h-2 w-full bg-leaf-500 absolute top-0 left-0 right-0"></div>

      <div className="pt-16 pb-12 px-12 md:px-16 flex flex-col flex-1">
        
        {/* Top Header: Sender Left, Title Right */}
        <div className="flex justify-between items-start mb-12">
          {/* Sender */}
          <div className="flex-1 pr-8">
            {data.from.name ? (
              <div className="space-y-1.5 text-sm text-stone-600">
                <h1 className="text-2xl font-bold text-stone-800 mb-4">{data.from.name}</h1>
                <p className="whitespace-pre-line leading-relaxed">{data.from.address}</p>
                <div className="pt-2 space-y-0.5 text-[13px]">
                  {data.from.taxId && <p><span className="text-stone-400 w-32 inline-block">เลขประจำตัวผู้เสียภาษี:</span> <span className="text-stone-700 font-medium">{data.from.taxId}</span></p>}
                  {data.from.branch && <p><span className="text-stone-400 w-32 inline-block">สาขา:</span> <span className="text-stone-700 font-medium">{data.from.branch}</span></p>}
                  {data.from.phone && <p><span className="text-stone-400 w-32 inline-block">เบอร์โทรศัพท์:</span> <span className="text-stone-700 font-medium">{data.from.phone}</span></p>}
                  {data.from.email && <p><span className="text-stone-400 w-32 inline-block">อีเมล:</span> <span className="text-stone-700 font-medium">{data.from.email}</span></p>}
                </div>
              </div>
            ) : (
              <div className="w-32 h-32 bg-stone-50 border border-stone-100 rounded-2xl flex items-center justify-center text-stone-300 italic text-sm">
                โลโก้บริษัท
              </div>
            )}
          </div>
          
          {/* Document Details */}
          <div className="text-right w-72">
            <h1 className="text-3xl md:text-4xl font-bold text-leaf-600 mb-1">{title.th}</h1>
            <h2 className="font-semibold text-leaf-600/60 tracking-[0.2em] text-xs uppercase mb-6">{title.en}</h2>
            
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1.5 text-stone-400 font-medium">เลขที่</td>
                  <td className="py-1.5 font-bold text-stone-800">{data.documentNumber || '-'}</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-stone-400 font-medium">วันที่ออก</td>
                  <td className="py-1.5 font-medium text-stone-800">{formatDate(data.date)}</td>
                </tr>
                {data.dueDate && (
                  <tr>
                    <td className="py-1.5 text-stone-400 font-medium">
                      {data.type === 'QUOTATION' ? 'ยืนยันราคาถึง' : 'วันครบกำหนด'}
                    </td>
                    <td className="py-1.5 font-medium text-stone-800">{formatDate(data.dueDate)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Information Section */}
        <div className="mb-10 p-6 bg-sand-50/50 rounded-2xl border border-stone-100/80 w-full max-w-xl">
          <h4 className="font-bold text-leaf-600 text-[11px] tracking-wider uppercase mb-3 flex items-center gap-2">
            ลูกค้า (Customer)
          </h4>
          {data.to.name ? (
             <div className="space-y-1 text-sm text-stone-600">
               <p className="font-bold text-stone-800 text-lg mb-2">{data.to.name}</p>
               <p className="whitespace-pre-line leading-relaxed pb-2">{data.to.address}</p>
               <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[13px] pt-1">
                 {data.to.taxId && <p className="col-span-2 sm:col-span-1"><span className="text-stone-400">ผู้เสียภาษี:</span> <span className="text-stone-700 font-medium">{data.to.taxId}</span></p>}
                 {data.to.branch && <p className="col-span-2 sm:col-span-1"><span className="text-stone-400">สาขา:</span> <span className="text-stone-700 font-medium">{data.to.branch}</span></p>}
                 {data.to.phone && <p className="col-span-2 sm:col-span-1"><span className="text-stone-400">โทร:</span> <span className="text-stone-700 font-medium">{data.to.phone}</span></p>}
                 {data.to.contactPerson && <p className="col-span-2 sm:col-span-1"><span className="text-stone-400">ผู้ติดต่อ:</span> <span className="text-stone-700 font-medium">{data.to.contactPerson}</span></p>}
               </div>
             </div>
          ) : (
            <p className="text-stone-300 italic text-sm">ยังไม่ได้ระบุข้อมูลลูกค้า</p>
          )}
        </div>

        {/* Items Table */}
        <div className="mb-8 rounded-2xl overflow-hidden border border-stone-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sand-50/80">
                <th className="py-3.5 px-4 font-semibold text-stone-500 text-center w-14 text-xs uppercase tracking-wider">#</th>
                <th className="py-3.5 px-6 font-semibold text-stone-500 text-xs uppercase tracking-wider">รายการ (Description)</th>
                <th className="py-3.5 px-4 text-center font-semibold text-stone-500 w-24 text-xs uppercase tracking-wider">จำนวน</th>
                <th className="py-3.5 px-4 text-right font-semibold text-stone-500 w-36 text-xs uppercase tracking-wider">ราคา/หน่วย</th>
                <th className="py-3.5 px-6 text-right font-semibold text-stone-500 w-40 text-xs uppercase tracking-wider">จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody>
              {data.items.length === 0 ? (
                 <tr>
                   <td className="py-6 px-4 text-center text-stone-300 border-t border-stone-100">1</td>
                   <td className="py-6 px-6 text-stone-300 italic border-t border-stone-100">ยังไม่ระบุรายการ</td>
                   <td className="py-6 px-4 text-center text-stone-800 border-t border-stone-100">1</td>
                   <td className="py-6 px-4 text-right text-stone-800 border-t border-stone-100">฿0.00</td>
                   <td className="py-6 px-6 text-right font-semibold text-stone-800 border-t border-stone-100">฿0.00</td>
                 </tr>
              ) : (
                data.items.map((item, index) => (
                  <tr key={item.id} className="group hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-4 text-stone-400 text-center border-t border-stone-100 text-[13px] align-top">{index + 1}</td>
                    <td className="py-4 px-6 font-medium text-stone-800 border-t border-stone-100 leading-relaxed align-top">
                      {item.description || '-'}
                    </td>
                    <td className="py-4 px-4 text-center text-stone-700 border-t border-stone-100 align-top">{item.quantity}</td>
                    <td className="py-4 px-4 text-right text-stone-600 border-t border-stone-100 align-top">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-4 px-6 text-right font-semibold text-stone-800 border-t border-stone-100 align-top">
                      {formatCurrency((item.quantity || 0) * (item.unitPrice || 0))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totals & Notes Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mt-auto pt-4">
          {/* Notes */}
          <div className="w-full md:w-1/2">
            {data.notes && (
              <div className="text-sm bg-stone-50/50 p-5 rounded-2xl border border-stone-100/80">
                <h4 className="font-semibold text-stone-500 mb-2.5 flex items-center gap-2 text-[11px] uppercase tracking-wider">
                  หมายเหตุ / เงื่อนไข
                </h4>
                <p className="whitespace-pre-line text-stone-600 leading-relaxed text-[13px]">{data.notes}</p>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="w-full md:w-80 bg-white border border-stone-100 rounded-2xl p-6 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)]">
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-2 text-stone-500">ยอดยกมา</td>
                  <td className="py-2 text-right text-stone-700 font-medium">{formatCurrency(subTotal)}</td>
                </tr>
                {data.discount > 0 && (
                  <tr>
                    <td className="py-2 text-stone-500">ส่วนลด</td>
                    <td className="py-2 text-right text-clay-600 font-semibold">-{formatCurrency(data.discount)}</td>
                  </tr>
                )}
                {data.discount > 0 && (
                  <tr>
                    <td className="py-2 text-stone-700 font-medium pt-3 text-[13px]">ยอดหลังหักส่วนลด</td>
                    <td className="py-2 text-right text-stone-800 font-medium pt-3">{formatCurrency(afterDiscount)}</td>
                  </tr>
                )}
                {data.includeTax && (
                  <tr>
                    <td className="py-2 text-stone-500">ภาษีมูลค่าเพิ่ม {data.taxRate}%</td>
                    <td className="py-2 text-right text-stone-700 font-medium">{formatCurrency(taxAmount)}</td>
                  </tr>
                )}
                <tr>
                  <td className="pt-4 pb-1 text-stone-800 font-bold text-base border-t border-stone-100 mt-2">ยอดรวมทั้งสิ้น</td>
                  <td className="pt-4 pb-1 text-right font-bold text-2xl text-leaf-600 border-t border-stone-100 mt-2">{formatCurrency(grandTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-16 mt-16 pt-8 border-t border-stone-100">
          <div className="text-center group flex flex-col items-center">
            <div className="border-b-[1.5px] border-stone-300 mb-4 h-12 w-56 group-hover:border-leaf-400 transition-colors relative flex items-end justify-center pb-1">
              <span className="text-[10px] text-stone-300 uppercase tracking-widest">(ลายมือชื่อ)</span>
            </div>
            <p className="font-semibold text-stone-700 text-sm">ผู้รับเอกสาร</p>
            <p className="text-xs text-stone-400 mt-1.5 opacity-70">วันที่ _____ / _____ / _____</p>
          </div>
          <div className="text-center group flex flex-col items-center">
            <div className="border-b-[1.5px] border-stone-300 mb-4 h-12 w-56 group-hover:border-leaf-400 transition-colors relative flex items-end justify-center pb-1">
               <span className="text-[10px] text-stone-300 uppercase tracking-widest">(ลายมือชื่อ)</span>
            </div>
            <p className="font-semibold text-stone-700 text-sm">ผู้อนุมัติ / ผู้รับเงิน</p>
            <p className="text-xs text-stone-400 mt-1.5 opacity-70">วันที่ _____ / _____ / _____</p>
          </div>
        </div>

      </div>
    </div>
  );
}
