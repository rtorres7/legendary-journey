<template>
  <div class="mt-6 pb-6 standard-page-margin">
    <h1>Design System</h1>
    <h2 class="mb-5 description">
      These are the principles that shape how we design all the experiences
      across _temp_28 WIRe.
    </h2>
    <b>Fresh visual style</b>
    <p>A clean, simple style makes things feel approachable and efficient.</p>
    <b>Faster performance</b>
    <p>Elegant code and lightweight assets means pages load more quickly.</p>
    <b>Future-friendliness</b>
    <p>
      Built for flexibility, Vue components and Bootstrap let us iterate easily
      across experiences.
    </p>
    <b>Purposeful brand presence</b>
    <p>
      Being intentional about when the WIRe brand comes forward, and when it
      takes a backseat, directs the focus to where it matters most.
    </p>
    <b>Familiarity across experiences</b>
    <p>
      Defined patterns and guidelines help us design a wide variety of
      experiences that still always feel like WIRe.
    </p>
    <ColorPalette class="separator" />
    <SpacingPalette class="separator" />
    <TypographyPalette class="separator" />
    <IconLibrary class="separator" />
    <InteractionStates class="separator" />
  </div>
</template>

<script>
import ColorPalette from "./ColorPalette";
import SpacingPalette from "./SpacingPalette";
import TypographyPalette from "./TypographyPalette";
import IconLibrary from "./IconLibrary";
import InteractionStates from "./InteractionStates";
export default {
  name: "Design",
  components: {
    ColorPalette,
    SpacingPalette,
    TypographyPalette,
    IconLibrary,
    InteractionStates,
  },
};
</script>

<style scoped lang="scss">
.heading-example {
  max-width: 400px;
}
.separator {
  border-top: 1px solid $alt-400;
  padding-top: 2rem;
  padding-bottom: 2rem;
}
h1 {
  font-family: $font-family-sans-serif;
  font-size: $font-size-10;
}
</style>
