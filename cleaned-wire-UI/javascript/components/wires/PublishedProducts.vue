<template>
  <b-card id="publishedProducts" class="card-info">
    <h2 class="info-title d-flex separator mt-6 pb-2">
      Add Published Products
    </h2>
    <p class="pt-3">
      Drag/drop products from the list below into the table of contents to the
      left.
    </p>
    <span>
      <label>Published on</label>
      <div>
        <b-button
          variant="link"
          class="pt-0 px-2"
          @click="showDatePicker = !showDatePicker"
          title="Select Products That Were Previously Published"
          aria-label="Published Products Calendar"
        >
          <img
            :src="require('@assets/calendar-icon.svg')"
            alt="calendar"
            class="calendar-icon"
          />
        </b-button>
        <label v-if="!showDatePicker" class="text-nowrap"
          >{{ formattedSelectedDate }}
        </label>
        <UniversalDateTimePicker
          v-if="showDatePicker"
          :timestamp="selectedDate === 'recent' ? featureDate : selectedDate"
          :includeTime="false"
          @newTimestamp="dateChanged"
        />
      </div>
    </span>
    <Spinner v-if="working || user.loading" size="32" />
    <div class="pt-4 mb-8" v-else>
      <draggable
        id="add_published"
        :group="{ name: 'wire-products', pull: 'clone', put: false }"
        sort="false"
        class="list-unstyled"
        tag="ul"
        :list="publishedProducts"
        handle=".sort-handle"
        @remove="handleRemove"
      >
        <li
          v-for="product in publishedProducts"
          :key="product.id"
          class="feature sort-handle"
        >
          <WireDocument :document="product.document" :mainView="false" />
        </li>
        <li class="notFound pt-4" v-if="publishedProducts.length === 0">
          <label v-if="selectedDateHasWire">
            All products from {{ selectedDate }} are already included in this
            book.</label
          >
          <label v-else>
            No WIRe products were published on
            <span class="text-nowrap">{{ selectedDate }}</span> .</label
          >
        </li>
      </draggable>
    </div>
  </b-card>
</template>

<script>
import WireDocument from "../wires/WireDocument";
import Spinner from "@shared/Spinner";
import UniversalDateTimePicker from "@shared/UniversalDateTimePicker";
import axios from "axios";
import draggable from "vuedraggable";
import { mapState } from "vuex";

export default {
  name: "PublishedProducts",
  components: {
    Spinner,
    UniversalDateTimePicker,
    draggable,
    WireDocument,
  },
  data() {
    return {
      selectedDate: "recent",
      publishedProducts: [],
      selectedDateHasWire: false,
      showDatePicker: false,
      working: false,
    };
  },
  props: {
    wire: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.loadAllPublishedProducts();
    this.$bus.$on("featureUpdated", () => {
      this.loadAllPublishedProducts();
    });
  },
  destroyed() {
    this.$bus.$off("featureUpdated");
  },
  computed: {
    ...mapState("user", ["user", "loading"]),
    featureDate() {
      return this.$route.query.date || this.$route.params.date;
    },
    formattedSelectedDate() {
      return this.selectedDate === "recent"
        ? ""
        : this.$moment(this.selectedDate, "YYYY-MM-DD").format("D MMMM YYYY");
    },
  },
  methods: {
    dateChanged(newVal) {
      this.selectedDate = newVal;
      this.loadAllPublishedProducts();
    },
    handleRemove(evt) {
      this.publishedProducts.splice(evt.oldDraggableIndex, 1);
    },
    loadAllPublishedProducts() {
      this.showDatePicker = false;
      this.working = true;

      this.publishedProducts = [];
      return axios
        .get("/products", {
          params: {
            publication_date: this.selectedDate,
            filter_by_date: this.featureDate,
          },
        })
        .then((response) => {
          this.selectedDate = this.$moment(response.data.date).format(
            "YYYY-MM-DD"
          );
          this.publishedProducts = response.data.wireProducts;
          this.selectedDateHasWire = response.data.status === "ok";
          this.working = false;
        })
        .catch((e) => {
          this.working = false;
          this.selectedDateHasWire = false;
        });
    },
  },
  watch: {
    $route() {
      this.selectedDate = "recent";
      this.loadAllPublishedProducts();
    },
  },
};
</script>

<style scoped lang="scss">
.calendar-icon {
  height: 30px;
  width: 30px;
}

.separator {
  border-bottom: 1px solid $alt-400;
  margin-bottom: 5px;
}
.info-title {
  font-family: $font-family-heading;
  font-size: $font-size-6;
  color: $pri-800;
  line-height: 1.5;
}
label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}

button {
  &:focus {
    outline: 1px dotted $alt-500;
  }
}
</style>
