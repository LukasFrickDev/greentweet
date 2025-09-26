import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchNotifications } from "../../store/slices/postSlice";
import { useToast } from "../../hooks/useToast";
import type { Notification } from "../../types/Notification";

const POLLING_INTERVAL_MS = 5000;

const buildNotificationMessage = (notification: Notification) => {
  const actor = notification.actor_username || "Alguém";
  const baseContent = notification.post_content?.trim();
  const snippet = baseContent
    ? `: "${
        baseContent.length > 60
          ? `${baseContent.slice(0, 57).trimEnd()}...`
          : baseContent
      }"`
    : "";

  switch (notification.type) {
    case "like":
      return `${actor} curtiu seu post${snippet}`;
    case "comment":
      return `${actor} comentou no seu post${snippet}`;
    case "follow":
      return `${actor} começou a seguir você.`;
    default:
      return "Você recebeu uma nova notificação.";
  }
};

const NotificationListener = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const userId = useAppSelector((state) => state.auth.user?.id ?? null);
  const notifications = useAppSelector((state) => state.posts.notifications);
  const seenNotificationsRef = useRef<Set<number>>(new Set());
  const initializedRef = useRef(false);
  const lastSeenCreatedAtRef = useRef<number | null>(null);

  useEffect(() => {
    seenNotificationsRef.current = new Set();
    initializedRef.current = false;
    lastSeenCreatedAtRef.current = Date.now();
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let isCancelled = false;

    const pollNotifications = async () => {
      try {
        await dispatch(fetchNotifications()).unwrap();
      } catch (error) {
        if (!isCancelled) {
          console.error("Erro ao atualizar notificações", error);
        }
      }
    };

    void pollNotifications();
    const interval = window.setInterval(pollNotifications, POLLING_INTERVAL_MS);

    return () => {
      isCancelled = true;
      window.clearInterval(interval);
    };
  }, [dispatch, userId]);

  useEffect(() => {
    if (!userId || notifications.length === 0) {
      return;
    }

    const seen = seenNotificationsRef.current;
    const unseenNotifications = notifications.filter(
      (notification) => !seen.has(notification.id)
    );

    if (!initializedRef.current) {
      unseenNotifications.forEach((notification) => {
        seen.add(notification.id);
      });
      initializedRef.current = true;
      return;
    }

    unseenNotifications.forEach((notification) => {
      seen.add(notification.id);
      const createdAt = Date.parse(notification.created_at ?? "");
      const lastSeenTimestamp = lastSeenCreatedAtRef.current ?? Date.now();
      const hasValidTimestamp = !Number.isNaN(createdAt);
      const shouldShowToast =
        !notification.is_read && hasValidTimestamp && createdAt > lastSeenTimestamp;

      if (shouldShowToast) {
        const message = buildNotificationMessage(notification);
        showToast(message, { duration: 4000 });
      }

      if (hasValidTimestamp) {
        const current = lastSeenCreatedAtRef.current ?? lastSeenTimestamp;
        if (createdAt > current) {
          lastSeenCreatedAtRef.current = createdAt;
        }
      }
    });
  }, [notifications, userId, showToast]);

  return null;
};

export default NotificationListener;
