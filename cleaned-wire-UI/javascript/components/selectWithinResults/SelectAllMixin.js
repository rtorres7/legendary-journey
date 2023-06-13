import { mapState } from "vuex";
import { isEmpty } from "lodash";

export default {
  computed: {
    ...mapState("search", ["results"]),

    productIds() {
      return this.results.flatMap((product) =>
        isEmpty(product.needed) ? [product.id] : []
      );
    },
  },

  props: ["form"],

  data() {
    return {
      allSelected: false,
      indeterminate: false,
    };
  },

  methods: {
    toggleAll(checked) {
      this.form.checked = checked ? this.productIds : [];
    },
    numProducts() {
      return this.productIds.length;
    },
  },

  watch: {
    form: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal.checked.length === 0) {
          this.indeterminate = false;
          this.allSelected = false;
        } else if (newVal.checked.length === this.productIds.length) {
          this.indeterminate = false;
          this.allSelected = true;
        } else {
          this.indeterminate = true;
          this.allSelected = false;
        }
      },
    },
  },
};
