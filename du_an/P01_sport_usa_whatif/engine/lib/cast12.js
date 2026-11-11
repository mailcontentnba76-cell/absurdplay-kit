// Dàn nhân vật E12 (NBA): Philadelphia 76ers. Số áo + chiều cao: ESPN roster (kiểm 11/11/2026): Maxey #0 6'2", Jaylen Brown #7 6'6", LeBron James #23 6'9".
// Ngoại hình theo ảnh chân dung chính thức ESPN: Maxey (fade, tết nhỏ hai bên gáy, râu cằm), Brown (tóc ngắn, râu quai nón dày), LeBron (đầu gần trọc, râu quai nón dày).
// Áo xanh hoàng gia (như ảnh chân dung) — chữ "PHILADELPHIA" trắng, số trắng viền đỏ, viền cổ đỏ–trắng; KHÔNG logo, KHÔNG nhà tài trợ.
import { makeCharacter } from './nhanvat2.js';
const BASE = { edgeSoft: 1, tank: true, shorts: true, sockAt: 0.78, shortsTo: 0.84, socks: '#f4f4f4', shoes: '#1c1c1c', skinMix: 1, brows: false, eyeScale: 2.3, frontNumberSize: 0.7, backNumberSize: 0.95, numberDrop: 0.16,
  smooth: { jersey: 12, pants: 18, socks: 6, shoes: 10, skin: 4, head: 8 }, puff: { jersey: 0.022, pants: 0.055, socks: 0.006, shoes: 0.02, skin: 0, hand: 0 } };
export const PHI = { ...BASE, jersey: '#006BB6', pants: '#006BB6', numberColor: '#ffffff', numberOutline: '#ED174C', wordmark: 'PHILADELPHIA', wordmarkColor: '#ffffff', collar: '#ED174C', pantsStripes: ['#ED174C', '#ffffff'] };
const IN = 0.0254;
export const MAXEY = (lib, o = {}) => makeCharacter(lib, { ...PHI, number: 0, backName: 'MAXEY', heightM: 74 * IN, skin: '#a87454', hairStyle: 'proc:fade', hairColor: '#120c08', beardStyle: 'goatee', beardColor: '#120c08', build: 'slim', ...o });
export const BROWN = (lib, o = {}) => makeCharacter(lib, { ...PHI, number: 7, backName: 'BROWN', heightM: 78 * IN, skin: '#a87454', hairStyle: 'proc:buzz', hairColor: '#120c08', beardStyle: 'full', beardColor: '#120c08', ...o });
export const LEBRON = (lib, o = {}) => makeCharacter(lib, { ...PHI, number: 23, backName: 'JAMES', heightM: 81 * IN, skin: '#9a6a4a', hairStyle: 'proc:buzz', hairColor: '#2a2a2a', beardStyle: 'full', beardColor: '#120c08', build: 'big', ...o });
