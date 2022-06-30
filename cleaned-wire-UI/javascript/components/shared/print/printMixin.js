import { mapState } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      text: "",
    };
  },

  methods: {
    loadModal() {
      axios
        .get("/pdf_books/new?wants=wire&wire_id=" + this.date)
        .then((response) => {
          $("#print-modal-text").html(response.data);
        });
    },
  },

  computed: {
    ...mapState("articles", ["daily_wire"]),
    date() {
      return this.$route.params.date
        ? this.$route.params.date
        : this.daily_wire.publication_date;
    },
  },
};
