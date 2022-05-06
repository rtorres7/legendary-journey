<template>
  <div class="articles container">
    <div class="columns is-multiline">
      <div
        v-for="article in articles"
        :article="articles"
        :key="article.id"
        class="column is-one-quarter"
      >
        <!--<router-link :to="`/article/${article.id}`">-->
        <a :href="`${article.id}`" target="_blank">
          <ArticleCard :article="article" />
        </a>
        <!--</router-link>-->
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ArticleCard from "@/components/ArticleCard";
import ArticleService from "@/services/ArticleService.js";

export default {
  name: "ServerArticleList",
  components: {
    ArticleCard,
  },
  data() {
    return {
      article: {},
      articles: [],
    };
  },
  created() {
    this.getArticlesData();
  },
  methods: {
    async getArticlesData() {
      ArticleService.getArticles().then((articles) => {
        this.articles = articles;
      });
    },
  },
};
</script>
