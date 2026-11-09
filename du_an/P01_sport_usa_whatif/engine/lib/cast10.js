// Dàn nhân vật E10 (NBA, ngôi sao vs lịch sử). Nhận diện Curry: #30, 6'2" (≈1,88 m) theo hồ sơ ESPN; ngoại hình theo ảnh chân dung chính thức ESPN (kiểm 09/11/2026):
// da nâu sáng, tóc đen xoăn cắt ngắn, râu quai nón ngắn + ria. Áo Warriors trắng (Association): bản thật in LOGO chứ không có chữ → để trống chữ (không dựng logo), số 30 xanh hoàng gia viền vàng.
import { makeCharacter } from './nhanvat2.js';
const BASE = { edgeSoft: 1, tank: true, shorts: true, sockAt: 0.78, shortsTo: 0.84, socks: '#f4f4f4', shoes: '#1c1c1c', skinMix: 1, brows: false, eyeScale: 2.3, frontNumberSize: 0.7, backNumberSize: 0.95, numberDrop: 0.16,
  smooth: { jersey: 12, pants: 18, socks: 6, shoes: 10, skin: 4, head: 8 }, puff: { jersey: 0.022, pants: 0.055, socks: 0.006, shoes: 0.02, skin: 0, hand: 0 } };
export const GSW = { ...BASE, jersey: '#f4f4f2', pants: '#f4f4f2', numberColor: '#1D428A', numberOutline: '#FFC72C', wordmark: null, collar: '#1D428A', pantsStripes: ['#1D428A', '#FFC72C'] };
export const CURRY = (lib, o = {}) => makeCharacter(lib, { ...GSW, number: 30, backName: 'CURRY', heightM: 1.88, skin: '#d6a47a', hairStyle: 'proc:curlytop', hairColor: '#120c08', hairOpts: { puff: 0.8, len: 0.8 },
  beardStyle: 'stubble', beardColor: '#120c08', ...o });
// tu sĩ (áo chùng nâu, đầu cạo), vua (áo đỏ thẫm) — hư cấu, không giống người thật
export const MONK = (lib, sd = 0) => makeCharacter(lib, { tank: false, shorts: false, jersey: '#5a3e26', pants: '#5a3e26', socks: '#3a2a1a', shoes: '#3a2a1a', collar: '#3a2a1a', edgeSoft: 1, eyeScale: 2.2, heightM: 1.75 + sd * 0.05,
  skin: ['#e8c4a0', '#c99266'][sd % 2], hairStyle: 'proc:buzz', hairColor: ['#8a8a8a', '#3a2516'][sd % 2], beardStyle: sd % 2 ? 'full' : null, beardColor: '#6a6a6a', glasses: sd % 2 ? null : '#3a2a1a' });
export const KING = (lib) => makeCharacter(lib, { tank: false, shorts: false, jersey: '#7a1a20', pants: '#2a1a30', socks: '#2a1a30', shoes: '#1a1010', collar: '#e5c040', edgeSoft: 1, eyeScale: 2.2, heightM: 1.8, skin: '#ecc9a8', hairStyle: 'proc:fade', hairColor: '#4a2e18' });
