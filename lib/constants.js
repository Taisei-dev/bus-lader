export const companyIds = [8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19];

export const vehiclePositionUrl = (companyId) =>
  `https://ajt-mobusta-gtfs.mcapps.jp/realtime/${companyId}/vehicle_position.bin`;
export const tripUpdateUrl = (companyId) =>
  `https://ajt-mobusta-gtfs.mcapps.jp/realtime/${companyId}/trip_updates.bin`;
export const alertUrl = (companyId) =>
  `https://ajt-mobusta-gtfs.mcapps.jp/realtime/${companyId}/alerts.bin`;

export const dbUrl = (companyId) => `../db/${companyId}.sqlite3`;

export const busColors = {
  bus8: 'rgb(0, 128, 0)' /*広島電鉄*/,
  bus9: 'rgb(255, 0, 0)' /*広島バス*/,
  bus10: 'rgb(230, 127, 18)' /*広島交通*/,
  bus11: 'rgb(255, 131, 77)' /*芸陽バス*/,
  bus12: 'rgb(0, 0, 255)' /*備北交通*/,
  bus15: 'rgb(0, 114, 186)' /*中国JRバス*/,
  bus13: 'rgb(95, 184, 69)' /*ボンバス*/,
  bus17: 'rgb(165, 42, 42)' /*おおのハートバス*/,
  bus18: 'rgb(131, 255, 77)' /*呉市生活バス*/,
  bus: 'rgb(153, 0, 255)' /*リムジンバス*/,
  bus102: 'rgb(230, 127, 18)' /*広交観光*/,
  bus14: 'rgb(255, 215, 0)' /*フォーブル*/,
  bus19: 'rgb(77, 131, 255)' /*廿日市市自主運行バス*/,
};

export const lineColor = '#000';

export const lineWidth = 5;
