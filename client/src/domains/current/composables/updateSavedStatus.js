import { inject, ref } from "vue";
import axios from "@/shared/config/wireAxios";
import { useRoute } from "vue-router";
import { productDetails } from "@current/data";

export default function updateSavedStatus() {
  const route = useRoute();
  const createNotification = inject("create-notification");
  const createSimpleNotification = inject("create-simple-notification");
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
      //(high side) products page needs to use the attribute document_id from wires_controller
      let id;
      if (
        route.name == "products" &&
        (import.meta.env.MODE == "production" ||
          import.meta.env.MODE == "development")
      ) {
        id = product.document_id;
      } else {
        id = product.id;
      }
      let savedPromise;
      if (product.saved) {
        removingProduct.value = true;
        savedPromise = axios
          .delete("/workspace/saved/" + id)
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
              createSimpleNotification({
                message: `Saved Product Removed`,
              });
            }
          });
      } else {
        savingProduct.value = true;
        savedPromise = axios.put("/workspace/saved/" + id).then((response) => {
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
            createSimpleNotification({
              message: `Product Saved`,
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
    createSimpleNotification,
  };
}
