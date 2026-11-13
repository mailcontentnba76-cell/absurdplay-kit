// Dàn nhân vật dự án "10 Thing USA" (khuôn "10 điều kỳ quặc về …").
// Đầu 3D kiểu BIẾM HOẠ: nhận diện qua tóc, râu, màu mắt, mí mắt, dáng, áo + số — không dựng khuôn mặt thật, không logo.
import { makeCharacter } from './nhanvat2.js';

const NBA_BASE = { edgeSoft: 1, tank: true, shorts: true, sockAt: 0.74, shoesHigh: true, shortsTo: 0.86, skinMix: 1, brows: false,
  frontNumberSize: 0.64, backNumberSize: 0.8, numberDrop: 0.26, backRaise: -0.1, backNameMax: 210,
  smooth: { jersey: 14, pants: 14, socks: 6, shoes: 10, skin: 12, head: 8 }, puff: { jersey: 0.02, pants: 0.04, socks: 0.006, shoes: 0.02, skin: 0, hand: 0 } };

// Nuggets bản Icon (tra NBA.com 13/11/2026): nền Midnight Blue, chữ DENVER vàng viền đỏ, số TRẮNG viền đỏ, cổ chữ V + nách viền trắng, quần xanh navy.
export const NUGGETS_ICON = { ...NBA_BASE, jersey: '#1f417a', pants: '#1f417a', numberColor: '#ffffff', numberOutline: '#8b2131',
  wordmark: 'DENVER', wordmarkColor: '#fec524', collar: '#f4f4f4', pantsStripes: ['#f4f4f4', '#fec524', '#f4f4f4'], socks: '#f4f4f4', shoes: '#f2f2f2' };
// Nuggets bản Association: nền trắng, chữ NUGGETS + số xanh navy viền vàng
export const NUGGETS_ASSOC = { ...NUGGETS_ICON, jersey: '#f4f4f2', pants: '#f4f4f2', numberColor: '#0e2240', numberOutline: '#fec524', wordmark: 'NUGGETS', wordmarkColor: '#0e2240', collar: '#0e2240', pantsStripes: ['#0e2240', '#fec524', '#0e2240'] };

// Nikola Jokić — Nuggets #15, C, 2,11 m, 129 kg (NBA.com 11/2026).
// Biếm hoạ: đầu to hơn ~12 %, mí mắt nặng (vẻ "buồn ngủ" đặc trưng), mắt xanh xám, tóc nâu sáng cắt ngắn hai bên,
// râu quai nón ngắn màu nâu đỏ, lông mày đậm thẳng, da sáng hơi hồng, thân to vai rộng.
export const JOKIC_LOOK = { heightM: 2.11, headScale: 1.12, build: 'big', shoulders: 'wide', skin: '#f7d9c6',
  hairStyle: 'proc:fade', hair: null, hairColor: '#9c7a56', hairOpts: { front: 0.8, back: 1.45 },
  paintBeard: { color: '#7c5134' }, eyeScale: 1.9, irisColor: '#6f8fa6', lid: 0.42,
  browPaint: '#6a4a30', browWeight: 1.25, browAngle: 0.04, mouth: 'flat', mouthW: 0.016 };

export const CAST10 = {
  jokic: (lib, o = {}) => makeCharacter(lib, { ...NUGGETS_ICON, ...JOKIC_LOOK, number: 15, backName: 'JOKIĆ', ...o }),
  jokicHome: (lib, o = {}) => makeCharacter(lib, { ...NUGGETS_ASSOC, ...JOKIC_LOOK, number: 15, backName: 'JOKIĆ', ...o }),
  // đồ thường (ngủ, ở chuồng ngựa, ở nhà): áo thun + quần dài, không số
  jokicCasual: (lib, o = {}) => makeCharacter(lib, { ...NBA_BASE, ...JOKIC_LOOK, tank: false, shorts: false, jersey: '#5b6b4a', pants: '#3a3f4a', socks: '#3a3f4a', shoes: '#2a2a2a', collar: '#5b6b4a', pantsStripes: null, number: null, backName: null, wordmark: null, ...o }),
};
