"use client";

import { Tooltip } from "@/components";
import Info from "public/assets/icons/info.svg";
import type { ReactNode } from "react";
import { useState } from "react";
import styled from "styled-components";

interface Props {
  content: ReactNode;
}
export function InformationIcon({ content }: Props) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <Tooltip content={content} open={tooltipOpen} onOpenChange={setTooltipOpen}>
      <Button onClick={() => setTooltipOpen(true)}>
        <Info />
      </Button>
    </Tooltip>
  );
}

const Button = styled.button`
  background: none;
  display: inline-block;
  margin-left: 8px;
`;
