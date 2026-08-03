import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { LogIn, Loader2, X } from 'lucide-react';

interface Props {
  onClose: () => void;
  closable?: boolean;
}

export default function LoginModal({ onClose, closable = true }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setLoading(true);
      setError('');
      await signIn(email, password);
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError('รหัสผ่านหรืออีเมลไม่ถูกต้อง');
      } else {
        setError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c191766] backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <LogIn size={20} className="text-leaf-600" /> เข้าสู่ระบบ
          </h2>
          {closable && (
            <button 
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-all duration-200 active:scale-90"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-stone-500 mb-1.5 tracking-wider uppercase">อีเมล (Username)</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border outline-none text-sm transition-all bg-stone-50"
              placeholder="example@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 mb-1.5 tracking-wider uppercase">รหัสผ่าน</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500 shadow-sm p-3 border outline-none text-sm transition-all bg-stone-50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-leaf-600 hover:bg-leaf-700 active:bg-leaf-800 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl transition-all duration-200 active:scale-[0.98] shadow-sm focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:ring-offset-2 mt-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
}
