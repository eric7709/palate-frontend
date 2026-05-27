// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/models/auth/hooks';
import { useAuthStore } from '@/models/auth/store';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { mutate: login, isPending, error } = useLogin();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

    const validate = (): boolean => {
        const errors: { email?: string; password?: string } = {};
        if (!email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';
        if (!password) errors.password = 'Password is required';
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        login(
            { email, password },
            {
                onSuccess: (data) => {
                    setAuth(data.user, data.accessToken, data.refreshToken);
                    if (data.user.role == "ROLE_ADMIN") {
                        router.push('/admin/dashboard');
                    }
                    if (data.user.role == "ROLE_CASHIER") {
                        router.push('/cashier/orders');
                    }
                },
                onError: (err: any) => {
                    console.error(err);
                },
            }
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
            <div className="w-full max-w-[350px] rounded-xl border border-white/10 bg-[#18191d] p-5 shadow-xl">
                <h1 className="text-xl font-bold text-white text-center">Welcome Back</h1>
                <p className="text-center text-gray-400 text-sm mb-4">Sign in to your account</p>

                <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
                    {/* Email */}
                    <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Email *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                            }}
                            autoComplete="off"
                            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            placeholder="your@email.com"
                        />
                        {fieldErrors.email && <p className="text-red-400 text-[10px] mt-1">{fieldErrors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Password *</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                            }}
                            autoComplete="new-password"
                            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            placeholder="••••••••"
                        />
                        {fieldErrors.password && <p className="text-red-400 text-[10px] mt-1">{fieldErrors.password}</p>}
                    </div>

                    {/* Server error */}
                    {error && (
                        <div className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-md p-2">
                            {(error as any)?.response?.data?.message || 'Login failed. Check your credentials.'}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-emerald-700 disabled:opacity-60"
                    >
                        {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                        {isPending ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

            </div>
        </div>
    );
}