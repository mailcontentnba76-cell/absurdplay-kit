// 10 Thing USA E01 — "10 Weird Things About Nikola Jokić". Mốc theo words.json (whisper small.en, giọng Magnific Sport USA 52,6 s).
// [t0, t1, zone, số đếm ngược (0 = hook)]. Chỉ hook có màn hài mở đầu (ngủ gật khi dẫn bóng); các cảnh sau theo kịch bản.
export const SH = {
  h1: [0.0, 1.1, 'arena', 0],        // ngủ gật đứng giữa sân mà vẫn dẫn bóng, đầu gật gù
  h2: [1.1, 2.0, 'arena', 0],        // bóng nảy trúng chân lăn đi → giật mình
  h3: [2.0, 3.06, 'arena', 0],       // lừ đừ nhìn máy quay, nhún vai ("…Nikola Jokić")
  a1: [3.06, 5.5, 'living', 10],
  a2: [5.5, 7.2, 'living', 10],      // "TV didn't even show it"
  a3: [7.2, 8.4, 'living', 10],      // quảng cáo burrito
  a4: [8.4, 9.34, 'living', 10],     // fan nhún vai
  b1: [9.34, 10.9, 'bedroom', 9],
  b1c: [10.9, 12.4, 'bedroom', 9],   // "because he was asleep"
  b2: [12.4, 13.5, 'bedroom', 9],    // điện thoại "BROTHER calling"
  b3: [13.5, 14.4, 'bedroom', 9],    // "wake him up"
  c1: [14.4, 16.6, 'kitchen', 8],
  c2: [16.6, 18.72, 'kitchen', 8],
  d1: [18.72, 21.4, 'soda', 7],
  d2: [21.4, 23.42, 'soda', 7],
  e1: [23.42, 25.9, 'gym', 6],
  e2: [25.9, 26.6, 'gym', 6],        // "20 seconds"
  e3: [26.6, 27.24, 'gym', 6],
  f1: [27.24, 30.0, 'arena', 5],
  f2: [30.0, 32.8, 'arena', 5],      // bảng điện tử 14:33
  g2: [32.8, 34.7, 'stable', 4],     // "When friends visit…" bạn ngó cửa
  g1: [34.7, 36.72, 'stable', 4],    // "…in the stable with his horses"
  i1: [36.72, 39.7, 'arena', 3],
  i2: [39.7, 41.84, 'arena', 3],     // "The job is done, we can go home now."
  j1: [41.84, 44.7, 'equip', 2],
  k1: [44.7, 47.5, 'street', 1],
  k2: [47.5, 50.1, 'street', 1],     // "No. I need to go home."
  k3: [50.1, 51.3, 'track', 1],
  k4: [51.3, 53.2, 'track', 1],
};
export const END = 53.2;
