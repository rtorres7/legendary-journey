import { mount } from "@vue/test-utils";
import ToastNotification from "@/components/ToastNotification.vue";
import { describe, expect, test } from "vitest";

describe("ToastNotification.vue", () => {
  test("renders the correct style for error", () => {
    const type = "error";
    const wrapper = mount(ToastNotification, {
      props: { type },
    });
    const icon = wrapper.find("#icon-container").find("svg");
    expect(icon.classes()).toEqual(expect.arrayContaining(["text-red-500"]));
  });

  test("renders the correct style for warning", () => {
    const type = "warning";
    const wrapper = mount(ToastNotification, {
      props: { type },
    });
    const icon = wrapper.find("#icon-container").find("svg");
    expect(icon.classes()).toEqual(expect.arrayContaining(["text-yellow-500"]));
  });

  test("renders the correct style for success", () => {
    const type = "success";
    const wrapper = mount(ToastNotification, {
      props: { type },
    });
    const icon = wrapper.find("#icon-container").find("svg");
    expect(icon.classes()).toEqual(expect.arrayContaining(["text-green-500"]));
  });

  test("renders the correct style for info (default)", () => {
    const wrapper = mount(ToastNotification, {});
    const icon = wrapper.find("#icon-container").find("svg");
    expect(icon.classes()).toEqual(expect.arrayContaining(["text-blue-500"]));
  });

  test("doesn't render close button when disabling it", () => {
    const canClose = false;
    const wrapper = mount(ToastNotification, {
      props: { canClose },
    });
    expect(wrapper.find("button").exists()).toBe(false);
  });

  test("emits event when close button is clicked", async () => {
    const wrapper = mount(ToastNotification, {
      data() {
        return {
          clicked: false,
        };
      },
    });
    const closeButton = wrapper.find("button");
    await closeButton.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("close");
  });
});
