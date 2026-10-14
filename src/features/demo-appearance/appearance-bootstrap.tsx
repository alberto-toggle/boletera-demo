import { appearanceStorageKey, defaultAppearance } from "./appearance-config";

/** Resolve the persisted material before paint, independently of widget hydration. */
export function AppearanceBootstrap() {
  const script = `(()=>{let value=${JSON.stringify(defaultAppearance)};try{const stored=localStorage.getItem(${JSON.stringify(appearanceStorageKey)});if(stored==="original"||stored==="glass")value=stored}catch{}document.documentElement.dataset.demoAppearance=value})()`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
