import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import favicon from "@/assets/asililogo.png";

const faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
if (faviconLink) {
  faviconLink.href = favicon;
} else {
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = favicon;
  document.head.appendChild(link);
}

createRoot(document.getElementById("root")!).render(<App />);
