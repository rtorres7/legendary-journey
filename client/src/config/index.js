let file;
if (
  import.meta.env.MODE === "production" ||
  import.meta.env.MODE === "development"
) {
  file = "../../../production.metadata.json";
} else {
  file = "./low.metadata.json";
}
const data = await import(file);
export const metadata = data;
