// Manually verified tokens with custom GitHub links
// These tokens have been verified by the Ward AI team

export interface ManuallyVerifiedToken {
  address: string
  name: string
  symbol: string
  githubUrl: string
  verifiedDate: string
  notes?: string
}

export const MANUALLY_VERIFIED_TOKENS: ManuallyVerifiedToken[] = [
  {
    address: "WARDmUpYMKh6V42Uod2P1MNUcY1TCJ5RXuiUDKs8Wpf",
    name: "Ward AI",
    symbol: "WARD",
    githubUrl: "https://github.com/ward-ai/ward-ai-core",
    verifiedDate: "2024-01-15",
    notes: "Official Ward AI security platform token",
  },
  {
    address: "9ezFthWrDUpSSeMdpLW6SDD9TJigHdc4AuQ5QN5bpump",
    name: "XerisCoin",
    symbol: "XERIS",
    githubUrl: "https://github.com/ZZachWWins/xeriscoin_testnet_localalpha_v1",
    verifiedDate: "2024-01-20",
    notes: "Manually verified by Ward AI team",
  },
]

export function getManuallyVerifiedToken(address: string): ManuallyVerifiedToken | undefined {
  return MANUALLY_VERIFIED_TOKENS.find((token) => token.address.toLowerCase() === address.toLowerCase())
}

export function isManuallyVerified(address: string): boolean {
  return MANUALLY_VERIFIED_TOKENS.some((token) => token.address.toLowerCase() === address.toLowerCase())
}
