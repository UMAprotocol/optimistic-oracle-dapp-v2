"use client";

import { useNotificationsContext } from "@/hooks";
import { Root as Portal } from "@radix-ui/react-portal";
import { animated, useTransition } from "@react-spring/web";
import styled from "styled-components";
import { useIsClient } from "usehooks-ts";
import { Notification } from "./Notification";

export function Notifications() {
  const isClient = useIsClient();
  const { notifications, removeNotification } = useNotificationsContext();

  const transitions = useTransition(Object.values(notifications), {
    keys: Object.keys(notifications),
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { mass: 1, tension: 500, friction: 40 },
  });

  if (!isClient) return null;

  return (
    <Portal>
      <Wrapper>
        {transitions(
          (style, notification) =>
            notification && (
              <AnimatedNotification
                style={style}
                {...notification}
                dismiss={removeNotification}
              />
            ),
        )}
      </Wrapper>
    </Portal>
  );
}

const AnimatedNotification = animated(Notification);

const Wrapper = styled.div`
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  display: grid;
  gap: 10px;
  padding: 15px;
`;
