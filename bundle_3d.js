/**
 * 陽明里漫步 3D 方塊版 - 獨立執行套裝檔 (bundle_3d.js)
 * 支援本機 file:// 雙擊直接開啟，免伺服器、無 CORS 限制！
 */
(function() {
  const THREE = window.THREE;
  if (!THREE) {
    console.error("Three.js 核心庫尚未就緒！");
    return;
  }

  // 1. 地標資料庫
  const LANDMARKS = [
  {
    "id": "site_01",
    "code": "01",
    "name": "山仔后派出所",
    "category": "公共安全",
    "plusCode": "4GPW+WG",
    "district": "central",
    "districtName": "中央・山仔后生活核心",
    "x": 310,
    "y": 405,
    "radius": 40,
    "title": "01 山仔后派出所",
    "description": "山仔后交通與生活樞紐的治安守護站，提供登山旅客急難救助、問路指引與居民在地警政服務的安全據點。",
    "geoLat": 25.13725,
    "geoLon": 121.54625
  },
  {
    "id": "site_02",
    "code": "02",
    "name": "陽明山麥當勞",
    "category": "生活餐飲",
    "plusCode": "4GPW+RC",
    "district": "central",
    "districtName": "中央・山仔后生活核心",
    "x": 300,
    "y": 445,
    "radius": 40,
    "title": "02 陽明山麥當勞",
    "description": "陪伴文化大學師生與遊客近 37 年的經典地標，是無數人上山約見面集合、吃早餐吹冷氣與等公車的共同青春回憶。",
    "geoLat": 25.137,
    "geoLon": 121.546
  },
  {
    "id": "site_03",
    "code": "03",
    "name": "7-ELEVEN 陽明山門市",
    "category": "生活機能",
    "plusCode": "4GPW+QH",
    "district": "central",
    "districtName": "中央・山仔后生活核心",
    "x": 410,
    "y": 425,
    "radius": 40,
    "title": "03 7-ELEVEN 陽明山門市",
    "description": "山仔后最熱鬧的 24 小時生活補給站，無論是上山賞花、爬山健行或文大學生深夜消夜，都能隨時採買熱食、零食與日常用品。",
    "geoLat": 25.13687,
    "geoLon": 121.54638
  },
  {
    "id": "site_04",
    "code": "04",
    "name": "山仔后公園",
    "category": "公共綠地",
    "plusCode": "4GPW+V7",
    "district": "central",
    "districtName": "中央・山仔后生活核心",
    "x": 230,
    "y": 315,
    "radius": 40,
    "title": "04 山仔后公園",
    "description": "隱身在熱鬧街道旁的社區小綠洲，設有林蔭涼亭與長椅，供附近居民晨昏散步、鄰里聊天歇腳與親子戶外活動。",
    "geoLat": 25.13712,
    "geoLon": 121.54563
  },
  {
    "id": "site_05",
    "code": "05",
    "name": "陽明里辦公處 (區民活動中心)",
    "category": "社區服務",
    "plusCode": "4GPW+5W",
    "district": "central",
    "districtName": "中央・山仔后生活核心",
    "x": 315,
    "y": 295,
    "radius": 40,
    "title": "05 陽明里辦公處 (區民活動中心)",
    "description": "陽明里的在地生活與行政核心，舉辦長青講座、里民聚會與各項公共活動，也是走訪完全里 30 處地標領取榮譽里民證的地方。",
    "geoLat": 25.13537,
    "geoLon": 121.54725
  },
  {
    "id": "site_06",
    "code": "06",
    "name": "台灣中油陽明山加油站",
    "category": "交通補給",
    "plusCode": "4GPW+68",
    "district": "central",
    "districtName": "中央・山仔后生活核心",
    "x": 328,
    "y": 500,
    "radius": 40,
    "title": "06 台灣中油陽明山加油站",
    "description": "陽明山上極少數的加油補給站，開車或騎車上山賞花、追雪、前往擎天崗或竹子湖前，必定停靠把油箱加滿的地方。",
    "geoLat": 25.1355,
    "geoLon": 121.54575
  },
  {
    "id": "site_07",
    "code": "07",
    "name": "豆留森林 (CAMA)",
    "category": "文化餐飲",
    "plusCode": "4GQW+7M",
    "district": "north",
    "districtName": "北區・草山歷史官舍",
    "x": 376,
    "y": 168,
    "radius": 40,
    "title": "07 豆留森林 (CAMA)",
    "description": "結合昭和日式老官舍與六百坪幽靜竹林的景觀咖啡旗艦店，讓人置身和風庭院中享用精品手沖咖啡、烘豆體驗與早午餐。",
    "geoLat": 25.13812,
    "geoLon": 121.54663
  },
  {
    "id": "site_08",
    "code": "08",
    "name": "白房子 Yang Ming Cafe",
    "category": "歷史餐飲",
    "plusCode": "4GQW+2C",
    "district": "north",
    "districtName": "北區・草山歷史官舍",
    "x": 265,
    "y": 188,
    "radius": 40,
    "title": "08 白房子 Yang Ming Cafe",
    "description": "美軍眷舍老洋房改建的純白歐風咖啡館，提供精緻排餐、現烤手工麵包與手沖咖啡，適合朋友聚會、約會與享受悠閒午後。",
    "geoLat": 25.13918,
    "geoLon": 121.5462
  },
  {
    "id": "site_09",
    "code": "09",
    "name": "彩虹谷故事館 (F206)",
    "category": "文史故事",
    "plusCode": "4GPX+82",
    "district": "east",
    "districtName": "東區・愛富美軍宿舍群",
    "x": 230,
    "y": 250,
    "radius": 35,
    "title": "09 彩虹谷故事館 (F206)",
    "description": "座落於愛富三街南側、山仔后美軍眷舍 F 區核心腹地的代表性美式眷舍！門牌代號 F206，完整保留 1950 年代駐台美軍眷屬居住的白木雨淋板雙坡平房、紅磚壁爐大煙囪與開闊庭院。致力於記錄冷戰美軍生活記憶與老屋修復歷史，庭園常能遠眺陽明山世界級的壯麗彩虹，是山仔后文史聚落極具溫度的故事館舍。",
    "geoLat": 25.1383,
    "geoLon": 121.5451
  },
  {
    "id": "site_10",
    "code": "10",
    "name": "美軍宿舍群 (C 區建業路段)",
    "category": "文創聚落",
    "plusCode": "4GPX+RH",
    "district": "north",
    "districtName": "北區・草山歷史官舍",
    "x": 205,
    "y": 135,
    "radius": 40,
    "title": "10 美軍宿舍群 (C 區建業路段)",
    "description": "全台保存最完整的美式冷戰官兵聚落，兩側有著大煙囪、寬廣草坪與美式平房，是散步拍照、感受美式鄉村街區氛圍的文創漫遊區。",
    "geoLat": 25.137,
    "geoLon": 121.54888
  },
  {
    "id": "site_11",
    "code": "11",
    "name": "雀客藏居陽明山溫泉飯店",
    "category": "溫泉名宿",
    "plusCode": "5G2W+27",
    "district": "north",
    "districtName": "北區・草山歷史官舍",
    "x": 500,
    "y": 145,
    "radius": 40,
    "title": "11 雀客藏居陽明山溫泉飯店",
    "description": "草山知名的山中溫泉渡假飯店，提供天然純淨的白磺溫泉泡湯、山景客房與中西式美饌，供旅客遠離塵囂放鬆身心。",
    "geoLat": 25.15,
    "geoLon": 121.54563
  },
  {
    "id": "site_12",
    "code": "12",
    "name": "陽明山錫安堂",
    "category": "宗教聖所",
    "plusCode": "4GXX+QV",
    "district": "north",
    "districtName": "北區・草山歷史官舍",
    "x": 620,
    "y": 195,
    "radius": 40,
    "title": "12 陽明山錫安堂",
    "description": "隱身在山林綠意中的寧靜純白教堂，為在地居民與大學生提供主日崇拜、心靈團契與安靜沉澱心靈的信仰避風港。",
    "geoLat": 25.14937,
    "geoLon": 121.54962
  },
  {
    "id": "site_13",
    "code": "13",
    "name": "草山御賓館 (市定古蹟)",
    "category": "市定古蹟",
    "plusCode": "5H22+99",
    "district": "north",
    "districtName": "北區・草山歷史官舍",
    "x": 375,
    "y": 75,
    "radius": 40,
    "title": "13 草山御賓館 (市定古蹟)",
    "description": "日治時期為接待裕仁皇太子所建的和洋風官邸，後為孫科院長寓所，是陽明山極具代表性的市定古蹟，讓人近距離見證草山近百年政局文史風雲。",
    "geoLat": 25.15087,
    "geoLon": 121.55088
  },
  {
    "id": "site_14",
    "code": "14",
    "name": "中國文化大學",
    "category": "大專學園",
    "plusCode": "4GPQ+JP",
    "district": "west",
    "districtName": "西區・華岡美軍生活圈",
    "x": 100,
    "y": 345,
    "radius": 40,
    "title": "14 中國文化大學",
    "description": "座落在海拔 400 公尺華岡之巔的高等學府，擁有全台最雄偉的中國宮殿式校舍群，也是情侶與遊客看夜景、俯瞰整個大台北盆地景緻的勝地。",
    "geoLat": 25.1365,
    "geoLon": 121.53925
  },
  {
    "id": "site_15",
    "code": "15",
    "name": "亞尼克夢想村",
    "category": "美式甜點",
    "plusCode": "4GPV+JF",
    "district": "west",
    "districtName": "西區・華岡美軍生活圈",
    "x": 105,
    "y": 420,
    "radius": 40,
    "title": "15 亞尼克夢想村",
    "description": "由美軍老眷舍改造的超人氣美式烘焙甜點坊，專賣各式招牌現烤派塔、生乳捲與野餐點心，能坐在戶外庭院大樹下享受美式鄉村午茶。",
    "geoLat": 25.1365,
    "geoLon": 121.54363
  },
  {
    "id": "site_16",
    "code": "16",
    "name": "The Cafe By 想 陽明山",
    "category": "文化餐飲",
    "plusCode": "4GPV+FV",
    "district": "west",
    "districtName": "西區・華岡美軍生活圈",
    "x": 105,
    "y": 560,
    "radius": 40,
    "title": "16 The Cafe By 想 陽明山",
    "description": "群山環抱中的亮黃色歐風木屋景觀餐廳，擁有落羽松庭園與水池造景，提供義大利麵、早午餐與鬆餅，是拍照打卡與放鬆聚餐的好去處。",
    "geoLat": 25.13612,
    "geoLon": 121.54462
  },
  {
    "id": "site_17",
    "code": "17",
    "name": "陽明山星巴克 (草山門市)",
    "category": "文創名店",
    "plusCode": "4GPV+F5",
    "district": "west",
    "districtName": "西區・華岡美軍生活圈",
    "x": 215,
    "y": 515,
    "radius": 40,
    "title": "17 陽明山星巴克 (草山門市)",
    "description": "改建自美軍眷舍的純白木屋咖啡館，完整保留復古紅磚大壁爐與戶外草地櫻花樹，讓人坐在老房子裡喝咖啡、感受美式度假風情。",
    "geoLat": 25.13612,
    "geoLon": 121.54288
  },
  {
    "id": "site_18",
    "code": "18",
    "name": "美軍俱樂部 (BRICK YARD 33 1/3)",
    "category": "歷史餐飲",
    "plusCode": "4GPV+69",
    "district": "west",
    "districtName": "西區・華岡美軍生活圈",
    "x": 350,
    "y": 600,
    "radius": 40,
    "title": "18 美軍俱樂部 (BRICK YARD 33 1/3)",
    "description": "原美軍眷屬聯誼俱樂部（草山俱樂部 Club 63）改建之近千坪文創休閒聚落！保留 1950 年代美式紅磚老斜頂、雙紅磚煙囪與開闊人字木屋架，室外前泳池改建為水光瀲灩的景觀無邊際水池露台，池中央設有下沉式白色沙發卡座。園區內矗立著吸睛的巨大黑膠唱片裝置藝術，典藏上萬張珍稀西洋黑膠唱片，濃厚的黑膠爵士音樂與炭烤牛排香氣，重現冷戰美軍駐台的黃金歲月。",
    "geoLat": 25.1355,
    "geoLon": 121.54338
  },
  {
    "id": "site_19",
    "code": "19",
    "name": "陽明山美國渡假村",
    "category": "美式別墅",
    "plusCode": "4GPR+CM",
    "district": "west",
    "districtName": "西區・華岡美軍生活圈",
    "x": 175,
    "y": 620,
    "radius": 40,
    "title": "19 陽明山美國渡假村",
    "description": "保留高階軍官眷舍規格的獨棟包棟式渡假園區，擁有獨立大院子、綠意草坪、戶外鞦韆與烤肉設備，適合親友家庭體驗道地美式郊區生活。",
    "geoLat": 25.136,
    "geoLon": 121.54163
  },
  {
    "id": "site_20",
    "code": "20",
    "name": "臺北市立陽明教養院",
    "category": "社福公義",
    "plusCode": "4GPR+53",
    "district": "west",
    "districtName": "西區・華岡美軍生活圈",
    "x": 80,
    "y": 705,
    "radius": 40,
    "title": "20 臺北市立陽明教養院",
    "description": "深耕山林間的公立身心障礙全人照護家園，提供中重度心智障礙學員溫暖專業的生活照料、技能陶冶與社區關懷服務。",
    "geoLat": 25.13537,
    "geoLon": 121.54013
  },
  {
    "id": "site_21",
    "code": "21",
    "name": "屋頂上餐廳 (The Top)",
    "category": "夜景地標",
    "plusCode": "4GMQ+VM",
    "district": "west",
    "districtName": "西區・華岡美軍生活圈",
    "x": 125,
    "y": 825,
    "radius": 40,
    "title": "21 屋頂上餐廳 (The Top)",
    "description": "全台灣最負盛名、最具代表性的後山百萬夜景景觀餐廳！坐落於文化大學體育館後方的陡峭懸崖邊，依山勢層層構築出四層梯田式柚木觀景大甲板。純白浪漫的峇里島發光帳篷包廂（Cabanas）、Tiffany 藍鏡面無邊際天際水池與崖邊半圓形白色沙發，居高臨下將整座大台北盆地、淡水河與台北 101 的燦爛萬家燈火盡收眼底，是情侶約會與旅人朝聖的夜景第一仙境。",
    "geoLat": 25.13462,
    "geoLon": 121.53913
  },
  {
    "id": "site_22",
    "code": "22",
    "name": "華岡藝校",
    "category": "藝術學園",
    "plusCode": "4GPX+RH",
    "district": "east",
    "districtName": "東區・建業學園與生態",
    "x": 555,
    "y": 285,
    "radius": 40,
    "title": "22 華岡藝校",
    "description": "台灣歷史悠久的表演藝術名校，培養無數知名歌手、演員與舞者，走在校門周邊常能聽見學子練琴、排戲與練習歌唱的藝術氛圍。",
    "geoLat": 25.137,
    "geoLon": 121.54888
  },
  {
    "id": "site_23",
    "code": "23",
    "name": "台北歐洲學校 (陽明校區)",
    "category": "國際教育",
    "plusCode": "4GPX+MJ",
    "district": "east",
    "districtName": "東區・建業學園與生態",
    "x": 590,
    "y": 360,
    "radius": 40,
    "title": "23 台北歐洲學校 (陽明校區)",
    "description": "匯聚英、法、德跨國教育的小學部校區，美麗的歐風紅瓦斜頂校舍融入草山大自然，為駐台外籍人士與各國學子打造國際化的學習環境。",
    "geoLat": 25.13662,
    "geoLon": 121.549
  },
  {
    "id": "site_24",
    "code": "24",
    "name": "草山猛禽中心",
    "category": "自然生態",
    "plusCode": "4GPX+PJ",
    "district": "east",
    "districtName": "東區・建業學園與生態",
    "x": 585,
    "y": 495,
    "radius": 40,
    "title": "24 草山猛禽中心",
    "description": "推廣台灣猛禽保育與救傷的自然教育中心，能認識大冠鷲、鳳頭蒼鷹等在陽明山盤旋的空中霸主，並提供生態講座與望遠鏡觀鳥體驗。",
    "geoLat": 25.13675,
    "geoLon": 121.549
  },
  {
    "id": "site_25",
    "code": "25",
    "name": "YMS onefifteen 初衣食午",
    "category": "時尚選品",
    "plusCode": "4GPX+77",
    "district": "east",
    "districtName": "東區・建業學園與生態",
    "x": 565,
    "y": 615,
    "radius": 40,
    "title": "25 YMS onefifteen 初衣食午",
    "description": "讓都市人上山放慢步調、結合美食、藝術、住宿與自然美學的高檔美軍宿舍改建聚落。",
    "geoLat": 25.13562,
    "geoLon": 121.54813
  },
  {
    "id": "site_26",
    "code": "26",
    "name": "花卉試驗中心",
    "category": "自然生態",
    "plusCode": "4GPW+33",
    "district": "south",
    "districtName": "南區・花卉信仰與門戶",
    "x": 225,
    "y": 755,
    "radius": 40,
    "title": "26 花卉試驗中心",
    "description": "花卉試驗中心以茶花、杜鵑等花卉培育與展示聞名。遊戲加入密集花圃、茶花灌木、球根花卉展示與花架，將不同花季的色彩集中呈現，方便欣賞；配置為風格化園藝場景。",
    "geoLat": 25.13512,
    "geoLon": 121.54513,
    "sourceUrl": "https://pkl.gov.taipei/News_Content.aspx?n=43E05059FCC72525&s=DD94057B11E5812D"
  },
  {
    "id": "site_27",
    "code": "27",
    "name": "陽明福德宮",
    "category": "民間信仰",
    "plusCode": "4GPW+26",
    "district": "south",
    "districtName": "南區・花卉信仰與門戶",
    "x": 345,
    "y": 725,
    "radius": 40,
    "title": "27 陽明福德宮",
    "description": "花卉試驗中心對面的百年土地公廟，是在地里民出入保平安、農作生意興隆的精神寄託，登山客與過路人也常在此停步參拜祈福。",
    "geoLat": 25.135,
    "geoLon": 121.5455
  },
  {
    "id": "site_28",
    "code": "28",
    "name": "臺北市立格致國民中學",
    "category": "初級教育",
    "plusCode": "4GJW+WW",
    "district": "south",
    "districtName": "南區・花卉信仰與門戶",
    "x": 350,
    "y": 860,
    "radius": 40,
    "title": "28 臺北市立格致國民中學",
    "description": "隱身在山林綠蔭間的森林生態國中，校園擁有極高的綠覆率與遠眺台北視野，為山仔后在地子弟提供自然健康的求學成長環境。",
    "geoLat": 25.13225,
    "geoLon": 121.54725
  },
  {
    "id": "site_29",
    "code": "29",
    "name": "納美花園 (Navi Garden)",
    "category": "休閒莊園",
    "plusCode": "4GQ2+3M",
    "district": "south",
    "districtName": "南區・花卉信仰與門戶",
    "x": 530,
    "y": 760,
    "radius": 40,
    "title": "29 納美花園 (Navi Garden)",
    "description": "佔地六千坪的世外桃源休閒莊園，擁有遼闊的碧綠大草皮、生態池塘與林蔭落葉步道，專門提供浪漫的戶外森林系婚禮、草地野餐與聚會空間。",
    "geoLat": 25.1385,
    "geoLon": 121.554
  },
  {
    "id": "site_30",
    "code": "30",
    "name": "下竹林福德宮",
    "category": "民間信仰",
    "plusCode": "4GJW+7F",
    "district": "south",
    "districtName": "南區・花卉信仰與門戶",
    "x": 560,
    "y": 890,
    "radius": 40,
    "title": "30 下竹林福德宮",
    "description": "由市區沿仰德大道進入陽明山的第一道守護小廟，石造古祠隱身於幽靜竹林與老樹旁，百年來默默守護每位登山健行者與歸鄉居民。",
    "geoLat": 25.13062,
    "geoLon": 121.54613
  },
  {
    "id": "site_31",
    "code": "31",
    "name": "臺灣銀行行員訓練所",
    "category": "教育研習",
    "plusCode": "4GQ2+4G",
    "district": "center",
    "districtName": "中區・山仔后核心生活",
    "x": 605,
    "y": 420,
    "radius": 45,
    "title": "31 臺灣銀行行員訓練所",
    "description": "培育國家金融人才的深造基地，坐落於和平路林蔭之中，前身與美軍宿舍群歷史緊密相連，莊嚴大器的現代化教育研習園區。",
    "geoLat": 25.13891,
    "geoLon": 121.54729
  },
  {
    "id": "site_32",
    "code": "32",
    "name": "吉佳咖啡 (山上店)",
    "category": "在地咖啡",
    "plusCode": "4GQ2+27",
    "district": "center",
    "districtName": "中區・山仔后核心生活",
    "x": 480,
    "y": 390,
    "radius": 40,
    "title": "32 吉佳咖啡 (山上店)",
    "description": "隱身菁山路上的陽明山傳奇自烘咖啡名店，標榜新鮮手工烘焙咖啡豆與傳統虹吸式手沖，店內濃郁咖啡香瀰漫，是文大師生與登山熟客的靈魂驛站。",
    "geoLat": 25.13788,
    "geoLon": 121.54712
  },
  {
    "id": "site_33",
    "code": "33",
    "name": "真愛桃花源 庭園餐廳",
    "category": "景觀婚紗",
    "plusCode": "4GQW+73",
    "district": "west",
    "districtName": "西區・文大與美軍俱樂部",
    "x": 220,
    "y": 340,
    "radius": 45,
    "title": "33 真愛桃花源 庭園餐廳",
    "description": "佔地七千坪的陽明山知名夢幻婚紗攝影基地與庭園景觀餐廳，依山傍水擁有白色哥德式教堂、彩虹風車、落羽松林與浪漫鏡面湖泊。",
    "geoLat": 25.13815,
    "geoLon": 121.54267
  },
  {
    "id": "site_34",
    "code": "34",
    "name": "臺北市教師研習中心",
    "category": "教育文化",
    "plusCode": "4GQ3+4P",
    "district": "north",
    "districtName": "北區・草山歷史官舍",
    "x": 620,
    "y": 160,
    "radius": 45,
    "title": "34 臺北市教師研習中心",
    "description": "前身為日治昭和時代 1929 年興建之「草山眾樂園」（草山公共浴場），現為市定古蹟。保有日洋折衷溫泉會館風貌，黑瓦大斜頂與草山綠蔭庭園相映，位於陽明路一段與建國街旁，隔磺溪與草山御賓館相對。",
    "geoLat": 25.15024,
    "geoLon": 121.54955
  },
  {
    "id": "site_35",
    "code": "35",
    "name": "林洋港故居 (前美軍總司令官邸)",
    "category": "歷史官舍",
    "plusCode": "4GQW+27",
    "district": "north",
    "districtName": "北區・草山歷史官舍",
    "x": 265,
    "y": 230,
    "radius": 45,
    "title": "35 林洋港故居 (前美軍總司令官邸)",
    "description": "愛富二街1號，為冷戰時期美軍駐台協防司令部最高長官之總司令官邸，後為前司法院長林洋港寓所。擁有將官級寬闊美式南方鄉村大木屋、紅磚煙囪與百年老樹大庭院。",
    "geoLat": 25.13868,
    "geoLon": 121.5462
  },
  {
    "id": "site_36",
    "code": "36",
    "name": "文化大學學生美食街 (牛肉拌麵)",
    "category": "生活餐飲",
    "plusCode": "4GPR+XJ",
    "district": "west",
    "districtName": "西區・文大與美軍俱樂部",
    "x": 165,
    "y": 335,
    "radius": 40,
    "title": "36 文化大學學生美食街 (牛肉拌麵)",
    "description": "位於文化大學校區旁的光華路26巷，是無數文化大學師生與校友最難忘的青春美食記憶！傳奇名店「牛肉乾拌麵」鋪滿厚切牛肉片與整碗任舀的大蒜蒜泥，搭配熱騰騰免費暢飲的濃郁大骨牛肉清湯，與隔壁的感恩麵店一同構築起華岡校園旁最熱鬧的人間煙火氣。",
    "geoLat": 25.13744,
    "geoLon": 121.54164
  },
  {
    "id": "site_37",
    "code": "37",
    "name": "文化大學郵局 (華岡大典館)",
    "category": "生活機能",
    "plusCode": "4GPR+QW",
    "district": "west",
    "districtName": "西區・文大與美軍俱樂部",
    "x": 130,
    "y": 375,
    "radius": 40,
    "title": "37 文化大學郵局 (華岡大典館)",
    "description": "位於中國文化大學校園核心的大典館一樓（華岡路55號），為陽明里與華岡生活圈唯一的實體郵局（臺北125支局）。數十年來承載全校師生與周邊居民的信件包裹收發、儲蓄匯款與家書寄送，門前標誌性的一紅一綠雙色郵筒與綠色郵政機車，是華岡校園最溫暖的經典風景。",
    "geoLat": 25.13685,
    "geoLon": 121.53913
  },
  {
    "id": "site_38",
    "code": "38",
    "name": "比夢烘焙坊 (The Cafe' By 想 陽明山)",
    "category": "文化餐飲",
    "plusCode": "4GQW+26",
    "district": "north",
    "districtName": "北區・草山歷史官舍",
    "x": 230,
    "y": 250,
    "radius": 40,
    "title": "38 比夢烘焙坊 (The Cafe' By 想 陽明山)",
    "description": "座落於愛富一街的美軍宿舍歐風紅磚平房，是陽明山極具盛名的人氣手作烘焙坊。擁有落地採光玻璃屋、夢幻落羽松大庭院與現烤出爐的生吐司、法式肉桂捲香氣，吸引無數遊客在此享受陽明山悠閒的早午餐與午後陽光。",
    "geoLat": 25.13848,
    "geoLon": 121.54555
  },
  {
    "id": "site_39",
    "code": "39",
    "name": "康迎鼎 陽明山店 (小籠包與大蒸籠)",
    "category": "歷史餐飲",
    "plusCode": "4GPX+26",
    "district": "east",
    "districtName": "東區・愛富美軍宿舍群",
    "x": 310,
    "y": 280,
    "radius": 40,
    "title": "39 康迎鼎 陽明山店 (小籠包與大蒸籠)",
    "description": "座落於愛富二街2巷與愛富二街交會處、白房子隔壁的美軍老宿舍中式點心名店！保留美式老眷舍白牆紅柱風貌，最著名的地標特色是門前矗立著巨大的『招牌竹編蒸籠』與頂著十八摺抓褶、圓滾白嫩萌感十足的『巨型小籠包雕塑』，裊裊白煙迎接著饕客，是美軍眷舍區最具人氣的麵食點心代表。",
    "geoLat": 25.1378,
    "geoLon": 121.5472
  },
  {
    "id": "site_40",
    "code": "40",
    "name": "大衛小小羊 (David & Alpaca)",
    "category": "文化餐飲",
    "plusCode": "4GPR+PV",
    "district": "west",
    "districtName": "西區・文大與美軍俱樂部",
    "x": 180,
    "y": 310,
    "radius": 40,
    "title": "40 大衛小小羊 (David & Alpaca)",
    "description": "座落於美軍宿舍草山星巴克正後方，是陽明山極受歡迎的草泥馬（羊駝）景觀餐廳！美軍眷舍改建的黃白歐風平房擁有綠意大草坪與白色木柵欄，兩隻個性溫馴親人的白色羊駝悠閒散步，大人小孩都能近距離互動餵食，是山仔后最療癒歡樂的童趣地標。",
    "geoLat": 25.13683,
    "geoLon": 121.54226
  },
  {
    "id": "site_41",
    "code": "41",
    "name": "朱里昂法式廚房 (C.L Program)",
    "category": "文化餐飲",
    "plusCode": "4GPR+CP",
    "district": "west",
    "districtName": "西區・文大與美軍俱樂部",
    "x": 205,
    "y": 325,
    "radius": 40,
    "title": "41 朱里昂法式廚房 (C.L Program)",
    "description": "座落於國泰街與長春街口的美式鄉村鮮黃老木屋，以被譽為全台第一的頂級手工「法式可麗露 (Canelé)」與經典歐陸料理聞名。亮黃色的童話木質外牆、藍白相間遮陽棚與飄散著蘭姆酒、香草焦糖香氣的法式烘焙坊，是漫步美軍宿舍群不可錯過的甜蜜亮點。",
    "geoLat": 25.13606,
    "geoLon": 121.54344
  },
  {
    "id": "site_42",
    "code": "42",
    "name": "文化大學後山「情人坡」",
    "category": "夜景名勝",
    "plusCode": "4GPR+MJ",
    "district": "west",
    "districtName": "西區・文大與美軍俱樂部",
    "x": 150,
    "y": 350,
    "radius": 45,
    "title": "42 文化大學後山「情人坡」",
    "description": "全台北無人不曉的夜景第一聖地！座落於文化大學體育館後方的下坡路段，視野無遮蔽一覽整座台北盆地、淡水河與台北101百萬燈火。斜坡草坪、雙人觀景木椅與路邊成排的約會機車，承載著無數華岡學子與情侶最浪漫的青春告白記憶。",
    "geoLat": 25.13665,
    "geoLon": 121.54111
  },
  {
    "id": "site_43",
    "code": "43",
    "name": "仇人坡 (荀子大道) 與百花池",
    "category": "校園名勝",
    "plusCode": "4GPR+PM",
    "district": "west",
    "districtName": "西區・文大與美軍俱樂部",
    "x": 140,
    "y": 365,
    "radius": 45,
    "title": "43 仇人坡 (荀子大道) 與百花池",
    "description": "文化大學最具校園傳奇的代表性景觀！荀子大道上通往大恩館的超長好漢坡階梯，因坡度極陡、學生上下課爬得氣喘吁吁互看不順眼而戲稱為「仇人坡」。階梯頂端連接著大恩館前四季繁花盛開的經典「百花池」與中式八角涼亭，是每位華岡校友最深刻的青春印記。",
    "geoLat": 25.1368,
    "geoLon": 121.54009
  },
  {
    "id": "site_44",
    "code": "44",
    "name": "草山水管路步道 (愛富段出口)",
    "category": "自然步道",
    "plusCode": "4GPR+8C",
    "district": "north",
    "districtName": "北區・草山歷史官舍",
    "x": 180,
    "y": 150,
    "radius": 45,
    "title": "44 草山水管路步道 (愛富段出口)",
    "description": "全台少數被指定為「文化景觀」的世界級活水文化遺產！日治昭和三年（1928年）興建的草山水道系統，連接著愛富三街底的天母古道（水管路步道出口）。步道旁可見標誌性的巨大黑色高壓鑄鐵水管、古老石造排氣閥與調整池，流水潺潺綠蔭蔽日，是登山客自天母攀登至山仔后的綠意守護門戶。",
    "geoLat": 25.1407,
    "geoLon": 121.54344
  },
  {
    "id": "site_45",
    "code": "45",
    "name": "草山行館",
    "category": "歷史古蹟",
    "plusCode": "4GQ3+GQ",
    "district": "yangmingshan",
    "districtName": "陽明山公園區",
    "x": 600,
    "y": 120,
    "radius": 45,
    "title": "45 草山行館",
    "description": "蔣公在台首座正式官邸（「草山第一官邸」）！原為 1920 年代日治臺灣糖業株式會社招待所，曾作為裕仁皇太子訪台御行啟下榻處。全檜木建造的雅緻日式黑瓦別墅，設有寬敞的日式迴廊緣側、幽靜茶室與美齡書房，依山而築俯瞰大台北盆地，是陽明山極具代表性的歷史文化名勝。",
    "geoLat": 25.15439099285714,
    "geoLon": 121.53803735
  },
  {
    "id": "site_46",
    "code": "46",
    "name": "文化大學大孝館 (圓柱體育館)",
    "category": "校園名勝",
    "plusCode": "4GPR+66",
    "district": "west",
    "districtName": "西區・文大與美軍俱樂部",
    "x": 145,
    "y": 335,
    "radius": 45,
    "title": "46 文化大學大孝館 (圓柱體育館)",
    "description": "陽明山腰最宏偉壯觀的經典圓柱形建築！座落於中國文化大學校園核心的大孝館，是全校的綜合體育館，內部匯聚室內挑高籃球館、羽球館、排球場與體適能中心。其標誌性的巨型圓柱樓體、環狀採光帶與銀白鋼架圓穹頂，即使從山下士林、北投或大台北盆地各角落仰望陽明山山腰，都能第一眼看見這棟傲立山間的圓柱地標！",
    "geoLat": 25.13806,
    "geoLon": 121.54059
  },
  {
    "id": "site_47",
    "code": "47",
    "name": "草山夜未眠景觀餐廳",
    "category": "夜景名勝",
    "plusCode": "4GMQ+J6",
    "district": "west",
    "districtName": "西區・文大與美軍俱樂部",
    "x": 135,
    "y": 840,
    "radius": 45,
    "title": "47 草山夜未眠景觀餐廳",
    "description": "全台北最浪漫夢幻的傳奇約會勝地！坐落於文化大學後山陡峭山崖邊，以「金色夢幻旋轉木馬」與凌空突出的「心形發光空中觀景台」聞名全台。環抱著百年相思老樹，層層柚木露台上設置舒適白色沙發卡座與高空發光吧台，正對著台北101與大台北盆地百萬璀璨夜景，是無數戀人告白與求婚的永恆愛情地標。",
    "geoLat": 25.13435,
    "geoLon": 121.54052
  },
  {
    "id": "site_48",
    "code": "48",
    "name": "陽明山順天府 (池府王爺)",
    "category": "宗教信仰",
    "plusCode": "4GPX+37",
    "district": "east",
    "districtName": "東區・建業學園與生態",
    "x": 620,
    "y": 320,
    "radius": 40,
    "title": "48 陽明山順天府 (池府王爺)",
    "description": "陽明里建業聚落最重要的民間信仰中心！座落於建業路74巷山腰，主祀威靈顯赫的池府千歲（池府王爺）。廟貌保留傳統閩南紅磚燕尾紅瓦風貌，門前橫排懸掛成串象徵吉祥祈福的「順天府」大紅燈籠，門柱題有「國泰民安」「風調雨順」對聯，正殿前矗立大型三足天公香爐，香火鼎盛，長年庇佑山仔后、華岡學子與在地鄰里闔家平安。",
    "geoLat": 25.13767,
    "geoLon": 121.55064
  },
  {
    "id": "site_49",
    "code": "49",
    "name": "文化大學 大義館 (八角中庭宮殿)",
    "category": "校園名勝",
    "plusCode": "4GPR+5W",
    "district": "west",
    "districtName": "西區・文大與美軍俱樂部",
    "x": 138,
    "y": 350,
    "radius": 45,
    "title": "49 文化大學 大義館 (八角中庭宮殿)",
    "description": "中國文化大學校園最核心的心臟地標！俯瞰呈現壯麗宏偉的「正八角形」中式宮殿樓體，中央巧妙內嵌巨型圓形採光天井中庭。為理學院與工學院的核心重鎮，內部匯聚尖端理工實驗室、階梯講堂與華岡微縮地質展區，雙層八角飛簷宮殿與中央迴廊氣勢磅礡，是每位華岡學子穿梭各館舍必經的中樞核心。",
    "geoLat": 25.138,
    "geoLon": 121.53988
  },
  {
    "id": "site_50",
    "code": "50",
    "name": "文化大學 大恩館 (行政大樓與百花池涼亭)",
    "category": "校園地標",
    "plusCode": "4GPR+3J",
    "district": "west",
    "districtName": "西區・文大與美軍俱樂部",
    "x": 120,
    "y": 365,
    "radius": 40,
    "title": "50 文化大學 大恩館 (行政大樓與百花池涼亭)",
    "description": "文化大學最高行政樞紐大樓，樓高12層巍峨矗立於華岡之巔。頂層飾以中式琉璃金瓦大飛簷，樓內設有校長室、教務處與國際會議中心。大樓正面俯瞰著名的百花池八角木涼亭與噴泉花園，也是學子自仇人坡步入校園後映入眼簾的首座巍峨宮殿。",
    "geoLat": 25.13735,
    "geoLon": 121.53925
  },
  {
    "id": "site_51",
    "code": "51",
    "name": "文化大學 大賢館 (法學院與社科院)",
    "category": "校園地標",
    "plusCode": "4GPR+6V",
    "district": "west",
    "districtName": "西區・文大與美軍俱樂部",
    "x": 155,
    "y": 355,
    "radius": 35,
    "title": "51 文化大學 大賢館 (法學院與社科院)",
    "description": "位於大義館南側、老子大道與朱子路環抱之學術重鎮。大賢館外觀典雅端莊，紅柱白牆、歇山式綠琉璃屋頂，為法學院與社會科學院之培育搖籃。樓前設有綠意庭園與石階步道，培育出無數台灣法界名家、司法官與社會學士。",
    "geoLat": 25.1378,
    "geoLon": 121.5408
  },
  {
    "id": "site_52",
    "code": "52",
    "name": "文化大學 大仁館 (十字風車綠瓦藝術學院)",
    "category": "校園名勝",
    "plusCode": "4GPR+8W",
    "district": "west",
    "districtName": "西區・文大與美軍俱樂部",
    "x": 138,
    "y": 320,
    "radius": 45,
    "title": "52 文化大學 大仁館 (十字風車綠瓦藝術學院)",
    "description": "從空中俯瞰最震撼的華岡地標！呈現正十字星風車對稱翼樓架構，四面伸展延伸綠琉璃瓦大坡頂與雕樑飛簷。內部座落國際級『華岡大劇院』、音樂廳與舞蹈展演廳，是台灣藝術、國樂、戲劇與舞蹈頂尖人才的孕育搖籃，夜間在山林霧氣中宛如翡翠神殿。",
    "geoLat": 25.13885,
    "geoLon": 121.5398
  },
  {
    "id": "site_53",
    "code": "53",
    "name": "歐洲學校足球場 (戶外人工草皮)",
    "category": "休閒運動",
    "plusCode": "4GPX+FQ",
    "district": "east",
    "districtName": "東區・凱旋美軍山仔后",
    "x": 395,
    "y": 415,
    "radius": 40,
    "title": "53 歐洲學校足球場 (戶外人工草皮)",
    "description": "座落於凱旋路與國泰街交叉口、美軍俱樂部與美軍宿舍群環抱之國際標準戶外足球場。鋪設翠綠頂級人造草皮，劃設白色球門線與中圈禁區，兩側配備專業立體球門與金屬防護圍網，四周聳立高桿球場夜間探照燈。背倚壯闊大屯山與七星山群峰，常有各國學子與社區足球隊在此奔馳切磋，是山仔后最具朝氣的綠茵運動地標。",
    "geoLat": 25.1365,
    "geoLon": 121.5435
  },
  {
    "id": "site_54",
    "code": "54",
    "name": "山仔后文史工作室 (美軍宿舍文化景觀)",
    "category": "歷史古蹟",
    "plusCode": "4GPX+58",
    "district": "east",
    "districtName": "東區・愛富美軍宿舍群",
    "x": 260,
    "y": 265,
    "radius": 35,
    "title": "54 山仔后文史工作室 (美軍宿舍文化景觀)",
    "description": "座落於愛富二街北側、草山美軍眷舍核心腹地的文史倡議重鎮！長期致力於山仔后美軍宿舍群的文化資產保存，推動全台最大冷戰美軍聚落列為台北市文化景觀。建築本體由典型 1950 年代美式木造眷舍活化改建，白木雨淋板、紅磚煙囪與大木窗前廊古意盎然。館內典藏豐富的冷戰老照片、美軍眷屬生活史料與老地圖，門前設有美軍老郵筒與歷史導覽解說牌，是守護草山記憶的靈魂基地。",
    "geoLat": 25.13795,
    "geoLon": 121.5458
  },
  {
    "id": "site_55",
    "code": "55",
    "name": "文化大學 曉峯紀念館 (一樓全聯福利中心)",
    "category": "校園地標",
    "plusCode": "4GPR+9W",
    "district": "west",
    "districtName": "西區・文大與美軍俱樂部",
    "x": 160,
    "y": 320,
    "radius": 45,
    "title": "55 文化大學 曉峯紀念館 (一樓全聯福利中心)",
    "description": "文化大學紀念創辦人張其昀先生（字曉峯）所建之十層宏偉總圖書館與資訊大樓！內部匯聚校史館、古籍珍本展與微縮典藏中心。最貼近師生日常的標誌特色，是一樓進駐的『全聯福利中心 PXmart 士林華岡店』，醒目的深藍色招牌、橘色圓形標誌、大落地玻璃自動滑門與整排金屬手推車，是全校學子每日課後採買零食、生鮮與生活必需品的校園生活大動脈！",
    "geoLat": 25.1384,
    "geoLon": 121.5404
  },
  {
    "id": "site_56",
    "code": "56",
    "name": "阿緹卡義大利 pizza專賣店 (Antica)",
    "category": "文化餐飲",
    "plusCode": "4GPR+PP",
    "district": "west",
    "districtName": "西區・文大與美軍俱樂部",
    "x": 175,
    "y": 325,
    "radius": 40,
    "title": "56 阿緹卡義大利 pizza專賣店 (Antica)",
    "description": "座落於凱旋路與國泰街交界街廓、緊鄰凱旋路旁的美式老眷舍窯烤披薩與義大利麵名店！戶外擁有純白遮陽棚、悠閒木餐桌椅與綠意盆栽，最著名的地標特色是經典的拿坡里紅磚石砌圓頂披薩柴燒大烤爐，專賣正宗手擀薄脆羅馬方形披薩、經典義大利肉醬麵與海鮮燉飯，濃郁現烤起司香氣撲鼻，是陽明山極受歡迎的異國料理聚落。",
    "geoLat": 25.1367,
    "geoLon": 121.5424
  },
  {
    "id": "site_57",
    "code": "57",
    "name": "光在草山 (Light On Old Town)",
    "category": "文化餐飲",
    "plusCode": "4GPR+MQ",
    "district": "west",
    "districtName": "西區・文大與美軍俱樂部",
    "x": 185,
    "y": 335,
    "radius": 35,
    "title": "57 光在草山 (Light On Old Town)",
    "description": "座落於國泰街與凱旋路街廓南側、大衛小小羊與阿緹卡東南隔壁的草山文青老眷舍！保留深灰美軍木造建築雨淋板質感，配備整片落地採光玻璃窗與溫暖復古鎢絲吊燈串。提供頂級手沖單品咖啡、手作肉桂捲與戚風蛋糕，戶外設置原木露台與攝影打卡牆，是美軍眷舍聚落中極具藝術氣息的靜謐歇腳地。",
    "geoLat": 25.1365,
    "geoLon": 121.5426
  },
  {
    "id": "site_58",
    "code": "58",
    "name": "陽明山耶穌聖體堂 (天主教主徒會)",
    "category": "宗教信仰",
    "plusCode": "4GPR+QX",
    "district": "west",
    "districtName": "西區・華岡美軍生活圈",
    "x": 140,
    "y": 270,
    "radius": 40,
    "title": "58 陽明山耶穌聖體堂 (天主教主徒會)",
    "description": "座落於華岡路彎道外側、文化大學教職員宿舍與真愛桃花源北側的草山天主教神聖殿堂！與天主教主徒會總會院緊緊相依。最令人動容的地標標誌，是庭園中矗立的『黃柱八角聖母亭』，潔白莊嚴的聖母立像雙手合十垂憐祈福，四周環繞紅色鍛鐵欄杆與繁茂的紫紅景觀灌木花叢；後方禮拜堂立面純白聖潔，鐘樓頂端高聳金光十字架，長年為草山學子、神職人員與登山信友帶來心靈的撫慰與平靜。",
    "geoLat": 25.1386,
    "geoLon": 121.5432
  },
  {
    "id": "site_59",
    "code": "59",
    "name": "草山溫泉湯王池 (陽明山溫泉第一泉)",
    "category": "自然景觀",
    "plusCode": "4GQ3+MG",
    "district": "north",
    "districtName": "北區・草山歷史官舍",
    "x": 620,
    "y": 95,
    "radius": 40,
    "title": "59 草山溫泉湯王池 (陽明山溫泉第一泉)",
    "description": "陽明山歷史最悠久的天然硫磺溫泉源頭泉池！座落於青邨介壽堂與八卦升旗臺旁的幽靜山谷中。古樸厚實的青石砌成圓形八角大溫泉池，池內湛藍碧綠的滾燙天然硫磺原湯汩汩湧出，泉心終年熱氣騰騰、升騰著裊裊立體白煙與濃郁硫磺香氣。池邊保留日式木造湯之樋（引泉木管）、石燈籠與木格安全圍欄，是見證草山近百年溫泉療癒文史的活化石。",
    "geoLat": 25.1542,
    "geoLon": 121.5488
  },
  {
    "id": "site_60",
    "code": "60",
    "name": "陽明山中山樓",
    "category": "歷史古蹟",
    "plusCode": "4GQ4+83",
    "district": "yangmingshan",
    "districtName": "陽明山公園區",
    "x": 640,
    "y": 70,
    "radius": 50,
    "title": "60 陽明山中山樓",
    "description": "正面朝南略偏西、面向紗帽山，由建築師修澤蘭設計的宮殿式建築，是陽明山的重要歷史地標。遊戲以綠瓦屋頂、白色基座、柱廊、圓形樓閣及入口石階表現其辨識特徵，並依地圖校正位置。 周邊以淡色泉水、石岸與蒸氣表現白磺溫泉地景；泉池位置是遊戲景觀示意，不代表實際泉源或開放泡湯設施。",
    "geoLat": 25.155733285714284,
    "geoLon": 121.55288110000001,
    "sourceUrl": "https://www.taiwan.nps.gov.tw/home/zh-tw/attractions/21185"
  },
  {
    "id": "site_61",
    "code": "61",
    "name": "前山公園・陽明湖",
    "category": "湖畔景觀",
    "district": "yangmingshan",
    "districtName": "陽明山公園區",
    "x": 0,
    "y": 0,
    "radius": 40,
    "title": "61 前山公園・陽明湖",
    "description": "沿著陽明湖散步，認識前山公園的水景與湖中小島。遊戲保留地圖上的湖岸輪廓，加入石岸、樹蔭與觀景平台。",
    "geoLat": 25.14994,
    "geoLon": 121.5486578,
    "sourceUrl": "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_379000000a_002178"
  },
  {
    "id": "site_62",
    "code": "62",
    "name": "前山公園・磐流園",
    "category": "溫泉庭園",
    "district": "yangmingshan",
    "districtName": "陽明山公園區",
    "x": 0,
    "y": 0,
    "radius": 40,
    "title": "62 前山公園・磐流園",
    "description": "前山公園的磐流園以水道、岩石與樹蔭構成庭園。遊戲以縮小的水道、石組與休憩亭呈現這處散步空間。",
    "geoLat": 25.150847765384615,
    "geoLon": 121.54828464615386,
    "sourceUrl": "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_379000000a_002178"
  },
  {
    "id": "site_63",
    "code": "63",
    "name": "陽明公園・花鐘",
    "category": "公園地標",
    "district": "yangmingshan",
    "districtName": "陽明山公園區",
    "x": 0,
    "y": 0,
    "radius": 40,
    "title": "63 陽明公園・花鐘",
    "description": "陽明公園的花鐘是花季代表景觀。遊戲以圓形花壇、鐘面指針與環形花圃呈現，四周搭配賞花步道與樹林。",
    "geoLat": 25.159013715,
    "geoLon": 121.53900241000001,
    "sourceUrl": "https://travel.taipei/file/35634/"
  },
  {
    "id": "site_64",
    "code": "64",
    "name": "辛亥光復樓",
    "category": "歷史建築",
    "district": "yangmingshan",
    "districtName": "陽明山公園區",
    "x": 0,
    "y": 0,
    "radius": 40,
    "title": "64 辛亥光復樓",
    "description": "位於陽明公園的兩層宮殿式建築，是公園的重要地標。遊戲以屋頂、柱廊與觀景平台表現建築輪廓。",
    "geoLat": 25.1596297,
    "geoLon": 121.53976935,
    "sourceUrl": "https://tcmb.culture.tw/zh-tw/detail?id=753902&indexCode=Culture_Media"
  },
  {
    "id": "site_65",
    "code": "65",
    "name": "陽明書屋・中興賓館",
    "category": "歷史建築",
    "district": "yangmingshan",
    "districtName": "陽明山公園區",
    "x": 0,
    "y": 0,
    "radius": 40,
    "title": "65 陽明書屋・中興賓館",
    "description": "陽明書屋原名中興賓館，曾用於接待賓客與夏日避暑。遊戲以綠色外牆、兩層量體及林間庭園呈現，建築比例依遊玩需要縮小。",
    "geoLat": 25.162891458064518,
    "geoLon": 121.54078626774194,
    "sourceUrl": "https://www.taiwan.nps.gov.tw/home/zh-tw/attractions/20974.html"
  },
  {
    "id": "site_66",
    "code": "66",
    "name": "陽明山國家公園遊客中心",
    "category": "遊客服務",
    "district": "yangmingshan",
    "districtName": "陽明山公園區",
    "x": 0,
    "y": 0,
    "radius": 40,
    "title": "66 陽明山國家公園遊客中心",
    "description": "陽明山國家公園的主要遊客服務據點之一。這裡可以作為探索公園區的起點；遊戲中的建築採入口大廳與庭園的風格化示意。",
    "geoLat": 25.155421583333332,
    "geoLon": 121.54669205,
    "sourceUrl": "https://www.ymsnp.gov.tw/ch/specialreport/accessible-travel/142"
  },
  {
    "id": "site_67",
    "code": "67",
    "name": "陽明公園前門",
    "category": "公園入口",
    "district": "yangmingshan",
    "districtName": "陽明山公園區",
    "x": 0,
    "y": 0,
    "radius": 40,
    "title": "67 陽明公園前門",
    "description": "從公園前門進入陽明公園，沿園內步道探索花鐘與辛亥光復樓。遊戲以入口牌樓、步道與花木作為這段旅程的起點。",
    "geoLat": 25.1546656,
    "geoLon": 121.53915923846154,
    "sourceUrl": "https://www.travel.taipei/zh-tw/attraction/details/414"
  }
];


  // 2. 體素角色系統
  /**
 * 陽明里漫步 3D 方塊版 - 體素角色模組 (VoxelCharacter.js)
 * 包含玩家方塊小人 (Steve 風格) 與里長 NPC
 */

class VoxelCharacter {
  constructor(options = {}) {
    this.isNpc = options.isNpc || false;
    this.name = options.name || (this.isNpc ? '里長' : '小人');
    this.shirtColor = options.shirtColor || (this.isNpc ? 0x6b4226 : 0x2a9d8f);
    this.pantsColor = options.pantsColor || (this.isNpc ? 0x333333 : 0x264653);
    this.skinColor = options.skinColor || 0xe0aa86;
    this.hairColor = options.hairColor || (this.isNpc ? 0x222222 : 0x4a3018);

    this.group = new THREE.Group();
    this.speed = 7.5;
    this.targetPos = null;
    this.isMoving = false;
    this.walkAnimTime = 0;

    this.initMesh();
  }

  initMesh() {
    // 材品質感 (使用平滑或霧面 Phong/Lambert 展現溫潤方塊感)
    const skinMat = new THREE.MeshLambertMaterial({ color: this.skinColor });
    const hairMat = new THREE.MeshLambertMaterial({ color: this.hairColor });
    const shirtMat = new THREE.MeshLambertMaterial({ color: this.shirtColor });
    const pantsMat = new THREE.MeshLambertMaterial({ color: this.pantsColor });

    // 1. 軀幹 (Body)
    const bodyGeo = new THREE.BoxGeometry(0.9, 1.1, 0.5);
    this.bodyMesh = new THREE.Mesh(bodyGeo, shirtMat);
    this.bodyMesh.position.y = 1.35;
    this.bodyMesh.castShadow = true;
    this.bodyMesh.receiveShadow = true;
    this.group.add(this.bodyMesh);

    // 2. 頭部 (Head)
    this.headGroup = new THREE.Group();
    this.headGroup.position.y = 2.3;

    const headGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    this.headGroup.add(headMesh);

    // 頭髮 (Hair / Cap)
    const hairGeo = new THREE.BoxGeometry(0.78, 0.35, 0.78);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.y = 0.25;
    hairMesh.castShadow = true;
    this.headGroup.add(hairMesh);

    // 眼睛
    const eyeGeo = new THREE.BoxGeometry(0.12, 0.08, 0.05);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.2, 0.02, 0.39);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.2, 0.02, 0.39);
    this.headGroup.add(leftEye, rightEye);

    this.group.add(this.headGroup);

    // 3. 左手臂 (Left Arm)
    this.leftArmPivot = new THREE.Group();
    this.leftArmPivot.position.set(-0.65, 1.8, 0);
    const leftArmGeo = new THREE.BoxGeometry(0.35, 0.95, 0.35);
    const leftArmMesh = new THREE.Mesh(leftArmGeo, shirtMat);
    leftArmMesh.position.y = -0.45;
    leftArmMesh.castShadow = true;
    this.leftArmPivot.add(leftArmMesh);
    this.group.add(this.leftArmPivot);

    // 4. 右手臂 (Right Arm)
    this.rightArmPivot = new THREE.Group();
    this.rightArmPivot.position.set(0.65, 1.8, 0);
    const rightArmGeo = new THREE.BoxGeometry(0.35, 0.95, 0.35);
    const rightArmMesh = new THREE.Mesh(rightArmGeo, shirtMat);
    rightArmMesh.position.y = -0.45;
    rightArmMesh.castShadow = true;
    this.rightArmPivot.add(rightArmMesh);
    this.group.add(this.rightArmPivot);

    // 5. 左腿 (Left Leg)
    this.leftLegPivot = new THREE.Group();
    this.leftLegPivot.position.set(-0.24, 0.8, 0);
    const legGeo = new THREE.BoxGeometry(0.4, 0.8, 0.45);
    const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
    leftLegMesh.position.y = -0.4;
    leftLegMesh.castShadow = true;
    this.leftLegPivot.add(leftLegMesh);
    this.group.add(this.leftLegPivot);

    // 6. 右腿 (Right Leg)
    this.rightLegPivot = new THREE.Group();
    this.rightLegPivot.position.set(0.24, 0.8, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
    rightLegMesh.position.y = -0.4;
    rightLegMesh.castShadow = true;
    this.rightLegPivot.add(rightLegMesh);
    this.group.add(this.rightLegPivot);

    // 7. 腳下陰影圓形
    const shadowGeo = new THREE.CircleGeometry(0.55, 16);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.25,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.02;
    this.group.add(shadowMesh);
  }

  moveTo(targetX, targetZ) {
    this.targetPos = new THREE.Vector3(targetX, this.group.position.y, targetZ);
    this.isMoving = true;
  }

  stop() {
    this.targetPos = null;
    this.isMoving = false;
  }

  update(delta) {
    if (this.isMoving && this.targetPos) {
      const curPos = this.group.position;
      const dir = new THREE.Vector3().subVectors(this.targetPos, curPos);
      dir.y = 0;
      const dist = dir.length();

      if (dist < 0.15) {
        curPos.x = this.targetPos.x;
        curPos.z = this.targetPos.z;
        this.stop();
      } else {
        dir.normalize();
        const moveDist = Math.min(dist, this.speed * delta);
        curPos.addScaledVector(dir, moveDist);

        // 旋轉平滑朝向移動方向
        const targetAngle = Math.atan2(dir.x, dir.z);
        // 短弧插值旋轉
        let diff = targetAngle - this.group.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.group.rotation.y += diff * Math.min(1, delta * 12);
      }
    }

    // 行走 / 待機動畫更新
    if (this.isMoving) {
      this.walkAnimTime += delta * 12;
      const angle = Math.sin(this.walkAnimTime) * 0.6;
      this.leftLegPivot.rotation.x = angle;
      this.rightLegPivot.rotation.x = -angle;
      this.leftArmPivot.rotation.x = -angle * 0.9;
      this.rightArmPivot.rotation.x = angle * 0.9;

      // 走路微幅起伏
      this.bodyMesh.position.y = 1.35 + Math.abs(Math.sin(this.walkAnimTime * 2)) * 0.08;
      this.headGroup.position.y = 2.3 + Math.abs(Math.sin(this.walkAnimTime * 2)) * 0.08;
    } else {
      // 緩慢呼吸待機動畫
      this.walkAnimTime += delta * 2;
      const idleArm = Math.sin(this.walkAnimTime) * 0.05;
      this.leftLegPivot.rotation.x *= 0.85;
      this.rightLegPivot.rotation.x *= 0.85;
      this.leftArmPivot.rotation.x = idleArm;
      this.rightArmPivot.rotation.x = -idleArm;
      this.bodyMesh.position.y = 1.35;
      this.headGroup.position.y = 2.3 + Math.sin(this.walkAnimTime) * 0.02;
    }
  }
}


  // 3. 體素地形與自然景觀
  /** OpenStreetMap contributors, ODbL 1.0. Selected main streets and landmark approaches. */
window.REAL_ROADS = {"source":"OpenStreetMap contributors","license":"ODbL-1.0","sourceUrl":"https://www.openstreetmap.org/copyright","downloaded":"2026-09-26","boundaryRelation":3629858,"villageCode":"63000110046","projection":{"lon":121.54685380000001,"lat":25.1409792,"metersPerLongitudeDegree":100774.11879942456,"metersPerLatitudeDegree":111320,"unitsPerMeter":0.32,"halfSize":1000},"boundary":[[234.1345566534051,87.44230528004464],[216.82075685070797,56.13734015995915],[203.07355466053735,40.41005056005465],[194.05386793173938,11.897881599954554],[214.24093940954037,-39.644168959963416],[216.3886374292872,-61.38451968002501],[200.1422370932432,-84.32890751998279],[189.32957724243508,-94.45635584000311],[174.72781052471157,-103.47594751998564],[163.5604257761668,-105.62041599998797],[160.12281903537792,-111.63347712001851],[146.80773626662804,-120.38946303995785],[154.11184439709993,-192.1151654399698],[162.6994117049354,-236.18719872004272],[189.32957724243508,-284.2916876800339],[207.80107012191002,-317.79099263994516],[304.8699261212319,-452.37954432004636],[315.6084162204243,-506.0625011200516],[279.95856395412665,-520.2366540800301],[257.1948998067682,-512.5065932799304],[209.18127245307676,-496.25565439998115],[208.0332536915876,-482.7048934399475],[200.2712279649808,-468.1353318400308],[193.0767620756692,-459.92080639996465],[185.3921308727465,-454.2889049599589],[172.07382333192822,-442.06329727997115],[165.72424765488083,-432.19945471999404],[147.44624108347054,-408.35738240004997],[129.21338131735172,-387.56102528000963],[120.37105703719297,-386.13969151997867],[114.17627040659728,-381.41259904004244],[110.77413615581119,-376.632072959988],[106.0175977485725,-370.2378521599327],[102.73800482630374,-364.49908351994367],[101.74155033965619,-356.28099583996243],[100.61932975288119,-347.4252671999965],[102.40585333075455,-327.33423359997244],[96.15947035118887,-321.99087360004813],[89.26813301110215,-312.4618815999343],[84.45354871121494,-304.998988800046],[85.06303058173317,-298.9039961599439],[82.63800218701728,-287.96435712005047],[78.30713365752084,-266.7512179199487],[74.97594438674034,-254.99938815992917],[71.61895694124571,-236.29406592002601],[69.790511329691,-223.2883276800337],[72.25746175762994,-210.57113087999625],[79.55512034488159,-191.22104320002512],[73.63121454511814,-191.4810867200267],[67.88789596652056,-186.31227647999077],[63.18295390825187,-177.3283072000449],[61.73825614121635,-161.60457983992887],[58.67149815758957,-151.6873036799601],[56.84950208971339,-143.6152678400404],[55.59506585913239,-137.08568192004842],[52.7475923582844,-127.14703231995642],[50.22582080930706,-117.2938764799776],[41.73822142780149,-97.37026816001176],[35.0500447110681,-86.13852543999529],[30.425721947635395,-83.33148031996993],[13.666582894876374,-77.15099392000775],[-1.3060325800092683,-71.35166719994382],[-16.36249212134104,-67.97822592000698],[-21.031961690065206,-58.4492339200197],[-20.80945243567628,-50.64436607993171],[-25.082275072982466,-40.38511488001637],[-25.79817441305083,-30.702946560010833],[-29.416368374089046,-27.54680191995567],[-33.21837432836152,-24.01662207995896],[-38.3070642311494,-19.253907199986134],[-45.60149804633263,-20.603996159943883],[-58.948828533016886,-21.811595520008268],[-68.96174497731052,-24.458339839932115],[-77.08494514533251,-24.736194560015246],[-84.3213330678672,-26.862851839936003],[-101.69640353482299,-39.18820223995031],[-108.77477763929583,-43.519886079948314],[-116.96892278732341,-48.71719423993759],[-131.17726734478083,-53.25905023998712],[-136.44654446873457,-56.636053759965584],[-144.44075376501897,-52.42192383994921],[-140.6065000928121,-33.45655808004453],[-143.37335429836583,-15.513555199937901],[-142.08989512146056,-7.648129280028115],[-125.47909557147472,6.88580991997851],[-117.64612486577886,19.905797120010813],[-113.31848110789254,37.43914240001273],[-108.1523966818788,54.23866624004495],[-108.84572261884315,59.97387263999235],[-115.98536738757467,60.87511936002024],[-131.91574008749492,58.74489984005786],[-136.42397106608882,63.66435327996401],[-136.15953977847684,78.67207040006534],[-137.31400808318625,88.29011839995434],[-152.40271534291068,92.34394751999575],[-164.0860635802389,106.54659840005415],[-176.69492132420908,108.42746112001332],[-183.49596505371287,109.44269951998122],[-199.14255783498552,116.39619199999133],[-256.50479864187224,132.04155007995084],[-277.5432098751577,156.43933184006113],[-279.103999427032,164.20145280002927],[-285.47614850718344,169.70511360005506],[-299.38458928748435,171.73559039999083],[-315.6084162208826,184.1927436800267],[-315.3601087922378,195.73083903995314],[-248.39449756074904,200.99582975997401],[-233.0381342413442,204.76467967997561],[-222.8994516973814,225.33305344000942],[-222.1448550957001,224.99820288001956],[-213.0477738436763,217.22183296001148],[-211.19997960108597,218.42943231994934],[-205.3566930966168,220.7448883200515],[-191.60949090644618,229.67898624004738],[-182.9187309015873,233.44783616004898],[-180.30989051409543,238.9514969599482],[-169.88097850780647,240.97841151996892],[-146.70454356960457,257.4929561599613],[-153.9473810358178,266.1883839999523],[-138.88124717919737,274.7662579199617],[-121.11275455243374,288.32770559999375],[-113.8989400320865,296.27150080006],[-108.02018103761453,302.64434815999215],[-99.4229394149487,305.5012646399675],[-93.11528577112436,300.48206848003474],[-74.2535955034517,333.81751040005605],[-72.36710399970674,345.98612224001045],[-65.02429860716364,355.42249600005437],[-58.7327688223065,369.68926719997626],[-56.63666715152967,375.9801830399633],[-48.93913686124993,391.28712832001787],[-43.42155230865141,399.0563737600693],[-34.40186557939519,418.1464179200388],[-26.639839853246656,421.29187583996907],[-23.91490768091599,434.9281305599894],[-9.603370425518582,471.6583872000708],[2.6797853670391976,482.2311155199793],[10.20962752351015,483.8269990400252],[21.21899845399306,479.19252480003234],[34.25352607616374,476.29286144006363],[57.410612383330026,471.0884287999911],[74.65991675015836,505.4177356799836],[81.77698811624413,509.17589887998685],[95.09529565660412,509.0369715200086],[112.45424226459271,507.8685568000225],[120.24851570913393,510.8501516800627],[122.03826405861743,516.8596505600516],[131.07084987523072,520.2366540800301],[137.8557697457673,512.7844480000135],[131.88994191278078,483.1537356800039],[127.61389450386449,449.68292864004593],[149.0973242459278,439.9223910400105],[165.28245391817137,428.0387583999693],[195.8307171943241,405.0160012799816],[194.98582698251812,396.0783411200706],[181.26119819499323,362.8889510399843],[174.70523712206585,329.2863411200048],[163.8732286406804,267.5455974399933],[166.94643616752742,244.59764735999386],[186.61109461378297,172.0740032000223],[191.73525700657365,165.10982400001384],[192.32539024605626,152.07202560002654],[196.44664860852086,137.04293504005508],[234.1345566534051,87.44230528004464]],"roads":[{"id":"osm-27867001-0-view-0","osmWay":27867001,"name":"菁山路101巷","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[337.1305,-101.9442],[327.6497,-91.3964],[323.7155,-86.6337],[320.5068,-83.677],[318.4881,-80.4532],[316.3953,-77.9667],[315.6374,-71.4407],[314.7539,-65.3707],[310.9035,-59.924],[308.6461,-54.7445],[308.2269,-53.113],[307.3433,-46.4302]],"displayRole":"landmark-access"},{"id":"osm-295177316-0-view-0","osmWay":295177316,"name":"釋迦大道","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[-228.1429,135.3259],[-227.4012,137.3742],[-225.3632,142.9919],[-221.5934,152.3641]],"displayRole":"landmark-access"},{"id":"osm-28492749-0-view-2","osmWay":28492749,"name":"竹子湖路","kind":"primary","width":3.84,"widthSource":"estimated by road class","points":[[-56.4077,-400.5917],[-61.4738,-401.9774],[-68.7231,-402.925],[-78.6619,-404.0863],[-92.5735,-405.6786],[-98.5523,-408.0118],[-101.7577,-410.9578],[-103.3152,-414.2422],[-103.3894,-418.3922],[-100.6129,-422.4532],[-94.8018,-424.3483],[-83.4603,-422.9163],[-77.717,-422.3107],[-66.3852,-423.4078],[-38.0136,-432.5557],[-5.6724,-449.9643],[1.9865,-454.752],[8.6392,-461.563],[13.6537,-463.9675]],"displayRole":"landmark-access"},{"id":"osm-28492749-0-view-31","osmWay":28492749,"name":"竹子湖路","kind":"primary","width":3.84,"widthSource":"estimated by road class","points":[[-9.5389,-493.9046],[-12.496,-495.6714],[-14.8436,-498.7635],[-21.7801,-506.2798]],"displayRole":"landmark-access"},{"id":"osm-295177317-0-view-0","osmWay":295177317,"name":"釋迦大道","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[-228.1429,135.3259],[-231.9095,124.3293]],"displayRole":"landmark-access"},{"id":"osm-263044480-0-view-0","osmWay":263044480,"name":"紗帽路","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[-420.249,-278.4389],[-420.536,-275.0299],[-421.3551,-270.1282],[-429.0817,-257.696],[-431.6131,-253.6244],[-439.3171,-240.4298],[-442.816,-237.2986],[-449.8879,-233.5725],[-451.8131,-231.9481],[-457.3468,-222.7754],[-465.154,-215.1344],[-469.8041,-197.5511],[-470.4942,-196.0229],[-476.7245,-192.2007],[-480.1846,-189.1443],[-480.8747,-186.8502],[-484.3349,-175.3833],[-485.7184,-171.561],[-486.2924,-170.927],[-487.1018,-170.0328],[-490.1073,-167.7708],[-494.7155,-165.4482],[-497.1147,-164.1195],[-498.8657,-160.8601],[-501.6326,-150.1591],[-502.0002,-145.4463],[-502.3034,-135.8531],[-501.2456,-129.637],[-495.4056,-117.2939],[-494.0899,-110.8605],[-493.848,-103.7431],[-494.6735,-99.3081]],"displayRole":"main"},{"id":"osm-380665339-0-view-0","osmWay":380665339,"name":"","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[40.7805,-327.8187],[46.5141,-330.5367],[48.4167,-331.3453]],"displayRole":"landmark-access"},{"id":"osm-295177368-0-view-0","osmWay":295177368,"name":"孔子大道","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[-243.4864,186.3372],[-240.9517,190.1167],[-239.2748,193.5436],[-236.9853,198.3562],[-228.6428,212.2276],[-224.6183,223.1636]],"displayRole":"landmark-access"},{"id":"osm-135864351-0-view-0","osmWay":135864351,"name":"中興路","kind":"unclassified","width":1.6,"widthSource":"estimated by road class","points":[[-319.6362,-693.3437],[-319.691,-695.6414],[-318.1721,-696.7848],[-315.2795,-697.7823],[-311.0002,-697.9639],[-302.2611,-696.3894],[-296.0566,-694.7544],[-287.3852,-690.5153],[-279.4039,-687.4411],[-272.0998,-685.1862],[-264.6215,-682.9562],[-262.7222,-682.3863],[-257.4787,-680.6479],[-252.4867,-679.1482],[-242.6254,-678.6744],[-239.249,-678.9416],[-237.5012,-680.0957],[-237.0884,-681.9695],[-238.7557,-684.1246],[-255.0375,-686.5719],[-259.2104,-687.8365],[-269.8263,-695.1604],[-277.0079,-698.7263],[-288.272,-704.8925],[-304.2733,-714.2647],[-313.6155,-718.8244],[-314.2508,-721.3607],[-314.2669,-721.4248],[-312.9673,-722.9566],[-310.61,-723.0492],[-306.3501,-721.9022],[-262.2159,-703.5673],[-257.3271,-701.1878],[-253.0027,-700.0942],[-249.0685,-700.5109],[-241.2871,-701.9643],[-235.1439,-702.6875],[-223.6379,-701.6936],[-216.8498,-701.9287],[-213.238,-702.5414],[-197.8623,-705.0955],[-195.7856,-705.8614],[-194.3828,-707.4324],[-194.4473,-709.3061],[-195.5276,-711.3401],[-196.5111,-712.0633],[-200.7807,-712.3269],[-208.417,-709.8119],[-213.0865,-708.9178],[-216.0242,-708.3764],[-220.1584,-708.4654],[-240.0939,-711.8959],[-251.3613,-712.8113],[-253.9121,-714.2683],[-255.2955,-715.7965],[-255.2955,-717.3247],[-254.6054,-718.8529],[-252.548,-719.8218],[-244.6796,-720.5343],[-217.2368,-718.8529],[-214.4699,-719.6188],[-212.3931,-721.147],[-210.3196,-722.6752],[-207.5495,-727.2634],[-207.485,-728.9412],[-207.398,-731.0571],[-207.3367,-732.507],[-208.0042,-734.2311],[-208.933,-735.6702],[-209.6263,-737.1984],[-210.5873,-745.7015],[-211.0097,-749.4276]],"displayRole":"main"},{"id":"osm-30688294-0-view-0","osmWay":30688294,"name":"紗帽路","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[49.6873,-290.3867],[46.627,-296.8486],[42.2606,-307.6208],[39.0552,-314.3784],[37.2977,-318.4856],[33.9472,-324.4702],[31.1158,-329.81],[28.9262,-333.0303],[23.5634,-338.9614],[22.6443,-339.7593],[13.357,-346.6772],[4.8372,-352.8791],[-4.5889,-359.3231],[-10.8159,-362.4365],[-11.5157,-362.864],[-14.3244,-364.5846],[-18.5779,-367.1886],[-19.7034,-368.4674]],"displayRole":"main"},{"id":"osm-445263445-0-view-0","osmWay":445263445,"name":"紗帽路","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[-443.6351,-392.4306],[-443.1675,-390.3538],[-442.8095,-387.0623],[-442.1356,-378.8656],[-442.4451,-366.3336],[-439.9846,-349.5555],[-441.4326,-345.0742],[-444.2026,-332.845],[-444.509,-319.4652],[-449.0462,-306.0926],[-450.6586,-300.2434],[-451.8131,-280.8684],[-451.8131,-278.5743],[-451.6196,-277.7977],[-449.4397,-276.8181],[-442.3516,-276.0736],[-437.5112,-277.3489],[-431.0359,-279.5361],[-426.2116,-281.0607],[-423.6802,-280.4409],[-420.249,-278.4389]],"displayRole":"main"},{"id":"osm-135871748-0-view-10","osmWay":135871748,"name":"和平路","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[7.4428,65.3564],[-1.8929,67.6861],[-10.029,69.7166],[-13.3989,71.1201]],"displayRole":"landmark-access"},{"id":"osm-34921733-0-view-0","osmWay":34921733,"name":"","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[49.6873,-290.3867],[51.6092,-290.2406],[53.0378,-290.3475],[79.0069,-288.7908],[82.3865,-288.5771]],"displayRole":"landmark-access"},{"id":"osm-445263446-0-view-0","osmWay":445263446,"name":"紗帽路","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[-494.6735,-99.3081],[-493.977,-94.5775],[-491.2553,-90.5379],[-482.8193,-84.6851],[-477.6403,-81.0623],[-469.3559,-77.2116],[-466.3697,-75.117],[-461.1327,-67.7182],[-457.4178,-64.8007],[-455.1217,-63.5254],[-451.6841,-62.6028],[-445.0862,-61.1672],[-431.0746,-56.8213],[-427.0114,-56.0768],[-421.1294,-56.6254],[-411.9388,-58.6523],[-404.6089,-59.0263],[-399.5879,-57.8757],[-394.2703,-56.9602],[-388.843,-59.9632],[-379.3912,-69.0718],[-372.9287,-72.9582],[-360.2586,-79.3133],[-358.0529,-80.2965],[-345.5762,-84.7635],[-343.3802,-85.9533],[-342.087,-87.3675],[-340.9068,-89.4621],[-339.6136,-99.3865],[-338.0174,-104.2098],[-336.1534,-107.2626],[-333.4382,-110.0697],[-329.8168,-112.0716],[-323.809,-114.1449],[-317.2466,-115.6588],[-310.6036,-115.324],[-304.6958,-113.8813],[-302.5739,-112.3922],[-300.065,-110.7714],[-297.5045,-108.8834],[-294.7893,-107.7863],[-292.3449,-108.089],[-287.9689,-109.1435],[-283.7767,-108.7908],[-279.7264,-107.569],[-275.9115,-105.5385]],"displayRole":"main"},{"id":"osm-465991469-0-view-0","osmWay":465991469,"name":"","kind":"steps","width":0.48,"widthSource":"estimated by road class","points":[[-9.5389,-493.9046],[-7.8975,-491.8029],[-3.6472,-491.9382],[-1.4769,-491.6568],[-0.3451,-491.6853],[2.1283,-491.4146],[3.5988,-490.8945],[4.9113,-490.3459],[6.2238,-488.0696],[11.2932,-483.6881],[12.5057,-481.3655],[14.4631,-475.0461],[15.1758,-473.2293],[15.7175,-470.6218]],"displayRole":"landmark-access"},{"id":"osm-445263342-0-view-0","osmWay":445263342,"name":"紗帽路","kind":"unclassified","width":1.6,"widthSource":"estimated by road class","points":[[-487.4042,34.8815],[-486.5471,33.6347],[-484.8122,32.0245],[-481.3681,30.0332],[-478.2304,29.2994],[-470.7328,29.7981],[-466.9018,30.7599],[-463.6254,29.7483]],"displayRole":"main"},{"id":"osm-135864329-0-view-0","osmWay":135864329,"name":"湖山路二段","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[-206.2338,-555.2463],[-205.2761,-554.1848],[-204.0894,-552.222],[-203.8959,-548.414],[-204.0894,-545.3398],[-205.5566,-540.2422],[-206.1661,-538.4611],[-209.6263,-532.3483],[-213.7991,-528.0023],[-233.8443,-507.124],[-237.5206,-502.7924],[-240.5454,-498.6602]],"displayRole":"main"},{"id":"osm-1091644849-0-view-0","osmWay":1091644849,"name":"","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[-253.9798,-479.4561],[-255.7373,-475.9081],[-257.6044,-472.2355],[-261.758,-467.7399],[-266.3178,-466.1405]],"displayRole":"landmark-access"},{"id":"osm-135864336-0-view-2","osmWay":135864336,"name":"新生街","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[-253.9798,-479.4561],[-251.6193,-478.5976]],"displayRole":"landmark-access"},{"id":"osm-135871656-0-view-0","osmWay":135871656,"name":"光華路","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[-27.604,145.1862],[-34.2696,147.1276],[-37.4847,143.3267],[-39.1326,141.396],[-44.6695,131.0441],[-46.211,128.661],[-50.4322,122.1243],[-52.4896,118.9361],[-56.9946,110.7394],[-59.4938,106.8814],[-60.8482,106.5039],[-73.1733,109.489],[-79.2584,111.7475]],"displayRole":"main"},{"id":"osm-135871658-0-view-0","osmWay":135871658,"name":"愛富二街厚生巷","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[-35.1403,45.5254],[-27.1719,72.5094]],"displayRole":"landmark-access"},{"id":"osm-524406402-0-view-0","osmWay":524406402,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[7.4428,65.3564],[7.862,69.8235],[16.9978,69.2357]],"displayRole":"landmark-access"},{"id":"osm-135871659-0-view-0","osmWay":135871659,"name":"","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[-209.4715,120.8419],[-185.3051,111.7938]],"displayRole":"landmark-access"},{"id":"osm-480214817-0-view-7","osmWay":480214817,"name":"","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[-181.7159,232.5893],[-200.2293,222.3871],[-211.903,216.3776]],"displayRole":"landmark-access"},{"id":"osm-135871672-0-view-0","osmWay":135871672,"name":"荀子大道(仇人坡)","kind":"pedestrian","width":0.96,"widthSource":"estimated by road class","points":[[-195.5631,156.3681],[-171.0677,145.9877]],"displayRole":"landmark-access"},{"id":"osm-135871676-0-view-0","osmWay":135871676,"name":"愛富一街","kind":"living_street","width":1.28,"widthSource":"estimated by road class","points":[[-43.3184,72.5949],[-28.4199,97.9723],[-9.9129,98.0863]],"displayRole":"main"},{"id":"osm-135871677-0-view-0","osmWay":135871677,"name":"愛富三街","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[-15.8111,47.9371],[-21.3448,45.7783],[-31.6963,46.1346],[-35.1403,45.5254],[-38.0588,46.3483],[-42.883,48.2042],[-87.2075,66.4999],[-89.3746,68.5446],[-89.7132,69.4281]],"displayRole":"main"},{"id":"osm-135871678-0-view-0","osmWay":135871678,"name":"長春街","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[-46.211,128.661],[-64.9792,135.4007],[-69.9356,137.1783],[-89.0359,144.4381],[-101.5287,149.1866],[-103.8086,149.5678],[-107.7751,148.809],[-109.51,147.5587],[-110.9225,145.8203],[-118.2653,128.8177],[-119.2134,126.6269]],"displayRole":"main"},{"id":"osm-135871679-0-view-0","osmWay":135871679,"name":"建業路11巷","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[32.5444,199.7277],[26.6818,196.0479],[22.2574,187.2349]],"displayRole":"landmark-access"},{"id":"osm-1092096107-0-view-0","osmWay":1092096107,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[-269.0266,-461.9869],[-279.7232,-465.6845]],"displayRole":"landmark-access"},{"id":"osm-1370883497-0-view-0","osmWay":1370883497,"name":"湖山路二段","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[-209.6263,-556.8066],[-207.5495,-556.0443],[-206.2338,-555.2463]],"displayRole":"main"},{"id":"osm-1370883498-0-view-0","osmWay":1370883498,"name":"湖山路二段","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[-231.5773,-566.6633],[-229.3845,-561.6691],[-227.6108,-559.464],[-224.8504,-558.3348],[-219.3135,-557.5725],[-216.7079,-557.5725],[-211.703,-557.5725],[-209.6263,-556.8066]],"displayRole":"main"},{"id":"osm-524342556-0-view-0","osmWay":524342556,"name":"建業路68巷","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[93.154,155.0928],[99.2553,153.5539],[102.9831,151.1209],[106.095,145.7597],[114.7471,142.4718],[125.6436,140.0495],[128.3975,139.134]],"displayRole":"landmark-access"},{"id":"osm-34921662-0-view-0","osmWay":34921662,"name":"泉源路","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[-607.992,-137.6141],[-601.8521,-139.5579],[-592.2809,-142.5181],[-585.7959,-145.9236],[-574.9833,-153.9814],[-563.2193,-157.8037],[-559.7591,-160.8601],[-558.3757,-164.6824],[-555.8733,-176.8723],[-552.8388,-182.2656],[-548.6885,-186.8502],[-546.6117,-188.3784],[-538.4208,-192.3147],[-536.2312,-193.7289],[-535.1541,-195.6026],[-530.5298,-215.2875],[-527.9274,-227.3635],[-524.9122,-238.72],[-523.603,-242.3677],[-522.3453,-246.0938],[-521.2037,-249.4815],[-518.8884,-255.8401],[-515.9054,-259.7407],[-505.7861,-271.6956],[-496.789,-278.5743],[-487.1018,-286.2189],[-485.0283,-288.5129],[-483.6416,-291.5693],[-482.9515,-293.8634],[-481.5681,-305.3267],[-478.798,-311.4431],[-474.6477,-316.7936],[-473.0901,-321.6382],[-471.6197,-328.3744],[-467.3372,-335.9513],[-465.6925,-341.2697],[-465.3926,-343.863],[-465.6506,-346.606],[-465.8022,-347.9311],[-466.3471,-353.5523],[-466.1504,-359.2626],[-466.1698,-362.3119],[-465.6087,-365.0655],[-464.8509,-367.7407],[-457.0469,-376.2117],[-455.4764,-379.1256],[-455.212,-380.3332]],"displayRole":"main"},{"id":"osm-135871691-0-view-0","osmWay":135871691,"name":"凱旋路","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[-210.0036,172.8577],[-171.0903,162.6697],[-168.8974,162.0962],[-165.8468,161.227],[-163.6926,160.9527]],"displayRole":"main"},{"id":"osm-524406403-0-view-0","osmWay":524406403,"name":"","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[-10.1,87.7629],[-0.6804,87.0718],[17.0074,86.5232]],"displayRole":"landmark-access"},{"id":"osm-1184467141-0-view-0","osmWay":1184467141,"name":"環七星山人車分道陽金公路段","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[-11.3318,-514.3198],[-11.6543,-514.7045],[-12.6121,-514.7401],[-13.9955,-513.7035],[-14.634,-514.4587]],"displayRole":"landmark-access"},{"id":"osm-135871728-0-view-0","osmWay":135871728,"name":"國泰街","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[-146.6239,123.6062],[-139.1779,143.4407],[-103.4668,184.9194]],"displayRole":"main"},{"id":"osm-135864331-0-view-18","osmWay":135864331,"name":"","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[-249.133,-655.6196],[-244.9762,-646.5109],[-244.2636,-644.053],[-244.0185,-642.4714]],"displayRole":"landmark-access"},{"id":"osm-135871739-0-view-3","osmWay":135871739,"name":"","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[-30.7321,192.0902],[-32.0865,200.5363],[-30.0387,202.2034],[-27.2332,203.2044]],"displayRole":"landmark-access"},{"id":"osm-465991479-0-view-9","osmWay":465991479,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[-242.893,-664.9491],[-242.6254,-665.2946],[-239.1104,-663.9552],[-238.4074,-663.1217],[-238.2461,-661.9141],[-230.9324,-658.0562]],"displayRole":"landmark-access"},{"id":"osm-135871741-0-view-0","osmWay":135871741,"name":"老子大道","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[-207.972,125.5868],[-209.4715,120.8419]],"displayRole":"landmark-access"},{"id":"osm-674242212-0-view-0","osmWay":674242212,"name":"菁山路72巷","kind":"service","width":0.96,"widthSource":"OSM width","points":[[138.6071,60.868],[129.7487,63.8567],[111.2579,65.8302],[90.9386,64.7651]],"displayRole":"landmark-access"},{"id":"osm-379437082-0-view-0","osmWay":379437082,"name":"","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[-266.3178,-466.1405],[-269.0266,-461.9869]],"displayRole":"landmark-access"},{"id":"osm-379810738-0-view-0","osmWay":379810738,"name":"湖山路二段","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[-240.5454,-498.6602],[-243.251,-496.8292],[-245.705,-493.0532],[-246.2146,-490.1607]],"displayRole":"main"},{"id":"osm-379810740-0-view-0","osmWay":379810740,"name":"湖山路二段","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[-246.2146,-490.1607],[-244.3184,-491.1759],[-243.7057,-492.0558],[-241.358,-495.5218],[-240.5454,-498.6602]],"displayRole":"main"},{"id":"osm-379810741-0-view-0","osmWay":379810741,"name":"湖山路一段","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[-246.2146,-490.1607],[-249.736,-483.7878],[-250.4745,-482.5303],[-251.3258,-481.0591],[-251.6193,-478.5976],[-252.0288,-462.7884],[-251.4258,-451.7348],[-251.371,-448.2652],[-250.5067,-439.1244],[-248.4622,-432.9333],[-246.4919,-428.8011],[-242.6157,-422.4318],[-241.4032,-420.4512],[-239.191,-416.8426],[-234.5377,-410.8118],[-229.0007,-406.2272],[-221.932,-402.1377],[-215.1181,-400.8731],[-187.6366,-386.7275],[-184.0248,-384.8217],[-176.4111,-382.5311],[-162.909,-379.3287]],"displayRole":"main"},{"id":"osm-1092086411-0-view-0","osmWay":1092086411,"name":"","kind":"steps","width":0.48,"widthSource":"estimated by road class","points":[[-230.4551,-659.0108],[-228.8363,-662.1349]],"displayRole":"landmark-access"},{"id":"osm-381447697-0-view-0","osmWay":381447697,"name":"美通橋","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[91.2481,249.1431],[89.0488,247.0912]],"displayRole":"landmark-access"},{"id":"osm-136183929-0-view-0","osmWay":136183929,"name":"湖山路二段","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[-231.5773,-566.6633],[-236.9595,-568.5584],[-252.5287,-577.4462],[-255.2955,-581.2685],[-258.0624,-588.1472],[-262.2159,-598.8482],[-263.954,-603.1727],[-267.7496,-612.6055],[-271.9031,-624.0724],[-272.5932,-625.6006],[-274.9731,-628.0692],[-287.5561,-633.637],[-298.0237,-638.7346],[-307.1918,-647.0025],[-321.0325,-661.5258],[-336.2566,-672.9926],[-340.881,-677.5345],[-344.5572,-680.6372],[-348.643,-686.6752],[-352.9513,-696.165],[-354.9152,-697.337],[-356.8274,-697.7253]],"displayRole":"main"},{"id":"osm-1092660326-0-view-0","osmWay":1092660326,"name":"中興路","kind":"unclassified","width":1.6,"widthSource":"estimated by road class","points":[[-231.5773,-566.6633],[-233.1542,-576.6803],[-235.447,-582.1769],[-248.4396,-601.2812],[-249.2942,-604.6867],[-249.6296,-606.4286],[-250.4519,-611.2448],[-252.5287,-619.4842],[-253.2188,-624.0724],[-253.7347,-635.0868],[-253.983,-636.0629],[-254.6409,-637.9331],[-256.9756,-640.6617],[-257.1369,-642.653],[-256.8015,-644.3308]],"displayRole":"main"},{"id":"osm-230730588-0-view-0","osmWay":230730588,"name":"中興路","kind":"unclassified","width":1.6,"widthSource":"estimated by road class","points":[[-66.5012,-791.5048],[-72.1381,-792.3633],[-79.539,-796.8197],[-92.7509,-808.1191],[-106.5239,-819.7534],[-111.5836,-822.539],[-120.1905,-827.7185],[-125.8564,-830.0411],[-130.4678,-832.3281],[-134.6213,-835.2954],[-136.5272,-836.6597],[-138.9103,-839.1889],[-144.1473,-843.6346],[-145.5082,-844.6214],[-148.433,-845.2483],[-151.2192,-844.3862],[-155.2179,-841.3405],[-156.6046,-839.8123],[-157.2947,-836.7559],[-157.2947,-834.4618],[-156.6046,-831.4054],[-154.1247,-826.6855],[-150.5291,-821.9228],[-135.5855,-807.5206],[-134.0731,-804.6245],[-133.3798,-801.0552],[-133.7248,-798.7646],[-135.5855,-794.5256],[-137.3366,-792.5165],[-172.951,-764.7167],[-176.4111,-763.1885],[-178.4879,-763.1885],[-181.9481,-763.1885],[-203.3993,-767.0108],[-205.3664,-766.5762],[-206.8594,-766.2449],[-210.3196,-761.6603],[-211.0097,-760.1321],[-211.8546,-757.2004],[-211.961,-754.0585],[-211.0097,-749.4276]],"displayRole":"main"},{"id":"osm-1278385948-0-view-0","osmWay":1278385948,"name":"","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[38.2619,437.7672],[37.23,439.7657],[36.714,441.7676],[36.2851,443.8694],[37.8459,451.5709],[38.5489,458.1682],[38.3587,463.2159],[38.8488,466.6784],[39.0713,471.4162],[39.0455,473.8812],[38.794,474.957],[38.1555,476.0293],[37.3203,476.5636],[36.269,476.6206],[35.5176,476.2822],[35.0275,475.6873],[34.3438,474.5759],[32.4864,469.0864],[29.6615,461.6699],[27.2912,456.2481],[24.3954,446.1563],[23.2377,442.2806],[22.1864,439.9545],[21.0739,437.9738]],"displayRole":"landmark-access"},{"id":"osm-230730590-0-view-0","osmWay":230730590,"name":"","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[-203.3993,-767.0108],[-195.8468,-770.1064],[-183.3057,-777.7118]],"displayRole":"landmark-access"},{"id":"osm-135930125-0-view-0","osmWay":135930125,"name":"陽明路一段24巷3弄","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[93.2217,-272.604],[100.2098,-298.5691]],"displayRole":"landmark-access"},{"id":"osm-379991451-0-view-0","osmWay":379991451,"name":"","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[68.9134,-93.6691],[74.5567,-95.7423],[78.191,-96.9535],[81.8221,-99.3758],[85.4565,-102.6638],[86.9269,-104.5232],[86.9269,-108.2422],[85.0211,-114.1662]],"displayRole":"landmark-access"},{"id":"osm-135930129-0-view-0","osmWay":135930129,"name":"","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[80.1872,-443.6663],[73.4345,-433.4925],[67.4106,-426.6352],[61.5964,-420.4547],[51.2513,-407.9299]],"displayRole":"landmark-access"},{"id":"osm-135930133-0-view-4","osmWay":135930133,"name":"","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[170.8678,-520.5145],[169.02,-520.543]],"displayRole":"landmark-access"},{"id":"osm-369954912-0-view-0","osmWay":369954912,"name":"紗帽路","kind":"unclassified","width":1.6,"widthSource":"estimated by road class","points":[[-463.6254,29.7483],[-459.2494,26.9911],[-458.8721,22.5704],[-459.3623,17.0418],[-459.0076,13.5436],[-458.6174,12.4002],[-457.4081,7.6588],[-454.9766,-3.7332],[-451.7518,-11.392],[-449.5396,-18.4595],[-449.2784,-20.7109],[-448.8366,-22.5169],[-449.6686,-28.6226],[-451.2262,-32.4734],[-455.0733,-36.5379],[-458.2304,-40.0823],[-459.3816,-43.2207],[-462.6193,-47.4775],[-464.5316,-49.3406],[-470.2104,-55.3073],[-473.0224,-59.3291],[-475.3152,-67.305],[-479.3236,-71.8433],[-486.2246,-76.4742],[-488.5787,-78.6115],[-494.035,-85.7823],[-498.3627,-91.7633],[-498.0305,-95.2935],[-496.7213,-97.242],[-494.6735,-99.3081]],"displayRole":"main"},{"id":"osm-135930147-0-view-1","osmWay":135930147,"name":"陽明路一段24巷","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[93.2217,-272.604],[91.3771,-273.3414],[84.876,-277.6766],[81.3771,-280.9111]],"displayRole":"landmark-access"},{"id":"osm-380477535-0-view-0","osmWay":380477535,"name":"格致路","kind":"primary","width":3.84,"widthSource":"estimated by road class","points":[[83.9311,-183.1383],[90.7967,-165.5622],[93.2314,-158.7619],[94.9502,-151.6374],[94.8825,-146.0412],[94.1053,-141.0006],[91.7254,-137.303],[83.6828,-130.9479],[78.0621,-126.4061],[74.1472,-122.5339],[70.6419,-118.5335],[68.449,-115.0532],[66.7205,-111.4091],[65.9853,-108.1888],[65.7886,-104.7726],[66.1723,-101.6984],[68.4909,-95.0156],[68.9134,-93.6691],[71.3287,-86.4235],[77.8686,-68.2632],[84.2568,-50.5482],[84.6406,-49.2159],[92.6896,-26.6064],[98.3749,-11.1035],[99.639,-6.6543],[99.3391,-2.978],[97.9137,1.172],[95.5339,4.3281],[92.1608,6.8822],[87.6138,8.7631],[81.7157,10.6048],[61.0514,14.2561],[47.7137,16.7354],[43.2023,18.2137],[40.4354,20.0697],[37.6686,22.9266],[32.6444,29.3707],[29.0584,32.4413],[26.2077,34.429],[23.1345,35.7293],[19.5453,36.6376],[-0.0451,39.1027],[-6.7914,40.3531],[-10.2709,41.2828],[-12.6089,42.9606],[-14.3728,45.1478],[-15.8111,47.9371],[-16.6624,50.2525],[-16.9559,52.8815],[-16.5495,56.8249],[-13.3989,71.1201]],"displayRole":"main"},{"id":"osm-380891573-0-view-0","osmWay":380891573,"name":"格致路","kind":"primary","width":3.84,"widthSource":"estimated by road class","points":[[-16.743,152.2216],[-21.6576,175.6327],[-24.5824,189.5646]],"displayRole":"main"},{"id":"osm-380891575-0-view-0","osmWay":380891575,"name":"中庸一路","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[84.6954,242.959],[81.2707,241.242],[74.905,237.8365],[72.5122,236.0376],[69.2391,233.512],[66.5851,230.7975],[59.3648,223.4094],[44.4277,208.1274],[34.9533,198.431]],"displayRole":"main"},{"id":"osm-380891576-0-view-0","osmWay":380891576,"name":"中庸一路","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[218.1848,423.0231],[213.8669,423.6145],[204.8343,416.807],[185.3147,403.1636],[166.266,385.5163],[161.1644,380.3689],[153.2508,369.2689],[145.7242,356.7797],[142.9058,348.3906],[140.5098,338.1563],[136.8529,318.5925],[134.5407,313.2883],[131.2127,307.1898],[127.6461,303.567],[122.6348,300.6246],[117.4591,295.071],[114.5181,290.4508],[112.5832,288.7765],[110.5613,286.9313],[107.3204,283.4795],[103.2669,277.8369],[97.5397,263.9157],[93.37,252.4132],[91.2481,249.1431]],"displayRole":"main"},{"id":"osm-380891578-0-view-0","osmWay":380891578,"name":"凱旋路","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[-163.6926,160.9527],[-163.0283,160.4005],[-154.186,157.8179]],"displayRole":"main"},{"id":"osm-380891579-0-view-0","osmWay":380891579,"name":"凱旋路","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[-118.3846,196.1619],[-103.4668,184.9194],[-97.9686,182.7465],[-84.6245,174.6495],[-81.6641,171.2511],[-79.9485,170.0364],[-75.063,169.5982],[-34.2696,147.1276]],"displayRole":"main"},{"id":"osm-381447698-0-view-0","osmWay":381447698,"name":"中庸一路","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[89.0488,247.0912],[84.6954,242.959]],"displayRole":"main"},{"id":"osm-674242215-0-view-2","osmWay":674242215,"name":"","kind":"path","width":0.512,"widthSource":"estimated by road class","points":[[127.5752,92.3297],[126.5368,112.8304],[129.3069,130.8197],[129.0005,137.7732],[128.3975,139.134]],"displayRole":"landmark-access"},{"id":"osm-323949663-0-view-0","osmWay":323949663,"name":"泉源路","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[-451.568,-388.8434],[-450.3426,-391.4118],[-449.0269,-392.7904],[-448.124,-393.599],[-445.8698,-393.5955],[-443.6351,-392.4306]],"displayRole":"main"},{"id":"osm-338995798-0-view-0","osmWay":338995798,"name":"","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[159.3456,-518.9792],[153.3895,-516.0118],[149.6907,-513.2084],[142.7187,-508.8838],[136.8142,-506.4472],[130.3807,-504.8585],[121.5932,-503.2661],[115.4243,-501.9018],[112.6155,-500.8794],[108.3523,-497.6378],[105.0115,-492.8145],[101.7544,-485.4015],[97.0721,-474.8715],[94.8825,-470.1943],[92.2059,-464.3309],[82.2285,-446.4876],[81.2159,-445.109],[80.1872,-443.6663]],"displayRole":"landmark-access"},{"id":"osm-323949665-0-view-0","osmWay":323949665,"name":"鼎筆橋","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[-455.212,-380.3332],[-451.568,-388.8434]],"displayRole":"landmark-access"},{"id":"osm-689317155-0-view-0","osmWay":689317155,"name":"新園街","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[141.5288,-332.7987],[144.0602,-334.3697]],"displayRole":"main"},{"id":"osm-399421230-0-view-0","osmWay":399421230,"name":"紗帽路","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[-275.9115,-105.5385],[-269.162,-98.9768],[-267.2272,-97.5983],[-265.9211,-96.6364],[-264.5022,-96.0344],[-263.5477,-95.7851],[-262.5029,-95.6925],[-260.4551,-96.1662],[-259.5296,-96.6008],[-258.7492,-97.185],[-257.0433,-98.6598],[-249.1942,-107.8753],[-245.1052,-109.8702],[-239.4167,-109.5318],[-236.9595,-108.1888],[-234.8795,-105.9161],[-233.2058,-99.7],[-231.5225,-94.8874],[-228.9394,-86.7869],[-226.7692,-78.5759],[-225.1794,-69.5741],[-224.1894,-66.4785],[-222.5802,-64.2592],[-220.339,-63.1193],[-207.585,-63.2974],[-194.6827,-62.9982],[-186.3725,-63.1941],[-182.2157,-64.2058],[-179.9326,-65.4882],[-177.5559,-66.7884],[-172.4156,-70.0016],[-168.2686,-74.2798],[-165.2534,-77.5072],[-159.4972,-80.7417],[-151.0064,-83.7376],[-142.4994,-85.5009],[-135.0341,-85.4332],[-128.0944,-84.7172],[-125.8016,-83.9941],[-120.0744,-78.3301],[-116.6593,-74.7144],[-113.9473,-70.9598],[-111.1934,-69.1181],[-107.7912,-68.8474],[-105.5694,-68.3772],[-102.8218,-66.8276],[-100.6999,-65.132],[-95.8209,-61.299],[-92.996,-58.6737],[-88.6135,-55.1898],[-86.7593,-52.0336],[-85.479,-48.735]],"displayRole":"main"},{"id":"osm-704408460-0-view-0","osmWay":704408460,"name":"紗帽路","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[-85.479,-48.735],[-82.1962,-46.3768],[-80.1195,-45.1692],[-76.4432,-45.4257],[-72.9605,-45.8567],[-66.9979,-47.7554],[-65.6918,-48.1722],[-58.8166,-50.5304],[-47.4686,-51.8448],[-44.3342,-53.17],[-41.6544,-55.8987],[-34.9211,-64.5941],[-29.0455,-71.4372],[-22.4476,-76.264],[-14.4405,-81.7712],[-4.6082,-87.3746],[5.9013,-92.5434],[10.5644,-95.6604],[12.9507,-97.2563],[16.3044,-100.4801],[21.6866,-108.0463],[24.2084,-112.6452],[33.0313,-128.7429],[35.824,-134.4283],[38.2748,-140.0708],[41.1707,-150.4049],[42.2735,-157.2408],[42.7669,-164.1338],[43.2829,-166.8696],[44.6244,-171.7961],[45.0339,-172.8185],[47.6944,-179.4514],[55.221,-199.3821],[57.1688,-208.0776],[57.1236,-216.9618],[57.0849,-231.3924],[56.9753,-233.7079],[57.1397,-242.5458],[57.1688,-251.8076],[56.7366,-257.81],[53.2732,-276.152],[49.6873,-290.3867]],"displayRole":"main"},{"id":"osm-195756555-0-view-0","osmWay":195756555,"name":"孔子大道","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[-243.4864,186.3372],[-242.935,181.5638],[-247.111,166.1144],[-248.0978,163.3536],[-249.3523,160.9491],[-255.4664,148.4991],[-257.8882,143.8717],[-260.9711,138.2505]],"displayRole":"landmark-access"},{"id":"osm-195756557-0-view-0","osmWay":195756557,"name":"凱旋路61巷","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[-157.1722,197.3944],[-156.6046,196.8886],[-156.6884,195.884],[-160.1486,179.0168],[-163.6926,160.9527]],"displayRole":"landmark-access"},{"id":"osm-195756561-0-view-0","osmWay":195756561,"name":"華岡路","kind":"living_street","width":1.28,"widthSource":"estimated by road class","points":[[-171.0677,145.9877],[-175.5985,136.2201],[-179.594,127.3002],[-182.7027,119.4098],[-183.4379,117.4292],[-185.3051,111.7938]],"displayRole":"main"},{"id":"osm-195762015-0-view-0","osmWay":195762015,"name":"華岡路","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[-276.6854,156.6068],[-278.0011,160.4326],[-279.7199,164.2371],[-280.9873,167.7601],[-283.6445,169.6232],[-287.5658,172.0989],[-290.8002,173.3457],[-292.8028,174.2398],[-293.5316,175.1055],[-294.8441,177.7522],[-295.0602,181.0117],[-293.1866,186.9499],[-292.0805,189.6394],[-289.7844,197.1985]],"displayRole":"main"},{"id":"osm-704408471-0-view-0","osmWay":704408471,"name":"湖山路一段","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[-162.909,-379.3287],[-153.7055,-379.6529],[-117.7009,-386.2715],[-106.6787,-388.3412],[-87.9041,-389.1533],[-82.6283,-389.36]],"displayRole":"main"},{"id":"osm-195762017-0-view-0","osmWay":195762017,"name":"愛富三街","kind":"living_street","width":1.28,"widthSource":"estimated by road class","points":[[-89.7132,69.4281],[-89.8712,71.9216],[-86.1691,83.4134]],"displayRole":"main"},{"id":"osm-704408467-0-view-0","osmWay":704408467,"name":"湖山路一段","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[-56.5335,-390.2006],[-48.8811,-390.4001],[-42.7057,-391.8179],[-29.7163,-397.0544],[-22.5831,-400.6665]],"displayRole":"main"},{"id":"osm-195762022-0-view-0","osmWay":195762022,"name":"","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[-195.5631,156.3681],[-207.972,125.5868]],"displayRole":"landmark-access"},{"id":"osm-195762023-0-view-0","osmWay":195762023,"name":"光華路26巷","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[-175.5985,136.2201],[-155.6952,127.3964]],"displayRole":"landmark-access"},{"id":"osm-195762024-0-view-0","osmWay":195762024,"name":"愛富二街","kind":"living_street","width":1.28,"widthSource":"estimated by road class","points":[[-13.3989,71.1201],[-16.9752,72.3384],[-27.1719,72.5094],[-43.3184,72.5949],[-72.8347,80.1255],[-86.1691,83.4134]],"displayRole":"main"},{"id":"osm-195762026-0-view-0","osmWay":195762026,"name":"華岡路","kind":"living_street","width":1.28,"widthSource":"estimated by road class","points":[[-86.1691,83.4134],[-91.4771,84.45],[-97.6751,87.6382],[-101.5577,89.6331],[-105.8112,91.8025],[-106.3401,92.0732],[-130.2485,103.6968],[-140.226,106.6285],[-155.1696,108.6875],[-160.4098,107.6616],[-165.2212,107.5868],[-173.2831,108.0249],[-179.1457,109.6493],[-185.3051,111.7938]],"displayRole":"main"},{"id":"osm-1379084742-0-view-0","osmWay":1379084742,"name":"香山橋","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[169.02,-520.543],[164.6697,-520.3186],[159.3456,-518.9792]],"displayRole":"landmark-access"},{"id":"osm-195837558-0-view-0","osmWay":195837558,"name":"建業路","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[-24.5824,189.5646],[15.8498,201.5124],[24.5695,202.9123],[28.1007,202.2996],[32.5444,199.7277],[34.9533,198.431],[42.4638,189.7748],[46.2916,185.3042],[48.8972,182.262],[49.5776,181.4676],[55.2274,177.7665],[58.8618,175.3869],[83.7344,160.7568],[85.7144,159.5919],[93.154,155.0928],[97.7396,151.6339],[102.2349,145.2325],[108.6103,133.5377],[111.461,127.4997]],"displayRole":"main"},{"id":"osm-824880477-0-view-0","osmWay":824880477,"name":"凱旋路61巷2弄","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[-201.0194,191.7304],[-189.9907,188.3],[-160.1486,179.0168]],"displayRole":"landmark-access"},{"id":"osm-1301787691-0-view-0","osmWay":1301787691,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[-58.3555,-393.3283],[-58.1491,-391.4474]],"displayRole":"landmark-access"},{"id":"osm-832830861-0-view-0","osmWay":832830861,"name":"格致路56巷","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[-10.4999,118.5193],[2.6121,113.7922]],"displayRole":"landmark-access"},{"id":"osm-832830862-0-view-0","osmWay":832830862,"name":"格致路50巷","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[-11.119,122.851],[-5.4337,123.998]],"displayRole":"landmark-access"},{"id":"osm-833707133-0-view-0","osmWay":833707133,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[-58.1491,-391.4474],[-56.5335,-390.2006]],"displayRole":"landmark-access"},{"id":"osm-440915460-0-view-10","osmWay":440915460,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[45.2435,-338.6301],[44.2503,-339.6275],[43.6892,-340.6214],[42.6928,-341.3552]],"displayRole":"landmark-access"},{"id":"osm-863072925-0-view-0","osmWay":863072925,"name":"光華路","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[-14.8726,142.1298],[-27.604,145.1862]],"displayRole":"main"},{"id":"osm-440915462-0-view-3","osmWay":440915462,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[38.5199,-336.4678],[38.6134,-336.4215],[39.5164,-336.8169],[40.3645,-337.1197],[41.2513,-337.2515],[42.5283,-336.9701],[43.1507,-336.7599],[43.7537,-336.5177]],"displayRole":"landmark-access"},{"id":"osm-440915463-0-view-0","osmWay":440915463,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[43.7537,-336.5177],[44.4116,-337.7395],[45.0888,-338.4555],[45.2435,-338.6301]],"displayRole":"landmark-access"},{"id":"osm-440915464-0-view-0","osmWay":440915464,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[31.1158,-329.81],[32.912,-330.7184],[34.8501,-331.9046],[35.5499,-332.4781],[36.2497,-333.0481],[36.2045,-333.4684]],"displayRole":"landmark-access"},{"id":"osm-524342579-0-view-2","osmWay":524342579,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[93.154,155.0928],[94.5793,156.8882]],"displayRole":"landmark-access"},{"id":"osm-896506431-0-view-12","osmWay":896506431,"name":"凱旋路61巷4弄","kind":"unclassified","width":1.6,"widthSource":"estimated by road class","points":[[-211.903,216.3776],[-203.3057,210.7599],[-196.3209,207.5931],[-193.9894,207.757],[-183.0606,204.298],[-157.1722,197.3944]],"displayRole":"landmark-access"},{"id":"osm-704408459-0-view-0","osmWay":704408459,"name":"愛富三街12巷","kind":"unclassified","width":1.6,"widthSource":"estimated by road class","points":[[-89.7132,69.4281],[-91.9092,67.0022],[-100.4774,51.3604],[-101.4449,43.6196],[-100.4871,39.8009],[-95.0179,34.4184],[-93.8054,30.3966],[-93.1572,24.0736],[-98.0427,13.1162],[-104.4407,2.059],[-104.9212,2.3333]],"displayRole":"landmark-access"},{"id":"osm-524342580-0-view-0","osmWay":524342580,"name":"","kind":"steps","width":0.48,"widthSource":"estimated by road class","points":[[94.5793,156.8882],[94.8309,161.6046]],"displayRole":"landmark-access"},{"id":"osm-919696641-0-view-0","osmWay":919696641,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[-230.9324,-658.0562],[-230.4551,-659.0108]],"displayRole":"landmark-access"},{"id":"osm-380665340-0-view-0","osmWay":380665340,"name":"紗帽橋","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[37.1042,-325.9628],[40.7805,-327.8187]],"displayRole":"landmark-access"},{"id":"osm-440915468-0-view-0","osmWay":440915468,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[42.6928,-341.3552],[42.8475,-343.635],[42.051,-345.4055],[41.4512,-346.1464],[41.1094,-346.8304],[41.0223,-347.5464]],"displayRole":"landmark-access"},{"id":"osm-440915470-0-view-0","osmWay":440915470,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[48.4167,-331.3453],[48.9875,-330.241],[50.3871,-327.5159]],"displayRole":"landmark-access"},{"id":"osm-135871686-0-view-4","osmWay":135871686,"name":"","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[61.8543,162.7694],[58.9779,171.8888],[58.8618,175.3869]],"displayRole":"landmark-access"},{"id":"osm-1370285668-0-view-1","osmWay":1370285668,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[-8.9681,-511.4486],[-8.7649,-511.616]],"displayRole":"landmark-access"},{"id":"osm-1370285671-0-view-1","osmWay":1370285671,"name":"環七星山人車分道陽金公路段","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[-8.9681,-511.4486],[-11.3318,-514.3198]],"displayRole":"landmark-access"},{"id":"osm-262794533-0-view-0","osmWay":262794533,"name":"仰德大道三段","kind":"primary","width":3.84,"widthSource":"estimated by road class","points":[[39.8937,441.1621],[46.1916,451.9343],[49.7582,458.1575],[55.766,469.2717],[66.2755,489.605],[77.8879,518.6693],[84.7277,530.4318],[89.3036,537.9588],[94.8825,547.9509],[96.5445,551.4063]],"displayRole":"main"},{"id":"osm-262794534-0-view-0","osmWay":262794534,"name":"仰德大道四段","kind":"primary","width":3.84,"widthSource":"estimated by road class","points":[[-24.5824,189.5646],[-27.2332,203.2044],[-28.2683,208.1773],[-28.6327,209.9335],[-30.7546,220.3566],[-32.5412,231.0113],[-33.1732,239.8349],[-33.0249,242.674],[-32.783,247.3299],[-31.635,253.9272],[-30.7708,257.4324],[-24.6921,275.8955],[-17.7104,294.9072],[-11.0964,314.2501],[-7.8491,325.8523],[0.4257,350.6918],[3.5666,359.7613],[7.7169,370.7473],[15.3306,390.0368],[27.0075,415.2254],[29.0842,419.7067],[38.2619,437.7672],[39.8937,441.1621]],"displayRole":"main"},{"id":"osm-262794535-0-view-0","osmWay":262794535,"name":"格致路","kind":"primary","width":3.84,"widthSource":"estimated by road class","points":[[73.3023,-207.1763],[74.2439,-205.1173],[75.6338,-202.8696],[76.6109,-201.092],[77.5332,-199.3145]],"displayRole":"main"},{"id":"osm-262794536-0-view-0","osmWay":262794536,"name":"陽明路一段","kind":"primary","width":3.84,"widthSource":"estimated by road class","points":[[103.6893,-365.2863],[101.9447,-360.9155],[100.5548,-352.302],[100.8096,-344.3332],[100.7967,-336.6709],[100.6226,-331.3952],[100.4387,-327.6798],[100.0389,-325.7953],[98.7619,-323.3944],[96.9624,-320.5589],[94.7825,-318.247],[90.213,-314.5209],[88.7651,-313.0497],[86.8334,-310.3281],[84.3665,-306.2885],[83.4119,-301.9568],[82.3865,-288.5771]],"displayRole":"main"},{"id":"osm-262794537-0-view-0","osmWay":262794537,"name":"湖山路一段","kind":"primary","width":3.84,"widthSource":"estimated by road class","points":[[-22.5831,-400.6665],[-8.6908,-401.3255],[-3.544,-401.7031],[5.782,-404.0791],[7.0719,-404.4674],[13.8762,-406.2272]],"displayRole":"main"},{"id":"osm-1370309944-0-view-0","osmWay":1370309944,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[-20.5482,-507.5088],[-21.7801,-506.2798]],"displayRole":"landmark-access"},{"id":"osm-1370309945-0-view-0","osmWay":1370309945,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[-14.634,-514.4587],[-16.1755,-513.1371],[-20.6514,-509.0263],[-20.803,-508.264],[-20.5482,-507.5088]],"displayRole":"landmark-access"},{"id":"osm-262964938-0-view-0","osmWay":262964938,"name":"陽明路一段","kind":"primary","width":3.84,"widthSource":"estimated by road class","points":[[82.3865,-288.5771],[81.3771,-280.9111],[80.7999,-274.0538],[81.1127,-265.9177],[75.708,-251.6331],[73.0314,-243.3473],[71.8479,-230.5874],[70.6999,-218.75],[70.8386,-214.739],[71.6544,-211.3762],[73.3023,-207.1763]],"displayRole":"main"},{"id":"osm-262965038-0-view-0","osmWay":262965038,"name":"湖山路一段","kind":"primary","width":3.84,"widthSource":"estimated by road class","points":[[13.8762,-406.2272],[22.151,-408.4215],[32.3445,-409.1589],[41.3222,-409.2444],[51.2513,-407.9299],[55.3726,-404.8272],[56.2658,-404.3214],[61.7641,-401.208],[65.1404,-399.0671],[65.8724,-398.4793],[66.3078,-397.92],[68.3942,-394.4077],[70.2484,-390.8917],[71.1804,-388.8541],[74.2762,-383.5535],[75.4887,-380.6574],[76.9818,-377.829],[80.3839,-371.9655],[86.0724,-369.561],[98.6329,-366.4512],[103.6893,-365.2863]],"displayRole":"main"},{"id":"osm-262965712-0-view-0","osmWay":262965712,"name":"菁山路","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[343.3157,-128.4568],[342.4998,-124.2117],[337.1305,-101.9442]],"displayRole":"main"},{"id":"osm-262967776-0-view-0","osmWay":262967776,"name":"菁山路","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[307.3433,-46.4302],[294.1605,-48.8917],[285.4439,-49.5721],[280.7357,-49.0307],[267.54,-47.4419],[256.5532,-44.0364],[249.6489,-43.7906],[241.6902,-44.2573],[234.3184,-45.4221],[226.0823,-49.7396],[218.733,-49.8251],[210.3906,-48.6032],[202.4028,-45.3224],[195.4921,-41.9169],[191.6159,-36.6341],[189.6359,-33.1003],[189.4876,-24.9713],[191.7901,-22.3958],[194.4408,-20.0376],[195.7694,-16.91],[195.4115,-13.4439],[192.1255,-9.3794],[185.3792,-4.8803],[177.5076,0.0499],[174.6536,3.8543],[159.4682,27.814],[155.8951,31.7039],[148.304,36.4631],[100.0937,60.3372],[93.5216,63.7962],[90.9386,64.7651],[75.5306,70.543],[33.1474,88.8815],[15.0661,97.8975],[-5.3047,107.7649],[-9.6711,109.5531]],"displayRole":"main"},{"id":"osm-444619200-0-view-0","osmWay":444619200,"name":"凱旋路","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[-154.186,157.8179],[-118.3846,196.1619]],"displayRole":"main"},{"id":"osm-262967977-0-view-0","osmWay":262967977,"name":"菁山路","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[343.3157,-50.5396],[331.7291,-46.9824],[315.689,-46.0206],[307.3433,-46.4302]],"displayRole":"main"},{"id":"osm-263156309-0-view-0","osmWay":263156309,"name":"格致路","kind":"primary","width":3.84,"widthSource":"estimated by road class","points":[[-9.6711,109.5531],[-9.9033,114.3479],[-10.4999,118.5193],[-11.119,122.851],[-13.3344,134.2751],[-14.8726,142.1298],[-16.743,152.2216]],"displayRole":"main"},{"id":"osm-264073859-0-view-0","osmWay":264073859,"name":"格致路","kind":"primary","width":3.84,"widthSource":"estimated by road class","points":[[-13.3989,71.1201],[-11.7382,76.7128],[-10.2096,84.4002],[-10.1,87.7629],[-9.8968,94.1892],[-9.9129,98.0863],[-9.6711,109.5531]],"displayRole":"main"},{"id":"osm-295177396-0-view-0","osmWay":295177396,"name":"華岡路","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[-209.4715,120.8419],[-230.3358,123.6418],[-231.9095,124.3293],[-256.5016,135.0053],[-260.9711,138.2505],[-263.6573,141.0255],[-268.3236,147.8116],[-269.8134,149.55],[-276.6854,156.6068]],"displayRole":"main"},{"id":"osm-327370211-0-view-0","osmWay":327370211,"name":"新園街","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[144.0602,-334.3697],[154.5246,-332.6491],[158.3298,-331.8583],[161.2354,-332.357],[168.7684,-334.9182],[172.2028,-336.3004],[176.3144,-337.7858],[181.9642,-340.3471],[183.1316,-341.5476],[183.3831,-348.3123],[183.8571,-349.7514],[184.9181,-351.9137],[187.8978,-356.1919],[194.6311,-363.4233],[201.6289,-370.1773],[205.1632,-373.8927],[207.1077,-375.0504],[212.4318,-378.228],[215.4083,-379.7455],[217.0755,-380.9709],[219.2361,-382.9266],[221.3838,-384.5153],[222.2255,-385.1993],[229.2071,-388.7366],[237.2303,-392.8794],[240.4422,-397.578],[243.667,-402.0522],[246.2565,-404.3819],[255.1826,-411.8698],[257.985,-414.317],[259.4039,-417.0742],[262.9543,-424.7686],[270.0875,-435.434],[273.6316,-440.1041],[274.8151,-442.5798]],"displayRole":"main"},{"id":"osm-704408468-0-view-0","osmWay":704408468,"name":"湖山路一段","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[-82.6283,-389.36],[-81.3191,-389.4027],[-60.7354,-390.1045],[-56.5335,-390.2006]],"displayRole":"main"},{"id":"osm-979722285-0-view-0","osmWay":979722285,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[37.3977,-334.1666],[38.22,-334.7651],[38.407,-335.3885],[38.5199,-336.4678]],"displayRole":"landmark-access"},{"id":"osm-1198733593-0-view-0","osmWay":1198733593,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[15.7175,-470.6218],[13.6537,-463.9675]],"displayRole":"landmark-access"},{"id":"osm-1456657263-0-view-0","osmWay":1456657263,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[-37.804,242.8913],[-36.6141,242.8379],[-33.0249,242.674]],"displayRole":"landmark-access"},{"id":"osm-979722286-0-view-0","osmWay":979722286,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[36.2045,-333.4684],[37.3977,-334.1666]],"displayRole":"landmark-access"},{"id":"osm-446961776-0-view-0","osmWay":446961776,"name":"","kind":"steps","width":0.48,"widthSource":"estimated by road class","points":[[-56.4077,-400.5917],[-58.3555,-393.3283]],"displayRole":"landmark-access"},{"id":"osm-330745400-0-view-0","osmWay":330745400,"name":"新園街","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[107.4558,-363.6513],[103.6893,-365.2863]],"displayRole":"main"},{"id":"osm-330745403-0-view-0","osmWay":330745403,"name":"新園街","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[141.5288,-332.7987],[139.7777,-335.6485]],"displayRole":"main"},{"id":"osm-330745406-0-view-0","osmWay":330745406,"name":"新園街","kind":"tertiary","width":2.56,"widthSource":"estimated by road class","points":[[139.7777,-335.6485],[137.1786,-339.7237],[134.2053,-343.5745],[128.5491,-349.2598],[107.4558,-363.6513]],"displayRole":"main"},{"id":"osm-330745410-0-view-0","osmWay":330745410,"name":"新園街","kind":"unclassified","width":1.6,"widthSource":"estimated by road class","points":[[144.0602,-334.3697],[141.6739,-336.4037],[138.9877,-342.0819],[134.7535,-347.582],[126.8786,-354.3752],[121.7803,-357.0967],[119.7455,-358.4789],[118.8264,-361.2824],[118.0105,-368.959],[117.2785,-369.5966]],"displayRole":"main"},{"id":"osm-135930152-0-view-0","osmWay":135930152,"name":"菁山路72巷20弄","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[173.0348,60.5011],[169.2586,60.9998],[164.9954,62.4924],[144.1666,69.2428],[142.5607,69.0113],[138.6071,60.868]],"displayRole":"landmark-access"},{"id":"osm-454820751-0-view-0","osmWay":454820751,"name":"","kind":"steps","width":0.48,"widthSource":"estimated by road class","points":[[-279.7232,-465.6845],[-278.4429,-468.887],[-279.6296,-469.6172]],"displayRole":"landmark-access"},{"id":"osm-1371159099-0-view-0","osmWay":1371159099,"name":"中興路","kind":"unclassified","width":1.6,"widthSource":"estimated by road class","points":[[-256.8015,-644.3308],[-254.9763,-645.9695],[-253.2639,-647.1094],[-251.903,-649.1221],[-251.1452,-650.9103]],"displayRole":"main"},{"id":"osm-1371159100-0-view-0","osmWay":1371159100,"name":"中興路","kind":"unclassified","width":1.6,"widthSource":"estimated by road class","points":[[-251.1452,-650.9103],[-250.8002,-653.7957],[-255.3278,-660.9166],[-258.6267,-664.2651],[-264.9827,-668.4045],[-274.1959,-673.9295],[-289.7264,-683.2091],[-296.263,-688.5917],[-299.4201,-690.0273],[-316.263,-691.7478],[-318.7429,-692.389],[-319.6362,-693.3437]],"displayRole":"main"},{"id":"osm-380477534-0-view-0","osmWay":380477534,"name":"福壽橋","kind":"primary","width":3.84,"widthSource":"estimated by road class","points":[[77.5332,-199.3145],[83.9311,-183.1383]],"displayRole":"landmark-access"},{"id":"osm-338950285-0-view-3","osmWay":338950285,"name":"","kind":"service","width":1.28,"widthSource":"estimated by road class","points":[[190.3518,-503.202],[182.0384,-506.9673],[175.5663,-509.8955],[172.8897,-513.0801],[171.6804,-515.1213],[170.8678,-520.5145]],"displayRole":"landmark-access"},{"id":"osm-135930156-0-view-0","osmWay":135930156,"name":"","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[33.9472,-324.4702],[37.1042,-325.9628]],"displayRole":"landmark-access"},{"id":"osm-441558524-0-view-10","osmWay":441558524,"name":"天母古道親山步道","kind":"steps","width":0.48,"widthSource":"estimated by road class","points":[[-114.1988,2.1053],[-109.7938,2.3653],[-104.9212,2.3333]],"displayRole":"landmark-access"},{"id":"osm-1300202745-0-view-0","osmWay":1300202745,"name":"","kind":"steps","width":0.48,"widthSource":"estimated by road class","points":[[-245.0569,-663.1573],[-245.2407,-663.9018],[-245.0246,-664.4753],[-244.399,-664.9277],[-243.6089,-665.1236],[-242.893,-664.9491]],"displayRole":"landmark-access"},{"id":"osm-1300202749-0-view-0","osmWay":1300202749,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[-249.133,-655.6196],[-246.9691,-657.0587],[-246.3532,-658.0526],[-245.4245,-659.5345],[-247.0788,-661.4688],[-246.2242,-662.3985],[-245.6631,-662.6051],[-245.0569,-663.1573]],"displayRole":"landmark-access"},{"id":"osm-1300202750-0-view-0","osmWay":1300202750,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[-244.0185,-642.4714],[-245.4213,-639.9386],[-246.4629,-639.1585],[-248.0172,-637.9936],[-251.8418,-636.6756],[-252.6834,-635.867]],"displayRole":"landmark-access"},{"id":"osm-1300202752-0-view-1","osmWay":1300202752,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[-253.7347,-635.0868],[-252.6834,-635.867]],"displayRole":"landmark-access"},{"id":"osm-1456657304-0-view-0","osmWay":1456657304,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[-38.8649,228.7172],[-40.7901,229.1019],[-46.5012,230.2489]],"displayRole":"landmark-access"},{"id":"osm-1456657305-0-view-1","osmWay":1456657305,"name":"","kind":"footway","width":0.576,"widthSource":"estimated by road class","points":[[-38.8649,228.7172],[-38.4425,239.4182],[-37.8911,239.8207],[-37.804,242.8913]],"displayRole":"landmark-access"},{"id":"osm-372366232-0-view-0","osmWay":372366232,"name":"光華路","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[-79.2584,111.7475],[-91.7415,116.3855],[-99.1843,119.0251]],"displayRole":"main"},{"id":"osm-372366233-0-view-0","osmWay":372366233,"name":"光華路","kind":"residential","width":1.6,"widthSource":"estimated by road class","points":[[-99.1843,119.0251],[-116.9883,125.3445],[-119.2134,126.6269],[-119.8132,126.9725],[-124.2118,131.0976],[-130.1163,136.5442],[-139.1779,143.4407],[-154.186,157.8179]],"displayRole":"main"}],"placements":[{"id":"site_01","code":"01","name":"山仔后派出所","lon":121.5462054,"lat":25.1375023,"source":"road-anchored:格致路","x":-20.91,"z":123.85,"yaw":1.38,"radius":5.2,"entrance":[-14.04,125.19],"displayOffsetMeters":23.4,"roadName":"格致路","roadWidth":3.84},{"id":"site_02","code":"02","name":"陽明山麥當勞","lon":121.5467649,"lat":25.1373362,"source":"road-anchored:格致路","x":-1.95,"z":129.84,"yaw":-2.6,"radius":5,"entrance":[-4.77,125.11],"displayOffsetMeters":23.4,"roadName":"格致路","roadWidth":3.84},{"id":"site_03","code":"03","name":"7-ELEVEN 陽明山門市","lon":121.5466689,"lat":25.1368877,"source":"road-anchored:格致路","x":-5.96,"z":145.75,"yaw":-1.75,"radius":5,"entrance":[-12.85,144.47],"displayOffsetMeters":23.4,"roadName":"格致路","roadWidth":3.84},{"id":"site_04","code":"04","name":"山仔后公園","lon":121.5455244,"lat":25.1367737,"source":"road-anchored:光華路","x":-45.52,"z":144.99,"yaw":0.5,"radius":5.5,"entrance":[-42.63,150.25],"displayOffsetMeters":23.4,"roadName":"光華路","roadWidth":1.6},{"id":"site_05","code":"05","name":"陽明里辦公處 (區民活動中心)","lon":121.5479112,"lat":25.138222,"source":"road-anchored:菁山路","x":34.1,"z":98.22,"yaw":-2.68,"radius":5,"entrance":[30.97,91.95],"displayOffsetMeters":23.4,"roadName":"菁山路","roadWidth":2.56},{"id":"site_06","code":"06","name":"台灣中油陽明山加油站","lon":121.545711,"lat":25.1354185,"source":"road-anchored:仰德大道四段","x":-34,"z":185,"yaw":1.41,"radius":5,"entrance":[-31.85,193.85],"displayOffsetMeters":26.6,"roadName":"仰德大道四段","roadWidth":3.84},{"id":"site_07","code":"07","name":"豆留森林 (CAMA)","lon":121.5468544,"lat":25.1383129,"source":"road-anchored:格致路","x":0.02,"z":94.98,"yaw":-3.11,"radius":5.5,"entrance":[-0.19,88.17],"displayOffsetMeters":25,"roadName":"格致路","roadWidth":3.84},{"id":"site_08","code":"08","name":"白房子 Yang Ming Cafe","lon":121.5461986,"lat":25.1391751,"source":"road-anchored:愛富二街","x":-22.5,"z":62,"yaw":1.79,"radius":5,"entrance":[-17.03,60.69],"displayOffsetMeters":23.4,"roadName":"愛富二街","roadWidth":1.28},{"id":"site_09","code":"09","name":"彩虹谷故事館 (F206)","lon":121.5451,"lat":25.1383,"source":"road-anchored:愛富三街","x":-72,"z":68,"yaw":3.14,"radius":5,"entrance":[-72,61.5],"displayOffsetMeters":23.4,"roadName":"愛富三街(山仔后美軍F區)","roadWidth":1.28},{"id":"site_10","code":"10","name":"美軍宿舍群 (C 區建業路段)","lon":121.5484513,"lat":25.136216,"source":"road-anchored:建業路","x":51.52,"z":169.68,"yaw":1.28,"radius":6,"entrance":[57.92,171.57],"displayOffsetMeters":25,"roadName":"建業路","roadWidth":1.6},{"id":"site_11","code":"11","name":"雀客藏居陽明山溫泉飯店","lon":121.5493613,"lat":25.1441689,"source":"road-anchored:格致路","x":77.97,"z":-113.25,"yaw":1.7,"radius":5.5,"entrance":[83.92,-114.02],"displayOffsetMeters":28.1,"roadName":"格致路","roadWidth":3.84},{"id":"site_12","code":"12","name":"陽明山錫安堂","lon":121.549677,"lat":25.1488998,"source":"road-anchored:陽明路一段","x":88.9,"z":-283.49,"yaw":1.31,"radius":5.2,"entrance":[94.41,-282.01],"displayOffsetMeters":23.4,"roadName":"陽明路一段","roadWidth":3.84},{"id":"site_13","code":"13","name":"草山御賓館 (市定古蹟)","lon":121.5513061,"lat":25.1507097,"source":"road-anchored:新園街","x":144.81,"z":-347.57,"yaw":-0.91,"radius":6,"entrance":[139.66,-343.61],"displayOffsetMeters":25,"roadName":"新園街","roadWidth":2.56},{"id":"site_14","code":"14","name":"中國文化大學","lon":121.538175,"lat":25.1368978,"source":"road-anchored:華岡路","x":-279.87,"z":145.39,"yaw":0.8,"radius":7.5,"entrance":[-273.42,151.67],"displayOffsetMeters":29.7,"roadName":"華岡路","roadWidth":1.216},{"id":"site_15","code":"15","name":"亞尼克夢想村","lon":121.5436697,"lat":25.1370224,"source":"road-anchored:長春街","x":-102.68,"z":140.95,"yaw":0.36,"radius":5,"entrance":[-100.19,147.49],"displayOffsetMeters":23.4,"roadName":"長春街","roadWidth":1.216},{"id":"site_16","code":"16","name":"The Cafe By 想 陽明山","lon":121.5427839,"lat":25.1363367,"source":"road-anchored:國泰街","x":-115,"z":153,"yaw":2.4,"radius":4.2,"entrance":[-119,155],"displayOffsetMeters":23.4,"roadName":"國泰街(東北側落羽松莊園)","roadWidth":1.6},{"id":"site_17","code":"17","name":"陽明山星巴克 (草山門市)","lon":121.5426896,"lat":25.1372497,"source":"road-anchored:國泰街","x":-135.22,"z":131.63,"yaw":0.65,"radius":5.2,"entrance":[-131.77,136.17],"displayOffsetMeters":23.4,"roadName":"國泰街","roadWidth":1.6},{"id":"site_18","code":"18","name":"美軍俱樂部 (BRICK YARD 33 1/3)","lon":121.5442,"lat":25.136,"source":"road-anchored:凱旋路","x":-88,"z":189,"yaw":3.14,"radius":8,"entrance":[-88,181],"displayOffsetMeters":26.6,"roadName":"凱旋路(美軍俱樂部門前)","roadWidth":1.6},{"id":"site_19","code":"19","name":"陽明山美國渡假村","lon":121.5416117,"lat":25.1360167,"source":"road-anchored:凱旋路61巷","x":-170.75,"z":172.78,"yaw":0.3,"radius":7.5,"entrance":[-168.37,180.42],"displayOffsetMeters":23.4,"roadName":"凱旋路61巷","roadWidth":1.6},{"id":"site_20","code":"20","name":"臺北市立陽明教養院","lon":121.5408022,"lat":25.1354005,"source":"road-anchored:凱旋路61巷4弄","x":-195.15,"z":198.73,"yaw":-2.84,"radius":5.2,"entrance":[-197.32,191.74],"displayOffsetMeters":25,"roadName":"凱旋路61巷4弄","roadWidth":1.92},{"id":"site_21","code":"21","name":"屋頂上餐廳 (The Top)","lon":121.5400536,"lat":25.1350753,"source":"road-anchored:凱旋路61巷4弄","x":-219.08,"z":208.95,"yaw":-1.22,"radius":8.5,"entrance":[-227.52,212.06],"displayOffsetMeters":26.6,"roadName":"凱旋路61巷4弄","roadWidth":1.92},{"id":"site_22","code":"22","name":"華岡藝校","lon":121.549636,"lat":25.1362624,"source":"road-anchored:建業路","x":98.23,"z":168.65,"yaw":-2.69,"radius":6.5,"entrance":[95.19,162.35],"displayOffsetMeters":26.6,"roadName":"建業路","roadWidth":1.6},{"id":"site_23","code":"23","name":"台北歐洲學校 (陽明校區)","lon":121.5505355,"lat":25.1371876,"source":"road-anchored:建業路","x":118.57,"z":132.8,"yaw":0.22,"radius":7,"entrance":[120.19,140.13],"displayOffsetMeters":28.1,"roadName":"建業路","roadWidth":1.6},{"id":"site_24","code":"24","name":"草山猛禽中心","lon":121.5475894,"lat":25.1355154,"source":"road-anchored:建業路","x":18.87,"z":195.22,"yaw":2.04,"radius":5,"entrance":[23.79,192.75],"displayOffsetMeters":23.4,"roadName":"建業路","roadWidth":1.6},{"id":"site_25","code":"25","name":"YMS onefifteen 初衣食午","lon":121.5470354,"lat":25.135133,"source":"road-anchored:建業路","x":5.86,"z":208.26,"yaw":2.85,"radius":5.2,"entrance":[8.12,200.58],"displayOffsetMeters":26.6,"roadName":"建業路","roadWidth":1.6},{"id":"site_26","code":"26","name":"花卉試驗中心","lon":121.5457589,"lat":25.1331158,"source":"road-anchored:仰德大道四段","x":-35.31,"z":280.11,"yaw":1.92,"radius":8,"entrance":[-26.86,277.01],"displayOffsetMeters":29.7,"roadName":"仰德大道四段","roadWidth":3.84},{"id":"site_27","code":"27","name":"陽明福德宮","lon":121.5455446,"lat":25.1344028,"source":"road-anchored:仰德大道四段","x":-48,"z":230,"yaw":-2.94,"radius":5,"entrance":[-43.95,231.06],"displayOffsetMeters":23.4,"roadName":"仰德大道四段","roadWidth":3.84},{"id":"site_28","code":"28","name":"臺北市立格致國民中學","lon":121.5466634,"lat":25.1306147,"source":"road-anchored:仰德大道四段","x":-6.14,"z":369.21,"yaw":1.93,"radius":8.5,"entrance":[3.21,365.67],"displayOffsetMeters":32.8,"roadName":"仰德大道四段","roadWidth":3.84},{"id":"site_29","code":"29","name":"納美花園 (Navi Garden)","lon":121.5515847,"lat":25.1393658,"source":"road-anchored:菁山路72巷20弄","x":174.46,"z":51.51,"yaw":-0.16,"radius":7.5,"entrance":[173.21,59.41],"displayOffsetMeters":25,"roadName":"菁山路72巷20弄","roadWidth":1.216},{"id":"site_30","code":"30","name":"下竹林福德宮","lon":121.5476618,"lat":25.1287806,"source":"road-anchored:仰德大道四段","x":26.68,"z":434.12,"yaw":-0.97,"radius":5,"entrance":[22.14,437.24],"displayOffsetMeters":23.4,"roadName":"仰德大道四段","roadWidth":3.84},{"id":"site_31","code":"31","name":"臺灣銀行行員訓練所","lon":121.5472938,"lat":25.1389082,"source":"road-anchored:和平路","x":23.45,"z":72.7,"yaw":-2.06,"radius":6,"entrance":[17.72,69.63],"displayOffsetMeters":28.1,"roadName":"和平路","roadWidth":1.6},{"id":"site_32","code":"32","name":"吉佳咖啡 (山上店)","lon":121.5471256,"lat":25.1378714,"source":"road-anchored:菁山路","x":8.76,"z":110.71,"yaw":-1.11,"radius":5,"entrance":[3.77,113.21],"displayOffsetMeters":23.4,"roadName":"菁山路","roadWidth":2.56},{"id":"site_33","code":"33","name":"真愛桃花源 庭園餐廳","lon":121.5426303,"lat":25.1382865,"source":"road-anchored:華岡路","x":-136.2,"z":95.92,"yaw":0.29,"radius":6,"entrance":[-133.94,103.59],"displayOffsetMeters":26.6,"roadName":"華岡路","roadWidth":1.28},{"id":"site_34","code":"34","name":"臺北市教師研習中心","lon":121.5496423,"lat":25.1502439,"source":"road-anchored:陽明路一段","x":89.92,"z":-330.03,"yaw":1.08,"radius":5.5,"entrance":[97.43,-326.04],"displayOffsetMeters":28.1,"roadName":"陽明路一段","roadWidth":3.84},{"id":"site_35","code":"35","name":"林洋港故居 (前美軍總司令官邸)","lon":121.546206,"lat":25.13869,"source":"road-anchored:愛富二街","x":-20.89,"z":81.55,"yaw":-3.12,"radius":5.5,"entrance":[-21.02,73.55],"displayOffsetMeters":26.6,"roadName":"愛富二街","roadWidth":1.28},{"id":"site_36","code":"36","name":"文化大學學生美食街 (牛肉拌麵)","lon":121.54164,"lat":25.13744,"source":"road-anchored:光華路26巷","x":-166,"z":126,"yaw":0.42,"radius":5,"entrance":[-169.87,132.47],"displayOffsetMeters":23.4,"roadName":"光華路26巷","roadWidth":1.6},{"id":"site_37","code":"37","name":"文化大學郵局 (華岡大典館)","lon":121.539132,"lat":25.136853,"source":"road-anchored:華岡路","x":-247.53,"z":146.28,"yaw":-1.11,"radius":6.5,"entrance":[-253.81,149.36],"displayOffsetMeters":25,"roadName":"華岡路","roadWidth":1.216},{"id":"site_38","code":"38","name":"比夢烘焙坊 (The Cafe' By 想 陽明山)","lon":121.545551,"lat":25.138481,"source":"road-anchored:愛富一街","x":-42.41,"z":89.24,"yaw":2.1,"radius":6,"entrance":[-36.8,85.95],"displayOffsetMeters":25,"roadName":"愛富一街","roadWidth":1.28},{"id":"site_39","code":"39","name":"康迎鼎 陽明山店","lon":121.54611,"lat":25.138004,"source":"road-anchored:愛富一街","x":-39,"z":58,"yaw":1.57,"radius":5,"entrance":[-34,58],"displayOffsetMeters":25,"roadName":"愛富二街2巷(白房子西側)","roadWidth":1.28},{"id":"site_40","code":"40","name":"大衛小小羊 (David & Alpaca)","lon":121.54226,"lat":25.13683,"source":"road-anchored:國泰街","x":-140,"z":156,"yaw":0.8,"radius":3.5,"entrance":[-136,154],"displayOffsetMeters":25,"roadName":"國泰街(西南側美軍眷舍)","roadWidth":1.6},{"id":"site_41","code":"41","name":"朱里昂法式廚房 (C.L Program)","lon":121.54344,"lat":25.13606,"source":"road-anchored:國泰街","x":-124,"z":176,"yaw":2.45,"radius":3.5,"entrance":[-120,175],"displayOffsetMeters":25,"roadName":"國泰街南側美軍宿舍","roadWidth":1.6},{"id":"site_42","code":"42","name":"文化大學後山「情人坡」","lon":121.54111,"lat":25.13665,"source":"road-anchored:凱旋路","x":-179.37,"z":156.97,"yaw":-2.74,"radius":6,"entrance":[-181.62,151.66],"displayOffsetMeters":25,"roadName":"凱旋路","roadWidth":1.216},{"id":"site_43","code":"43","name":"仇人坡 (荀子大道) 與百花池","lon":121.54009,"lat":25.1368,"source":"road-anchored:荀子大道(仇人坡)","x":-215.55,"z":147.01,"yaw":-1.19,"radius":6,"entrance":[-221.58,149.44],"displayOffsetMeters":25,"roadName":"荀子大道(仇人坡)","roadWidth":0.96},{"id":"site_44","code":"44","name":"草山水管路步道 (愛富段出口)","lon":121.54344,"lat":25.1407,"source":"road-anchored:天母古道親山步道","x":-110,"z":10,"yaw":3.11,"radius":5.5,"entrance":[-109.82,3.19],"displayOffsetMeters":25,"roadName":"天母古道親山步道","roadWidth":0.65},{"id":"site_46","code":"46","name":"文化大學大孝館 (圓柱體育館)","lon":121.54059,"lat":25.13806,"source":"road-anchored:華岡路","x":-191,"z":136,"yaw":-1.19,"radius":7.5,"entrance":[-200.96,140.02],"displayOffsetMeters":25,"roadName":"華岡路(體育館道)","roadWidth":1.216},{"id":"site_47","code":"47","name":"草山夜未眠景觀餐廳","lon":121.54052,"lat":25.13435,"source":"road-anchored:凱旋路61巷4弄","x":-204,"z":236,"yaw":2.64,"radius":7.5,"entrance":[-197.9,224.93],"displayOffsetMeters":25,"roadName":"凱旋路61巷4弄","roadWidth":1.92},{"id":"site_48","code":"48","name":"陽明山順天府 (池府王爺)","lon":121.55064,"lat":25.13767,"source":"road-anchored:建業路74巷","x":134.5,"z":110.23,"yaw":-1.62,"radius":6.5,"entrance":[127.51,109.87],"displayOffsetMeters":25,"roadName":"建業路74巷","roadWidth":1.28},{"id":"site_49","code":"49","name":"文化大學 大義館 (八角中庭宮殿)","lon":121.53988,"lat":25.138,"source":"road-anchored:莊子路/華岡路","x":-225,"z":106,"yaw":0.23,"radius":8.5,"entrance":[-221.47,121.34],"displayOffsetMeters":25,"roadName":"莊子路/華岡路","roadWidth":1.28},{"id":"site_50","code":"50","name":"文化大學 大恩館 (行政大樓與百花池涼亭)","lon":121.53925,"lat":25.13735,"source":"road-anchored:華岡路/百花池","x":-250,"z":120,"yaw":0.41,"radius":7.5,"entrance":[-245.99,129.23],"displayOffsetMeters":25,"roadName":"華岡路/百花池大道","roadWidth":1.28},{"id":"site_51","code":"51","name":"文化大學 大賢館 (法學院與社科院)","lon":121.5408,"lat":25.1378,"source":"road-anchored:老子大道/朱子路","x":-205,"z":104,"yaw":0.36,"radius":7,"entrance":[-200.41,116.27],"displayOffsetMeters":25,"roadName":"老子大道/朱子路","roadWidth":1.28},{"id":"site_52","code":"52","name":"文化大學 大仁館 (十字風車綠瓦藝術學院)","lon":121.5398,"lat":25.13885,"source":"road-anchored:莊子路","x":-228,"z":74,"yaw":0.14,"radius":9,"entrance":[-221.38,121.32],"displayOffsetMeters":25,"roadName":"莊子路(劇院大道)","roadWidth":1.28},{"id":"site_53","code":"53","name":"歐洲學校足球場 (戶外人工草皮)","lon":121.5436,"lat":25.1368,"source":"road-anchored:國泰街/凱旋路口","x":-94,"z":160,"yaw":0,"radius":7,"entrance":[-94,170],"displayOffsetMeters":25,"roadName":"凱旋路/國泰街口(北側運動場)","roadWidth":1.28},{"id":"site_54","code":"54","name":"山仔后文史工作室 (美軍宿舍文化景觀)","lon":121.5458,"lat":25.13795,"source":"road-anchored:愛富二街","x":-56,"z":67,"yaw":0,"radius":5,"entrance":[-56,74],"displayOffsetMeters":25,"roadName":"愛富二街(北側美軍眷舍)","roadWidth":1.28},{"id":"site_55","code":"55","name":"文化大學 曉峯紀念館 (一樓全聯福利中心)","lon":121.5404,"lat":25.1384,"source":"road-anchored:光華路26巷","x":-177,"z":100,"yaw":1.57,"radius":7.5,"entrance":[-170,100],"displayOffsetMeters":25,"roadName":"光華路26巷(曉峯全聯)","roadWidth":1.28},{"id":"site_56","code":"56","name":"阿緹卡義大利 pizza專賣店 (Antica)","lon":121.5424,"lat":25.1367,"source":"road-anchored:凱旋路","x":-138,"z":164,"yaw":2.1,"radius":3.5,"entrance":[-142,162],"displayOffsetMeters":25,"roadName":"凱旋路/國泰街街廓(阿緹卡披薩)","roadWidth":1.6},{"id":"site_57","code":"57","name":"光在草山 (Light On Old Town)","lon":121.5426,"lat":25.1365,"source":"road-anchored:國泰街","x":-131,"z":168,"yaw":0.8,"radius":3.5,"entrance":[-128,169],"displayOffsetMeters":25,"roadName":"國泰街街廓(光在草山老眷舍)","roadWidth":1.6},{"id":"site_58","code":"58","name":"陽明山耶穌聖體堂 (天主教主徒會)","lon":121.5432,"lat":25.1386,"source":"road-anchored:華岡路","x":-118,"z":90,"yaw":1.25,"radius":4,"entrance":[-114,91],"displayOffsetMeters":25,"roadName":"華岡路(耶穌聖體堂聖母亭)","roadWidth":1.28},{"id":"site_59","code":"59","name":"草山溫泉湯王池 (陽明山溫泉第一泉)","lon":121.5488,"lat":25.1542,"source":"road-anchored:陽明路二段","x":92,"z":-455,"yaw":0.8,"radius":5.5,"entrance":[80,-450],"displayOffsetMeters":25,"roadName":"陽明路二段(草山溫泉湯王池)","roadWidth":3.84},{"id":"site_61","code":"61","name":"前山公園・陽明湖","lon":121.5486578,"lat":25.14994,"source":"OpenStreetMap northern extract 2026-09-27","x":60.492,"z":-321.827,"yaw":-0.7237337346074787,"radius":6,"entrance":[55.98914731083039,-316.73177720123505],"roadName":"","roadWidth":0.576,"displayOffsetMeters":10.9},{"id":"site_62","code":"62","name":"前山公園・磐流園","lon":121.54828464615386,"lat":25.150847765384615,"source":"OpenStreetMap northern extract 2026-09-27","x":48.344,"z":-353.261,"yaw":-0.9080514227348471,"radius":8,"entrance":[41.40699347956242,-347.8466581002773],"roadName":"","roadWidth":0.576,"displayOffsetMeters":8.7},{"id":"site_63","code":"63","name":"陽明公園・花鐘","lon":121.53900241000001,"lat":25.159013715,"source":"OpenStreetMap northern extract 2026-09-27","x":-248.53,"z":-637.243,"yaw":-2.4099836008604787,"radius":9,"entrance":[-255.07702868052846,-644.5351591857572],"roadName":"中興路","roadWidth":1.6,"displayOffsetMeters":21.8},{"id":"site_64","code":"64","name":"辛亥光復樓","lon":121.53976935,"lat":25.1596297,"source":"OpenStreetMap northern extract 2026-09-27","x":-226.962,"z":-673.217,"yaw":-0.167557666330662,"radius":10,"entrance":[-228.7629191231937,-662.5687378117674],"roadName":"","roadWidth":0.48,"displayOffsetMeters":28.0},{"id":"site_65","code":"65","name":"陽明書屋・中興賓館","lon":121.54078626774194,"lat":25.162891458064518,"source":"OpenStreetMap northern extract 2026-09-27","x":-197.111,"z":-782.953,"yaw":0.5451399045837811,"radius":10,"entrance":[-191.51070622673154,-773.7183654022224],"roadName":"","roadWidth":1.28,"displayOffsetMeters":8.7},{"id":"site_66","code":"66","name":"陽明山國家公園遊客中心","lon":121.54669205,"lat":25.155421583333332,"source":"OpenStreetMap northern extract 2026-09-27","x":0.029,"z":-518.694,"yaw":-0.8930796926248464,"radius":10,"entrance":[-8.384744849974298,-511.92198376085815],"roadName":"","roadWidth":0.576,"displayOffsetMeters":21.0},{"id":"site_67","code":"67","name":"陽明公園前門","lon":121.53915923846154,"lat":25.1546656,"source":"OpenStreetMap northern extract 2026-09-27","x":-255.894,"z":-491.831,"yaw":1.065990946602251,"radius":7,"entrance":[-249.06686890409952,-488.05891449401304],"roadName":"湖山路一段","roadWidth":2.56,"displayOffsetMeters":27.7},{"id":"site_45","code":"45","name":"草山行館","lon":121.53803735,"lat":25.15439099285714,"source":"OSM way 399827985","x":-284.733,"z":-478.495,"yaw":0.5217027550322123,"radius":9,"entrance":[-279.84887712412507,-469.9986676170207],"roadName":"","roadWidth":0.48,"displayOffsetMeters":2.6},{"id":"site_60","code":"60","name":"陽明山中山樓 (中華宮殿國寶)","lon":121.55288110000001,"lat":25.155733285714284,"source":"OSM relation 4800465","x":192.668,"z":-521.759,"yaw":-0.3490658503988659,"radius":16,"entrance":[186.92206159212878,-505.97216397079677],"roadName":"","roadWidth":1.28,"displayOffsetMeters":13.1,"orientationSource":"Cultural heritage value assessment: south slightly west; game approximation S20W, not surveyed bearing"}],"parks":[{"name":"前山公園","outer":[[49.9582,-293.0405],[76.9011,-291.9754],[77.9363,-309.6192],[83.8183,-314.9804],[60.4677,-338.8082],[64.963,-358.226],[74.9953,-368.9483],[66.1755,-390.2256],[62.5412,-396.2814],[45.2435,-402.1626],[41.6963,-385.73],[34.518,-384.8644],[35.5563,-381.2309],[33.1345,-375.3497],[28.1168,-377.5974],[23.2732,-373.6184],[27.0784,-370.505],[23.9633,-364.7983],[33.6537,-356.1492],[30.1935,-349.5769],[30.8933,-348.7754],[32.6153,-346.809],[27.4235,-338.68],[38.4973,-323.4585],[46.1078,-305.6402],[49.9582,-293.0405]],"holes":[]},{"name":"陽明公園","outer":[[-253.8895,-660.1828],[-232.419,-674.0649],[-201.1484,-660.5284],[-199.6908,-647.4193],[-197.4754,-627.6239],[-197.6463,-595.7098],[-183.5056,-571.4937],[-185.3631,-558.6946],[-201.4515,-550.0027],[-203.4863,-554.1777],[-205.863,-556.9669],[-208.0913,-558.5877],[-211.2484,-558.8691],[-220.8066,-558.8905],[-224.5473,-560.0411],[-226.7756,-560.7286],[-231.4,-572.4662],[-233.3058,-581.1581],[-247.685,-602.6277],[-248.646,-606.7314],[-252.2674,-622.7793],[-252.5351,-632.5541],[-252.5706,-635.4502],[-253.3929,-637.7193],[-255.9018,-640.6368],[-256.3984,-642.7136],[-255.5341,-644.7476],[-253.48,-645.9766],[-251.7063,-647.8361],[-250.1713,-651.9042],[-250.2584,-654.0415],[-253.8895,-660.1828]],"holes":[]}],"waters":[{"name":"陽明湖","outer":[[42.6863,-322.5181],[43.3571,-322.942],[45.3242,-323.3695],[46.6624,-322.6143],[47.5944,-320.7975],[48.7199,-319.6968],[49.5551,-319.5614],[49.8227,-318.4607],[52.6315,-315.8033],[54.7534,-314.4639],[55.7886,-313.2741],[57.0011,-311.2614],[57.4977,-309.3627],[57.9072,-308.1053],[57.4364,-306.6376],[56.7173,-305.0132],[55.6692,-304.1904],[53.7892,-303.1965],[51.8576,-302.1492],[49.9324,-303.4067],[47.8008,-304.5003],[47.5912,-304.5786],[47.2655,-307.172],[47.0655,-311.1011],[43.5667,-318.3716],[41.8092,-321.9659],[41.8737,-322.3863],[42.0091,-322.4896],[42.6863,-322.5181]],"holes":[[[51.4222,-308.148],[51.2997,-309.2951],[50.5451,-310.2141],[51.4061,-311.7423],[52.3638,-311.4751],[52.7121,-310.6808],[52.9475,-309.4981],[53.241,-308.2335],[52.438,-307.5068],[51.4222,-308.148]]]}],"extension":{"name":"陽明山公園區","bbox":[121.533,25.149,121.556,25.1655],"downloaded":"2026-09-27","note":"OSM geometry; stylized miniature buildings and approximate widths, no terrain survey"},"roadSelection":{"policy":"Named main streets plus shortest existing mapped approaches to landmarks and necessary junction links; other lanes and trails hidden.","sourceRoadParts":1615,"displayRoadParts":151,"connectedComponents":1,"landmarkConnections":[{"code":"01","name":"山仔后派出所","approachRoad":"格致路","entranceDistanceUnits":2.42,"connectedToMainRoad":true},{"code":"02","name":"陽明山麥當勞","approachRoad":"格致路50巷","entranceDistanceUnits":1.3,"connectedToMainRoad":true},{"code":"03","name":"7-ELEVEN 陽明山門市","approachRoad":"格致路","entranceDistanceUnits":2.42,"connectedToMainRoad":true},{"code":"04","name":"山仔后公園","approachRoad":"凱旋路","entranceDistanceUnits":1.3,"connectedToMainRoad":true},{"code":"05","name":"陽明里辦公處 (區民活動中心)","approachRoad":"菁山路","entranceDistanceUnits":1.77,"connectedToMainRoad":true},{"code":"06","name":"台灣中油陽明山加油站","approachRoad":"地標連接步道","entranceDistanceUnits":0.83,"connectedToMainRoad":true},{"code":"07","name":"豆留森林 (CAMA)","approachRoad":"地標連接步道","entranceDistanceUnits":1.11,"connectedToMainRoad":true},{"code":"08","name":"白房子 Yang Ming Cafe","approachRoad":"格致路","entranceDistanceUnits":1.3,"connectedToMainRoad":true},{"code":"09","name":"彩虹谷故事館 (F206)","approachRoad":"愛富三街","entranceDistanceUnits":1.18,"connectedToMainRoad":true},{"code":"10","name":"美軍宿舍群 (C 區建業路段)","approachRoad":"地標連接步道","entranceDistanceUnits":1.11,"connectedToMainRoad":true},{"code":"11","name":"雀客藏居陽明山溫泉飯店","approachRoad":"地標連接步道","entranceDistanceUnits":1.11,"connectedToMainRoad":true},{"code":"12","name":"陽明山錫安堂","approachRoad":"陽明路一段24巷3弄","entranceDistanceUnits":1.3,"connectedToMainRoad":true},{"code":"13","name":"草山御賓館 (市定古蹟)","approachRoad":"新園街","entranceDistanceUnits":1.46,"connectedToMainRoad":true},{"code":"14","name":"中國文化大學","approachRoad":"華岡路","entranceDistanceUnits":1.11,"connectedToMainRoad":true},{"code":"15","name":"亞尼克夢想村","approachRoad":"長春街","entranceDistanceUnits":1.11,"connectedToMainRoad":true},{"code":"16","name":"The Cafe By 想 陽明山","approachRoad":"國泰街","entranceDistanceUnits":7.75,"connectedToMainRoad":true},{"code":"17","name":"陽明山星巴克 (草山門市)","approachRoad":"光華路","entranceDistanceUnits":1.3,"connectedToMainRoad":true},{"code":"18","name":"美軍俱樂部 (BRICK YARD 33 1/3)","approachRoad":"凱旋路","entranceDistanceUnits":3.68,"connectedToMainRoad":true},{"code":"19","name":"陽明山美國渡假村","approachRoad":"凱旋路61巷2弄","entranceDistanceUnits":1.1,"connectedToMainRoad":true},{"code":"20","name":"臺北市立陽明教養院","approachRoad":"凱旋路61巷2弄","entranceDistanceUnits":1.11,"connectedToMainRoad":true},{"code":"21","name":"屋頂上餐廳 (The Top)","approachRoad":"孔子大道","entranceDistanceUnits":1.11,"connectedToMainRoad":true},{"code":"22","name":"華岡藝校","approachRoad":"地標連接步道","entranceDistanceUnits":0.83,"connectedToMainRoad":true},{"code":"23","name":"台北歐洲學校 (陽明校區)","approachRoad":"建業路68巷","entranceDistanceUnits":1.1,"connectedToMainRoad":true},{"code":"24","name":"草山猛禽中心","approachRoad":"建業路11巷","entranceDistanceUnits":1.1,"connectedToMainRoad":true},{"code":"25","name":"YMS onefifteen 初衣食午","approachRoad":"建業路","entranceDistanceUnits":1.3,"connectedToMainRoad":true},{"code":"26","name":"花卉試驗中心","approachRoad":"仰德大道四段","entranceDistanceUnits":2.42,"connectedToMainRoad":true},{"code":"27","name":"陽明福德宮","approachRoad":"地標連接步道","entranceDistanceUnits":1.3,"connectedToMainRoad":true},{"code":"28","name":"臺北市立格致國民中學","approachRoad":"仰德大道四段","entranceDistanceUnits":2.42,"connectedToMainRoad":true},{"code":"29","name":"納美花園 (Navi Garden)","approachRoad":"菁山路72巷20弄","entranceDistanceUnits":1.1,"connectedToMainRoad":true},{"code":"30","name":"下竹林福德宮","approachRoad":"地標連接步道","entranceDistanceUnits":1.29,"connectedToMainRoad":true},{"code":"31","name":"臺灣銀行行員訓練所","approachRoad":"地標連接步道","entranceDistanceUnits":0.82,"connectedToMainRoad":true},{"code":"32","name":"吉佳咖啡 (山上店)","approachRoad":"格致路56巷","entranceDistanceUnits":1.3,"connectedToMainRoad":true},{"code":"33","name":"真愛桃花源 庭園餐廳","approachRoad":"華岡路","entranceDistanceUnits":1.14,"connectedToMainRoad":true},{"code":"34","name":"臺北市教師研習中心","approachRoad":"陽明路一段","entranceDistanceUnits":2.42,"connectedToMainRoad":true},{"code":"35","name":"林洋港故居 (前美軍總司令官邸)","approachRoad":"愛富二街","entranceDistanceUnits":1.14,"connectedToMainRoad":true},{"code":"36","name":"文化大學學生美食街 (牛肉拌麵)","approachRoad":"光華路26巷","entranceDistanceUnits":1.11,"connectedToMainRoad":true},{"code":"37","name":"文化大學郵局 (華岡大典館)","approachRoad":"孔子大道","entranceDistanceUnits":1.11,"connectedToMainRoad":true},{"code":"38","name":"比夢烘焙坊 (The Cafe' By 想 陽明山)","approachRoad":"愛富一街","entranceDistanceUnits":1.14,"connectedToMainRoad":true},{"code":"39","name":"康迎鼎 陽明山店","approachRoad":"愛富二街厚生巷","entranceDistanceUnits":2.44,"connectedToMainRoad":true},{"code":"40","name":"大衛小小羊 (David & Alpaca)","approachRoad":"國泰街","entranceDistanceUnits":4.48,"connectedToMainRoad":true},{"code":"41","name":"朱里昂法式廚房 (C.L Program)","approachRoad":"國泰街","entranceDistanceUnits":6.06,"connectedToMainRoad":true},{"code":"42","name":"文化大學後山「情人坡」","approachRoad":"荀子大道(仇人坡)","entranceDistanceUnits":1.11,"connectedToMainRoad":true},{"code":"43","name":"仇人坡 (荀子大道) 與百花池","approachRoad":"釋迦大道","entranceDistanceUnits":1.1,"connectedToMainRoad":true},{"code":"44","name":"草山水管路步道 (愛富段出口)","approachRoad":"天母古道親山步道","entranceDistanceUnits":0.83,"connectedToMainRoad":true},{"code":"46","name":"文化大學大孝館 (圓柱體育館)","approachRoad":"地標連接步道","entranceDistanceUnits":1.11,"connectedToMainRoad":true},{"code":"47","name":"草山夜未眠景觀餐廳","approachRoad":"地標連接步道","entranceDistanceUnits":1.1,"connectedToMainRoad":true},{"code":"48","name":"陽明山順天府 (池府王爺)","approachRoad":"地標連接步道","entranceDistanceUnits":0.82,"connectedToMainRoad":true},{"code":"49","name":"文化大學 大義館 (八角中庭宮殿)","approachRoad":"華岡路","entranceDistanceUnits":1.1,"connectedToMainRoad":true},{"code":"50","name":"文化大學 大恩館 (行政大樓與百花池涼亭)","approachRoad":"華岡路","entranceDistanceUnits":1.11,"connectedToMainRoad":true},{"code":"51","name":"文化大學 大賢館 (法學院與社科院)","approachRoad":"地標連接步道","entranceDistanceUnits":1.1,"connectedToMainRoad":true},{"code":"52","name":"文化大學 大仁館 (十字風車綠瓦藝術學院)","approachRoad":"華岡路","entranceDistanceUnits":1.11,"connectedToMainRoad":true},{"code":"53","name":"歐洲學校足球場 (戶外人工草皮)","approachRoad":"凱旋路","entranceDistanceUnits":8.84,"connectedToMainRoad":true},{"code":"54","name":"山仔后文史工作室 (美軍宿舍文化景觀)","approachRoad":"愛富二街","entranceDistanceUnits":1.77,"connectedToMainRoad":true},{"code":"55","name":"文化大學 曉峯紀念館 (一樓全聯福利中心)","approachRoad":"華岡路","entranceDistanceUnits":7.84,"connectedToMainRoad":true},{"code":"56","name":"阿緹卡義大利 pizza專賣店 (Antica)","approachRoad":"凱旋路","entranceDistanceUnits":6.05,"connectedToMainRoad":true},{"code":"57","name":"光在草山 (Light On Old Town)","approachRoad":"國泰街","entranceDistanceUnits":8.21,"connectedToMainRoad":true},{"code":"58","name":"陽明山耶穌聖體堂 (天主教主徒會)","approachRoad":"華岡路","entranceDistanceUnits":4.31,"connectedToMainRoad":true},{"code":"59","name":"草山溫泉湯王池 (陽明山溫泉第一泉)","approachRoad":"地標連接步道","entranceDistanceUnits":3.66,"connectedToMainRoad":true},{"code":"61","name":"前山公園・陽明湖","approachRoad":"地標連接步道","entranceDistanceUnits":12.15,"connectedToMainRoad":true},{"code":"62","name":"前山公園・磐流園","approachRoad":"地標連接步道","entranceDistanceUnits":0.49,"connectedToMainRoad":true},{"code":"63","name":"陽明公園・花鐘","approachRoad":"中興路","entranceDistanceUnits":1.0,"connectedToMainRoad":true},{"code":"64","name":"辛亥光復樓","approachRoad":"地標連接步道","entranceDistanceUnits":0.44,"connectedToMainRoad":true},{"code":"65","name":"陽明書屋・中興賓館","approachRoad":"地標連接步道","entranceDistanceUnits":0.84,"connectedToMainRoad":true},{"code":"66","name":"陽明山國家公園遊客中心","approachRoad":"地標連接步道","entranceDistanceUnits":0.49,"connectedToMainRoad":true},{"code":"67","name":"陽明公園前門","approachRoad":"湖山路一段","entranceDistanceUnits":1.48,"connectedToMainRoad":true},{"code":"45","name":"草山行館","approachRoad":"地標連接步道","entranceDistanceUnits":0.44,"connectedToMainRoad":true},{"code":"60","name":"陽明山中山樓 (中華宮殿國寶)","approachRoad":"地標連接步道","entranceDistanceUnits":1.11,"connectedToMainRoad":true}],"mainStreetNames":["中庸一路","中興路","仰德大道三段","仰德大道四段","光華路","凱旋路","國泰街","建業路","愛富一街","愛富三街","愛富二街","新園街","格致路","泉源路","湖山路一段","湖山路二段","紗帽路","菁山路","華岡路","長春街","陽明路一段","陽明路二段"]}};

  const ROAD_SURFACE = [{"outer":[[-287.7365513074836,-689.7965842990935],[-287.67274739166396,-689.7687636662913],[-279.691447391664,-686.6945636662913],[-279.63988412602043,-686.6766972970571],[-272.3357841260204,-684.4217972970571],[-272.328409248224,-684.4195593986577],[-264.8507643025322,-682.1897547333069],[-262.96308502337047,-681.623341622585],[-257.7304523723048,-679.8885445212953],[-257.70887398678946,-679.8817277375124],[-252.71687398678944,-678.3820277375123],[-252.5250928343377,-678.3491217871375],[-242.6637928343377,-677.8753217871375],[-242.5622872867774,-677.8768933947423],[-239.1858872867774,-678.1440933947423],[-238.80817937704109,-678.2740094230936],[-237.0603793770411,-679.4281094230936],[-236.84184548443258,-679.6426529574085],[-236.71993380467458,-679.9235862816574],[-236.30713380467458,-681.7973862816575],[-236.3078246478027,-682.1447202030078],[-236.45565556717855,-682.459024751911],[-238.12295556717854,-684.6141247519109],[-238.35074875311864,-684.8145380317458],[-238.6367886194188,-684.9157131926395],[-254.86110790589495,-687.3543733278699],[-258.85888265889827,-688.5659015103444],[-269.3720047831706,-695.8188951449828],[-269.470517990079,-695.8769327357605],[-276.63778876685603,-699.435717806345],[-287.8776834868397,-705.5886673382529],[-303.86897718958323,-714.9550065007492],[-303.92240387370174,-714.9836380422184],[-312.9299543710513,-719.3800037807773],[-313.39099759685223,-721.2206207075817],[-312.5846713924045,-722.1710135053448],[-310.70034550193736,-722.2450340277464],[-306.6086596767812,-721.1433265600937],[-262.5447023355035,-702.8376078327441],[-257.6772111619,-700.4684793661287],[-257.52323778974784,-700.412216369801],[-253.1988377897479,-699.3186163698009],[-252.91843745852825,-699.2986499864215],[-248.98423745852824,-699.7153499864215],[-248.92161715200814,-699.7244997018275],[-241.16675516798844,-701.1729429649388],[-235.13142922169192,-701.883443636309],[-223.70674842976769,-700.8965680723343],[-223.61020929152747,-700.8940793782119],[-216.82210929152745,-701.129179378212],[-216.7160008019091,-701.1399682492823],[-213.10555308579333,-701.7524388499977],[-197.73120614832652,-704.3063140890428],[-197.58548114142542,-704.3449193450818],[-195.5087811414254,-705.1108193450818],[-195.18887278560373,-705.3285617209707],[-193.78607278560375,-706.8995617209707],[-193.6305485892073,-707.160154127744],[-193.5832735801998,-707.4599227913099],[-193.6477735801998,-709.3336227913098],[-193.74076964963086,-709.6813530666194],[-194.82106964963086,-711.7153530666194],[-195.05367137631163,-711.98460885149],[-196.03717137631162,-712.70780885149],[-196.4618028195217,-712.8617796728764],[-200.7314028195217,-713.1253796728764],[-201.0309551389453,-713.0867502256573],[-208.6181871188492,-710.5879106790892],[-213.23422251867828,-709.7040478991369],[-216.0887553914413,-709.1779750879873],[-220.08153072674995,-709.2639305339848],[-239.9582300755416,-712.6843121204024],[-240.0291188549962,-712.6932728132135],[-251.11908820919493,-713.5942577739705],[-253.40458950719082,-714.8997209193288],[-254.4955,-716.104816636483],[-254.4955,-717.1524437492657],[-253.9976936713965,-718.2548167841474],[-252.3350569475297,-719.0378092609407],[-244.66792171086098,-719.7320843176392],[-217.28572366479747,-718.0543973544046],[-217.0233791548199,-718.0818931629079],[-214.2564791548199,-718.8477931629079],[-213.9957578564825,-718.9744482111915],[-211.9189578564825,-720.5026482111916],[-209.84496873090913,-722.0312084174454],[-209.63473959626054,-722.2617193748314],[-206.86463959626053,-726.8499193748314],[-206.7500904974004,-727.2326681410672],[-206.68563152183134,-728.9094009970329],[-206.5986944493971,-731.0237705552354],[-206.53741404090653,-732.4732071664994],[-206.59066102960563,-732.7958353417656],[-207.25816102960562,-734.5199353417656],[-207.33203681874286,-734.6649163871527],[-208.22884262265538,-736.054443984494],[-208.8455536682853,-737.4138235026415],[-209.79236076216665,-745.7913421290539],[-210.21479140208746,-749.5177128235308],[-210.22583650141056,-749.5522850621973],[-210.2260635656244,-749.5885780690625],[-211.1582421289284,-754.1263954860755],[-211.05841579013034,-757.0741809547748],[-210.25691742614538,-759.8552825688057],[-209.6272520122646,-761.2496524941682],[-206.3983910140364,-765.5277393482451],[-205.19345409012337,-765.7951175149512],[-203.38253476977852,-766.1952118348241],[-182.08843819492338,-762.4009054399339],[-181.9481,-762.3885],[-176.4111,-762.3885],[-176.08788949845578,-762.4566974503382],[-172.62778949845577,-763.9848974503382],[-172.45874815768155,-764.0860748151761],[-136.84434815768157,-791.8858748151761],[-136.73351891488716,-791.9908639997307],[-134.98241891488715,-793.9999639997308],[-134.85296414374363,-794.2040549498146],[-132.99226414374363,-798.4430549498145],[-132.9337224969952,-798.645451419481],[-132.5887224969952,-800.936051419481],[-132.59447758759723,-801.2077408423273],[-133.28777758759725,-804.7770408423273],[-133.36397188355787,-804.9948205563713],[-134.87637188355785,-807.8909205563713],[-135.0303453621535,-808.0966237218009],[-149.9285812093411,-822.4551030921244],[-153.4468749515844,-827.1154039059476],[-155.84743241816943,-831.6842942589999],[-156.4947,-834.5509927622703],[-156.4947,-836.6667072377297],[-155.87062837779578,-839.4306726139142],[-154.6747721062795,-840.7485550355852],[-150.84726357737628,-843.6638631923563],[-148.39624564105364,-844.4222518804992],[-145.84105154656902,-843.8745730040521],[-144.64169752186405,-843.0049113451654],[-139.4619971620856,-838.6078531268215],[-137.10945238988091,-836.1110815948422],[-136.9928554143875,-836.0091886357245],[-135.0869554143875,-834.6448886357244],[-130.9328439239209,-831.6771513470139],[-130.8232439150587,-831.6113994884557],[-126.21184391505867,-829.3243994884558],[-126.15983576170437,-829.3008792636525],[-120.55056048305742,-827.0014912119422],[-111.99609571479259,-821.853545927667],[-111.96942899716676,-821.8381890519224],[-106.97939234990308,-819.0909419652143],[-93.26900960471322,-807.5095358828529],[-80.05896732272227,-796.2117246852864],[-79.95167600872672,-796.134354458086],[-72.55077600872671,-791.677954458086],[-72.25855107724782,-791.5724197701359],[-66.62165107724782,-790.7139197701359],[-66.30982552398413,-790.7280273112875],[-66.0271349998799,-790.8603914528336],[-65.81661657463404,-791.0908609541078],[-65.71031977013592,-791.3843489227522],[-65.7244273112875,-791.6961744760159],[-65.85679145283358,-791.9788650001201],[-66.08726095410772,-792.189383425366],[-66.38074892275218,-792.2956802298642],[-71.86109094537619,-793.1303364462991],[-79.06946909455031,-797.4708107648253],[-92.23093267727774,-808.7270753147136],[-92.23465778796087,-808.7302415372145],[-106.00765778796087,-820.3645415372146],[-106.13807100283324,-820.4542109480776],[-111.18428993868855,-823.2323889957322],[-119.77800428520742,-828.4039540723329],[-119.88706423829562,-828.4587207363475],[-125.5265403573701,-830.7704888992453],[-130.05492148515197,-833.0163161185793],[-134.15595022813832,-835.9461301523011],[-135.99829233424484,-837.2649335183545],[-138.32804761011909,-839.7375184051579],[-138.39257012044888,-839.7987817687224],[-143.62957012044888,-844.2444817687224],[-143.6776799330101,-844.2822549951019],[-145.03857993301008,-845.2690549951019],[-145.34053654673284,-845.4036333196934],[-148.26533654673284,-846.0305333196934],[-148.6694730781615,-846.0125515837764],[-151.4556730781615,-845.1504515837764],[-151.7039410600428,-845.0226166125335],[-155.7026410600428,-841.9769166125335],[-155.81034824410952,-841.8780919252106],[-157.19704824410954,-840.3498919252106],[-157.38495580974987,-839.9884953750519],[-158.07505580974987,-836.9320953750519],[-158.09470000000002,-836.7559],[-158.09470000000002,-834.4618],[-158.07505580974987,-834.2856046249482],[-157.38495580974987,-831.2292046249481],[-157.31279771232136,-831.0333032380377],[-154.83289771232134,-826.3134032380377],[-154.76317979922234,-826.2034797245085],[-151.16757979922235,-821.4407797245085],[-151.0842546378465,-821.3467762781991],[-136.23437568445183,-807.0349018528543],[-134.83619330519525,-804.3575175705447],[-134.19141252635626,-801.0380079298266],[-134.50004983129514,-798.9888351452091],[-136.26890168256148,-794.9590812904675],[-137.88929814339815,-793.0999421610819],[-173.3650078928817,-765.408400652768],[-176.57990008542387,-763.9884999999999],[-181.87738260226945,-763.9884999999999],[-200.8412854556556,-767.3675988791534],[-195.60407599254384,-769.5142133265562],[-195.51493585813873,-769.5591649578594],[-182.97383585813873,-777.1645649578594],[-182.7896797275231,-777.3332196539798],[-182.68408300565667,-777.5595097759423],[-182.67312183620695,-777.8089847040033],[-182.75846495785936,-778.0436641418613],[-182.92711965397967,-778.227820272477],[-183.1534097759422,-778.3334169943433],[-183.4028847040032,-778.3443781637931],[-183.63756414186128,-778.2590350421407],[-196.13585242031797,-770.6795976982893],[-203.19366390998363,-767.7867594000558],[-203.25896180507664,-767.7983945600661],[-203.5718855566209,-767.7919620994684],[-205.5389855566209,-767.3573620994683],[-207.0327061894894,-767.0259025382063],[-207.2919908936746,-766.9178525382297],[-207.49794298043093,-766.7268365748129],[-210.95814298043095,-762.1422365748128],[-211.0487062935883,-761.9895476463848],[-211.7388062935883,-760.4613476463849],[-211.77841350225174,-760.3536390517627],[-212.62331350225173,-757.4219390517626],[-212.6541416627223,-757.2274763655474],[-212.76054166272232,-754.0855763655475],[-212.74463643437562,-753.8975219309375],[-211.80056318442453,-749.301801534429],[-211.38222394091667,-745.6115225210897],[-210.42123923783333,-737.1085578709461],[-210.35483298630785,-736.867885722152],[-209.66153298630786,-735.339685722152],[-209.60516318125713,-735.2363836128472],[-208.72071169196994,-733.8659980204342],[-208.14304112270426,-732.3739203747848],[-208.19728595909348,-731.0908928335006],[-208.19732460479557,-731.0899660336581],[-208.2843246047956,-728.9740660336581],[-208.2844095025996,-728.9719318589329],[-208.3409846763665,-727.5002756334112],[-210.92225902446137,-723.2248332436315],[-212.86748677467205,-721.7911717785377],[-214.82534697192628,-720.3504928718331],[-217.32134656114596,-719.6595802673359],[-244.6306763352025,-721.3328026455954],[-244.7517464802584,-721.3310401617757],[-252.6201464802584,-720.6185401617757],[-252.88884260626955,-720.5455584664454],[-254.94624260626955,-719.5766584664453],[-255.1755818647265,-719.4140529569886],[-255.3345062935883,-719.1821476463848],[-256.0246062935883,-717.6539476463848],[-256.0955,-717.3247],[-256.0955,-715.7965],[-256.041981124178,-715.5088093132443],[-255.88858517188507,-715.2596108318377],[-254.50518517188507,-713.7314108318376],[-254.30888796651055,-713.5736351098317],[-251.75808796651054,-712.1166351098317],[-251.4260811450038,-712.0139271867864],[-240.19432581806117,-711.1014230752538],[-220.2940699244584,-707.6769878795976],[-220.17561820597317,-707.6655853130987],[-216.04141820597317,-707.5765853130987],[-215.87920666458638,-707.589649129212],[-212.94150666458637,-708.1310491292121],[-212.93605185326265,-708.1320739948663],[-208.26655185326265,-709.0261739948663],[-208.1667448610547,-709.0520497743428],[-200.67650821883558,-711.5189441021168],[-196.79536757015381,-711.2793271180919],[-196.1485373215573,-710.803691494518],[-195.24047174048866,-709.0939762377434],[-195.1933721928742,-707.7257526351822],[-196.2495105531688,-706.542980063167],[-198.0680831746324,-705.8722790612028],[-213.36909385167348,-703.3305859109572],[-213.37179919809088,-703.3301317507177],[-216.9309053465144,-702.7263706517812],[-223.61724589711105,-702.4947950027121],[-235.07505157023232,-703.4845319276657],[-235.23743302910393,-703.4820134186825],[-241.38063302910393,-702.7588134186825],[-241.43398284799187,-702.7507002981724],[-249.1842537870132,-701.3031145446097],[-252.94498067494325,-700.9047883552445],[-257.05107801311766,-701.9431816696991],[-261.86578883809995,-704.2866206338714],[-261.9089830687593,-704.3060841344519],[-306.04318306875933,-722.6409841344519],[-306.1421036626352,-722.6746878792853],[-310.4020036626352,-723.8216878792854],[-310.64140156529817,-723.8485834759969],[-312.9987015652982,-723.7559834759968],[-313.31760671179427,-723.6758254220144],[-313.57732874018416,-723.4741566984876],[-314.87692874018416,-721.9423566984876],[-315.04606113854106,-721.6062054028616],[-315.04279992055586,-721.2299171806407],[-315.02676290596355,-721.1660679486301],[-314.3915257292735,-718.6300187573207],[-314.2370128125204,-718.3206919259402],[-313.96639612629826,-718.1054619577815],[-304.6514522018123,-713.5590649835699],[-288.67632281041676,-704.2021934992508],[-288.65614454486933,-704.1907643171057],[-277.39204454486935,-698.0245643171057],[-277.36368200992104,-698.0097672642395],[-270.23341765092385,-694.4693570941174],[-259.6646952168294,-687.1780048550172],[-259.4424201743199,-687.0708847972326],[-255.26952017431992,-685.8062847972326],[-255.15641138058118,-685.7807868073605],[-239.19203138845407,-683.3811978703429],[-237.95020099120816,-681.7760466143574],[-238.2126852573395,-680.584566435392],[-239.51771310379058,-679.7228358955196],[-242.6378098982323,-679.4759191014564],[-252.3504007008662,-679.942574159338],[-257.2376886092071,-681.4108164822826],[-262.4704476276952,-683.1456554787047],[-262.4922809779969,-683.152548812933],[-264.39158097799697,-683.722448812933],[-264.39289075177606,-683.7228406013422],[-271.8674979230095,-685.9517394141541],[-279.14182938162355,-688.1974493587097],[-287.065144930294,-691.2493151775266],[-295.7052486925164,-695.4731157009065],[-295.85274454078103,-695.5279909460087],[-302.057244540781,-697.1629909460087],[-302.11925002221363,-697.1767236842634],[-310.85835002221364,-698.7512236842633],[-311.0341189493762,-698.7631806171008],[-315.31341894937617,-698.5815806171008],[-315.54030463316326,-698.5385942174316],[-318.4329046331633,-697.5410942174317],[-318.6532370712529,-697.4239456161675],[-320.17213707125285,-696.2805456161675],[-320.4110665354168,-695.9899745036183],[-320.49077256922476,-695.6223254746949],[-320.43597256922476,-693.3246254746949],[-320.4067738934809,-693.1941718239452],[-320.385062161386,-693.0622653481813],[-320.37284941630674,-693.0426042687601],[-320.3677940025562,-693.0200177245758],[-320.2908954928269,-692.9106681161614],[-320.22035804503224,-692.7971111431577],[-319.3270580450323,-691.8424111431577],[-318.94316133637005,-691.6144708545476],[-316.46326133637,-690.9732708545475],[-316.34429684472457,-690.9519414553843],[-299.6318646660497,-689.24476872602],[-296.69013772127494,-687.9071033996386],[-290.2349386466044,-682.5915334490035],[-290.1367376121234,-682.5223518335832],[-274.60678742223496,-673.2430803495943],[-265.40685590989636,-667.7260372369223],[-259.13583070851973,-663.6419778098331],[-255.9573131447749,-660.415670233914],[-251.62842486376985,-653.6072992293622],[-251.9260688631245,-651.1179601112815],[-252.60926039548065,-649.5058156164818],[-253.83836556776473,-647.6880332810741],[-255.41960235160212,-646.6354452117585],[-255.51075423689022,-646.5647803278038],[-257.3359542368902,-644.9260803278037],[-257.39570486272135,-644.8463026261348],[-257.46625123262476,-644.7758907758242],[-257.48842309866177,-644.7225073074547],[-257.52307524959014,-644.6762405291493],[-257.5477480251495,-644.5796699688476],[-257.5859789238401,-644.4876209745238],[-257.92137892384017,-642.8098209745239],[-257.9342882923574,-642.5884096662696],[-257.77298829235735,-640.5971096662696],[-257.7142148197248,-640.3543758257427],[-257.5834563640537,-640.1415936256116],[-255.34595421006154,-637.5265902515665],[-254.74951006883208,-635.8310896695216],[-254.5300250475796,-634.9682651457821],[-254.01792389635085,-624.0349700884182],[-254.00990171962755,-623.9534123149133],[-253.31980171962755,-619.3652123149133],[-253.30443705562107,-619.2886698986439],[-251.23524782291142,-611.0794645038116],[-250.41818854413413,-606.2939593372697],[-250.41517007414416,-606.2773397652746],[-250.07977007414414,-604.5354397652746],[-250.07014079457014,-604.4919799873617],[-249.21554079457016,-601.0864799873617],[-249.1011142153176,-600.8313122996427],[-236.15411944254555,-581.7940701589266],[-233.92952726167928,-576.460986862804],[-232.66083835781663,-568.4018475705267],[-236.4253311612316,-569.7273446371075],[-251.65397576607307,-578.4207359172574],[-254.16656655120545,-581.8918490291597],[-256.87195720558225,-588.6176326477444],[-261.02263292639475,-599.3113562274759],[-261.02823748685444,-599.3255444823907],[-262.76633748685447,-603.6500444823906],[-266.553755279576,-613.0625103883672],[-270.699616545757,-624.5083215243177],[-270.7365299302587,-624.5991962342158],[-271.42662993025874,-626.1273962342158],[-271.6716993857156,-626.4889899019425],[-274.0515993857156,-628.9575899019426],[-274.45515784765735,-629.2397280546944],[-287.01673677296685,-634.7980495313166],[-297.30073460012085,-639.8062373989941],[-306.29860484634577,-647.9206222125066],[-320.1058898077844,-662.4088592005535],[-320.2624073366803,-662.5482271562812],[-335.4195185346357,-673.9645711559078],[-339.98408584324216,-678.4477058888374],[-340.055424347838,-678.512674239365],[-343.59632398070875,-681.5011812006043],[-347.52223607315597,-687.3028986645518],[-351.7857883408078,-696.6941337943157],[-351.9970173437877,-697.0180794875347],[-352.2953563848035,-697.2641532985361],[-354.2592563848035,-698.4361532985362],[-354.660476141524,-698.5913985634252],[-356.57267614152397,-698.9796985634251],[-357.07210338851706,-698.9816917588269],[-357.53427676285014,-698.7924106981669],[-357.8888345578932,-698.4406717070937],[-358.08179856342514,-697.980023858476],[-358.083791758827,-697.480596611483],[-357.89451069816704,-697.0184232371498],[-357.5427717070937,-696.6638654421068],[-357.08212385847605,-696.4709014365748],[-355.3837663892408,-696.1260252702198],[-353.9512206686566,-695.2711224826417],[-349.80851165919216,-686.1460662056843],[-349.7030992280262,-685.9578509728603],[-345.61729922802624,-679.9198509728603],[-345.38277565216197,-679.659025760635],[-341.7434701327743,-676.5874645738105],[-337.1535141567578,-672.0793941111626],[-337.0266926633197,-671.9701728437188],[-321.88657530187436,-660.5666286105476],[-308.1184101922156,-646.1194407994466],[-308.04902588958345,-646.051940283713],[-298.88092588958347,-637.7840402837129],[-298.58412315409925,-637.5838064093203],[-288.11652315409924,-632.4862064093203],[-288.07404215234266,-632.4664719453056],[-275.7204716446105,-627.0001912592251],[-273.6685441433721,-624.8717874483267],[-273.08986896165453,-623.5903334377474],[-268.953083454243,-612.1695784756823],[-268.93707181500855,-612.127681322508],[-265.141567211434,-602.695118401073],[-263.40640706816265,-598.3779329459343],[-259.25566707360525,-587.6840437725241],[-259.2499299868301,-587.6695259161527],[-256.4830299868301,-580.7908259161527],[-256.3323640918624,-580.517958292294],[-253.5655640918624,-576.695658292294],[-253.16327951922295,-576.3345755878073],[-237.59407951922296,-567.4467755878073],[-237.38461200109992,-567.3510558955621],[-232.52609991628213,-565.6403490745711],[-230.55650497532724,-561.1545085719639],[-230.38188601316446,-560.8668399793434],[-228.60818601316447,-558.6617399793435],[-228.09542998873528,-558.2792916924329],[-225.33502998873527,-557.1500916924329],[-225.02497890151187,-557.0667612753756],[-219.48807890151187,-556.3044612753756],[-219.3135,-556.2925],[-211.93151319462285,-556.2925],[-210.06921017371934,-555.6056709521308],[-210.0682162294211,-555.6055136283396],[-210.06735733999784,-555.6049892382165],[-208.10712488794113,-554.8854759494054],[-207.0582800105182,-554.2493292501704],[-206.3082781157868,-553.4180386463723],[-205.3514053421272,-551.8353725301348],[-205.1779452674193,-548.4217499746425],[-205.35809751249352,-545.5596102753804],[-206.77790532150422,-540.6266684220454],[-207.33863050116742,-538.9880997304981],[-210.6609941065724,-533.1188019306253],[-214.72240784080438,-528.888811495193],[-234.7676308751287,-508.0104875041613],[-234.82020020228984,-507.9522625158551],[-238.49650020228984,-503.6206625158551],[-238.55345120835383,-503.548454483091],[-241.44692640504618,-499.5956581964697],[-243.9683952056789,-497.88926797841884],[-244.32425977689218,-497.52670516220695],[-246.77825977689218,-493.75070516220694],[-246.96558564450078,-493.27528969557045],[-247.4381572426259,-490.59296366029383],[-250.84823189492076,-484.4215361736096],[-251.57823806901314,-483.17849925563917],[-251.58239169647888,-483.17137409000304],[-252.43369169647886,-481.70017409000303],[-252.59679682802874,-481.21064888036824],[-252.77696282493983,-479.69964853489427],[-253.76105375225515,-480.0575566311028],[-253.84996372701227,-480.0712189938182],[-253.93681082161453,-480.09465456348045],[-253.9724003482737,-480.09003323298424],[-254.00787230690406,-480.09548403607306],[-254.09524277267624,-480.0740820390401],[-254.1844474300753,-480.0624987379304],[-254.21555935871123,-480.04460966305373],[-254.25041710730292,-480.0360710175819],[-254.32294670269164,-479.9828629208393],[-254.40092832244065,-479.93802420154867],[-254.42282614394867,-479.90959083177665],[-254.4517629062651,-479.88836266911426],[-254.4984096578551,-479.8114489230584],[-254.5532962452522,-479.7401810741349],[-256.3093170309783,-476.195167277403],[-258.1346930418184,-472.60463868364184],[-262.1200482007801,-468.2911365041763],[-266.5296336545166,-466.74442590838123],[-266.6019935386611,-466.7016683849612],[-266.6792805466416,-466.668639957208],[-266.708563506907,-466.6386960907538],[-266.74462121721854,-466.61738955590585],[-266.79511043733265,-466.5501958263272],[-266.8538748900367,-466.4901050804438],[-269.5626748900367,-462.3365050804438],[-269.65565669095463,-462.10474599936003],[-269.6528703130879,-461.8550459331503],[-269.55473995720797,-461.62541945335835],[-269.3762050804438,-461.45082510996326],[-269.14444599936,-461.35784330904534],[-268.89474593315026,-461.3606296869121],[-268.66511945335833,-461.458760042792],[-268.49052510996324,-461.63729491955615],[-265.90060575941845,-465.60860657579616],[-261.54616634548336,-467.1359740916187],[-261.2879246823067,-467.3055853724596],[-257.1343246823067,-471.8011853724596],[-257.03389320064673,-471.9454620854238],[-255.16679320064674,-475.6180620854238],[-255.16380375474782,-475.6240189258651],[-253.6604556638701,-478.65894298073516],[-252.90525486203484,-478.3842808801736],[-253.30837081006902,-462.8215442607294],[-253.30689962592817,-462.71867664521653],[-252.70524912711747,-451.6898143671831],[-252.65084037495697,-448.2449857814884],[-252.64531617951786,-448.14470819688023],[-251.78101617951785,-439.0039081968802],[-251.7221406896704,-438.72302245965477],[-249.6776406896704,-432.53192245965477],[-249.61758067591953,-432.3823957490527],[-247.64728067591952,-428.25019574905275],[-247.58533249189395,-428.13566376288145],[-243.70913249189397,-421.76636376288144],[-243.70737721919664,-421.7634880600445],[-242.49487721919664,-419.78288806004446],[-240.2822652736829,-416.1736156186772],[-240.2044025690732,-416.0606695472129],[-235.5511025690732,-410.0298695472129],[-235.35402497399252,-409.8258925313012],[-229.81702497399252,-405.24129253130116],[-229.64168534160024,-405.1192569545984],[-222.57298534160023,-401.02975695459844],[-222.16556828828087,-400.8791906219223],[-215.53663747332303,-399.64891927825784],[-188.22819178889011,-385.59239582525436],[-184.6221461609055,-383.6896321733874],[-184.39356373635644,-383.59597029621193],[-176.77986373635645,-381.3053702962119],[-176.70649298238803,-381.28565109058786],[-163.20439298238801,-378.0832510905879],[-163.0331129738983,-378.0769922438336],[-162.86393901478186,-378.04949340698573],[-153.66043901478187,-378.3736934069857],[-153.4740796790387,-378.3939938736164],[-117.46947967903873,-385.0125938736164],[-117.46467577403567,-385.01348644082526],[-106.53218906217442,-387.066340476094],[-87.85138701534297,-387.8743832222634],[-82.58238151547766,-388.0808170212744],[-81.27737455489432,-388.1233802638782],[-81.2754838215993,-388.12344332951443],[-60.69895740353793,-388.8249987466744],[-56.504233277315436,-388.92093463009144],[-56.50219721952993,-388.9213882567006],[-56.500141411130066,-388.92103475955753],[-48.84774141113007,-389.12053475955753],[-48.59467870418663,-389.15255727876576],[-42.419278704186624,-390.57035727876575],[-42.227111824392665,-390.6307381078518],[-29.237711824392665,-395.8672381078518],[-29.13804681635602,-395.91246162355156],[-23.271633703359264,-398.8830878229369],[-23.23297651533276,-398.85982888581816],[-22.492124508045734,-398.748656560127],[-8.599824508045733,-399.407656560127],[-8.550314905811707,-399.4106464969061],[-3.403514905811707,-399.78824649690614],[-3.0699806258265747,-399.84253405574856],[6.256019374173426,-402.21853405574853],[6.33544683003391,-402.24059609564586],[7.589199426748482,-402.618014603518],[14.356952235938426,-404.3683623826595],[14.36235117603991,-404.3709666032394],[14.368333543211078,-404.37134316941024],[22.469105186229605,-406.5194945708067],[32.422984935979116,-407.2395603899528],[41.20476455652893,-407.3231945231447],[50.499387641634186,-406.09269205611633],[54.21780899765806,-403.2932972192117],[54.426506729006896,-403.15647934034996],[55.319706729006896,-402.65067934034994],[60.776367027908464,-399.5608577267786],[64.02175994473143,-397.5029654495442],[64.49523218357496,-397.1227646544729],[64.71867176610375,-396.83574178238206],[66.71860679070468,-393.46899916979294],[68.52486854037335,-390.04390138539264],[69.43437938527372,-388.0554686626792],[69.52245978465727,-387.8857848434785],[72.55420311087227,-382.6948620852463],[73.71765230990576,-379.91592169322905],[73.79076388418291,-379.7610669443761],[75.28386388418292,-376.93266694437614],[75.32109624834078,-376.8654321252631],[78.72319624834077,-371.0019321252631],[79.11430043504362,-370.5251816516261],[79.63636427801409,-370.1970005387745],[85.32486427801409,-367.79250053877445],[85.61096774446435,-367.69727247872675],[98.17146774446435,-364.58747247872674],[98.20185889439408,-364.580210003961],[101.07588298229709,-363.9180886013824],[100.16150189401067,-361.627261557543],[100.04921870182567,-361.2213605045954],[98.65931870182567,-352.6078605045954],[98.635780734315,-352.24063993212326],[98.88954833423522,-344.3041279609924],[98.87675332071223,-336.70418748679174],[98.70416604763817,-331.47432719640204],[98.52863794571894,-327.92806776263006],[98.21680877488863,-326.4582276615052],[97.10134260751435,-324.36102897611056],[95.43960315229707,-321.7426003985787],[93.47176060806139,-319.65559861958957],[88.99963931706647,-316.0089039828949],[88.84456196825994,-315.86766551533196],[87.39666196825995,-314.39646551533195],[87.19939197534607,-314.1609868133539],[85.26769197534607,-311.4393868133539],[85.19478411226677,-311.3287687626124],[82.72788411226678,-307.2891687626124],[82.49149043758067,-306.70170593030116],[81.53689043758067,-302.37000593030115],[81.49751380251543,-302.1035156667863],[80.56797554433344,-289.9746459252243],[79.08767606552448,-290.0682487180464],[79.08349124252736,-290.06850645359884],[53.11439124252736,-291.6252064535989],[52.94228654680861,-291.62393142403323],[51.60995945551047,-291.5242353817122],[49.97488837750765,-291.64853107061185],[47.35981150322573,-297.1703313038969],[43.002008382438866,-307.9213222295428],[42.983406783195925,-307.9636561712525],[39.784621179164546,-314.70731175177366],[38.03319282092851,-318.8003225927108],[37.995748367574166,-318.8764049085247],[35.06388168738648,-324.11324995680144],[37.446141142400066,-325.2395598910914],[37.45459146003671,-325.2458252097411],[37.46472670655351,-325.2486428087167],[41.132159400166714,-327.1000663421815],[46.84203374884284,-329.8068192512965],[48.729610873403445,-330.6090345687146],[48.98754853381374,-330.7848252445982],[49.15857967970573,-331.04594312127546],[49.21666636951858,-331.3526353690616],[49.15296543128541,-331.65821087340345],[48.9771747554018,-331.9161485338137],[48.71605687872457,-332.08717967970574],[48.40936463093839,-332.1452663695186],[48.10378912659655,-332.0815654312854],[46.20118912659655,-331.2729654312854],[46.17141631915088,-331.2595885770848],[40.43781631915088,-328.5415885770848],[40.429706984236844,-328.5355631577494],[40.41997329344649,-328.5328571912833],[36.75290735440641,-326.6816188058783],[34.29603773913873,-325.5200338873643],[31.82258678054741,-330.1847698585044],[31.777360688092116,-330.25981935926666],[29.587760688092118,-333.48011935926667],[29.51959948707266,-333.5668417493],[24.15679948707266,-339.4979417493],[24.08784972506095,-339.56551297443735],[23.168749725060948,-340.3634129744373],[23.12219403564016,-340.40087407265224],[13.834894035640158,-347.3187740726523],[13.827819431274634,-347.3239836293029],[5.3080194312746345,-353.5258836293029],[5.288687638804187,-353.5395232824538],[-4.137412361195813,-359.9835232824538],[-4.231138316452415,-360.0386463491523],[-10.42779788146922,-363.1368766189007],[-11.09822629755517,-363.54643384650393],[-13.906502429802657,-365.26677418657056],[-18.057173997383416,-367.80782248244134],[-19.10286552002785,-368.9959436011954],[-19.350843364846476,-369.18552521123354],[-19.65249476143337,-369.26577876768266],[-19.961896019134894,-369.2244863940736],[-20.231943601195383,-369.06793447997217],[-20.421525211233547,-368.8199566351535],[-20.501778767682655,-368.51830523856665],[-20.460486394073627,-368.2089039808651],[-20.303934479972146,-367.9388563988046],[-19.178434479972147,-366.6600563988046],[-18.995601657696575,-366.5063058367848],[-14.742199622585785,-363.90236581105813],[-11.933597570197344,-362.18182581342944],[-11.932749512340186,-362.18130702050127],[-11.232949512340184,-361.7538070205013],[-11.173661683547584,-361.7209536508477],[-4.995402050750701,-358.63192305172294],[4.375945609105194,-352.2253535988091],[12.882628963233383,-346.03300172506],[22.142428093403772,-339.1355865018406],[23.002433137063115,-338.3889887166858],[28.29572349345478,-332.5347643501618],[30.429568152630083,-329.3964651375466],[33.24041321945259,-324.09543014149557],[33.249151632425836,-324.07939509147525],[36.57891044779116,-318.13184260485076],[38.319707179071486,-314.06367740728916],[38.33239321680407,-314.03554382874745],[41.52788042972924,-307.29884189137204],[45.88559161756113,-296.54807777045716],[45.90398375851475,-296.50618575592046],[48.53899383931263,-290.94229605846994],[48.48995119248774,-290.76661164687914],[48.420903345736804,-290.5728169365506],[48.42319240737198,-290.5274630967722],[48.41098248951192,-290.4837237724556],[48.43570805043944,-290.27948704331743],[48.44607818298499,-290.0740206099437],[52.02257123763213,-275.8766627123488],[55.465185284116494,-257.64474412350074],[55.88865538976616,-251.76358502551017],[55.85973740118077,-242.5597146928623],[55.695521397516394,-233.73170606278055],[55.696731470837605,-233.64738127367903],[55.804981192276124,-231.3604083723023],[55.84360460289199,-216.95836730684323],[55.84361656577503,-216.95528784907737],[55.88807935526647,-208.21598885792957],[53.991671043273485,-199.74991509422952],[46.50154831644684,-179.9158081891776],[43.84590370106451,-173.29501316216405],[43.4361663685327,-172.27202104077256],[43.38936934596772,-172.13240236930565],[42.04786934596772,-167.20590236930565],[42.025077281105204,-167.10683829335102],[41.509077281105206,-164.37103829335103],[41.490166605773105,-164.22518840225035],[41.00081266718229,-157.38871353661096],[39.9185964887259,-150.6804059792025],[37.06589527890852,-140.50046206802676],[34.6619047683398,-134.96573199789296],[31.89505896743021,-129.33296617396218],[23.085999396628743,-113.26051853736983],[20.6002215048789,-108.72731053262387],[15.330890777225747,-101.31978012655027],[12.14515552468468,-98.25743903845597],[9.852954511849898,-96.72447017604009],[5.260392149893846,-93.65462031602915],[-5.173106182972291,-88.52319958403253],[-5.24197358652042,-88.48668409800206],[-15.07427358652042,-82.88328409800205],[-15.165864264521744,-82.82583106523316],[-23.172964264521745,-77.31863106523315],[-23.203357776722918,-77.2970683341013],[-29.80125777672292,-72.4702683341013],[-30.01664086149203,-72.271037770277],[-35.89224086149203,-65.427937770277],[-35.93314873803221,-65.3777819200718],[-42.62037324846517,-56.74188391938583],[-45.06823099117801,-54.24935857326279],[-47.79809508462203,-53.09519321573599],[-58.963873415293065,-51.80189932801709],[-59.231890911981885,-51.74115739040703],[-66.09406062586669,-49.387426790674205],[-67.38665911116448,-48.97493536683827],[-73.23564518620138,-47.112414006915984],[-76.56643665617466,-46.700213379943094],[-79.81614292680077,-46.47347735230237],[-81.49947809282561,-47.452335900234964],[-84.42334096394097,-49.552693345910676],[-85.56603013489293,-52.496749035438235],[-85.655659423828,-52.6819652355168],[-87.509859423828,-55.8381652355168],[-87.81697506988544,-56.191772073316415],[-92.16081308674104,-59.64493745082314],[-94.94953437718102,-62.236615033672834],[-95.03015219239444,-62.305537582391736],[-99.90498354786816,-66.13526264603813],[-102.02274217262992,-67.82755329316855],[-102.19300991236166,-67.94250942488068],[-104.94060991236167,-69.49210942488068],[-105.30438303256348,-69.62946435187254],[-107.52618303256348,-70.09966435187253],[-107.68967616649316,-70.12336744128918],[-110.75922821385144,-70.36759992004407],[-113.04443480992852,-71.89585620676297],[-115.62167577144028,-75.46389046712139],[-115.72875813808365,-75.59331515132078],[-119.14385813808364,-79.20901515132078],[-119.17433877805409,-79.2402042779535],[-124.90153877805409,-84.9042042779535],[-125.41660798583722,-85.21482976085245],[-127.70940798583723,-85.93792976085246],[-127.96303399735137,-85.99044112930275],[-134.90273399735136,-86.70644112930275],[-135.02249263834977,-86.71314736968186],[-142.4877926383498,-86.78084736968187],[-142.75919165197075,-86.75425880639436],[-151.26619165197076,-84.99095880639436],[-151.43230192489855,-84.94466567773577],[-159.92310192489853,-81.94876567773576],[-160.12423914860506,-81.85759511429912],[-165.88043914860506,-78.62309511429912],[-166.1887227356537,-78.38102571498513],[-169.1958797766947,-75.16223471131846],[-173.22621751419516,-71.00438785610399],[-178.2028440986332,-67.89350005945472],[-180.54692061806293,-66.61114709502398],[-180.55944964479852,-66.60420157832147],[-182.68924330554674,-65.40791258942761],[-186.54087203869705,-64.47048649499726],[-194.68294554953113,-64.27854981468],[-207.55532520815447,-64.57705597202097],[-207.6028724930492,-64.57727521813348],[-220.04062784159353,-64.40359133640416],[-221.72500119555122,-65.26028292402523],[-223.032719531432,-67.06379976644395],[-223.9339253054052,-69.88175188150613],[-225.50870694099865,-78.79851457321874],[-225.53169436399256,-78.90297766791663],[-227.70189436399255,-87.11397766791663],[-227.7199017986295,-87.1757754773113],[-230.3030017986295,-95.2762754773113],[-230.3142744387327,-95.31000027579297],[-231.98204653002568,-100.07820556692147],[-233.64351854861468,-106.24889100323091],[-233.9352583307851,-106.78028034582964],[-236.0152583307851,-109.05298034582964],[-236.3456151162225,-109.3119853584647],[-238.8028151162225,-110.6549853584647],[-239.34068917237673,-110.80954111387402],[-245.02918917237673,-111.14794111387401],[-245.6664426664192,-111.0205941365422],[-249.75544266641919,-109.0256941365422],[-250.1686508766464,-108.7052671614004],[-257.9543716497421,-99.56417967564241],[-259.5522928461057,-98.1827304814358],[-260.19201097314,-97.70384359033709],[-260.87606961044,-97.3826205932862],[-262.5928588412438,-96.98549047382542],[-263.3279363133774,-97.05063995116038],[-264.0883059067367,-97.24923622106556],[-265.2829498765972,-97.75609059406997],[-266.4681555869972,-98.62895589751831],[-266.4844643518399,-98.64077002688434],[-268.3397578867544,-99.9626235196896],[-275.01926159866105,-106.45627482814473],[-275.1705464725126,-106.55430166497223],[-275.31009578155755,-106.66841723857972],[-279.1249957815576,-108.69891723857972],[-279.35673258462924,-108.7944574664235],[-283.40703258462923,-110.0162574664235],[-283.6693895975146,-110.06629381712278],[-287.86158959751464,-110.41899381712278],[-288.2687626706081,-110.38788031918534],[-292.5742189767613,-109.35037947941419],[-294.6173653848549,-109.09736834468586],[-296.87502577670784,-110.0095955161288],[-299.30536215577064,-111.80161859118078],[-299.37042570153164,-111.84655884589542],[-301.8587096742264,-113.45404047646808],[-303.9605193695537,-114.9290415685609],[-304.3921438438962,-115.12476006725598],[-310.29994384389613,-116.56746006725598],[-310.53917116168964,-116.6023774578715],[-317.18217116168967,-116.9371774578715],[-317.5343299433018,-116.90604154826863],[-324.09672994330185,-115.39214154826864],[-324.22656412764945,-115.35487528871477],[-330.2343641276494,-113.28157528871476],[-330.43606039781605,-113.19183058327145],[-334.05746039781604,-111.18993058327145],[-334.35823156244004,-110.95961118889143],[-337.07343156244,-108.15251118889144],[-337.24585542710224,-107.92963908415837],[-339.1098554271023,-104.87683908415836],[-339.2325860237641,-104.61194789275646],[-340.8287860237641,-99.78864789275646],[-340.88286962561557,-99.55189231387752],[-342.1439581609299,-89.87392520911865],[-343.13034095976275,-88.12330886406251],[-344.1794043300517,-86.97608846639581],[-346.09985597995023,-85.93558146591798],[-358.48435578828133,-81.50159165740973],[-358.57403557974374,-81.46560979275907],[-360.7797355797437,-80.48240979275907],[-360.83248139615046,-80.45744166218716],[-373.50258139615045,-74.10234166218717],[-373.5883650071431,-74.05512391639114],[-380.05086500714316,-70.16872391639113],[-380.2794087210165,-69.99347525078537],[-389.6099962973999,-61.001686385358084],[-394.4964193976188,-58.29796103942964],[-399.3361683934061,-59.131192235014744],[-404.3229893406788,-60.27395984742898],[-404.6741257268729,-60.30463704653894],[-412.0040257268729,-59.93063704653894],[-412.214467522919,-59.90226296617448],[-421.32742815161515,-57.89248559600232],[-426.95442201094716,-57.36766940572188],[-430.7685662913115,-58.066534934549225],[-444.70701017305174,-62.38974450844905],[-444.81405946722055,-62.41793559572697],[-451.3819605512198,-63.84700830010099],[-454.637838663015,-64.72083688572533],[-456.70728667271726,-65.87024982365197],[-460.19557992932624,-68.60978401734674],[-465.32493451983254,-75.85650327345479],[-465.6346652368138,-76.16491406942929],[-468.6208652368138,-78.25951406942929],[-468.81637370737184,-78.37233742920736],[-476.99877508002805,-82.17562710204874],[-482.08560803757223,-85.733954663082],[-482.08965881795604,-85.73677663540916],[-490.3281092672157,-91.45251902391402],[-492.7530028894798,-95.0515932335984],[-493.3760857715411,-99.28354712000085],[-492.5896131195658,-103.50887263364184],[-492.5687386401546,-103.78657842230963],[-492.8106386401546,-110.90397842230963],[-492.8358563635407,-111.11696551007081],[-494.1515563635407,-117.5503655100708],[-494.2485715569679,-117.84133509388302],[-500.0132752413023,-130.0252929784906],[-501.01997869051434,-135.9411270781755],[-500.72177401032354,-145.37627595022636],[-500.36521704117575,-149.9474992478321],[-497.66508388994436,-160.390278116359],[-496.16526044657456,-163.18212536439984],[-494.1171585996906,-164.31638383553806],[-489.5311985245138,-166.62777458910898],[-489.33758606464323,-166.74808769552843],[-486.33208606464325,-169.01008769552843],[-486.152825305143,-169.17381977408036],[-485.34347160505916,-170.0679686233698],[-484.7695179106539,-170.701917477469],[-484.51481575016516,-171.12535685067985],[-483.1313157501652,-174.94765685067983],[-483.1094760213635,-175.01352158989107],[-479.6492760213635,-186.48042158989108],[-479.0639009093768,-188.4263829069516],[-475.9604094797047,-191.16778090286206],[-469.8248586523408,-194.93185363970463],[-469.53386816447096,-195.17663599528905],[-469.3276299302587,-195.4961037657843],[-468.6375299302587,-197.0243037657843],[-468.5666424294451,-197.22384052943204],[-464.0066939814786,-214.46625285285091],[-456.4514926470245,-221.8606187454325],[-456.25079787584286,-222.1142046099351],[-450.8262146860611,-231.10603181865827],[-449.16849596731316,-232.50474275089084],[-442.2193371053744,-236.1661719050743],[-441.96241094570894,-236.34477311508084],[-438.46351094570895,-239.47597311508085],[-438.21172379769666,-239.78439822483858],[-430.5166823498977,-252.96365495992794],[-427.99466331550474,-257.0201662581955],[-420.26795502242976,-269.45254047202474],[-420.0926056912886,-269.91723052241764],[-419.2735056912886,-274.81893052241765],[-419.2605122026433,-274.9225180704484],[-418.97351220264335,-278.3315180704484],[-418.99788656295834,-278.5475378762095],[-419.01111154448466,-278.764525815472],[-419.02576108118507,-278.79457812404394],[-419.0295096446795,-278.82780008135796],[-419.1346958180202,-279.01804869465093],[-419.2299517971489,-279.21345842921363],[-419.25498672486196,-279.2356170070209],[-419.2711634386056,-279.2648755802688],[-419.4411477835959,-279.4003893743274],[-419.6039329010022,-279.5444715434971],[-423.0351329010022,-281.5464715434971],[-423.375790437463,-281.6841758415718],[-425.907190437463,-282.3039758415718],[-426.5973096720787,-282.2812031949425],[-431.4216096720788,-280.7566031949425],[-431.44551697113667,-280.74878872220233],[-437.8794919971295,-278.57554730066954],[-442.45102822673374,-277.3710848278131],[-449.1020662075471,-278.0696779312845],[-450.5278785080222,-278.71040719847355],[-450.53310000000005,-278.7313633259671],[-450.53310000000005,-280.8302980495022],[-449.3888695883796,-300.0329522072728],[-447.8221141192913,-305.71657047184186],[-443.2968691350463,-319.05393516291014],[-443.22933549610264,-319.43589543610557],[-442.9258735727889,-332.68739622446526],[-440.1969259783113,-344.73535504121077],[-438.76660524136804,-349.16194089650344],[-438.71814578865303,-349.74122487868226],[-441.16279267115755,-366.41122278941106],[-440.85599017720796,-378.8339977625156],[-440.8599042540516,-378.97048261900454],[-441.53380425405163,-387.16718261900456],[-441.5370045701872,-387.2007029663901],[-441.8950045701872,-390.4922029663901],[-441.91876073175706,-390.63495874510323],[-442.38636073175707,-392.7117587451033],[-442.40827705174775,-392.76112548267764],[-442.41412724726405,-392.81482068798596],[-442.5089426132067,-392.9878757015757],[-442.5890101422428,-393.16822863928775],[-442.6281500142898,-393.2054505451608],[-442.6541031556574,-393.25281967343886],[-442.8079264182077,-393.37641738881285],[-442.9509172507439,-393.51240125976096],[-443.00132198413195,-393.53181163618086],[-443.0434269408434,-393.5656431670506],[-445.2781269408434,-394.7305431670506],[-445.8678126011002,-394.8754984571263],[-448.1220126011002,-394.8789984571263],[-448.5801795771707,-394.79495158487805],[-448.9779325917242,-394.55251933844636],[-449.8808325917242,-393.74391933844635],[-449.9528743870108,-393.6741258820471],[-451.2685743870108,-392.2955258820472],[-451.49785042478237,-391.9629773362904],[-452.72325042478235,-389.39457733629035],[-452.7297482581804,-389.36900348118854],[-452.7446672056,-389.34723954515835],[-456.38866720560003,-380.83703954515835],[-456.4137683477393,-380.7182367209383],[-456.462380663177,-380.6069666837893],[-456.68837000996746,-379.57480051440916],[-458.09732335089956,-376.96063359932344],[-465.79230008727404,-368.60797497120603],[-466.08244313594867,-368.08955742689216],[-466.84024313594864,-365.41435742689214],[-466.8629258121124,-365.3210731054533],[-467.4240258121124,-362.5674731054533],[-467.44977409581446,-362.3037566564592],[-467.43054022246764,-359.2805685123184],[-467.62634127470176,-353.59636541840774],[-467.6211281634055,-353.4288000451435],[-467.0762281634055,-347.8076000451435],[-467.0739044893391,-347.7856087913487],[-466.92376887148265,-346.4733086117872],[-466.6795417901824,-343.87673929393145],[-466.950401145339,-341.5345600150792],[-468.51934247723983,-336.46113776203526],[-472.73402645954366,-329.00422262706326],[-472.8702537364805,-328.6473750028385],[-474.32751867796554,-321.9713493643512],[-475.7972658692737,-317.3999977702246],[-479.8093959646201,-312.22762418876044],[-479.96399201888937,-311.9711744378271],[-482.7340920188894,-305.8547744378271],[-482.83887972605385,-305.48005869016976],[-484.20905019725143,-294.12638284624967],[-484.84265180285763,-292.02010050539855],[-486.111567301034,-289.22330716247933],[-487.97922026104476,-287.15704437479445],[-497.57423351806295,-279.5851930302778],[-506.5635337737442,-272.71245629635746],[-506.7630887379514,-272.52257823787335],[-516.8823887379514,-260.56767823787334],[-516.9221543495134,-260.5182670985487],[-519.9051543495135,-256.6176670985487],[-520.0911482518391,-256.2780459358165],[-522.406448251839,-249.91944593581653],[-522.4166797017402,-249.89025450231915],[-523.558178019307,-246.5028562451179],[-524.8118746039514,-242.78861688434526],[-526.1169534137075,-239.15239936651204],[-526.1493379930364,-239.04846550227654],[-529.1645379930364,-227.69196550227653],[-529.178674484714,-227.6331519310218],[-531.778583275956,-215.5687119667431],[-536.3572858651653,-196.07791279750091],[-537.1862861730558,-194.63580168720975],[-539.0477103995563,-193.43356103087206],[-547.1661300784101,-189.5320928916112],[-547.370327429628,-189.40936286209353],[-549.4471274296279,-187.88116286209353],[-549.6374259769542,-187.7092340448792],[-553.7877259769542,-183.1246340448792],[-553.9543487368898,-182.89325517254593],[-556.9888487368897,-177.49995517254592],[-557.1271528166521,-177.12969680295905],[-559.6108859356407,-165.0307284736922],[-560.8514583882579,-161.60305745617094],[-563.8675418316003,-158.93894629605538],[-575.3788365761252,-155.19875402284922],[-575.7481586685776,-155.00774848716298],[-586.4800842282262,-147.01006894898188],[-592.7716807169702,-143.7061318876993],[-602.2303053326775,-140.78074942913435],[-602.2384307616614,-140.7782067411901],[-608.3783307616615,-138.83440674119012],[-608.8159142557354,-138.59367403967028],[-609.1280642731749,-138.2038100704714],[-609.2672588034719,-137.72416808877836],[-609.2123067411901,-137.22776923833854],[-608.9715740396703,-136.79018574426456],[-608.5817100704713,-136.47803572682503],[-608.1020680887783,-136.33884119652808],[-607.6056692383385,-136.3937932588099],[-601.4698277246039,-138.33630840309516],[-591.9026946673224,-141.29525057086565],[-591.6857927456886,-141.38485362084586],[-585.2007927456885,-144.79035362084585],[-585.0310413314223,-144.89725151283702],[-574.3873822534799,-152.82915282410764],[-562.8237634238748,-156.58634597715078],[-562.3719127527744,-156.84435915690023],[-558.9117127527744,-159.90075915690022],[-558.5555056732193,-160.42448469202614],[-557.1721056732193,-164.24678469202615],[-557.1218471833479,-164.42500319704095],[-554.6596697114617,-176.4189678567854],[-551.7935965887584,-181.5129181526086],[-547.826067778798,-185.8956212300114],[-545.9494355260856,-187.27652907313308],[-537.8663699215899,-191.1610071083888],[-537.7263385707444,-191.2394682467132],[-535.5367385707443,-192.6536682467132],[-535.1214889182489,-193.0909804791834],[-534.044388918249,-194.9646804791834],[-533.9080210866501,-195.30987599738867],[-529.2837210866502,-214.99477599738867],[-529.2785255152861,-215.01784806897817],[-526.682498732428,-227.06427422552366],[-523.6890424357514,-238.338878375566],[-522.3982465862924,-241.93530063348797],[-522.390223813234,-241.95834206272093],[-521.132523813234,-245.6844420627209],[-519.9956596499175,-249.05808796298334],[-517.7526648293104,-255.21811338790116],[-514.9079161756018,-258.9379345741752],[-504.8986136602275,-270.7628839917286],[-496.01156622625575,-277.55744370364255],[-495.99605913184996,-277.5694891821753],[-486.30885913185,-285.2140891821753],[-486.1522175339614,-285.36059169863506],[-484.07871753396137,-287.65459169863504],[-483.86266157105575,-287.9840455276086],[-482.47596157105573,-291.0404455276086],[-482.4158576915732,-291.2005781626584],[-481.7257576915732,-293.49467816265843],[-481.6807202739462,-293.7100413098303],[-480.3209030803235,-304.9779265459549],[-477.69420385942016,-310.77769663177617],[-473.6363040353799,-316.0090758112396],[-473.4291332798562,-316.4018154309343],[-471.87153327985624,-321.24641543093423],[-471.83954626351954,-321.3652249971615],[-470.41033671426607,-327.91272320559557],[-466.22287354045636,-335.3214773729367],[-466.11433853447255,-335.57313358672667],[-464.46963853447255,-340.89153358672667],[-464.42097418244117,-341.12265546497287],[-464.1210741824412,-343.71595546497286],[-464.1182246796405,-343.98286468561895],[-464.3762246796405,-346.72586468561894],[-464.3788955106609,-346.7514912086513],[-464.52923868815424,-348.0656056182578],[-465.0649668102605,-353.59218833065245],[-464.87115872529824,-359.2185345815923],[-464.87042590418554,-359.2707433435408],[-464.8889784834139,-362.18684539720005],[-464.3640651692774,-364.7628591234632],[-463.7025867472035,-367.09802285364543],[-456.105499912726,-375.344425028794],[-455.92013547634355,-375.60440953553575],[-454.34963547634356,-378.51830953553576],[-454.226019336823,-378.8518333162107],[-453.98757114646685,-379.94090303888123],[-450.4015607076169,-388.31567417957837],[-449.27541945627945,-390.67603095282414],[-448.13557814514627,-391.8703649434969],[-447.63547137543503,-392.31823993960774],[-446.1843272440775,-392.315986810134],[-444.75339183047936,-391.570071625411],[-444.4321588633645,-390.1433465909711],[-444.083816060681,-386.9406361579187],[-443.41689777232756,-378.82885527923276],[-443.7247098227921,-366.36520223748437],[-443.711554211347,-366.1478751213177],[-441.2943585611697,-349.6650666115681],[-442.65059475863194,-345.4677591034966],[-442.68097629432106,-345.3569660300976],[-445.4509762943211,-333.12776603009763],[-445.4822645038974,-332.87430456389444],[-445.7841724900784,-319.69066072086355],[-450.25833086495373,-306.50386483708985],[-450.2801739358211,-306.4327592652188],[-451.8925739358211,-300.5835592652188],[-451.9363336353255,-300.3195364377798],[-453.09083363532557,-280.9445364377798],[-453.0931,-280.8684],[-453.0931,-278.5743],[-453.0551266155821,-278.26483289967143],[-452.86162661558205,-277.48823289967146],[-452.6016217019854,-276.976704642626],[-452.1442632045902,-276.63016904891174],[-449.9643632045902,-275.65056904891173],[-449.57340951098763,-275.5451028410592],[-442.48530951098763,-274.8006028410592],[-442.02548734442814,-274.8358397098485],[-437.1850873444281,-276.11113970984854],[-437.10158302886333,-276.13621127779766],[-430.63819828788763,-278.3193865909819],[-426.16776056801046,-279.73215722044625],[-424.16492408106353,-279.2417732216275],[-421.59230636616695,-277.7407296610006],[-421.8071050120098,-275.18934086769593],[-422.57587070554325,-270.58885399186545],[-430.16879083794254,-258.3717466393411],[-432.70013668449525,-254.30023374180453],[-432.7184762023033,-254.26980177516143],[-440.3208622953328,-241.24923537548761],[-443.5521235091417,-238.357547955819],[-450.4845628946256,-234.7049280949257],[-450.71333851257464,-234.55078996823977],[-452.63853851257466,-232.9263899682398],[-452.90910212415713,-232.60929539006491],[-458.3586013474721,-223.576167189096],[-466.04930735297546,-216.0491812545675],[-466.3914575705549,-215.46165947056795],[-471.0143946983252,-197.98106972008452],[-471.49886419631116,-196.90823058543415],[-477.39384134765913,-193.29174636029538],[-477.5719010038206,-193.1600286917026],[-481.0320010038206,-190.10362869170257],[-481.4103423084268,-189.5130218373416],[-482.1002833712466,-187.21945019234113],[-485.5502971050087,-175.78630688164316],[-486.83628327568533,-172.2334157069576],[-487.24128208934604,-171.786082522531],[-487.96894334079303,-170.9821849662261],[-490.7855855765098,-168.86232313385503],[-495.29160147548623,-166.59122541089104],[-495.3356284593312,-166.56795028195023],[-497.7348284593312,-165.2392502819502],[-498.24228900935856,-164.72525822402488],[-499.99328900935853,-161.46585822402488],[-500.1049448885536,-161.1805248838556],[-502.8718448885536,-150.47952488385562],[-502.90872388403517,-150.25863809619997],[-503.27632388403515,-145.5458380962],[-503.27956116875436,-145.48673513179818],[-503.58276116875436,-135.8935351317982],[-503.565259812812,-135.63836804427336],[-502.507459812812,-129.42226804427335],[-502.40262844303214,-129.08956490611698],[-496.62869322922666,-116.88609577297957],[-495.3655059205826,-110.70946794640014],[-495.13201939106733,-103.83961666416809],[-495.9318868804342,-99.54232736635815],[-495.9292933380457,-99.3318652265996],[-495.9374562929053,-99.16928575909981],[-497.28949616087544,-97.8051634955911],[-497.3853315454409,-97.68816376663655],[-498.69453154544095,-95.73966376663654],[-498.82698125391545,-95.36845073155932],[-499.15918125391545,-91.83825073155933],[-499.1345065129975,-91.55278941476828],[-499.01082707817204,-91.29433167426767],[-494.68312707817205,-85.31333167426767],[-494.6716519800441,-85.29786810973472],[-489.2153519800441,-78.12706810973472],[-489.11645365681545,-78.01919855260884],[-486.76235365681543,-75.88189855260883],[-486.67037293125503,-75.80990601857286],[-479.8549679063183,-71.23644432751655],[-476.03422454195885,-66.91060867975877],[-473.79126238638423,-59.10807821192571],[-473.67803511208746,-58.87068686777314],[-470.86603511208745,-54.84888686777314],[-470.78989323810805,-54.7557679637709],[-465.1110932381081,-48.789067963770904],[-465.0898661621926,-48.767591368170834],[-463.2200987370038,-46.945929657210606],[-460.09121495914326,-42.832196925457616],[-458.9814659814755,-39.806800650689965],[-458.8277812950677,-39.5501951341106],[-455.67068129506777,-36.005795134110606],[-455.6543103785183,-35.987966422143515],[-451.9111376868086,-32.0332666728638],[-450.44776020289805,-28.41540970378137],[-449.64978749388905,-22.559421759795704],[-450.0554861103558,-20.900997809277513],[-450.0730697979993,-20.803094968125368],[-450.3255848628256,-18.626554321303743],[-452.5038918878507,-11.667335037620013],[-455.7139068504009,-4.043649043084154],[-455.758977355511,-3.900190040372623],[-458.18718361718874,7.476378223264311],[-459.3847560887839,12.17179715721072],[-459.76472629869863,13.285220883547115],[-459.8035190614472,13.462897784261822],[-460.1582190614472,16.96109778426182],[-460.159173742628,17.1124557733669],[-459.67512129682854,22.571722097004166],[-460.0126511764045,26.52644867702471],[-463.96242189862846,29.015093063522805],[-466.92401639881757,29.92949576050466],[-470.53799957122123,29.022179390048432],[-470.6797056258889,28.999863827280578],[-478.1773056258889,28.501163827280575],[-478.4125768646026,28.520418876991513],[-481.55027686460267,29.254218876991516],[-481.76852944084857,29.3406277922832],[-485.21262944084856,31.331927792283203],[-485.35641955918027,31.43813401240725],[-487.09131955918025,33.048334012407246],[-487.2063520522561,33.181503870718075],[-488.0634520522561,34.428303870718075],[-488.1867001281337,34.715086210094185],[-488.19081965288416,35.02720354043869],[-488.075183466208,35.317138827557294],[-487.85739612928194,35.5407520522561],[-487.5706137899058,35.66400012813366],[-487.2584964595613,35.66811965288419],[-486.9685611724427,35.55248346620801],[-486.7449479477439,35.33469612928193],[-485.9379962551489,34.16084550470199],[-484.3339051548137,32.67205220839686],[-481.0703890032707,30.785161667306998],[-478.1644226306991,30.105556184248385],[-470.8577518281934,30.59155660160989],[-467.09660042877874,31.535820609951568],[-466.66579040977774,31.52429484124575],[-463.3893904097778,30.512694841245754],[-463.29701003732174,30.462727755244437],[-463.1989344431104,30.425150891102927],[-458.82293444311034,27.667950891102926],[-458.56606646630604,27.407099136693056],[-458.4522979222604,27.05913144613548],[-458.0749979222604,22.63843144613548],[-458.075226257372,22.499744226633098],[-458.5587120659542,17.04686858133018],[-458.2209137143243,13.71535971842722],[-457.86027370130137,12.658579116452884],[-457.84221607866425,12.59791162864792],[-456.63291607866427,7.85651162864792],[-456.62572264448903,7.825790040372623],[-454.2099865937105,-3.4923531183645795],[-451.0144931495991,-11.081550956915846],[-450.98832700919706,-11.153025122001514],[-448.77612700919707,-18.220525122001515],[-448.74493020200066,-18.36730503187463],[-448.4894729189655,-20.56920597760741],[-448.05951388964417,-22.326802190722486],[-448.0439255200391,-22.62491466946091],[-448.8759255200392,-28.73061466946091],[-448.9269717627226,-28.922579262071093],[-450.48457176272257,-32.77337926207109],[-450.64518962148173,-33.02333357785649],[-454.4839692916792,-37.07904306539712],[-457.53176072743383,-40.50072497755982],[-458.6305340185245,-43.49619934931003],[-458.7448527485016,-43.70500665668489],[-461.98255274850163,-47.961806656684885],[-462.06103383780743,-48.05050863182917],[-463.96251760138875,-49.9030706774958],[-469.5893256106475,-55.81514283162071],[-472.2903707139998,-59.678252076521844],[-474.5463376136158,-67.5260217880743],[-474.71559313323377,-67.83459569987568],[-478.72399313323376,-72.37289569987567],[-478.877827068745,-72.50759398142714],[-485.7302018382246,-77.10586413357655],[-487.9865432538177,-79.15440859113872],[-493.392517411379,-86.25906916497829],[-497.53799854940735,-91.98823770405158],[-497.2530686911146,-95.01611062923233],[-496.09963159856096,-96.73278659534961],[-495.65428411662083,-97.18211388924382],[-495.24334794160274,-94.3910519085684],[-495.03853885677324,-93.86228307097738],[-492.31683885677324,-89.82268307097738],[-491.98494118204394,-89.48622336459084],[-483.55096929325407,-83.63483044487658],[-478.3739919624278,-80.013445336918],[-478.1798262926282,-79.90156257079263],[-469.99817405507235,-76.09862110597247],[-467.2863214403834,-74.19645564929594],[-462.1774654801675,-66.97869672654521],[-461.9232853790604,-66.71153483301748],[-458.2083853790604,-63.79403483301749],[-458.03930708994244,-63.68171432665504],[-455.7432070899424,-62.40641432665503],[-455.45349093442417,-62.28914971149289],[-452.0158909344242,-61.366549711492894],[-451.9562405327795,-61.35206440427303],[-445.41247526765574,-59.928243277155055],[-431.45378982694825,-55.59875549155095],[-431.3052937600947,-55.562260529191654],[-427.2420937600947,-54.81776052919165],[-426.8925333587966,-54.80233120022143],[-421.0105333587966,-55.35093120022143],[-420.853732477081,-55.37543703382551],[-411.7671725238596,-57.379391984447295],[-404.72137467011953,-57.738895988226176],[-399.8738106593212,-56.62804015257102],[-399.8050750081117,-56.61425835812683],[-394.48747500811174,-55.69875835812683],[-394.0569698671135,-55.69810243863534],[-393.65059653942797,-55.840214455024075],[-388.22329653942796,-58.843214455024075],[-387.9547912789835,-59.04152474921464],[-378.6073423994163,-68.04956267473418],[-372.3110230968337,-71.83602539621305],[-359.7108068554866,-78.15607292822814],[-357.5759247514717,-79.1077055549079],[-345.14474421171866,-83.55840834259025],[-344.96643870296873,-83.638070677189],[-342.77043870296876,-84.82787067718901],[-342.43559535323277,-85.08951642681416],[-341.14239535323276,-86.50371642681417],[-340.97183574678365,-86.73916196331237],[-339.79163574678364,-88.83376196331237],[-339.6375303743844,-89.29670768612249],[-338.36009139351313,-99.1001529550363],[-336.84837601514016,-103.66816246794586],[-335.13481556207586,-106.47457735588294],[-332.65132303809673,-109.04212739420856],[-329.29450370869864,-110.8977679242583],[-323.45536842902476,-112.9128614985031],[-317.13277873530194,-114.37143893013284],[-310.7892986692677,-114.05173441017072],[-305.23370345651824,-112.69504372777904],[-303.3091806304463,-111.3444584314391],[-303.26847429846833,-111.31704115410459],[-300.7928004770804,-109.71770593560022],[-298.26413784422937,-107.85318140881921],[-297.9840295023754,-107.69661802492975],[-295.2688295023754,-106.59951802492975],[-294.63199393646124,-106.51600286846977],[-292.1875939364612,-106.81870286846977],[-292.0450373293919,-106.84461968081466],[-287.8701101335289,-107.85066646510113],[-284.01781338777965,-107.52656335403158],[-280.2166357457371,-106.37991277430969],[-276.67338662796243,-104.49400034314729],[-270.0542384013389,-98.05902517185527],[-269.90473564816006,-97.93432997311565],[-267.9781364999859,-96.56167288930438],[-266.6801444130028,-95.60574410248168],[-266.42103366140446,-95.45806798643389],[-265.00213366140446,-94.8560679864339],[-264.8256644600105,-94.79594501772971],[-263.8711644600105,-94.5466450177297],[-263.6607026760337,-94.51009788423343],[-262.61590267603367,-94.41749788423343],[-262.2144260725497,-94.44543031743153],[-260.1666260725497,-94.91913031743154],[-259.91103254220764,-95.00758418732897],[-258.98553254220764,-95.44218418732898],[-258.76252468987445,-95.57610713450528],[-257.9821246898744,-96.16030713450527],[-257.91207160165976,-96.21669424008098],[-256.2061716016598,-97.69149424008098],[-256.0688491233536,-97.8298328385996],[-248.39292421300308,-106.84201079675212],[-244.84587325153134,-108.57251017631681],[-239.77896024156928,-108.27108741766845],[-237.76009028161695,-107.16765979426947],[-236.03436975655066,-105.28206121863573],[-234.44178145138534,-99.3672089967691],[-234.41402556126732,-99.27739972420703],[-232.73659612585064,-94.48158382633599],[-230.16867907849397,-86.42869696864071],[-228.02038360368027,-78.30057322719051],[-226.43989305900135,-69.35148542678127],[-226.39857056878574,-69.18419857116622],[-225.40857056878576,-66.08859857116622],[-225.2256553230803,-65.72711800301859],[-223.6164553230803,-63.507818003018606],[-223.1604798298364,-63.118290135424786],[-220.9192798298364,-61.97839013542478],[-220.3211275069508,-61.839424781866526],[-207.59090318581744,-62.01719277242587],[-194.71237479184555,-61.71854402797903],[-194.6525343774283,-61.71855550436269],[-186.3423343774283,-61.91445550436269],[-186.06980430982225,-61.95040577747269],[-181.91300430982224,-62.962105777472686],[-181.5888503552015,-63.08979842167854],[-179.31199543521473,-64.36869060747463],[-176.9415793819371,-65.66545290497602],[-176.8774235403964,-65.70301081000235],[-171.7371235403964,-68.91621081000235],[-171.49652028583483,-69.11070579808259],[-167.3495202858348,-73.38890579808259],[-167.3332772643463,-73.40597428501486],[-164.45346617011953,-76.48845714701656],[-158.96678238973828,-79.57151171211908],[-150.66199052100404,-82.50178046883704],[-142.3738836073647,-84.21970910652604],[-135.10574396200454,-84.15379707968306],[-128.35524909749768,-83.45731822281795],[-126.48166910575641,-82.86643123222647],[-120.98996723623378,-77.43533062652455],[-117.64763846579457,-73.89667637473775],[-114.98492422855972,-70.21030953287861],[-114.6588579718333,-69.8958050504253],[-111.9049579718333,-68.05410505042529],[-111.29492383350684,-67.84213255871082],[-107.975236804166,-67.57799779918975],[-106.02685746972315,-67.16566187198882],[-103.5403515204538,-65.76331450738415],[-101.49895782737008,-64.13204670683146],[-101.49064780760555,-64.12546241760828],[-96.6533857144716,-60.32525220998735],[-93.86736562281897,-57.73608496632716],[-93.79252493011455,-57.67172792668358],[-89.59648457020211,-54.33605536310139],[-87.91522286938957,-51.474229141493936],[-86.67226986510707,-48.271850964561764],[-86.6084902724991,-48.171594027610766],[-86.56676356015382,-48.060336797208045],[-86.47575026106419,-47.962936267140186],[-86.40419814255684,-47.85046147793927],[-86.3069068136036,-47.782243539312034],[-86.22578005930286,-47.69542338280067],[-82.94298005930287,-45.33722338280067],[-82.83964031000475,-45.2702808779506],[-80.76294031000475,-44.06268087795059],[-80.40947060688949,-43.922477477888464],[-80.03040940054002,-43.89230420742808],[-76.35410940054003,-44.148804207428086],[-76.28599341561589,-44.15539055351608],[-72.80329341561588,-44.586390553516075],[-72.57211902115031,-44.637044222631744],[-66.60951902115032,-46.53574422263175],[-65.30266283127203,-46.95278527812955],[-65.27650908801812,-46.961442609592964],[-58.53203858205709,-49.27480227144387],[-47.32132658470694,-50.573300671982906],[-46.97014549981355,-50.665841514198284],[-43.83574549981355,-51.99104151419829],[-43.42095737388123,-52.27312324935937],[-40.74115737388123,-55.00182324935937],[-40.6423512619678,-55.115018079928205],[-33.92887096705352,-63.7848228645654],[-28.170558165731727,-70.49132268257975],[-21.70688202020702,-75.2199290602482],[-13.759716756530256,-80.68590657272094],[-4.008303928040889,-86.24320920213191],[6.466206182972291,-91.39480041596748],[6.612621764513319,-91.47924712220018],[11.275721764513317,-94.59624712220017],[13.662269192583436,-96.19231255450727],[13.837748824123462,-96.33350837475561],[17.191448824123466,-99.5573083747556],[17.34742619008889,-99.73814557633997],[22.729626190088887,-107.30434557633998],[22.808938137164912,-107.43086754565168],[25.330738137164914,-112.02976754565168],[34.15376304647869,-128.127695392337],[34.18017977921346,-128.17856388303207],[36.97287977921346,-133.86396388303208],[36.99803682323068,-133.91836124122753],[39.44883682323068,-139.5608612412275],[39.507321083282356,-139.72541357979142],[42.403221083282354,-150.05951357979143],[42.43436179072806,-150.20104005137364],[43.537161790728064,-157.03694005137365],[43.55023339422689,-157.14941159774966],[44.03837448973981,-163.9689425490478],[44.531295051561,-166.58237679910675],[45.840054273876554,-171.38864016752834],[46.22201503897012,-172.34228286894876],[48.8823962989355,-178.97488683783595],[48.89185940077984,-178.99919320716737],[56.41845940077984,-198.92989320716737],[56.470047170581296,-199.1023122846463],[58.4178471705813,-207.79781228464628],[58.44878343422497,-208.08411215092264],[58.403591267841996,-216.96677242923434],[58.36489539710801,-231.3958326931568],[58.36346852916239,-231.45291872632097],[58.255863265830676,-233.7262762741729],[58.4194786024836,-242.52199393721946],[58.419693682111756,-242.54177833939954],[58.448793682111756,-251.80357833939954],[58.44549466956559,-251.89952780157708],[58.013294669565596,-257.9019278015771],[57.994373855461475,-258.04749721791546],[54.530973855461475,-276.38949721791545],[54.51442181701501,-276.4646793900563],[51.36275309719067,-288.97564141523367],[51.51217622754443,-288.9642824895119],[51.70471345319139,-288.96416857596677],[53.04730406279653,-289.06463262200265],[78.92821613491915,-287.51321898723387],[80.29843537290057,-287.4265768250973],[79.47353074941196,-281.1617473782342],[79.46386577065286,-281.0721428006911],[78.88666577065285,-274.21484280069114],[78.88131739549219,-273.98003829123417],[79.17915982447954,-266.23299293802484],[73.91223857775928,-252.31254161956124],[73.88096193224882,-252.22329649184664],[71.20436193224883,-243.93749649184662],[71.11960582175702,-243.5246217979726],[69.9364774460005,-230.76872846310513],[68.78886586093667,-218.93533353537472],[68.78104691057554,-218.68364624195883],[68.91974691057554,-214.67264624195883],[68.97272096850813,-214.2863462252019],[69.78852096850812,-210.9235462252019],[69.86705883250755,-210.6749072287648],[71.51495883250756,-206.47500722876478],[71.54387423931861,-206.42992078762398],[71.55621896305304,-206.37780077494452],[72.49781896305304,-204.31880077494452],[72.61089255497733,-204.10750463236332],[73.9749252863338,-201.90163631790188],[74.91725354888159,-200.18729518648757],[75.7838213710997,-198.51720486447442],[82.14417969315411,-182.4359237739265],[88.99831399820441,-164.88917622688118],[91.38907944346909,-158.21158873871698],[93.02743593275639,-151.42053055397912],[92.96427926876804,-146.19989062766277],[92.26991821140714,-141.6965499872442],[90.28403829311041,-138.61113060580212],[82.49242778194667,-132.45435742803664],[82.47607057188256,-132.44128678423084],[76.85537057188256,-127.89948678423085],[76.71191982690037,-127.77116904593454],[72.79701982690037,-123.89896904593455],[72.70313861779864,-123.79924055670193],[69.19783861779865,-119.79884055670193],[69.01746975532204,-119.55703621341675],[66.82456975532203,-116.07673621341675],[66.71425590427174,-115.87603833304966],[64.98575590427174,-112.23193833304965],[64.84866206021071,-111.83644380440738],[64.11346206021071,-108.61614380440739],[64.06847479109098,-108.29916810449986],[63.871774791090985,-104.88296810449985],[63.88338265020509,-104.53480418414016],[64.2670826502051,-101.46060418414017],[64.35837382362108,-101.0690576236679],[66.6675619076346,-94.41338518001842],[67.08146541324757,-93.09428205502941],[67.09193560955457,-93.06192006428138],[69.50723560955457,-85.81632006428138],[69.52226566875885,-85.77296559897778],[76.06216566875885,-67.61266559897777],[82.42927132620143,-49.95616140261552],[82.79562805267243,-48.68441292247667],[82.83180214556286,-48.57196652379024],[90.88080214556285,-25.96246652379024],[90.8869914246984,-25.94533848678878],[96.54759840044312,-10.509772398055913],[97.69709336586983,-6.463942954043147],[97.44502900112265,-3.3740322367369586],[96.19695213252977,0.25969794753441],[94.16178417430845,2.9587455956318554],[91.19866457771302,5.202409810053126],[86.95939574171709,6.956014550238906],[81.260666952315,8.735460271986895],[60.717318774561214,12.365388563844467],[60.7005085253593,12.36843605400101],[47.3628085253593,14.84773605400101],[47.11583222356958,14.910857832247729],[42.60443222356958,16.38915783224773],[42.132731792107684,16.619202007318286],[39.365831792107684,18.475202007318288],[39.05618049996078,18.733977884172173],[36.28938049996078,21.590877884172173],[36.15442514441797,21.746060078301824],[31.248946536669777,28.03788657728477],[27.882032963851273,30.92088847820404],[25.27442458185645,32.73908863286469],[22.52134983889258,33.90394060744361],[19.188588047999815,34.74734513621545],[-0.28480724369897115,37.197722195058894],[-0.39500497880008145,37.21485294427464],[-7.141304978800082,38.46525294427464],[-7.28702469592256,38.49817246481388],[-10.76652469592256,39.42787246481388],[-11.39032059202301,39.72289694591143],[-13.72832059202301,41.40069694591143],[-14.103443341826063,41.75530327329599],[-15.867343341826063,43.94250327329599],[-16.079285337818828,44.267852392577055],[-17.24090462189247,46.52058455489828],[-21.054046975786726,45.03300631365157],[-21.372319808719023,44.97877347753307],[-31.639768653886012,45.332180425659715],[-35.000953354454595,44.73762940371245],[-35.026883247826404,44.73892371579981],[-35.0560095993074,44.729852937689365],[-35.31192754624663,44.753151937859485],[-35.35740296187601,44.7554218808663],[-38.27590296187601,45.578321880866305],[-38.3460423792795,45.60164625458259],[-43.17024237927951,47.45754625458259],[-43.188233591143494,47.46471879345203],[-87.51273359114349,65.76041879345202],[-87.7565141355185,65.91802073503099],[-89.9236141355185,67.962720735031],[-89.9393492222163,67.9862105054423],[-91.25285282164367,66.53519575960857],[-99.7024929713943,51.10983438914926],[-100.63250418155792,43.668975706322975],[-99.76580114099737,40.21347466123159],[-94.45675204611061,34.988586788557704],[-94.25195208572845,34.649319450508294],[-93.03945208572846,30.62751945050829],[-93.00957085390729,30.478184129763925],[-92.36137085390729,24.155184129763924],[-92.42653596820149,23.74782389185832],[-97.31203596820149,12.79042389185832],[-97.35026295195293,12.715536881542782],[-103.74826295195294,1.6583368815427824],[-103.95337255774633,1.424561694073806],[-104.23213012377852,1.2866667773991916],[-104.542408069373,1.2654916707277617],[-104.83731525764976,1.3642364881490856],[-105.31781525764976,1.6385364881490854],[-105.55349920422144,1.843200299591051],[-105.69292132875695,2.122477347655432],[-105.7148558766605,2.4338502334271706],[-105.61596351185091,2.729915257649758],[-105.41129970040895,2.9655992042214336],[-105.13202265234457,3.1050213287569557],[-104.82064976657283,3.126955876660497],[-104.75894841056791,3.1063462385470246],[-98.75622090745092,13.48042541132994],[-93.97480070130914,24.204390976119214],[-94.59342816572546,30.23891960540701],[-95.72481417815845,33.991668689780674],[-101.04824795388939,39.23071321144229],[-101.26306435736979,39.6062739069608],[-102.22086435736979,43.4249739069608],[-102.23872356346776,43.71881769037503],[-101.27122356346776,51.45961769037503],[-101.1790306663092,51.74473632159153],[-92.6108306663092,67.38653632159154],[-92.50229017524231,67.53908364105368],[-90.38312474033668,69.88010523874837],[-90.50991902690338,71.88112772959666],[-90.48036986037596,72.11784495206128],[-86.99932995108182,82.92344567317262],[-91.59976839167228,83.82186588559088],[-91.76985044661294,83.8808803500072],[-97.96771842813163,87.06901244079098],[-101.84933430523301,89.06340679334586],[-106.10198092553189,91.23237154662583],[-106.10278988170197,91.23278485987377],[-106.6258409466762,91.50049127562066],[-130.48023504102193,103.09783510436021],[-140.36063524058184,106.0010041612432],[-155.1513032269777,108.03893246392722],[-160.28683829064266,107.03352323874233],[-160.3998514993691,107.02167732706585],[-165.21125149936913,106.94687732706583],[-165.2559276597112,106.9477428901491],[-173.31782765971118,107.3858428901491],[-173.45399160249025,107.40813743612448],[-179.31659160249026,109.03253743612447],[-179.356137020231,109.04488601892717],[-185.515537020231,111.18938601892718],[-185.52205096804687,111.19321482875105],[-185.52950803410778,111.19443280517876],[-209.6282379209091,120.2171965552105],[-230.42092222654887,123.00748603472148],[-230.5920131711987,123.05532339270495],[-232.1650364643949,123.74252776080077],[-256.75645907716205,134.4182336913192],[-256.87762466104454,134.48741443900573],[-261.3471246610445,137.73261443900572],[-261.43094606355544,137.8053690104783],[-264.1171460635555,140.5803690104783],[-264.1846557656974,140.66287637089437],[-268.83168815619183,147.42095589967187],[-270.28611367407115,149.11807854719595],[-277.14391216033033,156.16029513011702],[-277.1524357854834,156.1734254414308],[-277.164893036115,156.18290564014458],[-277.22013461567417,156.2777128426261],[-277.2798800165113,156.36974829684485],[-277.2827300667315,156.38514097285295],[-277.29061115063803,156.39866671783824],[-278.59661534426033,160.19627319648862],[-280.30314044904304,163.973603171556],[-280.32211586909335,164.0204527128899],[-281.520838085406,167.35254863214942],[-283.9992505109149,169.09029144035568],[-287.85447302602313,171.52427363520258],[-291.03039689079725,172.74853219153465],[-291.0611165251655,172.7613006785634],[-293.0637165251655,173.6554006785634],[-293.2924018256693,173.82762279017237],[-294.0212018256693,174.69332279017237],[-294.10497051400574,174.82116524364963],[-295.41747051400574,177.4678652436496],[-295.4826980623024,177.70986189867662],[-295.6987980623024,180.96936189867662],[-295.67054073104646,181.2042725630138],[-293.79694073104645,187.14247256301383],[-293.7784978473593,187.19332748055928],[-292.6840040210908,189.8546068818332],[-290.3967726390933,197.3845100827641],[-290.2789755706016,197.60469577172117],[-290.08588385482443,197.76304183660753],[-289.8468939551082,197.8354415244549],[-289.5983899172359,197.8108726390933],[-289.37820422827883,197.69307557060154],[-289.2198581633925,197.4999838548244],[-289.1474584755451,197.2609939551082],[-289.1720273609067,197.01248991723588],[-291.4681273609067,189.45338991723588],[-291.4886021526407,189.39597251944073],[-292.58440512451784,186.73150990949273],[-294.41363863992706,180.93392533370113],[-294.2139556873251,177.92204849887395],[-292.9924260981769,175.45879336470364],[-292.4077808442343,174.76432657499714],[-290.5544773076906,173.93688290575528],[-287.3356031092028,172.69606780846533],[-287.2241343182079,172.64006962394936],[-283.3028343182079,170.16436962394937],[-283.27707920192006,170.14722476767642],[-280.61987920192007,168.28412476767642],[-280.47870483145084,168.14859833272288],[-280.38508413090665,167.9767472871101],[-279.12624608791583,164.47754701453894],[-277.41785955095696,160.696096828444],[-277.395888849362,160.64073328216176],[-276.1268297948174,156.9505560906464],[-269.3548878396697,149.99650486988298],[-269.32744025768824,149.9664650391717],[-267.83764025768824,148.2280650391717],[-267.7962442343026,148.17422362910563],[-263.1602512268298,141.43219843826677],[-261.11489756800233,139.31922978245328],[-258.45234542546865,144.17398929577206],[-256.03724516524153,148.78858791835654],[-249.92676561517558,161.23121568014014],[-249.9197164053744,161.2451382119119],[-248.68561592204472,163.61053846074907],[-247.72220366971658,166.3059058566018],[-243.58485835513233,181.61230018206584],[-244.1221722639517,186.26375867382936],[-244.11405908838717,186.36327751966004],[-244.11388908055474,186.46312638240093],[-244.1039776283795,186.4869399815735],[-244.10188176077978,186.51264857408202],[-244.05630195042443,186.60148722097188],[-244.01793437815633,186.6936704824217],[-241.50745316076524,190.43705777130387],[-239.85121695221784,193.82172940531368],[-237.56323390907312,198.63114071496133],[-237.53375223779713,198.6860486665962],[-229.2224889646651,212.50551014300297],[-225.21892066397174,223.3846312602555],[-225.08861613691226,223.59765383463335],[-224.88671024143432,223.74459564739607],[-224.64394131984287,223.8030861395814],[-224.3972687397445,223.76422066397174],[-224.18424616536666,223.63391613691226],[-224.03730435260394,223.4320102414343],[-223.9788138604186,223.18924131984286],[-224.01767933602827,222.9425687397445],[-228.04217933602825,212.0065687397445],[-228.09434776220286,211.8977513334038],[-236.42076862745617,198.0530867376262],[-238.69686609092687,193.26865928503867],[-238.69993509774721,193.26229883726174],[-240.3768350977472,189.83539883726175],[-240.42016562184367,189.7602295175783],[-242.82357975035157,186.1764903379138],[-242.2992277360483,181.63724132617062],[-242.3171723288449,181.3968000935477],[-246.49317232884488,165.9474000935477],[-246.508340510191,165.8989898346336],[-247.49514051019102,163.1381898346336],[-247.53038359462562,163.0575617880881],[-248.78127411366634,160.65998007981113],[-254.89193438482442,148.21698431985985],[-254.89936328018888,148.20233518000637],[-257.3211632801889,143.57493518000638],[-257.32705295658036,143.56394360987719],[-260.13882165246673,138.43711037061655],[-256.1823650581318,135.56441925529364],[-232.290384439494,125.19235728886632],[-228.7483672510644,135.53328709672618],[-228.7455170014319,135.538192669301],[-228.7446631715395,135.54380154973921],[-228.00296317153948,137.59210154973923],[-225.9648327193575,143.2101614739218],[-225.9569669606165,143.23073215126993],[-222.1871669606165,152.60293215126995],[-222.05057203458793,152.81197691477766],[-221.84437681056812,152.9528364780248],[-221.59997264224978,153.00406624940217],[-221.35456784873006,152.9578669606165],[-221.14552308522235,152.82127203458793],[-221.0046635219752,152.61507681056813],[-220.95343375059784,152.3706726422498],[-220.9996330393835,152.12526784873006],[-224.76532316784287,142.76328550962796],[-226.79950200072633,137.1561184686616],[-227.5392390005373,135.11323954630384],[-231.11296761095687,124.67972814680827],[-230.1617801541852,124.26418428423565],[-209.91962561773067,121.54777354979362],[-208.58225187851505,125.77965394672876],[-208.57022246616293,125.8015464422822],[-208.56558203326284,125.82609139095995],[-196.15668203326283,156.60739139095995],[-196.01992544057,156.81633042829333],[-195.81362131568332,156.957030446138],[-195.5691775914652,157.00807114222596],[-195.32380860904004,156.96168203326283],[-195.11486957170666,156.82492544057],[-194.974169553862,156.61862131568333],[-194.92312885777403,156.3741775914652],[-194.96951796673716,156.12880860904005],[-207.36918739056378,125.3704058146236],[-208.67819994639075,121.22826931836255],[-185.7034670586864,112.62633933949778],[-184.04542070544696,117.63049230599611],[-184.0378967985184,117.65191919936925],[-183.30269679851838,119.63251919936926],[-183.29815209073394,119.64439924901964],[-180.18945209073394,127.53479924901964],[-180.17808112321052,127.56182805948359],[-176.36830550233097,136.0671008815793],[-176.39825808622314,136.2397724050563],[-176.32985182333215,136.5443291018844],[-176.15010387505959,136.79952485709472],[-175.98746005223452,136.9025066903745],[-171.64828008327194,146.25700794067],[-171.50102636881988,146.45868647335712],[-171.2878026428283,146.5886615849786],[-171.04107028470153,146.62714574301742],[-170.79839205932998,146.56828008327193],[-170.59671352664287,146.42102636881987],[-170.46673841502138,146.20780264282828],[-170.42825425698257,145.96107028470152],[-170.48711991672806,145.71839205932997],[-174.67664997285488,136.68650943899272],[-155.37097089811562,128.12775182333215],[-155.11577514290528,127.9480038750596],[-154.9487915696882,127.68427923711081],[-154.89544191377686,127.3767275949437],[-154.96384817666785,127.0721708981156],[-155.14359612494042,126.81697514290528],[-155.40732076288919,126.64999156968823],[-155.7148724050563,126.59664191377686],[-156.01942910188438,126.66504817666787],[-175.3404517131814,135.23060801927193],[-179.00392371264476,127.05195606381874],[-182.10491652500423,119.18111819376338],[-182.8339511423841,117.21712749302536],[-184.49930196139962,112.19092890397226],[-178.95483574626934,110.26052857303955],[-173.17908171078298,108.66019171648377],[-165.20879530292817,108.22707018492405],[-160.47678300132148,108.3006359911676],[-155.29256170935733,109.31557676125767],[-155.0822430889394,109.32151007096887],[-140.1386430889394,107.26251007096887],[-140.04557549050415,107.2425415265869],[-130.06807549050416,104.3108415265869],[-129.96866821584175,104.27238159506258],[-106.06026821584173,92.64878159506259],[-106.04851011829804,92.64291514012622],[-105.52001444971577,92.3724220838108],[-101.2669190744681,90.20322845337417],[-101.26521362185693,90.20235540717744],[-97.38261362185693,88.20745540717743],[-91.26519877888622,85.06070782371602],[-86.04643160832771,84.04153411440912],[-86.03174252854103,84.03550961715965],[-86.01588237643702,84.03478905673475],[-72.68148237643702,80.74688905673476],[-72.67648274656662,80.7456349052553],[-43.62661037843842,73.33403626804717],[-28.971816955838406,98.29631801471226],[-28.82991468645038,98.46371424164853],[-28.639805910434163,98.57333360185278],[-28.423842217315592,98.61228785841814],[-11.820078640671413,98.7145642429071],[-11.592079907645005,109.52687140530254],[-11.816699774077346,114.16514589096053],[-12.400559261667778,118.24746480905428],[-13.012949274028378,122.5322165090409],[-15.218949303645704,133.907843907412],[-16.756521667131675,141.75933892982337],[-27.790748277473842,144.40830213982778],[-27.808374378305043,144.41642766344293],[-27.827709712179495,144.41811539224085],[-33.994401259736414,146.21420501214408],[-36.87390808225365,142.81004418302342],[-36.87620816374358,142.80733723159113],[-38.46795935977993,140.94242186404009],[-43.96406767280536,130.6667868253708],[-43.99777884576635,130.6095994925722],[-45.53911376469756,128.22675470158617],[-49.76007962105237,121.69041728255024],[-51.802106676030604,118.52603959387443],[-56.2935122698648,110.35407417079324],[-56.32316995691441,110.30444977613284],[-58.822369956914415,106.44644977613284],[-59.0199686781888,106.23681961054446],[-59.279010040538886,106.11077345405528],[-60.633410040538884,105.73327345405528],[-61.036513004104094,105.72637944561878],[-73.3616130041041,108.71147944561878],[-73.45166725350673,108.7389922185903],[-79.53676725350672,110.9974922185903],[-79.53688623890635,110.9975654547798],[-79.5370241857692,110.99758762971635],[-92.01452853731735,115.6335086094794],[-99.45170248746047,118.27111332259783],[-99.45179312352631,118.27116730350642],[-99.45189751399988,118.27118251744565],[-117.25589751399988,124.59058251744565],[-117.38777139923214,124.65137475792933],[-119.61283456384152,125.9337535284543],[-120.21259772612969,126.27933230285707],[-120.3604526276196,126.38896374443102],[-124.75664790680474,130.5118085464514],[-130.63091005395788,135.9305156699477],[-138.80681773097643,142.15294297799028],[-145.87493679702962,123.32503435381193],[-146.03954566071798,123.05982100501367],[-146.29311717537672,122.87778890526417],[-146.5970473765306,122.80665079162517],[-146.90506564618806,122.85723679702963],[-147.17027899498632,123.02184566071797],[-147.35231109473582,123.27541717537675],[-147.42344920837482,123.57934737653062],[-147.37286320297036,123.88736564618807],[-140.11228034735794,143.22795531173264],[-154.59811308743377,157.10484275721998],[-163.25258778407573,159.6325839955344],[-163.53969107220937,159.78529339140044],[-164.20399107220936,160.33749339140044],[-164.23575154070002,160.37669343467357],[-165.92764017736678,160.5921261025028],[-166.02217378633722,160.6114969252183],[-169.0660721060978,161.4787874318517],[-171.25223043794608,162.05052431147],[-210.1656967279658,172.23856782446492],[-210.39028947527606,172.34772818733705],[-210.5560122553244,172.53452713578113],[-210.63763527712914,172.77052622323322],[-210.62273217553508,173.0197967279658],[-210.51357181266295,173.24438947527605],[-210.32677286421887,173.41011225532438],[-210.09077377676678,173.49173527712912],[-209.8415032720342,173.47683217553507],[-170.92828641408215,163.28885394318738],[-168.73546956205394,162.71537568853],[-168.7220262136628,162.71170307478172],[-165.7179607614684,161.85576204972193],[-164.3644905324242,161.6834210953877],[-161.04089080545367,178.62412025677838],[-190.1807942005252,187.68888283036165],[-201.2094846458416,191.11927985844412],[-201.42888086709576,191.2385408540217],[-201.58593733828786,191.4326829458602],[-201.65674363539944,191.67214976037968],[-201.63052014155588,191.9204846458416],[-201.5112591459783,192.13988086709577],[-201.3171170541398,192.29693733828788],[-201.0776502396203,192.36774363539945],[-200.82931535415838,192.3415201415559],[-189.8006153541584,188.9111201415559],[-160.7870210971023,179.88564947435768],[-157.48166581505646,195.9980385308642],[-157.43503384138702,196.55706574743107],[-157.5622930196441,196.67046901093076],[-183.2667308638123,203.5250122465498],[-183.30200003550658,203.53529034170438],[-194.08541634750995,206.94827594151587],[-196.2647999742402,206.79506943222094],[-196.65124115572482,206.86448849800846],[-203.63604115572483,210.03128849800845],[-203.7433023958604,210.09019548072507],[-212.3406023958604,215.70789548072509],[-212.56357672101984,215.92633688867065],[-212.6859842285469,216.2134790146058],[-212.68918948504742,216.5256070728068],[-212.5727045192749,216.8152023958604],[-212.35426311132935,217.03817672101985],[-212.06712098539418,217.16058422854692],[-211.774472036388,217.16358945323444],[-200.5302692326926,222.95198873956247],[-182.02478884518644,233.14982446986676],[-181.78677265383556,233.22536372867685],[-181.53796674340043,233.20406805072798],[-181.31624955831361,233.08917950994203],[-181.15537553013326,232.89818884518644],[-181.07983627132316,232.66017265383556],[-181.10113194927203,232.41136674340044],[-181.21602049005799,232.18964955831362],[-181.40701115481357,232.02877553013326],[-199.92041115481356,221.82657553013325],[-199.9363705188314,221.81807247952116],[-210.468787227345,216.39609331183547],[-202.91946892233173,211.46317187812105],[-196.17499335924649,208.40533125087643],[-194.0455000257598,208.55503056777906],[-193.7479999644934,208.51970965829562],[-182.83671652581947,205.06625370573238],[-156.96606913618768,198.16738775345019],[-156.93896002632675,198.1540593047357],[-156.90904224661267,198.14987865412076],[-156.79973886072653,198.08560990985725],[-156.68595030723844,198.02966469781444],[-156.66600533199548,198.00697660963704],[-156.6399647733863,197.9916651534716],[-156.0723647733863,197.4858651534716],[-155.86162158366406,197.18521940742127],[-155.8073688690793,196.8220979407016],[-155.8911688690793,195.8174979407016],[-155.904720231548,195.72323302416538],[-159.36422837830125,178.85940555381208],[-162.81618148306427,161.26447720173832],[-162.64461115645935,161.12185920632777],[-154.43455953423305,158.7239220949923],[-118.96934024420315,196.70786597587144],[-118.87619145636654,196.77483474287433],[-118.79059734726293,196.8512229678572],[-118.75043632895793,196.86524564378288],[-118.71589740985391,196.89007719424885],[-118.60421131367556,196.91630176955036],[-118.49590016004241,196.95411983967492],[-118.45342997147135,196.95170614662143],[-118.4120175480729,196.96143003574454],[-118.29879733925905,196.94291796548146],[-118.1842585323939,196.93640842239284],[-118.1459448747736,196.9179258232474],[-118.10396361313849,196.91106167705598],[-118.00644604213716,196.8506312561135],[-117.90311707708848,196.8007851187378],[-103.07191766536727,185.62354991071274],[-97.67456732872014,183.4905059060384],[-97.5535963273895,183.43043855843914],[-84.2094963273895,175.33343855843913],[-84.02127896426008,175.1749753867127],[-81.12372713063564,171.8487221265488],[-79.66222955603278,170.81393481955993],[-74.99153171180262,170.39500128249276],[-74.67701365426352,170.29892429735594],[-33.961030927286906,147.87096875884234],[-27.398653697281514,145.95963307198258],[-17.075810906716676,143.4814502558679],[-18.62670977512038,151.8493721977822],[-23.536640875032667,175.2382315094569],[-26.46143909711069,189.1701230405595],[-26.461594009442486,189.18476331541638],[-26.46713735276019,189.19831444048324],[-28.93879450533311,201.9163275797861],[-29.71998445308817,201.6375996747058],[-31.39611323119924,200.27307467910617],[-30.10017333078711,192.19153451898296],[-30.10949684272472,191.9419930212478],[-30.213606041445814,191.7150146925281],[-30.396651245197344,191.54515492580765],[-30.630765481017043,191.45827333078714],[-30.8803069787522,191.46759684272473],[-31.107285307471937,191.57170604144582],[-31.277145074192354,191.75475124519735],[-31.364026669212887,191.98886548101706],[-32.71842666921289,200.43496548101706],[-32.715002356155004,200.65706749690048],[-32.63586770501834,200.86462167866728],[-32.490555394770006,201.03262573775422],[-30.442755394770007,202.6997257377542],[-30.253771537864157,202.80618041905882],[-29.190433938418693,203.18557836489555],[-30.148011873823755,207.78604142641217],[-30.51265705956469,209.54342122052992],[-30.514109705088853,209.55048887536068],[-32.63600970508885,219.97358887536066],[-32.64816367795927,220.03908370512147],[-34.43476367795927,230.6937837051215],[-34.45629378430776,230.8741293132415],[-35.08829378430776,239.6977293132415],[-35.09058600626718,239.9350543956639],[-34.942299953969695,242.7738873766335],[-34.70041382730158,247.42952035370698],[-34.674575416185796,247.65905413544652],[-33.52657541618579,254.25635413544651],[-33.49917791075116,254.386809309161],[-32.634977910751154,257.892009309161],[-32.594501715266055,258.0328265598186],[-26.51580171526605,276.49592655981866],[-26.49441312059483,276.5573666144562],[-19.520150008074747,295.54881540433513],[-12.930704683592385,314.81990430166354],[-9.69804536011691,326.36979498094394],[-9.670682636469806,326.459125097134],[-1.395882636469807,351.298625097134],[-1.3885831043952328,351.32011267463423],[1.7523168956047674,360.38961267463424],[1.7704953818095408,360.43983386099364],[5.9207953818095405,371.42583386099363],[5.930983752670752,371.4522135816009],[13.544683752670753,390.74171358160095],[13.588672718401362,390.84432049238546],[25.265518169004526,416.03280282220436],[27.342163635455137,420.5139851445452],[27.3725259804234,420.57651150297437],[36.54061433427379,438.61809705433416],[36.724581131986604,439.0008332239354],[36.51916380718075,439.3986687929096],[36.455320184412514,439.5660223013921],[35.939320184412516,441.5679223013921],[35.93015391988505,441.60764587317476],[35.50125391988505,443.70944587317473],[35.501039377672,444.02829915202614],[37.05438189417771,451.69300147831314],[37.747297422090725,458.19566380022],[37.559267324815224,463.1857769548863],[37.56659556437981,463.3280185224252],[38.05143993158403,466.753388082606],[38.271103474798096,471.43079003784015],[38.24646511590889,473.78480378442475],[38.04321841507745,474.65419861843856],[37.5649586918059,475.4573903197135],[37.066640272753645,475.7761780727064],[36.42004008801229,475.8112358207614],[36.01634012572849,475.6294257765282],[35.68000567099182,475.22117160978087],[35.07259880603481,474.2337911948135],[33.2441972796325,468.82999547004476],[33.23400471855659,468.80164188371197],[30.409104718556584,461.3851418837119],[30.39451210163885,461.3494421106432],[28.04550630809262,455.9763502608989],[25.16436850245639,445.93564768927115],[25.161933206628547,445.9273309122703],[24.004233206628548,442.0516309122703],[23.966702023141135,441.9511215481156],[22.915402023141134,439.6250215481156],[22.883907633475683,439.5627308061586],[21.771407633475683,437.58203080615857],[21.56838944654443,437.3449278450621],[21.29008972393478,437.2035649688147],[20.978877075620794,437.17946339386725],[20.682130806158582,437.2762923665243],[20.445027845062143,437.47931055345555],[20.30366496881471,437.7576102760652],[20.279563393867292,438.06882292437916],[20.376392366524314,438.3655691938414],[21.47178516108267,440.3158114483868],[22.486554954720404,442.56108493547964],[23.627626622272196,446.38111729440726],[26.522231497543608,456.46875231072886],[26.55818789836115,456.5685578893568],[28.920761203802456,461.97268392717547],[31.7334319872244,469.3570773093302],[33.5860027203675,474.83230452995525],[33.66240809860518,474.9950718939928],[34.34610809860518,476.1064718939928],[34.41004869849512,476.1959785726467],[34.900148698495116,476.7908785726467],[35.1890903028932,477.01163908512416],[35.940490302893195,477.3500390851242],[36.312311255848016,477.4194267240878],[37.36361125584802,477.3624267240878],[37.75141243888566,477.2375006343951],[38.58661243888566,476.70320063439505],[38.84287057239353,476.43859414387134],[39.48137057239352,475.36629414387136],[39.572995985371385,475.1391133020272],[39.824495985371385,474.0633133020272],[39.84545618428776,473.88957276655356],[39.871256184287766,471.4245727665536],[39.870419257561394,471.37867118181276],[39.64791925756139,466.64087118181277],[39.640904435620186,466.56628147757476],[39.160824883319236,463.1745747853853],[39.34833267518478,458.1983230451137],[39.34439641047139,458.0834329018597],[38.64139641047139,451.48613290185966],[38.629960622328,451.41200084797384],[37.10147473614058,443.8699493023098],[37.493769183313674,441.9475327271911],[37.719676254053354,441.07109209751326],[38.163223003399715,441.9938748278454],[38.21049186033661,442.0567810960042],[38.236190680598014,442.13115255589963],[44.52990615243915,452.8961951583174],[48.08051840173459,459.09149885085804],[54.0685191321043,470.16907096002865],[64.52709655771513,490.40384829179254],[76.10494312757369,519.3816656301842],[76.2281159329227,519.6344512061207],[83.0679159329227,531.3969512061207],[83.08708218200637,531.4291831637248],[87.64452144458404,538.9258166848731],[93.17758947242591,548.8358292394984],[94.81424202898636,552.2385303489682],[95.26443084107754,552.837321644971],[95.90949857875884,553.2182528677705],[96.65123952652189,553.3233306918455],[97.37673034896821,553.1365579710136],[97.97552164497101,552.6863691589225],[98.35645286777049,552.0413014212412],[98.46153069184557,551.2995604734781],[98.27475797101364,550.5740696510318],[96.61275797101364,547.1186696510318],[96.55890291642466,547.0149121465516],[90.98000291642467,537.0228121465516],[90.94421781799363,536.9614168362751],[86.37805833232062,529.450439225606],[79.61855094547224,517.8260195586854],[68.0584568724263,488.89263436981577],[67.9811421986666,488.72341920952886],[57.471642198666615,468.39011920952885],[57.45502860251501,468.35869267259994],[51.44722860251501,457.24449267259996],[51.42401640718623,457.2027981106392],[47.85741640718623,450.9795981106392],[47.84910931940199,450.9652474441004],[41.590474334319644,440.26020802043473],[39.992376996600285,436.9354251721546],[39.973574019576596,436.89738849702564],[30.81162118414798,418.8678768345984],[28.749536364544863,414.4181148554548],[17.09601391938156,389.2799432560803],[9.508007569220801,370.0555387626768],[5.3721431544647995,359.1077502990695],[2.2436963650741015,350.074209544388],[-6.012748982391406,325.289806995883],[-9.24745463988309,313.73260501905605],[-9.279670019246403,313.6288977969847],[-15.893670019246404,294.2859977969847],[-15.908086879405166,294.2453333855438],[-22.87857205464695,275.2641722061543],[-28.924171718264937,256.90160929807433],[-29.75485767224697,253.53234245486928],[-30.871589402180806,247.11473423022426],[-31.107486172698422,242.57437964629304],[-31.24961196488864,239.8534791181023],[-30.63260145218038,231.23915323213302],[-28.86654514914206,220.7069691439306],[-26.752009977567543,210.32004631682364],[-26.388465348194753,208.5679687150001],[-25.353488126176245,203.59565857358783],[-25.34846264723981,203.57068555951676],[-22.886019170770446,190.90008176807765],[15.623089532609603,202.27960425179717],[15.722988249026372,202.30228529535307],[24.442688249026375,203.70218529535305],[24.706264890245368,203.7005229156756],[28.237464890245366,203.08782291567562],[28.501439338911116,202.99199293919645],[32.93445707852734,200.42627555851843],[34.802082177602045,199.42094139521976],[43.85550223908357,208.68649723877178],[58.792675019749275,223.96857171587172],[66.01295454903973,231.35665076942226],[68.66707593836624,234.07127495287384],[68.75037994653269,234.14536617318808],[72.0234799465327,236.67096617318808],[72.03146487689352,236.67704799742575],[74.42426487689352,238.47594799742575],[74.52762730515077,238.54190048850438],[80.89332730515078,241.94740048850437],[80.91215251635802,241.95715292209007],[84.2307407977862,243.62095298609924],[88.49804778103582,247.671434429611],[88.50101027279285,247.67330411210315],[88.50305628297514,247.6761476859753],[90.63049698054753,249.66100448920764],[92.64908326766836,252.77188578310165],[96.7875920644227,264.1883419873051],[96.79986290288218,264.220069955364],[102.5270629028822,278.141269955364],[102.61717210141649,278.3036479596123],[106.67067210141649,283.94624795961226],[106.73717822512815,284.0270877658561],[109.97807822512814,287.47888776585614],[110.02202519968938,287.52221682134626],[112.04392519968938,289.36741682134624],[112.05972232667138,289.3814554740032],[113.90609418291055,290.9791506514807],[116.78422855642499,295.500591124963],[116.87385329206762,295.61642303843377],[122.04955329206761,301.1700230384337],[122.22973871861305,301.3144734364513],[127.15004108486447,304.203443899696],[130.5640791860912,307.671278036724],[133.82149761375337,313.6404385779193],[136.08322293568423,318.82884937827635],[139.7234200099563,338.30329153465027],[139.73086192719327,338.3386608475856],[142.12686192719326,348.5729608475856],[142.14745300072778,348.64537407382784],[144.96585300072778,357.0344740738278],[145.03900763140805,357.1926302822794],[152.56560763140806,369.6818302822794],[152.59939793066337,369.7333085960272],[160.51299793066337,380.8333085960272],[160.5961923537749,380.9320519073672],[165.6977923537749,386.07945190736723],[165.72231410995778,386.1031608463418],[184.77101410995778,403.75046084634175],[184.85638835285928,403.81930605769287],[204.3642460982576,417.45449870321676],[213.38540522960497,424.25337618994786],[213.66521168414644,424.3886587842608],[213.97545827308358,424.4071002153325],[218.29335827308358,423.81570021533247],[218.58840973748343,423.71382366385444],[218.82201527808283,423.5067906959802],[218.95861056896499,423.22612020431006],[218.9774002153325,422.9145417269164],[218.87552366385447,422.61949026251654],[218.6684906959802,422.3858847219172],[218.38782020431003,422.24928943103504],[218.0762417269164,422.23049978466753],[214.08505068809356,422.77715218059143],[205.31579477039503,416.1681238100522],[205.29261164714072,416.1512939423071],[185.8180638757649,402.5393836027515],[166.82219954133967,384.9410321840772],[161.77820213716052,379.85175191156037],[153.9200885506319,368.82957985200875],[146.4546335925267,356.4418403597058],[143.6761480347235,348.1715475719657],[141.29285862698575,337.9915397315605],[137.63927999004372,318.4455084653497],[137.5862510579809,318.2728185558117],[135.27405105798087,312.9686185558117],[135.24294163417966,312.9050811497008],[131.91494163417968,306.8065811497008],[131.78279000629263,306.6285537218606],[128.21619000629263,303.00575372186063],[128.05116128138695,302.8771265635487],[123.14048905936302,299.9938104687064],[118.09448279566135,294.5793736995557],[115.19297144357502,290.021208875037],[115.04157767332863,289.8458445259968],[113.11466896008979,288.17845951458753],[111.12338455163464,286.3611995163278],[107.93952501556888,282.9701518608642],[103.97116986128644,277.44607617477715],[98.28600988264967,263.6270635517505],[94.1221079355773,252.14055801269492],[94.04109836934866,251.97773820069082],[91.91919836934865,248.70763820069084],[91.85097133556745,248.63754908578687],[91.79384371702486,248.55815231402468],[89.59705809789233,246.50859817775492],[85.24615221896418,242.378765570389],[85.14673845594761,242.3160237343144],[85.05394748364199,242.24384707790992],[81.63872470899902,240.53159855860545],[75.33658839881035,237.16010363984594],[72.99694666528306,235.40116786818],[69.77205963208881,232.91277011344127],[67.15718476304535,230.2382871322738],[59.936945450960266,222.85024923057776],[44.99985113839937,207.5682550462727],[36.040360860507015,198.39882990794678],[43.068058888516724,190.2990815995708],[43.07148344946328,190.29510839436665],[46.89924303505535,185.8245555955402],[49.50480110733932,182.78240454875547],[50.11117242642075,182.07443662418422],[55.66570015636013,178.43574807215074],[59.28395261868939,176.06672056847512],[84.1399987756657,161.44635756335384],[86.12006632212464,160.2814178279739],[86.12838514361589,160.2764555498755],[93.56798514361589,155.7773555498755],[93.6357542304375,155.73148056292297],[93.83522255655551,155.58102239099136],[99.4118219585212,154.17446496557628],[99.60509555396283,154.0898506231248],[103.33289555396281,151.6568506231248],[103.5366122112548,151.44218528131833],[106.53455082940528,146.27731863405197],[114.9311719343685,143.0865036260182],[125.78248223739146,140.67424932904098],[125.84549612564756,140.65682030630344],[128.59939612564756,139.74132030630344],[128.81643911754034,139.6178284983282],[128.96970242648015,139.42067818739875],[129.03585310301625,139.1798837211821],[129.00482030630346,138.93210387435244],[128.88132849832823,138.71506088245965],[128.68417818739877,138.56179757351984],[128.44338372118213,138.49564689698374],[128.19560387435246,138.52667969369654],[125.47276511701217,139.43185376768074],[114.60821776260855,141.84705067095902],[114.51975447024174,141.87354085038427],[105.86765447024173,145.16144085038428],[105.68073760265392,145.27186122935433],[105.54148778874519,145.43841471868168],[102.50593919120986,150.66807606419613],[98.9950709896467,152.95949253890055],[96.46450625028116,153.59776406749438],[98.2213542304375,152.27258056292297],[98.39429674931566,152.09365228812428],[102.88959674931566,145.69225228812425],[102.93730687526664,145.61541589360868],[109.31270687526664,133.9206158936087],[109.33372564424818,133.87924844055289],[112.18442564424818,127.84124844055289],[112.2600630755644,127.53840660498614],[112.21405039715077,127.2296720396865],[112.05339262218978,126.96204678353504],[111.80254844055288,126.77627435575182],[111.49970660498613,126.7006369244356],[111.1909720396865,126.74664960284923],[110.92334678353504,126.90730737781023],[110.73757435575182,127.15815155944712],[107.89678364656085,133.17516292581155],[101.55417302900493,144.80981528490946],[97.15728884866826,151.07106912603402],[92.70495557705733,154.4294465582512],[85.30455924598616,158.90483812945425],[83.32876745029574,160.06726230258542],[59.54631981213276,174.0561330756887],[59.61463873626718,171.99767977237576],[62.464658417630204,162.96191649806693],[62.491870523811684,162.7136879980031],[62.42201829733402,162.4739411452128],[62.265736106466434,162.27917522472262],[62.046816498066924,162.15904158236978],[61.79858799800313,162.1318294761883],[61.5588411452128,162.20168170266598],[61.36407522472264,162.35796389353357],[61.2439415823698,162.57688350193305],[58.367541582369796,171.69628350193307],[58.3382522016316,171.8675704441295],[58.2396647341941,174.83801678214078],[54.78917984008913,177.09719955068917],[49.139219859791545,180.7984043240794],[48.97000039766816,180.9471936940753],[48.28960039766816,181.7415936940753],[45.6839973867161,184.78379720952847],[41.857822318174854,189.2524993895293],[34.445076927869145,197.79603266262222],[32.413251843628984,198.88975493699402],[27.173523818039094,195.60091531147535],[22.829367960334327,186.9477543011797],[22.675943590191693,186.7507293037477],[22.458799752549464,186.6274149058018],[22.210994628274886,186.59658460658147],[21.970254301179715,186.6629320396657],[21.773229303747687,186.81635640980832],[21.649914905801786,187.03350024745055],[21.61908460658147,187.28130537172513],[21.685432039665674,187.5220456988203],[26.109832039665672,196.3350456988203],[26.34155908279744,196.5899665256785],[31.151917939239297,199.60930240394663],[27.82340526948137,201.53576047612756],[24.564384604506426,202.10123452501466],[16.027288686842073,200.73065060869436],[-22.570245294003307,189.32499826980742],[-19.778560902889307,176.0271769594405],[-14.863957347202957,152.61606002201674],[-14.863713063265935,152.5929538335027],[-14.855150424171123,152.57149138177832],[-12.986521824501008,142.4892490260518],[-11.450189906804288,134.6440882446629],[-11.449514671206051,134.64062331977226],[-9.389172901977261,124.01610837626471],[-5.591911023331274,124.78219976542746],[-5.279767668379754,124.78305085012498],[-4.991059115517356,124.66438505939466],[-4.76973862476783,124.44426818416711],[-4.649500234572548,124.15621102333128],[-4.64864914987502,123.84406766837976],[-4.767314940605342,123.55535911551736],[-4.9874318158328945,123.33403862476783],[-5.275488976668726,123.21380023457255],[-9.120473518648808,122.43808087593692],[-8.599227628517301,118.79104352771749],[-8.583157651486154,118.67868298097306],[2.883420048521834,114.5447858298361],[3.1507691681003047,114.3836689572058],[3.336110789883672,114.13250629752037],[3.411228332081404,113.82953508892172],[3.364685829836112,113.52087995147816],[3.2035689572058077,113.2535308318997],[2.9524062975203678,113.06818921011632],[2.6494350889217206,112.99307166791858],[2.3407799514781655,113.03961417016389],[-8.326681928107998,116.8854164162737],[-8.002640738332222,114.61973519094572],[-7.985547458098901,114.44077189042909],[-7.778294246261304,110.1611090992193],[-4.819597892178412,108.94941506743774],[-4.746698124450491,108.91686957723857],[15.62410187554951,99.04946957723857],[15.637283755337451,99.04299077588543],[33.6875356403065,90.04247250591143],[76.00975741582262,71.73035676122245],[91.38803118576098,65.96360390456832],[93.01199985989376,65.3544427595887],[111.23277378621395,66.30954191698702],[111.3088404900851,66.30748929012695],[129.79964049008512,64.33398929012695],[129.90214719521057,64.31151200322992],[138.207123698359,61.50952933424232],[141.98496707593227,69.2908203036354],[142.1831348701517,69.52806355591571],[142.46938414347844,69.64475198266936],[144.07528414347843,69.87625198266936],[144.3639137646317,69.85162450532717],[165.1927137646317,63.101224505327174],[165.2068848593365,63.09644813903482],[169.40780842408847,61.625651903167686],[173.1185933897389,61.13559087293362],[173.35502414279804,61.05522678907381],[173.5427036729553,60.89050192474936],[173.65305947306337,60.66649414731906],[173.6692908729336,60.41730661026111],[173.5889267890738,60.18087585720194],[173.42420192474935,59.99319632704469],[173.20019414731905,59.882840526936626],[172.9510066102611,59.86660912706638],[169.1748066102611,60.36530912706638],[169.0471151406635,60.395751860965184],[164.79097278469922,61.88588089092209],[144.11074008080394,68.58813175724059],[142.9881212963898,68.42629960792128],[139.18283292406772,60.5884796963646],[139.03204007552813,60.38943346104209],[138.81655395258073,60.26324464305944],[138.56918036405773,60.22912434605003],[138.3275796963646,60.29226707593228],[138.12853346104208,60.44305992447188],[138.07028273056622,60.54253168646923],[129.64527020121932,63.38501282826223],[111.24491125435209,65.3488601675684],[94.94336605551565,64.49436341860162],[100.67588196524096,61.4772497819041],[148.8720313204547,37.61015728670475],[148.98391457829769,37.54758889630936],[156.5750145782977,32.78838889630936],[156.83776856645565,32.569796052547005],[160.41086856645563,28.679896052547004],[160.54934555817266,28.49921841922375],[175.70776000363867,4.582096539718999],[178.3887078468177,1.0083761561904807],[186.05863392706945,-3.795509910283572],[186.08938744962097,-3.8153897754266515],[192.83568744962096,-8.314489775426651],[193.1208893618767,-8.57466400710375],[196.4068893618767,-12.63916400710375],[196.6847303659133,-13.312429716984395],[197.0426303659133,-16.778529716984398],[196.94750898481223,-17.410459009215224],[195.61890898481224,-20.538059009215225],[195.2915931943906,-20.993921567454496],[192.6955763531988,-23.30347259733285],[190.77654671244966,-25.450035394183825],[190.90981888197015,-32.75529140249222],[192.69425771507142,-35.940064103711016],[196.33882531063082,-40.907176660808524],[202.9294643299751,-44.15495491487495],[210.73156603194502,-47.3594837292948],[218.81883351460053,-48.54401481591937],[225.76015650611234,-48.46326112294531],[233.72410898216458,-44.288425361437355],[234.11862875480293,-44.15778538346169],[241.49042875480293,-42.99298538346169],[241.6152692261458,-42.97949509347882],[249.5739692261458,-42.512795093478815],[249.69444043236314,-42.511410385822266],[256.5987404323632,-42.75721038582227],[256.9321650050809,-42.81378578246283],[267.8081720581919,-46.18494408327557],[280.8853187114816,-47.75946992144609],[285.4674237753278,-48.28637015541371],[293.9927465191519,-47.62090086751499],[307.10835814875827,-45.171946318688036],[307.14285573210884,-45.172351844408055],[307.1755185990139,-45.16124397180866],[307.22877968524574,-45.16470505119662],[307.2805541913465,-45.1517388298832],[315.6262541913465,-44.7421388298832],[315.7656140331354,-44.74289491277262],[331.8057140331354,-45.70469491277262],[332.1047669277232,-45.75876837266477],[343.69136692772315,-49.31596837266477],[344.13103453666395,-49.55287329349864],[344.4465748534236,-49.93999841069748],[344.58994972515563,-50.41840743446568],[344.53933162733523,-50.91526692772314],[344.30242670650136,-51.354934536663926],[343.91530158930254,-51.67047485342362],[343.4368925655343,-51.813849725155634],[342.94003307227683,-51.76323162733523],[331.49972708296855,-48.250945325472074],[315.68204527728597,-47.302482014102104],[308.794468440934,-47.640518544551284],[309.48577338005515,-52.86896201123179],[309.8603721514352,-54.32687683829886],[312.0244636160641,-59.29228471507983],[315.7991059417106,-64.63181940111215],[316.0205530724879,-65.18633624554478],[316.90405307248795,-71.25633624554479],[316.90885438282277,-71.29303906271203],[317.6223672336851,-77.43683753840475],[319.46739873551036,-79.62895853863822],[319.57295893015737,-79.77387599655412],[321.50049686723435,-82.85209306771316],[324.5828781987706,-85.69239502269588],[324.7023518320341,-85.81851691528159],[328.6195309025007,-90.56061156194707],[338.0824647078535,-101.08853464777322],[338.11641719277384,-101.14571597238213],[338.1652955969052,-101.1908089510582],[338.2429518586708,-101.35882025096187],[338.33744966320495,-101.51796941629043],[338.3469353235322,-101.58379112520508],[338.3748367448357,-101.64415656072543],[343.7441367448357,-123.91165656072543],[343.7567938005039,-123.97010822552328],[344.5726938005039,-128.21520822552327],[344.56946401426706,-128.71462900637633],[344.3753600222571,-129.17479765823435],[344.0199323977006,-129.52565767529117],[343.5572917744767,-129.71379380050388],[343.0578709936236,-129.71056401426702],[342.5977023417656,-129.51646002225712],[342.2468423247088,-129.16103239770058],[342.0587061994961,-128.6983917744767],[341.24845177138826,-124.48266549336311],[335.96206845911263,-102.55903663930441],[326.6977352921465,-92.25206535222678],[326.66284816796593,-92.21158308471841],[322.78409567541667,-87.51600723797337],[319.63942180122945,-84.61830497730413],[319.4219410698426,-84.35632400344588],[317.4509340873471,-81.20868824272418],[315.41600126448964,-78.79094146136178],[315.12384561717727,-78.11436093728798],[314.3680808980822,-71.60674706103227],[313.53146796639044,-65.85888006004879],[309.8582940582894,-60.66288059888785],[309.7301017184229,-60.435406367570664],[307.47270171842285,-55.25590636757067],[307.406368848832,-55.06303833807515],[306.987168848832,-53.43153833807515],[306.9579439718087,-53.28078140098609],[306.25128638808127,-47.936223568784236],[294.39544185124174,-50.14995368131196],[294.2601111798877,-50.16781818137717],[285.5435111798877,-50.84821818137717],[285.2976752728001,-50.84372035574904],[280.58947527280014,-50.302320355749046],[280.5826894358952,-50.30152168980244],[267.3869894358952,-48.712721689802436],[267.16103499491913,-48.66451421753717],[256.3371772759698,-45.309520273724424],[249.66362779056547,-45.07193522331926],[241.82788225558718,-45.531425145187704],[234.72617764639298,-46.6535480363119],[226.67659101783542,-50.87327463856265],[226.09719020651033,-51.01951338837833],[218.74789020651033,-51.105013388378325],[218.54749935783013,-51.09158707524181],[210.20509935783014,-49.86968707524181],[209.9042916365601,-49.787220344271326],[201.9164916365601,-46.506420344271326],[201.8370019444881,-46.470560511591884],[194.92630194448807,-43.06506051159188],[194.4601016216682,-42.674118163490895],[190.58390162166822,-37.391318163490894],[190.4992367402432,-37.25977017214287],[188.51923674024317,-33.72597017214287],[188.3561129509782,-33.12364757280968],[188.2078129509782,-24.994647572809686],[188.287690716777,-24.525634529007114],[188.53334234560907,-24.118192545433853],[190.83584234560908,-21.542692545433855],[190.9393068056094,-21.439478432545506],[193.37513632012818,-19.272438344592068],[194.46227798914944,-16.71324499517843],[194.17728650074724,-13.953231030521035],[191.25286768268631,-10.335975922179998],[184.68424711139613,-5.955370136446833],[176.82816607293054,-1.0348900897164282],[176.48369043755102,-0.7182205686124843],[173.62969043755103,3.0861794313875155],[173.57245444182735,3.169081580776248],[158.44822786718706,27.032261441722188],[155.0690841185799,30.711008543036755],[147.67845855174866,35.34452215735657],[99.52566867954528,59.19014271329525],[99.49754456597424,59.20450467535107],[92.99667940904358,62.62601265268299],[90.4891094725901,63.5666183481649],[75.08116881423902,69.3444960954317],[75.02230552582661,69.36825035538428],[32.63910552582661,87.70675035538427],[32.57621624466255,87.73600922411457],[14.501488598211168,96.74873200734396],[-5.826759711409175,106.59552041871453],[-7.796033138004981,107.40200968709091],[-7.992816376382286,98.07002441899799],[-7.976816384542754,94.19713198434961],[-7.977759115992619,94.12851980959023],[-8.16324227564321,88.26252360455774],[-0.6470499506121198,87.71107338206113],[17.0272405253925,87.16289238978759],[17.27052993470614,87.10660606567086],[17.47376019673957,86.9615014566449],[17.60599134638511,86.74966942405734],[17.647092389787584,86.5033594746075],[17.59080606567085,86.26007006529386],[17.445701456644887,86.05683980326043],[17.23386942405734,85.9246086536149],[16.9875594746075,85.88350761021242],[-0.7002405253925001,86.43210761021241],[-0.727229838204553,86.43351560707335],[-8.204429520621616,86.98210500582897],[-8.29061899077072,84.33765492651395],[-8.326467942310009,84.02574886393515],[-9.85506794231001,76.33834886393515],[-9.897630989372395,76.16626023281255],[-11.387464161305717,71.14898439691714],[-9.77693985899207,70.47823130089138],[-1.699195078395793,68.4622948230948],[7.636497867378336,66.13259658345878],[7.918791067909992,65.99938717193261],[8.128618943222127,65.76828879217294],[8.234037101392897,65.47448407758613],[8.218996583458782,65.16270213262166],[8.085787171932617,64.88040893209],[7.854688792172941,64.67058105677786],[7.560884077586133,64.5651628986071],[7.2491021326216645,64.58020341654121],[-2.086597867378335,66.90990341654121],[-10.222711976645465,68.94040693760888],[-10.336575597290878,68.97808984302776],[-11.773055921167778,69.57635689384863],[-14.6508700020878,56.51886693969135],[-15.024886637989027,52.88969075363598],[-14.780064594545554,50.69671919584076],[-14.050093627575484,48.71131478268148],[-12.755751592537043,46.20119294555937],[-11.277865358554427,44.36864417807438],[-9.436430915238045,43.04719049586898],[-6.367994324791762,42.22732399259612],[0.249954971905332,41.00071328738141],[19.78500724369897,38.542577804941104],[20.016335398575183,38.49892362938021],[23.60553539857518,37.59062362938021],[23.88265758415235,37.497536474365155],[26.95585758415235,36.197236474365155],[27.305857394116043,36.00394455069004],[30.156557394116042,34.01624455069004],[30.307189148150695,33.89969832126242],[33.8931891481507,30.829098321262425],[34.158574855582025,30.551239921698176],[39.119458641893104,24.188350067120883],[41.6734669368191,21.551171269313283],[44.0518867640307,19.955758641713903],[48.19017939894202,18.59971883097014],[61.39389312928504,16.145325086048643],[82.04978122543878,12.495511436155532],[82.28797572673854,12.437530338207416],[88.18607572673854,10.595830338207417],[88.34770980459092,10.537297395648327],[92.89470980459092,8.656397395648327],[93.31983802541777,8.412896199654158],[96.69293802541777,5.858796199654158],[97.06692803706136,5.484052004879006],[99.44672803706136,2.3279520048790054],[99.72957458888416,1.7956982262639662],[101.15497458888416,-2.354301773736034],[101.2527431601219,-2.8218915257948085],[101.55264316012189,-6.498191525794809],[101.48590249355543,-7.179039153578939],[100.22180249355543,-11.628239153578939],[100.1775085753016,-11.76456151321122],[94.49534383196114,-27.25891217184541],[86.46921519497089,-49.804166913804806],[86.10177194732758,-51.07968707752333],[86.06295264233691,-51.19951607732298],[79.67489357135575,-68.91412526965121],[73.14290841020019,-87.05244697520226],[70.91894450280031,-93.72406246290836],[74.76827281159326,-95.13820444539903],[78.39335068599277,-96.34633099562127],[78.54616714032092,-96.42109385574896],[82.17726714032092,-98.84339385574896],[82.25146537878138,-98.9011997771767],[85.88586537878138,-102.1891997771767],[85.9585027620719,-102.26681986589732],[87.4289027620719,-104.12621986589733],[87.5314170666433,-104.31305929443111],[87.5669,-104.5232],[87.5669,-108.2422],[87.53614860911341,-108.43820033748283],[85.63034860911341,-114.36220033748283],[85.50896623827819,-114.58043004906487],[85.3133106551836,-114.73559699068153],[85.07316864873349,-114.8040784020635],[84.82509966251718,-114.77544860911341],[84.60686995093513,-114.65406623827819],[84.45170300931848,-114.4584106551836],[84.38322159793651,-114.21826864873348],[84.4118513908866,-113.97019966251717],[86.2869,-108.14178746795959],[86.2869,-104.74567519381193],[84.98758150598258,-103.10261697307197],[81.42770411263184,-99.88203672066795],[77.90722825587109,-97.53353387915118],[74.35434931400724,-96.34946900437873],[74.33600265892635,-96.34304344244696],[70.52588316026501,-94.94330574559854],[70.32283458675242,-95.5904179449706],[70.30482617637892,-95.64494237633211],[68.0524825176785,-102.13677460369486],[67.71547904566127,-104.83684255697963],[67.89289134308399,-107.91806213224922],[68.54547580416396,-110.77649213771141],[70.13458263740755,-114.12671731041779],[72.18567318837516,-117.38195487005689],[75.54610046837662,-121.21701985477085],[79.3437745941346,-124.97327256869968],[84.88138645814693,-129.44793329849693],[92.91577221805332,-135.79654257196336],[93.33989212720414,-136.2638584450635],[95.71979212720414,-139.9614584450635],[96.00287606620655,-140.70801655385156],[96.78007606620655,-145.74861655385158],[96.80235952001561,-146.01797450957702],[96.87005952001562,-151.61417450957703],[96.81665201784023,-152.08768531521704],[95.09785201784022,-159.21218531521703],[95.03903693582488,-159.40908521942455],[92.60433693582489,-166.20938521942455],[92.58510032017695,-166.26078735659257],[85.71950032017695,-183.83688735659257],[85.7172675947448,-183.84038036112437],[85.71652425282522,-183.84445879051634],[79.31862425282522,-200.02065879051636],[79.26499500257626,-200.10378123876177],[79.23744048925433,-200.1987874842415],[78.31514048925433,-201.9762874842415],[78.29346631196441,-202.01686247942195],[77.3163663119644,-203.79446247942192],[77.26680744502266,-203.87939536763668],[75.94005046927802,-206.0249825713069],[75.07034820462611,-207.92676354297035],[73.48947131277549,-211.95584592544705],[72.75068049442321,-215.00120724434274],[72.62311363498965,-218.69025319378747],[73.75893413906333,-230.40206646462528],[73.75969417824298,-230.4100782020274],[74.92361274793582,-242.95886109803376],[77.52049899059912,-250.99789570516955],[82.90846142224072,-265.23825838043877],[83.03128260450781,-265.9914617087659],[82.72300254441997,-274.00999558626137],[83.07970266528758,-278.24769437147523],[84.33294581383765,-277.0891545549657],[84.43215951683817,-277.01101332231883],[90.93325951683816,-272.67581332231885],[91.08014021800292,-272.5985575618772],[92.92474021800292,-271.8611575618772],[92.97132042862579,-271.85249110365277],[93.01379068150582,-271.8314886956922],[93.12351044173857,-271.82417546546276],[93.23161842936119,-271.8040614868885],[93.27796944255556,-271.8138801983971],[93.32524411349819,-271.8107291656944],[93.42941060633493,-271.845960556413],[93.53698664975998,-271.86874879906037],[93.57605194393997,-271.89555787048164],[93.62093389284018,-271.9107379292016],[93.70368871401838,-271.9831502810046],[93.79435533581342,-272.0453714415066],[93.82018757406777,-272.0850894347414],[93.8558439310615,-272.1162895585515],[93.9045884092311,-272.2148587472966],[93.96454243812282,-272.3070402180029],[93.97320889634723,-272.35362042862585],[93.99421130430777,-272.3960906815058],[100.98231130430777,-298.36119068150583],[101.00307083430559,-298.67264411349817],[100.9030620707984,-298.9683338928402],[100.69751044144847,-299.2032439310615],[100.41770931849418,-299.3416113043078],[100.10625588650181,-299.3623708343056],[99.81056610715981,-299.26236207079836],[99.5756560689385,-299.0568104414485],[99.43728869569223,-298.77700931849415],[92.6830594228882,-273.68088326258714],[91.75152851431888,-274.0532734241284],[85.37254090301813,-278.30704387720726],[83.24986852284928,-280.26931310858174],[83.28655353374722,-280.70514146137185],[84.29006925058803,-288.3264526217657],[84.28660372856582,-288.3793420602579],[84.30088619748457,-288.4303843332137],[85.31596837924101,-301.67545461529534],[86.17242333522003,-305.5618006584698],[88.43747130641604,-309.2708637678149],[90.241622152068,-311.8127579240122],[91.50776261449282,-313.0992734625987],[95.99586068293353,-316.7589960171051],[96.17943891462822,-316.92982056317396],[98.35933891462822,-319.24172056317394],[98.5835000514758,-319.5300974809978],[100.38300005147579,-322.36559748099785],[100.45703678588328,-322.4927840744833],[101.73403678588329,-324.8936840744833],[101.91709787130762,-325.3968370077215],[102.31689787130762,-327.2813370077215],[102.3563523873455,-327.5848825553015],[102.5402523873455,-331.30028255530146],[102.5415553903075,-331.33187378102383],[102.71565539030749,-336.60757378102386],[102.71669727898193,-336.66766755479443],[102.72959727898193,-344.3299675547944],[102.728619265685,-344.39456006787674],[102.4797263769504,-352.17861678588423],[103.80643301863417,-360.400494372864],[104.97658301983638,-363.3321071352477],[106.83471476532922,-362.52551071844675],[127.72735600679529,-348.27091582686705],[133.2412418393045,-342.72866217183986],[136.1303237357143,-338.9869352802733],[138.6927428754196,-334.96924820469826],[140.43822954640856,-332.12858352821814],[140.77768675067117,-331.7622498629057],[141.23149413828554,-331.55370633552207],[141.7305636482616,-331.5347018076595],[142.19891647178184,-331.70812954640854],[142.56525013709424,-332.0475867506712],[142.77379366447795,-332.50139413828555],[142.77880209646048,-332.63291835784764],[144.22681471654994,-333.53156251766455],[154.37824807627425,-331.86242178921935],[158.16702130871212,-331.0750356144554],[158.46512846545306,-331.06982919747264],[161.37072846545306,-331.5685291974727],[161.49292038403073,-331.5995811912762],[169.02592038403074,-334.16078119127616],[169.06708414041722,-334.17604921729935],[172.4881450672267,-335.55288080739837],[176.58622169328768,-337.0333952106358],[176.64471636912464,-337.05717726065654],[182.29451636912464,-339.61847726065656],[182.5377369002581,-339.7893765702946],[183.70513690025808,-340.9898765702946],[183.8671052800276,-341.232906525248],[183.93104768231072,-341.51787789967017],[184.1783437207855,-348.16950219975064],[184.59965057008395,-349.44862179220934],[185.60942916066733,-351.50653342879593],[188.52189262336174,-355.68819641033747],[195.2020364025654,-362.86250792548356],[202.18446931931837,-369.60167622405595],[202.20853561826317,-369.6259176008969],[205.66699871137317,-373.261594757941],[207.5169548277341,-374.36300601837354],[207.51769593114275,-374.3634477917305],[212.81890869087297,-377.52738792533404],[215.77166300077988,-379.0327817319135],[215.8820913011152,-379.10089019322726],[217.5492913011152,-380.32629019322724],[217.61236218560455,-380.37779040332504],[219.74364730185596,-382.30695558977925],[221.85955868225565,-383.87214086241556],[221.8883268592329,-383.89445167044397],[222.66351728816988,-384.52440326055074],[229.56866825576128,-388.02296956593364],[229.57413980738423,-388.0257682478987],[237.59733980738423,-392.1685682478987],[237.89073778687592,-392.42793357858363],[241.09701793655356,-397.11831245441266],[244.26583681562255,-401.5148422946293],[246.7812643032613,-403.7779013477098],[255.69675001088964,-411.2568972619557],[255.70880668840795,-411.2672167932354],[258.511206688408,-413.7144167932354],[258.6963345824277,-413.9509356452174],[260.1152345824277,-416.7081356452174],[260.13029845129233,-416.7390205108302],[263.65430328983047,-424.3762171167473],[270.7392047852987,-434.969402280456],[274.26886985580177,-439.6204812132616],[274.3533675582968,-439.75906146332585],[275.53686755829676,-442.2347614633258],[275.61396680585375,-442.53723444461787],[275.5694458239651,-442.8461876458591],[275.4100825285397,-443.11458574282835],[275.16013853667414,-443.30156755829677],[274.8576655553821,-443.37866680585375],[274.54871235414083,-443.3341458239651],[274.2803142571716,-443.1747825285397],[274.0933324417032,-442.92483853667414],[272.94501581943666,-440.522736752352],[269.4502301441982,-435.91761878673844],[269.4225204433083,-435.8787495803058],[262.2893204433083,-425.21334958030576],[262.2279015487077,-425.1037794891698],[258.68470175433436,-417.4249837202914],[257.3436276264983,-414.81901459965593],[254.6623704694796,-412.477602768848],[245.74234998911035,-404.99480273804426],[245.7214360799298,-404.97663237799793],[243.1319360799298,-402.646932377998],[243.0180048136835,-402.51996623236187],[239.7932048136835,-398.0457662323618],[239.7817622131241,-398.0294664214163],[236.68382551348014,-393.49758019303215],[228.84279059336833,-389.44884160156755],[221.86393174423873,-385.91293043406637],[221.72097314076711,-385.82014832955605],[220.89340333784733,-385.14763110822173],[218.76034131774435,-383.56975913758447],[218.69923781439545,-383.51970959667494],[216.56886109986493,-381.5913666638751],[214.98695229499089,-380.42865610155945],[212.06843699922013,-378.9407182680865],[212.02180406885725,-378.91495220826954],[206.69807450144555,-375.73757329476166],[204.75394517226587,-374.5800939816265],[204.5835643817368,-374.4440823991031],[201.06103870377956,-370.74106004562935],[194.07553068068162,-363.99892377594404],[194.0456097448767,-363.96846159178324],[187.3123097448767,-356.73706159178323],[187.24133208724552,-356.6491197278375],[184.26163208724554,-352.37091972783753],[184.19990118443027,-352.26610667036005],[183.13890118443027,-350.10380667036003],[183.09725531520613,-350.0016719620543],[182.62325531520614,-348.5625719620543],[182.58365231768929,-348.3420221003298],[182.34358238666834,-341.8847614149334],[181.496116664313,-341.01326698312977],[176.0128613207689,-338.5274689174602],[171.93097830671232,-337.05280478936425],[171.9041158595828,-337.0425507827007],[168.49008818121177,-335.6685497761073],[161.03774835221742,-333.13477402009767],[158.34401885708476,-332.67243822053035],[154.68737869128788,-333.4323643855446],[154.654396472055,-333.4385003267304],[144.4097021639321,-335.1229754066735],[142.32359698432109,-336.90109967241074],[139.71086133546967,-342.42400770655115],[139.62161233791693,-342.56991142183017],[135.38741233791694,-348.07001142183015],[135.27604994190003,-348.1877570125226],[127.40114994190002,-354.9809570125226],[127.25532993441391,-355.0809439737727],[122.19459672723809,-357.7823906174243],[120.42069964695811,-358.98736434671616],[119.6129697906743,-361.45115572098626],[118.80601940686115,-369.04355101009014],[118.72007726717763,-369.32845920194893],[118.53594878214531,-369.56224421036757],[117.80394878214531,-370.1998442103676],[117.5330998102292,-370.35500552254797],[117.22349032515874,-370.3947064688836],[116.92225556441889,-370.3129029401849],[116.67525578963242,-370.1220487821453],[116.52009447745203,-369.8511998102292],[116.48039353111639,-369.5415903251588],[116.56219705981512,-369.2403555644189],[116.75305121785468,-368.99335578963246],[117.24818050996903,-368.562079236829],[118.03088059313885,-361.19784898990986],[118.06620991917762,-361.03317913205495],[118.98530991917762,-358.22967913205497],[119.10643919324419,-357.99765028803273],[119.29597761556462,-357.8171374852777],[121.33077761556461,-356.4349374852777],[121.4035700655861,-356.3909560262273],[126.42340150733553,-353.7113429652617],[134.16927470690146,-347.02944658317534],[138.30131985510994,-341.66204270058563],[140.71617039348772,-336.5574323487814],[138.25779154724978,-340.4119918017415],[138.19173982219013,-340.505970861462],[135.21843982219013,-344.356770861462],[135.11271598842805,-344.4772714128976],[129.45651598842807,-350.1625714128976],[129.27050318274277,-350.3171445265989],[108.17720318274276,-364.7086445265989],[108.06538106252545,-364.7562366304658],[107.9654854040513,-364.8254468344705],[105.48346009908218,-365.90286920898916],[105.45350289687063,-366.04392004901746],[105.36962470069516,-366.166006297654],[105.31708180247547,-366.3044976249873],[105.15947388954089,-366.47188464687457],[105.02928230682927,-366.6613808766703],[104.90506857348595,-366.7420750669737],[104.8035269287453,-366.84991707309007],[104.59385996375423,-366.94424857953],[104.40106155754302,-367.06949810598934],[104.25542270193293,-367.0965152789805],[104.12034110560593,-367.15728999603897],[99.079166229655,-368.3186824121839],[86.68063445345011,-371.38838139850145],[81.7225401750966,-373.48414261715334],[78.66179290271967,-378.75932313259443],[77.22664824558854,-381.47793752428265],[76.04724769009424,-384.29497830677093],[75.93414021534274,-384.5218151565215],[72.8866096937978,-389.7397686039345],[71.9944206147263,-391.69033133732086],[71.94671107278164,-391.7873224093151],[70.09251107278163,-395.30332240931506],[70.04492055895388,-395.3882720964044],[67.95852055895388,-398.90057209640446],[67.82284560597584,-399.0994222364418],[67.38744560597584,-399.6587222364418],[67.0745560154778,-399.9763707780364],[66.3425560154778,-400.5641707780364],[66.16858304492605,-400.68859302376745],[62.79228304492606,-402.8294930237675],[62.71015430689532,-402.87874272358283],[57.211873787461265,-405.9921316927562],[56.42749719690442,-406.4363073303554],[52.987071391152206,-409.02641461385997],[62.076696851177495,-420.0312131137996],[67.87675116647637,-426.1966762378243],[67.8914224392222,-426.21281417881227],[73.9153224392222,-433.0701141788123],[73.96773276582041,-433.1385751245596],[80.71451227312583,-443.3034551505379],[81.73437852004146,-444.7337662562297],[82.7443088058414,-446.1087315850899],[82.78710189995044,-446.1752477671414],[92.76450189995045,-464.0185477671414],[92.78810668309232,-464.06512682949057],[95.46343111570822,-469.92573255249744],[97.65172878567013,-474.60015064801524],[97.65689197557332,-474.6114647229604],[102.33919197557331,-485.1414647229604],[102.34033615545138,-485.1440532642762],[105.5726732315688,-492.5006940629187],[108.82056151913075,-497.18985222186194],[112.92561188357584,-500.3112003315882],[115.60362820012105,-501.2859952198094],[121.71940580769198,-502.63854679140394],[130.49481710591294,-504.2287561741962],[130.53413375545227,-504.237164275381],[136.96763375545228,-505.82586427538104],[137.0583368789318,-505.8555944013573],[142.96283687893182,-508.2921944013573],[143.05605182244224,-508.3399307621359],[150.02805182244222,-512.6645307621359],[150.07728095044263,-512.6983459158531],[153.7284223848152,-515.4656244648744],[159.5689585884323,-518.3754492043203],[164.76515915434956,-519.6826731554086],[169.03156247496403,-519.902745542404],[170.31573428102445,-519.8829388011588],[171.04754318591512,-515.0259466945181],[171.1297779292125,-514.7950863657636],[172.33907792921252,-512.7538863657636],[172.3997652856596,-512.6683185340692],[175.07636528565962,-509.4837185340691],[175.30248674367013,-509.3124026103775],[181.77446936881066,-506.3842557147893],[190.08775201539186,-502.6190088664273],[190.3309525194537,-502.5623396349977],[190.57732686344582,-502.60305289560404],[190.78936678688444,-502.73495042338567],[190.9347911335727,-502.9379520153919],[190.9914603650023,-503.1811525194537],[190.95074710439593,-503.42752686344585],[190.81884957661433,-503.6395667868844],[190.61584798460814,-503.7849911335727],[182.30244798460814,-507.5502911335727],[175.96264279112464,-510.4186364829947],[173.41349663103293,-513.4515927937725],[172.29465631708166,-515.3401042043714],[171.50065681408486,-520.6098533054819],[171.4759189993842,-520.6784961550144],[171.46278967738226,-520.750269556577],[171.43398747519356,-520.7948483607574],[171.4159933273141,-520.8447787851018],[171.3668700853666,-520.8987297569993],[171.32727368183086,-520.9600153596732],[171.28360434694287,-520.9901786788462],[171.24787237584465,-521.0294223136743],[171.18184227493373,-521.0604678615322],[171.12180698336002,-521.101935487866],[171.0699187761461,-521.1130912301185],[171.02188885051754,-521.1356735877725],[170.94900437494232,-521.139087308358],[170.87767002425164,-521.1544238881471],[169.02987002425166,-521.1829238881471],[169.00851404475992,-521.1790172942653],[168.98703093674274,-521.1821502490557],[164.63673093674274,-520.9577502490556],[164.51355847898742,-520.9392607973892],[159.1894584789874,-519.5998607973893],[159.12695154749153,-519.5702190340231],[159.06020302403712,-519.5520425316885],[153.10410302403713,-516.5846425316885],[153.00291904955736,-516.5218540841469],[149.32794385471226,-513.7365114159223],[142.42599623020914,-509.45536358216935],[136.6143030811023,-507.0570620279118],[130.2467924520721,-505.48465756123886],[121.47908289408704,-503.8958438258038],[121.45499846866221,-503.89100026143046],[115.28609846866222,-502.52670026143045],[115.20539190633089,-502.50319774403147],[112.39659190633088,-501.48079774403146],[112.22812794621781,-501.3888535228542],[107.96492794621781,-498.14725352285427],[107.82617829626686,-498.0022117902332],[104.48537829626686,-493.1789117902332],[104.42556384454862,-493.0719467357238],[101.16903307278795,-485.66024227130396],[96.48983465286759,-475.137217398536],[94.30287121432987,-470.4656493519848],[94.30029331690767,-470.4600731705094],[91.6345448000258,-464.62044459175826],[81.6892356567893,-446.8345349724675],[80.7000911941586,-445.48786841491005],[80.69480325208765,-445.4805618108944],[79.66610325208765,-444.0378618108944],[79.66163650109728,-444.02794151369295],[79.65396723417959,-444.02022487544036],[72.92516142808124,-433.8824245126102],[66.93697568902047,-427.0657798026281],[61.13024883352364,-420.8932237621757],[61.10295596798783,-420.8622696103386],[51.86954764531078,-409.6833933732925],[51.50328751089819,-409.83329231225497],[41.57418751089819,-411.147792312255],[41.30391552224511,-411.1643129349721],[32.32621552224511,-411.0788129349721],[32.205968785087734,-411.0738958492109],[22.012468785087734,-410.33649584921085],[21.658866456788925,-410.2773568305897],[13.389752544058847,-408.0845646593344],[6.591147764061575,-406.3262376173405],[6.51845316996609,-406.3059039043541],[5.268030036770737,-405.92948766850657],[-3.853650214339665,-403.60554253912227],[-8.806549604612332,-403.2421682464031],[-22.67407549195427,-402.58434343987295],[-23.40107730528614,-402.4035414871375],[-24.003549488870938,-401.95829071430563],[-24.389771114181816,-401.31637651533276],[-24.410880367682786,-401.1757045204698],[-30.245688264000776,-398.2210825272143],[-43.09058761112403,-393.0428360007226],[-49.04259329793955,-391.6763247362269],[-56.5648127358338,-391.4802185763477],[-60.76466672268456,-391.38416536990854],[-60.77901617840071,-391.3837566704855],[-81.36177083506232,-390.68198890190916],[-82.67002544510568,-390.6393197361218],[-82.67418856765968,-390.6383495638273],[-82.67841053741554,-390.6390187387368],[-87.95421053741555,-390.4323187387368],[-87.95941499541075,-390.43210422711326],[-106.73401499541076,-389.62000422711327],[-106.91492422596434,-389.59921355917476],[-117.93472312526198,-387.52996442725225],[-153.8444859276092,-380.92879801841514],[-162.78155786169867,-380.6139831413541],[-176.07872890319086,-383.76777851713075],[-183.5372049119601,-386.0116790051572],[-187.0392538390945,-387.85956782661265],[-187.05079315286997,-387.8655818678178],[-214.53229315286998,-402.0111818678178],[-214.88453171171912,-402.1316093780777],[-221.4817621614234,-403.3559974123453],[-228.26693519540373,-407.2814667521762],[-233.6114666059302,-411.70670401146816],[-238.1356354780682,-417.57014665090463],[-240.31172864999556,-421.1198482240974],[-241.52314325218123,-423.09867524355224],[-245.3645768608087,-429.4108477535959],[-247.2720740236979,-433.41133487560296],[-249.24597728792781,-439.388655736045],[-250.09195324632813,-448.33566145228434],[-250.14595962504305,-451.7550142185116],[-250.14770037407183,-451.8045233547835],[-250.747896152249,-462.8067191319967],[-250.34126784098507,-478.50505441510876],[-250.0859887431604,-480.64600671253737],[-249.3686736397469,-481.8856566363504],[-248.63226193098686,-483.13960074436085],[-248.61565617105663,-483.1687445057602],[-245.27711637228882,-489.21071084970504],[-243.71424396318525,-490.04745173659563],[-243.26797480270596,-490.44445833801336],[-242.65527480270597,-491.3243583380133],[-242.64593064420163,-491.3379637286186],[-240.29823064420162,-494.8039637286186],[-240.11886243185447,-495.2009603403406],[-239.367721439607,-498.1019951546028],[-236.5149264735619,-501.9992178994757],[-232.89379195555435,-506.26581917744585],[-212.87578064386594,-527.1158004981024],[-208.70299215919562,-531.461788504807],[-208.51238095360162,-531.7177570926011],[-205.05218095360163,-537.8305570926011],[-204.95504682029727,-538.0466724479093],[-204.34554682029727,-539.8277724479093],[-204.32653643322197,-539.8881609884697],[-202.85933643322198,-544.9857609884697],[-202.81192807269161,-545.2593918229346],[-202.61842807269161,-548.3335918229346],[-202.6175493316493,-548.4789582075435],[-202.8110493316493,-552.2869582075435],[-202.9940360539406,-552.8842520861976],[-204.1807360539406,-554.8470520861977],[-204.32573037792548,-555.0422366340657],[-205.28343037792547,-556.1037366340657],[-205.43271526169903,-556.2149809164953],[-205.57000513500824,-556.3407297040974],[-206.88570513500824,-557.1387297040974],[-207.10844266000214,-557.2459107617835],[-209.1843159802379,-558.0078706192642],[-211.26008982628065,-558.7734290478692],[-211.703,-558.8525],[-219.225800785786,-558.8525],[-224.51552866716477,-559.5807702530251],[-226.82044479498043,-560.5236449420302],[-228.28073159090866,-562.3391032572476],[-230.40529502467277,-567.1778914280361],[-230.41763857022437,-567.1955494673624],[-230.42297921778487,-567.2164216247321],[-230.56027748060708,-567.3996013322392],[-230.69143420524026,-567.5872273746755],[-230.70959559343228,-567.5988176054142],[-230.72251713722682,-567.6160571870678],[-230.91946403130623,-567.7327513991306],[-230.9376283885103,-567.7443435246327],[-232.36393220531414,-576.8047058386184],[-232.4158601285501,-576.9882841460649],[-234.7086601285501,-582.4848841460649],[-234.7854857846824,-582.6267877003573],[-247.69822463880743,-601.6136599884952],[-248.51283978205342,-604.8598241241426],[-248.84243295822387,-606.5715663828523],[-249.66331145586588,-611.3794406627303],[-249.67616294437892,-611.4403301013562],[-251.7434110066508,-619.6418341866233],[-252.42159576851958,-624.150814514701],[-252.93557610364914,-635.1242299115819],[-252.95939154415277,-635.2840227124136],[-253.20769154415277,-636.2601227124136],[-253.2283332436235,-636.328377092835],[-253.88623324362348,-638.198577092835],[-254.03304363594629,-638.4532063743884],[-256.1991489394274,-640.9847671449708],[-256.330471106671,-642.6059812282444],[-256.069153833996,-643.9131908886321],[-254.48486814289186,-645.3355933442602],[-252.8205976483979,-646.4434547882416],[-252.60117665319606,-646.6612953631115],[-251.24027665319605,-648.6739953631115],[-251.16641166577176,-648.8099499945878],[-250.40861166577176,-650.5981499945877],[-250.38576026758207,-650.7083386377369],[-250.35085795820024,-650.8153225256738],[-250.00585795820024,-653.7007225256738],[-250.02012789435344,-653.9731472033934],[-250.12510417141738,-654.2249384211955],[-254.65270417141738,-661.3458384211955],[-254.75790954118068,-661.4780488978943],[-258.0568095411807,-664.8265488978942],[-258.1901163355391,-664.9354690803772],[-264.54611633553907,-669.0748690803772],[-264.57126329440496,-669.0905902544775],[-273.78446329440493,-674.6155902544775],[-273.7855623878766,-674.6162481664168],[-289.2643575504858,-683.8649541057587],[-295.7544613533956,-689.2092665509965],[-295.9318516351382,-689.3199449865597],[-299.0889516351382,-690.7555449865597],[-299.3388031552754,-690.8231585446157],[-316.1214130066831,-692.5374999139373],[-318.31757232649295,-693.1053362605086],[-318.8436980882504,-693.6676247019615],[-318.8814256177916,-695.2494959542759],[-317.791880581027,-696.0696854302366],[-315.1290033551486,-696.9879665727428],[-311.0548278271889,-697.1608617368765],[-302.4342254768677,-695.6077111377782],[-296.33691524918726,-694.0009576165827],[-287.7365513074836,-689.7965842990935]],"holes":[[[-27.62661565332857,73.15181681267151],[-27.554216856400068,73.2121331081658],[-27.2561904006926,73.30494706231063],[-26.94533149557407,73.27664618787075],[-26.68768872807323,73.1413697029025],[-16.964468624757068,72.9783100230387],[-16.768824239943527,72.94421271500448],[-15.035446537761946,72.3537214098657],[-13.6040270210489,77.17427896458423],[-12.12345012877902,84.62016853781168],[-12.019011399688827,87.82451264649407],[-11.816925378214025,94.21558252741691],[-11.83022352518267,97.43447746850438],[-28.05216624453158,97.33455303612715],[-42.203988915542126,73.22900787041897],[-27.62661565332857,73.15181681267151]],[[-17.086431108425987,71.7001753707038],[-26.52994619302819,71.85854436061888],[-34.00704416004654,46.538277865209125],[-31.835646645545406,46.92237059628755],[-31.668780191280977,46.93412652246693],[-21.48200328970885,46.58349631331559],[-17.876269582630712,47.99016055728261],[-18.46445821886957,49.58993968138392],[-18.570545869496897,50.03947572738785],[-18.864045869496895,52.66847572738786],[-18.86578434029179,53.07832938476812],[-18.459384340291788,57.021729384768115],[-18.424501568424176,57.23814220308056],[-15.366280866514119,71.1141901234591],[-17.086431108425987,71.7001753707038]],[[-43.32178892223369,71.95490897255813],[-43.38091584190048,71.9624917665618],[-43.40654413691685,71.96099889483675],[-43.428335938544514,71.96857320673342],[-43.476617253433375,71.9747650947447],[-72.99041996373892,79.50472795222437],[-85.7429150615184,82.64914604617603],[-89.22480362014127,71.84091100714895],[-89.10390495391512,69.93293110692804],[-89.06538515735829,69.871808266287],[-88.99021840872663,69.77058739930081],[-88.98268085405648,69.7405738776633],[-88.96618191385804,69.7143935189221],[-88.69287680542375,69.00126574780073],[-86.76583798150966,67.18306802584183],[-42.5867185992609,48.947376377164254],[-37.8060879902385,47.10823779516421],[-35.683750823541054,46.50982379671454],[-28.19344991907518,71.87480040508098],[-43.32178892223369,71.95490897255813]],[[-78.97990427217749,112.49746009784786],[-72.93914887408876,110.25541870714214],[-60.86233600066939,107.33045305911948],[-60.000482586455206,107.57066988122952],[-57.681755989946126,111.15007417433613],[-53.1906877301352,119.32142582920676],[-53.161789601280674,119.36987544874061],[-51.10438960128067,122.55807544874062],[-47.340510697809,128.38659518507524],[-65.19538028469162,134.7983163173475],[-70.1516589516458,136.57587280156545],[-70.16298551040046,136.58005604502853],[-89.26328551040046,143.8398560450285],[-101.69680210806033,148.56582248678828],[-103.80100892713406,148.91764653145293],[-107.51578088223015,148.20700264905614],[-109.06687811532306,147.0891648079494],[-110.37001734755077,145.48535791145054],[-117.67774975553871,128.56395857603954],[-118.3354260334497,127.04424810784518],[-116.65199544240211,126.0740304183377],[-98.9167999948189,119.77905209259868],[-91.47409751253953,117.13948667740216],[-91.4628758142308,117.13541237028365],[-78.97990427217749,112.49746009784786]],[[-153.06224428088038,157.84923014579414],[-139.2337136938705,144.60201364566697],[-104.63010402517408,184.79435564479212],[-118.29116332514748,195.08973828700152],[-153.06224428088038,157.84923014579414]],[[-123.6645473723804,131.68113625556896],[-119.43859407175259,127.71794797738505],[-118.85275394194713,129.0716644169777],[-111.51005024446128,146.07404142396047],[-111.41920596811812,146.2238878853928],[-110.00670596811813,147.96228788539278],[-109.88418598900485,148.07791560611412],[-108.14928598900484,149.32821560611413],[-107.89535273576845,149.43760104958565],[-103.92885273576846,150.19640104958566],[-103.70305690731644,150.19903740033905],[-101.42315690731644,149.81783740033904],[-101.30130891415779,149.78484183578172],[-88.8085117029604,145.03634289580262],[-69.71385803761517,137.7786890013783],[-64.7631410483542,136.00312719843456],[-46.62722798341906,129.49048281680973],[-45.35926411419019,131.4507067819186],[-39.83803232719463,141.77331317462918],[-39.741091836256416,141.91536276840884],[-38.09434488187142,143.8447118459203],[-35.511391349198476,146.8982865659404],[-75.3018166093123,168.8164088565539],[-80.01996828819738,169.23959871750722],[-80.4107829283562,169.38348768264763],[-82.12638292835621,170.59818768264765],[-82.26732103573993,170.7256246132873],[-85.14594292157733,174.03014718349058],[-98.3256625311157,182.02740362479665],[-103.23173142648747,183.96629218882728],[-138.01722822102465,143.5626869822789],[-129.6318022550727,137.1808018655018],[-129.5738753191155,137.13222675582608],[-123.66937531911552,131.6856267558261],[-123.6645473723804,131.68113625556896]],[[142.7073432530456,-334.471649511345],[142.19756438111912,-334.15527809323777],[141.22876060292006,-335.7319424796873],[142.7073432530456,-334.471649511345]]],"color":2961718},{"outer":[[-243.6859215398228,-641.9245987858224],[-243.50198580222525,-642.0934938165402],[-243.39668466902606,-642.3199216379618],[-243.38604928319762,-642.569410666849],[-243.63114928319763,-644.151010666849],[-243.6489125750769,-644.2312115867204],[-244.36151257507692,-646.6891115867204],[-244.39396298788532,-646.7766067212619],[-248.55076298788532,-655.8853067212619],[-248.6967647015317,-656.0878934596706],[-248.90917928488705,-656.2191867639352],[-249.15566854317854,-656.2591984186582],[-249.39870672126193,-656.2018370121147],[-249.60129345967061,-656.0558352984683],[-249.73258676393525,-655.843420715113],[-249.77259841865828,-655.5969314568215],[-249.7152370121147,-655.353893278738],[-245.57786016415832,-646.2877547839872],[-244.88974784996228,-643.9143177126114],[-244.65095071680236,-642.3733893331511],[-244.56530121417765,-642.1388215398229],[-244.39640618345973,-641.9548858022252],[-244.16997836203817,-641.8495846690261],[-243.92048933315107,-641.8389492831976],[-243.6859215398228,-641.9245987858224]],"holes":[],"color":2961718},{"outer":[[-97.518475611645,-409.6693756752182],[-100.1831154429813,-412.1183770301558],[-101.40291099016564,-414.69063802224065],[-101.45875794779413,-417.8141538464756],[-99.39659690673845,-420.8303382468815],[-94.61550651906123,-422.38953433603626],[-83.70081339825829,-421.01142380841736],[-83.66163744398547,-421.0068856307104],[-77.91833744398546,-420.40128563071045],[-77.53197831711282,-420.39963564293043],[-66.20017831711282,-421.49673564293045],[-65.79600137937587,-421.5804398862144],[-37.424401379375865,-430.72833988621437],[-37.10356713485253,-430.8650669279375],[-4.762367134852534,-448.2736669279375],[-4.654666374443589,-448.336228052139],[3.0042336255564113,-453.12392805213904],[3.3600126526323297,-453.410410273944],[9.775484524157694,-459.9785373376864],[14.483853308439853,-462.236244535175],[15.083184434094154,-462.68571442796286],[15.464889512966282,-463.3303245546782],[15.570857406963114,-464.07193886693403],[15.384955464824984,-464.7976533084398],[14.935485572037118,-465.3969844340941],[14.290875445321747,-465.77868951296625],[13.549261133065935,-465.8846574069631],[12.823546691560148,-465.69875546482496],[7.809046691560147,-463.29425546482497],[7.265687347367671,-462.904589726056],[0.7737159218256228,-456.25814281286785],[-6.637298382372113,-451.62540009730714],[-38.76945036512914,-434.3293263274092],[-66.77683496227263,-425.2988608775858],[-77.70875868909006,-424.2404753147722],[-83.23935127343739,-424.82364646534427],[-94.56128660174171,-426.2531761915826],[-95.39708954771723,-426.1736849879898],[-101.20818954771723,-424.2785849879898],[-101.7643890318305,-423.98958309336376],[-102.19786798475428,-423.53684038652307],[-104.97436798475428,-419.4758403865231],[-105.22872681029308,-418.9429058061589],[-105.30909318347987,-418.3578768110327],[-105.23489318347988,-414.20787681103275],[-105.05002264315637,-413.419527284522],[-103.49252264315636,-410.135127284522],[-103.05693945991494,-409.5441604328543],[-99.85153945991495,-406.5981604328543],[-99.25030410536527,-406.22317195904424],[-93.27150410536527,-403.88997195904426],[-92.79183468147913,-403.77105446532374],[-78.88248096275008,-402.1790115711683],[-68.95895321054896,-401.0194960583669],[-61.853286457882845,-400.0906712318558],[-56.914258666962446,-398.7397285323674],[-56.16698038654695,-398.6868498568919],[-55.45634948515095,-398.92396734819505],[-54.890553075626826,-399.41498201770133],[-54.555728532367404,-400.08514133303754],[-54.50284985689188,-400.83241961345306],[-54.73996734819502,-401.543050514849],[-55.230982017701336,-402.10884692437315],[-55.90114133303755,-402.4436714676326],[-60.96724133303755,-403.8293714676326],[-61.224942220078255,-403.8812040354439],[-68.47424222007827,-404.8288040354439],[-68.50027336775506,-404.83202603337304],[-78.43907336775506,-405.993326033373],[-78.44356531852087,-405.99384553467627],[-92.10761437186426,-407.55781124010474],[-97.518475611645,-409.6693756752182]],"holes":[],"color":2961718},{"outer":[[-23.08223327679715,-507.69077446095156],[-23.523070832731165,-507.0850655936078],[-23.6985568794518,-506.35676233938796],[-23.581975257130818,-505.6167422666617],[-23.19107446095155,-504.97766672320284],[-16.317075164681466,-497.52909166221315],[-14.025202068785926,-494.5103913726329],[-13.480772773184308,-494.0231819970663],[-10.523672773184307,-492.2563819970663],[-9.817965686670744,-492.00498889703107],[-9.069773379098308,-492.0427943674053],[-8.393001346914748,-492.364042868032],[-7.89068199706626,-492.9198272268157],[-7.63928889703103,-493.6255343133293],[-7.677094367405298,-494.3737266209017],[-7.9983428680320205,-495.05049865308524],[-8.554127226815693,-495.55281800293375],[-11.19180188866167,-497.128768627718],[-13.314397931214074,-499.9245086273671],[-13.432625539048452,-500.0656332767972],[-20.36912553904845,-507.5819332767972],[-20.974834406392254,-508.02277083273117],[-21.70313766061205,-508.19825687945183],[-22.44315773333832,-508.0816752571308],[-23.08223327679715,-507.69077446095156]],"holes":[],"color":2961718},{"outer":[[-242.96879588067497,-664.6712529476985],[-242.85669879915696,-664.6633969674341],[-242.75012824639612,-664.6990366839735],[-242.66530862298578,-664.7727462735485],[-242.52844333397516,-664.9494538869758],[-239.28253824042838,-663.7125932092243],[-238.6817374705351,-663.000263989159],[-238.53156475009797,-661.8759702681427],[-238.4823082983905,-661.749328522579],[-238.38046904488704,-661.6593668851991],[-231.06676904488702,-657.8014668851991],[-231.06371478728374,-657.8005586244911],[-231.06119751550398,-657.798604968992],[-231.00996948905038,-657.784576101414],[-230.95905866766518,-657.7694364816816],[-230.95588932525308,-657.7697661719862],[-230.9528160377861,-657.768924547862],[-230.9001188974576,-657.775567681239],[-230.84728974995272,-657.7810632243104],[-230.84448782638424,-657.7825806732674],[-230.84132640338714,-657.7829792101614],[-230.79518281109733,-657.8092829876574],[-230.74847809628363,-657.8345770469167],[-230.74647015902232,-657.8370512366782],[-230.7437018984883,-657.8386292609612],[-230.71113679787308,-657.8805891708945],[-230.67766688519913,-657.9218309551129],[-230.67675862449101,-657.9248852127164],[-230.67480496899202,-657.927402484496],[-230.197504968992,-658.8820024844961],[-230.16782454786195,-658.9903839622139],[-230.17321521001983,-659.0331457831916],[-228.62320815659527,-662.0244832156129],[-228.59717413329332,-662.1144349109022],[-228.60754485551607,-662.2075022304901],[-228.65274147481597,-662.2895165186268],[-228.72588321561295,-662.3479918434048],[-228.81583491090223,-662.3740258667067],[-228.90890223049013,-662.3636551444839],[-228.99091651862676,-662.318458525184],[-229.04939184340472,-662.2453167843871],[-230.59961892884112,-659.2535547151928],[-230.6437981015117,-659.2283707390388],[-230.71269503100797,-659.139597515504],[-231.0583653901056,-658.4482567973088],[-237.98030738923353,-662.0995085629588],[-238.12193524990204,-663.1598297318573],[-238.18724947736902,-663.3073818445226],[-238.89024947736903,-664.1408818445226],[-239.00784978546977,-664.2243234911705],[-242.5228497854698,-665.5637234911704],[-242.64301911932102,-665.5820605479615],[-242.76004951299421,-665.5491849733397],[-242.85309137701424,-665.4709537264515],[-243.03848647968078,-665.2315889731956],[-243.5520642583963,-665.3567731083903],[-243.66665752184278,-665.3565464931494],[-244.45675752184277,-665.1606464931493],[-244.53963574783765,-665.1221777273369],[-245.16523574783764,-664.6697777273369],[-245.2491851456484,-664.5599257192233],[-245.4652851456484,-663.9864257192233],[-245.48028014481463,-663.9159899334251],[-245.47370440455208,-663.8442765486143],[-245.3372387622656,-663.2915090258598],[-245.81543192324185,-662.8559130781674],[-246.3237118032013,-662.6687617268939],[-246.43623038524493,-662.5934028366465],[-247.29083038524493,-661.6637028366465],[-247.34618940217823,-661.575790221996],[-247.36675385551646,-661.473955297587],[-247.3498477559585,-661.3714495300994],[-247.29767104243768,-661.2816116809674],[-245.78090906471306,-659.5081288220466],[-246.59723737290125,-658.2055371133096],[-246.59800704696664,-658.2043020426871],[-247.1808466425917,-657.2637528072728],[-248.82745824820924,-656.1686750487607],[-248.6967647015317,-656.0878934596706],[-248.55076298788532,-655.8853067212619],[-248.47221271530282,-655.7131813200224],[-246.80961497584948,-656.8188906443199],[-246.72429295303334,-656.9069979573129],[-246.10877622986223,-657.9002794496976],[-245.18046262709873,-659.3815628866904],[-245.13921300664896,-659.495062309592],[-245.14812404536332,-659.6154958745781],[-245.2056289575623,-659.7216883190325],[-246.69394435748006,-661.4619098496261],[-246.05931463080898,-662.1523091673023],[-245.5635881967987,-662.3348382731061],[-245.46915705839683,-662.3921912509963],[-244.86295705839686,-662.9443912509963],[-244.79624343492853,-663.0348167150786],[-244.7692124106347,-663.1438891489764],[-244.78597921392725,-663.2550032633728],[-244.84399125099634,-663.3512429416031],[-244.86059945682945,-663.3634960563832],[-244.9898260638962,-663.8869411541045],[-244.8254687792517,-664.3231230270504],[-244.29607378818002,-664.7059527808242],[-243.60841125374665,-664.8764540977404],[-243.0954300738188,-664.7514153829794],[-243.0693537264516,-664.7214086229858],[-242.96879588067497,-664.6712529476985]],"holes":[],"color":11970187},{"outer":[[-253.11705458443996,-635.9038168873002],[-252.9635666967083,-635.3004357869585],[-252.51176725282042,-635.6357291628942],[-252.49939312045046,-635.6493903805325],[-252.48386558167172,-635.6593223269044],[-251.68800219989967,-636.4239790884312],[-247.92336734221584,-637.7213144287092],[-247.84447829743272,-637.7631412977076],[-246.29021706478827,-638.9280122427681],[-245.24865584195402,-639.7080832008451],[-245.16936086777588,-639.799062644234],[-244.0368161494345,-641.8439081408231],[-244.16997836203817,-641.8495846690261],[-244.39640618345973,-641.9548858022252],[-244.54448059913568,-642.1161467745044],[-245.6433391544094,-640.132122716337],[-246.63554415804597,-639.3890167991549],[-248.15375885031605,-638.2511616467609],[-251.93563265778417,-636.9478855712908],[-252.0413344183283,-636.8832776730956],[-252.8697334300459,-636.087361037075],[-253.11705458443996,-635.9038168873002]],"holes":[],"color":11970187},{"outer":[[-20.260851939265482,-507.48943270818853],[-20.262093555328054,-507.49900034934956],[-20.26020019997242,-507.5084606122069],[-20.269284919647394,-507.5544155419679],[-20.27531346627454,-507.60087029766055],[-20.505536409337783,-508.2832265245105],[-20.387285383195504,-508.8778357410557],[-15.984311508548712,-512.9216582133848],[-14.666700763853907,-514.0513074901858],[-14.215429242801886,-513.5175561155601],[-14.131278440513166,-513.4495153250847],[-14.027957009270535,-513.4173347635557],[-13.920052955931736,-513.4255580212681],[-13.822801310162498,-513.4730240521694],[-12.520956754494515,-514.4485134741772],[-11.792826946978073,-514.4214499732923],[-11.553330884270704,-514.135762731979],[-9.190446976632574,-511.2655540440699],[-9.1904080928343,-511.26552223248075],[-9.190384327509687,-511.2654779703488],[-9.146922666232363,-511.2299459619639],[-9.103473166130732,-511.19439908361346],[-9.103425068417195,-511.1943845737227],[-9.103386173735663,-511.19435277544096],[-9.049635323453929,-511.1781575378436],[-8.995890018246293,-511.1619439083399],[-8.995840029058542,-511.1619489091469],[-8.995791926382601,-511.1619344157154],[-8.939934966789519,-511.1675415270585],[-8.884076092001,-511.17312952447753],[-8.884031821739521,-511.17315327465474],[-8.883981834265727,-511.17315829256717],[-8.83452248127524,-511.19971412093236],[-8.785054044069929,-511.2262530233674],[-8.78502223248069,-511.2262919071658],[-8.784977970348825,-511.22631567249033],[-8.581777970348826,-511.3937156724903],[-8.510652775440981,-511.4807138262643],[-8.47823441571542,-511.5883080736174],[-8.48945829256719,-511.70011816573424],[-8.542615672490314,-511.7991220296512],[-8.629613826264338,-511.870247224559],[-8.7372080736174,-511.9026655842846],[-8.849018165734273,-511.8914417074328],[-8.92572337134507,-511.85025697387374],[-11.109453023367426,-514.5028459559301],[-11.110465402152803,-514.5036742026405],[-11.11109401480364,-514.5048212639091],[-11.43359401480364,-514.8895212639092],[-11.527699113136874,-514.9631816874954],[-11.643602855275633,-514.992301270141],[-12.601402855275634,-515.0279012701409],[-12.698022484247488,-515.0149842059864],[-12.784798689837501,-514.9705759478305],[-13.950890848310227,-514.096807600662],[-14.414070757198115,-514.6446438844399],[-14.41486089421298,-514.6452732086092],[-14.415356126695936,-514.6461536120394],[-14.458780722199347,-514.680254241949],[-14.501969517899381,-514.7146530265426],[-14.502940341248504,-514.714932073917],[-14.503734792209835,-514.7155559433601],[-14.556903633304868,-514.7304429441236],[-14.609968722641167,-514.745695640574],[-14.610972433269982,-514.7455819287204],[-14.611945154752737,-514.7458542857091],[-14.666763767367488,-514.7392612464088],[-14.721626471516764,-514.7330457699501],[-14.722510263580665,-514.7325566104674],[-14.723513167556865,-514.7324359911191],[-14.771635914839182,-514.7053666422217],[-14.819943884439875,-514.6786292428019],[-14.820573208609128,-514.677839105787],[-14.821453612039344,-514.677343873304],[-16.362953612039345,-513.355743873304],[-16.37031182753688,-513.3492140067317],[-20.84621182753688,-509.2384140067316],[-20.902454447800935,-509.1674228692996],[-20.933868351221907,-509.0824749994034],[-21.08546835122191,-508.32017499940343],[-21.075886533725463,-508.17192970233947],[-21.030050009184343,-508.03607513666657],[-20.974834406392254,-508.02277083273117],[-20.36912553904845,-507.5819332767972],[-20.266036165239157,-507.47022698971256],[-20.260851939265482,-507.48943270818853]],"holes":[],"color":11970187},{"outer":[[-279.68519990381975,-469.850670877617],[-279.7703130499524,-469.81162180323486],[-279.83400390979676,-469.74297377174827],[-279.8665761273007,-469.6551778236551],[-279.86307087761696,-469.56160009618026],[-279.8240218032348,-469.4764869500476],[-279.7553737717482,-469.41279609020324],[-278.74075457293156,-468.78848081340544],[-279.89073766957756,-465.9119511976835],[-279.9386684704046,-465.8755951026623],[-279.99539583950326,-465.778592640292],[-280.010683859499,-465.6672654263891],[-279.98220506793376,-465.5585620200867],[-279.9142951026623,-465.46903152959544],[-279.817292640292,-465.4123041604968],[-269.6533589644976,-461.8988362211873],[-269.65565669095463,-462.10474599936003],[-269.5626748900367,-462.3365050804438],[-269.4879420023514,-462.4510984510469],[-279.38908320579503,-465.87372430541683],[-278.2200488013701,-468.7979082311926],[-278.20301119257334,-468.8796952021656],[-278.21504089697225,-468.962367295078],[-278.25468027596685,-469.0359071371187],[-278.31712622825177,-469.0914039097968],[-279.50382622825174,-469.8216039097968],[-279.5916221763449,-469.8541761273007],[-279.68519990381975,-469.850670877617]],"holes":[],"color":11970187},{"outer":[[-58.548535524897126,-393.53505316633147],[-58.580145359523485,-393.5085178194424],[-58.63201162345494,-393.4088314975293],[-58.641781499299505,-393.29688498513724],[-58.437729695175506,-391.4373838302107],[-57.68697391365859,-391.45455407000793],[-57.87617908987938,-391.60056856227834],[-58.069218500700494,-393.3597150148628],[-58.08509913281502,-393.4100443319608],[-56.66066887967879,-398.7217840899594],[-56.914258666962446,-398.7397285323674],[-57.13651393282155,-398.80052068449646],[-58.548535524897126,-393.53505316633147]],"holes":[],"color":11970187},{"outer":[[-109.78751076058407,2.1252535209213685],[-114.18465889030458,1.8657169684293529],[-114.27741977504328,1.8785425723991753],[-114.3582115117217,1.9258899391600235],[-114.41473429080943,2.0005508613275067],[-114.43838303157065,2.09115889030457],[-114.42555742760084,2.1839197750432846],[-114.37821006083998,2.2647115117216945],[-114.3035491386725,2.3212342908094286],[-114.21294110969544,2.3448830315706477],[-109.80794110969543,2.6048830315706475],[-109.79222387341737,2.6052948245796053],[-105.66663957095963,2.5782007274489875],[-105.7148558766605,2.4338502334271706],[-105.69292132875695,2.122477347655432],[-105.68084322984659,2.098283656581263],[-109.78751076058407,2.1252535209213685]],"holes":[],"color":11970187},{"outer":[[-195.15323236556262,155.67308988904344],[-194.96951796673716,156.12880860904005],[-194.92312885777403,156.3741775914652],[-194.974169553862,156.61862131568333],[-194.9945328835222,156.64847944199832],[-171.26428895260753,146.59232914028996],[-171.2878026428283,146.5886615849786],[-171.50102636881988,146.45868647335712],[-171.64828008327194,146.25700794067],[-171.85939746616296,145.8018763636579],[-195.15323236556262,155.67308988904344]],"holes":[],"color":11970187},{"outer":[[-46.740366724229155,230.4093471190813],[-46.66076078712996,230.48865895230514],[-46.55686316661236,230.53146965846085],[-46.44449133356589,230.53126169561622],[-40.733528909232504,229.3842893258958],[-39.13936644459543,229.06573837007514],[-38.73027589350929,239.42955936243513],[-38.69663239046825,239.55370176425012],[-38.61230205828922,239.65081827314455],[-38.17497951623453,239.9700462803571],[-38.09188420486147,242.89946606338938],[-38.09134562554712,242.90182238520578],[-38.091710419924595,242.9042117879015],[-38.07884582563013,242.95650987590614],[-38.066845307438044,243.0090129744667],[-38.06544599971243,243.01098382658427],[-38.06486864094645,243.01333094759426],[-38.03296969376009,243.0567250135905],[-38.001790594655816,243.10063915225228],[-37.999743590435386,243.10192449030194],[-37.99831197616433,243.1038720017291],[-37.95223500163065,243.13175569253724],[-37.90662405681344,243.16039534177156],[-37.90424099393466,243.16079948468686],[-37.902173074453636,243.16205089557067],[-37.84893287425564,243.17017917203177],[-37.79583393661062,243.17918420486146],[-37.79347761479427,243.17864562554712],[-37.791088212098515,243.1790104199246],[-36.60118821209851,243.12561041992458],[-34.92799569192363,243.04920450627503],[-34.942299953969695,242.7738873766335],[-34.95796594597387,242.47397289316044],[-36.62712477776693,242.55019465080304],[-37.524417634867945,242.590463109135],[-37.60321579513853,239.8125339366106],[-37.63621987624532,239.68661002082632],[-37.72129794171079,239.58808172685545],[-38.1602168540081,239.26768843305845],[-38.577124106490714,228.70584063756488],[-38.58246315383856,228.68361977633407],[-38.58248317789023,228.66076651180882],[-38.59546704292138,228.62949820820694],[-38.603376781842776,228.59657825086373],[-38.616812973856476,228.57809201694243],[-38.625577039377234,228.55698601646935],[-38.64953842827898,228.53306658079072],[-38.6694439964454,228.50567943202972],[-38.688931794690276,228.49374218695434],[-38.70510565215101,228.47759664777905],[-38.73639666067359,228.4646675972755],[-38.76526761577613,228.44698270223046],[-38.78784017962668,228.44341178335233],[-38.808961505845424,228.43468471745456],[-38.842818361595015,228.43471438286312],[-38.87625936243513,228.4294241064907],[-38.898480223665985,228.43476315383856],[-38.92133348819116,228.43478317789024],[-40.84653348819116,228.81948317789025],[-46.5579086664341,229.96653830438376],[-46.661647119081316,230.00973327577083],[-46.74095895230516,230.08933921287004],[-46.783769658460855,230.19323683338763],[-46.783561695616214,230.3056086664341],[-46.740366724229155,230.4093471190813]],"holes":[],"color":11970187},{"outer":[[-0.35517991111240105,-491.44497009783095],[2.074516990872789,-491.1790531610769],[3.5124409611964627,-490.6704749516479],[4.743903619054929,-490.15574701709465],[6.015885813585047,-487.9497180118307],[6.066861860916518,-487.8880224118978],[11.101629866471377,-483.5364549647959],[12.282880931210984,-481.27371374998],[14.233845688080189,-474.9750897157718],[14.239676022683433,-474.9584545417033],[14.944952172082118,-473.1605792670751],[15.451266802059846,-470.7234085126595],[15.442425997859038,-470.7071129142988],[13.929895755388227,-465.830269231542],[14.290875445321747,-465.77868951296625],[14.481885875048519,-465.6655829263295],[15.99257400214096,-470.5364870857012],[16.004283079372932,-470.64824740791414],[15.972332032465465,-470.7559813520185],[15.921791349444897,-470.81835166816273],[15.410782778857127,-473.2781169400985],[15.399223977316568,-473.31694545829674],[14.689744802104878,-475.12553499881113],[12.734954311919811,-481.43651028422823],[12.718453733987976,-481.4765668657799],[11.505953733987978,-483.7991668657799],[11.450138139083482,-483.8696775881022],[6.411442447236264,-488.22463974808727],[5.119214186414952,-490.4657819881692],[5.069883663712218,-490.52604222604265],[5.003855611730148,-490.5673349988987],[3.691355611730149,-491.1159349988987],[3.6788273182438838,-491.1207645096666],[2.2083273182438834,-491.64086450966664],[2.1544107643197425,-491.65317541362566],[-0.31898923568025733,-491.92387541362564],[-0.35114155543892683,-491.9252239454658],[-1.4644168213778879,-491.89719041915436],[-3.616340042637842,-492.17620769532016],[-3.654836063303405,-492.1780784911934],[-7.783349474019428,-492.0466553294237],[-8.198926979582177,-492.57877379137153],[-8.393001346914748,-492.364042868032],[-8.57339166589274,-492.27841563058206],[-8.086649997784818,-491.6551763446905],[-7.999283866830299,-491.5855522499471],[-7.889863936696595,-491.5630215088066],[-3.6588872978125164,-491.69770638734246],[-1.5077599573621587,-491.4187923046798],[-1.4708584445610733,-491.41687605453416],[-0.35517991111240105,-491.44497009783095]],"holes":[],"color":11970187},{"outer":[[41.30819241524895,-347.58117825330754],[41.27312108960134,-347.68793720716195],[41.19986452676076,-347.7731484042639],[41.0995753743473,-347.8238392122961],[40.98752174669248,-347.83229241524896],[40.88076279283808,-347.79722108960135],[40.7955515957361,-347.72396452676077],[40.74486078770389,-347.62367537434733],[40.73640758475105,-347.51162174669247],[40.82350758475105,-346.79562174669246],[40.85177484444404,-346.7016627512149],[41.193574844444036,-346.0176627512149],[41.22735699515014,-345.9651865645716],[41.80366904967503,-345.2532999336988],[42.55528065779909,-343.58258009417125],[42.405460774050084,-341.3746979288773],[42.409500864924446,-341.34345451618697],[42.40806087586735,-341.3119839012847],[42.41663727325059,-341.2882662153802],[42.41987163591046,-341.2632537761765],[42.43556052958587,-341.235934702509],[42.44627343609845,-341.20630858557024],[42.46327335955322,-341.1876783461925],[42.47583336710169,-341.1658076025582],[42.50078257173627,-341.1465719492313],[42.5220174309147,-341.1233006379987],[43.46873735841977,-340.4260875882162],[43.9995055609317,-339.48591557524776],[44.0462240235989,-339.42428337701864],[44.84755839675688,-338.61956035669266],[44.202362901754476,-337.9373985515809],[44.15802498964521,-337.8760419866692],[43.622169539819524,-336.8808935011896],[43.25804247255514,-337.027148187245],[43.242851347230705,-337.03275917467363],[42.620451347230706,-337.2429591746736],[42.59027682511446,-337.25135233003255],[41.31327682511446,-337.53275233003257],[41.20896127068147,-337.53637090409467],[40.32216127068147,-337.40457090409467],[40.267661455436155,-337.3909310754445],[39.41956145543615,-337.08813107544444],[39.40088141984239,-337.0807170912552],[38.61232889441272,-336.73543063659866],[38.59851957822252,-336.7391551305887],[38.54986271033742,-336.75423714142767],[38.544452994825626,-336.7537373634921],[38.539207673344734,-336.75515207281313],[38.48869190641133,-336.74858586123815],[38.43796718638094,-336.7438996451509],[38.433160517678836,-336.74136770204535],[38.42777308670225,-336.74066742540333],[38.38361538394619,-336.7152694898442],[38.33854519057515,-336.6915284807495],[38.33507334041984,-336.6873498378596],[38.33036398747681,-336.6846411860252],[38.29928695885238,-336.6442781319379],[38.266732820518854,-336.60509668325767],[38.265124346624205,-336.599907501084],[38.26181002800978,-336.595602841745],[38.24854486941132,-336.54641957822247],[38.233462858572366,-336.49776271033744],[38.12337561091472,-335.44535202480256],[37.97203477031547,-334.94082860218447],[37.239842355234636,-334.40791219646167],[36.059048505892434,-333.7169716453296],[36.02014932583931,-333.6824547556381],[35.980245680581554,-333.6491041787623],[35.97823730079943,-333.6452644410075],[35.974996091197454,-333.64238837847495],[35.952266976736404,-333.5956128588237],[35.928163528840564,-333.54953047952],[35.92777743188973,-333.54521445072965],[35.92588356615955,-333.5413169582061],[35.92278481892769,-333.48940395744137],[35.91815109983725,-333.4376054002204],[35.94663980747498,-333.172698236058],[35.36801796756236,-332.7014000812278],[35.36734903749149,-332.7008535546006],[34.682865480752554,-332.1399056840808],[32.77161016283305,-330.9701357763793],[31.672379878073937,-330.41421728697105],[31.777360688092116,-330.25981935926666],[31.82258678054741,-330.1847698585044],[31.964772441081006,-329.9166187706619],[33.041975157320344,-330.4613971625068],[33.06234418722452,-330.4727567111281],[35.00044418722452,-331.65895671112816],[35.032650962508505,-331.6818464453994],[35.73211690727311,-332.2550726804987],[36.43158203243764,-332.82479991877216],[36.49434984947416,-332.896144575114],[36.53048338787721,-332.9840321524304],[36.53604890016275,-333.0788945997796],[36.5107723921841,-333.3139325710943],[37.54315149410757,-333.9180283546704],[37.55400589174765,-333.9276599213384],[37.56717930785267,-333.93374647477486],[38.38947930785267,-334.53224647477487],[38.45497635256317,-334.5985763868513],[38.495856405820845,-334.6823519283149],[38.68285640582084,-335.3057519283149],[38.69343714142763,-335.3585372896626],[38.77934118051342,-336.1797616420567],[39.622707983875756,-336.54904983037284],[40.43475701088042,-336.83897843003916],[41.2411475674812,-336.9588276354519],[42.45100738631104,-336.69222266049593],[43.050874182450045,-336.48963268532174],[43.64635752744486,-336.250451812755],[43.68601444042993,-336.2430063832201],[43.72459060851249,-336.23117488185636],[43.74079827619322,-336.23272093339244],[43.75679994022543,-336.2297166838676],[43.79628739298478,-336.2380140474877],[43.83645484467086,-336.2418456259482],[43.85083712880252,-336.2494763972174],[43.8667704152077,-336.2528244042862],[43.90007680101308,-336.2756013626657],[43.935720405902615,-336.2945126978633],[43.946087734101745,-336.3070664731129],[43.959526944460464,-336.3162570330489],[43.98158166799663,-336.35004600074853],[44.00727501035479,-336.38115801333083],[44.64707317785606,-337.56934071746986],[45.29803709824552,-338.2576014484191],[45.30436012748055,-338.26450829483827],[45.45906012748055,-338.4391082948383],[45.48294898835769,-338.48000269397846],[45.50934417375095,-338.51932601712195],[45.511141852105716,-338.52826494595206],[45.515740951089334,-338.536137962187],[45.52216177168126,-338.5830613318225],[45.53149935895041,-338.6294923453695],[45.52973941722205,-338.6384387804813],[45.53097555776514,-338.64747249802474],[45.518950826341744,-338.69328118049003],[45.50980925247037,-338.7397511835261],[45.5047596258331,-338.7473431112735],[45.502444616743624,-338.7561622285203],[45.4738049896597,-338.79388226716685],[45.4475759764011,-338.8333166229814],[44.481910603330206,-339.80306555884613],[43.9399944390683,-340.76298442475223],[43.8599825690853,-340.85329936200134],[42.99083884022414,-341.49338132530755],[43.13483922594991,-343.6155020711227],[43.110145882661385,-343.7531572694379],[42.31364588266139,-345.52365726943793],[42.27484300484986,-345.58671343542846],[41.694793822955475,-346.3032163345041],[41.38928022738096,-346.91460106058065],[41.30819241524895,-347.58117825330754]],"holes":[],"color":11970187},{"outer":[[50.60669919481472,-327.3295664452206],[50.66128996575304,-327.4277872161355],[50.6741377999437,-327.5394223596495],[50.64328673109706,-327.6474764371375],[49.24368673109706,-330.3725764371375],[49.24334350963556,-330.3732425747532],[49.01161173224194,-330.82156318052716],[48.98754853381374,-330.7848252445982],[48.729610873403445,-330.6090345687146],[48.519274814633576,-330.51964229649695],[48.73148444631786,-330.109090270798],[50.13091326890294,-327.38432356286245],[50.2007664452206,-327.29630080518524],[50.29898721613555,-327.2417100342469],[50.41062235964949,-327.2288622000563],[50.518676437137515,-327.25971326890294],[50.60669919481472,-327.3295664452206]],"holes":[],"color":11970187},{"outer":[[17.124869577298362,69.494151779884],[17.214102195897702,69.42585088758624],[17.270404765955902,69.32860124637554],[17.285205731565675,69.21720823255606],[17.256251779884018,69.10863042270164],[17.187950887586236,69.0193978041023],[17.09070124637554,68.96309523404409],[16.979308232556065,68.94829426843432],[8.122609537761393,69.51813681017126],[7.797763663960033,66.05649796747551],[7.636497867378336,66.13259658345878],[7.235758726754916,66.23260000858066],[7.575259786131506,69.85040817256244],[7.606404332698765,69.95622096615394],[7.675039972684112,70.04256608177909],[7.771099144232251,70.09677830945886],[7.880491767443935,70.11090573156567],[17.01629176744394,69.52310573156566],[17.124869577298362,69.494151779884]],"holes":[],"color":11970187},{"outer":[[129.234550513212,137.87691285969052],[129.25625183033165,137.7844694845493],[129.56265183033167,130.8309694845493],[129.55991783521551,130.78073880054643],[126.7937938003334,112.81725910641823],[127.83087223146981,92.34265029170508],[127.81636620376626,92.24382298234707],[127.7651448077164,92.1580696704496],[127.68500603654567,92.09844552039338],[127.58815029170508,92.07402776853019],[127.48932298234706,92.08853379623373],[127.4035696704496,92.1397551922836],[127.34394552039338,92.21989396345433],[127.31952776853018,92.31674970829492],[126.28112776853018,112.81744970829492],[126.2837821647845,112.86936119945359],[129.0500355366723,130.83368082073125],[128.74687512802524,137.71366091709936],[128.3978321520565,138.50135193152434],[128.44338372118213,138.49564689698374],[128.68417818739877,138.56179757351984],[128.86780686993384,138.7045492606407],[129.234550513212,137.87691285969052]],"holes":[],"color":11970187},{"outer":[[94.34813481397373,157.06021108086858],[94.59124076543621,161.61738480693248],[94.61437627220823,161.70812523993288],[94.67047555374407,161.78310489361215],[94.75099800297114,161.83090879538986],[94.84368480693246,161.8442592345638],[94.93442523993286,161.82112372779176],[95.00940489361213,161.76502444625592],[95.05720879538984,161.68450199702886],[95.07055923456379,161.59181519306753],[94.82733652382535,157.0324527410534],[94.83105566647878,157.02806809641885],[94.86541711066941,156.92107854896724],[94.8562198184187,156.80908354048015],[94.80486399409814,156.70913329576248],[93.89694142929926,155.56545535228398],[93.83522255655551,155.58102239099136],[93.6357542304375,155.73148056292297],[93.56798514361589,155.7773555498755],[93.40700778519641,155.8747066484917],[94.34813481397373,157.06021108086858]],"holes":[],"color":11970187}];




/** One road surface avoids coplanar triangles at intersections. */
class RoadNetwork {
  constructor() {
    this.data = REAL_ROADS;
    this.halfSize = REAL_ROADS.projection.halfSize;
    this.size = this.halfSize * 2;
    this.placements = new Map(REAL_ROADS.placements.map(p => [p.id,p]));
    this.segments = [];
    for (const road of REAL_ROADS.roads) {
      for (let i=1;i<road.points.length;i++) this.segments.push({a:road.points[i-1],b:road.points[i],road});
    }
  }

  worldToMap(x,z) {
    return {x:(x+this.halfSize)/this.size*1024,y:(z+this.halfSize)/this.size*1024};
  }

  worldToGeo(x,z) {
    const p=this.data.projection;
    return {lon:p.lon+x/p.unitsPerMeter/p.metersPerLongitudeDegree,lat:p.lat-z/p.unitsPerMeter/p.metersPerLatitudeDegree};
  }

  nearest(x,z) {
    let best={distance:Infinity,clearance:Infinity};
    for (const {a,b,road} of this.segments) {
      const dx=b[0]-a[0],dz=b[1]-a[1],len=dx*dx+dz*dz;
      const t=len ? Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/len)) : 0;
      const px=a[0]+t*dx,pz=a[1]+t*dz,distance=Math.hypot(x-px,z-pz);
      if(distance<best.distance) best={x:px,z:pz,distance,clearance:distance-road.width/2,road};
    }
    return best;
  }

  contains(x,z) {
    const ring=this.data.boundary;let inside=false;
    for(let i=0,j=ring.length-1;i<ring.length;j=i++) {
      const a=ring[i],b=ring[j];
      if((a[1]>z)!==(b[1]>z) && x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;
    }
    return inside;
  }

  draw(canvas,overview=false) {
    const ctx=canvas.getContext('2d'),s=canvas.width/this.size;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const trace=points=>{ctx.beginPath();points.forEach((p,i)=>{const x=(p[0]+this.halfSize)*s,y=(p[1]+this.halfSize)*s;if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);});};
    if(overview) {
      ctx.fillStyle='#edeedc';ctx.fillRect(0,0,canvas.width,canvas.height);
      trace(this.data.boundary);ctx.closePath();ctx.fillStyle='#cbd9b6';ctx.fill();
      for(const park of this.data.parks||[]) {trace(park.outer);ctx.closePath();ctx.fillStyle='#bdd5a9';ctx.fill();}
      for(const lake of this.data.waters||[]) {trace(lake.outer);ctx.closePath();ctx.fillStyle='#77b6c2';ctx.fill();}
    }
    const order={steps:0,path:0,footway:0,track:1,pedestrian:1,service:2,living_street:2,residential:3,unclassified:3,tertiary:4,secondary:5,primary:6};
    const roads=[...this.data.roads].sort((a,b)=>order[a.kind]-order[b.kind]);
    ctx.lineCap='round';ctx.lineJoin='round';
    for(const road of roads) {
      trace(road.points);
      // 地面道路只留下純淨平整的柏油路面 (Dark Asphalt)
      // 小徑巷弄與主要幹道皆統一採用質感深黑灰柏油，乾淨俐落
      ctx.strokeStyle = overview ? '#faf8ed' : '#2d3136';
      // 依道路等級給予適度厚實的柏油路面寬度
      const baseW = road.width || 1.6;
      ctx.lineWidth = Math.max(overview ? 1.1 : 0.8, baseW * s);
      ctx.stroke();
    }
    if (overview) {
      trace(this.data.boundary);ctx.closePath();ctx.strokeStyle='#768e69';ctx.lineWidth=1.5;ctx.setLineDash([5,5]);ctx.stroke();ctx.setLineDash([]);
      const names=['格致路','菁山路','建業路','華岡路','仰德大道四段','中庸一路','新園街','陽明路一段','光華路','凱旋路','湖山路一段','湖山路二段','陽明路二段','中興路'];
      ctx.font='15px "Microsoft JhengHei",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
      const labels=[];
      for(const name of names) {
        const longest=roads.filter(r=>r.name===name).sort((a,b)=>b.points.length-a.points.length)[0];if(!longest)continue;
        const p=longest.points[Math.floor(longest.points.length/2)],x=(p[0]+this.halfSize)*s,y=(p[1]+this.halfSize)*s;
        if(labels.some(q=>Math.hypot(q.x-x,q.y-y)<35))continue;
        ctx.lineWidth=4;ctx.strokeStyle='#f9f8ec';ctx.strokeText(name,x,y);ctx.fillStyle='#405c48';ctx.fillText(name,x,y);labels.push({x,y});
      }
      ctx.textAlign='left';ctx.fillStyle='#405c48';ctx.font='bold 22px "Microsoft JhengHei",sans-serif';ctx.fillText('北 ↑',30,40);
    }
  }

  createSurface() {
    // Unioned vector polygons keep junctions flat and edges sharp at every zoom.
    const group = new THREE.Group();
    for(const color of [0x2d3136,0xb6a68b]) {
    const shapes = ROAD_SURFACE.filter(p => (p.color || 0x2d3136) === color).map(polygon => {
      const shape = new THREE.Shape(polygon.outer.map(([x,z]) => new THREE.Vector2(x,-z)));
      shape.holes = polygon.holes.map(ring => new THREE.Path(ring.map(([x,z]) => new THREE.Vector2(x,-z))));
      return shape;
    });
    const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shapes), new THREE.MeshLambertMaterial({color}));
    mesh.name = 'real-road-network';
    mesh.rotation.x = -Math.PI/2;
    mesh.position.y = .055;
    mesh.receiveShadow = true;
    group.add(mesh);
    }
    return group;
  }

  minimapImage() {
    if(!this.mapImage) {
      const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;
      this.draw(canvas,true);this.mapImage=canvas.toDataURL('image/png');
    }
    return this.mapImage;
  }
}

  
/**
 * 陽明里轉角路名指標牌系統 (Road Intersection Signpost & Wayfinding System)
 * 在陽明山與文化大學所有關鍵路口與轉角路肩上設立 3D 立體指標牌，
 * 並即時計算玩家當前面朝方向的前、後、左、右道路名稱，提供極致沉浸的街景導航！
 */
class RoadSignposts {
  constructor(scene, roadNetwork) {
    this.scene = scene;
    this.roadNetwork = roadNetwork;
    this.group = new THREE.Group();
    this.group.name = 'road-signposts';
    this.scene.add(this.group);

    this.signposts = [];
    this.activeCorner = null;
    this.initCorners();
  }

  initCorners() {
    const rawNodes = new Map();
    const roads = this.roadNetwork.data.roads;

    roads.forEach(r => {
      if (!r.name) return;
      for (let i = 0; i < r.points.length; i++) {
        const p = r.points[i];
        // 以 4.0m 聚合相鄰交會節點
        const key = Math.round(p[0] / 4.0) * 4.0 + ',' + Math.round(p[1] / 4.0) * 4.0;
        if (!rawNodes.has(key)) {
          rawNodes.set(key, { x: p[0], z: p[1], branches: [] });
        }
        const node = rawNodes.get(key);

        if (i > 0) {
          const prev = r.points[i - 1];
          const dx = prev[0] - p[0], dz = prev[1] - p[1];
          const len = Math.hypot(dx, dz);
          if (len > 0.5) {
            const ang = Math.atan2(dz, dx);
            if (!node.branches.some(b => b.name === r.name && Math.abs(b.ang - ang) < 0.4)) {
              node.branches.push({ name: r.name, dx: dx / len, dz: dz / len, ang });
            }
          }
        }
        if (i < r.points.length - 1) {
          const next = r.points[i + 1];
          const dx = next[0] - p[0], dz = next[1] - p[1];
          const len = Math.hypot(dx, dz);
          if (len > 0.5) {
            const ang = Math.atan2(dz, dx);
            if (!node.branches.some(b => b.name === r.name && Math.abs(b.ang - ang) < 0.4)) {
              node.branches.push({ name: r.name, dx: dx / len, dz: dz / len, ang });
            }
          }
        }
      }
    });

    // 篩選出多向交會或主要轉角
    const validCorners = [];
    rawNodes.forEach(val => {
      const uniqueNames = Array.from(new Set(val.branches.map(b => b.name)));
      if (uniqueNames.length >= 2 || val.branches.length >= 3) {
        // 將指標牌位置稍微偏離路中心 1.8m，立在路肩草皮上，避免立在馬路正中央
        const normalX = val.branches[0] ? -val.branches[0].dz : 1;
        const normalZ = val.branches[0] ? val.branches[0].dx : 0;
        const signX = val.x + normalX * 1.8;
        const signZ = val.z + normalZ * 1.8;

        validCorners.push({
          x: signX,
          z: signZ,
          roadX: val.x,
          roadZ: val.z,
          title: uniqueNames.join(' × '),
          branches: val.branches
        });
      }
    });

    // 建立 3D 指標牌模型
    validCorners.forEach((corner, idx) => {
      const postMesh = this.createSignpostMesh(corner, idx);
      this.group.add(postMesh);
      this.signposts.push({ ...corner, mesh: postMesh });
    });
  }

  createSignpostMesh(corner, idx) {
    const postGroup = new THREE.Group();
    postGroup.position.set(corner.x, 0, corner.z);

    // 1. 金屬深灰/墨綠色路牌立柱 (Post)
    const postGeom = new THREE.CylinderGeometry(0.06, 0.08, 2.8, 12);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.4, metalness: 0.6 });
    const postMesh = new THREE.Mesh(postGeom, postMat);
    postMesh.position.y = 1.4;
    postMesh.castShadow = true;
    postGroup.add(postMesh);

    // 圓形基座法蘭盤
    const baseGeom = new THREE.CylinderGeometry(0.2, 0.22, 0.1, 12);
    const baseMesh = new THREE.Mesh(baseGeom, postMat);
    baseMesh.position.y = 0.05;
    postGroup.add(baseMesh);

    // 2. 指向各相交道路的方向箭頭牌面 (Directional Arrow Plaques)
    corner.branches.slice(0, 4).forEach((b, bIdx) => {
      const plaqueY = 2.1 + bIdx * 0.25;
      const plaqueGroup = new THREE.Group();
      plaqueGroup.position.y = plaqueY;
      plaqueGroup.rotation.y = -b.ang + Math.PI / 2;

      // 台灣公路標準綠底白字/藍底白字路牌材質 (動態 Canvas 貼圖)
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');

      // 綠色底板 + 白色邊框
      ctx.fillStyle = bIdx % 2 === 0 ? '#1b5e20' : '#0d47a1'; // 綠色/藍色牌面
      ctx.fillRect(0, 0, 256, 64);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.strokeRect(4, 4, 248, 56);

      // 白色中文路名與方向指標
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px "Microsoft JhengHei", "PingFang TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const shortName = b.name.length > 7 ? b.name.slice(0, 6) + '..' : b.name;
      ctx.fillText(`➔ ${shortName}`, 128, 34);

      const texture = new THREE.CanvasTexture(canvas);
      const plaqueMat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      const plaqueGeom = new THREE.PlaneGeometry(1.1, 0.28);
      const pMesh = new THREE.Mesh(plaqueGeom, plaqueMat);
      pMesh.position.z = 0.55; // 稍微向箭頭前方突出
      plaqueGroup.add(pMesh);

      postGroup.add(plaqueGroup);
    });

    return postGroup;
  }

  /**
   * 每幀更新：偵測玩家距離與相對方位，回傳前、後、左、右道路提示
   * @param {THREE.Vector3} playerPos 玩家當前世界坐標
   * @param {number} playerYaw 玩家當前旋轉角 (弧度)
   */
  update(playerPos, playerYaw) {
    let nearest = null;
    let minDist = Infinity;

    for (const post of this.signposts) {
      const d = Math.hypot(playerPos.x - post.x, playerPos.z - post.z);
      if (d < minDist) {
        minDist = d;
        nearest = post;
      }
    }

    // 當距離轉角指標牌小於 14 公尺時啟動導航指示
    if (nearest && minDist < 14.0) {
      // 計算各分支相對於玩家朝向的方位角
      // playerYaw: 0 表示面向南 (+Z), Math.PI/2 表示面向西 (-X), etc.
      const directions = {
        title: nearest.title,
        distance: minDist,
        front: null,
        back: null,
        left: null,
        right: null
      };

      nearest.branches.forEach(b => {
        // branch 朝向向量角度 (在 X-Z 平面中，相對於玩家坐標系的局部角度)
        const branchWorldAng = Math.atan2(b.dz, b.dx);
        let relAng = branchWorldAng - playerYaw;
        // 正規化到 [-PI, PI]
        while (relAng > Math.PI) relAng -= Math.PI * 2;
        while (relAng < -Math.PI) relAng += Math.PI * 2;

        const deg = relAng * (180 / Math.PI);

        if (deg >= -45 && deg <= 45) {
          if (!directions.front) directions.front = b.name;
        } else if (deg > 45 && deg < 135) {
          if (!directions.right) directions.right = b.name;
        } else if (deg < -45 && deg > -135) {
          if (!directions.left) directions.left = b.name;
        } else {
          if (!directions.back) directions.back = b.name;
        }
      });

      this.activeCorner = directions;
      return directions;
    }

    this.activeCorner = null;
    return null;
  }
}

  /**
 * 陽明里漫步 3D 方塊版 - 體素地形與自然景觀模組 (VoxelTerrain.js)
 * 打造台地草階、仰德大道與山仔后街區石板路、方塊樹木與花柱
 */

class VoxelTerrain {
  constructor(scene, roadNetwork, maxTextureSize) {
    this.roadNetwork = roadNetwork;
    this.maxTextureSize = maxTextureSize;
    this.scene = scene;
    this.clickableObjects = []; // 供 Raycaster 拾取的地面物件
    this.rippleRings = []; // 點擊漣漪特效
    this.materials = this.initMaterials();
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.buildTerrain();
    this.buildRoads();
    this.buildNorthernParks();
    this.buildNature();
    this.initRippleSystem();
  }

  initMaterials() {
    return {
      grassTop: new THREE.MeshLambertMaterial({ color: 0x6ca942 }),
      grassSide: new THREE.MeshLambertMaterial({ color: 0x5a8f35 }),
      grassHigh: new THREE.MeshLambertMaterial({ color: 0x78ba4c }),
      stoneRoad: new THREE.MeshLambertMaterial({ color: 0xb5b8b1 }),
      asphalt: new THREE.MeshLambertMaterial({ color: 0x55585a }),
      dirtPath: new THREE.MeshLambertMaterial({ color: 0xdfc08f }),
      woodTrunk: new THREE.MeshLambertMaterial({ color: 0x6e4726 }),
      leavesGreen: new THREE.MeshLambertMaterial({ color: 0x3d7e2f }),
      leavesLight: new THREE.MeshLambertMaterial({ color: 0x53993d }),
      leavesSakura: new THREE.MeshLambertMaterial({ color: 0xf49ac2 }),
      lampPost: new THREE.MeshLambertMaterial({ color: 0x2b2d42 }),
      lampBulb: new THREE.MeshBasicMaterial({ color: 0xffd166 }),
      // 花朵顏色
      flowerRed: new THREE.MeshLambertMaterial({ color: 0xe63946 }),
      flowerPink: new THREE.MeshLambertMaterial({ color: 0xf72585 }),
      flowerWhite: new THREE.MeshLambertMaterial({ color: 0xffffff }),
      flowerOrange: new THREE.MeshLambertMaterial({ color: 0xf77f00 }),
      flowerYellow: new THREE.MeshLambertMaterial({ color: 0xffbe0b })
    };
  }

  buildTerrain() {
    // 總基地大地板 (以 0,0 為山仔后核心，範圍 280 x 280，完全平坦，y=0 為地面基準)
    const baseGeo = new THREE.BoxGeometry(this.roadNetwork.size, 1, this.roadNetwork.size);
    const baseMesh = new THREE.Mesh(baseGeo, this.materials.grassTop);
    baseMesh.position.y = -0.5;
    baseMesh.receiveShadow = true;
    this.group.add(baseMesh);
    this.clickableObjects.push(baseMesh);


  }

  buildRoads() {
    this.roadsMesh = this.roadNetwork.createSurface(this.maxTextureSize);
    this.group.add(this.roadsMesh);
    this.clickableObjects.push(this.roadsMesh);
  }

  buildNature() {
    // Decorative trees are not map data. Keep them off roads and landmark plots.
    let seed = 9256;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const places = this.roadNetwork.data.placements;
    let count = 0;
    for (let i = 0; i < 1600 && count < 140; i++) {
      const x = (random() - .5) * this.roadNetwork.size;
      const z = (random() - .5) * this.roadNetwork.size;
      if (!this.roadNetwork.contains(x, z)) continue;
      if (this.roadNetwork.nearest(x, z).clearance < 5) continue;
      if (places.some(p => Math.hypot(x-p.x,z-p.z) < p.radius+6)) continue;
      this.createVoxelTree(x,z,count % 7 === 0 ? 'sakura' : 'oak');
      count++;
    }
  }

  buildNorthernParks() {
    const data = this.roadNetwork.data;
    const polygonMesh = (polygon,color,height) => {
      const shape=new THREE.Shape(polygon.outer.map(([x,z])=>new THREE.Vector2(x,-z)));
      shape.holes=(polygon.holes||[]).map(r=>new THREE.Path(r.map(([x,z])=>new THREE.Vector2(x,-z))));
      const mesh=new THREE.Mesh(new THREE.ShapeGeometry(shape),new THREE.MeshLambertMaterial({color}));
      mesh.rotation.x=-Math.PI/2;mesh.position.y=height;mesh.receiveShadow=true;this.group.add(mesh);
    };
    for(const park of data.parks||[]) polygonMesh(park,0x8cac6b,.014);
    for(const water of data.waters||[]) polygonMesh(water,0x6aadb7,.026);
    const inside=(x,z,ring)=>{
      let hit=false;
      for(let i=0,j=ring.length-1;i<ring.length;j=i++) {
        const a=ring[i],b=ring[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])hit=!hit;
      }
      return hit;
    };
    // Decorative planting follows mapped park outlines; avoid paths and miniature plots.
    let seed=6701;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    for(const park of data.parks||[]) {
      const xs=park.outer.map(p=>p[0]),zs=park.outer.map(p=>p[1]);
      const minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),maxZ=Math.max(...zs);
      let planted=0;
      for(let i=0;i<600&&planted<45;i++) {
        const x=minX+rand()*(maxX-minX),z=minZ+rand()*(maxZ-minZ);
        if(!inside(x,z,park.outer)||this.roadNetwork.nearest(x,z).clearance<3)continue;
        if(data.placements.some(p=>Math.hypot(x-p.x,z-p.z)<p.radius+4))continue;
        if((data.waters||[]).some(w=>inside(x,z,w.outer)))continue;
        this.createVoxelTree(x,z,planted++%3===0?'sakura':'oak');
      }
    }
  }

  createVoxelTree(x, z, type = 'oak') {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(x, 0, z);

    // 樹幹 (Trunk)
    const trunkH = 2.5 + Math.random() * 0.8;
    const trunkGeo = new THREE.BoxGeometry(0.65, trunkH, 0.65);
    const trunkMesh = new THREE.Mesh(trunkGeo, this.materials.woodTrunk);
    trunkMesh.position.y = trunkH / 2;
    trunkMesh.castShadow = true;
    treeGroup.add(trunkMesh);

    // 樹冠 (Leaves) - 階層方塊
    const leafMat = type === 'sakura' ? this.materials.leavesSakura : this.materials.leavesGreen;
    
    // 下層大方塊
    const bottomGeo = new THREE.BoxGeometry(2.6, 1.4, 2.6);
    const bottomLeaves = new THREE.Mesh(bottomGeo, leafMat);
    bottomLeaves.position.y = trunkH + 0.6;
    bottomLeaves.castShadow = true;
    bottomLeaves.receiveShadow = true;
    treeGroup.add(bottomLeaves);

    // 上層較小方塊
    const topGeo = new THREE.BoxGeometry(1.6, 1.2, 1.6);
    const topLeaves = new THREE.Mesh(topGeo, leafMat);
    topLeaves.position.y = trunkH + 1.8;
    topLeaves.castShadow = true;
    topLeaves.receiveShadow = true;
    treeGroup.add(topLeaves);

    this.group.add(treeGroup);
  }

  createStreetLamp(x, z) {
    const lampGroup = new THREE.Group();
    lampGroup.position.set(x, 0, z);

    // 燈柱
    const postGeo = new THREE.BoxGeometry(0.2, 3.2, 0.2);
    const post = new THREE.Mesh(postGeo, this.materials.lampPost);
    post.position.y = 1.6;
    post.castShadow = true;
    lampGroup.add(post);

    // 橫臂
    const armGeo = new THREE.BoxGeometry(0.6, 0.15, 0.15);
    const arm = new THREE.Mesh(armGeo, this.materials.lampPost);
    arm.position.set(0.2, 3.1, 0);
    lampGroup.add(arm);

    // 暖黃發光燈罩
    const bulbGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const bulb = new THREE.Mesh(bulbGeo, this.materials.lampBulb);
    bulb.position.set(0.4, 2.85, 0);
    lampGroup.add(bulb);

    this.group.add(lampGroup);
  }

  initRippleSystem() {
    // 漣漪池，重複使用
    this.maxRipples = 5;
    for (let i = 0; i < this.maxRipples; i++) {
      const ringGeo = new THREE.RingGeometry(0.2, 0.4, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x2a9d8f,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.05;
      ring.visible = false;
      this.scene.add(ring);
      this.rippleRings.push({ mesh: ring, time: 0, active: false });
    }
  }

  spawnRipple(x, z) {
    const item = this.rippleRings.find(r => !r.active) || this.rippleRings[0];
    item.active = true;
    item.time = 0;
    item.mesh.position.set(x, 0.14, z);
    item.mesh.scale.set(1, 1, 1);
    item.mesh.material.opacity = 0.85;
    item.mesh.visible = true;
  }

  update(delta) {
    // 更新漣漪擴散動畫
    this.rippleRings.forEach(r => {
      if (r.active) {
        r.time += delta * 2.2;
        const scale = 1 + r.time * 2.8;
        r.mesh.scale.set(scale, scale, 1);
        r.mesh.material.opacity = Math.max(0, 0.85 - r.time);
        if (r.time >= 0.85) {
          r.active = false;
          r.mesh.visible = false;
        }
      }
    });
  }
}


  // 4. 體素建築與 30 處地標
  /**
 * Stylized architectural miniatures. Dimensions are gameplay proportions, not surveys.
 * Reference notes and unresolved details: LANDMARK_ARCHITECTURE_REVIEW.md.
 * All textures are generated locally; the game remains usable through file://.
 */

class LandmarkArchitecture {
  constructor() {
    this.boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.roundGeometry = new THREE.IcosahedronGeometry(1, 1);
    this.materialCache = new Map();
    this.textureCache = new Map();
    this.palette = {
      plaster: 0xede6d7, white: 0xf6f2e8, stone: 0x9b9a8a,
      brick: 0x9d5643, wood: 0x735743, dark: 0x35454a,
      roof: 0x4f5556, redRoof: 0x955747, greenRoof: 0x476755,
      glass: 0x668d99, frame: 0xe5dfcd, leaf: 0x608257,
      grass: 0x8da56e, gold: 0xbca065, red: 0xa44638,
      cream: 0xfbf8ee, metal: 0x90a4ae
    };
  }

  texture(kind) {
    if (this.textureCache.has(kind)) return this.textureCache.get(kind);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 128, 128);
    if (kind === 'brick') {
      for (let row = 0; row < 8; row++) {
        for (let col = -1; col < 5; col++) {
          const shade = 225 + ((row * 17 + col * 11 + 50) % 25);
          ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
          ctx.fillRect(col * 32 + (row % 2) * 16 + 1, row * 16 + 1, 30, 14);
        }
      }
    } else {
      ctx.strokeStyle = kind === 'tile' ? '#b4b4b4' : '#d2d2d2';
      ctx.lineWidth = 2;
      for (let y = 0; y < 128; y += 16) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(128, y); ctx.stroke();
      }
      if (kind === 'tile') {
        for (let x = 0; x < 128; x += 8) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 128); ctx.stroke();
        }
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    this.textureCache.set(kind, texture);
    return texture;
  }

  mat(color, texture = '') {
    const value = this.palette[color] ?? color;
    const key = `${value}:${texture}`;
    if (!this.materialCache.has(key)) {
      this.materialCache.set(key, new THREE.MeshLambertMaterial({
        color: value, map: texture ? this.texture(texture) : null
      }));
    }
    return this.materialCache.get(key);
  }

  box(g, w, h, d, x, y, z, color = 'plaster', texture = '') {
    const mesh = new THREE.Mesh(this.boxGeometry, this.mat(color, texture));
    mesh.scale.set(w, h, d); mesh.position.set(x, y, z);
    mesh.castShadow = mesh.receiveShadow = true; g.add(mesh); return mesh;
  }

  ball(g, x, y, z, sx, sy, sz, color = 'leaf') {
    const mesh = new THREE.Mesh(this.roundGeometry, this.mat(color));
    mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz);
    mesh.castShadow = true; mesh.receiveShadow = true; g.add(mesh); return mesh;
  }

  cylinder(g, rTop, rBottom, height, x, y, z, color = 'stone') {
    const geom = new THREE.CylinderGeometry(rTop, rBottom, height, 16);
    const mesh = new THREE.Mesh(geom, this.mat(color));
    mesh.position.set(x, y, z);
    mesh.castShadow = true; mesh.receiveShadow = true;
    g.add(mesh);
    return mesh;
  }

  sphere(g, r, x, y, z, color = 'leaf') {
    const geom = new THREE.SphereGeometry(r, 12, 8);
    const mesh = new THREE.Mesh(geom, this.mat(color));
    mesh.position.set(x, y, z);
    mesh.castShadow = true; mesh.receiveShadow = true;
    g.add(mesh);
    return mesh;
  }

  beam(g, a, b, width, color) {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
    const mesh = this.box(g, width, start.distanceTo(end), width, 0, 0, 0, color);
    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize());
    return mesh;
  }

  roof(g, w, d, y, rise, color = 'roof', x = 0, z = 0, hip = true) {
    // Four sloping roof planes with a ridge; unlike a pyramid, the ridge has length.
    const inset = hip ? Math.min(w * 0.23, d * 0.35) : 0;
    const a = [-w/2, 0, -d/2], b = [w/2, 0, -d/2];
    const c = [w/2, 0, d/2], e = [-w/2, 0, d/2];
    const l = [-w/2+inset, rise, 0], r = [w/2-inset, rise, 0];
    const positions = [...a,...l,...r, ...a,...r,...b, ...e,...c,...r, ...e,...r,...l,
      ...a,...e,...l, ...b,...r,...c];
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const uv = [];
    for (let i = 0; i < positions.length; i += 3) uv.push((positions[i]+w/2)/w*2, (positions[i+2]+d/2)/d);
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, this.mat(color, 'tile'));
    mesh.position.set(x, y, z); mesh.castShadow = mesh.receiveShadow = true; g.add(mesh);
    this.box(g,w,0.13,d,x,y-0.04,z,color);
    this.box(g,w-2*inset+0.2,0.14,0.2,x,y+rise,z,color);
    return mesh;
  }

  window(g, x, y, z, w = 1.2, h = 1.35, frame = 'frame', side = false) {
    const win = new THREE.Group(); win.position.set(x,y,z);
    if (side) win.rotation.y = Math.PI/2;
    this.box(win,w+0.16,h+0.16,0.12,0,0,0,frame);
    this.box(win,w,h,0.13,0,0,0.035,'glass');
    this.box(win,0.055,h,0.15,0,0,0.07,frame);
    this.box(win,w,0.055,0.15,0,0.08,0.07,frame);
    this.box(win,w+0.23,0.09,0.3,0,-h/2-0.06,0.08,frame);
    g.add(win);
  }

  door(g,x,z,h=2.1,color='wood') {
    this.box(g,1.32,h+0.12,0.17,x,h/2+0.22,z,'frame');
    this.box(g,1.12,h,0.19,x,h/2+0.22,z+0.03,color);
    this.box(g,0.86,h*0.55,0.2,x,h*0.66+0.22,z+0.06,'glass');
    this.box(g,0.06,0.32,0.23,x+0.38,1.1,z+0.1,'gold');
  }

  sign(g, text, x, y, z, width=4.2, bg='#314c45', fg='#fff6e3') {
    const canvas = document.createElement('canvas'); canvas.width=1024; canvas.height=192;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle=bg; ctx.fillRect(0,0,1024,192);
    ctx.strokeStyle=fg; ctx.lineWidth=3; ctx.strokeRect(12,12,1000,168);
    ctx.font='bold 66px "Microsoft JhengHei", sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle=fg;
    ctx.fillText(text,512,99,950);
    const map = new THREE.CanvasTexture(canvas);
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,width*192/1024),new THREE.MeshBasicMaterial({map}));
    mesh.position.set(x,y,z); g.add(mesh);
  }

  tree(g,x,z,size=1,color='leaf') {
    this.box(g,0.25*size,2.3*size,0.25*size,x,1.15*size,z,'wood');
    this.ball(g,x,2.8*size,z,1.2*size,1.5*size,1.1*size,color);
    this.ball(g,x-0.6*size,2.5*size,z+0.2,0.8*size,0.9*size,0.9*size,color);
  }

  bamboo(g,x,z) {
    for(let i=0;i<3;i++) {
      const bx=x+(i-1)*0.35, bz=z+(i%2)*0.35, height=4.4+i*0.4;
      this.box(g,0.09,height,0.09,bx,height/2,bz,0x7a8c52);
      for(let j=1;j<6;j++) this.box(g,0.12,0.055,0.12,bx,j*height/6,bz,0xadb17e);
      for(let k=0;k<3;k++) {
        const leaf=this.ball(g,bx+(k-1)*0.25,height-0.4-k*0.15,bz,0.7,0.14,0.28,'leaf');
        leaf.rotation.z=(k-1)*0.45;
        leaf.rotation.y=k*1.1;
      }
    }
  }

  bench(g,x,z,color='wood') {
    this.box(g,1.8,0.12,0.5,x,0.65,z,color);
    this.box(g,1.8,0.42,0.1,x,0.97,z-0.22,color);
    [-0.65,0.65].forEach(dx=>this.box(g,0.1,0.65,0.4,x+dx,0.325,z,'dark'));
  }

  fence(g,w,z,color='white') {
    for(let x=-w/2;x<=w/2;x+=0.45) {
      if(Math.abs(x)<1.1) continue;
      this.box(g,0.13,0.95,0.13,x,0.65,z,color);
    }
    [-1,1].forEach(s=>[0.4,0.85].forEach(y=>this.box(g,w/2-1.1,0.1,0.12,s*(w/4+0.55),y,z,color)));
  }

  house(g, options={}) {
    const {x=0,z=0,w=8,d=5,h=2.8,wall='plaster',roof='roof',hip=true,chimney=false,siding=false,porch=true}=options;
    const house=new THREE.Group(); house.position.set(x,0,z); g.add(house);
    this.box(house,w+0.2,0.28,d+0.2,0,0.14,0,'stone');
    this.box(house,w,h,d,0,h/2+0.28,0,wall,wall==='brick'?'brick':siding?'siding':'');
    this.roof(house,w+0.85,d+0.85,h+0.3,1.25,roof,0,0,hip);
    [-1,1].forEach(s=>this.window(house,s*w*0.31,1.8,d/2+0.08,1.3,1.25));
    [-1,1].forEach(s=>this.window(house,s*(w/2+0.08),1.8,0,1.35,1.25,'frame',true));
    this.door(house,0,d/2+0.08);
    if(porch) {
      this.box(house,3,0.18,1.3,0,0.18,d/2+0.6,'stone');
      this.roof(house,3.1,1.65,2.6,0.55,roof,0,d/2+0.5);
      [-1.25,1.25].forEach(px=>this.box(house,0.13,2.5,0.13,px,1.35,d/2+1.1,'frame'));
    }
    if(chimney) {
      this.box(house,0.85,4.5,0.9,w*0.32,2.25,-d*0.25,'brick','brick');
      this.box(house,1.05,0.17,1.08,w*0.32,4.55,-d*0.25,'stone');
    }
    return house;
  }

  block(g,{w=9,d=5,floors=2,x=0,z=0,wall='plaster',accent='stone',roof=false}={}) {
    const h=floors*2.4;
    this.box(g,w,h,d,x,h/2+0.2,z,wall);
    this.box(g,w+0.35,0.25,d+0.35,x,h+0.23,z,accent);
    for(let f=0;f<floors;f++) {
      this.box(g,w+0.05,0.14,d+0.05,x,f*2.4+0.3,z,accent);
      for(let col=0;col<4;col++) {
        const wx=x+(col-1.5)*w/4.4;
        if(f===0 && col===2)continue;
        this.window(g,wx,1.6+f*2.4,z+d/2+0.08,w/5.8,1.3,'frame');
      }
      this.window(g,x+w/2+0.08,1.6+f*2.4,z,1.45,1.3,'frame',true);
    }
    this.door(g,x+w/8,z+d/2+0.1);
    this.box(g,2.8,0.16,1.4,x+w/8,2.6,z+d/2+0.5,accent);
    if(roof)this.roof(g,w+0.8,d+0.8,h+0.3,1.4,roof,x,z);
  }

  pool(g,x,z,w,d) {
    this.box(g,w+0.45,0.16,d+0.45,x,0.13,z,'stone');
    this.box(g,w,0.05,d,x,0.24,z,0x7baeb1);
    for(let i=0;i<4;i++)this.box(g,w*0.65,0.015,0.035,x+(i%2)*0.3,0.27,z+(i-1.5)*d/5,0xb8d7d0);
  }

  pavilion(g,x,z,w=4,base=0,color='roof') {
    this.box(g,w+0.2,0.18,w,x,base+0.09,z,'stone');
    [-1,1].forEach(a=>[-1,1].forEach(b=>this.box(g,0.15,2.6,0.15,x+a*(w/2-0.25),base+1.4,z+b*(w/2-0.25),'wood')));
    this.roof(g,w+0.65,w+0.65,base+2.8,1,color,x,z);
  }

  temple(g,small=false) {
    const w=small?5.2:7.8, d=small?4:5.5, h=small?2.6:3.2;
    this.box(g,w+1,0.32,d+1.5,0,0.16,0,'stone');
    this.box(g,w,h,d,0,h/2+0.32,0,small?'stone':0xb88069);
    this.roof(g,w+1.1,d+1.1,h+0.35,1.2,'redRoof');
    this.box(g,w*0.65,0.18,0.22,0,h+1.62,0,'gold');
    [-1,1].forEach(s=>{
      this.beam(g,[s*w*0.3,h+1.6,0],[s*w*0.5,h+2,0],0.17,'gold');
      this.box(g,0.25,h,0.25,s*w*0.35,h/2+0.3,d/2+0.3,'red');
      this.window(g,s*w*0.32,1.7,d/2+0.08,0.85,1.2,'red');
    });
    this.box(g,1.8,2,0.2,0,1.35,d/2+0.1,'dark');
    this.sign(g,small?'下竹林福德宮':'陽明福德宮',0,h-0.05,d/2+0.25,small?2.8:3.5,'#813d30','#efd795');
    this.ball(g,0,0.9,d/2+1.6,0.65,0.5,0.5,'stone');
    [-0.38,0.38].forEach(x=>this.box(g,0.1,0.5,0.1,x,0.35,d/2+1.6,'stone'));
    if(small) {this.bamboo(g,-4,-1);this.bamboo(g,4,-1);}
  }

  greenhouse(g,x,z,w=5,d=4) {
    this.box(g,w,2.1,d,x,1.15,z,0x91afb0);
    this.roof(g,w+0.15,d+0.15,2.25,0.9,0xb0c6c0,x,z,false);
    for(let i=0;i<5;i++) {
      const px=x-w/2+i*w/4;
      this.box(g,0.075,2.3,0.075,px,1.2,z+d/2+0.05,'frame');
      this.beam(g,[px,2.25,z+d/2],[px,3.15,z],0.065,'frame');
    }
    this.box(g,w,0.07,0.08,x,1.35,z+d/2+0.08,'frame');
  }

  lawn(g, w = 16, d = 16, x = 0, z = 0) {
    this.box(g, w, 0.12, d, x, 0.06, z, 'grass');
  }

  build(code,name) {
    const g=new THREE.Group(); g.name=`architecture-${code}`;
    // Shared small planting beds tie the miniatures together without hiding their façades.
    const yard=()=>{this.tree(g,-5.5,-2.5,0.75);this.tree(g,5.4,-2.8,0.8);};
    switch(code) {
      case '01':
        this.block(g,{w:8.2,d:5.5,floors:2,wall:0xd9d5bf,accent:0x4d6275});
        this.sign(g,'山仔后派出所',0,3,2.93,5,'#294564');
        this.box(g,0.07,6.8,0.07,-4.8,3.4,0,'stone');
        this.box(g,0.85,0.55,0.04,-4.4,6.3,0,'red'); break;
      case '02':
        this.block(g,{w:8.6,d:5.3,floors:2,wall:0xd6cbbb,accent:0x60584f});
        this.sign(g,"McDonald's",0,3.1,2.82,7,'#983a30','#fff1cf');
        this.sign(g,'M',-3.3,5.65,2.9,1.2,'#983a30','#ffcf50');
        this.window(g,-2.5,1.45,2.8,2.2,1.8,'dark');break;
      case '03':
        this.block(g,{w:8.5,d:5,floors:2,wall:0xd8d3c7,accent:0x8f938a});
        [0xe47c43,0x2e7654,0xb54536].forEach((c,i)=>this.box(g,8.7,0.13,0.22,0,2.9-i*0.16,2.61,c));
        this.sign(g,'7-ELEVEN',0,3.45,2.7,3.8,'#f7f4e7','#336747');
        this.window(g,-2.3,1.4,2.65,2.1,1.85,'white'); break;
      case '04':
        this.box(g,9,0.12,7,0,0.1,0,'grass'); this.pavilion(g,0,-1,3.3);
        this.bench(g,-3,2);this.bench(g,3,2);yard();
        this.box(g,1.5,0.08,6.8,0,0.19,0,0xc6bba2); break;
      case '05':
        this.block(g,{w:8,d:5,floors:3,wall:0xdacabd,accent:0x937968});
        this.sign(g,'陽明里辦公處',0,3,2.7,5,'#536861');
        this.box(g,4.2,0.12,1.6,0,0.19,3.2,'stone'); break;
      case '06':
        this.block(g,{w:6,d:3,floors:1,z:-2.4,wall:'white',accent:'dark'});
        this.box(g,10.5,0.28,5.8,0,3.6,0.9,'white');
        this.box(g,10.6,0.14,5.9,0,3.72,0.9,0xb34d42);
        [-3.8,3.8].forEach(x=>this.box(g,0.26,3.5,0.26,x,1.75,0.8,'stone'));
        [-2,2].forEach(x=>{this.box(g,1.5,0.15,2.2,x,0.2,1.2,'stone');this.box(g,0.65,1.4,0.5,x,1,1.2,'white');this.box(g,0.45,0.4,0.53,x,1.36,1.2,'dark');});
        this.sign(g,'台灣中油',0,3.59,3.88,3.1,'#f3f0e5','#2b5873'); break;
      case '07':
        this.house(g,{wall:'white',w:8.6,d:5.5,roof:'roof'});
        [-5.2,5.2].forEach(x=>[-1.6,1.2,3].forEach(z=>this.bamboo(g,x,z)));
        this.sign(g,'豆留森林',0,2.72,3.65,2.8,'#5a513f'); break;
      case '08':
        this.house(g,{wall:'white',roof:'white',w:8.5,d:5,chimney:true,siding:true});
        this.window(g,-2.6,1.6,2.62,2.1,1.75,'white');this.bench(g,4,4,'white');yard();
        this.sign(g,'白房子',0,2.72,3.35,2.3,'#eeeade','#686c62');break;
      case '09': {
        // 09 彩虹谷故事館 (F206)：愛富三街美軍 F 區白木屋眷舍、紅磚煙囪、F206門牌與彩虹弧形裝置藝術
        this.lawn(g, 10, 8, 0, 0);

        // 1. 美軍 F 區木造眷舍主屋 (American F-Zone Cottage)
        this.box(g, 8.0, 0.25, 5.2, 0, 0.12, 0.4, 'stone');
        this.box(g, 7.6, 3.0, 4.8, 0, 1.62, 0.4, 0xf5f5f5); // 白木牆主體
        // 經典深灰美式人字雙坡黑瓦斜頂
        this.roof(g, 8.4, 5.6, 3.2, 1.25, 0x37474f, 0, 0.4, true);
        // 屋頂紅磚大煙囪
        this.box(g, 0.8, 2.2, 0.8, -2.4, 3.4, 0.4, 0xa74337);
        this.box(g, 0.95, 0.15, 0.95, -2.4, 4.55, 0.4, 0x263238);

        // 2. 正門與美式木格白窗 (朝向愛富三街)
        this.door(g, 0, 1.85, -2.02, 'wood');
        [-2.2, 2.2].forEach(wx => {
          this.box(g, 1.5, 1.4, 0.1, wx, 1.7, -2.02, 0xffffff); // 白窗框
          this.box(g, 1.3, 1.2, 0.08, wx, 1.7, -2.03, 0x90caf9); // 採光玻璃
          this.box(g, 0.08, 1.2, 0.12, wx, 1.7, -2.04, 0xffffff); // 十字窗櫺
          this.box(g, 1.3, 0.08, 0.12, wx, 1.7, -2.04, 0xffffff);
        });

        // 3. F206 門牌與文史招牌
        this.box(g, 0.8, 0.45, 0.1, 1.0, 2.4, -2.04, 0x3e2723); // F206 門牌
        this.sign(g, 'F206 彩虹谷故事館 (美軍眷舍記憶)', 0, 2.85, -2.06, 4.2, '#37474f', '#fff9c4');

        // 4. 前庭亮點：精緻彩虹弧形裝置藝術 (Miniature Rainbow Arch)
        const rainbowTorus = new THREE.TorusGeometry(1.6, 0.12, 8, 24, Math.PI);
        const rainbowMesh = new THREE.Mesh(rainbowTorus, this.mat(0xff9800)); // 亮彩虹金橙
        rainbowMesh.position.set(-2.4, 0.1, -2.8);
        rainbowMesh.rotation.z = 0;
        g.add(rainbowMesh);
        // 彩虹外圈七彩光譜層次
        const innerArch = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.08, 8, 24, Math.PI), this.mat(0x00bcd4));
        innerArch.position.set(-2.4, 0.1, -2.78);
        g.add(innerArch);

        // 5. 白木矮籬笆與前庭美軍庭園
        this.fence(g, 8.5, -3.2, 'white');
        this.tree(g, 3.6, -2.6, 1.25, 0x2e7d32);
        this.tree(g, -3.8, 2.4, 1.2, 0x1b5e20);
        this.tree(g, 3.8, 2.4, 1.2, 0x1b5e20);
        this.bench(g, 1.8, -2.8, 'wood');
        break;
      }
      case '10':
        this.house(g,{x:-3.1,w:4.8,d:4.8,wall:'brick',chimney:true,porch:false});
        this.house(g,{x:3.1,w:4.8,d:4.8,wall:'white',siding:true,chimney:true,porch:false});
        this.fence(g,12,3.8);break;
      case '11':
        this.block(g,{w:10,d:5,floors:3,wall:0xc6b8a0,accent:0x665b4c,z:-1});
        this.pool(g,0,4,7,2.4);this.sign(g,'CHECK inn',0,5.25,1.72,3.3,'#5c5245');yard();break;
      case '12':
        // Restrained church study; the older available photo does not establish current details.
        this.house(g,{w:6,d:7,h:3.8,wall:'white',roof:'roof',hip:false,porch:false});
        this.box(g,0.16,1.5,0.17,0,5.2,3.65,'dark');this.box(g,0.85,0.15,0.17,0,5.5,3.65,'dark');
        this.sign(g,'陽明山錫安堂',0,3.1,3.67,3.3,'#e8e4d7','#585951');yard();break;
      case '13':
        this.house(g,{x:-2.8,w:5.8,d:6,wall:0x9b8569,siding:true,porch:false});
        this.house(g,{x:3,w:5.8,d:4.8,wall:'plaster',siding:true});
        this.tree(g,-5,4,0.9);break;
      case '14':
        // 中國文化大學：全台規模最宏偉之高山宮殿式大學城校園建築群 (Campus Complex)
        // 包含：正門石牌樓、百花池廣場、大恩館主殿、曉峰圖書館高樓、大典館、大成館、大義館、大忠館、宿舍與庭園

        // === 1. 校園中軸前庭與迎賓百花池廣場 ===
        // 漢白玉主台基與廣場鋪石
        this.box(g, 34, 0.35, 26, 0, 0.17, -3.5, 'stone');
        // 前方石階迎賓步道
        this.box(g, 10, 0.2, 3.5, 0, 0.1, 9.8, 'stone');
        // 百花池噴泉水景 (位於牌樓與大恩館之間)
        this.box(g, 5.8, 0.45, 5.8, 0, 0.35, 5.2, 'white');
        this.box(g, 4.8, 0.3, 4.8, 0, 0.45, 5.2, 0x5a9fa8);
        this.box(g, 1.2, 1.2, 1.2, 0, 0.8, 5.2, 'white');
        this.ball(g, 0, 1.6, 5.2, 0.6, 0.7, 0.6, 'glass');

        // === 2. 文化大學正門中式石牌樓 (Campus Grand Arch) ===
        // 四柱三間琉璃綠瓦石牌樓 (正臨華岡路)
        [-4.2, -1.5, 1.5, 4.2].forEach(px => this.box(g, 0.42, 4.2, 0.42, px, 2.1, 8.5, 'white'));
        this.box(g, 9.5, 0.35, 0.5, 0, 3.8, 8.5, 'white');
        this.roof(g, 4.2, 1.6, 4.2, 0.7, 'greenRoof', 0, 8.5);
        [-3.2, 3.2].forEach(rx => this.roof(g, 2.8, 1.4, 3.7, 0.55, 'greenRoof', rx, 8.5));
        this.sign(g, '中國文化大學', 0, 3.3, 8.78, 3.2, '#504132', '#fbeec8');

        // === 3. 中央巍峨主殿：大恩館 (Main Administration Palace) ===
        // 4 層宏偉宮殿主樓
        this.block(g, { w: 12.5, d: 8.5, floors: 4, wall: 'plaster', accent: 0x857563, z: -0.2 });
        // 正面 6 根朱紅擎天大柱 (支撐挑簷門廊)
        [-5.2, -3.1, -1.0, 1.0, 3.1, 5.2].forEach(px => this.box(g, 0.36, 4.8, 0.36, px, 2.4, 4.4, 'red'));
        // 一層挑簷綠瓦頂
        this.roof(g, 13.8, 2.8, 4.9, 0.85, 'greenRoof', 0, 4.4);
        // 主殿頂層雙層重簷歇山大屋頂
        this.roof(g, 14.8, 10.5, 9.8, 1.4, 'greenRoof', 0, -0.2);
        this.box(g, 8.8, 1.6, 5.8, 0, 10.8, -0.2, 'plaster');
        this.roof(g, 11.2, 8.2, 11.8, 1.9, 'greenRoof', 0, -0.2);
        // 殿頂金色正脊與琉璃吻獸
        this.box(g, 6.8, 0.35, 0.35, 0, 13.8, -0.2, 'gold');
        [-3.4, 3.4].forEach(gx => this.ball(g, gx, 13.9, -0.2, 0.45, 0.45, 0.45, 'gold'));
        // 大恩館中央大校匾
        this.sign(g, '大 恩 館', 0, 5.8, 4.42, 4.5, '#504132', '#fbeec8');

        // === 4. 後方制高點地標：曉峰紀念館 / 華岡圖書館 (Library Tower) ===
        // 5 層現代宏偉圖書館高樓 (高 16 米，頂部飛簷閣樓)
        this.block(g, { w: 10.5, d: 7.5, floors: 5, wall: 0xdedcd3, accent: 0x5e6e72, z: -9.8 });
        // 圖書館頂部宮殿式觀景閣樓與金頂
        this.roof(g, 12.2, 9.2, 12.8, 1.6, 'greenRoof', 0, -9.8);
        this.box(g, 5.2, 1.8, 4.2, 0, 14.0, -9.8, 'plaster');
        this.roof(g, 6.8, 5.8, 15.2, 1.4, 'greenRoof', 0, -9.8);
        this.ball(g, 0, 16.8, -9.8, 0.8, 1.0, 0.8, 'gold');
        this.sign(g, '曉峰紀念館', 0, 7.8, -5.9, 4.0, '#364547', '#f0ede1');

        // === 5. 東翼校舍：大典館 (文學院宮殿) ===
        // 位於左前方 (X = -10.5, Z = 0)
        this.block(g, { w: 6.8, d: 7.5, floors: 3, wall: 'plaster', accent: 0x857563, x: -10.5, z: 0 });
        this.roof(g, 8.2, 8.8, 7.6, 1.4, 'greenRoof', -10.5, 0);
        this.box(g, 4.5, 0.28, 0.28, -10.5, 9.1, 0, 'gold');
        this.sign(g, '大 典 館', -10.5, 4.5, 3.82, 3.0, '#504132', '#fbeec8');

        // === 6. 西翼校舍：大成館 (法學院宮殿) ===
        // 位於右前方 (X = 10.5, Z = 0)
        this.block(g, { w: 6.8, d: 7.5, floors: 3, wall: 'plaster', accent: 0x857563, x: 10.5, z: 0 });
        this.roof(g, 8.2, 8.8, 7.6, 1.4, 'greenRoof', 10.5, 0);
        this.box(g, 4.5, 0.28, 0.28, 10.5, 9.1, 0, 'gold');
        this.sign(g, '大 成 館', 10.5, 4.5, 3.82, 3.0, '#504132', '#fbeec8');

        // === 7. 東後校舍：大忠館 (學生活動中心 / 藝文大樓) ===
        // 位於左後方 (X = -11.5, Z = -9.2)
        this.block(g, { w: 7.5, d: 6.8, floors: 3, wall: 0xdcd8cb, accent: 0x7a6b58, x: -11.5, z: -9.2 });
        this.roof(g, 8.8, 8.0, 7.6, 1.3, 'greenRoof', -11.5, -9.2);
        this.sign(g, '大 忠 館', -11.5, 4.2, -5.72, 3.0, '#504132', '#fbeec8');

        // === 8. 西後校舍：大義館 (理工學院大樓) ===
        // 位於右後方 (X = 11.5, Z = -9.2)
        this.block(g, { w: 7.5, d: 6.8, floors: 4, wall: 0xdcd8cb, accent: 0x617075, x: 11.5, z: -9.2 });
        this.roof(g, 8.8, 8.0, 9.8, 1.4, 'greenRoof', 11.5, -9.2);
        this.sign(g, '大 義 館', 11.5, 5.5, -5.72, 3.0, '#425359', '#fbeec8');

        // === 9. 後山學生宿舍群：大倫館 / 大賢館 (Student Dormitories) ===
        // 位於校園後方兩側 (X = -6.2, 6.2, Z = -15.2)
        [-6.2, 6.2].forEach(dx => {
          this.block(g, { w: 5.5, d: 4.8, floors: 3, wall: 0xdbd7cc, accent: 0x827362, x: dx, z: -15.2 });
          this.box(g, 5.8, 0.25, 5.1, dx, 7.4, -15.2, 'greenRoof');
        });

        // === 10. 古典朱紅風雨連廊與校園青松庭園 ===
        // 連接主殿大恩館與東西翼館的迴廊
        [-6.5, 6.5].forEach(cx => {
          this.box(g, 0.25, 3.2, 0.25, cx, 1.6, 1.5, 'red');
          this.box(g, 0.25, 3.2, 0.25, cx, 1.6, -1.5, 'red');
          this.roof(g, 2.8, 3.6, 3.3, 0.55, 'greenRoof', cx, 0);
        });
        // 校園林蔭與青松蒼柏
        this.tree(g, -15.5, 3.5, 1.2);
        this.tree(g, 15.5, 3.5, 1.2);
        this.tree(g, -15.5, -5.5, 1.1);
        this.tree(g, 15.5, -5.5, 1.1);
        this.tree(g, -4.8, 5.5, 0.95);
        this.tree(g, 4.8, 5.5, 0.95);
        this.tree(g, 0, -15.5, 1.15);
        break;
      case '15':
        this.house(g,{wall:'brick',roof:'white',w:8.6,d:5.3,chimney:true});
        this.fence(g,10,4.4);this.bench(g,-4,3.5);yard();
        this.sign(g,'亞尼克夢想村',0,2.74,3.55,3.4,'#614d3e');break;
      case '16':
        this.house(g,{x:-2.5,z:0.7,w:5.3,d:4.6,wall:'white',chimney:true,siding:true});
        this.house(g,{x:3,z:-1.5,w:5,d:4.8,wall:0xd2b459,siding:true,porch:false});
        this.bench(g,3.4,2.6);this.tree(g,5.5,3.4,0.8,0x9b8051);break;
      case '17':
        this.house(g,{wall:'white',w:8.5,d:5.1,chimney:true,siding:true,porch:false});
        this.window(g,-2.5,1.55,2.67,2.2,1.8,'dark');
        this.sign(g,'STARBUCKS',0,3,2.75,3.4,'#2c6552');
        this.bench(g,3.5,3.8);yard();break;
      case '18': {
        // 18 美軍俱樂部 (BRICK YARD 33 1/3)：近千坪冷戰美軍社交核心、黑膠音樂、紅磚煙囪與無邊際水池露台
        this.lawn(g, 15, 11, 0, 0.5);

        // 1. 美式歷史紅磚主館 (Main Red Brick Hall)
        this.box(g, 13.5, 3.8, 5.8, 0, 1.9, -2.5, 0xa74337); // 經典溫暖美式紅磚牆
        // 標誌性人字雙披黑瓦坡頂
        this.roof(g, 14.5, 7.2, 1.8, 0, 4.7, -2.5, 0x2b2d42);
        // 冷戰美軍雙紅磚煙囪 (Twin Chimneys)
        [-5.2, 5.2].forEach(cx => {
          this.box(g, 0.9, 4.8, 0.9, cx, 3.2, -2.5, 0x8b3226);
          this.box(g, 1.1, 0.25, 1.1, cx, 5.65, -2.5, 0x1f2029); // 煙囪頂蓋
        });
        // 復古黑鋼格採光大落地玻璃窗
        [-3.6, 0, 3.6].forEach(wx => {
          this.box(g, 2.4, 2.2, 0.12, wx, 1.6, 0.42, 0x212529); // 黑鋼框
          this.box(g, 2.1, 1.9, 0.14, wx, 1.6, 0.42, 0xfff3b0); // 暖黃室內酒吧光
        });
        this.sign(g, 'BRICK YARD 33⅓ 美軍俱樂部', 0, 3.6, 0.45, 5.2);

        // 2. 標誌性「巨大黑膠唱片」景觀雕塑 (Giant Vinyl Record Monument)
        this.box(g, 0.35, 1.2, 0.35, -6.8, 0.6, 2.5, 0x424242); // 唱片基座
        // 黑膠大圓盤 (以同心多邊形/層疊薄板呈現)
        this.box(g, 0.12, 3.2, 3.2, -6.8, 2.2, 2.5, 0x1a1a1a); // 黑膠膠體
        this.box(g, 0.14, 1.2, 1.2, -6.8, 2.2, 2.5, 0xd90429); // 紅色唱片中央圓標
        this.box(g, 0.16, 0.25, 0.25, -6.8, 2.2, 2.5, 0xffd700); // 金色唱片軸心孔
        // 金屬唱臂與唱頭
        this.box(g, 0.08, 2.4, 0.08, -6.8, 2.8, 4.0, 0xb0bec5);
        this.box(g, 0.25, 0.08, 0.5, -6.8, 3.9, 3.7, 0x78909c);

        // 3. 標誌性室外無邊際水池露台 (前身為美軍游泳池) 與下沉式圓形沙發座
        // 蔚藍水池池體
        this.box(g, 10.5, 0.4, 5.8, 1.2, 0.2, 3.6, 0x3d5a80); // 池壁
        this.box(g, 9.8, 0.25, 5.1, 1.2, 0.3, 3.6, 0x48cae4);  // 清澈池水
        // 池中原木觀景伸展台 (Sunken Wooden Boardwalk)
        this.box(g, 1.2, 0.35, 5.2, -2.4, 0.35, 3.6, 0xc49a45);
        // 水中休閒圓形下沉發光卡座 (Sunken Lounge)
        this.box(g, 2.8, 0.38, 2.8, 2.2, 0.36, 3.6, 0xf8f9fa); // 白色沙發環
        this.box(g, 1.2, 0.42, 1.2, 2.2, 0.38, 3.6, 0xb5838d); // 中央茶几
        // 池畔露天躺椅與白陽傘
        this.box(g, 1.8, 0.3, 0.7, 5.2, 0.35, 2.0, 0xdedbd2);
        this.box(g, 1.8, 0.3, 0.7, 5.2, 0.35, 4.8, 0xdedbd2);
        this.box(g, 0.08, 2.2, 0.08, 5.2, 1.2, 3.4, 0xffffff);
        this.roof(g, 2.0, 2.0, 0.5, 5.2, 2.3, 3.4, 0xf8f9fa); // 陽傘

        // 4. 美式草坪白色木柵欄與老樟樹庭院
        this.tree(g, -7.5, 4.2, 1.4, 0x2d6a4f);
        this.tree(g, 7.8, 3.8, 1.3, 0x1b4332);
        this.bench(g, -4.5, 5.5, 'wood');
        break;
      }
      case '19':
        // 陽明山美國渡假村：美式高級軍官別墅聚落莊園
        // 包含：A棟主別墅、B棟客用木屋、大片白木柵欄庭院、戶外野餐烤肉火塘與露營木平台
        // 1. A棟主別墅 (Main Villa)
        this.house(g, { x: -3.8, z: -1.2, w: 9.0, d: 5.8, wall: 'white', roof: 'redRoof', chimney: true, siding: true });
        this.window(g, -6.5, 1.6, 1.75, 2.2, 1.75, 'white');
        this.sign(g, '美國渡假村', -3.8, 3.2, 2.3, 3.8, '#a24838', '#fff5eb');

        // 2. B棟客用度假木屋 (Guest Cottage)
        this.house(g, { x: 4.8, z: -2.0, w: 6.2, d: 5.0, wall: 'white', roof: 'redRoof', chimney: true, siding: true, porch: false });

        // 3. 戶外大草坪、白色木柵欄莊園圍籬 (White Picket Fence)
        this.box(g, 17, 0.15, 13, 0.5, 0.08, 0.5, 0x829a68);
        this.fence(g, 16.5, 5.8);

        // 4. 戶外野餐與營火烤肉區 (Picnic & Campfire)
        // 圓形石砌營火塘
        this.ball(g, 3.5, 0.35, 3.2, 0.9, 0.35, 0.9, 'stone');
        this.ball(g, 3.5, 0.45, 3.2, 0.5, 0.25, 0.5, 0xd05538); // 營火暖光
        // 野餐原木長桌椅
        this.box(g, 2.2, 0.12, 0.9, -2.5, 0.65, 3.8, 'wood');
        this.box(g, 2.2, 0.45, 0.3, -2.5, 0.35, 3.0, 'wood');
        this.box(g, 2.2, 0.45, 0.3, -2.5, 0.35, 4.6, 'wood');

        // 5. 庭園老樹
        this.tree(g, -7.5, 4.5, 1.15);
        this.tree(g, 7.2, 4.2, 1.05);
        break;
      case '20':
        this.block(g,{w:10,d:5,floors:3,wall:0xdccbb2,accent:0xb08970});
        this.sign(g,'陽明教養院',0,3.3,2.74,4.5,'#71624d');
        this.box(g,4,0.18,1.3,1.5,0.22,3.3,'stone').rotation.z=-0.055;yard();break;
      case '21': {
        // 21 屋頂上餐廳 (The Top)：全台第一百萬夜景！依山崖梯田而建的峇里島發光渡假村
        this.lawn(g, 18, 16);

        // 1. 四層依懸崖梯田層層下探之柚木觀景大甲板 (4-Tier Cliffside Terraced Decks)
        // Level 1: 頂層迎賓石門與南洋木廊 (最高層)
        this.box(g, 15.5, 0.8, 3.8, 0, 3.2, -4.8, 0x4a3728);
        this.box(g, 1.2, 2.6, 0.4, -4.8, 4.5, -4.8, 0x757575); // 南洋善惡門石雕門柱
        this.box(g, 1.2, 2.6, 0.4, 4.8, 4.5, -4.8, 0x757575);
        this.sign(g, 'THE TOP 屋頂上 · 峇里島景觀夜景', 0, 5.2, -4.6, 4.6);

        // Level 2: 峇里島發光白色帳篷包廂層 (Glowing Cabanas Deck)
        this.box(g, 14.5, 0.7, 3.8, 0, 2.4, -1.6, 0x5c4432);
        [-4.8, 0, 4.8].forEach(px => {
          // 純白圓錐斜頂發光帳篷
          this.roof(g, 3.2, 3.2, 1.6, px, 4.6, -1.6, 0xffffff);
          // 四角支撐柚木原木柱
          this.box(g, 0.12, 1.8, 0.12, px - 1.2, 3.3, -2.8, 0x3e2723);
          this.box(g, 0.12, 1.8, 0.12, px + 1.2, 3.3, -2.8, 0x3e2723);
          this.box(g, 0.12, 1.8, 0.12, px - 1.2, 3.3, -0.4, 0x3e2723);
          this.box(g, 0.12, 1.8, 0.12, px + 1.2, 3.3, -0.4, 0x3e2723);
          // 帳篷內發光暖白沙發卡座
          this.box(g, 2.0, 0.4, 1.8, px, 2.7, -1.6, 0xffeedb);
        });

        // Level 3: 標誌性「無邊際天際鏡面水池平台」 (Infinity Sky Pool Deck)
        this.box(g, 13.5, 0.6, 4.2, 0, 1.5, 1.8, 0x6d4c41);
        // 發光鏡面池水 (Tiffany 藍綠光影)
        this.box(g, 8.8, 0.22, 3.2, 0, 1.85, 1.8, 0x00b4d8);
        // 池中雙人愛心造型水中玻璃發光卡座
        this.box(g, 1.8, 0.35, 1.8, 0, 1.95, 1.8, 0xffffff);
        // 無框透明玻璃觀景安全護欄
        this.box(g, 13.0, 0.85, 0.1, 0, 2.2, 3.8, 'glass');

        // Level 4: 最前緣露天白色環形沙發觀景台 (Lounge Deck)
        this.box(g, 12.0, 0.5, 3.4, 0, 0.6, 5.0, 0x795548);
        [-3.6, 3.6].forEach(sx => {
          this.box(g, 2.8, 0.45, 0.6, sx, 0.85, 4.4, 0xf8f9fa); // 白色沙發靠背
          this.box(g, 2.8, 0.35, 1.2, sx, 0.75, 5.2, 0xf8f9fa); // 沙發坐墊
          this.box(g, 1.0, 0.35, 1.0, sx, 0.78, 5.2, 0xffbe0b); // 發光小茶几
        });

        // 2. 懸崖下方璀璨台北盆地「百萬夜景星光點陣」 (Taipei City Lights Matrix)
        const cityLightColors = [0xffd166, 0x06d6a0, 0x118ab2, 0xffffff, 0xef476f];
        for (let i = 0; i < 18; i++) {
          const lx = -6.5 + (i * 0.75);
          const lz = 6.8 + ((i % 3) * 0.6);
          const lc = cityLightColors[i % cityLightColors.length];
          this.box(g, 0.18, 0.18, 0.18, lx, 0.08, lz, lc); // 閃爍城市微光
        }

        // 3. 南洋旅人蕉與熱帶棕櫚造景
        this.tree(g, -7.5, 4.2, 1.4, 0x2d6a4f);
        this.tree(g, 7.5, 4.2, 1.4, 0x2d6a4f);
        this.tree(g, -6.8, 2.8, 1.1, 0x52b788);
        this.tree(g, 6.8, 2.8, 1.1, 0x52b788);
        break;
      }
      case '22':
        // 臺北市私立華岡藝術學校：台灣首屈一指之演藝明星與藝術家搖籃
        // 包含：演藝展演禮堂主館、舞蹈音樂排練館、黑白相間鋼琴琴鍵步道、戶外星光圓形小劇場與舞台射燈
        // 1. 演藝展演禮堂主館 (Main Theatre & Auditorium)
        this.box(g, 11.5, 0.35, 6.8, -0.5, 0.18, -1.8, 'stone');
        this.block(g, { w: 11.2, d: 6.2, floors: 3, x: -0.5, z: -1.8, wall: 0xdecbb7, accent: 0xa15243 });
        // 正面挑高大面通透玻璃排練廳立面
        this.box(g, 6.2, 3.4, 0.18, -0.5, 2.8, 1.35, 'glass');
        // 主館宮殿式綠琉璃瓦大屋頂與金色正脊
        this.roof(g, 12.5, 7.5, 7.5, 1.4, 'greenRoof', -0.5, -1.8);
        this.box(g, 6.5, 0.28, 0.28, -0.5, 8.95, -1.8, 'gold');
        // 主館大字金漆校匾
        this.sign(g, '華岡藝術學校', -0.5, 5.6, 1.42, 5.2, '#693630', '#fce8c3');

        // 2. 西側舞蹈與音樂排練館 (Dance & Music Studios)
        this.block(g, { w: 5.8, d: 6.2, floors: 2, x: -7.2, z: 0.6, wall: 0xdecbb7, accent: 0xa15243 });
        // 大面舞蹈排練鏡面大窗
        this.box(g, 4.5, 2.0, 0.15, -7.2, 2.5, 3.75, 'glass');
        this.roof(g, 6.8, 7.2, 5.2, 1.1, 'greenRoof', -7.2, 0.6);

        // 3. 標誌性黑白相間「鋼琴琴鍵迎賓步道」 (Piano Key Pathway)
        // 鋪設於中軸線，連接大門至禮堂
        for (let i = 0; i < 9; i++) {
          const pz = 2.4 + i * 0.55;
          // 白色琴鍵地磚
          this.box(g, 2.4, 0.12, 0.48, -0.5, 0.1, pz, 'white');
          // 黑色琴鍵 (半長交錯)
          if ([0, 1, 3, 4, 5, 7, 8].includes(i)) {
            this.box(g, 1.4, 0.18, 0.26, -0.5, 0.14, pz + 0.27, 'dark');
          }
        }

        // 4. 前庭「戶外星光階梯圓形展演小劇場」 (Outdoor Amphitheatre & Stage)
        // 位於右前方 (X = 4.8, Z = 4.2)
        this.box(g, 6.2, 0.25, 5.5, 4.8, 0.15, 4.2, 'stone');
        // 圓弧木質表演舞台
        this.box(g, 4.2, 0.35, 3.8, 4.8, 0.3, 4.2, 'wood');
        // 舞台後方階梯看台
        this.box(g, 5.2, 0.65, 1.2, 4.8, 0.45, 6.2, 'stone');
        // 舞台兩側金屬黑桿聚光射燈 (Spotlights)
        [-1.8, 1.8].forEach(sx => {
          this.box(g, 0.08, 3.2, 0.08, 4.8 + sx, 1.6, 2.5, 'dark');
          this.ball(g, 4.8 + sx, 3.2, 2.5, 0.3, 0.3, 0.3, 'gold'); // 聚光燈泡
        });

        // 5. 藝校校園青松與雕塑庭園
        this.tree(g, -10.5, 2.5, 1.15);
        this.tree(g, 8.5, -2.5, 1.15);
        this.tree(g, -10.5, -3.5, 0.95);
        this.bench(g, 1.8, 5.2, 'wood');
        break;
      case '23':
        // 台北歐洲學校 (TES 陽明校區)：Aedas 國際名師操刀之山坡綠建築國際學校
        // 包含：主階梯式現代校舍、彩色立體遮陽百葉牆面、空中花園平台、戶外多功能草皮球場與迎賓旗桿
        // 1. Aedas 階梯式斜坡主校舍 (Main Stepped Campus)
        this.block(g, { w: 10.5, d: 5.5, floors: 3, x: -2.5, z: -1.5, wall: 'white', accent: 0xc4b99e });
        // 2. 側翼教室館與空中綠化露台 (Wing Hall & Green Roof)
        this.block(g, { w: 5.8, d: 5.2, floors: 2, x: 5.5, z: 0.5, wall: 'white', accent: 0xc4b99e });
        this.box(g, 5.8, 0.25, 5.2, 5.5, 5.2, 0.5, 0x6e9460); // 空中花園

        // 3. 標誌性彩色立體書架遮陽百葉牆 (Rainbow Louvers Screen)
        const louverColors = [0xc8644e, 0xde9b4a, 0x639276, 0x487994, 0xb87d58, 0x936888];
        for (let i = 0; i < 20; i++) {
          const lColor = louverColors[i % louverColors.length];
          this.box(g, 0.14, 7.2, 0.38, -7.5 + i * 0.52, 4.0, 1.4, lColor);
        }

        // 4. 戶外多功能綠色運動球場 (Mini Sports Pitch)
        this.box(g, 11, 0.15, 6.2, 0, 0.12, 5.2, 0x58874d);
        // 白色球場邊線
        this.box(g, 10.5, 0.18, 0.15, 0, 0.14, 2.3, 'white');
        this.box(g, 10.5, 0.18, 0.15, 0, 0.14, 8.1, 'white');
        this.box(g, 0.15, 0.18, 5.8, -5.1, 0.14, 5.2, 'white');
        this.box(g, 0.15, 0.18, 5.8, 5.1, 0.14, 5.2, 'white');

        // 5. 國際校名標誌牆與迎賓旗桿
        this.sign(g, 'TAIPEI EUROPEAN SCHOOL', -2.5, 1.2, 1.62, 5.8, '#ede6d8', '#385047');
        [-1.0, 0, 1.0].forEach((fx, idx) => {
          this.box(g, 0.08, 4.5, 0.08, fx, 2.25, 1.7, 'stone');
          this.box(g, 0.65, 0.42, 0.04, fx + 0.35, 4.1, 1.7, [0x294564, 0xa43d2c, 0x2e6b45][idx]);
        });
        break;
      case '24':
        this.house(g,{w:8,d:5,wall:'plaster',siding:true,porch:false});
        this.sign(g,'草山猛禽中心',0,2.9,2.65,4.2,'#826246');
        this.box(g,1.2,1.6,0.15,-4.5,1.1,3.4,'wood');yard();break;
      case '25':
        this.house(g,{w:8.5,d:5,wall:'white',roof:'roof',porch:false});
        this.window(g,-2.5,1.6,2.65,2,1.8,'dark');
        this.box(g,3.2,0.15,2.7,4.8,2.8,1.2,'dark');
        this.box(g,0.12,2.8,0.12,6.2,1.4,2.4,'dark');
        this.sign(g,'YMS by onefifteen',0,3.12,2.69,3.8,'#e8e1ce','#4f5547');yard();break;
      case '26':
        // 花卉試驗中心：廣達 4 公頃之陽明山四季花卉植物生態公園
        // 包含：雙連棟全景採光玻璃大溫室、茶花館、歐式櫻花花架長廊、繽紛彩虹花圃、噴泉水景與休閒石徑
        // 1. 主採光玻璃大溫室 (Main Glasshouse)
        this.greenhouse(g, -3.8, -1.8, 8.2, 5.2);

        // 2. 副展覽溫室：茶花培育館 (Camellia Pavilion)
        this.greenhouse(g, 4.5, -2.2, 6.2, 4.5);

        // 3. 歐式白色花架長廊 (Pergola)
        [-2.5, 2.5].forEach(gx => {
          this.box(g, 0.18, 2.8, 0.18, gx, 1.4, 2.2, 'white');
          this.box(g, 0.18, 2.8, 0.18, gx, 1.4, 4.8, 'white');
        });
        this.box(g, 5.8, 0.15, 0.25, 0, 2.8, 2.2, 'white');
        this.box(g, 5.8, 0.15, 0.25, 0, 2.8, 4.8, 'white');
        for (let i = 0; i < 7; i++) {
          this.box(g, 0.12, 0.12, 3.2, -2.5 + i * 0.83, 2.9, 3.5, 'wood');
        }

        // 4. 中央石造噴泉水池 (Central Fountain Pool)
        this.box(g, 3.8, 0.35, 3.8, 0, 0.2, 3.5, 'white');
        this.box(g, 3.0, 0.25, 3.0, 0, 0.3, 3.5, 0x4da1a9);
        this.ball(g, 0, 0.8, 3.5, 0.45, 0.6, 0.45, 'glass');

        // 5. 繽紛四季花海花圃 (Flower Beds)
        const flowerColors = [0xde5d83, 0xf4d06f, 0xb85d9b, 0xe07a5f, 0xffffff];
        [-5.8, 5.8].forEach(bx => {
          this.box(g, 3.2, 0.3, 2.6, bx, 0.2, 3.5, 'wood');
          for (let i = 0; i < 6; i++) {
            const fc = flowerColors[(i + (bx > 0 ? 2 : 0)) % flowerColors.length];
            this.ball(g, bx + (i % 3 - 1) * 0.85, 0.65, 2.8 + Math.floor(i / 3) * 1.2, 0.45, 0.4, 0.45, fc);
          }
        });

        // 6. 園區林蔭樹與休憩木椅
        this.tree(g, -7.5, -4.5, 1.15, 0x6e9c60);
        this.tree(g, 7.5, -4.5, 1.15, 0x6e9c60);
        this.tree(g, 0, -5.2, 1.25, 0x5a8c52);
        this.bench(g, -3.2, 5.5, 'white');
        this.bench(g, 3.2, 5.5, 'white');
        this.sign(g, '花卉試驗中心', 0, 2.4, 6.2, 4.2, '#385542', '#fff5df');
        break;
      case '27':this.temple(g);break;
      case '28':
        // 臺北市立格致國民中學：陽明山萬坪森林國中校園
        // 重新規劃：前門臨街（大門穿堂、校名牌匾）、操場跑道與司令台移至校舍後方內側，徹底杜絕突出道路
        // 1. 前棟行政大門穿堂樓 (Admin & Portal Block) - 正面臨街
        this.block(g, { w: 12.5, d: 4.8, floors: 3, x: 0, z: 1.0, wall: 0xdecbb5, accent: 0x93735c });
        // 一樓穿堂大門通道
        this.box(g, 3.8, 2.4, 5.0, 0, 1.2, 1.0, 'stone');
        this.box(g, 5.5, 0.2, 1.5, 0, 0.1, 3.9, 'stone'); // 正門前階
        this.sign(g, '臺北市立格致國民中學', 0, 3.8, 3.48, 5.8, '#5c4b3a', '#fdf3de');

        // 2. 側翼專科教學大樓 (Classroom Wing) - 位於左側向後延伸
        this.block(g, { w: 6.8, d: 7.2, floors: 3, x: -8.2, z: -4.5, wall: 0xdecbb5, accent: 0x93735c });
        this.box(g, 7.2, 0.25, 7.6, -8.2, 7.5, -4.5, 0x486b58); // 綠瓦斜頂

        // 3. 後方森林運動場：PU 彩色田徑跑道與中央草坪 (置於校舍後方，徹底遠離馬路)
        // 磚紅色外環跑道 (Running Track)
        this.box(g, 16.5, 0.15, 9.5, 3.5, 0.1, -7.5, 0xb85b43);
        // 白色跑道標線
        this.box(g, 16.0, 0.18, 0.12, 3.5, 0.12, -2.9, 'white');
        this.box(g, 16.0, 0.18, 0.12, 3.5, 0.12, -12.1, 'white');
        // 中央翠綠色足球草坪 (Infield Grass)
        this.box(g, 12.5, 0.18, 6.2, 3.5, 0.13, -7.5, 0x5a8848);

        // 4. 升旗司令台與國旗桿 (位於操場內側)
        this.box(g, 2.8, 0.55, 1.8, -2.8, 0.35, -7.5, 'stone');
        this.box(g, 0.08, 5.2, 0.08, -2.8, 2.6, -7.5, 'stone');
        this.box(g, 0.8, 0.5, 0.04, -2.4, 4.8, -7.5, 0xc0392b); // 國旗

        // 5. 戶外籃球架 (位於操場東側)
        this.box(g, 0.12, 3.2, 0.12, 10.2, 1.6, -7.5, 'dark');
        this.box(g, 1.4, 0.9, 0.08, 10.2, 2.8, -7.5, 'white');
        this.box(g, 0.6, 0.08, 0.6, 9.8, 2.5, -7.5, 0xd05538); // 籃框

        // 6. 校園綠意林蔭樹
        this.tree(g, -6.5, 3.5, 1.15);
        this.tree(g, 6.5, 3.5, 1.15);
        this.tree(g, -11.5, -3.5, 1.1);
        this.tree(g, 11.5, -3.5, 1.1);
        this.tree(g, 3.5, -13.5, 1.2);
        break;
      case '29':
        // 納美花園 (Navi Garden)：萬坪歐式森林秘境莊園
        // 包含：雙層歐式白色木造主莊園、全景玻璃花房咖啡廳、草坪婚禮白木拱門、八角花園涼亭與景觀水池
        // 1. 雙層歐式白色主莊園 (Main Manor)
        this.house(g, { w: 9.8, d: 5.8, z: -2.2, wall: 'white', roof: 'roof', chimney: true, siding: true, porch: false });
        this.window(g, -2.8, 1.6, 0.8, 2.2, 1.8, 'white');
        this.window(g, 2.8, 1.6, 0.8, 2.2, 1.8, 'white');
        this.sign(g, '納美花園', 0, 3.2, 0.85, 3.6, '#435749', '#f9f5eb');

        // 2. 戶外全景玻璃花房咖啡館 (Glasshouse Cafe)
        this.greenhouse(g, -6.5, 2.8, 5.5, 4.2);

        // 3. 婚禮大草坪與白色花藝迎賓拱門 (Wedding Lawn & Arch)
        this.box(g, 8.5, 0.15, 6.5, 3.5, 0.08, 3.8, 0x769b60);
        // 白色婚禮拱門
        this.box(g, 0.18, 3.2, 0.18, 1.8, 1.6, 6.2, 'white');
        this.box(g, 0.18, 3.2, 0.18, 5.2, 1.6, 6.2, 'white');
        this.box(g, 3.8, 0.18, 0.18, 3.5, 3.2, 6.2, 'white');
        this.ball(g, 3.5, 3.3, 6.2, 0.8, 0.35, 0.35, 0xde708b); // 拱門花藝

        // 4. 白色八角歐式花園涼亭 (White Garden Gazebo)
        this.pavilion(g, 6.5, -2.5, 3.2, 0, 'white');

        // 5. 景觀水池與森林綠蔭
        this.pool(g, 0, 5.2, 4.2, 2.5);
        this.tree(g, -8.5, -3.5, 1.25, 0x5a8c52);
        this.tree(g, 8.8, 2.5, 1.15, 0x5a8c52);
        this.tree(g, -8.5, 5.5, 1.05, 0x6e9c60);
        this.bench(g, 3.5, 1.5, 'white');
        break;
      case '30':this.temple(g,true);break;
      case '31':
        // 臺灣銀行行員訓練所：陽明山金融人才深造培育基地
        // 包含：現代化行政教學大樓、大理石列柱迎賓穿堂、研習圖書側翼、前庭景觀花圃、臺銀深綠金字門額
        // 1. 主研習教學大樓 (Main Academic & Training Hall)
        this.block(g, { w: 12.8, d: 6.2, floors: 3, x: 0, z: -1.0, wall: 'cream', accent: 'stone' });
        // 大樓屋頂女兒牆與電梯機房通風塔
        this.box(g, 13.2, 0.4, 6.6, 0, 7.7, -1.0, 'stone');
        this.box(g, 4.0, 1.2, 3.0, 0, 8.4, -1.0, 'white');

        // 2. 迎賓大理石門柱穿堂 (Grand Marble Portico & Entrance)
        [-3.2, -1.1, 1.1, 3.2].forEach(px => {
          this.box(g, 0.45, 3.6, 0.45, px, 1.8, 2.8, 'stone');
        });
        // 穿堂挑高門額大雨遮與臺銀深綠飾帶
        this.box(g, 7.8, 0.35, 2.2, 0, 3.7, 2.8, 'stone');
        this.box(g, 7.2, 0.2, 1.8, 0, 3.9, 2.8, 0x1e4b38);
        // 正門大理石階梯
        this.box(g, 8.2, 0.25, 1.8, 0, 0.12, 3.2, 'stone');

        // 3. 臺灣銀行專屬標誌與門額
        this.sign(g, '臺灣銀行 行員訓練所', 0, 4.25, 2.92, 5.2, '#1e4b38', '#ffffff');

        // 4. 東側研習圖書翼館 (Library & Seminar Wing)
        this.block(g, { w: 5.6, d: 5.0, floors: 2, x: 7.8, z: -0.5, wall: 'cream', accent: 'stone' });
        this.box(g, 5.8, 0.3, 5.2, 7.8, 5.2, -0.5, 0x58874d);

        // 5. 前庭迎賓林蔭花圃與樹木 (Landscaped Forecourt)
        this.box(g, 4.5, 0.3, 2.2, -4.5, 0.15, 2.2, 'stone');
        this.box(g, 4.1, 0.2, 1.8, -4.5, 0.3, 2.2, 0x4e8045);
        this.tree(g, -5.2, 2.2, 1.1, 0x3d6635);
        this.tree(g, -3.8, 2.2, 0.95, 0x487940);
        this.tree(g, 9.2, 2.8, 1.15, 0x3d6635);
        break;
      case '32':
        // 吉佳咖啡 (山上店)：菁山路自烘咖啡老名店
        // 包含：溫馨木屋、外帶窗台、自烘咖啡排煙金屬管、黑金門額招牌、咖啡豆麻布袋、木長椅
        // 1. 溫暖木質與暖灰磚牆主屋
        this.house(g, { w: 8.8, d: 5.6, wall: 0xd9c2a7, roof: 0x423832, porch: false });
        // 2. 正面咖啡吧台外帶大木窗與暖光窗櫺
        this.window(g, -1.8, 1.6, 2.95, 2.2, 1.6, 'wood');
        this.box(g, 2.6, 0.2, 0.6, -1.8, 0.85, 3.2, 'wood'); // 外帶吧台木板
        this.window(g, 2.4, 1.6, 2.95, 1.6, 1.6, 'dark');
        // 3. 復古黑底金字「吉佳咖啡」招牌與深綠雨遮
        this.box(g, 4.8, 0.2, 1.2, 0, 2.85, 3.3, 0x2d4a3e); // 雨遮
        this.sign(g, '吉佳咖啡 JIJIA COFFEE', 0, 3.3, 2.98, 4.6, '#231f20', '#f4c542');
        // 4. 自家烘豆老店金屬排煙管與小煙囪
        this.box(g, 0.35, 2.8, 0.35, -3.8, 3.8, -1.2, 0x8c8f94);
        this.box(g, 0.55, 0.25, 0.55, -3.8, 5.25, -1.2, 0x5a5d62);
        // 5. 門前咖啡生豆麻布袋與戶外木椅
        this.box(g, 0.65, 0.75, 0.55, -3.2, 0.38, 2.6, 0xbfa37a); // 咖啡麻布袋 1
        this.box(g, 0.6, 0.7, 0.5, -2.5, 0.35, 2.7, 0xa88c65);   // 咖啡麻布袋 2
        this.bench(g, 2.4, 2.6, 'wood');
        this.tree(g, -3.8, 1.8, 0.85, 0x4f7d45);
        this.tree(g, 3.8, 2.0, 0.95, 0x4f7d45);
        break;
      case '33':
        // 真愛桃花源 庭園餐廳：陽明山七千坪歐風浪漫婚紗攝影與景觀庭園
        // 包含：白色哥德式尖頂禮拜堂、彩虹荷蘭風車、鏡面水景倒影池、玫瑰花架拱門、落羽松林木
        // 1. 白色哥德式婚紗主教堂 (White Gothic Chapel)
        this.box(g, 7.2, 4.5, 5.8, -3.5, 2.25, -1.0, 'white');
        this.roof(g, 7.6, 6.2, 2.8, -3.5, 5.9, -1.0, 'white'); // 尖頂斜屋頂
        // 哥德式正門尖塔鐘樓與十字架
        this.box(g, 2.2, 6.5, 2.2, -3.5, 3.25, 1.8, 'white');
        this.roof(g, 2.4, 2.4, 2.4, -3.5, 7.7, 1.8, 'white');
        this.box(g, 0.15, 1.2, 0.15, -3.5, 9.3, 1.8, 0xd4af37); // 金色十字架
        this.box(g, 0.8, 0.15, 0.15, -3.5, 9.6, 1.8, 0xd4af37);
        // 彩繪玫瑰花窗
        this.window(g, -3.5, 4.5, 2.92, 1.2, 1.2, 'glass');

        // 2. 彩虹荷蘭大風車 (Rainbow Dutch Windmill)
        this.box(g, 3.2, 5.2, 3.2, 4.8, 2.6, -1.8, 0xb84a39); // 紅磚風車塔基
        this.roof(g, 3.4, 3.4, 1.8, 4.8, 6.1, -1.8, 0x2b4c6f);
        // 風車四葉葉片
        this.box(g, 4.8, 0.25, 0.08, 4.8, 5.2, -0.15, 'white');
        this.box(g, 0.25, 4.8, 0.08, 4.8, 5.2, -0.15, 'white');
        this.ball(g, 4.8, 5.2, -0.1, 0.35, 0.35, 0.35, 0xd4af37);

        // 3. 歐式倒影鏡面景觀水池 (Reflecting Pond)
        this.box(g, 8.5, 0.35, 4.2, 0, 0.18, 3.2, 'stone');
        this.box(g, 7.9, 0.25, 3.6, 0, 0.25, 3.2, 0x489fb5); // 水藍色水面
        this.ball(g, 0, 0.7, 3.2, 0.45, 0.55, 0.45, 'glass'); // 噴泉

        // 4. 浪漫玫瑰花拱門與迎賓長椅 (Floral Arch & Benches)
        this.box(g, 0.2, 2.6, 0.2, -1.5, 1.3, 4.2, 'white');
        this.box(g, 0.2, 2.6, 0.2, 1.5, 1.3, 4.2, 'white');
        this.box(g, 3.2, 0.2, 0.2, 0, 2.6, 4.2, 0xde5d83); // 玫瑰花藤
        this.bench(g, -3.2, 2.8, 'white');
        this.bench(g, 3.2, 2.8, 'white');

        // 5. 落羽松與莊園大招牌
        this.tree(g, -7.5, 3.2, 1.4, 0xb85d19); // 秋紅落羽松
        this.tree(g, -6.8, 2.6, 1.1, 0x4a7c38);
        this.tree(g, 7.2, 3.0, 1.25, 0xb85d19);
        this.sign(g, '真愛桃花源 庭園餐廳', 0, 3.1, 4.35, 4.6, '#4a2c20', '#fff8e7');
        break;
      case '34':
        // 臺北市教師研習中心：日治草山眾樂園古蹟溫泉會館風貌
        // 包含：日洋折衷主館、黑瓦大斜頂、歇山破風門額玄關、通風採光天窗八角閣、日式石燈籠、黑松庭園
        // 1. 日洋折衷研習大樓主館 (Main Heritage Hall)
        this.box(g, 13.5, 1.2, 7.2, 0, 0.6, -1.0, 'stone'); // 洗石子高基座
        this.block(g, { w: 12.8, d: 6.5, floors: 2, x: 0, z: -1.0, wall: 0xdecbb5, accent: 'wood' });
        // 典雅日式黑瓦歇山大斜頂
        this.roof(g, 14.2, 7.6, 2.6, 0, 5.8, -1.0, 0x2e3532);
        
        // 2. 中央突出的草山浴場採光天窗通風閣樓 (Ventilation Monitor Tower)
        this.box(g, 4.2, 1.5, 3.2, 0, 6.8, -1.0, 'cream');
        this.roof(g, 4.8, 3.8, 1.4, 0, 7.9, -1.0, 0x2e3532);
        this.window(g, 0, 6.8, 0.62, 2.4, 0.9, 'wood');

        // 3. 氣派日式破風大玄關門額 (Grand Porch & Gable Entrance)
        [-2.6, 2.6].forEach(px => {
          this.box(g, 0.35, 3.2, 0.35, px, 1.6, 2.8, 'wood');
        });
        this.roof(g, 6.2, 2.8, 1.6, 0, 3.8, 2.8, 0x2e3532); // 破風大雨遮
        this.box(g, 6.8, 0.25, 1.8, 0, 0.12, 3.2, 'stone'); // 迎賓大理石前階
        this.sign(g, '臺北市教師研習中心', 0, 3.3, 2.92, 5.2, '#2d4739', '#fbf4e2');

        // 4. 連續日式木格窗與木構迴廊
        [-4.5, 4.5].forEach(wx => {
          this.window(g, wx, 2.4, 2.28, 2.8, 1.4, 'wood');
        });

        // 5. 草山日式庭園：日式石燈籠、黑松林與景觀石
        // 石燈籠 (Stone Lantern)
        this.box(g, 0.5, 0.8, 0.5, -4.5, 0.4, 2.8, 'stone');
        this.box(g, 0.7, 0.2, 0.7, -4.5, 0.9, 2.8, 'stone');
        this.ball(g, -4.5, 1.15, 2.8, 0.25, 0.25, 0.25, 'white');
        this.box(g, 0.8, 0.15, 0.8, -4.5, 1.35, 2.8, 'stone');
        // 黑松與林蔭造景
        this.tree(g, -5.8, 2.4, 1.25, 0x2d4e35);
        this.tree(g, 5.8, 2.6, 1.3, 0x2d4e35);
        this.tree(g, 7.2, 2.0, 1.0, 0x3d6642);
        this.bench(g, 4.2, 2.8, 'wood');
        break;
      case '35':
        // 林洋港故居 (前美軍總司令官邸)：愛富二街 1 號最高規格美軍官舍
        // 包含：寬幅美式南方洋房、紅磚高聳煙囪、迎賓大木迴廊(Front Porch)、將官旗桿、百年老樟樹、名邸木牌
        // 1. 將官級寬闊美式南方木屋主體 (General's Southern Ranch Villa)
        this.house(g, { w: 12.0, d: 5.8, wall: 0xede8dc, roof: 0x3d4349, porch: true });
        // 2. 經典大面雙層木格窗與陽光落地窗 (Picture Windows)
        this.window(g, -3.8, 1.6, 3.05, 2.2, 1.6, 'wood');
        this.window(g, 3.8, 1.6, 3.05, 2.2, 1.6, 'wood');
        this.window(g, -1.8, 1.6, 3.05, 1.4, 1.6, 'dark');
        // 3. 高聳粗獷紅磚雙管壁爐煙囪 (Red Brick Double Chimney)
        this.box(g, 1.2, 5.8, 0.9, -5.2, 2.9, -0.2, 0xa34a38);
        this.box(g, 1.4, 0.25, 1.1, -5.2, 5.9, -0.2, 0x8a3c2c);
        this.box(g, 0.3, 0.45, 0.3, -5.5, 6.2, -0.2, 'stone');
        this.box(g, 0.3, 0.45, 0.3, -4.9, 6.2, -0.2, 'stone');
        // 4. 司令官邸大門名牌匾額與將官迎賓旗桿 (Sign & Flagpole)
        this.sign(g, '林洋港故居 (前美軍總司令官邸)', 0, 3.3, 3.32, 5.8, '#3d2b1f', '#fbf5e6');
        // 迎賓升旗桿 (Flagpole)
        this.box(g, 0.15, 6.2, 0.15, 4.8, 3.1, 4.2, 'white');
        this.ball(g, 4.8, 6.25, 4.2, 0.22, 0.22, 0.22, 0xd4af37); // 金色球頂
        this.box(g, 1.0, 0.6, 0.05, 4.3, 5.6, 4.2, 0x1f3c88);     // 將官旗幟
        // 5. 百年老樟樹、低矮綠樹籬與庭院草坪 (Century Trees & Garden)
        this.tree(g, -6.5, 3.5, 1.5, 0x2e5936); // 老樟樹
        this.tree(g, 6.2, 3.2, 1.35, 0x3d6642);
        this.box(g, 12.8, 0.4, 0.4, 0, 0.2, 4.8, 0x3d6635); // 正面矮樹籬
        this.bench(g, 1.8, 3.6, 'wood');
        break;
      case '36':
        // 文化大學學生美食街 (牛肉拌麵 / 感恩麵店)：光華路文大生活圈核心
        // 包含：雙拼台式美食老街屋、牛肉乾拌麵經典大紅招牌與紅遮雨棚、感恩麵店、自取大骨牛肉清湯大白鐵桶、大蒜蒜泥盆、大紅燈籠、戶外木方桌板凳與學生機車
        // 1. 左棟：傳奇「牛肉乾拌麵」老店 (Famous Beef Tossed Noodle Shop)
        this.box(g, 6.0, 0.28, 5.2, -2.6, 0.14, 0, 'stone');
        this.box(g, 5.8, 3.2, 5.0, -2.6, 1.74, 0, 0xf6f1e8); // 溫暖米白色老宅牆面
        this.roof(g, 6.4, 5.6, 3.4, 1.15, 0x4a433d, -2.6, 0, true); // 深灰日洋瓦頂
        // 經典波浪紅雨棚與大紅大字橫牌
        this.box(g, 5.8, 0.2, 1.8, -2.6, 2.8, 3.0, 0xc62828); // 鮮紅遮雨棚
        this.sign(g, '文化大學傳奇 牛肉乾拌麵 (光華路總店)', -2.6, 3.15, 2.55, 5.2, '#c62828', '#fff8e1');
        // 白鐵不鏽鋼煮麵料理台、大湯鍋與大蒜蒜泥盆
        this.box(g, 2.8, 0.85, 1.0, -3.2, 0.55, 2.8, 'metal');
        this.box(g, 0.5, 0.4, 0.5, -4.0, 1.15, 2.8, 'metal');  // 大骨清湯鍋（免費任喝！）
        this.box(g, 0.5, 0.35, 0.5, -3.2, 1.12, 2.8, 'metal'); // 煮麵滾水鍋
        this.box(g, 0.35, 0.22, 0.35, -2.4, 1.05, 2.8, 0xf5f5f5); // 大蒜蒜泥盆
        // 大紅燈籠 (Red Lanterns)
        this.ball(g, -4.6, 2.4, 3.4, 0.22, 0.28, 0.22, 0xd32f2f);
        this.ball(g, -2.6, 2.4, 3.4, 0.22, 0.28, 0.22, 0xd32f2f);
        this.ball(g, -0.6, 2.4, 3.4, 0.22, 0.28, 0.22, 0xd32f2f);

        // 2. 右棟：感恩麵店與學生熱炒食堂 (Gan-En Noodle & Fried Rice House)
        this.box(g, 5.4, 0.25, 4.8, 3.2, 0.12, 0, 'stone');
        this.box(g, 5.2, 2.9, 4.6, 3.2, 1.57, 0, 0xecd9c6); // 暖黃紅磚外牆
        this.box(g, 5.2, 0.8, 0.2, 3.2, 0.52, 2.35, 'brick'); // 底部清水紅磚
        this.roof(g, 5.8, 5.2, 3.1, 1.05, 0x8d5b38, 3.2, 0, true); // 棕色屋頂
        this.sign(g, '感恩麵店 · 學生熱炒便當', 3.2, 2.9, 2.42, 4.6, '#3e2723', '#fff9c4');
        this.door(g, 2.0, 2.35, 2.1, 'wood');
        this.window(g, 4.2, 1.65, 2.35, 1.6, 1.3, 'wood');

        // 3. 騎樓學生用餐區（方桌、圓凳）與機車
        // 用餐木方桌與板凳
        this.box(g, 1.3, 0.72, 0.85, 3.6, 0.42, 3.4, 'wood');
        this.box(g, 0.35, 0.42, 0.35, 2.8, 0.25, 3.4, 0x8d5b38);
        this.box(g, 0.35, 0.42, 0.35, 4.4, 0.25, 3.4, 0x8d5b38);
        // 學生機車 1 (藍色)
        this.box(g, 0.35, 0.65, 1.2, -0.2, 0.42, 4.2, 0x1976d2);
        this.box(g, 0.28, 0.15, 0.6, -0.2, 0.78, 4.0, 'dark');
        this.box(g, 0.3, 0.4, 0.08, -0.2, 0.95, 4.6, 'metal');
        // 學生機車 2 (白色)
        this.box(g, 0.35, 0.65, 1.2, 1.0, 0.42, 4.2, 0xffffff);
        this.box(g, 0.28, 0.15, 0.6, 1.0, 0.78, 4.0, 'dark');
        // 街角暖黃路燈與小樹
        this.box(g, 0.12, 3.6, 0.12, -5.6, 1.8, 3.6, 'dark');
        this.ball(g, -5.6, 3.65, 3.6, 0.24, 0.24, 0.24, 0xfff9c4);
        this.tree(g, 5.8, 2.2, 1.15, 0x3d7042);
        break;
      case '37':
        // 文化大學郵局 (華岡大典館)：華岡路 55 號大典館一樓
        // 包含：大典館古典現代校舍基座與紅柱長廊、中華郵政綠白局舍、經典紅綠雙郵筒、ATM專區、中華郵政綠色郵務機車、校園松樹
        // 1. 大典館一樓校舍主體 (Dadian Hall 1F Podium)
        this.box(g, 10.5, 0.35, 6.0, 0, 0.175, 0, 'stone');
        this.box(g, 10.0, 3.8, 5.6, 0, 2.075, 0, 0xf0eee9); // 大典館淡灰白主牆
        // 文大古典建築特色：紅柱大樑橫帶
        this.box(g, 10.4, 0.3, 5.8, 0, 3.9, 0, 0x9e2a2b);   // 頂層紅樑
        this.box(g, 0.35, 3.8, 0.35, -4.6, 2.0, 2.85, 0x9e2a2b); // 左外側紅柱
        this.box(g, 0.35, 3.8, 0.35, 4.6, 2.0, 2.85, 0x9e2a2b);  // 右外側紅柱
        this.roof(g, 11.2, 6.4, 4.2, 1.25, 0x3d4349, 0, 0, true); // 深灰瓦頂

        // 2. 中華郵政局舍門面 (Chunghwa Post Office Facade)
        // 經典郵政綠招牌帶
        this.box(g, 7.2, 0.65, 0.18, 0, 3.3, 2.85, 0x1b5e20);
        this.sign(g, '中華郵政 文化大學郵局 (臺北125支局)', 0, 3.3, 2.96, 6.8, '#1b5e20', '#ffffff');
        // 郵局營業大廳大門與大面落地玻璃窗
        this.door(g, -1.2, 2.82, 2.2, 'wood');
        this.window(g, 1.6, 1.8, 2.82, 2.2, 1.6, 'frame');
        // 24小時 ATM 提款機專區
        this.box(g, 1.1, 2.2, 0.2, 3.4, 1.25, 2.82, 0x2e7d32);
        this.box(g, 0.7, 0.8, 0.22, 3.4, 1.5, 2.83, 0x90caf9); // ATM 螢幕

        // 3. 經典一紅一綠立體雙郵筒 (Red & Green Mailboxes)
        // 綠色平信郵筒
        this.box(g, 0.42, 0.8, 0.38, -3.2, 0.48, 3.8, 0x2e7d32);
        this.box(g, 0.46, 0.14, 0.42, -3.2, 0.94, 3.8, 0x1b5e20);
        // 紅色限時/航空郵筒
        this.box(g, 0.42, 0.8, 0.38, -2.4, 0.48, 3.8, 0xc62828);
        this.box(g, 0.46, 0.14, 0.42, -2.4, 0.94, 3.8, 0x8e0000);

        // 4. 中華郵政綠色郵務野狼機車 (Postal Motorcycle)
        this.box(g, 0.35, 0.65, 1.2, -4.2, 0.42, 4.3, 0x1b5e20); // 綠色車身
        this.box(g, 0.48, 0.4, 0.45, -4.2, 0.85, 3.8, 0x1b5e20);  // 後座載信大鐵箱
        this.box(g, 0.28, 0.15, 0.5, -4.2, 0.78, 4.2, 'dark');    // 座墊
        this.box(g, 0.3, 0.4, 0.08, -4.2, 0.95, 4.8, 'metal');    // 龍頭

        // 5. 華岡校園松樹、長椅與校舍路燈
        this.tree(g, 5.2, 2.4, 1.3, 0x2e5936); // 校園黑松
        this.tree(g, -5.2, 2.0, 1.1, 0x3d6642);
        this.bench(g, 2.4, 3.8, 'wood');
        this.box(g, 0.12, 3.8, 0.12, 4.5, 1.9, 4.2, 'dark');
        this.ball(g, 4.5, 3.85, 4.2, 0.24, 0.24, 0.24, 0xfff9c4);
        break;
      case '38':
        // 比夢烘焙坊 (The Cafe' By 想 陽明山)：愛富一街 4 號美軍老舍歐風手作烘焙坊
        // 包含：美軍宿舍清水紅磚歐風木屋、大面積陽光採光玻璃屋(Sunroom)、戶外白色大遮陽傘、落羽松庭園、手工麵包大陳列窗與咖啡長椅
        // 1. 美軍宿舍歐風烘焙主木屋 (Main Bakery Cottage)
        this.box(g, 7.8, 0.28, 5.4, -1.8, 0.14, 0, 'stone');
        this.box(g, 7.5, 3.2, 5.0, -1.8, 1.74, 0, 0xfbf7ed); // 象牙白美式雨淋板外牆
        this.box(g, 7.5, 0.85, 0.22, -1.8, 0.55, 2.55, 'brick'); // 底部復古清水紅磚
        this.roof(g, 8.2, 5.8, 3.4, 1.2, 0x423832, -1.8, 0, true); // 深灰棕雙坡美式屋頂
        // 歐風木質招牌帶
        this.box(g, 6.2, 0.65, 0.16, -1.8, 3.05, 2.65, 0x5c4033);
        this.sign(g, '比夢烘焙坊 BIMON BAKERY', -1.8, 3.05, 2.76, 5.6, '#5c4033', '#fff9e6');
        // 烘焙大門與麵包大展示窗
        this.door(g, -3.2, 2.55, 2.2, 'wood');
        this.window(g, -0.6, 1.8, 2.55, 2.2, 1.5, 'wood');
        // 金黃手工生吐司與法式麵包陳列台 (Bread Display)
        this.box(g, 1.8, 0.75, 0.6, -0.6, 0.8, 2.2, 0x8d5b38); // 木質陳列架
        this.box(g, 0.35, 0.25, 0.25, -1.1, 1.3, 2.2, 0xdfa052); // 金黃生吐司 1
        this.box(g, 0.35, 0.25, 0.25, -0.6, 1.3, 2.2, 0xdfa052); // 金黃生吐司 2
        this.box(g, 0.35, 0.25, 0.25, -0.1, 1.3, 2.2, 0xdfa052); // 金黃生吐司 3

        // 2. 側邊延伸陽光玻璃屋 (Glasshouse Dining Sunroom)
        this.box(g, 4.2, 0.25, 4.6, 3.6, 0.12, 0, 'stone');
        this.box(g, 4.0, 2.8, 4.2, 3.6, 1.52, 0, 'glass'); // 陽光透明玻璃帷幕
        // 玻璃屋白色格框
        this.box(g, 0.12, 2.8, 4.2, 1.6, 1.52, 0, 'white');
        this.box(g, 0.12, 2.8, 4.2, 5.6, 1.52, 0, 'white');
        this.box(g, 4.0, 0.12, 4.2, 3.6, 2.92, 0, 'white');
        this.roof(g, 4.6, 4.8, 3.0, 0.9, 0x8a9ba8, 3.6, 0, true); // 淺藍天光斜頂

        // 3. 戶外庭院白色大遮陽傘與咖啡木桌椅
        this.box(g, 0.08, 2.6, 0.08, 1.8, 1.3, 3.8, 'metal'); // 傘柱
        this.roof(g, 2.4, 2.4, 2.6, 0.45, 0xffffff, 1.8, 3.8, true); // 白色大遮陽傘
        this.box(g, 0.8, 0.72, 0.8, 1.8, 0.4, 3.8, 'wood'); // 圓方木桌
        this.box(g, 0.3, 0.42, 0.3, 1.2, 0.25, 3.8, 0x5c4033); // 咖啡椅 1
        this.box(g, 0.3, 0.42, 0.3, 2.4, 0.25, 3.8, 0x5c4033); // 咖啡椅 2

        // 4. 落羽松大庭園、矮樹籬與花圃
        this.tree(g, -5.6, 2.6, 1.45, 0xa36a3e); // 秋冬橙黃色落羽松
        this.tree(g, 5.4, 3.0, 1.3, 0x2e5936);  // 庭園綠樹
        this.box(g, 12.0, 0.4, 0.3, 0, 0.2, 4.6, 0x3d6635); // 庭園矮灌木矮籬
        break;
      case '39': {
        // 39 康迎鼎 陽明山店 (完全還原現場實景：粉紅木山牆眷舍、白煙囪、粉紅立柱書法招牌、前庭半球幾何透明穹頂球屋與小籠包)
        this.lawn(g, 11, 9, 0, 0);

        // 1. 美軍改建美式中式餐廳主屋 (粉紅山牆 + 純白粉牆 + 黑瓦斜頂)
        this.box(g, 8.2, 0.25, 5.4, 0, 0.12, -0.5, 'stone');
        // 下半截純白牆體
        this.box(g, 7.8, 2.2, 5.0, 0, 1.25, -0.5, 0xffffff);
        // 上半截經典「亮粉紅山牆木板」 (Pink Gable Siding)
        this.box(g, 7.8, 1.4, 5.02, 0, 2.7, -0.5, 0xf06292);
        // 黑瓦雙坡屋頂 (Dark Shingle Roof)
        this.roof(g, 8.6, 5.8, 3.4, 1.25, 0x38393d, 0, -0.5, true);
        // 屋脊中央「純白磚造煙囪」 (White Chimney)
        this.box(g, 0.9, 2.2, 0.9, 0, 3.8, -0.5, 0xffffff);
        this.box(g, 1.05, 0.15, 1.05, 0, 4.95, -0.5, 0x212121); // 煙囪黑鐵蓋
        // 正門入口木門與百葉氣窗
        this.door(g, 1.6, 1.95, 2.0, 'wood');
        this.box(g, 1.2, 0.8, 0.1, 1.6, 2.4, 2.02, 0xf5f5f5);

        // 2. 右側入口標誌性「高聳粉紅長方柱大燈箱」 (Pink Column Landmark Sign)
        const signX = 3.6;
        const signZ = 3.2;
        // 粉紅方柱 (高 3.4m, 寬 0.85m)
        this.box(g, 0.85, 3.4, 0.85, signX, 1.7, signZ, 0xe91e63);
        // 白底黑紅書法字招牌板 (Com In Dim 康迎鼎)
        this.box(g, 0.75, 2.8, 0.08, signX, 1.7, signZ + 0.44, 0xffffff);
        this.sign(g, '康迎鼎 Com In Dim', signX, 2.2, signZ + 0.5, 2.4, '#e91e63', '#ffffff');

        // 3. 右側木棧道平台 (Wooden Boardwalk)
        this.box(g, 2.0, 0.1, 4.5, 2.0, 0.05, 1.8, 0xa1887f); // 淺灰木板走道

        // 4. 前庭最吸睛核心地標：半球幾何透明穹頂球屋 (Geodesic Transparent Glass Dome)
        const domeX = -1.6;
        const domeZ = 2.2;
        const domeRadius = 1.65;
        // 圓形水泥矮台基
        this.cylinder(g, domeRadius + 0.1, domeRadius + 0.15, 0.25, domeX, 0.12, domeZ, 'stone');

        // 半球形透明天棚玻璃 (Glass Dome)
        const domeGeom = new THREE.SphereGeometry(domeRadius, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMat = new THREE.MeshStandardMaterial({
          color: 0xe0f7fa,
          transparent: true,
          opacity: 0.42,
          roughness: 0.1,
          metalness: 0.1,
          side: THREE.DoubleSide
        });
        const domeMesh = new THREE.Mesh(domeGeom, domeMat);
        domeMesh.position.set(domeX, 0.25, domeZ);
        g.add(domeMesh);

        // 半球幾何金屬三角網格支架 (Geodesic Wireframe)
        const wireGeom = new THREE.WireframeGeometry(domeGeom);
        const wireMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1.5 });
        const wireMesh = new THREE.LineSegments(wireGeom, wireMat);
        wireMesh.position.set(domeX, 0.25, domeZ);
        g.add(wireMesh);

        // 5. 玻璃球屋內：超萌圓滾白嫩小籠包群 (Cute Steaming Xiao Long Bao inside the Dome)
        // 中央圓形蒸籠盤
        this.cylinder(g, 1.0, 1.05, 0.2, domeX, 0.35, domeZ, 0xd2b48c); // 竹黃蒸籠底
        // 主角大白小籠包 (中央)
        const baoList = [
          [domeX, 0.45, domeZ, 0.38],
          [domeX - 0.45, 0.45, domeZ - 0.25, 0.28],
          [domeX + 0.45, 0.45, domeZ - 0.2, 0.28],
          [domeX - 0.2, 0.45, domeZ + 0.4, 0.26],
          [domeX + 0.3, 0.45, domeZ + 0.35, 0.26]
        ];
        baoList.forEach(([bx, by, bz, br], bIdx) => {
          // 白嫩包子身軀
          this.sphere(g, br, bx, by + br, bz, 0xfffef7);
          // 頂端抓褶尖尖
          this.cylinder(g, br * 0.15, br * 0.4, br * 0.3, bx, by + br * 1.8, bz, 0xffeedd);
          // 只有中央大包子加萌萌笑臉
          if (bIdx === 0) {
            this.sphere(g, 0.05, bx - 0.12, by + br * 1.1, bz + br * 0.85, 0x212121); // 左眼
            this.sphere(g, 0.05, bx + 0.12, by + br * 1.1, bz + br * 0.85, 0x212121); // 右眼
            this.sphere(g, 0.06, bx - 0.2, by + br * 0.85, bz + br * 0.8, 0xff8a80);  // 左腮紅
            this.sphere(g, 0.06, bx + 0.2, by + br * 0.85, bz + br * 0.8, 0xff8a80);  // 右腮紅
            this.box(g, 0.08, 0.04, 0.04, bx, by + br * 0.8, bz + br * 0.95, 0xd32f2f); // 小紅嘴
          }
        });

        // 6. 前庭綠樹與灌木籬笆
        this.tree(g, -4.6, 1.8, 1.2, 0x2e7d32);
        this.tree(g, -4.2, -1.8, 1.3, 0x1b5e20);
        this.tree(g, 4.4, -1.8, 1.2, 0x2e7d32);
        this.box(g, 0.4, 1.2, 4.0, -4.8, 0.6, 1.8, 0x2e7d32); // 綠灌木矮籬
        break;
      }
      case '40':
        // 大衛小小羊 (David & Alpaca)：國泰街 9 號美軍宿舍草泥馬(羊駝)景觀餐廳
        // 包含：美式黃白鄉村木屋、草坪白色木柵欄圍欄、兩隻可愛親人的立體白色羊駝(草泥馬)、牧草食槽與戶外休閒遮陽傘
        // 1. 美軍眷舍鄉村主屋 (Main Country Cottage)
        this.box(g, 7.6, 0.28, 5.2, -1.5, 0.14, 0, 'stone');
        this.box(g, 7.2, 3.0, 4.8, -1.5, 1.64, 0, 0xfbf2d5); // 暖黃色美式木外牆
        this.roof(g, 8.0, 5.6, 3.2, 1.15, 0x48423d, -1.5, 0, true); // 深灰美式雙坡瓦頂
        // 歐風童話招牌
        this.box(g, 6.0, 0.65, 0.16, -1.5, 2.9, 2.55, 0x5d4037);
        this.sign(g, '大衛小小羊 David & Alpaca', -1.5, 2.9, 2.66, 5.4, '#5d4037', '#fff8e7');
        this.door(g, -3.2, 2.45, 2.1, 'wood');
        this.window(g, -0.6, 1.7, 2.45, 2.0, 1.4, 'wood');

        // 2. 草泥馬(羊駝)放牧草坪與白色木柵欄 (Alpaca Paddock)
        this.box(g, 5.6, 0.06, 4.0, 2.5, 0.03, 3.2, 0x5b8743); // 嫩綠色放牧草坪
        // 白色木圍欄
        this.box(g, 5.6, 0.8, 0.08, 2.5, 0.45, 5.2, 'white');
        this.box(g, 0.08, 0.8, 4.0, 5.3, 0.45, 3.2, 'white');

        // 3. 兩隻立體萌系白色羊駝 (Two Fluffy White Alpacas)
        // 羊駝 1 (站立親人)
        this.ball(g, 1.6, 0.85, 3.6, 0.65, 0.45, 0.45, 0xfdfdfb); // 蓬鬆身軀
        this.box(g, 0.22, 0.85, 0.22, 1.85, 1.35, 3.6, 0xfdfdfb); // 長長細脖子
        this.ball(g, 1.85, 1.85, 3.6, 0.26, 0.24, 0.32, 0xfdfdfb); // 呆萌頭部
        this.ball(g, 1.95, 2.02, 3.5, 0.06, 0.14, 0.06, 0xfdfdfb);  // 左尖耳
        this.ball(g, 1.95, 2.02, 3.7, 0.06, 0.14, 0.06, 0xfdfdfb);  // 右尖耳
        this.ball(g, 2.02, 1.82, 3.55, 0.04, 0.04, 0.04, 'dark');   // 圓黑眼珠
        this.ball(g, 2.02, 1.82, 3.65, 0.04, 0.04, 0.04, 'dark');
        // 四條細腿
        this.box(g, 0.1, 0.55, 0.1, 1.35, 0.28, 3.45, 0xf0efe8);
        this.box(g, 0.1, 0.55, 0.1, 1.35, 0.28, 3.75, 0xf0efe8);
        this.box(g, 0.1, 0.55, 0.1, 1.85, 0.28, 3.45, 0xf0efe8);
        this.box(g, 0.1, 0.55, 0.1, 1.85, 0.28, 3.75, 0xf0efe8);

        // 羊駝 2 (低頭吃草料)
        this.ball(g, 3.6, 0.75, 4.0, 0.58, 0.42, 0.42, 0xfbfbf8);
        this.box(g, 0.2, 0.65, 0.2, 3.9, 0.95, 4.0, 0xfbfbf8);
        this.ball(g, 4.1, 0.8, 4.0, 0.24, 0.22, 0.28, 0xfbfbf8); // 低頭吃草
        // 木質牧草食槽與胡蘿蔔
        this.box(g, 0.9, 0.35, 0.5, 4.4, 0.2, 4.0, 0x8d5b38);
        this.box(g, 0.25, 0.15, 0.12, 4.4, 0.4, 4.0, 0xff7043); // 橙色胡蘿蔔

        // 4. 戶外遮陽傘與落羽松綠意
        this.box(g, 0.08, 2.4, 0.08, -3.8, 1.2, 3.8, 'metal');
        this.roof(g, 2.2, 2.2, 2.4, 0.4, 0xfff9c4, -3.8, 3.8, true); // 暖黃遮陽傘
        this.tree(g, -5.6, 2.6, 1.3, 0x2e5936);
        break;
      case '41': {
        // 朱里昂法式廚房 (C.L Program)：國泰街 3 號亮黃歐風美軍老木屋
        this.lawn(g, 10, 8, 0, 0);

        // 1. 鮮黃美式木屋主建築 (Bright Yellow Country Cottage)
        this.box(g, 8.0, 0.28, 5.4, 0, 0.14, 0, 'stone');
        this.box(g, 7.6, 3.2, 5.0, 0, 1.74, 0, 0xfbc02d); // 標誌性明亮暖黃色外牆
        this.roof(g, 8.4, 5.8, 3.4, 1.2, 0x4e342e, 0, 0, true); // 濃郁深棕色美式雙坡瓦頂
        // 藍白條紋法式遮陽棚 (Blue-and-White French Awning)
        this.box(g, 6.0, 0.18, 1.6, 0, 2.8, 2.9, 0x1976d2); // 皇家藍
        this.box(g, 1.2, 0.2, 1.62, -1.8, 2.8, 2.9, 0xffffff); // 白色條紋 1
        this.box(g, 1.2, 0.2, 1.62, 0.6, 2.8, 2.9, 0xffffff);  // 白色條紋 2
        // 招牌
        this.box(g, 6.4, 0.65, 0.16, 0, 3.1, 2.55, 0x3e2723);
        this.sign(g, '朱里昂法式廚房 Julien Kitchen (頂級可麗露)', 0, 3.1, 2.66, 5.8, '#3e2723', '#fff9c4');
        this.door(g, -2.0, 2.55, 2.2, 'wood');
        this.window(g, 1.8, 1.8, 2.55, 2.0, 1.4, 'wood');

        // 2. 招牌「法式可麗露 (Canelé)」展示玻璃櫃 (Canelé Display Counter)
        this.box(g, 1.6, 0.85, 0.65, 1.8, 0.6, 2.2, 'wood');
        this.box(g, 1.5, 0.6, 0.55, 1.8, 1.15, 2.2, 'glass'); // 玻璃罩
        // 3 顆精緻深焦糖色可麗露 (Canelés)
        this.box(g, 0.22, 0.24, 0.22, 1.4, 1.0, 2.2, 0x3e2723);
        this.box(g, 0.22, 0.24, 0.22, 1.8, 1.0, 2.2, 0x3e2723);
        this.box(g, 0.22, 0.24, 0.22, 2.2, 1.0, 2.2, 0x3e2723);

        // 3. 戶外法式咖啡小圓桌椅與花圃 (French Cafe Patio)
        this.box(g, 0.06, 0.72, 0.06, -3.2, 0.36, 3.6, 'metal');
        this.box(g, 0.8, 0.05, 0.8, -3.2, 0.72, 3.6, 'wood'); // 咖啡圓桌
        this.box(g, 0.32, 0.42, 0.32, -3.8, 0.25, 3.6, 0x3e2723);
        this.box(g, 0.32, 0.42, 0.32, -2.6, 0.25, 3.6, 0x3e2723);

        // 4. 繁花綠意庭園
        this.tree(g, -4.5, 2.0, 1.1, 0x2e5936);
        this.tree(g, 4.5, 2.2, 1.2, 0xa36a3e);
        break;
      }
      case '42':
        // 文化大學後山「情人坡」：全台北第一浪漫夜景勝地
        // 包含：挑高木棧觀景平台、雙筒觀景望遠鏡、台北盆地夜景解說銅牌、雙人觀景木椅、情侶約會機車與暖黃街燈
        // 1. 挑高斜坡雙層木棧觀景平台 (Tiered Timber Lookout Deck)
        this.box(g, 10.5, 0.35, 6.4, 0, 0.18, 0, 0x5c4033); // 下層深色防腐木平台
        this.box(g, 8.8, 0.45, 4.8, 0, 0.58, -0.6, 0x795548); // 上層挑高觀景主台
        // 安全木護欄 (Safety Railings)
        this.box(g, 10.5, 0.85, 0.12, 0, 0.78, -3.2, 0x4e342e); // 北側懸崖展望護欄
        this.box(g, 0.12, 0.85, 6.4, -5.2, 0.78, 0, 0x4e342e);
        this.box(g, 0.12, 0.85, 6.4, 5.2, 0.78, 0, 0x4e342e);

        // 2. 標誌銘牌：台北百萬夜景全景導覽解說牌 (Night View Panorama Plaque)
        this.box(g, 0.15, 1.4, 0.15, 0, 0.7, -3.1, 'wood');
        this.sign(g, '文化大學後山「情人坡」· 台北百萬夜景', 0, 1.45, -3.02, 5.2, '#0d1b2a', '#ffea00');

        // 3. 投幣式金屬雙筒觀景望遠鏡 (Binocular Lookout Scope)
        this.box(g, 0.16, 1.1, 0.16, -2.4, 1.1, -2.6, 'metal'); // 支架
        this.box(g, 0.45, 0.18, 0.5, -2.4, 1.7, -2.6, 'metal');  // 雙筒望遠鏡身
        this.box(g, 0.16, 1.1, 0.16, 2.4, 1.1, -2.6, 'metal');
        this.box(g, 0.45, 0.18, 0.5, 2.4, 1.7, -2.6, 'metal');

        // 4. 雙人約會觀景木質長椅 (Scenic Benches)
        this.bench(g, -3.2, -0.8, 'wood');
        this.bench(g, 3.2, -0.8, 'wood');

        // 5. 情侶約會機車群 (Dating Scooters)
        // 紅色機車
        this.box(g, 0.35, 0.65, 1.2, -2.8, 0.42, 2.8, 0xd32f2f);
        this.box(g, 0.28, 0.15, 0.6, -2.8, 0.78, 2.6, 'dark');
        this.box(g, 0.3, 0.4, 0.08, -2.8, 0.95, 3.2, 'metal');
        // 黑色機車
        this.box(g, 0.35, 0.65, 1.2, -1.8, 0.42, 2.8, 0x212121);
        this.box(g, 0.28, 0.15, 0.6, -1.8, 0.78, 2.6, 'dark');
        this.box(g, 0.3, 0.4, 0.08, -1.8, 0.95, 3.2, 'metal');

        // 6. 復古景觀雙球街燈柱與草坡
        this.box(g, 0.14, 4.2, 0.14, 3.8, 2.1, 2.6, 'dark');
        this.ball(g, 3.4, 4.25, 2.6, 0.26, 0.26, 0.26, 0xfff59d); // 暖黃燈球 1
        this.ball(g, 4.2, 4.25, 2.6, 0.26, 0.26, 0.26, 0xfff59d); // 暖黃燈球 2
        this.tree(g, -5.6, 2.4, 1.2, 0x2e5936);
        this.tree(g, 5.6, 2.6, 1.3, 0x2e5936);
        break;
      case '43':
        // 仇人坡 (荀子大道) 與百花池：文化大學最著名的傳奇校園地標
        // 包含：層層遞升的校園連續大青石階梯、白色石雕欄杆、荀子大道石碑、大恩館前百花池圓形花圃與八角中式涼亭
        // 1. 仇人坡連續好漢坡大石階梯 (Tiered Campus Stone Steps)
        for (let i = 0; i < 5; i++) {
          const y = i * 0.35 + 0.175;
          const z = 3.6 - i * 1.1;
          const w = 5.2;
          this.box(g, w, 0.36, 1.2, 0, y, z, 'stone');
          // 階梯兩側白色石雕護欄 (White Balustrades)
          this.box(g, 0.22, 0.65, 1.2, -w / 2 - 0.1, y + 0.35, z, 'white');
          this.box(g, 0.22, 0.65, 1.2, w / 2 + 0.1, y + 0.35, z, 'white');
        }
        // 階梯起點校園石碑 (Campus Milestone)
        this.box(g, 0.45, 1.3, 0.3, 3.2, 0.65, 4.0, 'stone');
        this.sign(g, '荀子大道 · 仇人坡', 3.2, 1.1, 4.16, 2.4, '#5c1d1d', '#ffffff');

        // 2. 階梯頂部：大恩館前「百花池」圓形繽紛花圃 (Hundred Flower Pond)
        this.box(g, 5.8, 0.28, 4.8, 0, 1.9, -2.4, 'stone'); // 百花池石造基座
        this.box(g, 5.2, 0.15, 4.2, 0, 2.05, -2.4, 0x3d7042); // 翠綠花圃草地
        // 四季繽紛花卉 (Colorful Blossoms)
        const chpFlowers = [0xe91e63, 0xffeb3b, 0xff5722, 0x9c27b0, 0x00bcd4];
        for (let fx = -2.0; fx <= 2.0; fx += 1.0) {
          for (let fz = -3.8; fz <= -1.0; fz += 1.4) {
            const c = chpFlowers[Math.abs(Math.round(fx * 3 + fz * 2)) % chpFlowers.length];
            this.ball(g, fx, 2.2, fz, 0.24, 0.18, 0.24, c);
          }
        }

        // 3. 百花池中央古典八角紅柱中式涼亭 (Chinese Classical Pavilion)
        this.box(g, 3.2, 0.3, 3.2, 0, 2.25, -2.4, 'stone');
        // 四根朱紅圓柱
        [-1.2, 1.2].forEach(px => {
          [-1.2, 1.2].forEach(pz => {
            this.box(g, 0.22, 2.4, 0.22, px, 3.45, -2.4 + pz, 0xa92323);
          });
        });
        // 涼亭古典四角飛簷青瓦頂
        this.roof(g, 4.2, 4.2, 4.65, 1.2, 0x2e4033, 0, -2.4, true);
        this.ball(g, 0, 5.3, -2.4, 0.22, 0.35, 0.22, 0xd4af37); // 金色寶頂

        // 4. 校園黑松與復古路燈
        this.tree(g, -4.8, 1.8, 1.35, 0x2e5936);
        this.tree(g, 4.8, 1.8, 1.35, 0x2e5936);
        this.box(g, 0.12, 3.6, 0.12, -3.2, 1.8, 3.8, 'dark');
        this.ball(g, -3.2, 3.65, 3.8, 0.22, 0.22, 0.22, 0xfff9c4);
        break;
      case '44':
        // 草山水管路步道 (愛富段出口)：世界級文化景觀草山水道系統
        // 包含：天母古道親山步道原木牌坊、著名黑色巨大高壓鑄鐵水管、石造排氣閥調整池、清澈湧泉洗手池與翠綠山林
        // 1. 天母古道親山步道原木大牌坊 (Rustic Trailhead Timber Portal)
        this.box(g, 0.35, 3.6, 0.35, -2.4, 1.8, 2.8, 'wood'); // 左原木柱
        this.box(g, 0.35, 3.6, 0.35, 2.4, 1.8, 2.8, 'wood');  // 右原木柱
        this.box(g, 5.4, 0.45, 0.35, 0, 3.5, 2.8, 'wood');    // 原木橫樑
        this.sign(g, '天母古道親山步道 · 水管路愛富段', 0, 3.5, 3.02, 5.0, '#2d4739', '#e8f5e9');
        // 親山步道拓印台與里程石樁
        this.box(g, 0.35, 0.9, 0.35, -1.8, 0.45, 3.4, 'stone');
        this.box(g, 0.25, 1.1, 0.25, 2.8, 0.55, 3.4, 'wood');

        // 2. 標誌性地標：草山水道黑色巨大高壓鑄鐵水管 (Historic Black Giant Water Pipeline)
        // 水管主體 (斜向穿過園區)
        this.box(g, 9.6, 0.72, 0.72, 0, 0.36, -0.6, 0x1f1f1f); // 黑色鑄鐵高壓大管
        // 水管凸緣接頭 (Pipe Flanges)
        [-3.6, -1.2, 1.2, 3.6].forEach(fx => {
          this.box(g, 0.16, 0.9, 0.9, fx, 0.36, -0.6, 0x3d3d3d);
          this.box(g, 0.35, 0.25, 0.85, fx, 0.12, -0.6, 'stone'); // 管線固定石墩
        });
        // 古老石造減壓排氣閥小石室 (Stone Valve Chamber)
        this.box(g, 1.8, 1.4, 1.8, -3.8, 0.7, -2.2, 'stone');
        this.box(g, 2.0, 0.2, 2.0, -3.8, 1.45, -2.2, 'dark'); // 鐵鑄頂蓋

        // 3. 山泉流水洗手石槽與石板步道
        this.box(g, 1.2, 0.65, 0.8, 3.2, 0.32, 1.2, 'stone');
        this.box(g, 1.0, 0.08, 0.6, 3.2, 0.58, 1.2, 0x81d4fa); // 清澈泉水
        // 步道石板 (Slate Pathway)
        for (let sz = 3.6; sz >= -2.0; sz -= 1.1) {
          this.box(g, 1.2, 0.08, 0.8, 0, 0.04, sz, 'stone');
        }

        // 4. 茂密山林大樹與木長椅
        this.tree(g, -5.2, 2.8, 1.5, 0x1b4d2e);
        this.tree(g, 4.8, 3.2, 1.6, 0x2e5936);
        this.bench(g, 2.8, -1.8, 'wood');
        break;

      case '45': {
        // 45 草山行館 (昭和日式檜木官邸、歇山黑瓦坡頂、緣側迴廊與日式松石庭園)
        this.lawn(g, 15, 14);

        // 1. 安山岩疊石基座 (Stone Base)
        this.box(g, 11.2, 0.45, 8.4, 0, 0.22, -0.2, 0x5a554c);

        // 2. 主棟日式木造平房 (Main Wooden Pavilion)
        this.box(g, 7.6, 2.8, 5.4, -0.6, 1.85, -0.4, 0x4a3728); // 深色檜木雨淋板外牆
        // 日式推拉木格窗與玻璃 (Shoji Windows)
        [-2.8, -1.2, 0.4, 2.0].forEach(wx => {
          this.box(g, 1.1, 1.4, 0.1, wx - 0.6, 1.9, 2.32, 0xfdfbf7); // 和紙白窗
          this.box(g, 0.08, 1.45, 0.12, wx - 0.6, 1.9, 2.33, 0x2e1f14); // 窗櫺中柱
          this.box(g, 1.15, 0.08, 0.12, wx - 0.6, 1.9, 2.33, 0x2e1f14); // 窗櫺橫木
        });

        // 3. 側翼雅緻茶室與美齡書房 (Tea Room Wing)
        this.box(g, 3.2, 2.4, 3.8, 3.8, 1.65, 0.2, 0x5c4432);
        this.box(g, 1.4, 1.2, 0.1, 3.8, 1.7, 2.12, 0xfff9e6); // 暖黃茶室紙窗

        // 4. 外挑緣側迴廊 (Engawa Veranda)
        this.box(g, 8.6, 0.18, 1.2, -0.6, 0.52, 2.8, 0xbfa074); // 原木走廊地板
        // 支撐迴廊的日式木角柱
        for (let px = -4.5; px <= 3.3; px += 1.3) {
          this.box(g, 0.14, 2.5, 0.14, px, 1.7, 3.35, 0x3d2b1f);
        }

        // 5. 日式歇山層疊黑瓦坡頂 (Black Tile Roof)
        // 主棟黑瓦大屋頂
        this.roof(g, 9.2, 6.8, 1.6, -0.6, 3.85, -0.4, 0x2b2d42);
        this.box(g, 8.2, 0.22, 0.35, -0.6, 4.65, -0.4, 0x1f2029); // 屋脊大棟
        // 側翼小屋頂
        this.roof(g, 4.2, 4.6, 1.2, 3.8, 3.25, 0.2, 0x2b2d42);

        // 6. 入口日式玄關門廊與行館木匾額
        this.box(g, 2.0, 0.18, 1.6, -0.6, 2.85, 3.8, 0x3d2b1f); // 庇簷
        this.sign(g, '草山行館', -0.6, 2.5, 3.25, 2.0);

        // 7. 日式枯山水松石庭園與石燈籠
        this.box(g, 0.45, 1.1, 0.45, -3.2, 0.55, 4.5, 0x8d99ae); // 石燈籠台座
        this.box(g, 0.6, 0.4, 0.6, -3.2, 1.25, 4.5, 0x2b2d42);  // 石燈籠頂笠
        this.box(g, 0.3, 0.3, 0.3, -3.2, 0.95, 4.5, 0xffbe0b);  // 點亮微光
        // 造景石與日式黑松
        this.box(g, 1.2, 0.7, 0.9, 2.8, 0.35, 4.2, 0x757575);
        this.box(g, 0.8, 0.5, 0.6, 4.0, 0.25, 4.6, 0x616161);
        this.tree(g, -5.0, 3.0, 1.4, 0x1b4332);
        this.tree(g, 5.2, 3.2, 1.5, 0x2d6a4f);
        break;
      }

      case '46': {
        // 46 文化大學大孝館 (陽明山最著名巨型圓柱綜合體育館、穹頂天幕與環狀採光帶)
        this.lawn(g, 16, 16);

        // 1. 花崗岩挑高迎賓基座與廣場 (Plaza Base)
        this.box(g, 13.5, 0.6, 13.5, 0, 0.3, 0, 0xcfd8dc); // 廣場石板基座
        // 前方寬闊迎賓入館大台階
        this.box(g, 6.0, 0.2, 1.6, 0, 0.2, 7.2, 0xb0bec5);
        this.box(g, 5.2, 0.4, 1.0, 0, 0.4, 6.9, 0xb0bec5);

        // 2. 標誌性巨型「圓柱體」主體樓身 (Colossal Cylindrical Stadium Body)
        // 使用 16 面圓環幾何逼近圓柱，直徑 10.5m，樓高 7.5m
        const cSegments = 16;
        const cRadius = 5.2;
        const cHeight = 6.8;
        const cY = 0.6 + cHeight / 2; // 中心高 4.0

        for (let i = 0; i < cSegments; i++) {
          const angle = (i / cSegments) * Math.PI * 2;
          const nextAngle = ((i + 1) / cSegments) * Math.PI * 2;
          const midAngle = (angle + nextAngle) / 2;
          const segWidth = 2 * cRadius * Math.sin(Math.PI / cSegments) + 0.15;

          const cx = Math.cos(midAngle) * cRadius;
          const cz = Math.sin(midAngle) * cRadius;

          // 圓柱體立體外牆 (淡暖白/米灰花崗岩質感)
          const wallMesh = new THREE.Mesh(this.boxGeometry, this.mat(0xecf0f1));
          wallMesh.scale.set(segWidth, cHeight, 0.4);
          wallMesh.position.set(cx, cY, cz);
          wallMesh.rotation.y = -midAngle + Math.PI / 2;
          wallMesh.castShadow = wallMesh.receiveShadow = true;
          g.add(wallMesh);

          // 圓柱中間腰部：環狀大跨距深色條狀採光窗 (Belt Windows)
          const winMesh = new THREE.Mesh(this.boxGeometry, this.mat(0x263238));
          winMesh.scale.set(segWidth * 0.88, 1.4, 0.44);
          winMesh.position.set(cx, cY + 0.3, cz);
          winMesh.rotation.y = -midAngle + Math.PI / 2;
          g.add(winMesh);

          // 頂層環形立體挑簷遮陽柱 (Top Crown Pillars)
          const pilMesh = new THREE.Mesh(this.boxGeometry, this.mat(0x78909c));
          pilMesh.scale.set(0.24, 1.8, 0.5);
          pilMesh.position.set(cx * 1.04, cY + 2.7, cz * 1.04);
          pilMesh.rotation.y = -midAngle + Math.PI / 2;
          g.add(pilMesh);
        }

        // 3. 圓柱頂部巨型飛碟式環形鋼架挑簷與穹頂 (Dome & Canopy)
        // 環狀出挑外簷 (Outer Ring Eaves)
        for (let i = 0; i < cSegments; i++) {
          const angle = (i / cSegments) * Math.PI * 2;
          const nextAngle = ((i + 1) / cSegments) * Math.PI * 2;
          const midAngle = (angle + nextAngle) / 2;
          const segWidth = 2 * (cRadius + 0.6) * Math.sin(Math.PI / cSegments) + 0.2;
          const cx = Math.cos(midAngle) * (cRadius + 0.35);
          const cz = Math.sin(midAngle) * (cRadius + 0.35);

          const eaveMesh = new THREE.Mesh(this.boxGeometry, this.mat(0x455a64));
          eaveMesh.scale.set(segWidth, 0.4, 0.9);
          eaveMesh.position.set(cx, 7.5, cz);
          eaveMesh.rotation.y = -midAngle + Math.PI / 2;
          g.add(eaveMesh);
        }

        // 體育館白色大跨距中央穹頂 (Dome Roof)
        this.box(g, 8.4, 0.9, 8.4, 0, 7.9, 0, 0xdfe6e9);
        this.box(g, 6.2, 0.7, 6.2, 0, 8.5, 0, 0xb2bec3);
        this.box(g, 3.8, 0.5, 3.8, 0, 9.0, 0, 0x90a4ae);
        // 屋頂避雷針頂桿
        this.box(g, 0.16, 1.8, 0.16, 0, 9.9, 0, 0xffffff);

        // 4. 正門挑高玻璃迎賓大廳門廊 (Glass Entrance Portico)
        this.box(g, 4.4, 2.6, 2.2, 0, 1.9, 5.0, 0x37474f); // 門廊框架
        this.box(g, 3.6, 2.0, 0.1, 0, 1.6, 6.12, 0x81d4fa); // 藍光採光玻璃大門
        this.sign(g, '文化大學 大孝館 (體育館)', 0, 3.4, 6.15, 3.8);

        // 5. 體育館周邊設施與戶外籃球架裝置藝術
        this.box(g, 0.14, 2.6, 0.14, -5.2, 1.3, 3.8, 0x2c3e50); // 籃球架支柱
        this.box(g, 1.4, 0.9, 0.08, -5.2, 2.5, 3.8, 0xffffff);  // 籃板
        this.box(g, 0.45, 0.06, 0.45, -5.2, 2.2, 4.05, 0xe17055); // 橘色籃框
        // 校園行道樹與路燈
        this.tree(g, 5.4, 3.4, 1.5, 0x1b5e20);
        this.tree(g, -5.8, 3.0, 1.4, 0x2e7d32);
        this.bench(g, 4.5, 5.2, 'wood');
        break;
      }

      case '47': {
        // 47 草山夜未眠景觀餐廳 (金色旋轉木馬、心形發光空中步道、百年相思樹與璀璨夜景露台)
        this.lawn(g, 18, 16);

        // 1. 雙層依懸崖而建的柚木景觀觀景露台 (Tiered Viewing Decks)
        // 上層木質用餐露台 (Upper Deck)
        this.box(g, 15.5, 0.7, 5.5, 0, 1.85, -2.5, 0x5c4432);
        // 下層懸崖前緣露台 (Lower Deck)
        this.box(g, 14.0, 0.6, 5.2, 0, 1.05, 2.5, 0x4e3629);

        // 2. 標誌性「金色夢幻旋轉木馬」景觀地標 (Golden Carousel)
        // 圓形木地板基座
        this.box(g, 4.6, 0.25, 4.6, -4.5, 2.3, -2.5, 0xd4a373);
        // 旋轉木馬金黃色頂棚 (Golden Octagonal Canopy)
        this.roof(g, 4.8, 4.8, 1.4, -4.5, 4.6, -2.5, 0xffd166);
        this.box(g, 0.2, 0.6, 0.2, -4.5, 5.4, -2.5, 0xffbe0b); // 頂尖金球
        // 八根旋轉金屬支柱與中央旋轉軸
        this.box(g, 0.6, 2.2, 0.6, -4.5, 3.3, -2.5, 0xfaedcd); // 中軸
        [-1.6, 1.6].forEach(px => {
          [-1.6, 1.6].forEach(pz => {
            this.box(g, 0.08, 2.2, 0.08, -4.5 + px, 3.3, -2.5 + pz, 0xffd166);
            // 旋轉木馬小馬 (Pastel Horses)
            this.box(g, 0.6, 0.45, 0.25, -4.5 + px, 2.8, -2.5 + pz, 0xffccd5);
          });
        });

        // 3. 凌空懸挑「浪漫心形發光空中觀景台」 (Heart-shaped Sky Walkway)
        // 向懸崖外凌空伸出的透明發光步道 (4m 長)
        this.box(g, 1.6, 0.15, 4.2, 3.6, 1.25, 5.2, 0x80ed99); // 發光透光棧道
        this.box(g, 0.08, 0.8, 4.2, 2.8, 1.65, 5.2, 'glass');  // 左側透明玻璃護欄
        this.box(g, 0.08, 0.8, 4.2, 4.4, 1.65, 5.2, 'glass');  // 右側透明玻璃護欄
        // 棧道端點「巨大發光紅心雕塑」 (Giant Glowing Heart Monument)
        this.box(g, 1.8, 1.6, 0.18, 3.6, 2.5, 7.3, 0xff4757); // 愛心主體
        this.box(g, 1.2, 1.1, 0.22, 3.6, 2.5, 7.3, 0xff6b81); // 內部粉紅光心

        // 4. 露天情人白色沙發卡座與高空發光吧台 (Romantic Cabana Lounges)
        [-2.5, 0.8].forEach(sx => {
          this.box(g, 2.2, 0.45, 0.6, sx, 1.5, 1.2, 0xf8f9fa); // 白色沙發椅背
          this.box(g, 2.2, 0.35, 1.2, sx, 1.35, 2.0, 0xf8f9fa); // 沙發坐墊
          this.box(g, 0.8, 0.38, 0.8, sx, 1.4, 2.0, 0xffbe0b); // 暖光小茶几
        });
        // 觀景高腳吧台
        this.box(g, 5.2, 0.95, 0.5, 0.5, 2.65, -0.2, 0x2b2d42);
        this.sign(g, '草山夜未眠 · 旋轉木馬與百萬夜景', 0, 3.6, -4.8, 4.6);

        // 5. 象徵性「百年相思老樹」與童話串燈造景 (Centennial Acacia Tree)
        this.tree(g, 6.2, 4.8, 1.6, 0x1b4332);
        // 樹枝上的童話微光燈泡
        [-0.6, 0.6].forEach(tx => {
          this.box(g, 0.15, 0.15, 0.15, 6.2 + tx, 3.8, -1.8, 0xffd166);
        });

        // 6. 懸崖深谷下方之大台北「百萬夜景星光點陣」
        const nightColors = [0xffd166, 0xffffff, 0x06d6a0, 0x118ab2, 0xef476f];
        for (let i = 0; i < 16; i++) {
          const nx = -6.0 + (i * 0.8);
          const nz = 7.0 + ((i % 4) * 0.5);
          this.box(g, 0.16, 0.16, 0.16, nx, 0.08, nz, nightColors[i % nightColors.length]);
        }
        break;
      }

      case '48': {
        // 48 陽明山順天府 (池府王爺廟：閩南紅磚燕尾宮廟、整排大紅燈籠、三足天公爐、國泰民安對聯與金爐)
        this.lawn(g, 15, 14);

        // 1. 廟埕花崗石板基座 (Temple Plaza Base)
        this.box(g, 11.5, 0.35, 9.2, 0, 0.18, 0, 'stone');

        // 2. 正殿傳統紅磚主體 (Main Brick Hall)
        this.box(g, 7.8, 3.2, 5.2, 0, 1.85, -1.2, 0xa74337); // 閩南紅磚
        // 正面木造紅色大廟門與金屬門釘
        this.box(g, 2.2, 2.2, 0.15, 0, 1.45, 1.42, 0x8b0000);
        // 門兩側石窗
        [-2.4, 2.4].forEach(wx => {
          this.box(g, 1.2, 1.4, 0.12, wx, 1.8, 1.42, 0x3d2b1f);
          this.box(g, 0.08, 1.4, 0.14, wx, 1.8, 1.42, 0xffd700); // 金色窗櫺
        });

        // 3. 正殿門額金字牌匾與門柱對聯 (Pillars & Inscriptions)
        this.sign(g, '順天府 (池府王爺)', 0, 3.4, 1.5, 3.5, '#6a040f', '#ffd166');
        // 門柱對聯「國泰民安」「風調雨順」
        this.box(g, 0.35, 2.0, 0.08, -1.5, 1.6, 1.46, 0xd90429); // 紅底木對聯柱
        this.box(g, 0.35, 2.0, 0.08, 1.5, 1.6, 1.46, 0xd90429);

        // 4. 門前橫排懸掛成串「順天府大紅燈籠」 (Red Lantern String)
        // 橫向懸掛橫木
        this.box(g, 6.8, 0.08, 0.08, 0, 2.65, 2.1, 0x4a3728);
        for (let i = 0; i < 7; i++) {
          const lx = -2.7 + i * 0.9;
          this.ball(g, lx, 2.45, 2.1, 0.42, 0.48, 0.42, 0xd90429); // 圓形大紅燈籠
          this.box(g, 0.15, 0.08, 0.15, lx, 2.7, 2.1, 0xffd700);  // 金色燈籠頂冠
          this.box(g, 0.08, 0.18, 0.08, lx, 2.15, 2.1, 0xffd700); // 金色燈籠流蘇
        }

        // 5. 傳統閩南紅瓦雙燕尾屋頂 (Swallowtail Roof)
        this.roof(g, 9.2, 6.4, 1.6, 0, 4.2, -1.2, 0xbc4749);
        // 屋脊正棟與燕尾飛簷 (Swallowtail Ridge)
        this.box(g, 8.4, 0.28, 0.35, 0, 5.05, -1.2, 0x780000);
        this.box(g, 0.35, 0.35, 0.35, -4.2, 5.25, -1.2, 0xffbe0b); // 翹起燕尾角
        this.box(g, 0.35, 0.35, 0.35, 4.2, 5.25, -1.2, 0xffbe0b);
        this.ball(g, 0, 5.35, -1.2, 0.3, 0.3, 0.3, 0xffbe0b); // 中央寶珠

        // 6. 正殿門前香煙裊裊之「大型三足青銅天公香爐」 (Bronze Incense Burner)
        this.box(g, 1.2, 0.35, 0.9, 0, 0.45, 2.8, 'stone'); // 供桌石台
        this.box(g, 0.9, 0.65, 0.9, 0, 0.95, 3.8, 0x2b2d42);  // 青銅三足天公爐身
        this.box(g, 1.1, 0.12, 1.1, 0, 1.3, 3.8, 0x4a4e69);   // 爐口邊緣
        this.box(g, 0.08, 0.3, 0.08, 0, 1.45, 3.8, 0xff4757);  // 點燃之紅心清香

        // 7. 廟埕八角紅磚金亭 (Incense Furnace) 與建業老榕樹
        this.box(g, 1.4, 1.8, 1.4, -3.8, 1.1, 3.2, 0xa74337); // 金亭身
        this.roof(g, 1.8, 1.8, 0.8, -3.8, 2.4, 3.2, 0x780000); // 金亭頂
        this.tree(g, 4.6, 3.6, 1.35, 0x1b4332);
        this.tree(g, -4.8, 3.2, 1.2, 0x2d6a4f);
        break;
      }

      case '49': {
        // 49 文化大學 大義館 (文化大學全校中心！八角形中式宮殿樓體、中央圓形天井中庭、雙層飛簷大屋頂)
        this.lawn(g, 18, 18);

        // 1. 迎賓花崗石板台基 (Palace Terrace Base)
        this.box(g, 15.5, 0.6, 15.5, 0, 0.3, 0, 'stone');
        // 前方寬闊入館大台階
        this.box(g, 6.5, 0.2, 1.8, 0, 0.2, 8.2, 0xb0bec5);
        this.box(g, 5.8, 0.4, 1.2, 0, 0.4, 7.8, 0xb0bec5);

        // 2. 標誌性「正八角形 (Octagonal)」宮殿樓體 (Octagonal Palace Body)
        // 使用 8 面環狀牆面構築正八邊形宮殿，外徑 13.8m，樓高 7.2m
        const octSegments = 8;
        const octRadius = 6.6;
        const octHeight = 6.5;
        const octY = 0.6 + octHeight / 2; // 3.85

        for (let i = 0; i < octSegments; i++) {
          const angle = (i / octSegments) * Math.PI * 2;
          const nextAngle = ((i + 1) / octSegments) * Math.PI * 2;
          const midAngle = (angle + nextAngle) / 2;
          const segWidth = 2 * octRadius * Math.sin(Math.PI / octSegments) + 0.25;

          const cx = Math.cos(midAngle) * octRadius;
          const cz = Math.sin(midAngle) * octRadius;

          // 八角立體外牆 (宮殿淡黃色/石材色)
          const wallMesh = new THREE.Mesh(this.boxGeometry, this.mat(0xfbf8ee));
          wallMesh.scale.set(segWidth, octHeight, 0.6);
          wallMesh.position.set(cx, octY, cz);
          wallMesh.rotation.y = -midAngle + Math.PI / 2;
          wallMesh.castShadow = wallMesh.receiveShadow = true;
          g.add(wallMesh);

          // 朱紅色中式宮廷角柱
          const colMesh = new THREE.Mesh(this.boxGeometry, this.mat(0xa44638));
          colMesh.scale.set(0.45, octHeight + 0.2, 0.7);
          const px = Math.cos(angle) * octRadius;
          const pz = Math.sin(angle) * octRadius;
          colMesh.position.set(px, octY, pz);
          colMesh.rotation.y = -angle + Math.PI / 2;
          g.add(colMesh);

          // 樓層外凸腰簷 (Belt Cornice)
          const beltMesh = new THREE.Mesh(this.boxGeometry, this.mat(0x35454a));
          beltMesh.scale.set(segWidth * 1.05, 0.25, 0.85);
          beltMesh.position.set(cx, 4.2, cz);
          beltMesh.rotation.y = -midAngle + Math.PI / 2;
          g.add(beltMesh);

          // 各樓層長條宮殿採光窗
          [-segWidth * 0.25, segWidth * 0.25].forEach(ox => {
            const winMesh = new THREE.Mesh(this.boxGeometry, this.mat(0x668d99));
            winMesh.scale.set(1.2, 1.5, 0.65);
            // 局部坐標換算
            const wx = cx + Math.cos(midAngle + Math.PI/2) * ox;
            const wz = cz + Math.sin(midAngle + Math.PI/2) * ox;
            winMesh.position.set(wx, 2.6, wz);
            winMesh.rotation.y = -midAngle + Math.PI / 2;
            g.add(winMesh);

            const winMesh2 = winMesh.clone();
            winMesh2.position.set(wx, 5.5, wz);
            g.add(winMesh2);
          });
        }

        // 3. 空拍圖最顯眼特徵：「中央巨型圓形採光天井中庭」 (Central Circular Courtyard / Skylight)
        // 內環中庭 (直徑約 5.5m)
        this.box(g, 5.5, 0.15, 5.5, 0, 0.65, 0, 0x9b9a8a); // 中庭八卦地磚
        this.box(g, 3.5, 0.08, 3.5, 0, 0.72, 0, 0xd9d5bf);
        // 頂部圓形/八角採光天幕穹頂 (Glass Skylight Canopy)
        this.box(g, 5.8, 0.35, 5.8, 0, 7.3, 0, 0x668d99); // 藍白透光天幕
        this.box(g, 4.2, 0.45, 4.2, 0, 7.6, 0, 0xf6f2e8); // 天幕頂框
        this.box(g, 0.25, 1.2, 0.25, 0, 8.4, 0, 0xbca065); // 正中金色寶頂

        // 4. 重簷八角中式宮殿屋頂 (Double-tiered Roof Eaves)
        for (let i = 0; i < octSegments; i++) {
          const angle = (i / octSegments) * Math.PI * 2;
          const nextAngle = ((i + 1) / octSegments) * Math.PI * 2;
          const midAngle = (angle + nextAngle) / 2;
          const segWidth = 2 * (octRadius + 0.8) * Math.sin(Math.PI / octSegments) + 0.4;
          const cx = Math.cos(midAngle) * (octRadius + 0.4);
          const cz = Math.sin(midAngle) * (octRadius + 0.4);

          const roofMesh = new THREE.Mesh(this.boxGeometry, this.mat(0x476755)); // 華岡經典綠琉璃瓦
          roofMesh.scale.set(segWidth, 0.55, 1.4);
          roofMesh.position.set(cx, 7.15, cz);
          roofMesh.rotation.y = -midAngle + Math.PI / 2;
          g.add(roofMesh);
        }

        // 5. 正門朱紅宮殿門廊與金字大校匾 (Entrance Portico)
        this.box(g, 4.8, 2.8, 1.6, 0, 2.0, 6.8, 0xa44638); // 門廊框架
        this.box(g, 3.8, 2.2, 0.12, 0, 1.7, 7.55, 0x735743); // 木大門
        this.sign(g, '中國文化大學 大義館', 0, 3.8, 7.6, 4.5, '#693630', '#fce8c3');

        // 6. 前庭石獅與校園林蔭樹
        this.box(g, 0.6, 0.9, 0.6, -2.8, 0.8, 7.2, 'stone'); // 左石獅
        this.box(g, 0.6, 0.9, 0.6, 2.8, 0.8, 7.2, 'stone');  // 右石獅
        this.tree(g, -6.8, 3.5, 1.35, 0x1b5e20);
        this.tree(g, 6.8, 3.5, 1.35, 0x1b5e20);
        this.bench(g, 5.2, 5.8, 'wood');
        break;
      }
      case '50': {
        // 50 文化大學 大恩館 (行政中心大樓與百花池中式八角涼亭)
        this.lawn(g, 17, 16);

        // 1. 花崗岩地基平台 (Base Terrace)
        this.box(g, 15, 0.6, 11, 0, 0.3, -1.5, 'stone');
        // 行政大樓正面迎賓大石階
        this.box(g, 7, 0.2, 1.6, 0, 0.2, 4.4, 0xb0bec5);
        this.box(g, 6, 0.4, 1.2, 0, 0.4, 4.0, 0xb0bec5);
        this.box(g, 5, 0.6, 0.8, 0, 0.6, 3.6, 0xb0bec5);

        // 2. 12層巍峨高聳行政主樓塔 (12-Story Tower Body)
        // 主樓體 (寬 12m, 深 8m, 高 11.2m)
        const mainH = 11.2;
        const mainY = 0.6 + mainH / 2; // 6.2
        this.box(g, 12, mainH, 8, 0, mainY, -1.8, 'cream');

        // 樓層外立面分層挑簷線腳與格子玻璃窗帶 (Floor Dividers & Strip Windows)
        for (let fl = 1; fl <= 6; fl++) {
          const fy = 1.0 + fl * 1.65;
          // 橫向白玉挑簷線腳
          this.box(g, 12.3, 0.15, 8.3, 0, fy, -1.8, 0xe0e0e0);
          // 正面採光深色條窗
          this.box(g, 9.6, 0.7, 0.1, 0, fy - 0.7, 2.22, 0x1a237e);
          // 背面條窗
          this.box(g, 9.6, 0.7, 0.1, 0, fy - 0.7, -5.82, 0x1a237e);
        }

        // 行政大樓朱紅正門拱廊柱列 (Main Portico Columns)
        for (let c = -4; c <= 4; c += 2) {
          this.cylinder(g, 0.22, 0.22, 2.8, c, 2.0, 2.3, 0xa44638);
        }
        // 行政大廳入口金色玻璃大門與「大恩館」匾額
        this.box(g, 3.6, 2.0, 0.2, 0, 1.6, 2.22, 0xffd54f);
        this.box(g, 2.2, 0.6, 0.25, 0, 3.2, 2.25, 0x800000); // 匾額底色

        // 3. 頂層中式琉璃金瓦大飛簷屋頂 (Golden Glazed Eaves Palace Roof)
        const roofY = 0.6 + mainH; // 11.8
        // 上層閣樓基座
        this.box(g, 10.5, 1.0, 6.5, 0, roofY + 0.5, -1.8, 'cream');
        // 金色琉璃瓦重簷四坡頂 (Imperial Yellow Hip Roof)
        const roofLower = new THREE.Mesh(this.boxGeometry, this.mat(0xd4af37)); // 金黃琉璃
        roofLower.scale.set(13.6, 0.8, 9.6);
        roofLower.position.set(0, roofY + 1.1, -1.8);
        roofLower.castShadow = true;
        g.add(roofLower);

        // 頂層重簷大飛簷
        const roofUpper = new THREE.Mesh(this.boxGeometry, this.mat(0xb8860b)); // 深金棕琉璃瓦
        roofUpper.scale.set(11.8, 1.4, 7.8);
        roofUpper.position.set(0, roofY + 2.0, -1.8);
        roofUpper.castShadow = true;
        g.add(roofUpper);
        // 正脊脊飾
        this.box(g, 10.0, 0.35, 0.4, 0, roofY + 2.8, -1.8, 0x8d6e63);

        // 4. 樓前著名「百花池」花園水景 (Baihua Fountain Pond)
        // 圓形/八角形石砌百花池外圈 (位於 z: 5.5)
        const pondZ = 5.5;
        this.cylinder(g, 3.2, 3.4, 0.4, -2.5, 0.2, pondZ, 'stone');
        // 水面 (湖水碧藍)
        this.cylinder(g, 2.9, 2.9, 0.3, -2.5, 0.25, pondZ, 0x29b6f6);
        // 中央立體噴泉雕塑水柱 (White Fountain Jets)
        this.cylinder(g, 0.4, 0.6, 0.8, -2.5, 0.6, pondZ, 'stone');
        this.cylinder(g, 0.12, 0.12, 1.2, -2.5, 1.2, pondZ, 0xe0f7fa);
        // 飛濺水花圈
        this.cylinder(g, 0.8, 0.4, 0.15, -2.5, 0.9, pondZ, 0xffffff);

        // 5. 百花池畔經典「八角紅木古典涼亭」 (Octagonal Chinese Pavilion)
        const pavX = 2.8;
        const pavZ = 5.5;
        // 涼亭八角石階基座
        this.cylinder(g, 1.8, 2.0, 0.35, pavX, 0.18, pavZ, 'stone');
        // 涼亭8根朱紅木柱
        for (let i = 0; i < 8; i++) {
          const ang = (i / 8) * Math.PI * 2;
          const colX = pavX + Math.cos(ang) * 1.35;
          const colZ = pavZ + Math.sin(ang) * 1.35;
          this.cylinder(g, 0.08, 0.08, 1.8, colX, 1.1, colZ, 0xa44638);
        }
        // 涼亭深紅木護欄與石桌椅
        this.cylinder(g, 0.5, 0.5, 0.45, pavX, 0.4, pavZ, 'stone');
        // 涼亭八角攢尖綠琉璃瓦寶頂
        const pavRoof = new THREE.Mesh(new THREE.ConeGeometry(2.1, 1.2, 8), this.mat(0x2e6b4d));
        pavRoof.position.set(pavX, 2.3, pavZ);
        pavRoof.castShadow = true;
        g.add(pavRoof);
        // 寶頂金葫蘆珠
        this.sphere(g, 0.2, pavX, 2.95, pavZ, 0xffd54f);

        // 6. 園藝彩色百花壇 (Floral Beds)
        const flowerCols = [0xe91e63, 0xffeb3b, 0xab47bc, 0xff7043];
        for (let fb = 0; fb < 8; fb++) {
          const fx = -5.5 + (fb % 4) * 0.8;
          const fz = 4.2 + Math.floor(fb / 4) * 1.2;
          this.sphere(g, 0.32, fx, 0.3, fz, flowerCols[fb % flowerCols.length]);
        }
        this.tree(g, -6.5, -1.0, 1.4, 0x2e7d32);
        this.tree(g, 6.5, -1.0, 1.4, 0x2e7d32);
        this.tree(g, 5.8, 4.8, 1.2, 0x1b5e20);
        break;
      }
      case '51': {
        // 51 文化大學 大賢館 (法學院與社科院，典雅中式書院、長廊列柱、綠瓦歇山頂)
        this.lawn(g, 15, 14);

        // 1. 基台與寬階梯
        this.box(g, 13.5, 0.5, 9.5, 0, 0.25, 0, 'stone');
        this.box(g, 5.5, 0.2, 1.6, 0, 0.15, 5.2, 0xb0bec5);
        this.box(g, 4.8, 0.35, 1.0, 0, 0.3, 4.8, 0xb0bec5);

        // 2. 書院主樓體 (象牙白粉牆 + 朱紅線腳，4層高)
        const bldgH = 6.2;
        const bldgY = 0.5 + bldgH / 2; // 3.6
        this.box(g, 12, bldgH, 8, 0, bldgY, 0, 'cream');

        // 正面古典柱廊迴廊 (Colonnade Porch)
        for (let c = -5.0; c <= 5.0; c += 2.0) {
          // 朱紅長柱
          this.cylinder(g, 0.18, 0.18, 3.4, c, 2.0, 4.05, 0xa44638);
        }
        // 二樓迴廊雕花白欄杆
        this.box(g, 11.5, 0.45, 0.1, 0, 3.65, 4.05, 0xf5f5f5);
        // 各樓層窗戶與法學院中式格窗
        for (let row = 0; row < 3; row++) {
          const wy = 1.8 + row * 1.6;
          this.box(g, 9.8, 0.75, 0.1, 0, wy, 3.96, 0x37474f);
          this.box(g, 9.8, 0.75, 0.1, 0, wy, -3.96, 0x37474f);
        }
        // 正門入口法學院金色院徽匾額
        this.box(g, 2.8, 1.8, 0.15, 0, 1.2, 3.96, 0x3e2723);
        this.box(g, 1.6, 0.45, 0.2, 0, 2.3, 4.0, 0x800000);

        // 3. 綠琉璃瓦歇山大坡頂 (Green Glazed Hip Roof)
        const rY = 0.5 + bldgH; // 6.7
        const roofMesh = new THREE.Mesh(this.boxGeometry, this.mat(0x2e6b4d));
        roofMesh.scale.set(13.6, 1.2, 9.6);
        roofMesh.position.set(0, rY + 0.6, 0);
        roofMesh.castShadow = true;
        g.add(roofMesh);

        // 上層飛簷折頂
        const roofTop = new THREE.Mesh(this.boxGeometry, this.mat(0x1b5e20));
        roofTop.scale.set(11.2, 1.0, 7.2);
        roofTop.position.set(0, rY + 1.5, 0);
        roofTop.castShadow = true;
        g.add(roofTop);
        // 屋脊正脊
        this.box(g, 9.5, 0.3, 0.3, 0, rY + 2.1, 0, 0x8d6e63);

        // 4. 前庭「法秤之柱」象徵雕塑與庭園景觀 (Scale of Justice Monument)
        this.cylinder(g, 0.5, 0.6, 0.6, -3.8, 0.3, 5.0, 'stone');
        this.cylinder(g, 0.1, 0.1, 1.2, -3.8, 1.1, 5.0, 0xd4af37); // 金色立柱
        this.box(g, 1.0, 0.08, 0.1, -3.8, 1.7, 5.0, 0xd4af37);  // 橫天平桿
        this.cylinder(g, 0.2, 0.05, 0.15, -4.2, 1.4, 5.0, 0xd4af37); // 左天平盤
        this.cylinder(g, 0.2, 0.05, 0.15, -3.4, 1.4, 5.0, 0xd4af37); // 右天平盤

        // 庭園長椅與松柏
        this.bench(g, 3.8, 4.8, 'wood');
        this.tree(g, -5.8, 2.0, 1.2, 0x2e7d32);
        this.tree(g, 5.8, 2.0, 1.2, 0x2e7d32);
        this.tree(g, 4.5, 5.2, 1.1, 0x1b5e20);
        break;
      }
      case '52': {
        // 52 文化大學 大仁館 (十字風車綠瓦藝術學院、華岡大劇院)
        this.lawn(g, 20, 20);

        // 1. 十字型大理石基台 (Cross-shaped Base Terrace)
        this.box(g, 7.0, 0.6, 17.5, 0, 0.3, 0, 'stone'); // 南北向基座
        this.box(g, 17.5, 0.6, 7.0, 0, 0.3, 0, 'stone'); // 東西向基座
        // 南側大劇院正門寬階梯
        this.box(g, 6.0, 0.2, 1.8, 0, 0.2, 9.2, 0xb0bec5);
        this.box(g, 5.2, 0.4, 1.2, 0, 0.4, 8.8, 0xb0bec5);

        // 2. 十字風車翼樓主體架構 (Cross-shaped Windmill Wings)
        const wingH = 6.8;
        const wingY = 0.6 + wingH / 2; // 4.0
        // 南北軸翼樓 (寬 6.2m, 長 16.5m, 高 6.8m)
        this.box(g, 6.2, wingH, 16.5, 0, wingY, 0, 'cream');
        // 東西軸翼樓 (長 16.5m, 寬 6.2m, 高 6.8m)
        this.box(g, 16.5, wingH, 6.2, 0, wingY, 0, 'cream');

        // 中央交會塔樓升起核心 (Central High Auditorium Core)
        const coreH = 9.0;
        this.box(g, 7.2, coreH, 7.2, 0, 0.6 + coreH / 2, 0, 0xfbf8ee);

        // 3. 正面華岡大劇院正門門面 (Grand Theatre Façade)
        // 氣派中式拱柱
        for (let col = -2.2; col <= 2.2; col += 1.1) {
          this.cylinder(g, 0.18, 0.18, 3.8, col, 2.2, 8.4, 0xa44638);
        }
        // 劇院金色雙扇大門與高聳玻璃採光幕
        this.box(g, 3.2, 2.4, 0.2, 0, 1.6, 8.35, 0xd4af37);
        this.box(g, 4.5, 2.2, 0.1, 0, 4.2, 8.32, 0x1a237e); // 藍色挑高玻璃帷幕
        this.box(g, 3.6, 0.6, 0.25, 0, 5.6, 8.36, 0x800000); // 華岡大劇院金字匾

        // 4. 東西兩翼展演廳玻璃排窗
        this.box(g, 0.1, 1.2, 4.5, 8.32, 3.8, 0, 0x37474f);
        this.box(g, 0.1, 1.2, 4.5, -8.32, 3.8, 0, 0x37474f);

        // 5. 空拍圖震撼標誌：十字風車綠琉璃瓦大屋頂 (Iconic Cross Glazed Roofs)
        const roofBaseY = 0.6 + wingH; // 7.4
        // 南北翼綠琉璃坡頂
        const nsRoof = new THREE.Mesh(this.boxGeometry, this.mat(0x2e6b4d));
        nsRoof.scale.set(7.4, 1.2, 17.5);
        nsRoof.position.set(0, roofBaseY + 0.6, 0);
        nsRoof.castShadow = true;
        g.add(nsRoof);

        // 東西翼綠琉璃坡頂
        const ewRoof = new THREE.Mesh(this.boxGeometry, this.mat(0x2e6b4d));
        ewRoof.scale.set(17.5, 1.2, 7.4);
        ewRoof.position.set(0, roofBaseY + 0.6, 0);
        ewRoof.castShadow = true;
        g.add(ewRoof);

        // 中央核心高聳重簷金頂殿堂
        const centerRoofY = 0.6 + coreH; // 9.6
        const centerRoof = new THREE.Mesh(this.boxGeometry, this.mat(0x1b5e20));
        centerRoof.scale.set(8.4, 1.6, 8.4);
        centerRoof.position.set(0, centerRoofY + 0.8, 0);
        centerRoof.castShadow = true;
        g.add(centerRoof);
        // 中央寶頂尖錐與金珠
        const spRoof = new THREE.Mesh(new THREE.ConeGeometry(3.6, 2.0, 4), this.mat(0x2e6b4d));
        spRoof.position.set(0, centerRoofY + 2.4, 0);
        spRoof.rotation.y = Math.PI / 4;
        spRoof.castShadow = true;
        g.add(spRoof);
        this.sphere(g, 0.35, 0, centerRoofY + 3.5, 0, 0xffd54f);

        // 6. 前庭藝術廣場與音樂芭蕾金屬雕塑 (Art Plaza Sculpture)
        this.box(g, 6.0, 0.1, 4.0, 0, 0.1, 11.5, 0x9e9e9e); // 鋪石廣場
        // 抽象芭蕾音符雕塑 (Bronze Ribbon Sculpture)
        this.cylinder(g, 0.45, 0.5, 0.4, 0, 0.3, 11.5, 'stone');
        const torusGeom = new THREE.TorusGeometry(0.7, 0.08, 8, 24);
        const sculpture = new THREE.Mesh(torusGeom, this.mat(0xd4af37));
        sculpture.position.set(0, 1.3, 11.5);
        sculpture.rotation.x = Math.PI / 3;
        sculpture.rotation.y = Math.PI / 6;
        sculpture.castShadow = true;
        g.add(sculpture);

        // 四角景觀松柏與庭園燈
        this.tree(g, -7.5, 7.5, 1.3, 0x2e7d32);
        this.tree(g, 7.5, 7.5, 1.3, 0x2e7d32);
        this.tree(g, -7.5, -7.5, 1.3, 0x1b5e20);
        this.tree(g, 7.5, -7.5, 1.3, 0x1b5e20);
        this.bench(g, -3.2, 11.2, 'wood');
        this.bench(g, 3.2, 11.2, 'wood');
        break;
      }
      case '53': {
        // 53 歐洲學校足球場 (戶外人工草皮足球場、白色球門、鐵絲圍網、高桿探照燈)
        this.lawn(g, 15.5, 11.5, 0, 0);

        // 1. 鮮綠色人工草皮球場主基底 (Artificial Turf Pitch)
        // 寬 15m, 長 12m
        const pitchMesh = new THREE.Mesh(this.boxGeometry, this.mat(0x388e3c)); // 人工草皮深綠
        pitchMesh.scale.set(15.2, 0.2, 11.2);
        pitchMesh.position.set(0, 0.1, 0);
        pitchMesh.receiveShadow = true;
        g.add(pitchMesh);

        // 2. 白色球場標線 (White Pitch Lines)
        // 外圍邊界線框
        this.box(g, 14.2, 0.05, 0.12, 0, 0.22, -5.1, 'white'); // 北邊線
        this.box(g, 14.2, 0.05, 0.12, 0, 0.22, 5.1, 'white');  // 南邊線
        this.box(g, 0.12, 0.05, 10.3, -7.0, 0.22, 0, 'white'); // 西邊線 (左端線)
        this.box(g, 0.12, 0.05, 10.3, 7.0, 0.22, 0, 'white');  // 東邊線 (右端線)
        // 中線
        this.box(g, 0.12, 0.05, 10.3, 0, 0.22, 0, 'white');
        // 中圈圓環
        const torusCircle = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.06, 4, 24), this.mat('white'));
        torusCircle.rotation.x = Math.PI / 2;
        torusCircle.position.set(0, 0.22, 0);
        g.add(torusCircle);
        // 中圈開球點
        this.cylinder(g, 0.15, 0.15, 0.05, 0, 0.23, 0, 'white');

        // 兩端大禁區與小禁區 (Penalty Areas)
        [-7.0, 7.0].forEach(gx => {
          const sgn = gx < 0 ? 1 : -1;
          // 大禁區 (寬 2.8m, 深 5.2m)
          this.box(g, 2.8, 0.05, 0.1, gx + sgn * 1.4, 0.22, -2.6, 'white');
          this.box(g, 2.8, 0.05, 0.1, gx + sgn * 1.4, 0.22, 2.6, 'white');
          this.box(g, 0.1, 0.05, 5.3, gx + sgn * 2.8, 0.22, 0, 'white');
        });

        // 3. 兩端標準立體白色球門與球網 (Soccer Goals & Nets)
        [-6.9, 6.9].forEach(gx => {
          const sgn = gx < 0 ? 1 : -1;
          const goalW = 3.2;
          const goalH = 1.6;
          const goalD = 1.0;
          // 門柱兩根 (白色立管)
          this.cylinder(g, 0.06, 0.06, goalH, gx, goalH / 2 + 0.2, -goalW / 2, 'white');
          this.cylinder(g, 0.06, 0.06, goalH, gx, goalH / 2 + 0.2, goalW / 2, 'white');
          // 門楣橫樑
          this.box(g, 0.12, 0.1, goalW, gx, goalH + 0.2, 0, 'white');
          // 後拉支撐斜桿
          this.cylinder(g, 0.04, 0.04, goalD, gx - sgn * (goalD / 2), 0.25, -goalW / 2, 'white');
          this.cylinder(g, 0.04, 0.04, goalD, gx - sgn * (goalD / 2), 0.25, goalW / 2, 'white');
          // 白色半透明球網背面
          const netMesh = new THREE.Mesh(this.boxGeometry, this.mat(0xffffff));
          netMesh.scale.set(0.04, goalH * 0.9, goalW * 0.95);
          netMesh.position.set(gx - sgn * goalD, goalH / 2 + 0.2, 0);
          netMesh.material.opacity = 0.5;
          netMesh.material.transparent = true;
          g.add(netMesh);
        });

        // 4. 球場外圍綠色防護圍網 (Wiremesh Fence)
        // 四角與邊緣金屬立柱 (高 2.6m)
        const fencePoles = [
          [-7.4, -5.4], [0, -5.4], [7.4, -5.4],
          [-7.4, 5.4], [0, 5.4], [7.4, 5.4],
          [-7.4, 0], [7.4, 0]
        ];
        fencePoles.forEach(([px, pz]) => {
          this.cylinder(g, 0.05, 0.05, 2.6, px, 1.3, pz, 0x78909c);
        });
        // 頂部與腰部圍網橫桿
        this.box(g, 15.0, 0.06, 0.06, 0, 2.5, -5.4, 0x455a64);
        this.box(g, 15.0, 0.06, 0.06, 0, 2.5, 5.4, 0x455a64);
        this.box(g, 0.06, 0.06, 11.0, -7.4, 2.5, 0, 0x455a64);
        this.box(g, 0.06, 0.06, 11.0, 7.4, 2.5, 0, 0x455a64);

        // 5. 四座高聳球場夜間探照燈柱 (Stadium Floodlight Towers)
        const lightTowers = [
          [-7.2, -5.2], [7.2, -5.2],
          [-7.2, 5.2], [7.2, 5.2]
        ];
        lightTowers.forEach(([tx, tz]) => {
          const sgnX = tx < 0 ? 1 : -1;
          const sgnZ = tz < 0 ? 1 : -1;
          // 金屬高桅燈桿 (高 6.5m)
          this.cylinder(g, 0.08, 0.12, 6.2, tx, 3.2, tz, 0xb0bec5);
          // 頂端 4 聯排探照燈組矩形燈架
          this.box(g, 0.8, 0.45, 0.3, tx, 6.2, tz, 0x37474f);
          // 亮白色發光燈面 (朝向球場中央)
          const lightFace = new THREE.Mesh(this.boxGeometry, this.mat(0xfff9c4)); // 亮黃白光
          lightFace.scale.set(0.7, 0.35, 0.1);
          lightFace.position.set(tx + sgnX * 0.12, 6.2, tz + sgnZ * 0.12);
          g.add(lightFace);
        });

        // 6. 場邊替補席與休息遮陽雨庇 (Team Dugouts & Bench)
        // 南側邊線外設有紅磚底座遮陽棚 (z: 6.2)
        this.box(g, 3.5, 0.2, 1.2, 0, 0.15, 6.4, 0xa74337); // 紅磚台
        this.box(g, 3.6, 0.08, 1.4, 0, 1.8, 6.4, 0x2196f3); // 藍色遮陽棚頂
        this.cylinder(g, 0.04, 0.04, 1.7, -1.6, 0.95, 6.9, 'metal');
        this.cylinder(g, 0.04, 0.04, 1.7, 1.6, 0.95, 6.9, 'metal');
        // 替補球員長椅
        this.bench(g, 0, 6.3, 0x1565c0);

        // 7. 一顆黑白相間足球模型停留在邊線 (Soccer Ball)
        const ballMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), this.mat(0xffffff));
        ballMesh.position.set(1.2, 0.38, 4.8);
        ballMesh.castShadow = true;
        g.add(ballMesh);

        // 場外林蔭松柏
        this.tree(g, -7.8, 6.2, 1.1, 0x2e7d32);
        this.tree(g, 7.8, 6.2, 1.1, 0x2e7d32);
        this.tree(g, -7.8, -6.0, 1.2, 0x1b5e20);
        this.tree(g, 7.8, -6.0, 1.2, 0x1b5e20);
        break;
      }
      case '54': {
        // 54 山仔后文史工作室 (愛富二街北側美式木造眷舍、白雨淋板、紅磚煙囪、歷史解說牌與美軍老郵筒)
        this.lawn(g, 11, 9, 0, 0);

        // 1. 美軍眷舍基座與木階梯 (Stone Base & Wooden Steps)
        this.box(g, 8.4, 0.25, 5.6, 0, 0.12, -0.6, 'stone');
        this.box(g, 2.2, 0.12, 1.2, 0, 0.06, 2.4, 0x8d6e63); // 入口原木踏階

        // 2. 1950年代美式雨淋板木屋主體 (American Siding Cottage)
        this.box(g, 8.0, 3.2, 5.2, 0, 1.72, -0.6, 0xfafafa); // 象牙白雨淋板外牆
        // 水平美式橫條木板陰影凹凸
        for (let l = 1; l <= 5; l++) {
          this.box(g, 8.05, 0.06, 5.25, 0, 0.4 + l * 0.55, -0.6, 0xeeeeee);
        }
        // 深灰美式人字雙坡黑瓦斜頂 (Dark Shingle Gabled Roof)
        this.roof(g, 8.8, 6.0, 3.4, 1.3, 0x37474f, 0, -0.6, true);
        // 屋脊經典美軍紅磚大煙囪 (Red Brick Chimney)
        this.box(g, 0.85, 2.4, 0.85, 2.6, 3.6, -0.6, 0xa74337);
        this.box(g, 1.0, 0.15, 1.0, 2.6, 4.85, -0.6, 0x263238); // 煙囪黑鐵頂蓋

        // 3. 歷史工作室木格大門與採光木窗 (Front Porch & Windows)
        this.door(g, 0, 1.95, 2.02, 'wood');
        // 兩側經典美式十字採光白木窗
        [-2.4, 2.4].forEach(wx => {
          this.box(g, 1.6, 1.5, 0.1, wx, 1.8, 2.02, 0xffffff); // 白窗框
          this.box(g, 1.4, 1.3, 0.08, wx, 1.8, 2.03, 0x90caf9); // 藍色玻璃
          this.box(g, 0.08, 1.3, 0.12, wx, 1.8, 2.04, 0xffffff); // 十字格條
          this.box(g, 1.4, 0.08, 0.12, wx, 1.8, 2.04, 0xffffff);
        });

        // 4. 正門木質題字招牌「山仔后文史工作室」 (Main Signboard)
        this.box(g, 4.2, 0.65, 0.15, 0, 3.05, 2.05, 0x4e342e); // 深胡桃木底板
        this.sign(g, '山仔后文史工作室 (美軍眷舍文化景觀)', 0, 3.05, 2.15, 4.0, '#4e342e', '#fff9c4');

        // 5. 前庭綠地亮點一：斜面「山仔后美軍眷舍歷史文化解說牌」 (Historic Marker Display)
        const markerX = -2.5;
        const markerZ = 2.8;
        // 木造雙支撐立柱
        this.box(g, 0.1, 1.2, 0.1, markerX - 0.6, 0.6, markerZ, 0x5d4037);
        this.box(g, 0.1, 1.2, 0.1, markerX + 0.6, 0.6, markerZ, 0x5d4037);
        // 斜面歷史導覽看板
        const boardMesh = new THREE.Mesh(this.boxGeometry, this.mat(0xffffff));
        boardMesh.scale.set(1.5, 0.9, 0.08);
        boardMesh.position.set(markerX, 1.15, markerZ + 0.1);
        boardMesh.rotation.x = -Math.PI / 6;
        g.add(boardMesh);
        // 看板地圖色塊
        const mapMesh = new THREE.Mesh(this.boxGeometry, this.mat(0x2e7d32));
        mapMesh.scale.set(1.35, 0.75, 0.02);
        mapMesh.position.set(markerX, 1.15, markerZ + 0.14);
        mapMesh.rotation.x = -Math.PI / 6;
        g.add(mapMesh);

        // 6. 前庭亮點二：冷戰復古美軍墨綠色金屬圓柱郵筒 (Retro U.S. Green Mailbox)
        const mailX = 2.6;
        const mailZ = 2.8;
        this.cylinder(g, 0.3, 0.35, 1.1, mailX, 0.55, mailZ, 0x1b5e20); // 墨綠鐵筒
        this.sphere(g, 0.32, mailX, 1.1, mailZ, 0x1b5e20); // 圓弧頂蓋
        this.box(g, 0.25, 0.08, 0.08, mailX, 0.9, mailZ + 0.3, 0xffeb3b); // 黃色投信口

        // 7. 牆角復古黑色腳踏車 (Historic Bicycle)
        const bikeX = 3.6;
        const bikeZ = 1.2;
        // 前後輪
        this.cylinder(g, 0.3, 0.3, 0.05, bikeX, 0.3, bikeZ - 0.5, 'dark');
        this.cylinder(g, 0.3, 0.3, 0.05, bikeX, 0.3, bikeZ + 0.5, 'dark');
        // 車架與龍頭
        this.box(g, 0.05, 0.5, 1.0, bikeX, 0.45, bikeZ, 'dark');
        this.box(g, 0.35, 0.05, 0.05, bikeX, 0.72, bikeZ - 0.45, 'metal');

        // 前庭山仔后老樟樹與石板步道
        this.tree(g, -4.5, 2.0, 1.35, 0x2e7d32);
        this.tree(g, 4.5, -2.0, 1.2, 0x1b5e20);
        this.bench(g, 1.2, 3.2, 'wood');
        break;
      }
      case '55': {
        // 55 文化大學 曉峯紀念館 (一樓全聯福利中心 PXmart 士林華岡店)
        // 包含：宏偉圖書館主樓、深藍全聯招牌、橘色圓形圖示、大落地玻璃自動門、整排銀色金屬手推車隊列
        this.lawn(g, 16, 14, 0, 0);

        // 1. 花崗岩石造基台 (Base Terrace)
        this.box(g, 14.5, 0.4, 10.5, 0, 0.2, 0, 'stone');
        // 前方迎賓石階與無障礙緩坡道
        this.box(g, 6.0, 0.2, 1.4, 3.8, 0.1, 5.6, 0xb0bec5);

        // 2. 曉峯紀念館十層高聳圖書館主體 (Library Tower Body)
        // 主樓體 (寬 13.5m, 高 11.5m, 深 9.5m)
        const bldgH = 11.5;
        this.box(g, 13.5, bldgH, 9.5, 0, 0.4 + bldgH / 2, 0, 0xf5f5f5); // 象牙白花崗岩外牆

        // 2~8 樓圖書館條窗與垂直遮陽格柵 (Strip Windows & Louvers)
        for (let fl = 1; fl <= 5; fl++) {
          const wy = 3.6 + fl * 1.5;
          // 正面圖書館深藍採光條窗
          this.box(g, 11.5, 0.75, 0.12, 0, wy, 4.78, 0x1a237e);
          // 垂直遮陽木色線腳
          for (let lx = -5.0; lx <= 5.0; lx += 2.5) {
            this.box(g, 0.18, 0.9, 0.2, lx, wy, 4.82, 0x78909c);
          }
        }

        // 頂層挑簷與「曉峯紀念館」金字匾額 (Top Cornice & Name Sign)
        const topY = 0.4 + bldgH; // 11.9
        this.box(g, 14.2, 0.8, 10.2, 0, topY + 0.4, 0, 0x37474f); // 深灰頂層挑簷
        this.box(g, 12.5, 0.6, 8.5, 0, topY + 1.1, 0, 0x455a64);
        this.box(g, 5.2, 0.8, 0.2, 0, topY - 0.2, 4.8, 0x800000); // 題字紅底
        this.sign(g, '曉峯紀念館 · 中國文化大學圖書館', 0, topY - 0.2, 4.92, 5.0, '#800000', '#ffd54f');

        // 3. 一樓核心亮點：全聯福利中心 PXmart 士林華岡店 (PXmart Supermarket at 1F)
        // 橫跨正門的經典深藍色全聯大招牌 (Deep Blue PXmart Fascia)
        const fasciaY = 2.6;
        const fasciaZ = 4.82;
        this.box(g, 9.6, 0.95, 0.2, 1.2, fasciaY, fasciaZ, 0x0d47a1); // 全聯深藍底色
        // 白底藍字招牌板 (PXmart)
        this.sign(g, '全聯福利中心 PXmart (士林華岡店)', 1.2, fasciaY, fasciaZ + 0.12, 6.8, '#0d47a1', '#ffffff');

        // 標誌性「圓形橘底白色三葉圖示」 (Iconic Orange PXmart Round Logo)
        const logoX = 4.8;
        const logoZ = fasciaZ + 0.14;
        this.cylinder(g, 0.38, 0.38, 0.08, logoX, fasciaY, logoZ, 0xff6f00); // 橘色圓盤
        this.box(g, 0.25, 0.25, 0.1, logoX, fasciaY, logoZ, 0xffffff); // 白色圖徽

        // 4. 全聯通透落地大玻璃自動門與內部明亮貨架光影 (Storefront Glass & Lighting)
        const storeZ = 4.76;
        // 明亮落地大玻璃帷幕 (透出溫暖黃光)
        this.box(g, 8.8, 2.0, 0.1, 1.2, 1.25, storeZ, 0xfff9c4);
        // 門框黑鋼結構
        this.box(g, 0.12, 2.0, 0.14, -3.2, 1.25, storeZ + 0.02, 0x212121);
        this.box(g, 0.12, 2.0, 0.14, 1.2, 1.25, storeZ + 0.02, 0x212121);
        this.box(g, 0.12, 2.0, 0.14, 5.6, 1.25, storeZ + 0.02, 0x212121);
        // 自動滑門門縫與手把
        this.box(g, 1.8, 1.9, 0.12, 2.4, 1.2, storeZ + 0.04, 0x90caf9); // 藍色玻璃門

        // 5. 門口最吸睛特徵：一整排立體金屬銀色「全聯購物手推車隊列」 (Row of Metal Shopping Carts)
        const cartStartX = 4.2;
        const cartZ = 5.4;
        // 購物手推車停放金屬圍欄
        this.box(g, 0.05, 0.8, 2.2, cartStartX - 0.5, 0.5, cartZ, 'metal');
        this.box(g, 0.05, 0.8, 2.2, cartStartX + 0.5, 0.5, cartZ, 'metal');
        // 4 輛嵌套在一起的銀白金屬手推車
        for (let c = 0; c < 4; c++) {
          const cz = cartZ - 0.7 + c * 0.45;
          // 車身銀色金屬網籃
          this.box(g, 0.65, 0.4, 0.5, cartStartX, 0.55, cz, 'metal');
          // 紅色推車手把
          this.box(g, 0.65, 0.06, 0.06, cartStartX, 0.78, cz + 0.25, 0xd32f2f);
          // 4 個小輪子
          this.sphere(g, 0.05, cartStartX - 0.28, 0.15, cz - 0.18, 'dark');
          this.sphere(g, 0.05, cartStartX + 0.28, 0.15, cz - 0.18, 'dark');
          this.sphere(g, 0.05, cartStartX - 0.28, 0.15, cz + 0.18, 'dark');
          this.sphere(g, 0.05, cartStartX + 0.28, 0.15, cz + 0.18, 'dark');
        }

        // 6. 前庭石板廣場與校園林蔭樹
        this.tree(g, -5.8, 4.2, 1.35, 0x2e7d32);
        this.tree(g, -5.8, -3.8, 1.35, 0x1b5e20);
        this.tree(g, 5.8, -3.8, 1.35, 0x1b5e20);
        this.bench(g, -2.5, 5.2, 'wood');
        break;
      }
      case '56': {
        // 56 阿緹卡義大利 pizza專賣店 (Antica)：美軍眷舍改建正宗義大利柴燒窯烤披薩與義大利麵名店
        // 1. 地坪基座與前庭原木餐飲露台
        this.box(g, 7.2, 0.2, 7.2, 0, 0.1, 0, 'grass');
        this.box(g, 6.2, 0.15, 3.2, 0, 0.22, 1.8, 'wood');

        // 2. 美軍老眷舍主屋 (白木雨淋板平房 + 炭灰紅雙坡頂)
        this.house(g, { x: 0, z: -1.2, w: 5.6, d: 3.8, h: 2.3, wall: 'white', siding: true, roof: 'redRoof', chimney: true });

        // 3. 戶外義式純白遮陽棚 (Awning) 與義大利三色旗飾 (綠白紅)
        this.box(g, 5.0, 0.08, 1.8, 0, 2.35, 1.0, 'white');
        // 棚架支撐金屬細柱
        this.box(g, 0.08, 2.2, 0.08, -2.3, 1.15, 1.8, 'dark');
        this.box(g, 0.08, 2.2, 0.08, 2.3, 1.15, 1.8, 'dark');
        // 遮陽棚前緣義大利國旗色塊飾條 (綠、白、紅)
        this.box(g, 1.6, 0.15, 0.05, -1.65, 2.3, 1.92, 0x009246); // 綠
        this.box(g, 1.6, 0.15, 0.05, 0, 2.3, 1.92, 0xffffff);     // 白
        this.box(g, 1.6, 0.15, 0.05, 1.65, 2.3, 1.92, 0xce2b37);  // 紅

        // 4. 正宗拿坡里紅磚石砌柴燒披薩窯 (Pizza Oven)
        const ovenX = -2.2, ovenZ = 2.0;
        // 紅磚耐火石基座
        this.box(g, 1.4, 0.8, 1.4, ovenX, 0.55, ovenZ, 'brick');
        // 半球型圓拱柴燒窯頂
        this.sphere(g, 0.65, ovenX, 1.25, ovenZ, 'brick');
        // 窯口黑色弧形鑄鐵門
        this.box(g, 0.45, 0.4, 0.15, ovenX, 1.15, ovenZ + 0.6, 'dark');
        // 窯頂鐵煙囪與微散白煙
        this.box(g, 0.15, 0.7, 0.15, ovenX, 1.85, ovenZ, 'metal');
        this.sphere(g, 0.15, ovenX, 2.25, ovenZ, 'white');
        this.sphere(g, 0.12, ovenX + 0.05, 2.45, ovenZ, 'white');
        // 窯旁堆疊的柴燒原木
        this.box(g, 0.6, 0.35, 0.35, ovenX + 0.9, 0.38, ovenZ, 'wood');

        // 5. 戶外遮陽傘與歐風用餐桌椅
        const tableX = 1.6, tableZ = 1.8;
        // 木餐桌
        this.box(g, 1.1, 0.08, 0.9, tableX, 0.75, tableZ, 'wood');
        this.box(g, 0.1, 0.65, 0.1, tableX, 0.42, tableZ, 'dark');
        // 4 張小木椅
        this.box(g, 0.35, 0.45, 0.35, tableX - 0.7, 0.32, tableZ, 'wood');
        this.box(g, 0.35, 0.45, 0.35, tableX + 0.7, 0.32, tableZ, 'wood');
        // 白色圓頂大遮陽傘
        this.box(g, 0.06, 2.1, 0.06, tableX, 1.15, tableZ, 'white');
        this.box(g, 1.8, 0.12, 1.8, tableX, 2.15, tableZ, 'white');

        // 6. 店門口披薩鏟招牌看板
        this.sign(g, '阿緹卡 PIZZA', -0.6, 1.2, 2.7, 2.2, '#2e7d32', '#ffffff');
        this.tree(g, 2.7, -2.5, 1.2, 0x2e7d32);
        this.tree(g, -2.7, -2.5, 1.2, 0x388e3c);
        break;
      }
      case '57': {
        // 57 光在草山 (Light On Old Town)：美軍宿舍改建極具質感的文青老宅咖啡與草山攝影名勝
        // 1. 地坪基座與文青風深色木棧露台
        this.box(g, 7.0, 0.2, 7.0, 0, 0.1, 0, 'grass');
        this.box(g, 5.8, 0.15, 3.0, 0, 0.22, 1.7, 0x3e2723);

        // 2. 老宅本體 (深灰木雨淋板 + 復古黑灰大斜坡頂)
        this.house(g, { x: 0, z: -1.1, w: 5.2, d: 3.6, h: 2.3, wall: 0x454d52, siding: true, roof: 'dark', chimney: true });

        // 3. 正面大面積落地採光景觀玻璃窗 (透出室內溫暖鵝黃光暈)
        this.box(g, 3.4, 1.5, 0.1, 0, 1.25, 0.75, 0xffe082); // 暖黃透光玻璃
        // 黑色窗框格柵
        this.box(g, 0.08, 1.5, 0.12, -1.1, 1.25, 0.76, 'dark');
        this.box(g, 0.08, 1.5, 0.12, 1.1, 1.25, 0.76, 'dark');
        this.box(g, 3.4, 0.08, 0.12, 0, 1.25, 0.76, 'dark');

        // 4. 屋簷下整串復古圓球暖黃鎢絲吊燈 (Festoon String Lights)
        for (let l = -2.0; l <= 2.0; l += 0.65) {
          this.sphere(g, 0.08, l, 2.15, 0.85, 0xfff176); // 暖黃發光燈球
        }

        // 5. 戶外文青攝影打卡木棧座與觀葉植物盆栽 (琴葉榕與龜背芋)
        this.bench(g, -1.5, 1.8, 'wood');
        // 陶土盆栽與綠葉
        this.box(g, 0.45, 0.45, 0.45, 1.8, 0.45, 1.8, 0x8d6e63);
        this.sphere(g, 0.35, 1.8, 0.85, 1.8, 0x2e7d32);
        this.sphere(g, 0.25, 1.9, 1.1, 1.75, 0x388e3c);

        // 6. 店門口黑板手繪菜單立牌
        this.sign(g, '光在草山 CAFE', 0.8, 1.2, 2.5, 2.2, '#212121', '#fff59d');
        this.tree(g, -2.6, -2.4, 1.15, 0x2e7d32);
        this.tree(g, 2.6, -2.4, 1.25, 0x1b5e20);
        break;
      }
      case '58': {
        // 58 陽明山耶穌聖體堂 (天主教主徒會)：華岡天主教神聖殿堂，依實拍圖還原「黃柱八角聖母亭」與聖潔白教堂
        // 1. 地坪基座與前庭花園
        this.box(g, 7.8, 0.2, 8.2, 0, 0.1, 0, 'grass');
        this.box(g, 4.0, 0.15, 5.0, 0, 0.22, -0.5, 'stone');

        // 2. 天主教堂主禮拜堂 (聖潔白牆 + 雙坡紅瓦屋頂)
        this.house(g, { x: 0, z: -1.8, w: 5.2, d: 4.4, h: 3.2, wall: 'white', roof: 'redRoof', porch: true });
        // 教堂正面山牆大圓形彩繪玫瑰窗 (Rose Window)
        this.sphere(g, 0.65, 0, 2.7, 0.42, 0x1565c0);
        this.sphere(g, 0.5, 0, 2.7, 0.44, 0xffb300);

        // 3. 教堂鐘樓塔樓 (Bell Tower) 與神聖金光十字架
        const towerX = 1.8, towerZ = -1.0;
        this.box(g, 1.4, 5.0, 1.4, towerX, 2.5, towerZ, 'white');
        this.box(g, 1.6, 0.6, 1.6, towerX, 5.2, towerZ, 'redRoof');
        // 金色神聖大十字架 (Holy Cross)
        this.box(g, 0.1, 1.2, 0.1, towerX, 6.1, towerZ, 'gold');
        this.box(g, 0.6, 0.1, 0.1, towerX, 6.3, towerZ, 'gold');

        // 4. 【核心還原：實景照片左側之「黃柱八角聖母亭」】
        // 亭子位於前庭右前方 (x: -2.0, z: 2.0)
        const pavX = -1.8, pavZ = 2.0;
        // 八角雙層石階台基
        this.cylinder(g, 1.7, 1.8, 0.2, pavX, 0.25, pavZ, 'stone');
        this.cylinder(g, 1.5, 1.6, 0.2, pavX, 0.45, pavZ, 'stone');

        // 明亮黃色立柱 (8 根環狀排列)
        const pillarR = 1.2;
        for (let i = 0; i < 8; i++) {
          const ang = (i * Math.PI * 2) / 8;
          const px = pavX + Math.cos(ang) * pillarR;
          const pz = pavZ + Math.sin(ang) * pillarR;
          this.cylinder(g, 0.07, 0.07, 2.0, px, 1.55, pz, 0xfbc02d); // 醒目鮮黃色圓柱
        }

        // 金色琉璃八角飛簷亭頂
        this.cylinder(g, 0.2, 1.8, 0.8, pavX, 2.95, pavZ, 0xffd54f);
        this.box(g, 0.06, 0.4, 0.06, pavX, 3.45, pavZ, 'gold'); // 亭頂金十字架

        // 亭周圍紅色安全欄杆 (還原照片紅色護欄)
        for (let i = 0; i < 8; i++) {
          if (i === 4) continue; // 留出朝前入口
          const ang = (i * Math.PI * 2) / 8;
          const px = pavX + Math.cos(ang) * pillarR;
          const pz = pavZ + Math.sin(ang) * pillarR;
          this.box(g, 0.8, 0.5, 0.06, px, 0.8, pz, 0xc62828); // 紅色護欄
        }

        // 亭正中央：潔白優雅「白色聖母立像」(White Mary Statue)
        // 雕花基座
        this.cylinder(g, 0.22, 0.28, 0.6, pavX, 0.85, pavZ, 'white');
        // 聖母潔白身軀、衣褶長袍與合十雙手
        this.box(g, 0.26, 0.85, 0.22, pavX, 1.45, pavZ, 'white');
        this.sphere(g, 0.16, pavX, 1.95, pavZ, 'white'); // 聖母頭部與聖潔頭紗
        this.box(g, 0.12, 0.12, 0.14, pavX, 1.45, pavZ + 0.14, 'white'); // 合十雙手

        // 亭四周盛開之紫紅色景觀灌木花叢 (還原實景茂盛紅葉植物)
        this.sphere(g, 0.4, pavX - 1.5, 0.45, pavZ + 0.8, 0x880e4f); // 深紫紅灌木
        this.sphere(g, 0.45, pavX + 1.4, 0.5, pavZ + 0.9, 0xad1457); // 豔紅灌木
        this.sphere(g, 0.35, pavX - 1.2, 0.4, pavZ - 1.3, 0x880e4f);
        this.sphere(g, 0.35, pavX + 1.3, 0.4, pavZ - 1.2, 0xad1457);

        // 5. 前門標誌立牌與林蔭
        this.sign(g, '陽明山 耶穌聖體堂', 1.5, 1.5, 2.8, 2.6, '#1565c0', '#ffffff');
        this.tree(g, -3.0, -2.8, 1.3, 0x2e7d32);
        this.tree(g, 3.0, -2.8, 1.3, 0x1b5e20);
        break;
      }
      case '59': {
        // 59 草山溫泉湯王池 (陽明山溫泉第一泉)：陽明山天然硫磺溫泉源頭泉池
        // 1. 地坪基座與幽靜山林林石階
        this.box(g, 8.5, 0.2, 8.5, 0, 0.1, 0, 'grass');
        this.cylinder(g, 3.8, 4.0, 0.25, 0, 0.22, 0, 'stone');

        // 2. 天然青石砌八角大溫泉池 (Octagonal Hot Spring Bath)
        const poolR = 2.4;
        this.cylinder(g, poolR + 0.35, poolR + 0.45, 0.75, 0, 0.65, 0, 'stone'); // 池壁外圍
        // 溫泉水面 (湛藍湖綠熱水)
        this.cylinder(g, poolR - 0.05, poolR - 0.05, 0.1, 0, 0.75, 0, 0x4db6ac);
        // 池心硫磺礦物結晶底座與出水口
        this.cylinder(g, 0.45, 0.6, 0.4, 0, 0.95, 0, 0xdce775); // 硫磺黃綠結晶石

        // 3. 升騰裊裊之立體溫泉硫磺白煙霧氣 (Hot Spring Rising Steam)
        this.sphere(g, 0.35, 0, 1.45, 0, 'white');
        this.sphere(g, 0.42, 0.1, 1.95, 0.1, 'white');
        this.sphere(g, 0.5, -0.15, 2.5, -0.1, 'white');
        this.sphere(g, 0.6, 0.2, 3.15, 0.15, 'white');
        this.sphere(g, 0.45, -0.25, 3.75, -0.1, 'white');

        // 4. 日式木造「湯之樋」引泉木槽管 (Wooden Spring Conduit)
        this.box(g, 0.25, 0.18, 3.2, 0, 1.1, -1.8, 'wood');
        this.box(g, 0.12, 1.0, 0.12, 0, 0.55, -2.8, 'wood');
        this.box(g, 0.12, 0.8, 0.12, 0, 0.45, -1.5, 'wood');

        // 5. 日式石燈籠 (Stone Lantern)
        const lanternX = 2.6, lanternZ = 1.8;
        this.cylinder(g, 0.2, 0.25, 0.4, lanternX, 0.45, lanternZ, 'stone');
        this.box(g, 0.35, 0.35, 0.35, lanternX, 0.82, lanternZ, 'stone');
        this.sphere(g, 0.12, lanternX, 0.82, lanternZ, 0xfff9c4); // 暖黃透光燭火
        this.cylinder(g, 0.1, 0.45, 0.25, lanternX, 1.1, lanternZ, 'stone');

        // 6. 池畔安全木格圍欄與歷史紀念標牌
        for (let i = 0; i < 8; i++) {
          if (i === 4) continue; // 留出觀泉階梯入口
          const ang = (i * Math.PI * 2) / 8;
          const fx = Math.cos(ang) * 3.3;
          const fz = Math.sin(ang) * 3.3;
          this.box(g, 0.8, 0.65, 0.08, fx, 0.65, fz, 'wood');
        }
        this.sign(g, '草山溫泉 · 湯王池', 0, 1.25, 3.4, 2.8, '#4a2c20', '#fff8e7');
        this.tree(g, -3.2, -2.6, 1.35, 0x1b5e20);
        this.tree(g, 3.2, -2.6, 1.35, 0x2e7d32);
        break;
      }
      case '60': case '61': case '62': case '63': case '64': case '65': case '66': case '67':
        this.buildNorthern(g, code, name);
        break;
      default: throw new Error(`Unknown landmark architecture: ${code}`);
    }
    // A discreet readable marker remains visible even for parks without a façade.
    if(['04','10','13','16','19','21','26','29'].includes(code)) {
      this.box(g,0.15,1.5,0.15,-3.5,0.75,5,'wood');
      this.sign(g,name.replace(/\s*\(.+?\)/g,''),-3.5,1.45,5.12,3.6);
    }
    if (code === '26' || code === '60') this.enrichLandscape(g, code);
    this.batchStaticMeshes(g);
    return g;
  }

  buildNorthern(g, code, name) {
    const flowers=(cx,cz,r,count=28)=>{
      for(let i=0;i<count;i++) { const a=i*Math.PI*2/count; this.ball(g,cx+Math.cos(a)*r,.35,cz+Math.sin(a)*r,.3,.25,.3,[0xeab3c3,0xf4d96c,0xe7e8dd][i%3]); }
    };
    const pavilion=(x,z)=>{
      this.box(g,4,.2,4,x,.1,z,'stone');
      for(const dx of [-1.5,1.5])for(const dz of [-1.5,1.5])this.box(g,.2,2.8,.2,x+dx,1.6,z+dz,'wood');
      this.roof(g,4.5,4.5,3.1,1.1,'roof',x,z);
    };
    const trees=()=>{for(let i=0;i<8;i++){if(i===2)continue;const a=i*Math.PI/4;this.tree(g,Math.cos(a)*10,Math.sin(a)*8,1.1,i%3===0?0xe9b3c8:'leaf');}};
    if(code==='60') {
      this.box(g,24,.5,16,0,.25,0,'stone');
      this.box(g,21,1.1,13,0,1,-1,'white');
      this.box(g,19,4.6,10,0,3.8,-2,'plaster');
      this.roof(g,22,13,6.2,2.6,'greenRoof',0,-2);
      // Central round hall, columned gallery and broad ceremonial stairs.
      this.cylinder(g,3.6,3.6,3.6,0,4.1,4,'white');
      this.cylinder(g,2.4,4.6,1.2,0,6.5,4,'greenRoof');
      this.cylinder(g,2.4,2.4,1.5,0,7.7,4,'plaster');
      this.cylinder(g,.25,3.3,1.5,0,9.15,4,'greenRoof');
      this.cylinder(g,.12,.22,.65,0,10.2,4,'gold');
      for(let x=-9;x<=9;x+=1.8){this.box(g,.25,3.3,.25,x,3.3,3.35,'red');this.window(g,x,3.8,3.05,.9,1.8);}
      for(const x of [-10,10]) {this.box(g,3,3,7,x,3.1,-1,'white');this.roof(g,4.5,8.5,4.8,1.5,'greenRoof',x,-1);}
      for(let i=0;i<7;i++)this.box(g,10-i*.45,.2,1.0,0,.15+i*.2,10-i*.7,'frame');
      for(const x of [-5.5,5.5]) {this.box(g,.22,.8,4.8,x,1.2,8,'white');for(let i=0;i<8;i++)this.box(g,.22,1.2,.22,x,.9,5.8+i*.6,'white');}
      for(const x of [-8,8]){this.box(g,1.2,.7,1.2,x,.7,7,'stone');this.ball(g,x,1.5,7,.55,.7,.7,'frame');this.ball(g,x,2,7.3,.45,.45,.4,'frame');}
      this.sign(g,'中山樓',0,5.3,7.65,3.6,'#30483f','#e3cb87');
      for(const x of [-13,13])for(const z of [-6,0,6])this.tree(g,x,z,1.6,0x416447);
    } else if(code==='61') {
      this.box(g,8,.18,6,0,.12,0,0xb9b5a0);
      for(let i=-3;i<=3;i++)this.box(g,.14,1,.14,i,.7,-2.6,'wood');
      this.box(g,7,.15,.15,0,1.2,-2.6,'wood');
      for(const x of [-2.5,2.5]){this.box(g,2,.2,.7,x,.7,.8,'wood');this.box(g,.15,.6,.6,x-.7,.3,.8,'dark');this.box(g,.15,.6,.6,x+.7,.3,.8,'dark');}
      this.sign(g,'前山公園 · 陽明湖',0,1.6,2.8,5);
      this.tree(g,-4,-2,1.2,0xe6b0be);this.tree(g,4,-2,1.4);
    } else if(code==='62') {
      this.box(g,16,.12,13,0,.07,0,0x91ae78);
      this.box(g,2.1,.08,12,-2,.18,0,0x71a9ad);
      for(let i=0;i<11;i++){const x=i%2?-3.4:-.6;this.ball(g,x,.38,-5+i,.6,.45,.6,0x898b80);}
      this.box(g,4.2,.18,1.4,-2,.4,1,'wood');
      pavilion(3,-2);flowers(3,3,2.5);this.tree(g,-6,-4,1.3);this.tree(g,6,4,1.1,0xe2b4c4);
      this.sign(g,'前山公園 · 磐流園',0,1.3,6.5,5);
    } else if(code==='63') {
      this.cylinder(g,7,7,.22,0,.14,0,0xc5bca4);
      this.cylinder(g,5.4,5.6,.3,0,.39,0,0x526d45);
      this.cylinder(g,4.6,4.6,.08,0,.6,0,0xede7cd);
      flowers(0,0,5.1,64);flowers(0,0,6.3,72);
      for(let i=0;i<12;i++){const a=i*Math.PI/6;const tick=this.box(g,.16,.1,.55,Math.sin(a)*4,.72,Math.cos(a)*4,'dark');tick.rotation.y=a;}
      const hand=this.box(g,.2,.13,3.6,0,.82,-1.5,'dark');hand.rotation.y=.15;
      const hour=this.box(g,2.6,.14,.23,1.05,.86,0,'dark');hour.rotation.y=-.4;
      this.cylinder(g,.24,.24,.22,0,.91,0,'gold');
      this.sign(g,'陽明公園 · 花鐘',0,1.5,7.5,4.6);trees();
    } else if(code==='64') {
      this.box(g,16,.45,11,0,.25,0,'stone');this.box(g,12,3,8,0,1.9,0,'plaster');
      this.roof(g,15,11,3.6,1.3,'redRoof');this.box(g,10,2.6,6,0,4.9,-.5,'white');
      this.roof(g,14,10,6.3,2,'redRoof',0,-.5);
      for(let x=-5;x<=5;x+=2){this.box(g,.24,2.5,.24,x,5,3.25,'red');this.window(g,x,2.1,4.08,1.3,1.7);}
      this.box(g,13,.2,2,0,3.8,4,'frame');
      for(let i=-6;i<=6;i++)this.box(g,.13,.8,.13,i,4.3,4.8,'white');this.box(g,13,.12,.15,0,4.75,4.8,'white');
      for(let i=0;i<4;i++)this.box(g,6,.15,1.1,0,.12+i*.12,6-i*.7,'stone');
      this.sign(g,'辛亥光復樓',0,5.9,3.45,4.2,'#734637','#eedca4');
    } else if(code==='65') {
      this.box(g,18,.18,14,0,.12,0,'stone');this.box(g,13,5.3,8,0,2.9,-1,0x698a6a);
      this.box(g,5,3,6,7,1.8,0,0x789779);this.roof(g,14.5,9.8,5.7,1.2,'greenRoof',0,-1);
      this.roof(g,6,7,3.4,.8,'greenRoof',7,0);
      for(let y=1.6;y<5;y+=2.3)for(let x=-5;x<=5;x+=2)this.window(g,x,y,3.1,1.1,1.5,'wood');
      this.box(g,5,.2,2,0,3.1,4,'frame');this.door(g,0,4.1,2.3);
      this.sign(g,'陽明書屋',0,3.9,4.12,3.8);this.tree(g,-9,2,1.7);this.tree(g,10,-5,1.5);flowers(-6,5,2);
    } else if(code==='66') {
      this.box(g,18,.18,12,0,.12,0,'stone');this.box(g,14,3.4,7,0,1.9,0,'plaster');
      this.roof(g,16,9,3.8,1.5,'roof');
      this.box(g,4,2.7,2,0,1.65,4,'glass');this.roof(g,6,4,3.2,.7,'roof',0,4);
      for(let x=-5;x<=5;x+=2)this.window(g,x,2,3.58,1.3,1.7);
      this.sign(g,'陽明山國家公園 · 遊客中心',0,3.35,5.4,6);
      for(const x of [-8,8]){this.tree(g,x,3,1.2);flowers(x,3,1.5,16);}
    } else if(code==='67') {
      this.box(g,12,.15,7,0,.1,0,'stone');
      for(const x of [-4,0,4])this.box(g,.55,4.5,.55,x,2.3,0,'red');
      this.box(g,10,.6,.8,0,4.2,0,'plaster');this.roof(g,11,3.5,4.55,1.3,'greenRoof');
      this.sign(g,'陽明公園',0,4.1,.48,3.8,'#436251','#eee6c6');
      flowers(-5,3,1.2,16);flowers(5,3,1.2,16);this.tree(g,-7,-2,1.3);this.tree(g,7,-2,1.3);
    }
  }

  enrichLandscape(g, code) {
    const flower=(x,z,color,height=.65)=>{
      this.box(g,.055,height,.055,x,height/2,z,0x467246);
      for(let i=0;i<5;i++){const a=i*Math.PI*2/5;this.ball(g,x+Math.cos(a)*.17,height,z+Math.sin(a)*.17,.16,.1,.16,color);}
      this.ball(g,x,height+.025,z,.085,.085,.085,0xecc64e);
    };
    if(code==='26') {
      // Compact botanical display: flowers stay within the existing model garden.
      const colors=[0xe36b95,0xf5d16b,0xf1ede1,0xad82c4,0xd44f61];
      for(const side of [-1,1])for(let row=0;row<3;row++) {
        const cx=side*(4.1+row*1.45);
        this.box(g,1.12,.12,3.5,cx,.11,3.7,0x675441);
        for(let j=0;j<8;j++)for(let k=0;k<2;k++)flower(cx+(k-.5)*.46,2.25+j*.41,colors[(row+j%2+(side===1?2:0))%5],.48+(j%3)*.09);
      }
      for(const side of [-1,1])for(let i=0;i<5;i++) {
        const x=side*(2.2+i*1.2),z=-5.5;
        this.ball(g,x,.8,z,.7,.8,.65,0x527344);
        for(let j=0;j<7;j++){const a=j*Math.PI*2/7;flower(x+Math.cos(a)*.48,z+Math.sin(a)*.43,j%2?0xf4ddd9:0xd45076,1.2+(j%2)*.14);}
      }
      for(let i=0;i<18;i++){const x=-2.4+i*.28;this.ball(g,x,2.97,2.2,.25,.16,.22,0x65804d);this.ball(g,x,3.08,2.28,.13,.12,.13,i%2?0xf3d9e1:0xce7aac);}
      this.sign(g,'茶花 · 杜鵑花園',-5.8,1.05,5.65,2.1);
      this.sign(g,'球根花卉展示',5.8,1.05,5.65,2.1);
    } else {
      // Stylized geothermal scenery, not a surveyed spring or a bathing facility.
      const pools=[[-9,10.5,2.2,1.3],[9,10.5,2.2,1.3],[-9,-11,1.7,1.2],[9,-11,1.7,1.2]];
      const steamGeometry=new THREE.IcosahedronGeometry(1,1);
      const steamMaterial=new THREE.MeshBasicMaterial({color:0xf4f6f0,transparent:true,opacity:.14,depthWrite:false});
      pools.forEach(([x,z,w,h],index)=>{
        this.box(g,w*2+.5,.15,h*2+.5,x,.16,z,0x96958a);
        this.box(g,w*2,.08,h*2,x,.28,z,0xb7d5cf);
        for(let j=0;j<12;j++){const a=j*Math.PI/6;this.ball(g,x+Math.cos(a)*(w+.15),.4,z+Math.sin(a)*(h+.15),.35,.3,.3,0x8a8c82);}
        for(let j=0;j<4;j++){
          const cloud=new THREE.Mesh(steamGeometry,steamMaterial);cloud.position.set(x+(j%2-.5)*.7,.65+j*.45,z);cloud.scale.set(.55,.38,.48);cloud.userData.steam={x:cloud.position.x,z,phase:j/4+index*.11};g.add(cloud);
        }
      });
      this.sign(g,'白磺溫泉地景',-9,1.35,12,2.6,'#55746c','#f5f4e7');
    }
  }

  batchStaticMeshes(group) {
    // Hundreds of window frames share geometry/material. Batch them per landmark.
    group.updateMatrixWorld(true);
    const buckets=new Map();
    group.traverse(obj=>{
      if(!obj.isMesh || (obj.geometry!==this.boxGeometry && obj.geometry!==this.roundGeometry))return;
      const key=`${obj.geometry.uuid}:${obj.material.uuid}`;
      if(!buckets.has(key))buckets.set(key,[]);
      buckets.get(key).push(obj);
    });
    const inverse=new THREE.Matrix4().copy(group.matrixWorld).invert();
    for(const meshes of buckets.values()) {
      if(meshes.length<2)continue;
      const batch=new THREE.InstancedMesh(meshes[0].geometry,meshes[0].material,meshes.length);
      meshes.forEach((mesh,i)=>{batch.setMatrixAt(i,new THREE.Matrix4().multiplyMatrices(inverse,mesh.matrixWorld));mesh.parent.remove(mesh);});
      batch.castShadow=batch.receiveShadow=true;
      // Three r128 does not calculate aggregate instance bounds for culling.
      batch.frustumCulled=false;
      group.add(batch);
    }
  }
}

  /**
 * 地標位置與互動標記。建築模型由 LandmarkArchitecture 共用建造。
 */



class VoxelBuildings {
  constructor(scene, roadNetwork) {
    this.roadNetwork = roadNetwork;
    this.scene = scene;
    this.landmarks = LANDMARKS;
    this.landmarksWith3D = [];
    this.materials = this.initMaterials();
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.scaleFactor = 0.28;
    this.originX = 320;
    this.originY = 440;

    this.architecture = new LandmarkArchitecture();
    this.buildAllLandmarks();
    this.steamParticles = [];
    this.group.traverse(obj => { if(obj.userData.steam) this.steamParticles.push(obj); });
  }

  initMaterials() {
    return {
      beaconGem: new THREE.MeshBasicMaterial({ color: 0xffb703 }),
      beaconRing: new THREE.MeshBasicMaterial({ color: 0x2a9d8f, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
    };
  }

  buildAllLandmarks() {
    this.landmarks.forEach((data) => {
      const placement = this.roadNetwork.placements.get(data.id);
      const worldX = placement.x;
      const worldZ = placement.z;

      const landmarkObj = {
        data: data,
        worldX: worldX,
        worldZ: worldZ,
        position: new THREE.Vector3(...[placement.entrance[0], 0, placement.entrance[1]]),
        entrance: placement.entrance,
        yaw: placement.yaw,
        radius: 8.5,
        beaconMesh: null,
        ringMesh: null
      };

      const buildingGroup = this.createLandmarkStructure(data.code, worldX, worldZ, data.name);
      buildingGroup.rotation.y = placement.yaw;
      this.group.add(buildingGroup);

      const marker = this.createLandmarkMarker(placement.entrance[0], placement.entrance[1]);
      landmarkObj.beaconMesh = marker.beacon;
      landmarkObj.ringMesh = marker.ring;
      this.group.add(marker.group);

      this.landmarksWith3D.push(landmarkObj);
    });
  }

  createLandmarkStructure(code, x, z, name) {
    const group = this.architecture.build(code, name);
    group.position.set(x, 0, z);
    return group;
  }

  /** 地標專屬懸浮導引晶石與地面發光光圈 */
  createLandmarkMarker(x, z) {
    const markerGroup = new THREE.Group();
    markerGroup.position.set(x, 0, z);

    const ring = new THREE.Mesh(new THREE.RingGeometry(2.4, 3.0, 32), this.materials.beaconRing.clone());
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.08;
    markerGroup.add(ring);

    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.7, 0), this.materials.beaconGem.clone());
    gem.position.y = 5.5;
    gem.castShadow = true;
    markerGroup.add(gem);

    return { group: markerGroup, beacon: gem, ring: ring };
  }

  update(delta, time) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    for (const cloud of this.steamParticles) {
      const data = cloud.userData.steam;
      const phase = reduced ? data.phase % 1 : (time * .12 + data.phase) % 1;
      cloud.position.set(data.x + Math.sin(phase * Math.PI) * .35, .55 + phase * 2.5, data.z);
      cloud.scale.set(.45 + phase * .55, .3 + phase * .4, .4 + phase * .5);
    }
    this.landmarksWith3D.forEach((item, idx) => {
      if (item.beaconMesh) {
        item.beaconMesh.rotation.y += delta * 1.5;
        item.beaconMesh.position.y = 5.2 + Math.sin(time * 2.5 + idx) * 0.4;
      }
      if (item.ringMesh) {
        item.ringMesh.rotation.z += delta * 0.4;
      }
    });
  }
}


  // 5. 互動介面與圖鑑系統
  /**
 * 陽明里漫步 3D 街景版 - 介面與互動系統模組 (VoxelUI.js)
 * 1. 頂部「陽明里漫步 3D 街景版」與「圖鑑 X/30」
 * 2. 右上角「即時全域導覽小地圖 (Minimap)」：
 *    - 支援「一鍵放大/縮小 (按 Z 鍵)」切換大圖全景導覽與右上角小窗
 *    - 支援「小地圖內部平滑縮放 (100% ~ 250%)」與按住拖曳平移 (Pan)
 *    - 支援「一鍵收合/展開 (按 M 鍵)」
 *    - 30 處地標打點、名稱標籤與玩家即時呼吸紅點
 * 3. 底部「👇 用手指點一下地面，小人就會走過去」
 * 4. 靠近時彈出的「🔍🔍 調查：[地標名稱]」與「🔍💬 找里長聊天」
 * 5. 奶白色地標故事卡彈窗 (收錄到圖鑑/關閉)
 * 6. 圖鑑列表彈窗 (進度條、分區展開、未到訪/已到訪✓)
 * 7. 右下角「📍 入口」傳送按鈕
 */

class VoxelUI {
  constructor(game) {
    this.game = game;
    this.visitedSet = new Set();
    this.currentNearbyLandmark = null;
    this.isNearChief = false;

    // 小地圖狀態控制
    this.isMinimapCollapsed = true;
    this.isMinimapExpanded = false; // 大圖模式
    this.minimapZoomLevel = 1.0;
    this.minimapPanX = 0;
    this.minimapPanY = 0;
    this.isPanning = false;
    this.panStartX = 0;
    // 道路與指標牌顯示狀態
    this.isRoadsVisible = true;
    this.navigationVisible = false;
    try { this.navigationVisible = localStorage.getItem('yangming-navigation-visible') === 'true'; } catch (_) {}

    this.loadProgress();
    this.initDOM();
    this.initMinimap();
    this.bindEvents();
    this.bindMinimapInteractions();
    this.updateAlbumStats();
    document.getElementById('voxel-minimap-card').classList.add('collapsed');
    document.getElementById('btn-toggle-minimap').setAttribute('aria-expanded', 'false');
    this.setNavigationVisible(this.navigationVisible);
  }


  updateCornerNav(directions) {
    const hud = document.getElementById('corner-nav-hud');
    if (!hud) return;

    if (!this.navigationVisible || !this.isRoadsVisible || !directions) {
      hud.classList.add('hidden');
      return;
    }

    hud.classList.remove('hidden');
    const titleEl = document.getElementById('corner-title');
    if (titleEl) titleEl.textContent = '轉角路口：' + directions.title;

    const setDir = (id, val, prefix) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (val) {
        el.classList.remove('hidden');
        el.querySelector('.road-name').textContent = val;
      } else {
        el.classList.add('hidden');
      }
    };

    setDir('corner-dir-front', directions.front, '⬆️ 前方：');
    setDir('corner-dir-left', directions.left, '⬅️ 左邊：');
    setDir('corner-dir-right', directions.right, '➡️ 右邊：');
    setDir('corner-dir-back', directions.back, '⬇️ 後方：');
  }

  isBlockingWorldInput() {
    return this.isMinimapExpanded || ['modal-story', 'modal-album', 'modal-chief']
      .some(id => !document.getElementById(id).classList.contains('hidden'));
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem('yangming_3d_visited');
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) {
          const validIds = new Set(LANDMARKS.map(item => item.id));
          arr.forEach(id => { if (validIds.has(id)) this.visitedSet.add(id); });
        }
      }
    } catch (e) {
      console.warn('無法讀取 LocalStorage 進度:', e);
    }
  }

  saveProgress() {
    try {
      localStorage.setItem('yangming_3d_visited', JSON.stringify(Array.from(this.visitedSet)));
    } catch (e) {
      console.warn('無法儲存 LocalStorage 進度:', e);
    }
  }

  initDOM() {
    const container = document.createElement('div');
    container.id = 'voxel-ui-container';
    container.innerHTML = `
      <!-- 小地圖放大遮罩層 -->
      <div id="voxel-minimap-backdrop" class="voxel-minimap-backdrop hidden"></div>

      <!-- 左上角遊戲標題 -->
      
      <!-- 轉角路名指南 HUD (四向路牌指引) -->
      <div id="corner-nav-hud" class="corner-nav-hud hidden">
        <div class="corner-header">
          <span class="corner-pin">🧭</span>
          <span id="corner-title" class="corner-title">轉角指標牌</span>
        </div>
        <div class="corner-directions">
          <div id="corner-dir-front" class="corner-dir-item dir-front hidden">⬆️ 前方：<span class="road-name"></span></div>
          <div class="corner-dir-row">
            <div id="corner-dir-left" class="corner-dir-item dir-left hidden">⬅️ 左邊：<span class="road-name"></span></div>
            <div id="corner-dir-right" class="corner-dir-item dir-right hidden">➡️ 右邊：<span class="road-name"></span></div>
          </div>
          <div id="corner-dir-back" class="corner-dir-item dir-back hidden">⬇️ 後方：<span class="road-name"></span></div>
        </div>
      </div>

      <div class="voxel-badge-title">
        <span class="brick-icon">🧱</span>
        <span class="title-text">陽明里漫步</span>
        <span class="sub-text">3D 街景版</span>
      </div>

      <!-- 右上角按鈕群 (視角切換、小地圖開關、圖鑑進度) -->
      <div class="voxel-album-top-group">
        <!-- 視角切換按鈕 -->
        <button id="btn-toggle-camera-view" class="voxel-btn-view" title="切換鏡頭視角 (按 V 鍵)">
          <span id="view-mode-icon" class="view-icon">📐</span>
          <span id="view-mode-name" class="view-label">斜視</span>
        </button>

        <!-- 小地圖收合/展開開關 -->
        <button id="btn-toggle-minimap" class="voxel-btn-view" title="收合/展開小地圖 (按 M 鍵)">
          <span class="view-icon">🗺️</span>
          <span id="minimap-btn-label" class="view-label">地圖</span>
        </button>

        <!-- 道路與路標收合/展開開關 -->
        <button id="btn-toggle-roads" class="voxel-btn-view" title="顯示或收起路標與轉角提示 (按 R 鍵)" aria-pressed="false">
          <span id="roads-toggle-icon" class="view-icon">🛣️</span>
          <span id="roads-toggle-label" class="view-label">路標</span>
        </button>

        <!-- 圖鑑按鈕 -->
        <div id="btn-album-circle" class="voxel-circle-stat" title="開啟圖鑑">
          <span class="stat-book-icon">📖</span>
          <span class="stat-title">圖鑑</span>
          <span id="album-counter" class="stat-count">${this.visitedSet.size}/${LANDMARKS.length}</span>
        </div>
        <button id="btn-open-album-card" class="voxel-btn-album">圖鑑</button>
      </div>

      <!-- 右上角即時小地圖 (Minimap HUD) - 支援一鍵放大/縮小與多級縮放 -->
      <div id="voxel-minimap-card" class="voxel-minimap-card">
        <div class="minimap-header" id="minimap-header-bar">
          <div class="minimap-title-wrap">
            <span class="minimap-compass-icon">🧭</span>
            <span id="minimap-main-title" class="minimap-title">陽明山道路導覽</span>
            <span id="minimap-district-badge" class="minimap-district">中央・生活核心</span>
          </div>
          <div class="minimap-header-actions">
            <!-- 放大/還原按鈕 -->
            <button id="btn-minimap-expand" class="minimap-toggle-btn" title="放大/還原大地圖 (按 Z 鍵)">🔍</button>
            <!-- 收合/展開按鈕 -->
            <button id="btn-minimap-toggle-size" class="minimap-toggle-btn" title="收合/展開小地圖 (按 M 鍵)">➖</button>
          </div>
        </div>
        
        <div id="minimap-content" class="minimap-content">
          <!-- 縮放工具列 (放大/縮小/還原) -->
          <div class="minimap-zoom-toolbar">
            <button id="btn-minimap-zoom-in" class="zoom-btn" title="放大看細節 (+)">➕</button>
            <button id="btn-minimap-zoom-out" class="zoom-btn" title="縮小遠觀 (-)">➖</button>
            <button id="btn-minimap-zoom-reset" class="zoom-btn" title="重設縮放 (100%)">1:1</button>
            <span id="minimap-zoom-text" class="zoom-text">100%</span>
            <span class="zoom-drag-hint">可滾輪縮放 / 拖曳平移</span>
          </div>

          <div class="minimap-map-container" id="minimap-container">
            <!-- 可平移與縮放的層級 -->
            <div id="minimap-transform-layer" class="minimap-transform-layer">
              <img src="" class="minimap-img" alt="陽明里實際道路圖" draggable="false" />
              <!-- 30 個地標小標籤層 -->
              <div id="minimap-landmarks-layer" class="minimap-landmarks-layer"></div>
              <!-- 玩家即時呼吸紅點與面朝方向箭頭 -->
              <div id="minimap-player-dot" class="minimap-player-dot" style="left: 50%; top: 50%;">
                <div class="dot-pulse"></div>
                <div class="dot-core"></div>
                <div id="minimap-player-arrow" class="minimap-player-arrow"></div>
              </div>
            </div>
          </div>

          <div class="minimap-footer">
            <span id="minimap-coords" class="minimap-coords">坐標: (300, 445)</span>
            <span class="minimap-shortcut">按 Z 放大 · 按 M 收合</span>
          </div>
        </div>
      </div>

      <!-- 視角切換浮動 Toast 提示 -->
      <div id="voxel-toast" class="voxel-toast-msg hidden"></div>

      <!-- 右下角快速回到入口鈕 -->
      <button id="btn-goto-entrance" class="voxel-btn-entrance" title="回到起點入口">
        <span class="pin-icon">📍</span>
        <span class="pin-label">入口</span>
      </button>

      <!-- 底部提示黑底膠囊 -->
      <div class="voxel-bottom-hint">
        <span class="hand-icon">👇</span> 用手指或滑鼠點一下地面，小人就會走過去
      </div>

      <!-- 靠近互動大按鈕 (動態升起) -->
      <div id="voxel-interaction-dock" class="voxel-interaction-dock hidden">
        <button id="btn-trigger-action" class="voxel-action-btn">
          <span id="action-btn-icon" class="action-icon">🔍🔍</span>
          <span id="action-btn-text" class="action-text">調查：陽明山麥當勞</span>
        </button>
      </div>

      <!-- 地標故事卡彈窗 -->
      <div id="modal-story" class="voxel-modal-backdrop hidden">
        <div class="voxel-story-card">
          <div id="story-tag" class="voxel-story-tag">生活餐飲・中央・山仔后生活核心</div>
          <h2 id="story-title" class="voxel-story-title">02 陽明山麥當勞</h2>
          <div id="story-thumb-container" class="voxel-story-thumb-wrap">
            <img id="story-thumb-img" src="" alt="地標照片" class="voxel-story-thumb" />
          </div>
          <p id="story-desc" class="voxel-story-desc">
            陪伴文化大學師生與遊客近 37 年的經典地標，是無數人上山約見面集合、吃早餐吹冷氣與等公車的共同青春回憶。
          </p>
          <div class="voxel-story-actions">
            <button id="btn-visit-landmark" class="voxel-btn-confirm">前往這裡</button>
          <button id="btn-collect-landmark" class="voxel-btn-confirm">收錄到圖鑑</button>
            <button id="btn-close-story" class="voxel-btn-cancel">關閉</button>
          </div>
        </div>
      </div>

      <!-- 陽明里文史圖鑑彈窗 -->
      <div id="modal-album" class="voxel-modal-backdrop hidden">
        <div class="voxel-album-card">
          <div class="voxel-album-header">
            <h2 class="voxel-album-title">📖 陽明里文史圖鑑</h2>
            <button id="btn-export-atlas" class="atlas-export-button">匯出圖鑑</button>
            <button id="btn-close-album" class="voxel-close-x">&times;</button>
          </div>
          
          <!-- 進度條 -->
          <div class="voxel-progress-bar-wrap">
            <div id="album-progress-bar" class="voxel-progress-bar" style="width: 0%;"></div>
          </div>
          <div id="album-progress-text" class="voxel-progress-text">已收錄 0 / ${LANDMARKS.length} 處地標</div>

          <!-- 分區列表容器 -->
          <div class="album-tools"><input id="landmark-search" type="search" placeholder="搜尋地標名稱或編號" aria-label="搜尋地標"><select id="landmark-region" aria-label="地標區域"><option value="all">全部區域</option><option value="yangmingshan">陽明山公園區</option></select><label><input id="only-unvisited" type="checkbox"> 只看未收錄</label></div>
          <div id="album-list-scroll" class="voxel-album-list-scroll"></div>
        </div>
      </div>

      <!-- 里長對話彈窗 -->
      <div id="modal-chief" class="voxel-modal-backdrop hidden">
        <div class="voxel-story-card chief-card">
          <div class="voxel-story-tag chief-tag">里長辦公室・山仔后熱情導覽</div>
          <h2 class="voxel-story-title">里長 黃裕倉</h2>
          <p class="voxel-story-desc">
            「哈囉！歡迎來到美麗的山仔后陽明里！<br><br>
            我們陽明里擁有全台灣最珍貴的美軍眷舍歷史群、文化大學周邊特色商圈，以及美麗的花卉自然綠地。<br><br>
            這座 3D 方塊世界收錄了陽明里及周邊 <strong>${LANDMARKS.length} 處精選核心地標</strong>！只要漫步走近建築物，點擊『調查』就能認識每處歷史故事並收錄進圖鑑。<br><br>
            右上角的小地圖可以按 <strong>🔍 放大鍵</strong> 或 <strong>Z 鍵</strong> 放大看大圖細節，如果迷路了，點擊右下角『📍 入口』我就在這裡等你！」
          </p>
          <div class="voxel-story-actions">
            <button id="btn-close-chief" class="voxel-btn-confirm">收到，出發探索！</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);
    const credit = document.createElement('a');
    credit.className = 'road-attribution';
    credit.href = 'https://www.openstreetmap.org/copyright';
    credit.target = '_blank'; credit.rel = 'noopener';
    credit.textContent = '© OpenStreetMap contributors';
    document.body.appendChild(credit);
    container.querySelector('.minimap-img').src = this.game.roadNetwork.minimapImage();
    const closeNav = document.createElement('button');
    closeNav.className = 'close-navigation';
    closeNav.textContent = '×';
    closeNav.setAttribute('aria-label', '收起轉角提示與路標');
    closeNav.addEventListener('click', () => this.setNavigationVisible(false));
    document.getElementById('corner-nav-hud').appendChild(closeNav);
  }

  initMinimap() {
    const layer = document.getElementById('minimap-landmarks-layer');
    if (!layer) return;
    layer.innerHTML = '';

    LANDMARKS.forEach(lm => {
      const dotWrap = document.createElement('div');
      dotWrap.className = `minimap-lm-dot-wrap ${this.visitedSet.has(lm.id) ? 'visited' : ''}`;
      dotWrap.tabIndex = 0;
      dotWrap.setAttribute('role', 'button');
      dotWrap.setAttribute('aria-label', lm.code + ' ' + lm.name);
      dotWrap.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.openStoryModal(lm); } });
      dotWrap.id = `minimap-dot-${lm.id}`;
      const place = this.game.roadNetwork.placements.get(lm.id);
      const map = this.game.roadNetwork.worldToMap(place.x, place.z);
      dotWrap.style.left = `${(map.x / 1024) * 100}%`;
      dotWrap.style.top = `${(map.y / 1024) * 100}%`;

      dotWrap.innerHTML = `
        <div class="lm-dot-circle"></div>
        <div class="lm-dot-label">${lm.code} ${lm.name}</div>
      `;

      dotWrap.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!this.mapDragged) this.openStoryModal(lm);
      });

      layer.appendChild(dotWrap);
    });
  }

  bindEvents() {
    document.getElementById('btn-export-atlas').addEventListener('click', () => this.exportAtlas());
    document.getElementById('landmark-search').addEventListener('input', () => this.renderAlbumList());
    document.getElementById('landmark-region').addEventListener('change', () => this.renderAlbumList());
    document.getElementById('only-unvisited').addEventListener('change', () => this.renderAlbumList());
    // 視角切換按鈕
    document.getElementById('btn-toggle-camera-view').addEventListener('click', () => {
      this.triggerViewModeCycle();
    });

    // 小地圖收合/展開事件
    const toggleMinimapCollapse = () => {
      // 若處於大圖放大狀態，先縮回小圖
      if (this.isMinimapExpanded) {
        this.setExpandMinimap(false);
      }

      this.isMinimapCollapsed = !this.isMinimapCollapsed;
      document.getElementById('btn-toggle-minimap').setAttribute('aria-expanded', String(!this.isMinimapCollapsed));
      const card = document.getElementById('voxel-minimap-card');
      const toggleBtn = document.getElementById('btn-minimap-toggle-size');
      const label = document.getElementById('minimap-btn-label');
      if (this.isMinimapCollapsed) {
        card.classList.add('collapsed');
        if (toggleBtn) toggleBtn.innerText = '➕';
        if (label) label.innerText = '地圖';
        this.showToast('小地圖已收合 (按 M 可展開)');
      } else {
        card.classList.remove('collapsed');
        if (toggleBtn) toggleBtn.innerText = '➖';
        if (label) label.innerText = '地圖';
      }
    };

    document.getElementById('btn-toggle-minimap').addEventListener('click', toggleMinimapCollapse);
    document.getElementById('btn-minimap-toggle-size').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMinimapCollapse();
    });

    // 點擊放大按鈕
    document.getElementById('btn-minimap-expand').addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleExpandMinimap();
    });

    // 點擊大圖背景遮罩關閉放大模式
    document.getElementById('voxel-minimap-backdrop').addEventListener('click', () => {
      this.setExpandMinimap(false);
    });

    // 標題欄點擊收合 (若非點擊按鈕)
    document.getElementById('minimap-header-bar').addEventListener('click', (e) => {
      if (e.target.id !== 'btn-minimap-toggle-size' && e.target.id !== 'btn-minimap-expand') {
        if (!this.isMinimapExpanded) {
          toggleMinimapCollapse();
        }
      }
    });

    // 圖鑑開關
    document.getElementById('btn-album-circle').addEventListener('click', () => this.openAlbumModal());
    document.getElementById('btn-open-album-card').addEventListener('click', () => this.openAlbumModal());
    document.getElementById('btn-close-album').addEventListener('click', () => this.closeAlbumModal());

    // 回到入口按鈕
    document.getElementById('btn-goto-entrance').addEventListener('click', () => {
      this.game.teleportToEntrance();
    });

    // 調查 / 聊天大按鈕
    document.getElementById('btn-trigger-action').addEventListener('click', () => {
      if (this.isNearChief) {
        this.openChiefModal();
      } else if (this.currentNearbyLandmark) {
        this.openStoryModal(this.currentNearbyLandmark);
      }
    });

    // 地標故事卡關閉與收錄
    document.getElementById('btn-close-story').addEventListener('click', () => this.closeStoryModal());
    document.getElementById('btn-collect-landmark').addEventListener('click', () => {
      if (this.activeStoryLandmark) {
        this.collectLandmark(this.activeStoryLandmark);
      }
    });

    document.getElementById('btn-visit-landmark').addEventListener('click', () => {
      if (!this.activeStoryLandmark) return;
      this.game.teleportToLandmark(this.activeStoryLandmark);
      this.closeAllModals();
    });

    // 里長對話關閉
    document.getElementById('btn-close-chief').addEventListener('click', () => this.closeChiefModal());

    // 點擊背景遮罩關閉彈窗
    ['modal-story', 'modal-album', 'modal-chief'].forEach(id => {
      const el = document.getElementById(id);
      el.addEventListener('click', (e) => {
        if (e.target === el) {
          el.classList.add('hidden');
        }
      });
    });

    // 鍵盤快速鍵
    window.addEventListener('keydown', (e) => {
      if (e.repeat || e.target?.closest('input, textarea, select, [contenteditable]')) return;
      if (this.isMinimapExpanded && e.key.toLowerCase() === 'z') {
        this.setExpandMinimap(false);
        return;
      }
      if (e.key !== 'Escape' && this.isBlockingWorldInput()) return;
      if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
        const dock = document.getElementById('voxel-interaction-dock');
        if (!dock.classList.contains('hidden')) {
          document.getElementById('btn-trigger-action').click();
        }
      }
      if (e.key === 'm' || e.key === 'M') {
        toggleMinimapCollapse();
      }
      if (e.key === 'z' || e.key === 'Z') {
        this.toggleExpandMinimap();
      }
      if (e.key === 'r' || e.key === 'R') {
        this.setNavigationVisible(!this.navigationVisible);
      }
      if (e.key === 'Escape') {
        if (this.isMinimapExpanded) {
          this.setExpandMinimap(false);
        } else {
          this.closeAllModals();
        }
      }
    });

    // 道路收合/展開按鈕
    const roadsBtn = document.getElementById('btn-toggle-roads');
    if (roadsBtn) {
      roadsBtn.addEventListener('click', () => {
        this.setNavigationVisible(!this.navigationVisible);
      });
    }
  }

  setNavigationVisible(visible) {
    this.navigationVisible = visible;
    if (this.game.signposts) this.game.signposts.group.visible = visible;
    const button = document.getElementById('btn-toggle-roads');
    button.setAttribute('aria-pressed', String(visible));
    button.classList.toggle('navigation-active', visible);
    document.getElementById('roads-toggle-label').textContent = visible ? '收路標' : '路標';
    if (!visible) document.getElementById('corner-nav-hud').classList.add('hidden');
    try { localStorage.setItem('yangming-navigation-visible', String(visible)); } catch (_) {}
  }

  async exportAtlas() {
    const button = document.getElementById('btn-export-atlas');
    button.disabled = true;
    button.textContent = '準備中…';
    try {
      if (!window.YANGMING_ATLAS_HTML) await new Promise((resolve,reject) => {
        const script=document.createElement('script');
        script.src='assets/atlas-export.js?v=20260927';
        script.onload=resolve;
        script.onerror=()=>{script.remove();reject(new Error('Atlas load failed'));};
        document.head.appendChild(script);
      });
      const html=window.YANGMING_ATLAS_HTML.replace('/* VISITED_SNAPSHOT */ []',JSON.stringify([...this.visitedSet]));
      const url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));
      const link=document.createElement('a');link.href=url;link.download='我的陽明山散步圖鑑.html';
      document.body.appendChild(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),60000);
      this.showToast('圖鑑已匯出，含圖片、介紹與目前收錄紀錄。');
    } catch (error) {
      this.showToast('圖鑑暫時無法匯出，請確認圖鑑檔案完整後再試。');
    } finally {
      button.disabled=false;button.textContent='匯出圖鑑';
    }
  }

  setRoadsVisible(visible) {
    this.isRoadsVisible = visible;
    const btn = document.getElementById('btn-toggle-roads');
    const icon = document.getElementById('roads-toggle-icon');
    const label = document.getElementById('roads-toggle-label');
    const hud = document.getElementById('corner-nav-hud');

    if (visible) {
      if (btn) btn.classList.remove('roads-hidden');
      if (icon) icon.textContent = '🛣️';
      if (label) label.textContent = '道路';
      this.showToast('🛣️ 已開啟地面道路與轉角指標牌！');
    } else {
      if (btn) btn.classList.add('roads-hidden');
      if (icon) icon.textContent = '🌱';
      if (label) label.textContent = '綠地';
      if (hud) hud.classList.add('hidden');
      this.showToast('🌱 已收起地面道路與指標牌，開啟純淨綠地模式！');
    }
  }

  /**
   * 小地圖放大/縮小與拖曳平移事件
   */
  bindMinimapInteractions() {
    const btnIn = document.getElementById('btn-minimap-zoom-in');
    const btnOut = document.getElementById('btn-minimap-zoom-out');
    const btnReset = document.getElementById('btn-minimap-zoom-reset');
    const container = document.getElementById('minimap-container');

    btnIn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.changeMinimapZoom(0.25);
    });

    btnOut.addEventListener('click', (e) => {
      e.stopPropagation();
      this.changeMinimapZoom(-0.25);
    });

    btnReset.addEventListener('click', (e) => {
      e.stopPropagation();
      this.resetMinimapZoom();
    });

    // 支援在小地圖區域使用滑鼠滾輪縮放
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      this.changeMinimapZoom(delta);
    }, { passive: false });

    container.style.touchAction = 'none';
    container.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      this.isPanning = true;
      this.mapDragged = false;
      this.mapPointerStart = [e.clientX, e.clientY];
      this.panStartX = e.clientX - this.minimapPanX;
      this.panStartY = e.clientY - this.minimapPanY;
    });
    window.addEventListener('pointermove', e => {
      if (!this.isPanning) return;
      if (Math.hypot(e.clientX-this.mapPointerStart[0],e.clientY-this.mapPointerStart[1]) > 6) this.mapDragged = true;
      if (!this.mapDragged) return;
      this.minimapPanX = e.clientX - this.panStartX;
      this.minimapPanY = e.clientY - this.panStartY;
      this.applyMinimapTransform();
    });
    const stopPan = () => { this.isPanning = false; };
    window.addEventListener('pointerup', stopPan);
    window.addEventListener('pointercancel', stopPan);
  }

  /**
   * 切換小地圖全景放大模式
   */
  toggleExpandMinimap() {
    this.setExpandMinimap(!this.isMinimapExpanded);
  }

  setExpandMinimap(expanded) {
    this.isMinimapExpanded = expanded;
    if (expanded) this.game.resetInput();
    const card = document.getElementById('voxel-minimap-card');
    const backdrop = document.getElementById('voxel-minimap-backdrop');
    const expandBtn = document.getElementById('btn-minimap-expand');

    if (this.isMinimapExpanded) {
      // 確保不是收合狀態
      if (this.isMinimapCollapsed) {
        this.isMinimapCollapsed = false;
        card.classList.remove('collapsed');
        document.getElementById('btn-minimap-toggle-size').innerText = '➖';
        document.getElementById('minimap-btn-label').innerText = '地圖';
      }

      document.getElementById('btn-toggle-minimap').setAttribute('aria-expanded', 'true');
      card.classList.add('expanded');
      backdrop.classList.remove('hidden');
      expandBtn.innerText = '🗗';
      expandBtn.title = '縮回小窗 (按 Z 鍵)';
      this.showToast('已開啟全景大地圖 (按 Z 可縮回小窗)');
    } else {
      card.classList.remove('expanded');
      backdrop.classList.add('hidden');
      expandBtn.innerText = '🔍';
      expandBtn.title = '放大全景地圖 (按 Z 鍵)';
    }

    // 放大或縮回時重設平移
    this.resetMinimapZoom();
  }

  changeMinimapZoom(delta) {
    let nextZoom = Math.round((this.minimapZoomLevel + delta) * 100) / 100;
    nextZoom = Math.max(0.85, Math.min(6, nextZoom));
    this.minimapZoomLevel = nextZoom;
    this.applyMinimapTransform();
  }

  resetMinimapZoom() {
    this.minimapZoomLevel = 1.0;
    this.minimapPanX = 0;
    this.minimapPanY = 0;
    this.applyMinimapTransform();
  }

  applyMinimapTransform() {
    const limit = document.getElementById('minimap-container').clientWidth * Math.max(0, this.minimapZoomLevel - 1) / 2;
    this.minimapPanX = Math.max(-limit, Math.min(limit, this.minimapPanX));
    this.minimapPanY = Math.max(-limit, Math.min(limit, this.minimapPanY));
    const layer = document.getElementById('minimap-transform-layer');
    const zoomText = document.getElementById('minimap-zoom-text');
    if (layer) {
      layer.style.transform = `translate(${this.minimapPanX}px, ${this.minimapPanY}px) scale(${this.minimapZoomLevel})`;
    }
    if (zoomText) {
      zoomText.innerText = `${Math.round(this.minimapZoomLevel * 100)}%`;
    }
  }

  /**
   * 即時更新小地圖上的玩家紅點與方位文字、臉朝向箭頭 (每一幀由 VoxelGame 調用)
   */
  update(playerPos, playerYaw) {
    if (!playerPos) return;

    // 將 3D 空間坐標轉換為 2D 水彩地圖坐標
    const map = this.game.roadNetwork.worldToMap(playerPos.x, playerPos.z);
    const p2dX = map.x;
    const p2dY = map.y;

    const leftPct = Math.max(0, Math.min(100, (p2dX / 1024) * 100));
    const topPct = Math.max(0, Math.min(100, (p2dY / 1024) * 100));

    // 更新紅點位置
    const dot = document.getElementById('minimap-player-dot');
    if (dot) {
      dot.style.left = `${leftPct.toFixed(2)}%`;
      dot.style.top = `${topPct.toFixed(2)}%`;
    }

    // 更新面朝方向箭頭 (deg: 0deg 為向北/向上)
    const arrow = document.getElementById('minimap-player-arrow');
    if (arrow && typeof playerYaw === 'number') {
      const deg = 180 - (playerYaw * 180 / Math.PI);
      arrow.style.transform = `translate(-50%, -100%) rotate(${deg.toFixed(1)}deg)`;
    }

    // 更新坐標文字
    const coordsEl = document.getElementById('minimap-coords');
    if (coordsEl) {
      coordsEl.innerText = '北 ↑ · 實際道路';
    }

    // 自動判斷當前五大生活分區
    const badge = document.getElementById('minimap-district-badge');
    if (badge) {
      const districtName = '陽明里・陽明山';
      badge.innerText = districtName;
    }
  }

  setProximityStatus(landmark, nearChief) {
    this.currentNearbyLandmark = landmark;
    this.isNearChief = nearChief;

    const dock = document.getElementById('voxel-interaction-dock');
    const icon = document.getElementById('action-btn-icon');
    const text = document.getElementById('action-btn-text');

    if (nearChief) {
      icon.innerHTML = '🔍💬';
      text.innerText = '找里長聊天';
      dock.classList.remove('hidden');
    } else if (landmark) {
      icon.innerHTML = '🔍🔍';
      text.innerText = `調查：${landmark.name}`;
      dock.classList.remove('hidden');
    } else {
      dock.classList.add('hidden');
    }
  }

  openStoryModal(landmark) {
    this.activeStoryLandmark = landmark;
    this.game.resetInput();
    const modal = document.getElementById('modal-story');
    const tag = document.getElementById('story-tag');
    const title = document.getElementById('story-title');
    const desc = document.getElementById('story-desc');
    const img = document.getElementById('story-thumb-img');
    const btnCollect = document.getElementById('btn-collect-landmark');

    tag.innerText = `${landmark.category} · ${landmark.districtName}`;
    title.innerText = `${landmark.code} ${landmark.name}`;
    desc.innerText = landmark.description;

    img.src = `./assets/icons/${landmark.id}.png`;
    img.onerror = () => {
      img.src = './assets/map_clean_reference.jpg';
    };

    if (this.visitedSet.has(landmark.id)) {
      btnCollect.innerText = '已在圖鑑中 ✓';
      btnCollect.classList.add('collected');
    } else {
      btnCollect.innerText = '收錄到圖鑑';
      btnCollect.classList.remove('collected');
    }

    modal.classList.remove('hidden');
  }

  closeStoryModal() {
    document.getElementById('modal-story').classList.add('hidden');
  }

  collectLandmark(landmark) {
    if (!this.visitedSet.has(landmark.id)) {
      this.visitedSet.add(landmark.id);
      this.saveProgress();
      this.updateAlbumStats();

      // 小地圖標記打勾
      const dotWrap = document.getElementById(`minimap-dot-${landmark.id}`);
      if (dotWrap) dotWrap.classList.add('visited');

      this.showToast(`✨ 成功收錄「${landmark.name}」到圖鑑！`);
    }
    this.closeStoryModal();
  }

  openChiefModal() {
    this.game.resetInput();
    document.getElementById('modal-chief').classList.remove('hidden');
  }

  closeChiefModal() {
    document.getElementById('modal-chief').classList.add('hidden');
  }

  openAlbumModal() {
    this.game.resetInput();
    this.renderAlbumList();
    document.getElementById('modal-album').classList.remove('hidden');
  }

  closeAlbumModal() {
    document.getElementById('modal-album').classList.add('hidden');
  }

  closeAllModals() {
    ['modal-story', 'modal-album', 'modal-chief'].forEach(id => {
      document.getElementById(id).classList.add('hidden');
    });
    this.setExpandMinimap(false);
  }

  updateAlbumStats() {
    const total = LANDMARKS.length;
    const count = this.visitedSet.size;
    const countEl = document.getElementById('album-counter');
    if (countEl) countEl.innerText = `${count}/${total}`;

    const progBar = document.getElementById('album-progress-bar');
    if (progBar) progBar.style.width = `${(count / total) * 100}%`;

    const progText = document.getElementById('album-progress-text');
    if (progText) progText.innerText = `已收錄 ${count} / ${total} 處地標 (${Math.round((count / total) * 100)}%)`;
  }

  renderAlbumList() {
    const listScroll = document.getElementById('album-list-scroll');
    if (!listScroll) return;
    listScroll.innerHTML = '';

    const districts = [
      { key: 'central', title: '【中央】山仔后生活核心 (6處)' },
      { key: 'north', title: '【北區】草山歷史官舍 (7處)' },
      { key: 'west', title: '【西區】華岡美軍生活圈 (8處)' },
      { key: 'east', title: '【東區】建業學園與生態 (4處)' },
      { key: 'south', title: '【南區】花卉信仰與門戶 (5處)' }
    ];

    for (const lm of LANDMARKS) {
      if (!districts.some(d => d.key === lm.district)) districts.push({key:lm.district, title:lm.districtName + ' (0處)'});
    }
    districts.forEach(dist => {
      const query = document.getElementById('landmark-search').value.trim().toLocaleLowerCase();
      const unvisited = document.getElementById('only-unvisited').checked;
      const region = document.getElementById('landmark-region').value;
      const distLandmarks = LANDMARKS.filter(lm => lm.district === dist.key && (region === 'all' || lm.district === region) && (!unvisited || !this.visitedSet.has(lm.id)) && (lm.name + lm.code).toLocaleLowerCase().includes(query));
      if (distLandmarks.length === 0) return;

      const groupDiv = document.createElement('div');
      groupDiv.className = 'voxel-album-group';

      const titleDiv = document.createElement('div');
      titleDiv.className = 'voxel-album-dist-title';
      titleDiv.innerText = dist.title.replace(/\(\d+處\)/, `(${distLandmarks.length}處)`);
      groupDiv.appendChild(titleDiv);

      distLandmarks.forEach(item => {
        const isVisited = this.visitedSet.has(item.id);
        const itemRow = document.createElement('div');
        itemRow.className = `voxel-album-item ${isVisited ? 'visited' : 'unvisited'}`;
        itemRow.innerHTML = `
          <div class="item-left">
            <span class="item-code-badge ${isVisited ? 'code-visited' : 'code-unvisited'}">${item.code}</span>
            <span class="item-name">${item.name}</span>
          </div>
          <div class="item-status">
            ${isVisited ? '<span class="status-checked">✓</span>' : '<span class="status-pending">未到訪</span>'}
          </div>
        `;

        itemRow.addEventListener('click', () => {
          this.closeAlbumModal();
          this.openStoryModal(item);
        });

        groupDiv.appendChild(itemRow);
      });

      listScroll.appendChild(groupDiv);
    });
    if (!listScroll.children.length) listScroll.textContent = '找不到符合的地標，試試其他名稱或取消篩選。';
  }

  triggerViewModeCycle() {
    const nextMode = this.game.cycleViewMode();
    const iconEl = document.getElementById('view-mode-icon');
    const labelEl = document.getElementById('view-mode-name');
    if (iconEl) iconEl.innerText = nextMode.icon;
    if (labelEl) labelEl.innerText = nextMode.shortName;

    this.showToast(`已切換視角：${nextMode.name}`);
  }

  showToast(msg) {
    const toast = document.getElementById('voxel-toast');
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.remove('hidden');

    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 1500);
  }
}


  // 6. 3D 遊戲引擎核心
  /**
 * 陽明里漫步 3D 方塊版 - 遊戲主核心 (VoxelGame.js)
 * 整合 Three.js 渲染管線、角色跟隨鏡頭、點擊尋路、鍵盤控制與地標距離感測
 */







class VoxelGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();

    // 鍵盤狀態
    this.keys = { forward: false, backward: false, left: false, right: false };

    // 視角模式配置 (斜俯視 45°、沉浸平視、上空俯視)
    this.viewModes = [
      {
        id: 'iso',
        name: '45° 斜俯視',
        shortName: '斜視',
        icon: '📐',
        pitch: 0.82,     // 約 47 度俯角
        distance: 24,    // 舒適視距
        lookAtOffsetY: 1.2
      },
      {
        id: 'eye',
        name: '沉浸平視',
        shortName: '平視',
        icon: '👀',
        pitch: 1.35,     // 約 77 度，平視街道與門面
        distance: 7.5,   // 近身視距
        lookAtOffsetY: 1.6
      },
      {
        id: 'top',
        name: '上空俯視',
        shortName: '俯視',
        icon: '🦅',
        pitch: 0.15,     // 約 8 度，高空垂直俯視
        distance: 38,    // 沙盤高空
        lookAtOffsetY: 0
      }
    ];
    this.currentViewIndex = 0;

    // 球面相機參數 (支援滑鼠 360 度水平旋轉、垂直俯仰、滾輪縮放)
    const initialMode = this.viewModes[0];
    this.cameraYaw = 0;
    this.cameraPitch = initialMode.pitch;
    this.cameraDistance = initialMode.distance;
    this.targetPitch = initialMode.pitch;
    this.targetDistance = initialMode.distance;
    this.currentLookAtY = initialMode.lookAtOffsetY;
    this.cameraTarget = new THREE.Vector3();
    this.roadsVisible = true;

    this.initScene();
    this.initLights();
    this.initWorld();
    this.initControls();

    // 初始鏡頭精準就位對準主角小人
    this.cameraTarget.copy(this.player.group.position);
    const initDist = this.cameraDistance;
    const initPitch = this.cameraPitch;
    const initYaw = this.cameraYaw;
    this.camera.position.set(
      this.cameraTarget.x + initDist * Math.sin(initPitch) * Math.sin(initYaw),
      this.cameraTarget.y + initDist * Math.cos(initPitch),
      this.cameraTarget.z + initDist * Math.sin(initPitch) * Math.cos(initYaw)
    );
    this.camera.lookAt(this.cameraTarget.x, this.cameraTarget.y + this.currentLookAtY, this.cameraTarget.z);

    this.ui = new VoxelUI(this);
    const requestedCode = new URLSearchParams(window.location.search).get('landmark');
    const requestedPlace = this.buildings.landmarksWith3D.find(item => item.data.code === requestedCode);
    if (requestedPlace) this.teleportToLandmark(requestedPlace.data);

    // 啟動主迴圈
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initScene() {
    this.scene = new THREE.Scene();
    // 溫暖明亮的陽明山天藍色背景與遠景柔霧 (近處無霧干擾)
    this.scene.background = new THREE.Color(0xa7d8ff);
    this.scene.fog = new THREE.Fog(0xa7d8ff, 60, 180);

    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;

    // 視角 45 度俯角，如截圖
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 500);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  initLights() {
    // 溫暖明亮的環境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    this.scene.add(ambientLight);

    // 陽明山天際半球光 (天頂天空藍 + 地面反光草綠)
    const hemiLight = new THREE.HemisphereLight(0xe8f4f8, 0x8cb369, 0.25);
    this.scene.add(hemiLight);

    // 太陽斜射明亮暖光
    this.sunLight = new THREE.DirectionalLight(0xfffaed, 0.55);
    this.sunLight.position.set(35, 50, 30);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 5;
    this.sunLight.shadow.camera.far = 120;
    this.sunLight.shadow.camera.left = -40;
    this.sunLight.shadow.camera.right = 40;
    this.sunLight.shadow.camera.top = 40;
    this.sunLight.shadow.camera.bottom = -40;
    this.sunLight.shadow.bias = -0.001;
    this.scene.add(this.sunLight);
    this.scene.add(this.sunLight.target);
  }

  initWorld() {
    // 1. 地形、步道與自然景觀
    this.roadNetwork = new RoadNetwork();
    this.terrain = new VoxelTerrain(this.scene, this.roadNetwork, this.renderer.capabilities.maxTextureSize);

    // 2. 30 處地標與特色體素建築 (麥當勞、派出所、7-11、美軍宿舍群等)
    this.buildings = new VoxelBuildings(this.scene, this.roadNetwork);
    this.signposts = new RoadSignposts(this.scene, this.roadNetwork);
    this.entrance = this.roadNetwork.placements.get('site_01').entrance;

    // 3. 玩家主角方塊小人 (青綠色上衣、深藍長褲，還原截圖 4)
    this.player = new VoxelCharacter({
      shirtColor: 0x2a9d8f,
      pantsColor: 0x264653,
      isNpc: false
    });
    // 起點位置：開闊草地前庭，視野通透 (如截圖 4 與 5)
    this.player.group.position.set(this.entrance[0], 0, this.entrance[1]);
    this.scene.add(this.player.group);

    // 4. 里長 NPC (棕色外套、深色長褲，站在主角身邊歡迎玩家，還原截圖 5)
    this.chiefNpc = new VoxelCharacter({
      shirtColor: 0x6b4226,
      pantsColor: 0x333333,
      isNpc: true,
      name: '里長 黃裕倉'
    });
    this.chiefNpc.group.position.set(this.entrance[0] + 2.5, 0, this.entrance[1] + 1.5);
    this.chiefNpc.group.rotation.y = -Math.PI / 3;
    this.scene.add(this.chiefNpc.group);
  }

  resetInput() {
    Object.keys(this.keys).forEach(key => { this.keys[key] = false; });
    this.player.stop();
    if (this.cancelPointer) this.cancelPointer();
  }

  initControls() {
    // 鍵盤移動監聽
    window.addEventListener('keydown', (e) => {
      if (e.target?.closest('input, textarea, select, [contenteditable]') || this.ui?.isBlockingWorldInput()) return;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) e.preventDefault();
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          this.keys.forward = true;
          break;
        case 's':
        case 'arrowdown':
          this.keys.backward = true;
          break;
        case 'a':
        case 'arrowleft':
          this.keys.left = true;
          break;
        case 'd':
        case 'arrowright':
          this.keys.right = true;
          break;
        case 'v':
        case 'c':
          if (!e.repeat) this.ui.triggerViewModeCycle();
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          this.keys.forward = false;
          break;
        case 's':
        case 'arrowdown':
          this.keys.backward = false;
          break;
        case 'a':
        case 'arrowleft':
          this.keys.left = false;
          break;
        case 'd':
        case 'arrowright':
          this.keys.right = false;
          break;
      }
    });

    // === 滑鼠與觸控統一互動 (按住拖曳旋轉視野 / 輕點地面尋路漫步) ===
    let isPointerDown = false;
    let hasDragged = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let startTime = 0;
    let pointerButton = 0;
    let activePointerId = null;
    this.cancelPointer = () => { isPointerDown = false; activePointerId = null; };
    window.addEventListener('blur', () => this.resetInput());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.resetInput();
    });
    window.addEventListener('pointercancel', () => this.resetInput());

    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const planeHit = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const doTapMove = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, this.camera);
      if (raycaster.ray.intersectPlane(groundPlane, planeHit)) {
        const hitX = THREE.MathUtils.clamp(planeHit.x, -this.roadNetwork.halfSize + 2, this.roadNetwork.halfSize - 2);
        const hitZ = THREE.MathUtils.clamp(planeHit.z, -this.roadNetwork.halfSize + 2, this.roadNetwork.halfSize - 2);
        this.player.moveTo(hitX, hitZ);
        this.terrain.spawnRipple(hitX, hitZ);
      }
    };

    window.addEventListener('pointerdown', (e) => {
      if (e.target !== this.canvas || this.ui?.isBlockingWorldInput() || activePointerId !== null) return;
      activePointerId = e.pointerId;
      // 點在 UI 卡片或按鈕上不啟動拖曳或尋路
      if (e.target && e.target.closest('button, .voxel-action-btn, .voxel-story-card, .voxel-album-card, .voxel-circle-stat, .voxel-btn-view, .voxel-badge-title')) {
        return;
      }

      isPointerDown = true;
      hasDragged = false;
      startX = e.clientX;
      startY = e.clientY;
      lastX = e.clientX;
      lastY = e.clientY;
      startTime = Date.now();
      pointerButton = e.button;
    });

    window.addEventListener('pointermove', (e) => {
      if (!isPointerDown || e.pointerId !== activePointerId) return;

      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      const totalDist = Math.hypot(e.clientX - startX, e.clientY - startY);
      if (totalDist > 5) {
        hasDragged = true;
      }

      if (hasDragged) {
        // 水平 360 度旋轉 (Yaw)
        this.cameraYaw -= deltaX * 0.007;
        // 垂直俯仰 (Pitch) - 限制在 0.12 (俯視) 到 1.45 (接近水平) 之間
        this.cameraPitch = THREE.MathUtils.clamp(this.cameraPitch + deltaY * 0.006, 0.12, 1.45);
        this.targetPitch = this.cameraPitch;
      }
    });

    window.addEventListener('pointerup', (e) => {
      if (!isPointerDown || e.pointerId !== activePointerId) return;
      isPointerDown = false;
      activePointerId = null;
      if (this.ui?.isBlockingWorldInput()) return;

      const totalDist = Math.hypot(e.clientX - startX, e.clientY - startY);
      const duration = Date.now() - startTime;

      // 若未拖曳（位移 < 8px 且時間在 600ms 內），且按的是左鍵或手指輕點，觸發點擊地面漫步！
      if (!hasDragged && totalDist < 8 && duration < 600 && pointerButton === 0) {
        doTapMove(e.clientX, e.clientY);
      }
    });

    // 支援滑鼠滾輪縮放視野 (Zoom In / Zoom Out)
    this.canvas.addEventListener('wheel', (e) => {
      if (this.ui?.isBlockingWorldInput()) return;
      this.targetDistance = THREE.MathUtils.clamp(this.targetDistance + e.deltaY * 0.025, 4.5, 60);
    }, { passive: true });

    // 防止右鍵選單彈出干擾旋轉
    window.addEventListener('contextmenu', (e) => {
      if (!e.target.closest('input, textarea')) {
        e.preventDefault();
      }
    });
  }

  teleportToEntrance() {
    this.resetInput();
    // 快速傳送回起點入口
    this.player.stop();
    this.player.group.position.set(this.entrance[0], 0, this.entrance[1]);
    this.player.group.rotation.y = 0;
    this.cameraTarget.copy(this.player.group.position);
    this.cameraYaw = 0;
    this.terrain.spawnRipple(this.entrance[0], this.entrance[1]);
    const mode = this.getCurrentViewMode();
    this.targetDistance = mode.distance;
    this.targetPitch = mode.pitch;
  }

  teleportToLandmark(landmark) {
    const item = this.buildings.landmarksWith3D.find(l => l.data.id === landmark.id);
    if (item) {
      this.player.stop();
      this.resetInput();
      this.player.group.position.set(item.entrance[0], 0, item.entrance[1]);
      this.cameraTarget.copy(this.player.group.position);
      this.player.group.rotation.y = item.yaw + Math.PI;
      if (landmark.district === 'yangmingshan') {
        this.cameraYaw = item.yaw;
        this.targetDistance = landmark.code === '60' ? 58 : 40;
        this.targetPitch = .85;
      }
      this.terrain.spawnRipple(item.entrance[0], item.entrance[1]);
    }
  }

  handleKeyboardMove(delta) {
    const moveDir = new THREE.Vector3();

    // 根據相機目前旋轉視角計算前後左右方向
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);

    if (this.keys.forward) moveDir.add(forward);
    if (this.keys.backward) moveDir.sub(forward);
    if (this.keys.left) moveDir.sub(right);
    if (this.keys.right) moveDir.add(right);

    if (moveDir.lengthSq() > 0.001) {
      moveDir.normalize();
      this.player.stop(); // 停止點擊尋路，改由鍵盤接手
      this.player.isMoving = true;

      const moveStep = this.player.speed * delta;
      this.player.group.position.addScaledVector(moveDir, moveStep);
      const limit = this.roadNetwork.halfSize - 2;
      this.player.group.position.x = THREE.MathUtils.clamp(this.player.group.position.x, -limit, limit);
      this.player.group.position.z = THREE.MathUtils.clamp(this.player.group.position.z, -limit, limit);

      // 面向移動方向
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      let diff = targetAngle - this.player.group.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.player.group.rotation.y += diff * Math.min(1, delta * 15);
    } else if (!this.player.targetPos) {
      this.player.isMoving = false;
    }
  }

  updateProximity() {
    const playerPos = this.player.group.position;

    // 1. 檢測與里長 NPC 的距離
    const chiefDist = playerPos.distanceTo(this.chiefNpc.group.position);
    const nearChief = chiefDist < 4.2;

    // 2. 檢測與 30 處地標的距離
    let nearestLandmark = null;
    let minDistance = 9.0; // 感測閾值

    for (const item of this.buildings.landmarksWith3D) {
      const dist = playerPos.distanceTo(item.position);
      if (dist < minDistance) {
        minDistance = dist;
        nearestLandmark = item.data;
      }
    }

    // 更新 UI 浮動互動按鈕 (調查 / 聊天)
    this.ui.setProximityStatus(nearestLandmark, nearChief);
  }

  cycleViewMode() {
    this.currentViewIndex = (this.currentViewIndex + 1) % this.viewModes.length;
    const currentMode = this.viewModes[this.currentViewIndex];
    this.targetPitch = currentMode.pitch;
    this.targetDistance = currentMode.distance;
    return currentMode;
  }

  getCurrentViewMode() {
    return this.viewModes[this.currentViewIndex];
  }

  toggleRoads() {
    this.roadsVisible = !this.roadsVisible;
    if (this.terrain && this.terrain.roadsMesh) {
      this.terrain.roadsMesh.visible = this.roadsVisible;
    }
    if (this.signposts && this.signposts.group) {
      this.signposts.group.visible = this.roadsVisible;
    }
    if (this.ui) {
      this.ui.setRoadsVisible(this.roadsVisible);
    }
    return this.roadsVisible;
  }

  updateCamera() {
    // 平滑鏡頭目標跟隨主角
    const playerPos = this.player.group.position;
    this.cameraTarget.lerp(playerPos, 0.08);

    // 平滑過渡距離、俯仰角與 LookAt 高度
    this.cameraDistance = THREE.MathUtils.lerp(this.cameraDistance, this.targetDistance, 0.08);
    this.cameraPitch = THREE.MathUtils.lerp(this.cameraPitch, this.targetPitch, 0.08);
    const curMode = this.viewModes[this.currentViewIndex];
    this.currentLookAtY = THREE.MathUtils.lerp(this.currentLookAtY, curMode.lookAtOffsetY, 0.08);

    // 球面座標換算相機相對位置 (支援 360 度任意旋轉、俯仰、拉近拉遠)
    const dist = this.cameraDistance;
    const pitch = this.cameraPitch;
    const yaw = this.cameraYaw;

    const offsetX = dist * Math.sin(pitch) * Math.sin(yaw);
    const offsetY = dist * Math.cos(pitch);
    const offsetZ = dist * Math.sin(pitch) * Math.cos(yaw);

    const targetCameraPos = new THREE.Vector3(
      this.cameraTarget.x + offsetX,
      this.cameraTarget.y + offsetY,
      this.cameraTarget.z + offsetZ
    );

    this.camera.position.lerp(targetCameraPos, 0.1);
    this.camera.lookAt(this.cameraTarget.x, this.cameraTarget.y + this.currentLookAtY, this.cameraTarget.z);

    // 陽光平行跟隨主角，維持細緻陰影
    this.sunLight.position.set(playerPos.x + 30, 45, playerPos.z + 25);
    this.sunLight.target.position.copy(playerPos);
    this.sunLight.target.updateMatrixWorld();
  }

  resize(width, height) {
    if (this.camera && this.renderer) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const time = this.clock.getElapsedTime();

    // 鍵盤移動
    if (this.ui?.isBlockingWorldInput()) this.resetInput();
    else this.handleKeyboardMove(delta);

    // 角色動畫更新
    this.player.update(delta);
    this.chiefNpc.update(delta);

    // 地景與建築更新 (漣漪淡出、引導晶石浮動)
    this.terrain.update(delta);
    this.buildings.update(delta, time);
    if (this.signposts && this.ui) {
      const cornerNav = this.signposts.update(this.player.group.position, this.player.group.rotation.y);
      this.ui.updateCornerNav(cornerNav);
    }

    // 距離感測
    this.updateProximity();

    // 鏡頭跟隨
    this.updateCamera();

    // 即時更新 UI 小地圖位置與玩家朝向
    if (this.ui && this.ui.update) {
      this.ui.update(this.player.group.position, this.player.group.rotation.y);
    }

    // 渲染場景
    this.renderer.render(this.scene, this.camera);
  }
}


  // 7. 啟動入口
  /**
 * 陽明里漫步 3D 方塊版 - 遊戲進入點 (main_3d.js)
 * 初始化 Three.js 遊戲引擎與視窗自適應監聽
 */

function init3DGame() {
  const canvas = document.getElementById('game-canvas-3d');
  if (!canvas) {
    console.error('找不到 3D 遊戲畫布 (game-canvas-3d)！');
    return;
  }

  // 建立 3D 遊戲引擎實例
  const game = new VoxelGame(canvas);
  window.voxelGame = game;

  // 視窗自適應縮放
  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    game.resize(width, height);
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', () => {
    setTimeout(handleResize, 100);
  });

  handleResize();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init3DGame);
} else {
  init3DGame();
}

})();
