// src/main.tsx
import { createRoot } from "react-dom/client";
import App from "./App"; // ✅ makni .tsx — Vite i TS to automatski dodaju
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
