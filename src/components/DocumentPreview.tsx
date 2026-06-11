import { DocumentData } from '../types';
import THBText from 'thai-baht-text';

interface Props {
  data: DocumentData;
}

export default function DocumentPreview({ data }: Props) {
  const isInvoice = data.type === 'INVOICE';
  const isQuotation = data.type === 'QUOTATION';
  const isReceipt = data.type === 'RECEIPT';

  const title = {
    th: isQuotation ? 'ใบเสนอราคา' : isInvoice ? 'ใบแจ้งหนี้' : 'ใบเสร็จรับเงิน',
    en: isQuotation ? 'quotation' : isInvoice ? 'invoice' : 'receipt'
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${parseInt(d)} ${getMonthName(m)} ${parseInt(y) + 543}`;
  };

  const getMonthName = (m: string) => {
    const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    return months[parseInt(m) - 1];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  // Calculate totals
  const subTotal = data.items.reduce((sum, item) => {
    if (item.amount !== undefined) {
      return sum + item.amount;
    }
    return sum + (item.quantity * item.unitPrice) + (data.columnSettings?.showPrice2 ? item.quantity * (item.unitPrice2 || 0) : 0);
  }, 0);
  const afterDiscount = subTotal - (data.discount || 0);
  const taxAmount = data.includeTax ? (afterDiscount * (data.taxRate || 0)) / 100 : 0;
  const grandTotal = afterDiscount + taxAmount;

  const theme = data.themeColor || 'stone';
  const colorMap = {
    stone: { bg: 'bg-[#703030]', text: 'text-[#703030]', border: 'border-[#703030]', label: 'text-cyan-800', value: 'text-cyan-900', receiptBg: 'bg-[#2A939C]', secBg: 'bg-[#DEEAEB]' },
    slate: { bg: 'bg-slate-700', text: 'text-slate-700', border: 'border-slate-700', label: 'text-slate-600', value: 'text-slate-800', receiptBg: 'bg-slate-700', secBg: 'bg-slate-100' },
    zinc:  { bg: 'bg-zinc-700',  text: 'text-zinc-700',  border: 'border-zinc-700',  label: 'text-zinc-600',  value: 'text-zinc-800',  receiptBg: 'bg-zinc-700',  secBg: 'bg-zinc-100' },
    leaf:  { bg: 'bg-emerald-700', text: 'text-emerald-700', border: 'border-emerald-700', label: 'text-emerald-600', value: 'text-emerald-800', receiptBg: 'bg-emerald-600', secBg: 'bg-emerald-50' },
    clay:  { bg: 'bg-amber-700',   text: 'text-amber-700',   border: 'border-amber-700',   label: 'text-amber-600',   value: 'text-amber-800',   receiptBg: 'bg-amber-600',   secBg: 'bg-amber-50' },
    blue:  { bg: 'bg-blue-700',    text: 'text-blue-700',    border: 'border-blue-700',    label: 'text-blue-600',    value: 'text-blue-800',    receiptBg: 'bg-blue-600',    secBg: 'bg-blue-50' },
  };
  const c = colorMap[theme as keyof typeof colorMap] || colorMap.stone;
  const labelColor = c.label;
  const valueColor = c.value;

  const fontStyle = data.fontFamily === 'prompt' ? '"Prompt", sans-serif' : data.fontFamily === 'sarabun' ? '"Sarabun", sans-serif' : 'sans-serif';

  if (isQuotation) {
    return (
      <div className={`text-[12px] text-stone-800 bg-white min-h-[295mm] print:min-h-0 relative flex flex-col justify-between font-medium`} style={{ fontFamily: fontStyle }}>
        <div className="pt-12 pb-12 px-12 flex flex-col flex-1">
          
          {/* Header */}
          <div className="flex gap-6 mb-6">
            <div className="w-32 h-32 shrink-0">
              {data.from.logo || data.from.name.includes('วอนเดอร์') ? (
                <img src={data.from.logo || '/33.png'} alt="Logo" className="w-full h-full object-contain object-left-top" />
              ) : (
                <div className="text-xl font-bold">{data.from.name}</div>
              )}
            </div>
            <div className="flex-1 pt-1">
              <h1 className="text-xl font-bold">{data.from.name}</h1>
              {!data.from.name.toLowerCase().includes('wonder') && (
                 <h2 className="text-xl font-bold uppercase tracking-wide">WONDER SCENT</h2>
              )}
              <div className="text-[11px] mt-2 leading-relaxed">
                <div>ที่อยู่: {data.from.address || ''}</div>
                <div>เบอร์โทร: {data.from.phone || ''} อีเมล: {data.from.email || ''}</div>
                <div>หมายเลขประจำตัวผู้เสียภาษี: {data.from.taxId || ''}</div>
              </div>
            </div>
          </div>

          {/* Title Box */}
          <div className="flex justify-center mb-6">
            <div className={`border-2 ${c.border} rounded-xl px-12 py-1.5 text-center ${c.text}`}>
              <h2 className="text-lg font-bold">ใบเสนอราคา</h2>
              <h3 className="font-bold">Quotation</h3>
            </div>
          </div>

          {/* Customer Info */}
          <div className="text-[11px] flex justify-between mb-2">
            <div className="flex-1 pr-4">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="w-[120px] py-0.5 align-top">นามลูกค้า</td>
                    <td className="py-0.5">{data.to.name || ''}</td>
                  </tr>
                  <tr>
                    <td className="w-[120px] py-0.5 align-top">ที่อยู่</td>
                    <td className="py-0.5">{data.to.address || ''}</td>
                  </tr>
                  <tr>
                    <td className="w-[120px] py-0.5 align-top"></td>
                    <td className="py-0.5">ผู้ติดต่อ: {data.to.contactPerson || '-'} เบอร์โทร: {data.to.phone || '-'}</td>
                  </tr>
                  <tr>
                    <td className="w-[120px] py-0.5 align-top whitespace-nowrap">เลขประจำตัวผู้เสียภาษี</td>
                    <td className="py-0.5 pl-4">
                      <div className="flex items-center gap-6">
                        <span>{data.to.taxId || ''}</span>
                        <span>สาขา {data.to.branch || ''}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="w-48 text-[11px]">
               <div className="flex justify-end gap-4 py-0.5">
                 <span>วันที่</span>
                 <span>{formatDate(data.date)}</span>
               </div>
            </div>
          </div>

          {/* Table */}
          <div className="mb-4 flex-1">
            <table className="w-full text-left border-collapse border-2 border-black">
              <thead>
                <tr className={`${c.bg} text-white`}>
                  <th className="py-2.5 px-3 font-medium text-center w-12 text-[11px] border border-black">ลำดับ</th>
                  <th className="py-2.5 px-6 font-medium text-[11px] border border-black text-center">รายการ</th>
                  <th className="py-2.5 px-4 text-center font-medium w-24 text-[11px] border border-black">จำนวน</th>
                  <th className="py-2.5 px-4 text-center font-medium w-28 text-[11px] border border-black">{data.columnSettings?.price1Label || 'ราคา/เดือน'}</th>
                  {data.columnSettings?.showPrice2 && (
                    <th className="py-2.5 px-4 text-center font-medium w-28 text-[11px] border border-black">{data.columnSettings?.price2Label || 'ราคา/ปี'}</th>
                  )}
                  <th className="py-2.5 px-6 text-center font-medium w-32 text-[11px] border border-black">ราคารวม</th>
                </tr>
              </thead>
              <tbody>
                {data.items.length === 0 ? (
                  <tr className="h-6">
                    <td className="py-4 border border-black"></td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td>
                    {data.columnSettings?.showPrice2 && <td className="border border-black"></td>}
                    <td className="border border-black"></td>
                  </tr>
                ) : (
                  data.items.map((item, index) => (
                    <tr key={item.id} className="h-6">
                      <td className="py-2 px-3 text-center border border-black text-[11px] align-top">{index + 1}</td>
                      <td className="py-2 px-6 border text-stone-800 align-top break-words text-[11px] border-black">
                        <div className="whitespace-pre-wrap">{item.description || ''}</div>
                      </td>
                      <td className="py-2 px-4 text-center align-top text-[11px] border border-black">{item.quantity}</td>
                      <td className="py-2 px-4 text-right align-top text-[11px] border border-black">{formatCurrency(item.unitPrice)}</td>
                      {data.columnSettings?.showPrice2 && (
                        <td className="py-2 px-4 text-right align-top text-[11px] border border-black">{formatCurrency(item.unitPrice2 || 0)}</td>
                      )}
                      <td className="py-2 px-6 text-right align-top text-[11px] border border-black">{formatCurrency(item.amount !== undefined ? item.amount : ((item.quantity || 0) * (item.unitPrice || 0) + (data.columnSettings?.showPrice2 ? (item.quantity || 0) * (item.unitPrice2 || 0) : 0)))}</td>
                    </tr>
                  ))
                )}
                
                {data.paymentTerms && (
                  <tr className="h-6">
                    <td className="border border-black"></td>
                    <td className="py-2 px-6 border text-stone-800 align-top break-words text-[11px] border-black">
                      <div className="whitespace-pre-wrap py-2">{data.paymentTerms}</div>
                    </td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    {data.columnSettings?.showPrice2 && <td className="border border-black"></td>}
                    <td className="border border-black"></td>
                  </tr>
                )}

                {data.notes && (
                  <tr className="h-6">
                    <td className="border border-black"></td>
                    <td className="py-2 px-6 border text-stone-800 align-top break-words text-[11px] border-black">
                      <div className="font-bold italic underline mb-1">หมายเหตุ:</div>
                      <div className="whitespace-pre-wrap leading-relaxed pb-2">{data.notes}</div>
                    </td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    {data.columnSettings?.showPrice2 && <td className="border border-black"></td>}
                    <td className="border border-black"></td>
                  </tr>
                )}

                {/* Fill empty rows visually */}
                {Array.from({ length: Math.max(0, 5 - data.items.length) }).map((_, i) => (
                  <tr key={`empty-${i}`} className="h-8">
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    <td className="border border-black"></td>
                    {data.columnSettings?.showPrice2 && <td className="border border-black"></td>}
                    <td className="border border-black"></td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="font-semibold text-[11px] bg-white">
                <tr>
                   <td colSpan={2} rowSpan={2 + (data.discount > 0 ? 1 : 0) + (data.includeTax ? 1 : 0)} className="border border-black px-4 align-middle bg-white">
                      <div className="flex items-center gap-8">
                         <span className="font-bold">ตัวอักษร.</span>
                         <span className="flex-1 text-center font-normal">({THBText(grandTotal)})</span>
                      </div>
                   </td>
                   <td colSpan={data.columnSettings?.showPrice2 ? 3 : 2} className="border border-black px-4 py-2 bg-white">
                       รวมเงิน
                   </td>
                   <td className={`border border-black px-6 py-2 text-right font-normal bg-white text-black`}>
                       {formatCurrency(subTotal)}
                   </td>
                </tr>
                {data.discount > 0 && (
                  <tr>
                     <td colSpan={data.columnSettings?.showPrice2 ? 3 : 2} className="border border-black px-4 py-2 bg-white">
                         ส่วนลด
                     </td>
                     <td className={`border border-black px-6 py-2 text-right font-normal bg-white text-black`}>
                         -{formatCurrency(data.discount)}
                     </td>
                  </tr>
                )}
                {data.includeTax && (
                  <tr>
                     <td colSpan={data.columnSettings?.showPrice2 ? 3 : 2} className="border border-black px-4 py-2 bg-white">
                         ภาษีมูลค่าเพิ่ม {data.taxRate}%
                     </td>
                     <td className={`border border-black px-6 py-2 text-right font-normal bg-white text-black`}>
                         {formatCurrency(taxAmount)}
                     </td>
                  </tr>
                )}
                <tr>
                   <td colSpan={data.columnSettings?.showPrice2 ? 3 : 2} className="border border-black px-4 py-2 bg-white">
                       จำนวนเงินทั้งสิ้น
                   </td>
                   <td className={`border border-black px-6 py-2 text-right font-bold bg-white text-black`}>
                       {formatCurrency(grandTotal)}
                   </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Signatures */}
          <div className="flex gap-2 text-[11px] print:break-inside-avoid">
            <div className="w-[60%] flex border-2 border-black">
              <div className="w-1/2 flex flex-col p-3 border-r border-black">
                <div className="font-bold mb-4">{data.to.name || ''}</div>
                <div className="mt-auto space-y-4 pt-12">
                  <div className="flex gap-2 items-end">
                    <span className="w-10">ผู้อนุมัติ</span>
                    <span className="flex-1 border-b border-dashed border-black"></span>
                  </div>
                  <div className="flex gap-2 items-end">
                    <span className="w-10">วันที่</span>
                    <span className="flex-1 border-b border-dashed border-black text-transparent focus:text-stone-700">_</span>
                  </div>
                </div>
              </div>
              <div className="w-1/2 flex flex-col p-3">
                <div className="mt-auto space-y-4 pt-12">
                  <div className="flex gap-2 items-end">
                    <span className="w-16">ผู้เสนอราคา</span>
                    <span className="flex-1 text-center border-b border-dashed border-black">บุษยาพร สามารถ</span>
                  </div>
                  <div className="flex gap-2 items-end">
                    <span className="w-16">วันที่</span>
                    <span className="flex-1 text-center border-b border-dashed border-black">{formatDate(data.date)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col border-2 border-black p-3 text-center justify-between">
              <div className="font-bold uppercase tracking-wide">{(data.from.name && data.from.name.toLowerCase().includes('wonder') ? 'WONDER SCENT' : data.from.name)}</div>
              <div className="mt-auto w-full px-6 pt-12">
                <div className="border-b border-dashed border-black w-full mb-1.5"></div>
                <div>ผู้มีอำนาจลงนาม</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (isReceipt) {
    return (
      <div className={`text-[12px] text-stone-800 bg-white min-h-[295mm] print:min-h-0 relative flex flex-col justify-between font-medium`} style={{ fontFamily: fontStyle }}>
        <div className="pt-16 pb-12 px-16 flex flex-col flex-1">
          
          <div className="text-center relative mb-12">
             <h1 className="text-2xl font-bold">ใบเสร็จรับเงิน</h1>
             <div className="absolute right-0 top-0 text-left text-[11px] leading-relaxed">
               <div className="grid grid-cols-[max-content_1fr] gap-x-2 gap-y-1">
                 <span className="w-8">เลขที่</span>
                 <span className="min-w-[120px] inline-block">{data.documentNumber}</span>
                 <span className="w-8">วันที่</span>
                 <span className="min-w-[120px] inline-block">{formatDate(data.date)}</span>
               </div>
             </div>
          </div>

          <div className="text-[12px] leading-relaxed mb-6 space-y-4">
            <div className="flex gap-2 items-end">
              <span className="w-[130px] pb-0.5">ชื่อกิจการ</span>
              <span className="flex-1 font-bold border-b border-dashed border-stone-800 text-center pb-0.5">{data.from.name}</span>
              <span className="w-48 text-stone-800 text-right pb-0.5">(ผู้ขายสินค้า/ให้บริการ)</span>
            </div>
            
            <div className="flex gap-2 items-end">
              <span className="w-[130px] pb-0.5">เลขประจำตัวผู้เสียภาษี</span>
              <span className="flex-1 font-bold border-b border-dashed border-stone-800 text-center pb-0.5">{data.from.taxId}</span>
              <span className="w-16 text-center pb-0.5">โทรศัพท์</span>
              <span className="w-48 font-bold border-b border-dashed border-stone-800 text-center pb-0.5">{data.from.phone}</span>
            </div>

            <div className="flex gap-2 items-end">
              <span className="w-[130px] pb-0.5">ที่อยู่</span>
              <span className="flex-1 font-bold border-b border-dashed border-stone-800 pb-0.5 px-8 whitespace-pre-wrap break-words">{data.from.address}</span>
            </div>
            
            <div className="flex gap-2 items-end pt-2">
              <span className="w-[130px] pb-0.5">ได้รับเงินจาก</span>
              <span className="flex-1 font-bold border-b border-dashed border-stone-800 text-center pb-0.5">{data.to.name}</span>
              <span className="w-64 text-stone-800 text-right pb-0.5">(ผู้ซื้อ/ผู้รับบริการ) ดังรายการต่อไปนี้</span>
            </div>
            
            <div className="flex gap-2 items-end">
              <span className="w-[130px] pb-0.5">ที่อยู่</span>
              <span className="flex-1 font-bold border-b border-dashed border-stone-800 pb-0.5 px-8 whitespace-pre-wrap break-words">{data.to.address}</span>
            </div>
          </div>

          {/* Table */}
          <div className="mb-12 flex-1">
            <table className="w-full text-left border-collapse border-2 border-black">
              <thead>
                <tr className={`${c.receiptBg} text-white`}>
                  <th className="py-2 px-3 font-medium text-center w-16 text-[11px] border border-black">ลำดับ</th>
                  <th className="py-2 px-6 font-medium text-[11px] border border-black text-center">รายการ (ชนิด/ชื่อ)</th>
                  <th className="py-2 px-4 text-center font-medium w-20 text-[11px] border border-black">จำนวน</th>
                  <th className="py-2 px-4 text-center font-medium w-28 text-[11px] border border-black">{data.columnSettings?.price1Label || 'ราคา/หน่วย'}</th>
                  {data.columnSettings?.showPrice2 && (
                    <th className="py-2 px-4 text-center font-medium w-28 text-[11px] border border-black">{data.columnSettings?.price2Label || 'ราคา/ปี'}</th>
                  )}
                  <th className="py-2 px-6 text-center font-medium w-32 text-[11px] border border-black">จำนวนเงิน</th>
                </tr>
              </thead>
              <tbody>
                {data.items.length === 0 ? (
                  <tr>
                    <td className={`py-4 px-3 text-center border border-black text-[11px]`}>1</td>
                    <td className={`py-4 px-6 border border-black text-[11px]`}></td>
                    <td className={`py-4 px-4 text-center border border-black text-[11px]`}></td>
                    <td className={`py-4 px-4 text-center border border-black text-[11px]`}></td>
                    {data.columnSettings?.showPrice2 && <td className={`py-4 px-4 text-center border border-black text-[11px]`}></td>}
                    <td className={`py-4 px-6 text-center border border-black text-[11px]`}></td>
                  </tr>
                ) : (
                  data.items.map((item, index) => (
                    <tr key={item.id} className="h-6">
                      <td className={`py-2 px-3 text-center border border-black text-[11px] align-top`}>{index + 1}</td>
                      <td className={`py-2 px-6 border text-stone-800 align-top break-words text-[11px] border-black`}>
                        <div className="whitespace-pre-wrap">{item.description || ''}</div>
                      </td>
                      <td className={`py-2 px-4 text-center align-top text-[11px] border border-black`}>{item.quantity}</td>
                      <td className={`py-2 px-4 text-right align-top text-[11px] border border-black`}>{formatCurrency(item.unitPrice)}</td>
                      {data.columnSettings?.showPrice2 && (
                        <td className={`py-2 px-4 text-right align-top text-[11px] border border-black`}>{formatCurrency(item.unitPrice2 || 0)}</td>
                      )}
                      <td className={`py-2 px-6 text-right align-top text-[11px] border border-black`}>
                        {formatCurrency(item.amount !== undefined ? item.amount : ((item.quantity || 0) * (item.unitPrice || 0) + (data.columnSettings?.showPrice2 ? (item.quantity || 0) * (item.unitPrice2 || 0) : 0)))}
                      </td>
                    </tr>
                  ))
                )}
                {/* Fill empty rows to make the table look full if there are few items */}
                {data.items.length > 0 && Array.from({ length: Math.max(0, 15 - data.items.length) }).map((_, i) => (
                   <tr key={`empty-${i}`} className="h-6">
                      <td className="border border-black"></td>
                      <td className="border border-black"></td>
                      <td className="border border-black"></td>
                      <td className="border border-black"></td>
                      {data.columnSettings?.showPrice2 && <td className="border border-black"></td>}
                      <td className="border border-black"></td>
                   </tr>
                ))}
              </tbody>
              <tfoot className="font-semibold text-[11px] bg-white">
                {(data.discount > 0 || data.includeTax) ? (
                  <>
                    <tr>
                       <td colSpan={2} rowSpan={2 + (data.discount > 0 ? 1 : 0) + (data.includeTax ? 1 : 0)} className={`border border-black px-4 align-middle bg-white`}>
                           <div className="flex items-center gap-8">
                              <span className="font-bold">ตัวอักษร</span>
                              <span className="flex-1 text-center font-normal">({THBText(grandTotal)})</span>
                           </div>
                       </td>
                       <td colSpan={data.columnSettings?.showPrice2 ? 3 : 2} className="border border-black p-2 text-center bg-white">
                           รวมเงิน
                       </td>
                       <td className={`border border-black px-6 py-2 text-right bg-white text-black`}>
                           {formatCurrency(subTotal)}
                       </td>
                    </tr>
                    {data.discount > 0 && (
                      <tr>
                         <td colSpan={data.columnSettings?.showPrice2 ? 3 : 2} className="border border-black p-2 text-center bg-white">
                             ส่วนลด
                         </td>
                         <td className={`border border-black px-6 py-2 text-right bg-white text-black`}>
                             -{formatCurrency(data.discount)}
                         </td>
                      </tr>
                    )}
                    {data.includeTax && (
                      <tr>
                         <td colSpan={data.columnSettings?.showPrice2 ? 3 : 2} className="border border-black p-2 text-center bg-white">
                             ภาษีมูลค่าเพิ่ม {data.taxRate}%
                         </td>
                         <td className={`border border-black px-6 py-2 text-right bg-white text-black`}>
                             {formatCurrency(taxAmount)}
                         </td>
                      </tr>
                    )}
                    <tr>
                       <td colSpan={data.columnSettings?.showPrice2 ? 3 : 2} className="border border-black p-2 text-center bg-white">
                          จำนวนเงินทั้งสิ้น
                       </td>
                       <td className={`border border-black px-6 py-2 text-right text-black font-bold ${c.secBg}`}>
                          {formatCurrency(grandTotal)}
                       </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                     <td colSpan={2} className={`border border-black p-2 text-center ${c.secBg}`}>
                         ( {THBText(grandTotal)} )
                     </td>
                     <td colSpan={data.columnSettings?.showPrice2 ? 3 : 2} className="border border-black p-2 text-center bg-white">
                        รวมทั้งสิ้น
                     </td>
                     <td className={`border border-black px-6 py-2 text-right text-black ${c.secBg}`}>
                        {formatCurrency(grandTotal)}
                     </td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>

          <div className="flex justify-end mt-16 pb-12 print:break-inside-avoid">
            <div className="text-center text-[11px]">
              <div className="flex items-end gap-2 mb-1">
                <span>ลงชื่อ</span>
                <span className="w-64 border-b border-black inline-block text-center text-transparent focus:text-stone-700">_</span>
              </div>
              <div className="mb-2 w-64 ml-8 text-center">( บุษยาพร สามารถ )</div>
              <div className="pr-4">ผู้รับเงิน</div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className={`text-[12px] text-stone-800 bg-white min-h-[295mm] print:min-h-0 relative flex flex-col justify-between font-medium`} style={{ fontFamily: fontStyle }}>
      
      <div className="pt-8 pb-8 px-12 flex flex-col flex-1">
        
        {/* Header: Logo and Title */}
        <div className="flex justify-between items-start mb-4">
          <div>
            {data.from.logo ? (
              <img src={data.from.logo} alt="Company Logo" className="h-24 object-contain object-left" />
            ) : (data.from.name.replace(/\s/g, '').toLowerCase().includes('วอนเดอร์เซ้นท์') || data.from.name.replace(/\s/g, '').toLowerCase().includes('wonderscent')) ? (
              <img src="/33.png" alt="Company Logo" className="h-24 object-contain object-left" />
            ) : (
              <h1 className={`text-2xl font-bold ${c.text}`}>{data.from.name}</h1>
            )}
          </div>
          <div className="text-right flex items-baseline gap-2 pt-4">
            <h1 className={`text-5xl font-bold ${c.text} tracking-tighter lowercase`}>{title.en}</h1>
            <span className={`text-2xl font-bold ${c.text}`}>/ {title.th}</span>
          </div>
        </div>

        {/* Separator */}
        <div className={`w-full border-b border-stone-800 mb-4`}></div>

        {/* Info Grid */}
        <div className="flex justify-between items-start mb-6 text-[11px] leading-relaxed">
          {/* Left: Customer Info */}
          <div className="w-[60%] pr-8">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className={`w-[88px] pb-1 ${labelColor} whitespace-nowrap`}>ชื่อลูกค้า</td>
                  <td className={`pb-1 ${valueColor} font-bold`}>{data.to.name || ''}</td>
                  {data.to.branch && (
                    <>
                      <td className={`w-12 pb-1 ${labelColor} pl-2`}>สาขา</td>
                      <td className={`pb-1 ${valueColor} font-bold`}>{data.to.branch}</td>
                    </>
                  )}
                </tr>
                <tr>
                  <td className={`align-top pb-1 ${labelColor}`}>ที่อยู่</td>
                  <td colSpan={3} className={`pb-1 ${valueColor} whitespace-pre-wrap`}>{data.to.address || ''}</td>
                </tr>
                <tr>
                  <td className={`pb-1 ${labelColor} whitespace-nowrap`}>เลขผู้เสียภาษี</td>
                  <td className={`pb-1 ${valueColor}`}>{data.to.taxId || ''}</td>
                  <td className={`pb-1 ${labelColor} pl-2 whitespace-nowrap`}>เบอร์โทรศัพท์</td>
                  <td className={`pb-1 ${valueColor}`}>{data.to.phone || ''}</td>
                </tr>
                {data.to.contactPerson && (
                  <tr>
                    <td className={`pb-1 ${labelColor}`}>ผู้ติดต่อ</td>
                    <td colSpan={3} className={`pb-1 ${valueColor}`}>{data.to.contactPerson}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Right: Document Info */}
          <div className="w-[40%]">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className={`w-[60px] pb-1 ${labelColor} whitespace-nowrap`}>เลขที่</td>
                  <td className={`pb-1 ${valueColor} font-bold`}>{data.documentNumber || ''}</td>
                </tr>
                <tr>
                  <td className={`pb-1 ${labelColor}`}>วันที่</td>
                  <td className={`pb-1 ${valueColor} font-bold`}>{formatDate(data.date)}</td>
                </tr>
                {data.dueDate && (
                  <tr>
                    <td className={`pb-1 ${labelColor}`}>{data.type === 'QUOTATION' ? 'ยืนยันราคาถึง' : 'ครบกำหนด'}</td>
                    <td className={`pb-1 ${valueColor} font-bold`}>{formatDate(data.dueDate)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sender Info Grid */}
        <div className="flex justify-between items-start mb-4 text-[11px] leading-relaxed">
          <div className="w-1/2 pr-4">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className={`w-[88px] pb-1 ${labelColor} whitespace-nowrap`}>ผู้ออก</td>
                  <td className={`pb-1 ${valueColor} font-bold`}>{data.from.name || ''}</td>
                </tr>
                <tr>
                  <td className={`align-top pb-1 ${labelColor} whitespace-nowrap`}>ที่อยู่</td>
                  <td className={`pb-1 ${valueColor} whitespace-pre-wrap`}>{data.from.address || ''}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-1/2">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className={`w-[130px] pb-1 ${labelColor} whitespace-nowrap`}>เลขประจำตัวผู้เสียภาษี</td>
                  <td className={`pb-1 ${valueColor} font-bold`}>{data.from.taxId || ''}</td>
                </tr>
                <tr>
                  <td className={`pb-1 ${labelColor} whitespace-nowrap w-[60px]`}>เบอร์โทร</td>
                  <td className={`pb-1 ${valueColor} font-bold`}>{data.from.phone || ''}</td>
                </tr>
                <tr>
                  <td className={`pb-1 ${labelColor} whitespace-nowrap w-[60px]`}>อีเมล์</td>
                  <td className={`pb-1 ${valueColor} font-bold`}>{data.from.email || ''}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8 flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${c.bg} text-white`}>
                <th className="py-2.5 px-3 font-medium text-center w-16 text-[11px]">ลำดับ</th>
                <th className="py-2.5 px-6 font-medium text-[11px]">รายการสินค้า</th>
                <th className="py-2.5 px-4 text-center font-medium w-24 text-[11px]">จำนวน</th>
                <th className="py-2.5 px-4 text-center font-medium w-28 text-[11px]">{data.columnSettings?.price1Label || 'ราคา/หน่วย'}</th>
                {data.columnSettings?.showPrice2 && (
                  <th className="py-2.5 px-4 text-center font-medium w-28 text-[11px]">{data.columnSettings?.price2Label || 'ราคา/ปี'}</th>
                )}
                <th className="py-2.5 px-6 text-center font-medium w-32 text-[11px]">{data.columnSettings?.amountLabel || 'ราคารวม'}</th>
              </tr>
            </thead>
            <tbody>
              {data.items.length === 0 ? (
                 <tr>
                   <td className={`py-4 px-3 text-center ${valueColor} text-[11px]`}>1</td>
                   <td className={`py-4 px-6 ${valueColor} text-[11px]`}></td>
                   <td className={`py-4 px-4 text-center ${valueColor} text-[11px]`}></td>
                   <td className={`py-4 px-4 text-center ${valueColor} text-[11px]`}></td>
                   {data.columnSettings?.showPrice2 && (
                     <td className={`py-4 px-4 text-center ${valueColor} text-[11px]`}></td>
                   )}
                   <td className={`py-4 px-6 text-center ${valueColor} text-[11px]`}></td>
                 </tr>
              ) : (
                data.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className={`py-3 px-3 text-center ${valueColor} text-[11px] align-top`}>{index + 1}</td>
                    <td className={`py-3 px-6 font-medium ${valueColor} leading-relaxed align-top break-words text-[11px]`}>
                      <div className="whitespace-pre-wrap">{item.description || ''}</div>
                    </td>
                    <td className={`py-3 px-4 text-center ${valueColor} align-top text-[11px]`}>{item.quantity}</td>
                    <td className={`py-3 px-4 text-center ${valueColor} align-top text-[11px]`}>{formatCurrency(item.unitPrice)}</td>
                    {data.columnSettings?.showPrice2 && (
                      <td className={`py-3 px-4 text-center ${valueColor} align-top text-[11px]`}>{formatCurrency(item.unitPrice2 || 0)}</td>
                    )}
                    <td className={`py-3 px-6 text-center ${valueColor} align-top text-[11px]`}>
                      {formatCurrency(item.amount !== undefined ? item.amount : ((item.quantity || 0) * (item.unitPrice || 0) + (data.columnSettings?.showPrice2 ? (item.quantity || 0) * (item.unitPrice2 || 0) : 0)))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totals & Notes Section */}
        <div className="mt-auto print:mt-0 print:break-inside-avoid">
          {/* Thin border line above summary */}
          <div className="w-full border-t border-stone-800 mb-4"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div className={`w-1/2 ${labelColor} font-bold text-[11px]`}>
              หมายเหตุ
            </div>
            <div className="w-1/2 flex flex-col items-end gap-2 text-[11px]">
               <div className="flex justify-between w-64 px-6">
                 <span className={labelColor}>ราคารวม</span>
                 <span className={valueColor}>{formatCurrency(subTotal)}</span>
               </div>
               {data.discount > 0 && (
                 <div className="flex justify-between w-64 px-6">
                   <span className={labelColor}>ส่วนลด</span>
                   <span className={valueColor}>-{formatCurrency(data.discount)}</span>
                 </div>
               )}
               {data.includeTax && (
                 <div className="flex justify-between w-64 px-6">
                   <span className={labelColor}>ภาษีมูลค่าเพิ่ม {data.taxRate}%</span>
                   <span className={valueColor}>{formatCurrency(taxAmount)}</span>
                 </div>
               )}
            </div>
          </div>

          {/* Thick and thin border lines */}
          <div className="w-full border-t-[3px] border-stone-800 mb-0.5"></div>
          <div className="w-full border-t border-stone-800 mb-3"></div>

          <div className="flex justify-between items-start mb-2">
            <div className={`font-bold text-[13px] ${valueColor}`}>
              จำนวนเงินรวมทั้งสิ้น
            </div>
            <div className="text-right">
              <div className="font-bold text-[15px] text-stone-900 mb-1 leading-none">{formatCurrency(grandTotal)}</div>
              <div className={`text-[11px] ${labelColor} leading-none`}>( {THBText(grandTotal)} )</div>
            </div>
          </div>

          <div className="w-full border-t-[3px] border-stone-800 mt-3 mb-8"></div>

          {/* Footer details: Payment and Signatures */}
          <div className="flex justify-between items-start text-[11px]">
            <div className="w-1/2 pr-4 space-y-2">
              {data.paymentTerms && (
                <>
                  <div className={`font-bold ${valueColor}`}>ช่องทางการชำระเงิน</div>
                  <div className={`whitespace-pre-line leading-relaxed ${valueColor}`}>{data.paymentTerms}</div>
                </>
              )}
            </div>
            <div className="w-1/2 flex justify-between px-4">
              {/* Signature 1 */}
              <div className="flex flex-col items-center">
                <div className={`w-40 border-b border-stone-400 border-dashed mb-2 text-center pb-1 ${labelColor}`}>
                  {data.type === 'QUOTATION' ? 'ผู้อนุมัติ' : 'ผู้อนุมัติ'}
                </div>
                <div className={`text-center ${labelColor}`}>
                  (บุษยาพร สามารถ)
                </div>
                <div className={`mt-4 flex gap-4 ${labelColor}`}>
                  <span>วันที่</span>
                  <span className="w-24 border-b border-stone-300 border-dashed inline-block text-center">{formatDate(data.date)}</span>
                </div>
              </div>
              
              {/* Signature 2 */}
              <div className="flex flex-col items-center">
                <div className={`w-40 border-b border-stone-400 border-dashed mb-2 text-center pb-1 ${labelColor}`}>
                  {data.type === 'QUOTATION' ? 'ผู้รับใบเสนอราคา' : isInvoice ? 'ผู้รับใบแจ้งหนี้' : 'ผู้รับใบเสร็จรับเงิน'}
                </div>
                <div className={`text-center ${labelColor} w-48 break-words`}>
                  {data.to.name ? `(${data.to.name})` : '(                          )'}
                </div>
                <div className={`mt-4 flex gap-4 ${labelColor}`}>
                  <span>วันที่</span>
                  <span className="w-24 border-b border-stone-300 border-dashed inline-block text-center text-transparent focus:text-stone-700">_</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
