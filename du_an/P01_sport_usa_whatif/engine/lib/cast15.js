// Dàn nhân vật E15 (NBA): Oklahoma City Thunder vs Portland Trail Blazers. Số áo + chiều cao: ESPN roster + box score event 401909975 (kiểm 13/11/2026).
// OKC: áo xanh dương chữ "OKLAHOMA CITY" trắng, số trắng viền cam; POR: áo đỏ chữ "PORTLAND" trắng, số trắng viền đen — KHÔNG logo, KHÔNG nhà tài trợ.
// Ngoại hình theo ảnh chân dung chính thức ESPN: Gilgeous-Alexander (tóc tết + băng đô trắng, mảnh), Hartenstein (tóc nâu ngắn, râu quai nón nâu),
// Mara (tóc đen, ria + râu cằm, rất cao), Caruso (tóc thưa ngắn, băng đô trắng, râu lún phún), McCain (tóc xù afro);
// Avdija (tóc đen ngắn, râu lún phún), Lillard (tóc ngắn, râu quai nón đen), Camara (tóc tết, râu quai nón), Clingan (tóc nâu sẫm, râu quai nón), Cissoko (tóc dreads dài).
import { makeCharacter } from './nhanvat2.js';
const BASE = { edgeSoft: 1, tank: true, shorts: true, sockAt: 0.78, shortsTo: 0.84, socks: '#f4f4f4', shoes: '#1c1c1c', skinMix: 1, brows: false, eyeScale: 2.3, frontNumberSize: 0.7, backNumberSize: 0.95, numberDrop: 0.16,
  smooth: { jersey: 12, pants: 18, socks: 6, shoes: 10, skin: 4, head: 8 }, puff: { jersey: 0.022, pants: 0.055, socks: 0.006, shoes: 0.02, skin: 0, hand: 0 } };
export const OKC = { ...BASE, jersey: '#2a97dc', pants: '#2a97dc', numberColor: '#ffffff', numberOutline: '#EF3B24', wordmark: 'OKLAHOMA CITY', wordmarkColor: '#ffffff', collar: '#EF3B24', pantsStripes: ['#EF3B24', '#002D62'] };
export const POR = { ...BASE, jersey: '#c8102e', pants: '#c8102e', numberColor: '#ffffff', numberOutline: '#111111', wordmark: 'PORTLAND', wordmarkColor: '#ffffff', collar: '#111111', pantsStripes: ['#111111', '#ffffff'] };
const IN = 0.0254;
export const SGA = (lib, o = {}) => makeCharacter(lib, { ...OKC, number: 2, backName: 'GILGEOUS-ALEXANDER', heightM: 78 * IN, skin: '#a87452', hairStyle: 'proc:braids', hairColor: '#120c08', headband: '#ffffff', build: 'slim', ...o });
export const HART = (lib, o = {}) => makeCharacter(lib, { ...OKC, number: 55, backName: 'HARTENSTEIN', heightM: 84 * IN, skin: '#efcaa8', hairStyle: 'proc:fade', hairColor: '#6a4a2c', beardStyle: 'full', beardColor: '#7a5432', build: 'big', ...o });
export const MARA = (lib, o = {}) => makeCharacter(lib, { ...OKC, number: 15, backName: 'MARA', heightM: 87 * IN, skin: '#e8bf9c', hairStyle: 'proc:fade', hairColor: '#1a120c', beardStyle: 'goatee', beardColor: '#3a2618', build: 'big', ...o });
export const CARUSO = (lib, o = {}) => makeCharacter(lib, { ...OKC, number: 9, backName: 'CARUSO', heightM: 77 * IN, skin: '#f0cdb0', hairStyle: 'proc:buzz', hairColor: '#8a6a48', headband: '#ffffff', beardStyle: 'stubble', beardColor: '#8a6a48', build: 'slim', ...o });
export const MCCAIN = (lib, o = {}) => makeCharacter(lib, { ...OKC, number: 3, backName: 'MCCAIN', heightM: 75 * IN, skin: '#c99266', hairStyle: 'proc:afro', hairColor: '#120c08', build: 'slim', ...o });
export const AVDIJA = (lib, o = {}) => makeCharacter(lib, { ...POR, number: 8, backName: 'AVDIJA', heightM: 80 * IN, skin: '#efcaa8', hairStyle: 'proc:fade', hairColor: '#1a120c', beardStyle: 'stubble', beardColor: '#1a120c', ...o });
export const LILLARD = (lib, o = {}) => makeCharacter(lib, { ...POR, number: 0, backName: 'LILLARD', heightM: 74 * IN, skin: '#9a6644', hairStyle: 'proc:fade', hairColor: '#0e0a06', beardStyle: 'full', beardColor: '#2a1c12', ...o });
export const CAMARA = (lib, o = {}) => makeCharacter(lib, { ...POR, number: 33, backName: 'CAMARA', heightM: 79 * IN, skin: '#b88058', hairStyle: 'proc:braids', hairColor: '#120c08', beardStyle: 'full', beardColor: '#120c08', ...o });
export const CLINGAN = (lib, o = {}) => makeCharacter(lib, { ...POR, number: 23, backName: 'CLINGAN', heightM: 86 * IN, skin: '#efcaa8', hairStyle: 'proc:fade', hairColor: '#3e2a1a', beardStyle: 'full', beardColor: '#4a3220', build: 'big', ...o });
export const CISSOKO = (lib, o = {}) => makeCharacter(lib, { ...POR, number: 91, backName: 'CISSOKO', heightM: 78 * IN, skin: '#8e5e40', hairStyle: 'proc:dreads', hairColor: '#120c08', build: 'slim', ...o });
