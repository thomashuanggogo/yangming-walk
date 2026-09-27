# 道路資料與畫面

道路資料基於 OpenStreetMap contributors，授權 ODbL 1.0。
來源與授權：https://www.openstreetmap.org/copyright
陽明里邊界：https://www.openstreetmap.org/relation/3629858

`src/world/real_roads.js` 是目前遊戲採用的路線與地標配置。道路寬度、地標退縮與建築大小包含遊戲化調整；地圖使用平面地形，不能視為實地測繪成果。此輪改善未重新核對地標地址，也未移動建築。

`src/world/road_surface.js` 為由現有路線合併產生的路面多邊形，避免路口重疊閃爍及放大貼圖的鋸齒。修改路線後，以 `tools/build_road_surface.py` 重建，再執行 `node build_bundle_3d.js`。Python 與 Shapely 僅在重建時需要，遊戲本身可直接開啟 index.html。

## 2026-09-27 操作改善

- 小地圖預設收起；「地圖」或 M 開關，Z 放大與縮回，Esc 關閉大圖。
- 「路標」或 R 開關場景路牌與轉角提示，保留道路。瀏覽器記住路標偏好。
- 地圖支援滑鼠與觸控拖曳；名稱只在懸停或鍵盤聚焦時顯示，點擊可查看故事。
- 圖鑑可搜尋名稱、編號，或只看未收錄。分區與數量依現有 60 個地標產生。
- 建築模型及既有收集進度保留。

## 2026-09-27 路網顯示規則更新

依使用者要求，保留主要街道及通往地標所需的支路。沒有地標、也不需經過的小巷與碎步道不顯示。必要的路口連接使用原始 OSM 路段，未畫出虛構直線捷徑。

完整來源有 1,615 段道路資料，遊戲與小地圖共用其中 151 段精選路線。可見路網經頂點連通性檢查為單一連通網路；67 個地標均選有通往主路的既有道路。地標光圈與最近道路仍可能隔著縮景庭院或草地，此檢查不代表實地入口或人行無障礙認證。

來源網路：assets/roads-source-network.json。顯示選擇與道路連接紀錄：ROAD_SELECTION_AUDIT.json。重新選路用 tools/select_display_roads.py；再建置路面與遊戲 bundle。道路宽度缺乏實測者依道路等級估算。

## 離線圖鑑

遊戲圖鑑按「匯出圖鑑」，會下載含目前收錄紀錄的單一 HTML。圖片內嵌在檔案中，搜尋、區域篩選與閱讀不需連網。預先產生的「陽明山散步圖鑑.html」包含全部 67 個地標，不含個人進度。

模型更新後，需更新 assets/atlas-thumbnails.json，再執行 node tools/build_offline_atlas.js；圖鑑包含模型圖片及既有文字，並不表示全部歷史描述均經重新查證。
