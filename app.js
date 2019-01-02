'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDataMap = new Map(); // key: 都道府県, 
// 1行読み終わったら通知イベント
rl.on('line', (lineString) => {
    // ,で分割
    const columns = lineString.split(',');

    // 0番目は年
    const year = parseInt(columns[0]);

    // 2番目は県
    const prefecture = columns[2];

    // 7番目が求めているデータ
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture);
    
        // まだデータがない
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            }
        }

        if (year === 2010) {
            value.popu10 += popu;
        }
        if (year === 2015) {
            value.popu15 += popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});

rl.on('close', () => {
    // 変化率を計算
    for (let [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }

    // 並び替え
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        // [1]がvalue
        return pair2[1].change - pair1[1].change;
    })
    // 出力の成形
    const rankingStrings = rankingArray.map(([key, value]) => {
        return key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率: ' + value.change;
    })
    console.log(rankingStrings);
})
