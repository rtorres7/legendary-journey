let data;
if (
  import.meta.env.MODE === "production" ||
  import.meta.env.MODE === "development"
) {
  //TODO: We have to create a production.metadata.json in the root of the project for this not to fail. We need to figure out a better way in order to avoid this.
  data = await import("../../../production.metadata.json");
} else {
  data = await import("./low.metadata.json");
}
export const metadata = data;
