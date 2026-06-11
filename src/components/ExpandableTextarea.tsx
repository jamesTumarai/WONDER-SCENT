import { useState } from 'react';
import { Maximize2, X } from 'lucide-react';

interface ExpandableTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export default function ExpandableTextarea({ label, ...props }: ExpandableTextareaProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className="relative group">
        <textarea {...props} />
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="absolute top-2 right-2 p-1.5 bg-stone-100 text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
          title="ขยายขนาด (Expand)"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm sm:p-6">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-stone-100">
              <h3 className="font-bold text-stone-800 tracking-tight ml-2">{label}</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-hidden flex flex-col">
              <textarea
                {...props}
                autoFocus
                className="w-full flex-1 border-stone-200 rounded-2xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-4 border outline-none text-base placeholder:text-stone-400 bg-white resize-none"
              />
            </div>
            <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setIsExpanded(false)}
                className="px-6 py-2.5 bg-stone-800 text-white font-medium rounded-xl hover:bg-stone-900 transition-colors shadow-sm"
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
