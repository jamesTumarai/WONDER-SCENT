import React, { useState } from 'react';
import { Maximize2, X } from 'lucide-react';

type ExpandableFieldProps = React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  as?: 'input' | 'textarea';
};

export default function ExpandableField({ label, as = 'textarea', ...props }: ExpandableFieldProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const Component = as;
  const displayLabel = label || props.placeholder || 'รายละเอียด';


  return (
    <>
      <Component 
        {...(props as any)} 
        onDoubleClick={(e: any) => {
          setIsExpanded(true);
          props.onDoubleClick?.(e);
        }}
        title={props.title || "แตะ 2 ครั้งเพื่อขยาย"}
      />

      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c191766] backdrop-blur-sm sm:p-6">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-stone-100">
              <h3 className="font-bold text-stone-800 tracking-tight ml-2">{displayLabel}</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-all duration-200 active:scale-90"
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 sm:p-6 min-h-[300px] sm:min-h-[400px] flex flex-col">
              <textarea
                {...(props as any)}
                autoFocus
                title=""
                onDoubleClick={undefined}
                className="w-full flex-1 h-full border-stone-200 rounded-2xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-4 border outline-none text-base placeholder:text-stone-400 bg-white resize-none"
              />
            </div>
            <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setIsExpanded(false)}
                type="button"
                className="px-6 py-2.5 bg-stone-800 text-white font-medium rounded-xl hover:bg-stone-900 active:bg-black transition-all duration-200 active:scale-95 shadow-sm"
              >
                เสร็จสิ้น
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

