import { useState } from "react";
import styled from "styled-components";
import { CheckboxDropdown, Items } from "./CheckboxDropdown";

export function Filters() {
  const [checkedTypes, setCheckedTypes] = useState<Items>({
    all: {
      checked: true,
      count: 256,
    },
    "event-based": {
      checked: false,
      count: 128,
    },
    "time-based": {
      checked: false,
      count: 128,
    },
  });

  return (
    <Wrapper>
      {/* <Search /> */}
      <CheckboxDropdown items={checkedTypes} setChecked={setCheckedTypes} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 96px;
  display: flex;
  align-items: center;
  background: var(--white);
`;
