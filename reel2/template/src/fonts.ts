import "@fontsource/cairo/arabic-600.css";
import "@fontsource/cairo/arabic-700.css";
import "@fontsource/cairo/latin-600.css";
import "@fontsource/cairo/latin-700.css";
import { continueRender, delayRender } from "remotion";

const handle = delayRender("Loading Cairo");
Promise.all([
  document.fonts.load("700 60px Cairo", "عربي…؟١٥"),
  document.fonts.load("600 60px Cairo", "عربي…؟١٥"),
]).then(() => document.fonts.ready).then(() => continueRender(handle));
