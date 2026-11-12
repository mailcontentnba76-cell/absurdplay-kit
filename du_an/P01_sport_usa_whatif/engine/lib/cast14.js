// Dàn nhân vật E14 (NBA): Los Angeles Lakers vs Milwaukee Bucks. Số áo + chiều cao: ESPN roster + box score event 401909971 (kiểm 12/11/2026).
// Lakers: áo vàng chữ "LOS ANGELES" tím, số tím viền trắng; Bucks: áo xanh lá đậm chữ "MILWAUKEE" kem, số kem — KHÔNG logo, KHÔNG nhà tài trợ.
// Ngoại hình theo ảnh chân dung chính thức ESPN: Doncic (tóc nâu ngắn, râu lún phún), Reaves (băng đô trắng, tóc nâu), Kessler (tóc nâu ngắn, không râu),
// Mamukelashvili (đầu cạo sát, râu quai nón đen rậm), Thybulle (tóc xoắn); Herro (băng đô trắng, tóc nâu nhạt), Kuzma (tóc xoăn, ria + râu cằm),
// Ware (tóc ngắn, râu cằm), Jaquez (băng đô, tóc đen dài vừa, ria + râu cằm), Rollins (tóc ngắn).
import { makeCharacter } from './nhanvat2.js';
const BASE = { edgeSoft: 1, tank: true, shorts: true, sockAt: 0.78, shortsTo: 0.84, socks: '#f4f4f4', shoes: '#1c1c1c', skinMix: 1, brows: false, eyeScale: 2.3, frontNumberSize: 0.7, backNumberSize: 0.95, numberDrop: 0.16,
  smooth: { jersey: 12, pants: 18, socks: 6, shoes: 10, skin: 4, head: 8 }, puff: { jersey: 0.022, pants: 0.055, socks: 0.006, shoes: 0.02, skin: 0, hand: 0 } };
export const LAL = { ...BASE, jersey: '#FFD43B', pants: '#FFD43B', numberColor: '#552583', numberOutline: '#ffffff', wordmark: 'LOS ANGELES', wordmarkColor: '#552583', collar: '#552583', pantsStripes: ['#552583', '#ffffff'] };
export const MIL = { ...BASE, jersey: '#0b6a30', pants: '#0b6a30', numberColor: '#EEE1C6', numberOutline: '#0a2412', wordmark: 'MILWAUKEE', wordmarkColor: '#EEE1C6', collar: '#EEE1C6', pantsStripes: ['#EEE1C6', '#0077C0'] };
const IN = 0.0254;
export const DONCIC = (lib, o = {}) => makeCharacter(lib, { ...LAL, number: 77, backName: 'DONCIC', heightM: 80 * IN, skin: '#ecc7a4', hairStyle: 'proc:fade', hairColor: '#4e3420', beardStyle: 'stubble', beardColor: '#4e3420', build: 'big', ...o });
export const REAVES = (lib, o = {}) => makeCharacter(lib, { ...LAL, number: 15, backName: 'REAVES', heightM: 77 * IN, skin: '#efcaa8', hairStyle: 'proc:fade', hairColor: '#5a3d24', headband: '#ffffff', build: 'slim', ...o });
export const KESSLER = (lib, o = {}) => makeCharacter(lib, { ...LAL, number: 14, backName: 'KESSLER', heightM: 86 * IN, skin: '#efcaa8', hairStyle: 'proc:fade', hairColor: '#3e2a1a', build: 'big', ...o });
export const MAMU = (lib, o = {}) => makeCharacter(lib, { ...LAL, number: 54, backName: 'MAMUKELASHVILI', heightM: 81 * IN, skin: '#e2b896', hairStyle: 'proc:buzz', hairColor: '#1a120c', beardStyle: 'full', beardColor: '#1a120c', build: 'big', ...o });
export const THYBULLE = (lib, o = {}) => makeCharacter(lib, { ...LAL, number: 4, backName: 'THYBULLE', heightM: 77 * IN, skin: '#b07a56', hairStyle: 'proc:twists', hairColor: '#120c08', beardStyle: 'stubble', beardColor: '#120c08', build: 'slim', ...o });
export const HERRO = (lib, o = {}) => makeCharacter(lib, { ...MIL, number: 11, backName: 'HERRO', heightM: 77 * IN, skin: '#efcaa8', hairStyle: 'proc:fade', hairColor: '#8a6a44', headband: '#ffffff', build: 'slim', ...o });
export const KUZMA = (lib, o = {}) => makeCharacter(lib, { ...MIL, number: 18, backName: 'KUZMA', heightM: 80 * IN, skin: '#c69470', hairStyle: 'proc:curlytop', hairColor: '#1a120c', beardStyle: 'goatee', beardColor: '#1a120c', build: 'slim', ...o });
export const WARE = (lib, o = {}) => makeCharacter(lib, { ...MIL, number: 9, backName: 'WARE', heightM: 84 * IN, skin: '#9a6648', hairStyle: 'proc:fade', hairColor: '#120c08', beardStyle: 'goatee', beardColor: '#120c08', build: 'big', ...o });
export const JAQUEZ = (lib, o = {}) => makeCharacter(lib, { ...MIL, number: 24, backName: 'JAQUEZ JR.', heightM: 78 * IN, skin: '#d9a982', hairStyle: 'proc:curlytop', hairColor: '#120c08', headband: '#ffffff', beardStyle: 'goatee', beardColor: '#120c08', ...o });
export const ROLLINS = (lib, o = {}) => makeCharacter(lib, { ...MIL, number: 13, backName: 'ROLLINS', heightM: 75 * IN, skin: '#a87454', hairStyle: 'proc:fade', hairColor: '#120c08', build: 'slim', ...o });
