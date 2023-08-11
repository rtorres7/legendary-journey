import { inject, ref } from "vue";
import axios from "@/shared/config/wireAxios";
import { productDetails } from "@current/data";

export default function updateSavedStatus() {
  const createNotification = inject("create-notification");
  const savingProduct = ref(false);
  const removingProduct = ref(false);

  const save = (product, event) => {
    if (event) {
      event.preventDefault();
    }
    if (import.meta.env.MODE === "offline") {
      let documentMatch = productDetails.find(
        ({ data }) => data.doc_num === product.doc_num
      );
      documentMatch.data.saved = !product.saved;
      product.saved = !product.saved;
    } else {
      let savedPromise;
      if (product.saved) {
        removingProduct.value = true;
        savedPromise = axios
          .delete("/workspace/saved/" + product.feature_id)
          .then((response) => {
            if (response.data.error) {
              removingProduct.value = false;
              createNotification({
                title: "Error",
                message: response.data.error,
                type: "error",
                autoClose: false,
              });
            } else {
              removingProduct.value = false;
              createNotification({
                title: "Product Removed",
                message: `Product ${product.doc_num} has been removed.`,
                type: "success",
              });
            }
          });
      } else {
        savingProduct.value = true;
        savedPromise = axios
          .put("/workspace/saved/" + product.feature_id)
          .then((response) => {
            if (response.data.error) {
              savingProduct.value = false;
              createNotification({
                title: "Error",
                message: response.data.error,
                type: "error",
                autoClose: false,
              });
            } else {
              savingProduct.value = false;
              createNotification({
                title: "Product Saved",
                message: `Product ${product.doc_num} has been saved.`,
                type: "success",
              });
            }
          });
      }

      savedPromise.then(() => (product.saved = !product.saved));
    }
  };
  return {
    updateSavedStatus,
    savingProduct,
    removingProduct,
    save,
    createNotification,
  };
}
