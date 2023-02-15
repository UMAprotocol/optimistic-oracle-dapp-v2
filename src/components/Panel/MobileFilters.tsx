import { Base } from "./Base";

interface Props {
  panelOpen: boolean;
  closePanel: () => void;
}
export function MobileFilters({ panelOpen, closePanel }: Props) {
  return (
    <Base panelOpen={panelOpen} closePanel={closePanel}>
      <div>Filters</div>
    </Base>
  );
}
