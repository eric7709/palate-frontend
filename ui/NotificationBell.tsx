'use client';

import { Bell, Check, CheckCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useGetMyNotifications, useGetUnreadCount, useMarkAllAsRead, useMarkAsRead } from '@/models/notification/hooks';
import { useAuthStore } from '@/models/auth/store';
import { Notification } from '@/models/notification/types';
import { formatDistanceToNow } from 'date-fns';
import { useNotificationRealtime } from '@/sockets/useNotificationRealtime';

export const NotificationBell = () => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const { user } = useAuthStore();
    useNotificationRealtime(user?.id ?? null);

    const { data: notifications = [] } = useGetMyNotifications();
    const { data: unreadData } = useGetUnreadCount();
    const { mutate: markAsRead } = useMarkAsRead();
    const { mutate: markAllAsRead } = useMarkAllAsRead();

    const unreadCount = unreadData?.count ?? 0;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="relative p-2 rounded-xl text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-all duration-200"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 ring-2 ring-white flex items-center justify-center text-[9px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-neutral-100 z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                        <div>
                            <h3 className="text-sm font-bold text-neutral-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <p className="text-xs text-neutral-400">{unreadCount} unread</p>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllAsRead()}
                                className="flex items-center gap-1 text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto divide-y divide-neutral-50">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                                <Bell className="w-8 h-8 text-neutral-200 mb-2" />
                                <p className="text-sm font-medium text-neutral-400">No notifications yet</p>
                                <p className="text-xs text-neutral-300 mt-0.5">You're all caught up</p>
                            </div>
                        ) : (
                            notifications.map((n: Notification) => (
                                <NotificationItem
                                    key={n.id}
                                    notification={n}
                                    onMarkAsRead={() => markAsRead(n.id)}
                                />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const NotificationItem = ({
    notification,
    onMarkAsRead,
}: {
    notification: Notification;
    onMarkAsRead: () => void;
}) => {
    const isStale = notification.type === 'STALE_ORDER';

    return (
        <div className={`flex gap-3 px-4 py-3 transition-colors ${!notification.isRead ? 'bg-amber-50/50' : 'hover:bg-neutral-50'}`}>
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${isStale ? 'bg-rose-100 text-rose-500' : 'bg-amber-100 text-amber-500'}`}>
                {isStale ? '⚠️' : '🔔'}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-neutral-800 truncate">{notification.title}</p>
                <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{notification.message}</p>
                <p className="text-[10px] text-neutral-300 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>
            </div>

            {!notification.isRead && (
                <button
                    onClick={onMarkAsRead}
                    className="shrink-0 self-start mt-0.5 p-1 rounded-full hover:bg-neutral-100 text-neutral-300 hover:text-amber-500 transition-colors"
                >
                    <Check className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );
};