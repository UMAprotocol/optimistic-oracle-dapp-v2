import { ReactNode } from "react";
import { Base } from "./Base";

interface Props {
  children: ReactNode;
  panelOpen: boolean;
  closePanel: () => void;
}
export function MobileFilters({ children, panelOpen, closePanel }: Props) {
  return (
    <Base panelOpen={panelOpen} closePanel={closePanel}>
      <h1>Filters</h1>
      {children}
    </Base>
  );
}
