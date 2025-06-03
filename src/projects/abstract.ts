import { getInitializerAddress } from "@/helpers/queryParsing";
import type { Address } from "wagmi";

export abstract class Project<T extends string> {
  name: T;
  identifiers?: string[];
  privateIdentifiers?: string[]; // identifiers that are specific to this projectstring, if a request uses one of these, it's always this project
  requesters?: Address[];
  initializers?: Address[]; // if listed then a requests's initializer address must be in this list
  requiredTokens?: {
    [identifier: string]: string[]; // Map of identifier to required tokens for that identifier
  };

  constructor(params: {
    name: T;
    identifiers?: string[];
    privateIdentifiers?: string[]; // identifiers that are specific to this projectstring, if a request uses one of these, it's always this project
    requesters?: Address[];
    initializers?: Address[]; // if listed then a requests's initializer address must be in this list
    requiredTokens?: {
      [identifier: string]: string[]; // Map of identifier to required tokens for that identifier
    };
  }) {
    this.name = params.name;
    this.identifiers = params?.identifiers;
    this.privateIdentifiers = params?.privateIdentifiers;
    this.requesters = params?.requesters;
    this.initializers = params?.initializers;
    this.requiredTokens = params?.requiredTokens;
  }

  private hasValidRequester(requester: string | undefined): boolean {
    // If no requesters configured, requester validation is not applicable
    if (!this.requesters?.length) return true;
    // If requesters configured but no requester provided, invalid
    if (!requester) return false;

    return this.requesters.some(
      (addr) => addr.toLowerCase() === requester.toLowerCase(),
    );
  }

  private hasValidInitializer(
    decodedAncillaryData: string | undefined,
  ): boolean {
    // If no initializers configured, initializer validation is not applicable
    if (!this.initializers?.length) return true;

    const initializer = getInitializerAddress(decodedAncillaryData);
    // If initializers configured but no initializer found in data, invalid
    if (!initializer) return false;

    return this.initializers.some(
      (addr) => addr.toLowerCase() === initializer.toLowerCase(),
    );
  }

  private hasValidIdentifier(decodedIdentifier: string | undefined): boolean {
    // If no identifiers configured, identifier validation is not applicable
    if (!this.identifiers?.length) return true;
    // If identifiers configured but no identifier provided, invalid
    if (!decodedIdentifier) return false;

    return this.identifiers.includes(decodedIdentifier);
  }

  private hasRequiredTokens(
    decodedIdentifier: string | undefined,
    decodedAncillaryData: string | undefined,
  ): boolean {
    // If no required tokens configured, token validation is not applicable
    if (!this.requiredTokens) return true;
    // If required tokens configured but missing required data, invalid
    if (!decodedIdentifier || !decodedAncillaryData) return false;

    const tokensForIdentifier = this.requiredTokens[decodedIdentifier];
    // If no tokens required for this identifier, validation not applicable
    if (!tokensForIdentifier?.length) return true;

    return tokensForIdentifier.every((token) =>
      decodedAncillaryData.includes(token),
    );
  }

  private isPrivateIdentifierMatch(
    decodedIdentifier: string | undefined,
  ): boolean {
    // If we have private identifiers and the identifier matches one, it's a guaranteed match
    return Boolean(
      this.privateIdentifiers?.length &&
        decodedIdentifier &&
        this.privateIdentifiers.includes(decodedIdentifier),
    );
  }

  validate(
    params: Partial<{
      requester: string;
      decodedIdentifier: string;
      decodedAncillaryData: string;
    }>,
  ): boolean {
    const { requester, decodedIdentifier, decodedAncillaryData } = params;

    // If no parameters provided, we can't validate
    if (!requester && !decodedIdentifier && !decodedAncillaryData) {
      return false;
    }

    // Check for private identifier match first
    if (this.isPrivateIdentifierMatch(decodedIdentifier)) {
      return true;
    }

    // Can't validate
    if (
      !this.requesters?.length &&
      !this.requiredTokens &&
      !this.identifiers?.length &&
      !this.initializers?.length
    ) {
      return false;
    }

    // All other validation checks must pass
    return (
      this.hasValidRequester(requester) &&
      this.hasValidInitializer(decodedAncillaryData) &&
      this.hasValidIdentifier(decodedIdentifier) &&
      this.hasRequiredTokens(decodedIdentifier, decodedAncillaryData)
    );
  }
}
