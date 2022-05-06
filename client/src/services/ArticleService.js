import axios from "axios"

export default {
  async getArticles() {
    let res = await axios.get("http://localhost:3000/articles");
    return res.data;
  },
  async getArticle(articleId) {
    let res = await axios.get("http://localhost:3000/articles/" + articleId);
    return res.data;
  }
}