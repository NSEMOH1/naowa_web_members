import { create } from "zustand";
import { devtools } from "zustand/middleware";
import api from "../api";

export interface Notification {
    id: string;
    title: string;
    message: string;
    status: "READ" | "UNREAD";
    createdAt: string;
    memberId: string;
    member?: {
        first_name: string;
        avatar?: string;
    };
    metadata?: any;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    selectedNotification: Notification | null;
    setNotifications: (notifications: Notification[]) => void;
    addNotification: (notification: Notification) => void;
    markAsRead: (notificationId: string) => Promise<void>;
    markAsUnread: (notificationId: string) => Promise<void>;
    setSelectedNotification: (notification: Notification | null) => void;
    fetchNotifications: (memberId: string) => Promise<void>;
    fetchUnreadCount: (memberId: string) => Promise<void>;
    setLoading: (loading: boolean) => void;
    getUnreadNotifications: () => Notification[];
    updateNotificationStatus: (
        notificationId: string,
        status: "READ" | "UNREAD"
    ) => void;
}

export const useNotificationStore = create<NotificationState>()(
    devtools(
        (set, get) => ({
            // Initial state
            notifications: [],
            unreadCount: 0,
            isLoading: false,
            selectedNotification: null,

            // Actions
            setNotifications: (notifications) => {
                const unreadCount = notifications.filter(
                    (n) => n.status === "UNREAD"
                ).length;
                set({ notifications, unreadCount });
            },

            addNotification: (notification) => {
                set((state) => ({
                    notifications: [notification, ...state.notifications],
                    unreadCount:
                        notification.status === "UNREAD"
                            ? state.unreadCount + 1
                            : state.unreadCount,
                }));
            },

            markAsRead: async (notificationId) => {
                try {
                    const response = await api.put(
                        `/api/notifications/${notificationId}/read`
                    );

                    if (response.status === 200) {
                        get().updateNotificationStatus(notificationId, "READ");
                    }
                } catch (error) {
                    console.error("Error marking notification as read:", error);
                    throw error;
                }
            },

            markAsUnread: async (notificationId) => {
                try {
                    // You'll need to create this endpoint
                    const response = await api.put(
                        `/api/notifications/${notificationId}/unread`
                    );

                    if (response.status === 200) {
                        get().updateNotificationStatus(
                            notificationId,
                            "UNREAD"
                        );
                    }
                } catch (error) {
                    console.error(
                        "Error marking notification as unread:",
                        error
                    );
                    throw error;
                }
            },

            updateNotificationStatus: (notificationId, status) => {
                set((state) => {
                    const updatedNotifications = state.notifications.map((n) =>
                        n.id === notificationId ? { ...n, status } : n
                    );

                    const unreadCount = updatedNotifications.filter(
                        (n) => n.status === "UNREAD"
                    ).length;

                    const selectedNotification =
                        state.selectedNotification?.id === notificationId
                            ? { ...state.selectedNotification, status }
                            : state.selectedNotification;

                    return {
                        notifications: updatedNotifications,
                        unreadCount,
                        selectedNotification,
                    };
                });
            },

            setSelectedNotification: (notification) => {
                set({ selectedNotification: notification });

                // Auto-mark as read when selected (optional)
                if (notification && notification.status === "UNREAD") {
                    get().markAsRead(notification.id).catch(console.error);
                }
            },

            fetchNotifications: async (memberId) => {
                try {
                    set({ isLoading: true });
                    const response = await api.get(
                        `/api/notifications/member/${memberId}`
                    );
                    get().setNotifications(response.data);
                } catch (error) {
                    console.error("Error fetching notifications:", error);
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchUnreadCount: async (memberId) => {
                try {
                    const response = await api.get(
                        `/api/notifications/member/${memberId}/unread-count`
                    );
                    set({ unreadCount: response.data.count });
                } catch (error) {
                    console.error("Error fetching unread count:", error);
                    throw error;
                }
            },

            setLoading: (isLoading) => set({ isLoading }),

            getUnreadNotifications: () => {
                return get().notifications.filter((n) => n.status === "UNREAD");
            },
        }),
        {
            name: "notification-store",
        }
    )
);
