import { DocumentData, DocumentType, LineItem } from '../types';
import { Plus, Trash2, FileText, FileSpreadsheet, Receipt, Building2, User } from 'lucide-react';

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
        <div className="grid grid-cols-2 gap-3">
          {docTypes.map(type => {
            const Icon = type.icon;
            const isActive = data.type === type.id;
            return (
              <button
                key={type.id}
                onClick={() => updateField('type', type.id)}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-200
                  ${isActive 
                    ? 'border-leaf-400 bg-leaf-50 text-leaf-700 shadow-[0_0_0_1px_rgba(124,131,99,0.2)]' 
                    : 'border-stone-200 hover:border-stone-300 text-stone-600 hover:bg-white bg-sand-50/50'
                  }`}
              >
                <Icon size={24} className={isActive ? "text-leaf-600" : "text-stone-400"} strokeWidth={1.5} />
                <div className="text-center">
                  <p className="font-semibold text-sm">{type.label}</p>
                  <p className={`text-[10px] ${isActive ? 'text-leaf-600/70' : 'text-stone-400'}`}>{type.en}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Doc Specific Info */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-stone-700 pb-2 border-b border-stone-200/60 flex items-center justify-between">
          <span>รายละเอียดเอกสาร</span>
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-[11px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider">เลขที่เอกสาร <span className="text-clay-500">*</span></label>
            <input 
              type="text" 
              value={data.documentNumber}
              onChange={(e) => updateField('documentNumber', e.target.value)}
              className="w-full border-stone-200 rounded-xl shadow-sm focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 p-3 border outline-none transition-all text-sm font-medium bg-white"
              placeholder="เช่น INV-2026-001"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider">วันที่ออกเอกสาร</label>
            <input 
              type="date" 
              value={data.date}
              onChange={(e) => updateField('date', e.target.value)}
              className="w-full border-stone-200 rounded-xl shadow-sm focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 p-3 border outline-none transition-all text-sm text-stone-700 bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider">
              {data.type === 'QUOTATION' ? 'ยืนยันราคาถึง' : 'วันครบกำหนด'}
            </label>
            <input 
              type="date" 
              value={data.dueDate}
              onChange={(e) => updateField('dueDate', e.target.value)}
              className="w-full border-stone-200 rounded-xl shadow-sm focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 p-3 border outline-none transition-all text-sm text-stone-700 bg-white"
            />
          </div>
        </div>
      </section>

      {/* From Info */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-stone-700 pb-2 border-b border-stone-200/60 flex items-center gap-2">
          <Building2 size={18} className="text-clay-500" />
          ข้อมูลผู้ออกเอกสาร (ผู้ขาย)
        </h3>
        <div className="space-y-3">
          <input placeholder="ชื่อบริษัท / ชื่อผู้ส่ง" value={data.from.name} onChange={(e) => updateEntity('from', 'name', e.target.value)} className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-3 border outline-none text-sm font-medium placeholder:text-stone-400 placeholder:font-normal transition-all bg-white" />
          <textarea placeholder="ที่อยู่บริษัท" value={data.from.address} onChange={(e) => updateEntity('from', 'address', e.target.value)} className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-3 border outline-none text-sm placeholder:text-stone-400 resize-y min-h-[60px] transition-all bg-white" rows={2} />
          
          <div className="grid grid-cols-2 gap-3">
             <input placeholder="เลขประจำตัวผู้เสียภาษี" value={data.from.taxId} onChange={(e) => updateEntity('from', 'taxId', e.target.value)} className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-3 border outline-none text-sm placeholder:text-stone-400 transition-all bg-white" />
             <input placeholder="สาขา (เช่น สำนักงานใหญ่)" value={data.from.branch || ''} onChange={(e) => updateEntity('from', 'branch', e.target.value)} className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-3 border outline-none text-sm placeholder:text-stone-400 transition-all bg-white" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="เบอร์โทรศัพท์" value={data.from.phone} onChange={(e) => updateEntity('from', 'phone', e.target.value)} className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-3 border outline-none text-sm placeholder:text-stone-400 transition-all bg-white" />
            <input placeholder="อีเมล" value={data.from.email} onChange={(e) => updateEntity('from', 'email', e.target.value)} className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-3 border outline-none text-sm placeholder:text-stone-400 transition-all bg-white" />
          </div>
        </div>
      </section>

      {/* To Info */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-stone-700 pb-2 border-b border-stone-200/60 flex items-center gap-2">
          <User size={18} className="text-clay-500" />
          ข้อมูลลูกค้า (ผู้ซื้อ)
        </h3>
        <div className="space-y-3">
          <input placeholder="ชื่อลูกค้า / ชื่อบริษัท" value={data.to.name} onChange={(e) => updateEntity('to', 'name', e.target.value)} className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-3 border outline-none text-sm font-medium placeholder:text-stone-400 placeholder:font-normal transition-all bg-white" />
          <textarea placeholder="ที่อยู่ลูกค้า" value={data.to.address} onChange={(e) => updateEntity('to', 'address', e.target.value)} className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-3 border outline-none text-sm placeholder:text-stone-400 resize-y min-h-[60px] transition-all bg-white" rows={2} />
          
          <div className="grid grid-cols-2 gap-3">
             <input placeholder="เลขประจำตัวผู้เสียภาษี" value={data.to.taxId} onChange={(e) => updateEntity('to', 'taxId', e.target.value)} className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-3 border outline-none text-sm placeholder:text-stone-400 transition-all bg-white" />
             <input placeholder="สาขา" value={data.to.branch || ''} onChange={(e) => updateEntity('to', 'branch', e.target.value)} className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-3 border outline-none text-sm placeholder:text-stone-400 transition-all bg-white" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input placeholder="เบอร์โทรศัพท์" value={data.to.phone} onChange={(e) => updateEntity('to', 'phone', e.target.value)} className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-3 border outline-none text-sm placeholder:text-stone-400 transition-all bg-white" />
            <input placeholder="ผู้ติดต่อ" value={data.to.contactPerson || ''} onChange={(e) => updateEntity('to', 'contactPerson', e.target.value)} className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-3 border outline-none text-sm placeholder:text-stone-400 transition-all bg-white" />
          </div>
        </div>
      </section>

      {/* Items */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-stone-700 pb-2 border-b border-stone-200/60 flex items-center justify-between">
          <span>รายการสินค้า / บริการ</span>
        </h3>
        
        <div className="space-y-4">
          {data.items.map((item, index) => (
            <div key={item.id} className="relative bg-white border border-stone-200 rounded-2xl p-5 shadow-sm group hover:border-leaf-300 transition-all">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] font-bold text-stone-400 tracking-wider uppercase bg-sand-50 px-2 py-1 rounded-md">Item #{index + 1}</span>
                <button onClick={() => removeItem(item.id)} className="text-stone-400 hover:text-clay-500 hover:bg-clay-50 p-1.5 rounded-lg transition-colors" title="ลบรายการ">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="space-y-3">
                <input 
                  placeholder="รายละเอียดสินค้า/บริการ" 
                  value={item.description} 
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)} 
                  className="w-full border-stone-200 outline-none rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-3 border text-sm transition-all text-stone-800 font-medium" 
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 mb-1 uppercase tracking-wider ml-1">จำนวน</label>
                    <input 
                      type="number" 
                      min="1"
                      value={item.quantity === 0 ? '' : item.quantity} 
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))} 
                      className="w-full border-stone-200 outline-none rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-3 border text-sm transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 mb-1 uppercase tracking-wider ml-1">ราคาต่อหน่วย</label>
                    <input 
                      type="number" 
                      min="0"
                      value={item.unitPrice === 0 ? '' : item.unitPrice} 
                      onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))} 
                      className="w-full border-stone-200 outline-none rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-3 border text-sm transition-all" 
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={addItem}
          className="w-full flex items-center justify-center gap-2 mt-2 py-3.5 border-2 border-dashed border-stone-200 rounded-2xl text-stone-500 font-bold hover:bg-white hover:border-leaf-400 hover:text-leaf-600 transition-colors text-sm"
        >
          <Plus size={16} />
          เพิ่มรายการใหม่
        </button>
      </section>

      {/* Totals & Notes */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-stone-700 pb-2 border-b border-stone-200/60 flex items-center justify-between">
          <span>สรุป & หมายเหตุ</span>
        </h3>
        
        <div className="bg-sand-50/80 p-5 rounded-2xl border border-stone-200 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-stone-500 mb-1 uppercase tracking-wider ml-1">ส่วนลด (บาท)</label>
              <input 
                type="number" 
                min="0"
                value={data.discount === 0 ? '' : data.discount} 
                onChange={(e) => updateField('discount', Number(e.target.value))} 
                className="w-full border-stone-200 outline-none rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-3 border text-sm bg-white transition-all" 
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
                className="w-full border-stone-200 outline-none rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-3 border text-sm bg-white transition-all" 
              />
            </div>
          </div>
          <label className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-stone-200 cursor-pointer hover:border-leaf-300 transition-colors shadow-sm">
            <input 
              type="checkbox" 
              checked={data.includeTax}
              onChange={(e) => updateField('includeTax', e.target.checked)}
              className="rounded border-stone-300 text-leaf-500 shadow-sm focus:border-leaf-400 focus:ring focus:ring-leaf-500/20 w-4 h-4 cursor-pointer accent-leaf-500 transition-all"
            />
            <span className="text-sm font-semibold text-stone-700 select-none">
              รวมภาษีมูลค่าเพิ่ม 7% ลงในยอดรวม
            </span>
          </label>
        </div>

        <div className="mt-4">
          <label className="block text-[11px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider ml-1">ช่องทางการชำระเงิน</label>
          <textarea 
            rows={3}
            value={data.paymentTerms || ''}
            onChange={(e) => updateField('paymentTerms', e.target.value)}
            className="w-full border-stone-200 outline-none rounded-2xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-4 border text-sm resize-y min-h-[70px] transition-all text-stone-700 bg-white" 
            placeholder="เช่น โอนเงินเข้าบัญชีธนาคาร..."
          />
        </div>
        
        <div className="mt-4">
          <label className="block text-[11px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider ml-1">หมายเหตุ</label>
          <textarea 
            rows={3}
            value={data.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            className="w-full border-stone-200 outline-none rounded-2xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-4 border text-sm resize-y min-h-[70px] transition-all text-stone-700 bg-white" 
            placeholder="ข้อมูลเพิ่มเติมอื่นๆ (ถ้ามี)"
          />
        </div>
      </section>
    </div>
  );
}
