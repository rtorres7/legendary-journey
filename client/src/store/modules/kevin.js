import axios from "@/config/wireAxios";
import router from "@/router";

export default {
  namespaced: true,
  state: {
    loading: true,
    loadingDocument: true,
    document: {},
    data: {
      control_to: [],
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
      date_published: "",
      poc_info: "",
      publication_number: "",
    },
    metadata: {
      countries: [],
      nsa: [],
      topics: [],
      producing_offices: [],
    },
    dissem_orgs: [],
    product_types: [],
  },

  actions: {
    getMetadata({ state, commit }) {
      state.loading = true;
      axios.get("/metadata").then((response) => {
        // console.log(response);
        let metadata = {
          countries: response?.data?.metadata?.criteria?.countries.values,
          nsa: response?.data?.metadata?.criteria?.non_state_actors.values,
          topics: response?.data?.metadata?.crtieria?.topics.values,
          //producing_offices: response?.data?.metadata?.criteria?.producing_offices.values,
          producing_offices: [{ name: "NCTC", fn: "DNI/NCTC" }],
        };
        console.log("OFFICE: ", metadata);
        commit("saveMetadata", metadata);
      });
    },
    saveDraft({ state, commit }, form) {
      state.loading = true;
      let route = router.currentRoute.value;
      let date = route.params.date;
      let id = route.params.id;
      if (import.meta.env.MODE === "offline") {
        //put stuff here
        console.log("lowside");
      } else {
        console.log("inside saveDraft: ", form);
        axios
          .post("/articles/processDocument", {
            document_action: "save",
            // we need analysis_type_id and other mandatory fields here too:
            // analysis_type_id: form.selectedProductType.id,
            analysis_type_id: 1,
            date_published: form.date_published,
            producing_office: "DNI/NCTC",
            // ----------------------------------
            wire_id: date,
            id: id,
            doc_num: form.doc_num,
            classification: form.classification,
            classification_xml: form.classification_xml,
            classification_decl_fmt: form.classification_decl_fmt,
            countries: form.selectedCountries.codes,
            topics: form.selectedTopics.codes,
            non_state_actors: form.selectedActors.codes,
            title: form.title,
            title_classif: form.title_classif,
            title_classif_xml: form.title_classif_xml,
            summary: form.summary,
            summary_classif: form.summary_classif,
            summary_classif_xml: form.summary_classif_xml,
            html_body: form.html_body,
            publication_date: date,
            publication_number: Math.floor(100000 + Math.random() * 900000),
            poc_info: form.poc_info,
          })
          .then((response) => {
            console.log(response);
            commit("saveDocument", response.data);
          });
      }
    },
    publishArticle({ state, commit }, form) {
      state.loading = true;
      let route = router.currentRoute.value;
      let date = route.params.date;
      let id = route.params.id;
      // let date = route.params.wire_id;
      if (import.meta.env.MODE === "offline") {
        console.log("lowside");
      } else {
        axios
          .post("/articles/processDocument", {
            document_action: "publish",
            wire_id: date,
            id: id,
            publication_date: date,
            doc_num: form.doc_num,
            // doc_num: 'WIRe102122-10',
            // analysis_type_id: form.selectedProductType.id,
            analysis_type_id: 1,
            classification: form.classification,
            classification_decl_fmt: form.classification_decl_fmt,
            classification_xml: form.classification_xml,
            // control_to: form.control_to,
            countries: form.selectedCountries.codes,
            date_published: form.date_published,
            // doc_sources: form.doc_sources,
            // document_type: form.document_type,
            html_body: form.html_body,
            // image_caption: form.image_caption,
            non_state_actors: form.selectedActors.codes,
            poc_info: form.poc_info,
            // priority_alert: form.priority_alert,
            // producer: form.producer,
            producing_office: "DNI/NCTC",
            publication_number: Math.floor(100000 + Math.random() * 900000),
            // source_order: form.source_order,
            summary: form.summary,
            summary_classif: form.summary_classif,
            //summary_classif_xml: form.summary_classif_xml,
            title: form.title,
            title_classif: form.title_classif,
            //title_classif_xml: form.title_classif_xml,
            topics: form.selectedTopics.codes,
            worldwide: false,
          })
          .then((response) => {
            console.log(response);
            commit("saveDocument", response.data);
            // if(response.data.status.success????) {
            router.push({
              name: "article",
              params: { doc_num: route.params.doc_num },
            });
            // } else {
            // alert('Error. Document did not publish successfully.');
            // }
          });
      }
    },
    getDocumentData({ state, commit }, article) {
      state.loadingDocument = true;
      if (import.meta.env.MODE === "offline") {
        console.log("Article: ");
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
            console.log("Document Data (response): ", response);
            console.log(response?.data?.title);
            let data = {
              control_to: response?.data?.control_to,
              countries: response?.data?.countries,
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
              doc_num: response?.data?.doc_num,
              date_published: response?.data?.date_published,
              poc_info: response?.data?.poc_info,
              publication_number: response?.data?.publication_number,
            };
            console.log(data.title);
            // commit("saveDocument", document1);
            // commit("saveDocument", response?.data);
            commit("saveData", data);
          });
      }
    },
    getDissemOrgs({ state, commit }) {
      state.loading = true;
      if (import.meta.env.MODE === "offline") {
        //low side metadata
      } else {
        axios.get("wires/get_dissem_orgs").then((response) => {
          console.log("Dissem Orgs: ", response?.data);
          let dissem_orgs = response?.data?.dissem_orgs;
          commit("saveOrgs", dissem_orgs);
        });
      }
    },
    getProductTypes({ state, commit }) {
      state.loading = true;
      if (import.meta.env.MODE === "offline") {
        //low side metadata
      } else {
        axios.get("/wires/get_product_types").then((response) => {
          console.log("Product Types: ", response?.data);
          let product_types = response?.data.product_types;
          commit("saveProductTypes", product_types);
        });
      }
    },
  },

  mutations: {
    saveDocument(state, document) {
      state.document = document;
      state.loading = false;
      // state.document.title = document.title
    },
    saveData(state, data) {
      state.data.control_to = data.control_to;
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
      state.loadingDocument = false;
    },
    saveMetadata(state, metadata) {
      state.metadata.countries = metadata.countries;
      state.metadata.nsa = metadata.nsa;
      state.metadata.topics = metadata.topics;
      state.metadata.producing_offices = metadata.producing_offices;
      state.loading = false;
    },
    saveOrgs(state, dissem_orgs) {
      state.dissem_orgs = dissem_orgs;
    },
    saveProductTypes(state, product_types) {
      state.product_types = product_types;
    },
  },
};
