import { DecimalInput } from "@/components/DecimalInput";
import styled from "styled-components";

interface Props {
  value: string;
  onInput: (value: string) => void;
  addErrorMessage: (value: string) => void;
  removeErrorMessage: () => void;
  disabled: boolean;
}
export function ProposeInput(delegatedProps: Props) {
  return (
    <Wrapper>
      <DecimalInput {...delegatedProps} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-top: 16px;
  margin-bottom: 20px;
`;
