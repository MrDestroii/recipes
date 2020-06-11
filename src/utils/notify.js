import * as PNotify from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/Material.css";

const defaultOtions = {
  title: "Notification",
  text: "Notification",
  type: "info",
  delay: 4000,
  styling: 'material',
  icons: 'material'
};

export const renderNotify = (options = defaultOtions) => {
  PNotify.notice({ ...defaultOtions, ...options,  });
};
