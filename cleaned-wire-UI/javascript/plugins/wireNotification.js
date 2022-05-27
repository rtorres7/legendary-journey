export default {
  install(Vue, opts) {
    // Defining localVue is weird here. We need it because the vue-announcer plugin does not
    // attach itself to the Vue object. It only attaches itself to instances of Vue (using
    // Vue.prototype). A PR to the vue-announcer project to set itself up like the
    // vue-notification plugin would be appropriate.
    const localVue = new Vue();

    const defaultOptions = {
      group: "main",
      duration: 10000,
      title: "",
      text: "",
    };

    const notifyFromFlash = function (flash) {
      if (flash.notice || flash.type === "notice") {
        var notification = _.clone(defaultOptions);
        notification.text = flash.notice || flash.msg;
        notification.type = "notice";
        notification.title = "Notice";
        notify(notification);
      }

      if (flash.success || flash.type === "success") {
        var notification = _.clone(defaultOptions);
        notification.text = flash.success || flash.msg;
        notification.type = "success";
        notification.title = "Success";
        notify(notification);
      }

      if (flash.error || flash.type === "error") {
        var notification = _.clone(defaultOptions);
        notification.text =
          "Trouble Processing Your Request: " + (flash.error || flash.msg);
        notification.type = "error";
        notification.title = "Error";
        notify(notification);
      }

      if (flash.warning || flash.type === "warning") {
        var notification = _.clone(defaultOptions);
        notification.text = flash.warning || flash.msg;
        notification.type = "warn";
        notification.title = "Warning";
        notify(notification);
      }
    };

    const notify = function (notificationOptions) {
      if (typeof notificationOptions === "string") {
        notificationOptions = { title: "", text: notificationOptions };
      }
      var standardizedOptions = _.defaults(
        {},
        notificationOptions,
        defaultOptions
      );
      var screenReaderAnnouncement =
        "Dynamic Announcement: " +
        standardizedOptions.title +
        " " +
        standardizedOptions.text;

      Vue.notify(standardizedOptions);
      localVue.$announcer.set(screenReaderAnnouncement);
    };

    Vue.wireNotification = notify;
    Vue.prototype.$wireNotification = notify;
    Vue.notifyFromFlash = notifyFromFlash;
    Vue.prototype.$notifyFromFlash = notifyFromFlash;
  },
};
