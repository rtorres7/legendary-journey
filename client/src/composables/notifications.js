import { ref } from "vue";
import uniqueID from "@/composables/uniqueID";

const defaultNotificationOptions = {
  type: "info",
  autoClose: true,
  canClose: true,
  duration: 5,
};

export default function useNotifications() {
  const notifications = ref([]);

  const createNotification = (options) => {
    const _options = Object.assign({ ...defaultNotificationOptions }, options);

    notifications.value.push(
      ...[
        {
          id: uniqueID().getID(),
          ..._options,
        },
      ]
    );
  };

  const createErrorNotification = (options) => {
    createNotification({
      type: "error",
      title: "Something went wrong.",
      duration: 8,
      ...options,
    });
  };

  const createSuccessNotification = (options) => {
    createNotification({ type: "success", title: "Success!", ...options });
  };

  const createWarningNotification = (options) => {
    createNotification({
      type: "warning",
      title: "Something to lookout for.",
      duration: 8,
      ...options,
    });
  };

  const removeNotifications = (id) => {
    const index = notifications.value.findIndex((item) => item.id === id);
    if (index !== -1) notifications.value.splice(index, 1);
  };

  const stopBodyOverflow = () => {
    document && document.body.classList.add(...["hide-overflow"]);
  };

  const allowBodyOverflow = () => {
    document && document.body.classList.remove(...["hide-overflow"]);
  };

  return {
    notifications,
    createNotification,
    createSuccessNotification,
    createErrorNotification,
    createWarningNotification,
    removeNotifications,
    stopBodyOverflow,
    allowBodyOverflow,
  };
}
