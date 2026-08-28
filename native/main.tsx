import { createRoot } from "react-dom/client";
import { Capacitor } from "@capacitor/core";
import AdventureApp from "../app/adventure/AdventureApp";
import PwaInstallGuide from "./PwaInstallGuide";
import "./native.css";

const root = document.getElementById("root");
if (!root) throw new Error("Native app root was not found");

const hostedWebApp = !Capacitor.isNativePlatform();
if (hostedWebApp && "serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("./install-sw.js").catch(() => undefined);
  });
}

createRoot(root).render(<><AdventureApp /><PwaInstallGuide enabled={hostedWebApp} /></>);
