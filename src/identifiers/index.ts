import type { DropdownItem, IdentifierDetails } from "@/types";
import approvedIdentifiers from "@/data/approvedIdentifiersTable";
import { Identifier } from "./abstract";
import type { MetaData, ParsedQuery } from "./abstract";
import { YesOrNoQuery } from "./YesOrNoQuery";
import { AcrossV2 } from "./AcrossV2";
import { MultipleChoiceQuery } from "./MultipleChoiceQuery";
import { MultipleValues } from "./MultipleValues";
import { RopuEthx } from "./RopuEthx";
import { Numerical } from "./Numerical";
import { getTitleAndDescriptionFromTokens } from "@/helpers/queryParsing";

// Default identifier for handling approved identifiers without specific implementations
export class ApprovedIdentifier extends Identifier {
  private identifierDetails: IdentifierDetails;

  constructor(name: string, identifierDetails: IdentifierDetails) {
    // Use the UMIP number from details or default to 0
    const umipNumber = identifierDetails?.umipLink?.number
      ? parseInt(identifierDetails.umipLink.number.match(/\d+/)?.[0] || "0", 10)
      : 0;

    super({
      name,
      umipNumber,
    });

    this.identifierDetails = identifierDetails;

    // Override UMIP URL if it exists in the details
    if (identifierDetails?.umipLink?.url) {
      this.umipUrl = identifierDetails.umipLink.url;
    }
  }

  getMetaData(_decodedAncillaryData: string): MetaData {
    const isSherlock = this.name === "SHERLOCK_CLAIM";

    return {
      title: isSherlock
        ? "Sherlock Claim"
        : this.identifierDetails?.identifier || this.name,
      description:
        this.identifierDetails?.summary ||
        "No description found for this request.",
      umipUrl: this.umipUrl,
      umipNumber: this.umipNumber,
    };
  }

  parseQuery(decodedAncillaryData: string): ParsedQuery {
    return {
      ...this.getMetaData(decodedAncillaryData),
      proposeOptions: this.makeProposeOptions(decodedAncillaryData),
    };
  }

  makeDefaultProposeOptions(): DropdownItem[] {
    // Most approved identifiers are yes/no type
    return [
      { label: "Yes", value: "1", secondaryLabel: "1" },
      { label: "No", value: "0", secondaryLabel: "0" },
      {
        label: "Custom",
        value: "custom",
      },
    ];
  }

  makeProposeOptions(_decodedAncillaryData: string): DropdownItem[] {
    // For now, assume all approved identifiers use yes/no options
    return this.makeDefaultProposeOptions();
  }
}

// Fallback identifier for completely unknown identifiers
export class UnknownIdentifier extends Identifier {
  constructor(name: string) {
    super({
      name,
      umipNumber: 0,
    });
  }

  getMetaData(_decodedAncillaryData: string): MetaData {
    const { title, description } = getTitleAndDescriptionFromTokens(
      _decodedAncillaryData,
    );
    return {
      title: title ?? this.name,
      description: description ?? _decodedAncillaryData,
      umipUrl: this.umipUrl,
      umipNumber: this.umipNumber,
    };
  }

  parseQuery(decodedAncillaryData: string): ParsedQuery {
    return {
      ...this.getMetaData(decodedAncillaryData),
      proposeOptions: this.makeProposeOptions(decodedAncillaryData),
    };
  }

  makeDefaultProposeOptions(): DropdownItem[] {
    // Default to yes/no options
    return [
      { label: "Yes", value: "1", secondaryLabel: "1" },
      { label: "No", value: "0", secondaryLabel: "0" },
      {
        label: "Custom",
        value: "custom",
      },
    ];
  }

  makeProposeOptions(_decodedAncillaryData: string): DropdownItem[] {
    return this.makeDefaultProposeOptions();
  }
}

class IdentifierRegistry {
  private static instance: IdentifierRegistry;
  private identifiers: Map<string, Identifier>;

  private constructor() {
    this.identifiers = new Map();
    this.registerIdentifiers();
  }

  private registerIdentifiers(): void {
    const identifierInstances = [
      new YesOrNoQuery(),
      new MultipleChoiceQuery(),
      new MultipleValues(),
      new RopuEthx(),
      new AcrossV2(),
      new Numerical(),
      // Add more here
    ];

    for (const identifier of identifierInstances) {
      this.identifiers.set(identifier.name, identifier);
    }

    // Register approved identifiers from JSON that don't have specific implementations
    Object.entries(approvedIdentifiers).forEach(([name, details]) => {
      if (!this.identifiers.has(name)) {
        this.identifiers.set(name, new ApprovedIdentifier(name, details));
      }
    });
  }

  public static getInstance(): IdentifierRegistry {
    if (!IdentifierRegistry.instance) {
      IdentifierRegistry.instance = new IdentifierRegistry();
    }
    return IdentifierRegistry.instance;
  }

  public getIdentifierByName(name: string): Identifier {
    // Return the specific identifier if it exists
    const identifier = this.identifiers.get(name);

    if (identifier) {
      return identifier;
    }
    // Complete fallback for unknown identifiers
    const unknownIdentifier = new UnknownIdentifier(name);
    // Cache it for future use
    this.identifiers.set(name, unknownIdentifier);
    return unknownIdentifier;
  }

  public getAllIdentifiers(): Identifier[] {
    return Array.from(this.identifiers.values());
  }

  public getIdentifierByUmipNumber(umipNumber: number): Identifier | undefined {
    const umipString = `umip-${umipNumber}`;
    return Array.from(this.identifiers.values()).find(
      (identifier) => identifier.umipNumber === umipString,
    );
  }
}

// Export a singleton instance
export const identifiers = IdentifierRegistry.getInstance();

// Export types for usage elsewhere
export type { Identifier };
