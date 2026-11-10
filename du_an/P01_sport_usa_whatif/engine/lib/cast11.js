// Dàn nhân vật E11 (NBA): New Orleans Pelicans. Số áo + chiều cao: ESPN roster (kiểm 10/11/2026): Murray #5 6'4", Fears #0 6'3", Queen #22 6'9", Herb Jones #2 6'7", Bey #41 6'8".
// Ngoại hình theo ảnh chân dung chính thức ESPN: Murray (fade, râu quai nón ngắn), Fears (băng đầu trắng, không râu), Queen (tóc xoăn bồng, ria mờ),
// Jones (tóc ngắn, râu cằm), Bey (râu rậm dài). Áo trắng Association (như ảnh chân dung) — chữ "NEW ORLEANS" xanh navy, viền cổ vàng; KHÔNG logo.
// Màu da chọn sáng hơn thực tế một chút vì engine làm tối màu nhập (xem cast8.js).
import { makeCharacter } from './nhanvat2.js';
const BASE = { edgeSoft: 1, tank: true, shorts: true, sockAt: 0.78, shortsTo: 0.84, socks: '#f4f4f4', shoes: '#1c1c1c', skinMix: 1, brows: false, eyeScale: 2.3, frontNumberSize: 0.7, backNumberSize: 0.95, numberDrop: 0.16,
  smooth: { jersey: 12, pants: 18, socks: 6, shoes: 10, skin: 4, head: 8 }, puff: { jersey: 0.022, pants: 0.055, socks: 0.006, shoes: 0.02, skin: 0, hand: 0 } };
export const PELS = { ...BASE, jersey: '#f6f4ef', pants: '#f6f4ef', numberColor: '#0C2340', numberOutline: '#B4975A', wordmark: 'NEW ORLEANS', wordmarkColor: '#0C2340', collar: '#B4975A', pantsStripes: ['#0C2340', '#B4975A'] };
const IN = 0.0254;
export const MURRAY = (lib, o = {}) => makeCharacter(lib, { ...PELS, number: 5, backName: 'MURRAY', heightM: 76 * IN, skin: '#b07a52', hairStyle: 'proc:fade', hairColor: '#120c08', beardStyle: 'full', beardColor: '#120c08', ...o });
export const FEARS = (lib, o = {}) => makeCharacter(lib, { ...PELS, number: 0, backName: 'FEARS', heightM: 75 * IN, skin: '#c99266', hairStyle: 'proc:braids', hairColor: '#120c08', headband: '#ffffff', build: 'slim', ...o });
export const QUEEN = (lib, o = {}) => makeCharacter(lib, { ...PELS, number: 22, backName: 'QUEEN', heightM: 81 * IN, skin: '#a87454', hairStyle: 'proc:curlytop', hairColor: '#120c08', hairOpts: { puff: 1.35, len: 1.2 }, beardStyle: 'mustache', beardColor: '#120c08', ...o });
export const JONES = (lib, o = {}) => makeCharacter(lib, { ...PELS, number: 2, backName: 'JONES', heightM: 79 * IN, skin: '#a87454', hairStyle: 'proc:buzz', hairColor: '#120c08', beardStyle: 'goatee', beardColor: '#120c08', build: 'slim', ...o });
export const BEY = (lib, o = {}) => makeCharacter(lib, { ...PELS, number: 41, backName: 'BEY', heightM: 80 * IN, skin: '#b07a52', hairStyle: 'proc:fade', hairColor: '#120c08', beardStyle: 'full', beardColor: '#120c08', ...o });
