import "./style.css";

import { ApplicationController } from "./controllers/application-controller";

const app =
  document.querySelector<HTMLDivElement>(
    "#app"
  );

if (!app) {
  throw new Error(
    "Elemento #app não encontrado"
  );
}

const applicationController =
  new ApplicationController(app);

applicationController.start();