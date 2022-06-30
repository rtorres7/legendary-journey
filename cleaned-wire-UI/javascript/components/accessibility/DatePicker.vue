<template>
  <div>
    <h2 class="mt-5">Date Pickers</h2>
    Our date picker allows for keyboard control in order to navigate. In order
    to open calendar pickers you must hit 'return'/'enter' or 'space' on date
    fields.
    <b-row v-for="control in calendarControls" :key="control.command">
      <b-col cols="6" class="text-bold mt-5 d-flex justify-content-end">
        <div v-for="key in control.keys" class="ml-2">
          {{ key }}
        </div>
      </b-col>
      <b-col class="mt-5 ml-2">
        {{ control.command }}
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "DatePicker",
  data() {
    return {
      showJawsInstructions: false,
      calendarControls: [
        {
          keys: ["Key Combo"],
          command: "Command",
        },
        {
          keys: ["Arrow Left"],
          command: "moves to the previous day",
        },
        {
          keys: ["Arrow Right"],
          command: "moves to the next day",
        },
        {
          keys: ["Arrow Up"],
          command: "moves to same day in the previous week",
        },
        {
          keys: ["Arrow Down"],
          command: "moves to the same day in the next week",
        },
        {
          keys: ["Page Up"],
          command: "moves to the same day in the previous month",
        },
        {
          keys: ["Page Down"],
          command: "moves to the same day in the next month",
        },
        {
          keys: ["Alt", "Page Up"],
          command: "moves to the same day and month in the previous year",
        },
        {
          keys: ["Alt", "Page Down"],
          command: "moves to the same day and month in the next year",
        },
        {
          keys: ["Ctrl", "Alt", "Page Up"],
          command:
            "moves to the same day and month in the previous decade, does not work with screen readers running",
        },
        {
          keys: ["Ctrl", "Alt", "Page Down"],
          command:
            "moves to the same day and month in the next decade, does not work with screen readers running",
        },
        {
          keys: ["Home"],
          command: "moves to today's date",
        },
        {
          keys: ["End"],
          command:
            "moves to the current selected date, or today if no date is selected",
        },
        {
          keys: ["Space or Enter"],
          command: "selects the currently highlighted day",
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss"></style>
