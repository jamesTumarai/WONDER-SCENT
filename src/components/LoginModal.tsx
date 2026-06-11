import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { LogIn, Loader2, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function LoginModal({ onClose }: Props) {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
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
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError('รหัสผ่านหรืออีเมลไม่ถูกต้อง หรือยังไม่เคยลงทะเบียน (กรุณาลองลงทะเบียนก่อน)');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('อีเมลนี้ถูกใช้งานแล้ว กรุณาเข้าสู่ระบบ');
      } else {
        setError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <LogIn size={20} className="text-leaf-600" /> {isSignUp ? 'สร้างบัญชีใหม่' : 'เข้าสู่ระบบ'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
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
              className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-3 border outline-none text-sm transition-all bg-stone-50/50"
              placeholder="example@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 mb-1.5 tracking-wider uppercase">รหัสผ่าน (ขั้นต่ำ 6 ตัวอักษร)</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-stone-200 rounded-xl focus:border-leaf-400 focus:ring-4 focus:ring-leaf-500/10 shadow-sm p-3 border outline-none text-sm transition-all bg-stone-50/50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-leaf-600 hover:bg-leaf-700 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:ring-offset-2 mt-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : (isSignUp ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ')}
          </button>
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors underline object-bottom"
            >
              {isSignUp ? 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชีใช่ไหม? สมัครสมาชิกก่อน'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
