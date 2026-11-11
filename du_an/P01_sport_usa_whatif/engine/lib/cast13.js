// Dàn nhân vật E13 (NBA): Boston Celtics vs Philadelphia 76ers. Số áo: ESPN box score event 401909961 (10/11/2026).
// Celtics: áo xanh lá chữ "BOSTON" trắng, số trắng viền vàng kim; KHÔNG logo, KHÔNG nhà tài trợ. 76ers: lib/cast12.js (+ Embiid, Edgecombe).
// Ngoại hình theo ảnh chân dung ESPN: George (tóc xoăn ngắn, râu quai nón dày), Tatum (tóc xoăn ngắn, râu quai nón), White (đầu cạo, râu ngắn).
import { makeCharacter } from './nhanvat2.js';
import { PHI } from './cast12.js';
const BASE = { edgeSoft: 1, tank: true, shorts: true, sockAt: 0.78, shortsTo: 0.84, socks: '#f4f4f4', shoes: '#1c1c1c', skinMix: 1, brows: false, eyeScale: 2.3, frontNumberSize: 0.7, backNumberSize: 0.95, numberDrop: 0.16,
  smooth: { jersey: 12, pants: 18, socks: 6, shoes: 10, skin: 4, head: 8 }, puff: { jersey: 0.022, pants: 0.055, socks: 0.006, shoes: 0.02, skin: 0, hand: 0 } };
export const BOS = { ...BASE, jersey: '#0a8a45', pants: '#0a8a45', numberColor: '#ffffff', numberOutline: '#BA9653', wordmark: 'BOSTON', wordmarkColor: '#ffffff', collar: '#ffffff', pantsStripes: ['#ffffff', '#BA9653'] };
const IN = 0.0254;
export const GEORGE = (lib, o = {}) => makeCharacter(lib, { ...BOS, number: 13, backName: 'GEORGE', heightM: 80 * IN, skin: '#9e6a4a', hairStyle: 'proc:curlytop', hairColor: '#120c08', beardStyle: 'full', beardColor: '#120c08', build: 'slim', ...o });
export const TATUM = (lib, o = {}) => makeCharacter(lib, { ...BOS, number: 0, backName: 'TATUM', heightM: 80 * IN, skin: '#b07a56', hairStyle: 'proc:curlytop', hairColor: '#120c08', beardStyle: 'full', beardColor: '#120c08', ...o });
export const WHITE = (lib, o = {}) => makeCharacter(lib, { ...BOS, number: 9, backName: 'WHITE', heightM: 76 * IN, skin: '#e2b48e', hairStyle: 'proc:buzz', hairColor: '#3a2a1e', beardStyle: 'full', beardColor: '#3a2a1e', ...o });
export const QUETA = (lib, o = {}) => makeCharacter(lib, { ...BOS, number: 88, backName: 'QUETA', heightM: 84 * IN, skin: '#9a6648', hairStyle: 'proc:buzz', hairColor: '#120c08', beardStyle: 'goatee', beardColor: '#120c08', build: 'big', ...o });
export const WALSH = (lib, o = {}) => makeCharacter(lib, { ...BOS, number: 27, backName: 'WALSH', heightM: 78 * IN, skin: '#a87454', hairStyle: 'proc:fade', hairColor: '#120c08', build: 'slim', ...o });
export const EMBIID = (lib, o = {}) => makeCharacter(lib, { ...PHI, number: 21, backName: 'EMBIID', heightM: 84 * IN, skin: '#9a6648', hairStyle: 'proc:buzz', hairColor: '#120c08', beardStyle: 'goatee', beardColor: '#120c08', build: 'big', ...o });
export const EDGE = (lib, o = {}) => makeCharacter(lib, { ...PHI, number: 77, backName: 'EDGECOMBE', heightM: 77 * IN, skin: '#a87454', hairStyle: 'proc:fade', hairColor: '#120c08', build: 'slim', ...o });
