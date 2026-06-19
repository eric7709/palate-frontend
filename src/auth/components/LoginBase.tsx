'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/src/auth/hooks/hooks';
import { useAuthStore } from '@/src/auth/store';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Logo from '@/src/shared/components/utils/Logo';

export function LoginBase() {
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
                    if (data.user.role === "ROLE_ADMIN") router.push('/admin/home');
                    if (data.user.role === "ROLE_CASHIER") router.push('/cashier/orders');
                    if (data.user.role === "ROLE_WAITER") router.push('/waiter/orders');
                },
                onError: (err: any) => console.error(err),
            }
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="relative w-85">
                {/* Logo / Brand */}
                <div className="flex flex-col items-center mb-5">
                    <Logo /> {/* No white prop – use default colored logo */}
                    <p className="text-xs text-gray-500 mt-2">Hotel Management System</p>
                    {/* 👇 Added Hotel Management tagline */}
                </div>

                {/* Card */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-gray-200 rounded-3xl p-6 shadow-lg space-y-4"
                >
                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (fieldErrors.email) setFieldErrors(p => ({ ...p, email: undefined }));
                            }}
                            autoComplete="off"
                            placeholder="your@email.com"
                            className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                                fieldErrors.email
                                    ? 'border-red-300 focus:ring-red-200'
                                    : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                            }`}
                        />
                        {fieldErrors.email && <p className="text-red-500 text-[10px] px-1">{fieldErrors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Password</label>
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
                                className={`w-full bg-white border rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                                    fieldErrors.password
                                        ? 'border-red-300 focus:ring-red-200'
                                        : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {fieldErrors.password && <p className="text-red-500 text-[10px] px-1">{fieldErrors.password}</p>}
                    </div>

                    {/* Server error */}
                    {error && (
                        <div className="text-red-600 text-xs bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-center">
                            {(error as any)?.response?.data?.message || 'Invalid credentials. Please try again.'}
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 cursor-pointer"
                    >
                        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isPending ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}