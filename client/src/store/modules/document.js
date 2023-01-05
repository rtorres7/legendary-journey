import axios from "@/config/wireAxios";
import { document } from "@/data";
export default {
  namespaced: true,
  state: {
    loading: true,
    document: {},
    data: {
      control_to: [],
      dissem_orgs: [],
      countries: [],
      topics: [],
      non_state_actors: [],
      title: "",
      title_classif: "",
      title_classif_xml: "",
      summary: "",
      summary_classif: "",
      summary_classif_xml: "",
      html_body: "",
      classification: "",
      classification_xml: "",
      classification_decl_fmt: "",
      doc_num: "",
      attachments: [],
      date_published: "",
      poc_info: "",
      publication_number: "",
      product_type_id: null,
      worldwide: null,
    },
  },

  actions: {
    getDocument({ state, commit }, article) {
      state.loading = true;
      if (process.env.NODE_ENV === "low") {
        console.log("[store] getDocumentData: ", document);
        setTimeout(() => commit("saveData", document), 750);
      } else {
        let url =
          "/wires/" +
          article.date +
          "/articles/" +
          article.id +
          "/getDocumentData";
        axios
          .get(url, {
            date: article.date,
            id: article.id,
          })
          .then((response) => {
            console.log("[store] getDocumentData: ", response.data);
            const data = {
              control_to: response?.data?.control_to,
              countries: response?.data?.countries,
              dissem_orgs: response?.data?.dissem_orgs,
              topics: response?.data?.topics,
              non_state_actors: response?.data?.non_state_actors,
              title: response?.data?.title,
              title_classif: response?.data?.title_classif,
              title_classif_xml: response?.data?.title_classif_xml,
              summary: response?.data?.summary,
              summary_classif: response?.data?.summary_classif,
              summary_classif_xml: response?.data?.summary_classif_xml,
              html_body: response?.data?.html_body,
              classification: response?.data?.classification,
              classification_xml: response?.data?.classification_xml,
              classification_decl_fmt: response?.data?.classification_decl_fmt,
              attachments: response?.data?.attachments,
              doc_num: response?.data?.doc_num,
              date_published: response?.data?.date_published,
              poc_info: response?.data?.poc_info,
              product_type_id: response?.data?.product_type_id,
              publication_number: response?.data?.publication_number,
              worldwide: response?.data?.worldwide,
            };
            commit("saveData", data);
          });
      }
    },
  },
  mutations: {
    saveData(state, data) {
      state.data.attachments = data.attachments;
      state.data.control_to = data.control_to;
      state.data.dissem_orgs = data.dissem_orgs;
      state.data.countries = data.countries;
      state.data.topics = data.topics;
      state.data.non_state_actors = data.non_state_actors;
      state.data.title = data.title;
      state.data.title_classif = data.title_classif;
      state.data.title_classif_xml = data.title_classif_xml;
      state.data.summary = data.summary;
      state.data.summary_classif = data.summary_classif;
      state.data.summary_classif_xml = data.summary_classif_xml;
      state.data.html_body = data.html_body;
      state.data.classification = data.classification;
      state.data.classification_xml = data.classification_xml;
      state.data.classification_decl_fmt = data.classification_decl_fmt;
      state.data.doc_num = data.doc_num;
      state.data.date_published = data.date_published;
      state.data.poc_info = data.poc_info;
      state.data.publication_number = data.publication_number;
      state.data.product_type_id = data.product_type_id;
      state.data.worldwide = data.worldwide;
      state.loading = false;
    },
  },
};
