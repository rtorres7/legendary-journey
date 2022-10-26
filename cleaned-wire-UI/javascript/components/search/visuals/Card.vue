<template>
  <div
    id="visuals-card"
    class="d-flex flex-column"
    @mouseenter="focused = true"
    @mouseleave="focused = false"
  >
    <div id="overlay-box">
      <img :src="imageUrl" class="image-style p-2" v-if="article.thumbnail" />
      <img
        v-else
        :src="require('@/assets/WIRe-BG-image-TOP.jpg')"
        width="64px"
        height="64px"
      />
      <div class="d-flex flex-column image-box" :class="{ overlay: focused }">
        <div :id="article.doc_num + '-title'" class="m-auto title">
          {{ article.label }}
        </div>
        <div class="mt-auto mx-0 py-3 d-flex links">
          <div class="ml-auto pr-3">
            <a
              @click.stop.prevent
              @click="openWindow"
              :href="routerLink()"
              class="upcase"
            >
              <span class="aria-hidden">View Media</span>
              <span class="sr-only">Open Media for {{ article.label }}</span>
            </a>
          </div>
          <div>|</div>
          <div class="pl-3 mr-auto">
            <router-link
              @focus.native="focused = true"
              @blur.native="focused = false"
              :to="{ name: 'document', params: { docNum: article.doc_num } }"
              :aria-labelledby="article.doc_num + '-title'"
              class="upcase"
            >
              <span aria-hidden="true">View Article</span>
              <span class="sr-only">View {{ article.label }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div id="footer" class="mt-auto d-flex">
      <span v-for="(region, ind) in article.regions" :key="ind">
        {{ region }}<span v-if="ind < article.regions.length - 1">,&nbsp;</span>
      </span>
      <div class="ml-auto">
        {{ article.date_published | moment("DD MMM YYYY") }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: ["article"],

  data() {
    return {
      focused: false,
    };
  },

  methods: {
    routerLink() {
      return this.$router.resolve(
        this.attachmentsPath + this.article.file_name + "?popup=true"
      ).href;
    },

    openWindow() {
      let height =
        (this.article.media_target_height &&
          this.article.media_target_height.replace("px", "")) ||
        450;
      let width =
        (this.article.media_target_width &&
          this.article.media_target_width.replace("px", "")) ||
        800;

      window.open(
        this.routerLink(),
        "_blank",
        "scrollbars" + ",resizable" + ",height=" + height + ",width=" + width
      );
    },
  },

  computed: {
    attachmentsPath() {
      return `/documents/${this.article.doc_num}/attachments/`;
    },

    imageUrl() {
      return this.attachmentsPath + this.article.id + "/thumbnail";
    },
  },
};
</script>

<style scoped lang="scss">
#footer {
  padding: 5px 15px;
}

.image-background {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  max-width: 100%;
}

#overlay-box {
  position: relative;
}

.image-style {
  width: 100%;
}

#visuals-card {
  border: 1px solid $alt-400;
  margin: 10px;
}

.title {
  padding: 0 20px;
  font-size: larger;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-box {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  color: transparent;
}

::v-deep .overlay {
  background-color: $pri-900-transparent;
  color: $text-light;

  a {
    color: $text-light;
  }

  a:focus {
    text-decoration: underline;
    outline: 0;
  }

  a:visited {
    color: $alt-600;
  }

  .links {
    background-color: $pri-900-transparent;
  }
}
::v-deep a {
  color: transparent;
}
</style>
