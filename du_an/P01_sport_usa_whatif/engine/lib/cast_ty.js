// Dàn nhân vật kênh hài cặp đôi (Project "Tình yêu", dự án P02). Ngôi thứ hai: "you" = nam chính, "your girlfriend" = nữ chính.
// Nhân vật hư cấu, đồ thường ngày, không số áo / chữ / logo. Khác hẳn kênh mẫu (Bob: đầu trọc, áo cam).
import { makeCharacter } from './nhanvat2.js';

const CASUAL = { edgeSoft: 2, tank: false, shorts: false, number: null, backName: null, wordmark: null, collar: null, pantsStripes: null,
  brows: false, headScale: 1.16, armSleeve: 'both', skinMix: 1,
  smooth: { jersey: 30, pants: 26, socks: 14, shoes: 10, skin: 16, head: 8 }, puff: { jersey: 0.045, pants: 0.02, socks: 0.006, shoes: 0.02, skin: 0, hand: 0 } };

// Nam chính: tóc nâu sẫm xoăn rối, râu lún phún, mắt nâu mí nặng (vẻ mệt mỏi thường trực), hoodie xanh rêu, quần nỉ xám, dép kem.
export const HIM = { ...CASUAL, heightM: 1.8, build: 'fit', skin: '#f3d3b8', lidSkin: '#d6a989',
  hairStyle: 'proc:curlytop', hairColor: '#3a281c', hairOpts: { thick: 0.034 }, paintBeard: { color: '#4a3324', alpha: 0.3, grain: 1500 },
  jersey: '#86a37c', armSleeveColor: '#86a37c', pants: '#aab0b7', socks: '#aab0b7', shoes: '#e8e1d2',
  eyeScale: 1.85, irisColor: '#5a3a22', lid: 0.34, browPaint: '#2e1f15', browWeight: 1.35, browAngle: 0.02, mouth: 'flat', mouthW: 0.016 };

// Nữ chính: tóc đỏ cam dài, mắt xanh lá, áo len vàng mù tạt, quần jean, giày trắng.
export const HER = { ...CASUAL, body: 'female', heightM: 1.65, build: 'fit', skin: '#f9e0cf', lidSkin: '#dcb39a',
  hair: 'Hair_Long', hairColor: '#c8643a', puff: { jersey: 0.02, pants: 0.02, socks: 0.006, shoes: 0.02, skin: 0, hand: 0 },
  jersey: '#ecc05a', armSleeveColor: '#ecc05a', pants: '#7393c2', socks: '#7393c2', shoes: '#f4f4f2',
  eyeScale: 1.95, irisColor: '#4d7a46', lid: 0.0, browPaint: '#7a3a1c', browWeight: 0.9, browAngle: 0.12, mouth: 'smile', mouthW: 0.015 };

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

export const CAST_TY = {
  him: (lib, o = {}) => makeCharacter(lib, { ...HIM, ...o }),
  her: (lib, o = {}) => makeCharacter(lib, { ...HER, ...o }),
};
