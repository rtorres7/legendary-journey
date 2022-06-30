import axios from "axios";
export default {
  namespaced: true,
  state: {
    loading: true,
    issues: {},
  },

  actions: {
    loadIssues({ state, commit }) {
      state.loading = true;
      axios.get("/issues").then((response) => {
        commit("importIssues", response.data);
        commit("sendToMetaData");
      });
    },
  },

  getters: {
    topicsAsOptions(state) {
      var topics = {
        grouped: true,
        criteria: "topics[]",
        items: [],
      };
      for (const ind in state.issues) {
        const issue = state.issues[ind];
        var issueOption = {
          text: issue.name,
          items: [],
        };
        for (const topicInd in issue.topics) {
          const topic = issue.topics[topicInd];
          issueOption.items.push({
            code: topic.codes[0],
            text: topic.name,
          });
        }
        topics.items.push(issueOption);
      }
      return topics;
    },

    issuesAsOptions(state) {
      var issues = {
        grouped: false,
        criteria: "issues[]",
        items: [],
      };
      for (const ind in state.issues) {
        const issue = state.issues[ind];
        issues.items.push({
          text: issue.name,
          code: issue.code,
        });
      }
      return issues;
    },
  },

  mutations: {
    importIssues(state, data) {
      state.issues = data.issues;
      state.loading = false;
    },

    sendToMetaData(state) {
      var issues = {};
      var topics = {};
      for (const i in state.issues) {
        const issue = state.issues[i];
        issues[issue.code] = issue.name;
        for (const t in issue.topics) {
          const topic = issue.topics[t];
          for (const ind in topic.codes) {
            const code = topic.codes[ind];
            topics[code] = topic.name;
          }
        }
      }
      this.commit("metadata/addMeta", { issues, topics });
    },
  },
};
