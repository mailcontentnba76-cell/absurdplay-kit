// Dàn nhân vật kênh hài cặp đôi (Project "Tình yêu", dự án P02). Ngôi thứ hai: "you" = nam chính, "your girlfriend" = nữ chính.
// Nhân vật hư cấu, đồ thường ngày, không chữ / logo. Khác hẳn kênh mẫu (Bob: đầu trọc, áo cam).
// v2 (14/11): phong cách đồ chơi (lib/toy.js) — đầu to, da phẳng, quần áo RỜI dáng suông, tay thả lỏng. Gọi ch.post() mỗi khung.
import { makeCharacter } from './nhanvat2.js';
import { dressToy } from './toy.js';

const CASUAL = { edgeSoft: 2, tank: false, shorts: false, number: null, backName: null, wordmark: null, collar: null, pantsStripes: null,
  brows: false, armSleeve: 'both', skinMix: 1,
  smooth: { jersey: 30, pants: 26, socks: 14, shoes: 10, skin: 16, head: 0 }, puff: { jersey: 0, pants: 0, socks: 0.004, shoes: 0.02, skin: 0, hand: 0 } };

// Nam chính: tóc nâu sẫm xoăn rối, râu lún phún, mắt nâu mí nặng (vẻ mệt mỏi thường trực), hoodie xanh xô thơm, quần nỉ xám, dép kem.
export const HIM = { ...CASUAL, heightM: 1.8, build: 'fit', skin: '#f2cfb2', lidSkin: '#efae7e', lipSkin: '#efae7e', /* lidSkin/lipSkin: màu tô đã bù để khớp da sau ánh sáng (đo 14/11) */
 
  hairStyle: 'proc:curlytop', hairColor: '#3a281c', hairOpts: { thick: 0.034 }, paintBeard: { color: '#4a3324', alpha: 0.28, grain: 1500 },
  jersey: '#6f8c68', armSleeveColor: '#8aa781', /* jersey = màu lót cổ áo (thân bên trong lộ ở cổ) */ pants: '#a9afb6', socks: '#a9afb6', shoes: '#e8e1d2',
  eyeScale: 1.85, irisColor: '#5a3a22', lid: 0.34, browPaint: '#2e1f15', browWeight: 1.35, browAngle: 0.02, mouth: 'flat', mouthW: 0.016 };
export const HIM_CLOTHES = { headK: 2.25, legK: 0.84, top: { kind: 'hoodie', color: '#8aa781', band: '#7a9672', pocket: '#71906a', strings: '#f1ede2', off: 0.035, loose: 1.08 },
  bottom: { color: '#a9afb6', hem: '#9aa0a8', off: 0.022, hemK: 0.78 } };

// Nữ chính: tóc đỏ cam dài, mắt xanh lá, áo len vàng mù tạt rộng, quần jean ống suông, giày trắng.
export const HER = { ...CASUAL, body: 'female', heightM: 1.65, build: 'fit', skin: '#f8dccb', lidSkin: '#f3b996',
  hair: 'Hair_Long', hairColor: '#c8643a',
  jersey: '#d9a944', armSleeveColor: '#ecc05a', pants: '#7393c2', socks: '#7393c2', shoes: '#f4f4f2',
  eyeScale: 1.95, irisColor: '#4d7a46', lid: 0.0, browPaint: '#7a3a1c', browWeight: 0.9, browAngle: 0.12, mouth: 'smile', mouthW: 0.015 };
export const HER_CLOTHES = { headK: 2.25, legK: 0.84, flatChest: true, top: { kind: 'sweater', color: '#ecc05a', band: '#dcae48', off: 0.035, loose: 1.1, cuffK: 0.78 },
  bottom: { color: '#7393c2', hem: '#6585b4', off: 0.02, hemK: 0.8 } };

// Biểu cảm dùng chung (truyền vào ch.face({...}))
export const FACES = {
  him: {
    deadpan: { lid: 0.42, mouth: 'flat' },
    annoyed: { lid: 0.3, squint: 0.35, browAngle: -0.32, browRaise: -0.25, mouth: 'frown' },
    sideEye: { lid: 0.48, look: [0.95, 0], browAngle: -0.1, mouth: 'flat' },
    shocked: { lid: 0, eyeWide: 1, browRaise: 0.6, browAngle: 0.2, mouth: 'o', mouthOpen: 0.8 },
    defeated: { lid: 0.55, look: [0, -0.8], browAngle: 0.35, mouth: 'frown' },
  },
  her: {
    happy: { mouth: 'smile' },
    bliss: { blink: 1, mouth: 'smile' },
    excited: { eyeWide: 0.8, browRaise: 0.4, mouth: 'grin', mouthOpen: 0.6 },
    pout: { browAngle: -0.15, mouth: 'frown', look: [-0.9, 0] },
  },
};

const build = (lib, look, clothes, o) => { const ch = makeCharacter(lib, { ...look, ...o }); dressToy(ch, { ...clothes, ...(o.clothes || {}) }); return ch; };
export const CAST_TY = {
  him: (lib, o = {}) => build(lib, HIM, HIM_CLOTHES, o),
  her: (lib, o = {}) => build(lib, HER, HER_CLOTHES, o),
};
