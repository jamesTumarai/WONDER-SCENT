import { DocumentData, DocumentType, LineItem } from '../types';
import { Plus, Trash2, FileText, FileSpreadsheet, Receipt, Building2, User } from 'lucide-react';
import ExpandableField from './ExpandableField';

interface Props {
  data: DocumentData;
  onChange: (data: DocumentData) => void;
}

export default function DocumentForm({ data, onChange }: Props) {
  const updateField = (field: keyof DocumentData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateEntity = (entity: 'from' | 'to', field: string, value: string) => {
    onChange({
      ...data,
      [entity]: { ...data[entity], [field]: value },
    });
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      unitPrice: 0,
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    onChange({
      ...data,
      items: data.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    });
  };

  const removeItem = (id: string) => {
    onChange({
      ...data,
      items: data.items.filter((item) => item.id !== id),
    });
  };

  const docTypes: { id: DocumentType; label: string; en: string; icon: any }[] = [
    { id: 'QUOTATION', label: 'ใบเสนอราคา', en: 'Quotation', icon: FileText },
    { id: 'INVOICE', label: 'ใบแจ้งหนี้', en: 'Invoice', icon: FileSpreadsheet },
    { id: 'RECEIPT', label: 'ใบเสร็จรับเงิน', en: 'Receipt', icon: Receipt },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Types Selection */}
      <section>
        <h3 className="text-sm font-bold text-stone-700 mb-4 tracking-wide">ประเภทเอกสาร</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {docTypes.map(type => {
            const Icon = type.icon;
            const isActive = data.type === type.id;
            return (
              <button
                key={type.id}
                onClick={() => updateField('type', type.id)}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-200 active:scale-95
                  ${isActive 
                    ? 'border-leaf-400 bg-leaf-50 text-leaf-700 shadow-[0_0_0_1px_rgba(124,131,99,0.2)]' 
                    : 'border-stone-200 hover:border-stone-300 text-stone-600 hover:bg-white bg-sand-50'
                  }`}
              >
                <Icon size={24} className={isActive ? "text-leaf-600" : "text-stone-400"} strokeWidth={1.5} />
                <div className="text-center">
                  <p className="font-semibold text-sm">{type.label}</p>
                  <p className={`text-[10px] ${isActive ? 'text-leaf-600' : 'text-stone-400'}`}>{type.en}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Setting Theme */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-stone-700 pb-2 border-b border-stone-200 flex items-center justify-between">
          <span>รูปแบบและการแสดงผล</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-2 uppercase tracking-wider">สีหลักของเลย์เอาต์</label>
            <div className="flex gap-2">
              {[
                { id: 'stone', class: 'bg-[#703030]' },
                { id: 'slate', class: 'bg-slate-700' },
                { id: 'zinc', class: 'bg-zinc-700' },
                { id: 'leaf', class: 'bg-emerald-700' },
                { id: 'clay', class: 'bg-amber-700' },
                { id: 'blue', class: 'bg-blue-700' },
              ].map(theme => (
                <button
                  key={theme.id}
                  onClick={() => updateField('themeColor', theme.id)}
                  className={`w-8 h-8 rounded-full ${theme.class} border-2 ${data.themeColor === theme.id || (!data.themeColor && theme.id === 'stone') ? 'border-white outline outline-2 outline-stone-400' : 'border-transparent'} transition-all duration-200 active:scale-90`}
                  title={theme.id}
                  aria-label={`Select ${theme.id} color`}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-2 uppercase tracking-wider">ฟอนต์เอกสาร</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'sans', label: 'Kanit' },
                { id: 'prompt', label: 'Prompt' },
                { id: 'sarabun', label: 'Sarabun' },
              ].map(font => (
                <button
                  key={font.id}
                  onClick={() => updateField('fontFamily', font.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border ${data.fontFamily === font.id || (!data.fontFamily && font.id === 'sans') ? 'border-leaf-400 bg-leaf-50 text-leaf-700' : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'} transition-all duration-200 active:scale-95`}
                  style={{ fontFamily: font.id === 'sans' ? 'sans-serif' : `"${font.id === 'prompt' ? 'Prompt' : 'Sarabun'}", sans-serif` }}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doc Specific Info */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-stone-700 pb-2 border-b border-stone-200 flex items-center justify-between">
          <span>รายละเอียดเอกสาร</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-[11px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider">เลขที่เอกสาร <span className="text-clay-500">*</span></label>
            <ExpandableField 
              as="input"
              type="text" 
              value={data.documentNumber}
              onChange={(e) => updateField('documentNumber', e.target.value)}
              className="w-full min-w-0 border-stone-200 rounded-xl shadow-sm focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 p-3 border outline-none transition-all text-sm font-medium bg-white"
              placeholder="เช่น INV-2026-001"
            />
          </div>
          <div className="min-w-0">
            <label className="block text-[11px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider">วันที่ออกเอกสาร</label>
            <input 
              type="date" 
              value={data.date}
              onChange={(e) => updateField('date', e.target.value)}
              className="w-full min-w-0 border-stone-200 rounded-xl shadow-sm focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 p-3 border outline-none transition-all text-sm text-stone-700 bg-white"
            />
          </div>
          <div className="min-w-0">
            <label className="block text-[11px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider">
              {data.type === 'QUOTATION' ? 'ยืนยันราคาถึง' : 'วันครบกำหนด'}
            </label>
            <input 
              type="date" 
              value={data.dueDate}
              onChange={(e) => updateField('dueDate', e.target.value)}
              className="w-full min-w-0 border-stone-200 rounded-xl shadow-sm focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 p-3 border outline-none transition-all text-sm text-stone-700 bg-white"
            />
          </div>
        </div>
      </section>

      {/* From Info */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-stone-700 pb-2 border-b border-stone-200 flex items-center gap-2">
          <Building2 size={18} className="text-clay-500" />
          ข้อมูลผู้ออกเอกสาร (ผู้ขาย)
        </h3>
        <div className="space-y-3">
          <ExpandableField as="input" placeholder="ชื่อบริษัท / ชื่อผู้ส่ง" value={data.from.name} onChange={(e) => updateEntity('from', 'name', e.target.value)} className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border outline-none text-sm font-medium placeholder:text-stone-400 placeholder:font-normal transition-all bg-white" />
          <ExpandableField label="ที่อยู่บริษัท" placeholder="ที่อยู่บริษัท" value={data.from.address} onChange={(e) => updateEntity('from', 'address', e.target.value)} className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border outline-none text-sm placeholder:text-stone-400 resize-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-[60px] transition-all bg-white" rows={2} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             <ExpandableField as="input" placeholder="เลขประจำตัวผู้เสียภาษี" value={data.from.taxId} onChange={(e) => updateEntity('from', 'taxId', e.target.value)} className="w-full min-w-0 border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border outline-none text-sm placeholder:text-stone-400 transition-all bg-white" />
             <ExpandableField as="input" placeholder="สาขา (เช่น สำนักงานใหญ่)" value={data.from.branch || ''} onChange={(e) => updateEntity('from', 'branch', e.target.value)} className="w-full min-w-0 border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border outline-none text-sm placeholder:text-stone-400 transition-all bg-white" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ExpandableField as="input" placeholder="เบอร์โทรศัพท์" value={data.from.phone} onChange={(e) => updateEntity('from', 'phone', e.target.value)} className="w-full min-w-0 border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border outline-none text-sm placeholder:text-stone-400 transition-all bg-white" />
            <ExpandableField as="input" placeholder="อีเมล" value={data.from.email} onChange={(e) => updateEntity('from', 'email', e.target.value)} className="w-full min-w-0 border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border outline-none text-sm placeholder:text-stone-400 transition-all bg-white" />
          </div>

          <div className="pt-2">
            <label className="block text-[11px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider ml-1">โลโก้บริษัท (จะแสดงในส่วนหัวเอกสาร)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    updateEntity('from', 'logo', reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-leaf-50 file:text-leaf-700 hover:file:bg-leaf-100 transition-colors file:cursor-pointer"
            />
            {data.from.logo && (
              <div className="mt-3 flex items-center gap-3 bg-stone-50 p-2 rounded-xl border border-stone-100">
                <div className="w-20 h-20 rounded-lg bg-white overflow-hidden shadow-sm flex items-center justify-center p-1 border border-stone-100">
                  <img src={data.from.logo} alt="Logo preview" className="max-w-full max-h-full object-contain rounded-md" />
                </div>
                <button 
                  onClick={() => updateEntity('from', 'logo', '')}
                  className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95"
                >
                  ลบรูปนี้
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* To Info */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-stone-700 pb-2 border-b border-stone-200 flex items-center gap-2">
          <User size={18} className="text-clay-500" />
          ข้อมูลลูกค้า (ผู้ซื้อ)
        </h3>
        <div className="space-y-3">
          <ExpandableField as="input" placeholder="ชื่อลูกค้า / ชื่อบริษัท" value={data.to.name} onChange={(e) => updateEntity('to', 'name', e.target.value)} className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border outline-none text-sm font-medium placeholder:text-stone-400 placeholder:font-normal transition-all bg-white" />
          <ExpandableField label="ที่อยู่ลูกค้า" placeholder="ที่อยู่ลูกค้า" value={data.to.address} onChange={(e) => updateEntity('to', 'address', e.target.value)} className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border outline-none text-sm placeholder:text-stone-400 resize-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-[60px] transition-all bg-white" rows={2} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             <ExpandableField as="input" placeholder="เลขประจำตัวผู้เสียภาษี" value={data.to.taxId} onChange={(e) => updateEntity('to', 'taxId', e.target.value)} className="w-full min-w-0 border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border outline-none text-sm placeholder:text-stone-400 transition-all bg-white" />
             <ExpandableField as="input" placeholder="สาขา" value={data.to.branch || ''} onChange={(e) => updateEntity('to', 'branch', e.target.value)} className="w-full min-w-0 border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border outline-none text-sm placeholder:text-stone-400 transition-all bg-white" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ExpandableField as="input" placeholder="เบอร์โทรศัพท์" value={data.to.phone} onChange={(e) => updateEntity('to', 'phone', e.target.value)} className="w-full min-w-0 border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border outline-none text-sm placeholder:text-stone-400 transition-all bg-white" />
            <ExpandableField as="input" placeholder="ผู้ติดต่อ" value={data.to.contactPerson || ''} onChange={(e) => updateEntity('to', 'contactPerson', e.target.value)} className="w-full min-w-0 border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border outline-none text-sm placeholder:text-stone-400 transition-all bg-white" />
          </div>
        </div>
      </section>

      {/* Items */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-stone-700 pb-2 border-b border-stone-200 flex items-center justify-between">
          <span>รายการสินค้า / บริการ</span>
        </h3>
        
        <div className="bg-sand-50 p-4 rounded-2xl border border-stone-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">ตั้งค่าคอลัมน์ราคา</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={data.columnSettings?.showPrice2 || false} onChange={e => {
                const settings = data.columnSettings || { price1Label: 'ราคา/หน่วย', showPrice2: false, price2Label: 'ราคา/ปี' };
                updateField('columnSettings', { ...settings, showPrice2: e.target.checked });
              }} className="rounded border-stone-300 text-leaf-500 focus:ring-leaf-500 w-3.5 h-3.5 cursor-pointer" />
              <span className="text-[11px] font-semibold text-stone-600">แสดง 2 ราคาแบบแยกคอลัมน์</span>
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-stone-400 mb-1 uppercase tracking-wider ml-1">ชื่อคอลัมน์ราคา 1</label>
              <input 
                 type="text" 
                 value={data.columnSettings?.price1Label || 'ราคา/หน่วย'} 
                 onChange={e => {
                   const settings = data.columnSettings || { price1Label: 'ราคา/หน่วย', showPrice2: false, price2Label: 'ราคา/ปี', amountLabel: 'จำนวนเงิน' };
                   updateField('columnSettings', { ...settings, price1Label: e.target.value });
                 }}
                 className="w-full min-w-0 border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border outline-none text-sm bg-white" placeholder="เช่น ราคา/เดือน" />
            </div>
            {data.columnSettings?.showPrice2 && (
              <div>
                <label className="block text-[10px] font-bold text-stone-400 mb-1 uppercase tracking-wider ml-1">ชื่อคอลัมน์ราคา 2</label>
                <input 
                   type="text" 
                   value={data.columnSettings?.price2Label || 'ราคา/ปี'} 
                   onChange={e => {
                     const settings = data.columnSettings || { price1Label: 'ราคา/หน่วย', showPrice2: true, price2Label: 'ราคา/ปี', amountLabel: 'จำนวนเงิน' };
                     updateField('columnSettings', { ...settings, price2Label: e.target.value });
                   }}
                   className="w-full min-w-0 border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border outline-none text-sm bg-white" placeholder="เช่น ราคา/ปี" />
              </div>
            )}
            <div>
              <label className="block text-[10px] font-bold text-stone-400 mb-1 uppercase tracking-wider ml-1">ชื่อคอลัมน์รวมเงิน</label>
              <input 
                 type="text" 
                 value={data.columnSettings?.amountLabel || 'จำนวนเงิน'} 
                 onChange={e => {
                   const settings = data.columnSettings || { price1Label: 'ราคา/หน่วย', showPrice2: false, price2Label: 'ราคา/ปี', amountLabel: 'จำนวนเงิน' };
                   updateField('columnSettings', { ...settings, amountLabel: e.target.value });
                 }}
                 className="w-full min-w-0 border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border outline-none text-sm bg-white" placeholder="เช่น จำนวนเงิน" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {data.items.map((item, index) => (
            <div key={item.id} className="relative bg-white border border-stone-200 rounded-2xl p-5 shadow-sm group hover:border-leaf-300 transition-all">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] font-bold text-stone-400 tracking-wider uppercase bg-sand-50 px-2 py-1 rounded-md">รายการที่ {index + 1}</span>
                <button onClick={() => removeItem(item.id)} className="text-stone-400 hover:text-clay-500 hover:bg-clay-50 p-1.5 rounded-lg transition-all duration-200 active:scale-90" title="ลบรายการ">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="space-y-3">
                <ExpandableField as="input" 
                  placeholder="รายละเอียดสินค้า/บริการ" 
                  value={item.description} 
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)} 
                  className="w-full border-stone-200 outline-none rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border text-sm transition-all text-stone-800 font-medium" 
                />
                <div className={`grid gap-3 grid-cols-1 ${data.columnSettings?.showPrice2 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 mb-1 uppercase tracking-wider ml-1">จำนวน</label>
                    <input 
                      type="number" 
                      min="1"
                      value={item.quantity === 0 ? '' : item.quantity} 
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))} 
                      className="w-full min-w-0 border-stone-200 outline-none rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border text-sm transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 mb-1 uppercase tracking-wider ml-1 flex justify-between">
                      <span>{data.columnSettings?.price1Label || 'ราคา/หน่วย'}</span>
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={item.unitPrice === 0 ? '' : item.unitPrice} 
                      onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))} 
                      className="w-full min-w-0 border-stone-200 outline-none rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border text-sm transition-all" 
                    />
                  </div>
                  {data.columnSettings?.showPrice2 && (
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 mb-1 uppercase tracking-wider ml-1 flex justify-between">
                        <span>{data.columnSettings?.price2Label || 'ราคา/ปี'}</span>
                      </label>
                      <input 
                        type="number" 
                        min="0"
                        value={item.unitPrice2 === 0 ? '' : (item.unitPrice2 || '')} 
                        onChange={(e) => updateItem(item.id, 'unitPrice2', Number(e.target.value))} 
                        className="w-full min-w-0 border-stone-200 outline-none rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border text-sm transition-all" 
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 mb-1 uppercase tracking-wider ml-1 flex justify-between">
                      <span>{data.columnSettings?.amountLabel || 'จำนวนเงิน'}</span>
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={item.amount !== undefined ? item.amount : ''} 
                      onChange={(e) => updateItem(item.id, 'amount', e.target.value === '' ? undefined : Number(e.target.value))} 
                      placeholder={String((item.quantity || 0) * (item.unitPrice || 0) + (data.columnSettings?.showPrice2 ? (item.quantity || 0) * (item.unitPrice2 || 0) : 0))}
                      className="w-full min-w-0 border-stone-200 outline-none rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border text-sm transition-all" 
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={addItem}
          className="w-full flex items-center justify-center gap-2 mt-2 py-3.5 border-2 border-dashed border-stone-200 rounded-2xl text-stone-500 font-bold hover:bg-white hover:border-leaf-400 hover:text-leaf-600 transition-all duration-200 active:scale-[0.98] text-sm"
        >
          <Plus size={16} />
          เพิ่มรายการใหม่
        </button>
      </section>

      {/* Totals & Notes */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-stone-700 pb-2 border-b border-stone-200 flex items-center justify-between">
          <span>สรุป & หมายเหตุ</span>
        </h3>
        
        <div className="bg-sand-50 p-5 rounded-2xl border border-stone-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-stone-500 mb-1 uppercase tracking-wider ml-1">ส่วนลด (บาท)</label>
              <input 
                type="number" 
                min="0"
                value={data.discount === 0 ? '' : data.discount} 
                onChange={(e) => updateField('discount', Number(e.target.value))} 
                className="w-full border-stone-200 outline-none rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border text-sm bg-white transition-all" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-500 mb-1 uppercase tracking-wider ml-1">ภาษีมูลค่าเพิ่ม (%)</label>
              <input 
                type="number" 
                min="0"
                max="100"
                value={data.taxRate === 0 ? '' : data.taxRate} 
                onChange={(e) => updateField('taxRate', Number(e.target.value))} 
                className="w-full border-stone-200 outline-none rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border text-sm bg-white transition-all" 
              />
            </div>
          </div>
          <label className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-stone-200 cursor-pointer hover:border-leaf-300 transition-colors shadow-sm">
            <input 
              type="checkbox" 
              checked={data.includeTax}
              onChange={(e) => updateField('includeTax', e.target.checked)}
              className="rounded border-stone-300 text-leaf-500 shadow-sm focus:border-leaf-400 focus:ring focus:ring-leaf-500 w-4 h-4 cursor-pointer accent-leaf-500 transition-all"
            />
            <span className="text-sm font-semibold text-stone-700 select-none">
              รวมภาษีมูลค่าเพิ่ม 7% ลงในยอดรวม
            </span>
          </label>
        </div>

        <div className="mt-4">
          <label className="block text-[11px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider ml-1">ช่องทางการชำระเงิน</label>
          <ExpandableField 
            label="ช่องทางการชำระเงิน"
            rows={3}
            value={data.paymentTerms || ''}
            onChange={(e) => updateField('paymentTerms', e.target.value)}
            className="w-full border-stone-200 outline-none rounded-2xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-4 border text-sm resize-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-[70px] transition-all text-stone-700 bg-white" 
            placeholder="เช่น โอนเงินเข้าบัญชีธนาคาร..."
          />
        </div>
        
        <div className="mt-4">
          <label className="block text-[11px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider ml-1">หมายเหตุ</label>
          <ExpandableField 
            label="หมายเหตุ"
            rows={3}
            value={data.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            className="w-full border-stone-200 outline-none rounded-2xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-4 border text-sm resize-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-[70px] transition-all text-stone-700 bg-white" 
            placeholder="ข้อมูลเพิ่มเติมอื่นๆ (ถ้ามี)"
          />
        </div>

        <div className="mt-4">
          <label className="block text-[11px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider ml-1">รายละเอียดเพิ่มเติมใต้ตาราง</label>
          <ExpandableField 
            label="รายละเอียดเพิ่มเติมใต้ตาราง"
            rows={2}
            value={data.additionalDetails || ''}
            onChange={(e) => updateField('additionalDetails', e.target.value)}
            className="w-full border-stone-200 outline-none rounded-2xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-4 border text-sm resize-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-[50px] transition-all text-stone-700 bg-white" 
            placeholder="รายละเอียดเพิ่มเติม ......................"
          />
        </div>
      </section>
    </div>
  );
}
