// hooks/useNotificationSocket.ts
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useToast } from "@chakra-ui/react";
import { useNotificationStore } from "../store/notification";
import { useAuth } from "./useAuth";

export const useNotificationSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const toast = useToast();
    const { user } = useAuth();
    const { addNotification, fetchUnreadCount } = useNotificationStore();
    const API_URL = import.meta.env.VITE_API_URL || "";

    useEffect(() => {
        if (!user?.id) return;

        const socket = io(API_URL, {
            withCredentials: true,
            transports: ["websocket"],
        });

        socketRef.current = socket;

        socket.on("newNotification", (notification) => {
            addNotification(notification);

            toast({
                title: "New Notification",
                description: notification.title,
                status: "info",
                duration: 4000,
                isClosable: true,
                position: "top-right",
            });
        });

        socket.on("connect", () => {
            console.log("Socket connected");
            fetchUnreadCount(user.id);
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });
        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [user?.id, addNotification, fetchUnreadCount, toast]);

    return socketRef.current;
};
