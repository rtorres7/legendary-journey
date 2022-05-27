<template>
  <div class="mt-7 spacing-palette">
    <b-row>
      <b-col class="mr-6">
        <h2>Spacing</h2>
        <h3 class="mb-5 alt-700">
          Consistent spacing creates visual balance that makes the user
          interface easier for users to scan. Apply consistent spacing to
          improve the quality of the UI.
        </h3>
        <img :src="require('@assets/spacing.svg')" class="pt-6 pr-6" />
      </b-col>
      <b-col>
        <h3 class="mt-7">Principles</h3>
        <b>Create visual rhythm</b>
        <p>
          We use incrementally measured spacing to create harmonious
          arrangements of components and text. This gives the elements a
          predictable rhythm, which makes the experience as a whole feel
          intentional and well designed.
        </p>
        <b>Precise but flexible</b>
        <p>
          Beyond mathmatical prescision, spacing also reacts to the objects it
          surrounds, giving more space to larger objects, less to small. Optical
          adjustments can also be made if an element looks off and the spacing
          needs a nudge to make things feel right.
        </p>
        <p class="pt-6 mb-5 description">
          All spacing for components and typography is done in increments of
          1rem (16px). This forms the basic unit of measurement for spacing.
        </p>
        <b-row
          ><b-col><span class="spacer-1-swatch mt-2"></span></b-col
        ></b-row>
        <b-row
          ><b-col><span class="spacer-2-swatch mt-2"></span></b-col
        ></b-row>
        <b-row
          ><b-col><span class="spacer-3-swatch mt-2"></span></b-col
        ></b-row>
        <b-row
          ><b-col><span class="spacer-4-swatch mt-2"></span></b-col
        ></b-row>
        <b-row
          ><b-col><span class="spacer-5-swatch mt-2"></span></b-col
        ></b-row>
        <b-row
          ><b-col><span class="spacer-6-swatch mt-2"></span></b-col
        ></b-row>
        <b-row
          ><b-col><span class="spacer-7-swatch mt-2"></span></b-col
        ></b-row>
        <b-row
          ><b-col><span class="spacer-8-swatch mt-2"></span></b-col
        ></b-row>
        <b-row
          ><b-col><span class="spacer-9-swatch mt-2"></span></b-col
        ></b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "SpacingPalette",
};
</script>

<style scoped lang="scss"></style>
