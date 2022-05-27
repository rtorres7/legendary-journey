import { mapState } from "vuex";
import Aggregate from "./Aggregate";

export default {
  components: { Aggregate },
  computed: {
    ...mapState("search", ["aggregations"]),
  },
};
