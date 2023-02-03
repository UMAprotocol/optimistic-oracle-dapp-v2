import { Button } from "@/components";
import { blueGrey700 } from "@/constants";
import { addOpacityToHsl } from "@/helpers";
import { usePanelContext } from "@/hooks";
import { AnimatePresence, motion } from "framer-motion";
import NextLink from "next/link";
import AncillaryData from "public/assets/icons/ancillary-data.svg";
import Close from "public/assets/icons/close.svg";
import USDC from "public/assets/icons/currencies/usdc.svg";
import Info from "public/assets/icons/info.svg";
import Pencil from "public/assets/icons/pencil.svg";
import UMA from "public/assets/icons/projects/uma.svg";
import Timestamp from "public/assets/icons/timestamp.svg";
import { CSSProperties, useEffect, useRef } from "react";
import { FocusOn } from "react-focus-on";
import styled from "styled-components";
import { ChainIcon } from "./ChainIcon";
import { ExpiryTypeIcon } from "./ExpiryTypeIcon";
import { OoTypeIcon } from "./OoTypeIcon";

export function Panel() {
  const { content, page, panelOpen, closePanel } = usePanelContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayVisibleColor = addOpacityToHsl(blueGrey700, 0.75);
  const overlayHiddenColor = addOpacityToHsl(blueGrey700, 0);
  const open = panelOpen;

  useEffect(() => {
    if (open) {
      contentRef?.current?.scrollTo({ top: 0 });
    }
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <Overlay
            onClick={closePanel}
            initial={{ backgroundColor: overlayHiddenColor }}
            animate={{ backgroundColor: overlayVisibleColor }}
            exit={{ backgroundColor: overlayHiddenColor }}
          />
        )}
      </AnimatePresence>
      <FocusOn
        enabled={open}
        onClickOutside={closePanel}
        onEscapeKey={closePanel}
        preventScrollOnFocus
      >
        <Content
          ref={contentRef}
          role="dialog"
          aria-modal={open}
          aria-labelledby="panel-title"
          style={
            {
              "--right": open ? 0 : "var(--panel-width)",
            } as CSSProperties
          }
        >
          <TitleWrapper>
            <IconWrapper>
              <UMA />
            </IconWrapper>
            <Title id="panel-title">
              More than 2.5 million people traveled through a TSA checkpoint on
              any day by December 31, 2022
            </Title>
            <CloseButton aria-label="close panel" onClick={closePanel}>
              <CloseIconWrapper>
                <CloseIcon />
              </CloseIconWrapper>
            </CloseButton>
          </TitleWrapper>
          <ActionsWrapper>
            <SectionTitleWrapper>
              <PencilIcon />
              <SectionTitleText>Assertion</SectionTitleText>
            </SectionTitleWrapper>
            <ValueWrapper>
              <ValueText>True</ValueText>
            </ValueWrapper>
            <ActionsInnerWrapper>
              <ActionWrapper>
                <ActionText>
                  Dispute Bond
                  <InfoIcon />
                </ActionText>
                <ActionText>
                  <USDCIcon />
                  $500
                </ActionText>
              </ActionWrapper>
              <ActionWrapper>
                <ActionText>
                  Dispute Reward
                  <InfoIcon />
                </ActionText>
                <ActionText>
                  <USDCIcon />
                  $500
                </ActionText>
              </ActionWrapper>
              <ActionWrapper>
                <ActionText>
                  Challenge period left
                  <InfoIcon />
                </ActionText>
                <ActionText>53 min 11 sec</ActionText>
              </ActionWrapper>
            </ActionsInnerWrapper>
            <ActionButtonWrapper>
              <Button
                variant="primary"
                onClick={() => alert("action")}
                width="100%"
              >
                Dispute
              </Button>
            </ActionButtonWrapper>
          </ActionsWrapper>
          <InfoIconsWrapper>
            <ChainIcon chainId={1} />
            <OoTypeIcon ooType="Optimistic Asserter" />
            <ExpiryTypeIcon expiryType="Event-based" />
          </InfoIconsWrapper>
          <DetailsWrapper>
            <DetailWrapper>
              <SectionTitleWrapper>
                <TimestampIcon />
                <SectionTitleText>Timestamp</SectionTitleText>
              </SectionTitleWrapper>
              <Time>
                <TimeFormat>UTC</TimeFormat> Nov 17 2022 23:00:00{" "}
              </Time>
              <Time>
                <TimeFormat>UNIX</TimeFormat> 1234542652123
              </Time>
            </DetailWrapper>
            <DetailWrapper>
              <SectionTitleWrapper>
                <AncillaryDataIcon />
                <SectionTitleText>Ancillary Data</SectionTitleText>
              </SectionTitleWrapper>
              <SubTitle>String</SubTitle>
              <AncillaryDataText>
                q: title: Did Euler get hacked? , description: Was there a hack,
                bug, user error, or malfeasance resulting in a loss or lock-up
                of tokens in Euler (https://app.euler.finance/) at any point
                after Ethereum Mainnet block number 16175802? This will revert
                if a non-YES answer is proposed.
              </AncillaryDataText>
              <SubTitle>Bytes</SubTitle>
              <AncillaryDataText>
                0x713a207469746c653a204469642045756c657220676574206861636b65643f202c206465736372697074696f6e3a205761732074686572652061206861636b2c206275672c2075736572206572726f722c206f72206d616c66656173616e636520726573756c74696e6720696e2061206c6f7373206f72206c6f636b2d7570206f6620746f6b656e7320696e2045756c6572202868747470733a2f2f6170702e65756c65722e6669
              </AncillaryDataText>
            </DetailWrapper>
            <DetailWrapper>
              <SectionTitleWrapper>
                <AncillaryDataIcon />
                <SectionTitleText>More information</SectionTitleText>
              </SectionTitleWrapper>
              <SubTitle>Requester</SubTitle>
              <Link
                href="https://goerli.etherscan.io/address/0xF40C3EF015B699cc70088c35efA2cC96aF5F8554"
                target="_blank"
              >
                0xF40C3EF015B699cc70088c35efA2cC96aF5F8554
              </Link>
              <SubTitle>Identifier</SubTitle>
              <Link
                href="https://docs.umaproject.org/resources/approved-price-identifiers"
                target="_blank"
              >
                0xB40C3EF015B6919cc70088cF87
              </Link>
              <SubTitle>UMIP</SubTitle>
              <Link
                href="https://github.com/UMAprotocol/UMIPs/blob/master/UMIPs/umip-107.md"
                target="_blank"
              >
                UMIP-107
              </Link>
            </DetailWrapper>
          </DetailsWrapper>
        </Content>
      </FocusOn>
    </>
  );
}

const AnimatedOverlay = motion.div;

const Overlay = styled(AnimatedOverlay)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  z-index: 1;
`;

const Content = styled.div`
  width: var(--panel-width);
  min-height: 100%;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  margin: 0;
  padding: 0;
  transform: translateX(var(--right));
  background: var(--white);
  overflow-y: scroll;
  transition: transform 400ms;
  z-index: 1;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  min-height: 84px;
  padding-inline: 28px;
  padding-block: 20px;
  background: var(--blue-grey-700);
`;

const Title = styled.h2`
  max-width: 400px;
  font: var(--body-md);
  color: var(--light-text);
`;

const IconWrapper = styled.div``;

const CloseButton = styled.button`
  background: transparent;
`;

const CloseIconWrapper = styled.div`
  width: 20px;
  height: 20px;
  margin-top: 6px;
`;

const CloseIcon = styled(Close)``;

const ActionsWrapper = styled.div`
  background: var(--grey-400);
  padding-inline: 28px;
  padding-top: 20px;
  padding-bottom: 24px;
`;

const PencilIcon = styled(Pencil)``;

const ValueWrapper = styled.div`
  display: grid;
  align-items: center;
  min-height: 44px;
  margin-top: 16px;
  margin-bottom: 20px;
  padding-inline: 16px;
  border-radius: 4px;
  background: var(--white);
`;

const ValueText = styled.p`
  font: var(--body-md);
  font-weight: 600;
`;

const ActionsInnerWrapper = styled.div`
  margin-bottom: 16px;
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font: var(--body-sm);
  &:not(:last-child) {
    margin-bottom: 4px;
  }
`;

const InfoIcon = styled(Info)`
  display: inline-block;
  margin-left: 8px;
`;

const ActionText = styled.p`
  display: flex;
  align-items: center;
`;

const USDCIcon = styled(USDC)`
  display: inline-block;
  margin-right: 8px;
`;

const ActionButtonWrapper = styled.div``;

const DetailsWrapper = styled.div`
  padding-inline: 28px;
  padding-bottom: 64px;
`;

const InfoIconsWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-inline: 28px;
  margin-bottom: 42px;
`;

const DetailWrapper = styled.div`
  padding-bottom: 20px;
  &:not(:first-child) {
    padding-top: 22px;
  }
  &:not(:last-child) {
    border-bottom: 1px solid ${addOpacityToHsl(blueGrey700, 0.25)};
  }
`;

const Time = styled.p`
  font: var(--body-sm);
`;

const TimeFormat = styled.span`
  display: inline-block;
  margin-right: 32px;
`;

const TimestampIcon = styled(Timestamp)``;

const AncillaryDataIcon = styled(AncillaryData)``;

const SubTitle = styled.h3`
  font: var(--body-sm);
  font-weight: 600;

  &:not(:first-child) {
    margin-top: 16px;
  }
`;

const AncillaryDataText = styled.p`
  font: var(--body-sm);
`;

const Link = styled(NextLink)`
  font: var(--body-sm);
  text-decoration: none;
  color: var(--red-500);
  transition: opacity var(--animation-duration);

  &:hover {
    opacity: 0.75;
  }
`;

const SectionTitleWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const SectionTitleText = styled.h2`
  font: var(--body-md);
  font-weight: 700;
`;
