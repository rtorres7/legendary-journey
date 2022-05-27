<template>
  <div class="mt-7 icon-library">
    <b-row>
      <b-col class="mr-6">
        <h2>Interaction States</h2>
        <h3 class="mb-5 alt-700">
          Interaction states communicate the status of an element in the
          interface, establish confidence once an action is taken, and suggest
          the ability (or inability) to interact with an element.
        </h3>
        <img :src="require('@assets/interact-states.svg')" class="pt-6 pr-6" />
      </b-col>
      <b-col>
        <h3 class="mt-7">Principles</h3>
        <b>Be subtle, but clear</b>
        <p>
          Successful interaction feedback is informative, not decorative. Avoid
          elaborate transitions that create visual noise or intense color
          changes. Distracting animation can create disturbance and make an
          interface unpleasant to use.
        </p>
        <b>Keep things consistent</b>
        <p>
          Consistent treatments for interaction feedback create recognizable
          patterns. If an interaction produces different feedback across WIRe,
          it deteriorates the integrity of the pattern and risks confusing
          users.
        </p>
        <b>Use signifiers</b>
        <p>
          Provide users with cues as to what the interface will do if they
          interact with it. By using signifiers we set expectations about what
          componenets can do, which creates a more intuitive interface that's
          easier to use. The types of signifiers include:
        </p>
        <div
          class="d-flex align-items-center justify-content-center states mb-4"
        >
          <b-btn variant="outline-primary"
            ><span class="fa fa-star-o mr-2"></span>Subscribe</b-btn
          >
        </div>
        <ul>
          <li>
            <b>Explicit,</b> where content directs users to do the intended
            action, such as "Select All" or "Export."
          </li>
        </ul>
        <div
          class="d-flex align-items-center justify-content-center states mb-4"
        >
          <b-btn variant="link">Edit</b-btn>
        </div>
        <ul>
          <li>
            <b>Hidden,</b> where the clue isn't revealed until the user
            interacts with it, such as hovering or using tab navigation to see
            if a button is clickable.
          </li>
        </ul>
        <div
          class="d-flex align-items-center justify-content-center states mb-4"
        >
          <b-btn class="disabled" variant="secondary">Submit</b-btn>
        </div>
        <ul>
          <li>
            <b>Negative,</b> where the action appears inactive (like the button
            is grayed out and doesn't respond to hover) because it isn't
            available for the user to use.
          </li>
        </ul>
        <b>Behavior</b>
        <p>
          Use feedback indicators like the spinner component to let them know
          that the interface received their request. If appropriate, you can
          also provide added information about what or how long it will take to
          complete.
        </p>
        <p>
          For an unsuccesful completion that requires the user to take action,
          provide information about what prevented the action from completing
          successfully and what the user can do to fix the problem. For example,
          use the validation error state of the text field component.
        </p>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "InteractionStates",
  components: {},
};
</script>

<style scoped lang="scss">
.states {
  background-color: $alt-100;
  width: 100%;
  height: 100px;
  border: 1px solid $alt-300;
}
.disabled {
  color: $alt-800;
}
</style>
