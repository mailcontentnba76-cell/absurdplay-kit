// Dàn nhân vật kênh hài cặp đôi (Project "Tình yêu", dự án P02). Ngôi thứ hai: "you" = nam chính, "your girlfriend" = nữ chính.
// Nhân vật hư cấu, đồ thường ngày, không chữ / logo. Khác hẳn kênh mẫu (Bob: đầu trọc, áo cam).
// v2 (14/11): phong cách đồ chơi (lib/toy.js) — đầu to, da phẳng, quần áo RỜI dáng suông, tay thả lỏng. Gọi ch.post() mỗi khung.
import { makeCharacter } from './nhanvat2.js';
import { dressToy } from './toy.js';

const CASUAL = { edgeSoft: 2, tank: false, shorts: false, number: null, backName: null, wordmark: null, collar: null, pantsStripes: null,
  brows: false, armSleeve: 'both', skinMix: 1,
  smooth: { jersey: 30, pants: 26, socks: 14, shoes: 10, skin: 16, head: 16 }, puff: { jersey: 0, pants: 0, socks: 0.004, shoes: 0.02, skin: 0, hand: 0 } };

// Phong cách Mỹ hiện đại, đời thường (đi Target cuối tuần). v5 14/11.
// Nam chính: gile phao chần bông navy ngoài sơ mi flannel caro đỏ–than, jean ống suông xanh vừa, sneaker trắng, tóc xoăn.
export const HIM = { ...CASUAL, heightM: 1.8, build: 'fit', skin: '#f2cfb2', lidSkin: '#efae7e', lipSkin: '#cb8a58', /* lidSkin/lipSkin: màu tô đã bù để khớp da sau ánh sáng (đo 14/11) */
  hairStyle: 'proc:curlytop', hairColor: '#3a281c', hairOpts: { thick: 0.034 }, paintBeard: { color: '#4a3324', alpha: 0.28, grain: 1500 },
  jersey: '#3b3540', armSleeveColor: '#b5453c', /* jersey = màu lót cổ áo */ pants: '#5677a6', socks: '#5677a6', shoes: '#f2f2f0',
  eyeScale: 1.85, irisColor: '#5a3a22', lid: 0.34, browPaint: '#2e1f15', browWeight: 1.35, browAngle: 0.02, mouth: 'flat', mouthW: 0.016 };
export const HIM_CLOTHES = { headK: 1.6,
  top: { kind: 'shirt', color: '#b5453c', band: '#3b3540', off: 0.02, loose: 1.0, cuffK: 0.85, collarR: 0.011,
    pattern: { type: 'plaid', c1: '#b5453c', c2: '#3b3540', c3: '#e8d9c4', size: 0.075 } },
  outer: { color: '#2a3d63', quilt: '#16223a', band: '#1a2740', zip: '#8d96a8', off: 0.013, loose: 1.0, quiltStep: 0.09, neckDrop: -0.045, neckTilt: 0.35, collarR: 0.016 },
  bottom: { color: '#5677a6', hem: '#4a6a97', off: 0.018, hemK: 0.8 },
  shoes: { color: '#f6f6f3', sole: '#f1ede4', line: '#cfc8b8', accent: '#2a3d63' } };

// Nữ chính: áo nỉ cổ tròn rộng màu kem in chữ SUNDAY club, legging đen, sneaker trắng viền xô thơm, tóc dài ngang vai.
export const HER = { ...CASUAL, body: 'female', heightM: 1.65, build: 'fit', skin: '#f8dccb', lidSkin: '#f4c0a0',
  hair: 'Hair_Long', hairColor: '#c8643a',
  jersey: '#f8dccb', armSleeveColor: '#e8dcc7', /* jersey = da: cổ tròn để lộ chân cổ */ pants: '#26262b', socks: '#26262b', shoes: '#f4f4f2',
  eyeScale: 1.95, irisColor: '#4d7a46', lid: 0.0, browPaint: '#7a3a1c', browWeight: 0.9, browAngle: 0.12, mouth: 'smile', mouthW: 0.015, mouthY: 0.068 };
export const HER_CLOTHES = { headK: 1.6, flatChest: true,
  top: { kind: 'sweater', color: '#ece2cf', band: '#dccfb6', off: 0.035, loose: 1.12, cuffK: 0.78, collarR: 0.017, hemDrop: -0.045, neckDrop: 0.012, neckTilt: 0.55, /* cổ tròn: cắt thấp ở chân cổ */
    pattern: { type: 'solid', c1: '#ece2cf', print: { text: 'SUNDAY', sub: 'club', color: '#b4573a', subColor: '#6f8f6a', w: 0.27, h: 0.15 } } },
  bottom: { color: '#26262b', hem: '#26262b', off: 0.006, fit: true },
  shoes: { color: '#f6f6f3', sole: '#f1ede4', line: '#cfc8b8', accent: '#9db59a', width: 0.095 } };

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
