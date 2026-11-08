// Dàn nhân vật E08 (NBA): Spurs. Nhận diện qua số áo, màu, dáng, tóc, râu — không dựng khuôn mặt thật, không logo.
// Nguồn nhận diện (kiểm 08/11/2026): số 1 (ESPN box score 04/11); chiều cao 7-4 (roster Spurs 2025, SI) ≈ 2,24 m; sải tay ~8 ft (báo cáo, không chính thức);
// đầu cạo sát từ 01/2026 (ESPN, NBA.com/The Athletic); ria mép mỏng + râu cằm (ảnh trận; chủ dự án xác nhận "có râu").
import { makeCharacter } from './nhanvat2.js';
const BASE = { edgeSoft: 1, tank: true, shorts: true, sockAt: 0.74, shortsTo: 0.86, socks: '#f4f4f4', shoes: '#f4f4f4', skinMix: 1, brows: false, eyeScale: 2.3, frontNumberSize: 0.7, backNumberSize: 0.95, numberDrop: 0.16,
  smooth: { jersey: 12, pants: 14, socks: 6, shoes: 10, skin: 4, head: 8 }, puff: { jersey: 0.018, pants: 0.04, socks: 0.006, shoes: 0.02, skin: 0, hand: 0 } };
// Màu da #a87454: engine làm tối màu nhập (texture gốc) → chọn tông này để da nâu sẫm nhưng thấy rõ mặt/râu (chủ dự án yêu cầu 08/11).
// Trang phục bóng rổ: áo ba lỗ rộng, quần đùi rộng tới trên gối (puff 0,055), tất ngắn, giày bóng rổ.
// Spurs bản Association (trắng): chữ SPURS đen, số đen viền bạc, viền cổ đen, quần trắng sọc đen–bạc. (bản áo trận thật: CHỜ KIỂM ảnh)
export const SPURS = { ...BASE, jersey: '#f4f4f2', pants: '#f4f4f2', numberColor: '#111111', numberOutline: '#c4ced4', wordmark: 'SPURS', wordmarkColor: '#111111', collar: '#111111', pantsStripes: ['#111111', '#c4ced4', '#111111'], shoes: '#1c1c1c' };
const longArms = (ch, k) => { for (const n of ['upperarm_l', 'upperarm_r', 'lowerarm_l', 'lowerarm_r']) ch.bones[n].scale.setScalar(k); return ch; };
export const WEMBY = (lib, o = {}) => longArms(makeCharacter(lib, { ...SPURS, number: 1, backName: 'WEMBANYAMA', backNameMax: 170, heightM: 2.24, build: 'slim', shoulders: 'narrow',
  skin: '#a87454', hairStyle: 'proc:buzz', hairColor: '#0b0806', beardStyle: 'goatee', beardColor: '#0b0806',
  puff: { ...BASE.puff, jersey: 0.022, pants: 0.055 }, smooth: { ...BASE.smooth, pants: 18 }, shortsTo: 0.84, sockAt: 0.78, ...o }), 1.06);
