// Dàn nhân vật E16 (NBA): Minnesota Timberwolves vs Dallas Mavericks. Số áo + chiều cao: ESPN roster + box score event 401909978 (kiểm 13/11/2026).
// MIN: áo xanh navy chữ "MINNESOTA" trắng, số trắng viền xanh lá; DAL: áo TRẮNG chữ "DALLAS" xanh dương, số xanh dương viền navy — KHÔNG logo, KHÔNG nhà tài trợ.
// Ngoại hình theo ảnh chân dung chính thức ESPN: Ball (tóc ngắn, râu quai nón tỉa), Hyland (tóc tết dài buộc sau, ria mảnh), Gobert (đầu cạo sát, râu cằm),
// McDaniels (tóc xoắn, râu cằm), Dosunmu (tóc dreads dài, râu cằm), Kuminga (tóc cắt ngắn, râu cằm);
// Flagg (tóc nâu nhạt, ria lún phún), Irving (tóc ngắn, râu quai nón đen), Risacher (tóc tết, râu cằm), Marshall (tóc xoắn, râu quai nón), Gafford (băng đô trắng, râu quai nón).
import { makeCharacter } from './nhanvat2.js';
const BASE = { edgeSoft: 1, tank: true, shorts: true, sockAt: 0.78, shortsTo: 0.84, socks: '#f4f4f4', shoes: '#1c1c1c', skinMix: 1, brows: false, eyeScale: 2.3, frontNumberSize: 0.7, backNumberSize: 0.95, numberDrop: 0.16,
  smooth: { jersey: 12, pants: 18, socks: 6, shoes: 10, skin: 4, head: 8 }, puff: { jersey: 0.022, pants: 0.055, socks: 0.006, shoes: 0.02, skin: 0, hand: 0 } };
export const MIN = { ...BASE, jersey: '#1a3a6e', pants: '#1a3a6e', numberColor: '#ffffff', numberOutline: '#78BE20', wordmark: 'MINNESOTA', wordmarkColor: '#ffffff', collar: '#78BE20', pantsStripes: ['#78BE20', '#ffffff'] };
export const DAL = { ...BASE, jersey: '#f6f7fa', pants: '#f6f7fa', numberColor: '#0064B1', numberOutline: '#0b2a4a', wordmark: 'DALLAS', wordmarkColor: '#0064B1', collar: '#0064B1', pantsStripes: ['#0064B1', '#8a9aa8'], shoes: '#0b2a4a' };
const IN = 0.0254;
export const BALL = (lib, o = {}) => makeCharacter(lib, { ...MIN, number: 1, backName: 'BALL', heightM: 79 * IN, skin: '#c99a72', hairStyle: 'proc:fade', hairColor: '#120c08', beardStyle: 'full', beardColor: '#1a120c', build: 'slim', ...o });
export const HYLAND = (lib, o = {}) => makeCharacter(lib, { ...MIN, number: 8, backName: 'HYLAND', heightM: 74 * IN, skin: '#9a6644', hairStyle: 'proc:dreads', hairColor: '#120c08', beardStyle: 'mustache', beardColor: '#120c08', build: 'slim', ...o });
export const GOBERT = (lib, o = {}) => makeCharacter(lib, { ...MIN, number: 27, backName: 'GOBERT', heightM: 85 * IN, skin: '#b88058', hairStyle: 'proc:buzz', hairColor: '#1a120c', beardStyle: 'goatee', beardColor: '#120c08', build: 'big', ...o });
export const MCDANIELS = (lib, o = {}) => makeCharacter(lib, { ...MIN, number: 3, backName: 'MCDANIELS', heightM: 81 * IN, skin: '#9a6644', hairStyle: 'proc:twists', hairColor: '#120c08', beardStyle: 'goatee', beardColor: '#120c08', build: 'slim', ...o });
export const DOSUNMU = (lib, o = {}) => makeCharacter(lib, { ...MIN, number: 13, backName: 'DOSUNMU', heightM: 76 * IN, skin: '#a06a46', hairStyle: 'proc:dreads', hairColor: '#120c08', beardStyle: 'goatee', beardColor: '#120c08', ...o });
export const KUMINGA = (lib, o = {}) => makeCharacter(lib, { ...MIN, number: 24, backName: 'KUMINGA', heightM: 79 * IN, skin: '#94603f', hairStyle: 'proc:buzz', hairColor: '#120c08', beardStyle: 'goatee', beardColor: '#120c08', ...o });
export const FLAGG = (lib, o = {}) => makeCharacter(lib, { ...DAL, number: 32, backName: 'FLAGG', heightM: 81 * IN, skin: '#f0cdb0', hairStyle: 'proc:fade', hairColor: '#8a6440', beardStyle: 'stubble', beardColor: '#8a6440', build: 'slim', ...o });
export const IRVING = (lib, o = {}) => makeCharacter(lib, { ...DAL, number: 11, backName: 'IRVING', heightM: 74 * IN, skin: '#a06a46', hairStyle: 'proc:fade', hairColor: '#0e0a06', beardStyle: 'full', beardColor: '#0e0a06', ...o });
export const RISACHER = (lib, o = {}) => makeCharacter(lib, { ...DAL, number: 10, backName: 'RISACHER', heightM: 80 * IN, skin: '#c99a72', hairStyle: 'proc:braids', hairColor: '#1a120c', beardStyle: 'goatee', beardColor: '#1a120c', build: 'slim', ...o });
export const MARSHALL = (lib, o = {}) => makeCharacter(lib, { ...DAL, number: 3, backName: 'MARSHALL', heightM: 78 * IN, skin: '#94603f', hairStyle: 'proc:twists', hairColor: '#120c08', beardStyle: 'full', beardColor: '#120c08', ...o });
export const GAFFORD = (lib, o = {}) => makeCharacter(lib, { ...DAL, number: 21, backName: 'GAFFORD', heightM: 82 * IN, skin: '#a87452', hairStyle: 'proc:fade', hairColor: '#120c08', headband: '#ffffff', beardStyle: 'full', beardColor: '#120c08', build: 'big', ...o });
