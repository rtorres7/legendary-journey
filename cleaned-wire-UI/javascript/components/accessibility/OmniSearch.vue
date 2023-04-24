<template>
  <div>
    <h2 class="mt-5">Omni Search</h2>
    Our omni search is used primarily in two places:
    <ol>
      <li>In the navbar</li>
      <li>On the search/regions/subregions/countries/issues pages</li>
    </ol>

    <i>Note:</i> There is a shortcut to jump to the search bar in the shortcuts
    section above.

    <h2 class="mt-5">Omni Search Usage</h2>
    The omni search bar attempts to provide you with quick links to get you
    where you need to go. For instance, if you want to visit the China country
    page, simply type China into the search box, use the arrow down key to
    select the link directly to the China page. Follow that link to visit the
    page. The search bar attempts to provide quick links to:
    <ul>
      <li>Country pages</li>
      <li>Region pages</li>
      <li>SubRegion Pages</li>
      <li>Issue Pages</li>
      <li>Document pages (when entering a docnum)</li>
    </ul>

    If you just want to do a keyword search, you may press "enter" at any time
    to perform a keyword search with the text you have entered.
  </div>
</template>

<script>
export default {
  name: "OmniSearch",
};
</script>

<style scoped lang="scss"></style>
