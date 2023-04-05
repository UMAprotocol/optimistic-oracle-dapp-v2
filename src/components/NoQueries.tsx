import type { PageName } from "@shared/types";
import NextLink from "next/link";
import NoQueriesImage from "public/assets/icons/no-queries.svg";
import styled from "styled-components";

interface Props {
  page: PageName;
}

export function NoQueries({ page }: Props) {
  const titleText =
    page === "settled"
      ? "There are no settled queries yet"
      : page === "verify"
      ? "There are no queries to verify right now"
      : "There are no queries to propose answers to right now";

  const verifyLink = <Link href="/verify">verify</Link>;
  const proposeLink = <Link href="/propose">propose</Link>;
  const settledLink = <Link href="/settled">settled</Link>;

  const verifyOtherPageLinks = (
    <>
      {proposeLink} or {settledLink}
    </>
  );

  const proposeOtherPageLinks = (
    <>
      {verifyLink} or {settledLink}
    </>
  );

  const settledOtherPageLinks = (
    <>
      {verifyLink} or {proposeLink}
    </>
  );

  const otherPageLinks =
    page === "verify"
      ? verifyOtherPageLinks
      : page === "propose"
      ? proposeOtherPageLinks
      : settledOtherPageLinks;

  return (
    <Wrapper>
      <Title>{titleText}</Title>
      <Text>Come back soon or check out the {otherPageLinks} page.</Text>
      <ImageWrapper>
        <NoQueriesImage />
      </ImageWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: transparent;
  color: var(--blue-grey-500);
`;

const Title = styled.h1`
  font: var(--header-xs);
`;

const Text = styled.p``;

const Link = styled(NextLink)``;

const ImageWrapper = styled.div``;
