/**
 * Vérifie les adresses de don fournies par commun-crypto (source unique, commun D-004) :
 * valeurs attendues du programme et checksums.
 */
import { describe, expect, it } from 'vitest';
import { AUTHOR, DONATION_ADDRESSES, isValidBech32, isValidEvmAddress, SPONSORS_URL } from 'commun-crypto/support';

describe('auteur et soutien', () => {
  it("affiche l'auteur sans nom de famille", () => {
    expect(AUTHOR).toEqual({ name: 'Arnaud', handle: 'Patart50', url: 'https://github.com/Patart50' });
    expect(SPONSORS_URL).toBe('https://github.com/sponsors/Patart50');
  });

  it('adresse Bitcoin attendue, checksum bech32 valide', () => {
    const btc = DONATION_ADDRESSES.find((a) => a.id === 'btc')!;
    expect(btc.address).toBe('bc1qd5j0yrrxp6wrk5ds0xne97hdrz5fvxjl8q22p4');
    expect(isValidBech32(btc.address)).toBe(true);
    expect(btc.qr).toBe(`bitcoin:${btc.address}`);
  });

  it('adresse EVM attendue, format valide', () => {
    const evm = DONATION_ADDRESSES.find((a) => a.id === 'evm')!;
    expect(evm.address).toBe('0x7e4b6bad06813506b724b5ea3cc9545a7b97eba4');
    expect(isValidEvmAddress(evm.address)).toBe(true);
    expect(evm.qr).toBe(evm.address);
  });

  it('une adresse altérée est refusée', () => {
    expect(isValidBech32('bc1qd5j0yrrxp6wrk5ds0xne97hdrz5fvxjl8q22p5')).toBe(false);
  });
});
