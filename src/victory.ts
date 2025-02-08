import * as PIXI from 'pixi.js';

export function checkVictory(
    blocks: PIXI.Graphics[][],
    targetShape: boolean[][],
    onClear: (increaseScore: boolean) => void
) {
    let allCorrectlyRemoved = true;

    for (let row = 0; row < targetShape.length; row++) {
        for (let col = 0; col < targetShape[row].length; col++) {
            const shouldBeRemoved = !targetShape[row][col]; // 消していいブロックか？
            const blockVisible = blocks[row][col].visible; // ブロックがまだ残っているか？

            // 🎯 ミス判定は `Game` クラスに移動したため、ここでは不要

            // 🎯 消していいブロック（false）がまだ残っているならクリア判定できない
            if (shouldBeRemoved && blockVisible) {
                allCorrectlyRemoved = false;
            }
        }
    }

    // 🎯 すべての消していいブロックが削除されていたらクリア
    if (allCorrectlyRemoved) {
        console.log("✅ 正しくブロックをすべて壊したため、スコア加算");
        onClear(true);
    }
}

