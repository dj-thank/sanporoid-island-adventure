import { createRoot } from "react-dom/client";
import AdventureApp from "../app/adventure/AdventureApp";
import "./native.css";

const root = document.getElementById("root");
if (!root) throw new Error("Native app root was not found");

createRoot(root).render(<AdventureApp />);
