let file;
let data;
if (
  import.meta.env.MODE === "production" ||
  import.meta.env.MODE === "development"
) {
  file = "/production.metadata.json";
  const fetchedData = await fetch(file);
  data = fetchedData.json();
} else {
  file = "./low.metadata.json";
  const importedData = await import(file);
  data = importedData;
}
export const metadata = data;
