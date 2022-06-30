<template>
  <div class="mt-6 color-palette">
    <b-row>
      <b-col class="mr-6">
        <h2>Colors</h2>
        <h3 class="mb-5 alt-700">
          Our color system builds on the recognition of the WIRe brand colors to
          make the interface more usable.
        </h3>
        <img :src="require('@assets/colors.svg')" class="pt-6 pr-6" />
      </b-col>
      <b-col>
        <h3 class="mt-7">Principles</h3>
        <b>Communication is key</b>
        <p>
          Although we value an aesthetically pleasing use of color, we place a
          higher value on clear communication. Color supports the purpose of the
          content, communicating things like hierarchy of information,
          interactive states, and the difference between distinct elements.
        </p>
        <b>Colors have meaning</b>
        <p>
          Colors have assigned roles, which hold a specific meaning based on how
          they function within the interface. Defined color roles make things
          easy to modify and customize later. They also extend the color system
          so it works across any touchpoint in WIRe.
        </p>
        <b>Colors follow accessibility guidelines</b>
        <p>
          The color system is designed to meet Web Content Accessibility
          Guidelines (WCAG) 2.1 compliant contrast ratios. This makes things
          easier to find, identify, and interact with. It also makes the whole
          experience more accessible for users who are color blind or who have
          low vision. However you should never convey information using color
          alone. Bootstrap's default palette - used throughout the framework for
          things such as button variations, alert variations, form validation
          indicators - lead to insufficient color contrast (below the
          recommended WCAG 2.0 color contrast ratio of 4.5:1) when used against
          a light background. We are working to modify/extend these default
          colors to ensure adequate color contrast ratios.
        </p>
      </b-col>
    </b-row>

    <h3 class="mt-6 mb-2">Primary</h3>
    <p>
      Use primary colors for primary actions like buttons, icons and text on
      navigation and tabs, and for the background in navigation and tab
      interactive states.
    </p>
    <b-row>
      <b-col>
        <div class="color-swatch understated-title-text alt-900-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text alt-800-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text alt-700-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text alt-600-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text alt-500-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text alt-400-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text alt-300-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text alt-200-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text alt-100-swatch"></div>
      </b-col>
    </b-row>
    <h3 class="mt-6 mb-2">Secondary</h3>
    <p>
      Use secondary colors for secondary and tertiary buttons and accent
      elements.
    </p>
    <b-row>
      <b-col>
        <div class="color-swatch understated-title-text pri-900-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text pri-800-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text pri-700-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text pri-600-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text pri-500-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text pri-400-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text pri-300-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text pri-200-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text pri-100-swatch"></div>
      </b-col>
    </b-row>
    <h3 class="mt-8 mb-2">Alternative</h3>
    <p>
      Use alternative colors for secondary and tertiary buttons and accent
      elements.
    </p>
    <b-row>
      <b-col>
        <div class="color-swatch understated-title-text sec-900-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text sec-800-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text sec-700-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text sec-600-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text sec-500-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text sec-400-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text sec-300-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text sec-200-swatch"></div>
      </b-col>
      <b-col>
        <div class="color-swatch understated-title-text sec-100-swatch"></div>
      </b-col>
    </b-row>
    <h3 class="mt-6 mb-2">Interactive, Buttons, Alerts</h3>
    <p>
      Use interactive colors for things like links, focus indicators, and
      selected interactive states. These are colors that are primarily pre-built
      with Bootstrap.
    </p>
    <b-row>
      <b-col>
        <div
          class="color-swatch understated-title-text rounded black-swatch"
        ></div>
      </b-col>
      <b-col>
        <div
          class="color-swatch understated-title-text rounded border white-swatch"
        ></div>
      </b-col>
      <b-col>
        <div
          class="color-swatch understated-title-text rounded green-swatch"
        ></div>
      </b-col>
      <b-col>
        <div
          class="color-swatch understated-title-text rounded red-swatch"
        ></div>
      </b-col>
      <b-col>
        <div
          class="color-swatch understated-title-text rounded lt-red-swatch"
        ></div>
      </b-col>
      <b-col>
        <div
          class="color-swatch understated-title-text rounded yellow-swatch"
        ></div>
      </b-col>
      <b-col> </b-col>
      <b-col> </b-col>
      <b-col> </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "ColorPalette",
};
</script>

<style scoped lang="scss">
h2 {
  font-size: $font-size-7;
}
h3 {
  font-size: $text-x-lg;
}
.reset-icon {
  height: 100px;
  width: 100px;
}
</style>
