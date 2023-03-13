import lowData from "./low.metadata.json";
import devData from "./development.metadata.json";
let data;
if (import.meta.env.MODE === "low") {
  data = lowData;
} else {
  data = devData;
}
export const metadata = data;
