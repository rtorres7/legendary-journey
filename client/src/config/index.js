let file;
if (
  import.meta.env.MODE === "production" ||
  import.meta.env.MODE === "development"
) {
  file = "/production.metadata.json";
} else {
  file = "./low.metadata.json";
}
const data = await fetch(file);
export const metadata = await data.json();
