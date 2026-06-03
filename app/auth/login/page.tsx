'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/models/auth/hooks';
import { useAuthStore } from '@/models/auth/store';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Logo from '@/ui/Logo'; // adjust path as needed

export default function LoginPage() {
    const router = useRouter();
    const { mutate: login, isPending, error } = useLogin();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

    const validate = (): boolean => {
        const errors: { email?: string; password?: string } = {};
        if (!email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Invalid email address';
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
                    if (data.user.role === "ROLE_ADMIN") router.push('/admin/dashboard');
                    if (data.user.role === "ROLE_CASHIER") router.push('/cashier/orders');
                },
                onError: (err: any) => console.error(err),
            }
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0e0f12] p-4">

            <div className="absolute w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-85">

                {/* Logo / Brand - replaced with Logo component */}
                <div className="flex flex-col items-center mb-5">
                    <Logo white />
                    <p className="text-xs text-gray-500 mt-2">Sign in to continue</p>
                </div>

                {/* Card */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-[#16181d] border border-white/6 rounded-3xl p-5 shadow-2xl space-y-3"
                >
                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (fieldErrors.email) setFieldErrors(p => ({ ...p, email: undefined }));
                            }}
                            autoComplete="off"
                            placeholder="your@email.com"
                            className={`w-full bg-white/4 border rounded-2xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all ${
                                fieldErrors.email
                                    ? 'border-red-500/50 focus:ring-red-500/30'
                                    : 'border-white/6 focus:ring-blue-500/30 focus:border-blue-500/30'
                            }`}
                        />
                        {fieldErrors.email && <p className="text-red-400 text-[10px] px-1">{fieldErrors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (fieldErrors.password) setFieldErrors(p => ({ ...p, password: undefined }));
                                }}
                                autoComplete="new-password"
                                placeholder="••••••••"
                                className={`w-full bg-white/4 border rounded-2xl px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all ${
                                    fieldErrors.password
                                        ? 'border-red-500/50 focus:ring-red-500/30'
                                        : 'border-white/6 focus:ring-blue-500/30 focus:border-blue-500/30'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray.300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {fieldErrors.password && <p className="text-red-400 text-[10px] px-1">{fieldErrors.password}</p>}
                    </div>

                    {/* Server error */}
                    {error && (
                        <div className="text-red-400 text-xs bg-red-500/8 border border-red-500/15 rounded-2xl px-4 py-2.5 text-center">
                            {(error as any)?.response?.data?.message || 'Invalid credentials. Please try again.'}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-5 cursor-pointer"
                    >
                        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isPending ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

            </div>
        </div>
    );
}