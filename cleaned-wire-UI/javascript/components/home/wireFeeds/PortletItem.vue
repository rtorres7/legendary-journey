<template>
  <div class="feed-item" :class="{ locked }">
    <div class="feed-item-content d-flex py-5">
      <Date fullDate :documentDate="item.published" />
      <div class="feed-item-headline font-size-3">
        <DocumentLink
          v-if="ptype === 'search'"
          :document="item"
          :section="section"
          @locked="locked = true"
          :returnPath="returnPath"
        />
        <a v-else :href="item.link">
          <span class="portion_marked_field">{{
            feedItemTitleClassification
          }}</span>
          {{ feedItemTitle }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Date from "@shared/Date";
import DocumentLink from "@shared/DocumentLink";

export default {
  name: "PortletItem",
  components: { Date, DocumentLink },
  props: ["item", "ptype", "returnPath", "section"],
  data() {
    return {
      titleRegex: /\([^)]*\)/,
      locked: false,
    };
  },
  computed: {
    feedItemTitle() {
      if (this.item.title_classification) {
        return this.item.title;
      } else {
        return this.item.title.split(this.titleRegex)[1];
      }
    },

    feedItemTitleClassification() {
      if (this.item.title_classification) {
        return this.item.title_classification;
      } else {
        return this.item.title.match(this.titleRegex)[0];
      }
    },
  },
};
</script>

<style scoped lang="scss">
.feed-item-headline {
  font-family: $heading-stylized;
}

.locked {
  background-color: $alt-300;
}

.feed-item .feed-item-content {
  border-top: 1px solid $alt-500;
}

/* On the first item in a list, draw the border-top only if it's locked */
.feed-item:first-child {
  &.locked .feed-item-content {
    border-top: 1px solid $alt-500;
  }

  &:not(.locked) .feed-item-content {
    border-top: unset;
  }
}

/* add padding if locked, margin otherwise. This lets the border partially fill the .feed-item 
     if viewable and go full width if locked */
.feed-item {
  &.locked .feed-item-content {
    padding-left: $spacer-7;
    padding-right: $spacer-7;
  }
  &:not(.locked) .feed-item-content {
    margin-left: $spacer-7;
    margin-right: $spacer-7;
  }
}

/* For feed items that are preceded by a locked feed, use padding and not margin. This rule works
     because it has higher specificity */
.feed-item.locked + .feed-item {
  .feed-item-content {
    padding-left: $spacer-7;
    padding-right: $spacer-7;
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
