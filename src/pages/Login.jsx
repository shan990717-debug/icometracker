import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Login() {
  const { login } = useAuth();
  const { lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(lang === 'zh' ? '请填写所有字段' : 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success(lang === 'zh' ? '登录成功' : 'Logged in successfully');
      window.location.href = '/'; // Redirect to dashboard
    } catch (error) {
      console.error(error);
      toast.error(lang === 'zh' ? '登录失败，请检查账户凭证' : 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">
            {lang === 'zh' ? '收支追踪器' : 'Income Tracker'}
          </h1>
          <p className="text-xs text-muted-foreground">
            {lang === 'zh' ? '请输入凭证以访问系统' : 'Enter your credentials to access the tracker'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">
              {lang === 'zh' ? '电子邮箱' : 'Email Address'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-xl border border-border bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">
              {lang === 'zh' ? '密码' : 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-border bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl font-bold">
            {loading ? '...' : (lang === 'zh' ? '登录' : 'Sign In')}
          </Button>
        </form>
      </div>
    </div>
  );
}
