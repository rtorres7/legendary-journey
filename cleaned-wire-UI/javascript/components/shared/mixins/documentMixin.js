export default {
  props: {
    document: {
      type: Object,
      required: true,
    },
  },
  computed: {
    docNum() {
      return this.$route.params["docNum"] || this.document.doc_num;
    },
    docPath() {
      return "/documents/" + this.docNum;
    },
    portionMarkedTitle() {
      let title = this.document.name || this.document.title;
      if (title.match(/\([^)]*\)/)) {
        return title;
      } else {
        return `(${this.document.title_classif}) ${title}`;
      }
    },
    isCable() {
      return this.document.type === "NcsDocument";
    },
    isDstDocument() {
      return this.document.type === "DstDocument";
    },
    isExtremistProfile() {
      return this.document.product_type_name == "Extremist Profile";
    },
    isLeadershipNote() {
      return this.document.product_type_name == "Leadership Note";
    },
    isLeadershipProfile() {
      return this.document.product_type_name == "Leadership Profile";
    },
    isTerroristNote() {
      return this.document.product_type_name == "Terrorist Note";
    },
    isLeadership() {
      return this.document.type === "LeadershipDocument";
    },
    isOpenSource() {
      return this.document.reporting_type === "reporting.open_source";
    },
    isWire() {
      return this.document.type === "WireDocument";
    },
    daProduct() {
      let daProducts = [
        "DA-",
        "DA",
        "_temp_175 ANALYSIS",
        "_temp_6 MISSION _temp_298",
      ];
      if (this.document.producer) {
        return daProducts.includes(this.document.producer.toUpperCase());
      }
      return false;
    },
  },
  methods: {
    formattedDate(value, showTime) {
      if (value) {
        let format = showTime ? "DD MMM YYYY HH:mm:ss" : "DD MMM YYYY";
        return this.$moment(value).format(format);
      }
    },
  },
};
