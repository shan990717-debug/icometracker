import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Login() {
  const { login, signup } = useAuth();
  const { lang } = useLanguage();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(lang === 'zh' ? '请填写所有字段' : 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error(lang === 'zh' ? '密码长度不能少于6位' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        // 1. Create the user in Firebase Auth
        await signup(email, password);
        toast.success(lang === 'zh' ? '注册成功！已自动登录' : 'Account created! Logged in successfully');
      } else {
        // 2. Log in existing user
        await login(email, password);
        toast.success(lang === 'zh' ? '登录成功' : 'Logged in successfully');
      }
      window.location.href = '/'; // Go to dashboard
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error(lang === 'zh' ? '该邮箱已被注册' : 'This email is already in use.');
      } else {
        toast.error(lang === 'zh' ? '密码错误或账户不存在' : 'Authentication failed. Please check your credentials.');
      }
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
            {isRegistering 
              ? (lang === 'zh' ? '创建新账户以开始使用' : 'Create a new account to get started')
              : (lang === 'zh' ? '请输入凭证以访问系统' : 'Enter your credentials to access the tracker')}
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
            {loading ? '...' : (isRegistering ? (lang === 'zh' ? '注册' : 'Sign Up') : (lang === 'zh' ? '登录' : 'Sign In'))}
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-border/50">
          <button 
            type="button"
            onClick={() => setIsRegistering(!isRegistering)} 
            className="text-xs text-primary hover:underline font-medium"
          >
            {isRegistering 
              ? (lang === 'zh' ? '已有账户？点击登录' : 'Already have an account? Sign In')
              : (lang === 'zh' ? '没有账户？点击创建' : "Don't have an account? Sign Up")}
          </button>
        </div>
      </div>
    </div>
  );
}
