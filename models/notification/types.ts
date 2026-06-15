export type Notification = {
    id: number;
    title: string;
    type: string;
    message: string;
    isRead: boolean;
    readAt: string | null;
    createdAt: string;
    updatedAt: string;
};
