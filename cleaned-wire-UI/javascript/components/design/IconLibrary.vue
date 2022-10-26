<template>
  <div class="mt-7 icon-library">
    <b-row>
      <b-col class="mr-6">
        <h2>Icons</h2>
        <h3 class="mb-5 alt-700">
          Icons in WIRe act as visual aids to help users complete tasks. They
          are simple, informative, and build on the visual language of the
          design system.
        </h3>
        <img :src="require('@assets/icons.svg')" class="pt-6 pr-6" />
      </b-col>
      <b-col>
        <h3 class="mt-7">Principles</h3>
        <b>Simple over detailed</b>
        <p>
          Detailed icons increase cognitive load. Focus on simplicity to help
          users understand the concept the icon represents and recognize icons
          on smaller screens.
        </p>
        <b>Literally literal</b>
        <p>
          Literal symbols are easier to understand than abstract symbols. When
          possible, use symbols that represent the most basic idea or concept
          instead of a metaphorical one.
        </p>
        <b>Stay professional</b>
        <p>
          The design of an icon communicates tone, much like the content it's
          paired with. Focus on the effectiveness of the message instead of its
          ability to delight. In other words, prioritize representing the
          function, rather than how nice it looks.
        </p>
        <h3 class="mt-7">Creating Icons</h3>
        <b-row
          align="center"
          class="d-flex align-items-center states mb-4 mt-6"
        >
          <b-col>
            <img :src="require('@assets/search-icon.svg')" class="icons" />
          </b-col>
          <b-col>
            <img :src="require('@assets/calendar-icon.svg')" class="icons" />
          </b-col>
          <b-col>
            <img :src="require('@assets/filter.svg')" class="icons" />
          </b-col>
          <b-col>
            <img :src="require('@assets/jump.svg')" class="icons" />
          </b-col>
        </b-row>
        <b>Use established icons</b>
        <p>
          Icons that have been used for a long time worldwide have a higher
          chance of being recognized and understood quickly. Don't reinvent an
          icon that's already been accepted as convention. There are global,
          established conventions for concepts like "search, settings, and
          date." These symbols are effective, and don't need to be redefined.
        </p>

        <b-row
          align="center"
          class="d-flex align-items-center states mb-4 mt-6"
        >
          <b-col>
            <img :src="require('@assets/calendar-icon.svg')" class="icons" />
          </b-col>
        </b-row>

        <b>Limit variations</b>
        <p>
          Use a single icon to represent variations of the same concept. Search
          date, front page date, and schedule alert date should use the same
          calendar icon. Don't create a custom icon for each of these concepts;
          it bloats the icon library and makes it difficult for users to create
          strong connections around a concept.
        </p>
        <b-row
          align="center"
          class="d-flex align-items-center states mb-4 mt-6"
        >
          <b-col>
            <img :src="require('@assets/reset.svg')" class="pair-icons" /><span
              class="pill-button-text"
              >Reset</span
            >
          </b-col>
          <b-col>
            <img :src="require('@assets/rss.svg')" class="pair-icons" /><span
              class="pill-button-text"
              >RSS</span
            >
          </b-col>
          <b-col>
            <img :src="require('@assets/save.svg')" class="pair-icons" /><span
              class="pill-button-text"
              >Save</span
            >
          </b-col>
          <b-col>
            <img :src="require('@assets/stats.svg')" class="pair-icons" /><span
              class="pill-button-text"
              >Metrics</span
            >
          </b-col>
        </b-row>
        <b>Pairing icons with text</b>
        <p>
          The purpose of an icon is to clarify the content by providing a visual
          cue and improve legibility and scannability of the user interface. In
          general, icons should be placed near a label or title. Never use an
          icon to replace a name of a product or feature; the exception being an
          icon that's a universally understood action, like the "x" icon that
          represents deletions.
        </p>
        <b>Keep diversity in mind</b>
        <p>
          When possible, use a universally recognized icon. However, there will
          be times where only a locally understood icon will work to communicate
          a concept. When deciding what symbol should be used, check that it
          will be understood at a glance by people from different cultures and
          backgrounds.
        </p>
        <h3 class="mt-7">When to use icons</h3>
        <p>
          Icons are powerful visual helpers and should be used with care.
          Overuse quickly results in user interfaces that are visually
          overwhelming or distracting. Icons are commonly used:
        </p>
        <ul>
          <li>In primary navigation</li>
          <li>In page headers and section titles</li>
          <li>
            In banners to bring attention to a specific theme, such as an
            announcement or an error
          </li>
          <li>Inline within text to add clarity</li>
          <li>To direct attention to something the user can take action on</li>
        </ul>
        <b-row
          align="center"
          class="d-flex align-items-center states mb-4 mt-6"
        >
          <b-col>
            <img
              class="vanity-icons"
              :src="require('@assets/searchpage-icon.svg')"
            />
          </b-col>
          <b-col>
            <img
              class="vanity-icons"
              :src="require('@assets/_temp_536-icon.svg')"
            />
          </b-col>
          <b-col>
            <img
              class="vanity-icons"
              :src="require('@assets/regions-icon.svg')"
            />
          </b-col>
          <b-col>
            <img
              class="vanity-icons"
              :src="require('@assets/folders-icon.svg')"
            />
          </b-col>
        </b-row>

        <h3 class="mt-7">Vanity icons</h3>
        <p>
          Vanity icons reinforce messaging in page experiences that are seen
          more than once. Vanity icons are:
        </p>
        <ul>
          <li>
            Bigger than system icons and have a stronger weight to add visual
            balance to the layout
          </li>
          <li>Held within the Vanity Title component</li>
        </ul>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import VanityTitle from "../vanity/VanityTitle";
export default {
  name: "IconLibrary",
  components: { VanityTitle },
};
</script>

<style scoped lang="scss">
.icons {
  height: 24px;
  width: 24px;
}
.pair-icons {
  height: 16px;
  width: 16px;
}
.icon-grid {
  display: grid;
  gap: 0.25rem;
  grid-auto-rows: 6rem;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
}
.vanity-icons {
  height: 60px;
  width: 60px;
}
.states {
  background-color: $alt-100;
  width: 100%;
  height: 100px;
  border: 1px solid $alt-300;
}
.pill-button-text {
  margin-left: 4px;
  font-size: $font-size-1;
  color: $pri-800;
}
</style>
