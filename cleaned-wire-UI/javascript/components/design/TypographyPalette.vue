<template>
  <div class="mt-7 typography-palette">
    <b-row>
      <b-col class="mr-6">
        <h2>Typography</h2>
        <h3 class="mb-5 alt-700">
          WIRe provides a constrained, purposeful set of typographic styles.
          These styles map to functional roles so you know when to use what.
        </h3>
        <p>
          By tying typographic styles to specific functions in the interface, we
          create a clear visual pattern for users to follow while they interact
          with our site.
        </p>
        <img :src="require('@assets/type.svg')" class="pt-6 pr-6" />
      </b-col>
      <b-col>
        <h3 class="mt-7">Principles</h3>
        <b>Style with purpose</b>
        <p>
          A disciplined consistency with how you size and style type makes the
          whole site more intuitive to use. Users who learn how to navigate one
          experience can apply that same knowledge to each new experience they
          come across.
        </p>
        <b>Stay flexible</b>
        <p>
          To make things accessible to audiences with different eyesight
          constraints, across different browsers, and different screen sizes,
          make sure to design in a way that works no matter what the user opts
          to use.
        </p>
        <b-row>
          <b-col>
            <h3 class="mt-7">Our Font Families</h3>
            <span class="roboto font-size-8 mt-5 alt-700">Roboto</span>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <span class="roboto-italic font-size-8 mt-5 alt-700"
              >Roboto Italic</span
            >
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <span class="roboto-condensed font-size-8 mt-5 alt-700"
              >Roboto Condensed</span
            >
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <span class="roboto-condensed-italic font-size-8 mt-5 alt-700">
              Roboto Condensed Italic
            </span>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <span class="roboto-condensed-bold font-size-8 mt-5 alt-700">
              Roboto Condensed Bold
            </span>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <span class="noto font-size-8 mt-5 alt-700"
              >Noto Serif Regular</span
            >
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <span class="noto-italic font-size-8 mt-5 alt-700"
              >Noto Serif Italic</span
            >
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <span class="noto-bold font-size-8 mt-5 alt-700"
              >Noto Serif Bold</span
            >
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <span class="noto-bold-italic font-size-8 mt-5 alt-700">
              Noto Serif Bold Italic
            </span>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <h3 class="mt-7">Font Sizes</h3>
    <p class="mb-5 description">
      We use the typographic scale to communicate visual hierarchy in text.
    </p>
    <b-row>
      <b-col>
        <span class="font-size-1-swatch mt-5"></span>
        <p class="dashed">Caption</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <span class="font-size-2-swatch mt-5"></span>
        <p class="dashed">Body</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <span class="font-size-3-swatch mt-5"></span>
        <p class="dashed">Button</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <span class="font-size-4-swatch mt-5"></span>
        <p class="dashed">Article Body</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <span class="font-size-5-swatch mt-5"></span>
        <p class="dashed">H3, Modal Header</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <span class="font-size-6-swatch mt-5"></span>
        <p class="dashed">H2, Card Title</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <span class="font-size-7-swatch mt-5"></span>
        <p class="dashed">Heading</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <span class="font-size-8-swatch mt-5"></span>
        <p class="dashed">Section Header</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <span class="font-size-9-swatch mt-5"></span>
        <p class="dashed">H1</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <span class="font-size-10-swatch mt-5"></span>
        <p class="dashed">Standard-Title</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <span class="font-size-11-swatch mt-5"></span>
        <p class="dashed">Currently Unused</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <span class="font-size-12-swatch mt-5"></span>
        <p class="dashed">Error Not Found</p>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "TypographyPalette",
};
</script>

<style scoped lang="scss">
.roboto {
  font-family: "Roboto", "Segoe UI", Arial, Helvetica, sans-serif;
}
.roboto-italic {
  font-family: "Roboto", "Segoe UI", Arial, Helvetica, sans-serif;
  font-style: italic;
}
.roboto-condensed {
  font-family: "Roboto Condensed", "Segoe UI", Arial, Helvetica, sans-serif;
}
.roboto-condensed-italic {
  font-family: "Roboto Condensed", "Segoe UI", Arial, Helvetica, sans-serif;
  font-style: italic;
}
.roboto-condensed-bold {
  font-family: "Roboto Condensed", "Segoe UI", Arial, Helvetica, sans-serif;
  font-weight: 700;
}
.noto {
  font-family: noto_serifregular;
}
.noto-italic {
  font-family: noto_serifitalic;
}
.noto-bold {
  font-family: noto_serifbold;
}
.noto-bold-italic {
  font-family: noto_serifbold_italic;
}
h2 {
  font-size: $font-size-7;
}
h3 {
  font-size: $text-x-lg;
}
.dashed {
  border-bottom: 1px dashed $sec-500;
  padding-bottom: 1rem;
  font-style: italic;
  color: $alt-700;
  font-size: $font-size-1;
}
</style>
