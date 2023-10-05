import dashboard from "./modules/dashboard";
import saved from "./modules/saved";

const workspaceModules = {
  ws_dashboard: {
    ...dashboard,
  },
  ws_saved: {
    ...saved,
  },
};

console.log("workspaceModules: ", workspaceModules);

export default workspaceModules;
