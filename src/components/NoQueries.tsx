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
      ? "No settled queries yet"
      : page === "verify"
      ? "No queries to verify right now"
      : "No queries to propose answers to right now";

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
      <Text>Come back soon, or check out the {otherPageLinks} page.</Text>
      <ImageWrapper>
        <NoQueriesImage />
      </ImageWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  padding-top: 40px;
  padding-inline: var(--page-padding);
  color: var(--blue-grey-500);
`;

const Title = styled.h1`
  font: var(--header-xs);
  text-align: center;
  margin-bottom: 16px;
`;

const Text = styled.p`
  text-align: center;
  margin-bottom: 32px;
`;

const Link = styled(NextLink)`
  color: var(--red-500);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ImageWrapper = styled.div``;
