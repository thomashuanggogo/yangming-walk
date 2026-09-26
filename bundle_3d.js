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
  /**
 * 台北市士林區陽明里 官方全域 30 處核心地標空間資料庫
 * 精準錨定於 1024 x 1024 純手繪水彩繪本全景地圖各建築物正門
 * 功能導向模式：單純描述「這個地方是幹嘛的」、功能與遊憩體驗，無生硬特色標籤
 */
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
    "geoLat": 25.1375,
    "geoLon": 121.546
  },
  {
    "id": "site_09",
    "code": "09",
    "name": "彩虹谷故事館 (F206)",
    "category": "文史故事",
    "plusCode": "4GQW+45",
    "district": "north",
    "districtName": "北區・草山歷史官舍",
    "x": 135,
    "y": 265,
    "radius": 40,
    "title": "09 彩虹谷故事館 (F206)",
    "description": "原汁原味保留 1950 年代美軍眷舍原貌的文史老屋，推廣冷戰美軍生活記憶、老屋修復故事，並能在此欣賞陽明山世界級的壯觀彩虹景觀。",
    "geoLat": 25.13775,
    "geoLon": 121.54538
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
    "name": "美軍俱樂部 (BRICK YARD)",
    "category": "歷史餐飲",
    "plusCode": "4GPV+69",
    "district": "west",
    "districtName": "西區・華岡美軍生活圈",
    "x": 350,
    "y": 600,
    "radius": 40,
    "title": "18 美軍俱樂部 (BRICK YARD)",
    "description": "原美軍聯誼俱樂部改建的千坪文創休閒聚落，結合美式炭烤餐廳、戶外露天泳池水景與數千張珍貴黑膠唱片展覽，重現冷戰黃金年代。",
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
    "description": "依山壁而建的梯田式南洋峇里島風觀景餐廳，設有發呆亭與無邊際水池，是全台北最具指標性的百萬夜景約會與跨年勝地。",
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
    "description": "台北市免門票的公立植物公園，佔地廣大且四季百花盛開，擁有全台聞名的百年茶花林步道與櫻花大道，是散步健行與婚紗拍攝的賞花勝地。",
    "geoLat": 25.13512,
    "geoLon": 121.54513
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
  /**
 * 陽明里漫步 3D 方塊版 - 體素地形與自然景觀模組 (VoxelTerrain.js)
 * 打造台地草階、仰德大道與山仔后街區石板路、方塊樹木與花柱
 */

class VoxelTerrain {
  constructor(scene) {
    this.scene = scene;
    this.clickableObjects = []; // 供 Raycaster 拾取的地面物件
    this.rippleRings = []; // 點擊漣漪特效
    this.materials = this.initMaterials();
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.buildTerrain();
    this.buildRoads();
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
    const baseGeo = new THREE.BoxGeometry(280, 1, 280);
    const baseMesh = new THREE.Mesh(baseGeo, this.materials.grassTop);
    baseMesh.position.y = -0.5;
    baseMesh.receiveShadow = true;
    this.group.add(baseMesh);
    this.clickableObjects.push(baseMesh);

    // 平坦的方塊草地網格線 (如截圖般一格一格的 Minecraft 像素方塊感，完全平整無起伏)
    const gridHelper = new THREE.GridHelper(280, 140, 0x568c31, 0x619b38);
    gridHelper.position.y = 0.01;
    this.group.add(gridHelper);
  }

  buildRoads() {
    // 仰德大道 / 格致路 (南北走向主幹道)
    const mainRoadGeo = new THREE.BoxGeometry(10, 0.08, 250);
    const mainRoad = new THREE.Mesh(mainRoadGeo, this.materials.asphalt);
    mainRoad.position.set(0, 0.04, 0);
    mainRoad.receiveShadow = true;
    this.group.add(mainRoad);
    this.clickableObjects.push(mainRoad);

    // 主幹道黃色分向線 (方塊虛線)
    for (let z = -120; z <= 120; z += 10) {
      const lineGeo = new THREE.BoxGeometry(0.5, 0.1, 4);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.set(0, 0.09, z);
      this.group.add(line);
    }

    // 東西向光華路 / 愛富一街 (美軍宿舍主要橫向幹道)
    const crossRoadGeo = new THREE.BoxGeometry(220, 0.08, 8);
    const crossRoad = new THREE.Mesh(crossRoadGeo, this.materials.asphalt);
    crossRoad.position.set(0, 0.04, -30);
    crossRoad.receiveShadow = true;
    this.group.add(crossRoad);
    this.clickableObjects.push(crossRoad);

    // 麥當勞門前與山仔后生活核心行人石板廣場 (灰色方塊步道)
    const plazaGeo = new THREE.BoxGeometry(32, 0.09, 36);
    const plaza = new THREE.Mesh(plazaGeo, this.materials.stoneRoad);
    plaza.position.set(-6, 0.05, 5);
    plaza.receiveShadow = true;
    this.group.add(plaza);
    this.clickableObjects.push(plaza);

    // 文化大學方向步道 (西側)
    const pccuPathGeo = new THREE.BoxGeometry(80, 0.08, 6);
    const pccuPath = new THREE.Mesh(pccuPathGeo, this.materials.stoneRoad);
    pccuPath.position.set(-50, 0.04, 25);
    pccuPath.receiveShadow = true;
    this.group.add(pccuPath);
    this.clickableObjects.push(pccuPath);

    // 美軍宿舍區林蔭石板小徑 (蜿蜒木道與碎石路)
    const subPaths = [
      { x: 45, z: -55, w: 6, d: 60, mat: this.materials.stoneRoad },
      { x: 70, z: -30, w: 50, d: 5, mat: this.materials.dirtPath },
      { x: -50, z: -60, w: 6, d: 50, mat: this.materials.dirtPath },
      { x: 15, z: 50, w: 5, d: 60, mat: this.materials.stoneRoad }
    ];
    subPaths.forEach(p => {
      const geo = new THREE.BoxGeometry(p.w, 0.08, p.d);
      const mesh = new THREE.Mesh(geo, p.mat);
      mesh.position.set(p.x, 0.04, p.z);
      mesh.receiveShadow = true;
      this.group.add(mesh);
      this.clickableObjects.push(mesh);
    });
  }

  buildNature() {
    // 1. 方塊樹木配置 (櫻花樹、黑松、闊葉樹)
    const treePositions = [
      // 麥當勞與派出所周邊
      { x: -16, z: 18, type: 'oak' },
      { x: -14, z: -8, type: 'sakura' },
      { x: 12, z: 12, type: 'oak' },
      { x: 14, z: -10, type: 'sakura' },
      // 山仔后公園周邊林蔭
      { x: -28, z: -32, type: 'oak' },
      { x: -35, z: -25, type: 'oak' },
      { x: -22, z: -40, type: 'sakura' },
      // 北區美軍宿舍群林道
      { x: -25, z: -70, type: 'oak' },
      { x: -15, z: -85, type: 'sakura' },
      { x: 20, z: -75, type: 'sakura' },
      { x: 35, z: -85, type: 'oak' },
      { x: -55, z: -80, type: 'oak' },
      // 東區美軍宿舍群 (亞尼克 / 想陽明山)
      { x: 45, z: -15, type: 'sakura' },
      { x: 60, z: -45, type: 'oak' },
      { x: 75, z: -60, type: 'sakura' },
      { x: 85, z: -10, type: 'oak' },
      { x: 55, z: 15, type: 'oak' },
      // 南區花卉試驗中心周邊 (密集櫻花樹與花樹)
      { x: -10, z: 65, type: 'sakura' },
      { x: -25, z: 75, type: 'sakura' },
      { x: 25, z: 70, type: 'sakura' },
      { x: 40, z: 85, type: 'oak' },
      { x: 10, z: 95, type: 'sakura' },
      // 西區文大邊坡
      { x: -65, z: 10, type: 'oak' },
      { x: -80, z: 35, type: 'oak' },
      { x: -45, z: 40, type: 'sakura' }
    ];

    treePositions.forEach(t => {
      this.createVoxelTree(t.x, t.z, t.type);
    });

    // 2. 散落於草地上的彩色小花方塊柱 (如截圖 4 所示)
    const flowerMats = [
      this.materials.flowerRed,
      this.materials.flowerPink,
      this.materials.flowerWhite,
      this.materials.flowerOrange,
      this.materials.flowerYellow
    ];

    const flowerPositions = [
      { x: -12, z: 8 }, { x: -8, z: 22 }, { x: 8, z: 6 }, { x: 10, z: 25 },
      { x: -20, z: -18 }, { x: -25, z: -14 }, { x: 18, z: -20 }, { x: 25, z: -35 },
      { x: -30, z: 30 }, { x: -35, z: 15 }, { x: 35, z: -15 }, { x: 45, z: 10 },
      { x: -6, z: 45 }, { x: 12, z: 55 }, { x: -18, z: 60 }, { x: 22, z: 75 },
      { x: -50, z: -45 }, { x: 60, z: -70 }, { x: 70, z: 10 }, { x: -70, z: 20 }
    ];

    flowerPositions.forEach((pos, idx) => {
      const fGeo = new THREE.BoxGeometry(0.3, 0.7, 0.3);
      const fMat = flowerMats[idx % flowerMats.length];
      const flower = new THREE.Mesh(fGeo, fMat);
      flower.position.set(pos.x, 0.35, pos.z);
      flower.castShadow = true;
      this.group.add(flower);
    });

    // 3. 復古路燈 (沿幹道豎立)
    const lampPositions = [
      { x: -6, z: -15 }, { x: 6, z: -15 },
      { x: -6, z: 15 }, { x: 6, z: 15 },
      { x: -6, z: 40 }, { x: 6, z: 40 },
      { x: -6, z: -45 }, { x: 6, z: -45 },
      { x: 35, z: -34 }, { x: 65, z: -34 },
      { x: -35, z: -34 }, { x: -65, z: -34 }
    ];
    lampPositions.forEach(p => {
      this.createStreetLamp(p.x, p.z);
    });
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
    item.mesh.position.set(x, 0.08, z);
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
 * 陽明里漫步 3D 方塊版 - 體素建築與 30 處地標模組 (VoxelBuildings.js)
 * 1:1 還原截圖中的陽明山麥當勞巨型「M」字招牌、派出所、7-11、美軍宿舍群等 30 處特色體素建築
 */


class VoxelBuildings {
  constructor(scene) {
    this.scene = scene;
    this.landmarks = LANDMARKS;
    this.landmarksWith3D = []; // 包含 3D 座標與 Mesh 的地標陣列
    this.materials = this.initMaterials();
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.scaleFactor = 0.28;
    this.originX = 320;
    this.originY = 440;

    this.buildAllLandmarks();
  }

  initMaterials() {
    return {
      // 麥當勞專用材質
      mcDonaldsRed: new THREE.MeshLambertMaterial({ color: 0xa8201a }),
      mcDonaldsYellow: new THREE.MeshLambertMaterial({ color: 0xf4a261 }),
      mcDonaldsGold: new THREE.MeshLambertMaterial({ color: 0xe9c46a }),
      mcSignPole: new THREE.MeshLambertMaterial({ color: 0x58311d }),
      // 派出所藍白
      policeBlue: new THREE.MeshLambertMaterial({ color: 0x1d3557 }),
      policeWhite: new THREE.MeshLambertMaterial({ color: 0xf1faee }),
      policeRedLight: new THREE.MeshBasicMaterial({ color: 0xe63946 }),
      policeBlueLight: new THREE.MeshBasicMaterial({ color: 0x457b9d }),
      // 7-11
      sevenGreen: new THREE.MeshLambertMaterial({ color: 0x008037 }),
      sevenOrange: new THREE.MeshLambertMaterial({ color: 0xeb6909 }),
      sevenRed: new THREE.MeshLambertMaterial({ color: 0xed1c24 }),
      // 美軍宿舍
      usBrickWall: new THREE.MeshLambertMaterial({ color: 0x9c4132 }),
      usWhiteWall: new THREE.MeshLambertMaterial({ color: 0xede0d4 }),
      usWoodRoof: new THREE.MeshLambertMaterial({ color: 0x7f4f24 }),
      usDarkRoof: new THREE.MeshLambertMaterial({ color: 0x4a4e69 }),
      usChimney: new THREE.MeshLambertMaterial({ color: 0xddb892 }),
      // 公共園區與通用
      concrete: new THREE.MeshLambertMaterial({ color: 0x9a8c98 }),
      glassWindow: new THREE.MeshLambertMaterial({ color: 0xa0c4e2, transparent: true, opacity: 0.85 }),
      woodBench: new THREE.MeshLambertMaterial({ color: 0x8b5e3c }),
      // 地標引導晶石
      beaconGem: new THREE.MeshBasicMaterial({ color: 0xffb703 }),
      beaconRing: new THREE.MeshBasicMaterial({ color: 0x2a9d8f, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
    };
  }

  buildAllLandmarks() {
    this.landmarks.forEach((data) => {
      // 轉換 2D (x, y) 座標至 3D 空間 (X, Z)
      const worldX = (data.x - this.originX) * this.scaleFactor;
      const worldZ = (data.y - this.originY) * this.scaleFactor;

      const landmarkObj = {
        data: data,
        worldX: worldX,
        worldZ: worldZ,
        position: new THREE.Vector3(worldX, 0, worldZ),
        radius: 7.5, // 靠近感測半徑
        beaconMesh: null,
        ringMesh: null
      };

      // 依地標代號建立專屬 3D 建築或地景模型
      const buildingGroup = this.createLandmarkStructure(data.code, worldX, worldZ, data.name);
      this.group.add(buildingGroup);

      // 地面光圈與微光標記 (浮動晶石)
      const marker = this.createLandmarkMarker(worldX, worldZ);
      landmarkObj.beaconMesh = marker.beacon;
      landmarkObj.ringMesh = marker.ring;
      this.group.add(marker.group);

      this.landmarksWith3D.push(landmarkObj);
    });
  }

  createLandmarkStructure(code, x, z, name) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    switch (code) {
      case '02': // 陽明山麥當勞 (完全還原截圖 3)
        this.buildMcDonalds(group);
        break;
      case '01': // 山仔后派出所
        this.buildPoliceStation(group);
        break;
      case '03': // 7-ELEVEN 陽明山門市
        this.buildConvenienceStore(group);
        break;
      case '04': // 山仔后公園
        this.buildParkGazebo(group);
        break;
      case '05': // 陽明里辦公處
        this.buildCommunityCenter(group);
        break;
      case '06': // 台灣中油加油站
        this.buildGasStation(group);
        break;
      case '07': // 豆留森林 CAMA
      case '08': // 白房子
      case '09': // 彩虹谷
      case '14': // 亞尼克夢想村
      case '16': // 想 陽明山
      case '19': // 美軍俱樂部
        // 經典美軍眷舍平房 (斜屋頂、白煙囪、木框)
        this.buildUSMilitaryHouse(group, code);
        break;
      case '25': // 文化大學大孝館 / 體育館
      case '26': // 文化大學大恩館
        this.buildPCCUHall(group);
        break;
      case '28': // 花卉試驗中心
        this.buildFlowerCenter(group);
        break;
      default:
        // 通用文史風格式平房
        this.buildHistoricCottage(group, code);
        break;
    }

    return group;
  }

  /**
   * 02 陽明山麥當勞 (高度還原截圖 3)
   */
  buildMcDonalds(group) {
    // 建築主體 (紅色磚牆)
    const wallGeo = new THREE.BoxGeometry(9, 4.5, 7);
    const wall = new THREE.Mesh(wallGeo, this.materials.mcDonaldsRed);
    wall.position.set(0, 2.25, 0);
    wall.castShadow = true;
    wall.receiveShadow = true;
    group.add(wall);

    // 金黃色屋頂
    const roofGeo = new THREE.BoxGeometry(9.6, 0.8, 7.6);
    const roof = new THREE.Mesh(roofGeo, this.materials.mcDonaldsYellow);
    roof.position.set(0, 4.65, 0);
    roof.castShadow = true;
    group.add(roof);

    // 落地窗
    const winGeo = new THREE.BoxGeometry(2.4, 1.8, 0.2);
    const win1 = new THREE.Mesh(winGeo, this.materials.glassWindow);
    win1.position.set(-2, 2.2, 3.55);
    group.add(win1);
    const win2 = new THREE.Mesh(winGeo, this.materials.glassWindow);
    win2.position.set(2, 2.2, 3.55);
    group.add(win2);

    // 玻璃大門
    const doorGeo = new THREE.BoxGeometry(1.4, 2.4, 0.2);
    const door = new THREE.Mesh(doorGeo, this.materials.glassWindow);
    door.position.set(0, 1.2, 3.55);
    group.add(door);

    // === 經典立牌大招牌 (雙木樁 + 紅底板 + 黃色方塊大「M」字) ===
    const signGroup = new THREE.Group();
    signGroup.position.set(6.2, 0, 1.5);

    // 左右兩根木柱 (Sign Poles)
    const poleGeo = new THREE.BoxGeometry(0.35, 5.5, 0.35);
    const poleL = new THREE.Mesh(poleGeo, this.materials.mcSignPole);
    poleL.position.set(-1.8, 2.75, 0);
    poleL.castShadow = true;
    signGroup.add(poleL);

    const poleR = new THREE.Mesh(poleGeo, this.materials.mcSignPole);
    poleR.position.set(1.8, 2.75, 0);
    poleR.castShadow = true;
    signGroup.add(poleR);

    // 紅色大招牌底板
    const boardGeo = new THREE.BoxGeometry(3.6, 3.2, 0.3);
    const board = new THREE.Mesh(boardGeo, this.materials.mcDonaldsRed);
    board.position.set(0, 3.6, 0);
    board.castShadow = true;
    signGroup.add(board);

    // 金黃色方塊拼出的巨型「M」字 (5x5 方塊字形)
    const mBlockGeo = new THREE.BoxGeometry(0.48, 0.48, 0.38);
    const mCoords = [
      // 左側直立桿
      [-1.0, 4.4], [-1.0, 3.9], [-1.0, 3.4], [-1.0, 2.9],
      // 右側直立桿
      [1.0, 4.4], [1.0, 3.9], [1.0, 3.4], [1.0, 2.9],
      // 中間內折 V 字
      [-0.5, 4.0], [0.5, 4.0], [0.0, 3.5]
    ];
    mCoords.forEach(([mx, my]) => {
      const mBlock = new THREE.Mesh(mBlockGeo, this.materials.mcDonaldsGold);
      mBlock.position.set(mx, my, 0.05);
      mBlock.castShadow = true;
      signGroup.add(mBlock);
    });

    group.add(signGroup);
  }

  /**
   * 01 山仔后派出所
   */
  buildPoliceStation(group) {
    // 白牆主體
    const wallGeo = new THREE.BoxGeometry(8, 4, 6.5);
    const wall = new THREE.Mesh(wallGeo, this.materials.policeWhite);
    wall.position.set(0, 2, 0);
    wall.castShadow = true;
    group.add(wall);

    // 警政深藍橫飾帶
    const stripeGeo = new THREE.BoxGeometry(8.1, 0.6, 6.6);
    const stripe = new THREE.Mesh(stripeGeo, this.materials.policeBlue);
    stripe.position.set(0, 3.4, 0);
    group.add(stripe);

    // 門口門廊雨遮
    const canopyGeo = new THREE.BoxGeometry(3.2, 0.3, 2);
    const canopy = new THREE.Mesh(canopyGeo, this.materials.policeBlue);
    canopy.position.set(0, 2.8, 4.2);
    group.add(canopy);

    // 柱子
    const pillarGeo = new THREE.BoxGeometry(0.3, 2.8, 0.3);
    const p1 = new THREE.Mesh(pillarGeo, this.materials.policeWhite);
    p1.position.set(-1.4, 1.4, 4.8);
    group.add(p1);
    const p2 = new THREE.Mesh(pillarGeo, this.materials.policeWhite);
    p2.position.set(1.4, 1.4, 4.8);
    group.add(p2);

    // 屋頂警燈 (紅藍雙色小方塊)
    const redLight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), this.materials.policeRedLight);
    redLight.position.set(-0.6, 4.3, 0);
    group.add(redLight);

    const blueLight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), this.materials.policeBlueLight);
    blueLight.position.set(0.6, 4.3, 0);
    group.add(blueLight);
  }

  /**
   * 03 7-ELEVEN 陽明山門市
   */
  buildConvenienceStore(group) {
    // 牆體
    const wallGeo = new THREE.BoxGeometry(7.5, 3.8, 6);
    const wall = new THREE.Mesh(wallGeo, this.materials.policeWhite);
    wall.position.set(0, 1.9, 0);
    wall.castShadow = true;
    group.add(wall);

    // 7-11 經典招牌 (綠紅白條紋)
    const signGeo = new THREE.BoxGeometry(7.8, 1, 6.2);
    const sign = new THREE.Mesh(signGeo, this.materials.sevenGreen);
    sign.position.set(0, 3.6, 0);
    group.add(sign);

    const orangeStripe = new THREE.Mesh(new THREE.BoxGeometry(7.9, 0.3, 6.3), this.materials.sevenOrange);
    orangeStripe.position.set(0, 3.6, 0);
    group.add(orangeStripe);

    const redStripe = new THREE.Mesh(new THREE.BoxGeometry(7.9, 0.2, 6.3), this.materials.sevenRed);
    redStripe.position.set(0, 3.3, 0);
    group.add(redStripe);

    // 大落地窗
    const winGeo = new THREE.BoxGeometry(4.8, 2.2, 0.2);
    const win = new THREE.Mesh(winGeo, this.materials.glassWindow);
    win.position.set(0, 1.6, 3.1);
    group.add(win);
  }

  /**
   * 04 山仔后公園 (涼亭與綠意)
   */
  buildParkGazebo(group) {
    // 圓形/八角形石板地基
    const baseGeo = new THREE.CylinderGeometry(3.5, 3.8, 0.4, 8);
    const base = new THREE.Mesh(baseGeo, this.materials.concrete);
    base.position.y = 0.2;
    group.add(base);

    // 四根原木柱
    const pillarGeo = new THREE.BoxGeometry(0.35, 3, 0.35);
    const pCoords = [[-1.8, -1.8], [1.8, -1.8], [-1.8, 1.8], [1.8, 1.8]];
    pCoords.forEach(([px, pz]) => {
      const p = new THREE.Mesh(pillarGeo, this.materials.woodBench);
      p.position.set(px, 1.7, pz);
      p.castShadow = true;
      group.add(p);
    });

    // 涼亭斜頂
    const roofGeo = new THREE.ConeGeometry(4.2, 1.8, 4);
    const roof = new THREE.Mesh(roofGeo, this.materials.usWoodRoof);
    roof.position.y = 4;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    // 公園長椅
    const benchGeo = new THREE.BoxGeometry(1.6, 0.4, 0.6);
    const bench = new THREE.Mesh(benchGeo, this.materials.woodBench);
    bench.position.set(0, 0.5, 0);
    group.add(bench);
  }

  /**
   * 05 陽明里辦公處 (區民活動中心)
   */
  buildCommunityCenter(group) {
    const wallGeo = new THREE.BoxGeometry(8, 4, 7);
    const wall = new THREE.Mesh(wallGeo, this.materials.policeWhite);
    wall.position.set(0, 2, 0);
    wall.castShadow = true;
    group.add(wall);

    const roofGeo = new THREE.BoxGeometry(8.6, 0.8, 7.6);
    const roof = new THREE.Mesh(roofGeo, this.materials.usDarkRoof);
    roof.position.set(0, 4.2, 0);
    group.add(roof);

    // 里辦公處大門告示板
    const boardGeo = new THREE.BoxGeometry(2.4, 0.8, 0.2);
    const board = new THREE.Mesh(boardGeo, this.materials.mcDonaldsRed);
    board.position.set(0, 2.8, 3.6);
    group.add(board);
  }

  /**
   * 06 中油陽明山加油站
   */
  buildGasStation(group) {
    // 加油站大頂棚 (Canopy)
    const canopyGeo = new THREE.BoxGeometry(9, 0.6, 6);
    const canopy = new THREE.Mesh(canopyGeo, this.materials.policeBlue);
    canopy.position.set(0, 4.2, 0);
    canopy.castShadow = true;
    group.add(canopy);

    // 兩根大承重立柱
    const colGeo = new THREE.BoxGeometry(0.8, 4, 0.8);
    const col1 = new THREE.Mesh(colGeo, this.materials.policeWhite);
    col1.position.set(-2.5, 2, 0);
    group.add(col1);
    const col2 = new THREE.Mesh(colGeo, this.materials.policeWhite);
    col2.position.set(2.5, 2, 0);
    group.add(col2);

    // 加油機台
    const pumpGeo = new THREE.BoxGeometry(0.9, 1.6, 0.9);
    const pump1 = new THREE.Mesh(pumpGeo, this.materials.mcDonaldsRed);
    pump1.position.set(-2.5, 0.8, 1.2);
    group.add(pump1);
    const pump2 = new THREE.Mesh(pumpGeo, this.materials.sevenGreen);
    pump2.position.set(2.5, 0.8, 1.2);
    group.add(pump2);
  }

  /**
   * 美軍眷舍平房 (如白房子、豆留森林、亞尼克、想陽明山等)
   */
  buildUSMilitaryHouse(group, code) {
    const isWhite = (code === '08' || code === '16');
    const wallMat = isWhite ? this.materials.usWhiteWall : this.materials.usBrickWall;
    const roofMat = code === '07' ? this.materials.usDarkRoof : this.materials.usWoodRoof;

    // 平房主體
    const houseGeo = new THREE.BoxGeometry(8.5, 3.2, 6.5);
    const house = new THREE.Mesh(houseGeo, wallMat);
    house.position.set(0, 1.6, 0);
    house.castShadow = true;
    house.receiveShadow = true;
    group.add(house);

    // 斜屋頂 (三角雙坡斜頂)
    const roofGeo = new THREE.ConeGeometry(6.2, 2.2, 4);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 4.2, 0);
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1.1, 0.9, 1.3);
    roof.castShadow = true;
    group.add(roof);

    // 美軍宿舍標誌性「白色大煙囪」 (Chimney)
    const chimneyGeo = new THREE.BoxGeometry(1.1, 4.8, 1.1);
    const chimney = new THREE.Mesh(chimneyGeo, this.materials.usChimney);
    chimney.position.set(2.8, 2.8, -1.8);
    chimney.castShadow = true;
    group.add(chimney);

    // 前院白木柵欄
    const fenceGeo = new THREE.BoxGeometry(9, 0.7, 0.15);
    const fence = new THREE.Mesh(fenceGeo, this.materials.policeWhite);
    fence.position.set(0, 0.35, 4.2);
    group.add(fence);
  }

  /**
   * 文化大學大恩館/大孝館 (中式歇山頂/大禮堂風格)
   */
  buildPCCUHall(group) {
    const baseGeo = new THREE.BoxGeometry(10, 5.5, 8);
    const base = new THREE.Mesh(baseGeo, this.materials.policeWhite);
    base.position.set(0, 2.75, 0);
    base.castShadow = true;
    group.add(base);

    // 宮殿式綠色大屋頂
    const roofGeo = new THREE.BoxGeometry(11.2, 1.4, 9.2);
    const roof = new THREE.Mesh(roofGeo, this.materials.sevenGreen);
    roof.position.set(0, 6, 0);
    roof.castShadow = true;
    group.add(roof);
  }

  /**
   * 花卉試驗中心
   */
  buildFlowerCenter(group) {
    // 綠色拱門造景
    const archGeo = new THREE.BoxGeometry(6, 0.8, 1);
    const arch = new THREE.Mesh(archGeo, this.materials.sevenGreen);
    arch.position.set(0, 4, 0);
    group.add(arch);

    const postGeo = new THREE.BoxGeometry(0.8, 4, 0.8);
    const post1 = new THREE.Mesh(postGeo, this.materials.usWoodRoof);
    post1.position.set(-2.5, 2, 0);
    group.add(post1);
    const post2 = new THREE.Mesh(postGeo, this.materials.usWoodRoof);
    post2.position.set(2.5, 2, 0);
    group.add(post2);

    // 花壇
    const bedGeo = new THREE.BoxGeometry(8, 0.4, 4);
    const bed = new THREE.Mesh(bedGeo, this.materials.usBrickWall);
    bed.position.set(0, 0.2, 2.5);
    group.add(bed);
  }

  /**
   * 通用文史老屋
   */
  buildHistoricCottage(group, code) {
    const wallGeo = new THREE.BoxGeometry(7, 3, 5.5);
    const wall = new THREE.Mesh(wallGeo, this.materials.usWhiteWall);
    wall.position.set(0, 1.5, 0);
    wall.castShadow = true;
    group.add(wall);

    const roofGeo = new THREE.BoxGeometry(7.8, 0.8, 6.2);
    const roof = new THREE.Mesh(roofGeo, this.materials.usDarkRoof);
    roof.position.set(0, 3.3, 0);
    group.add(roof);
  }

  /**
   * 每個地標的光環與浮動引導晶石
   */
  createLandmarkMarker(x, z) {
    const markerGroup = new THREE.Group();
    markerGroup.position.set(x, 0, z);

    // 1. 地面光圈
    const ringGeo = new THREE.RingGeometry(2.2, 2.8, 32);
    const ring = new THREE.Mesh(ringGeo, this.materials.beaconRing.clone());
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.08;
    markerGroup.add(ring);

    // 2. 懸浮晶石 (Diamond Voxel)
    const gemGeo = new THREE.OctahedronGeometry(0.65, 0);
    const beacon = new THREE.Mesh(gemGeo, this.materials.beaconGem.clone());
    beacon.position.y = 5.2;
    beacon.castShadow = true;
    markerGroup.add(beacon);

    return { group: markerGroup, beacon: beacon, ring: ring };
  }

  update(delta, time) {
    // 讓所有地標的引導晶石緩慢旋轉並上下浮動
    this.landmarksWith3D.forEach((item, idx) => {
      if (item.beaconMesh) {
        item.beaconMesh.rotation.y += delta * 1.5;
        item.beaconMesh.position.y = 5.0 + Math.sin(time * 2.5 + idx) * 0.35;
      }
      if (item.ringMesh) {
        item.ringMesh.rotation.z += delta * 0.4;
      }
    });
  }
}


  // 5. 互動介面與圖鑑系統
  /**
 * 陽明里漫步 3D 方塊版 - 介面與互動系統模組 (VoxelUI.js)
 * 1:1 還原 5 張截圖中的：
 * 1. 頂部「陽明里漫步 3D 方塊版」與「圖鑑 X/30」
 * 2. 底部「👇 用手指點一下地面，小人就會走過去」
 * 3. 靠近時彈出的「🔍🔍 調查：[地標名稱]」與「🔍💬 找里長聊天」
 * 4. 奶白色地標故事卡彈窗 (收錄到圖鑑/關閉)
 * 5. 圖鑑列表彈窗 (進度條、分區展開、未到訪/已到訪✓)
 * 6. 右下角「📍 入口」傳送按鈕
 */

class VoxelUI {
  constructor(game) {
    this.game = game;
    this.visitedSet = new Set();
    this.currentNearbyLandmark = null;
    this.isNearChief = false;

    this.loadProgress();
    this.initDOM();
    this.bindEvents();
    this.updateAlbumStats();
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem('yangming_3d_visited');
      if (saved) {
        const arr = JSON.parse(saved);
        arr.forEach(id => this.visitedSet.add(id));
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
    // 建立 3D 方塊版專屬 UI 容器
    const container = document.createElement('div');
    container.id = 'voxel-ui-container';
    container.innerHTML = `
      <!-- 左上角遊戲標題 -->
      <div class="voxel-badge-title">
        <span class="brick-icon">🧱</span>
        <span class="title-text">陽明里漫步</span>
        <span class="sub-text">3D 方塊版</span>
      </div>

      <!-- 右上角圖鑑與視角按鈕群 -->
      <div class="voxel-album-top-group">
        <!-- 視角切換按鈕 -->
        <button id="btn-toggle-camera-view" class="voxel-btn-view" title="切換鏡頭視角 (按 V 鍵)">
          <span id="view-mode-icon" class="view-icon">📐</span>
          <span id="view-mode-name" class="view-label">斜視</span>
        </button>

        <div id="btn-album-circle" class="voxel-circle-stat" title="開啟圖鑑">
          <span class="stat-book-icon">📖</span>
          <span class="stat-title">圖鑑</span>
          <span id="album-counter" class="stat-count">${this.visitedSet.size}/30</span>
        </div>
        <button id="btn-open-album-card" class="voxel-btn-album">圖鑑</button>
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
        <span class="hand-icon">👇</span> 用手指點一下地面，小人就會走過去
      </div>

      <!-- 靠近互動大按鈕 (動態升起) -->
      <div id="voxel-interaction-dock" class="voxel-interaction-dock hidden">
        <button id="btn-trigger-action" class="voxel-action-btn">
          <span id="action-btn-icon" class="action-icon">🔍🔍</span>
          <span id="action-btn-text" class="action-text">調查：陽明山麥當勞</span>
        </button>
      </div>

      <!-- 地標故事卡彈窗 (還原截圖 2) -->
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
            <button id="btn-collect-landmark" class="voxel-btn-confirm">收錄到圖鑑</button>
            <button id="btn-close-story" class="voxel-btn-cancel">關閉</button>
          </div>
        </div>
      </div>

      <!-- 陽明里文史圖鑑彈窗 (還原截圖 1) -->
      <div id="modal-album" class="voxel-modal-backdrop hidden">
        <div class="voxel-album-card">
          <div class="voxel-album-header">
            <h2 class="voxel-album-title">📖 陽明里文史圖鑑</h2>
            <button id="btn-close-album" class="voxel-close-x">&times;</button>
          </div>
          
          <!-- 進度條 -->
          <div class="voxel-progress-bar-wrap">
            <div id="album-progress-bar" class="voxel-progress-bar" style="width: 0%;"></div>
          </div>
          <div id="album-progress-text" class="voxel-progress-text">已收錄 0 / 30 處地標</div>

          <!-- 分區列表容器 -->
          <div id="album-list-scroll" class="voxel-album-list-scroll">
            <!-- 動態注入分區與 30 處地標條目 -->
          </div>
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
            這座 3D 方塊世界收錄了全里 <strong>30 處精選核心地標</strong>！只要漫步走近建築物，點擊『調查』就能認識每處歷史故事並收錄進圖鑑。<br><br>
            快去探索吧，如果迷路了，隨時點擊右下角『📍 入口』我就在這裡等你！」
          </p>
          <div class="voxel-story-actions">
            <button id="btn-close-chief" class="voxel-btn-confirm">收到，出發探索！</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);
  }

  bindEvents() {
    // 視角切換按鈕
    document.getElementById('btn-toggle-camera-view').addEventListener('click', () => {
      this.triggerViewModeCycle();
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
      if (this.currentNearbyLandmark) {
        this.collectLandmark(this.currentNearbyLandmark);
      }
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

    // 鍵盤 E / 空白鍵快速互動
    window.addEventListener('keydown', (e) => {
      if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
        const dock = document.getElementById('voxel-interaction-dock');
        if (!dock.classList.contains('hidden')) {
          document.getElementById('btn-trigger-action').click();
        }
      }
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
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
    const modal = document.getElementById('modal-story');
    const tag = document.getElementById('story-tag');
    const title = document.getElementById('story-title');
    const desc = document.getElementById('story-desc');
    const imgWrap = document.getElementById('story-thumb-container');
    const img = document.getElementById('story-thumb-img');
    const btnCollect = document.getElementById('btn-collect-landmark');

    const cat = landmark.category || '文化巡禮';
    const dist = landmark.districtName || '山仔后生活核心';
    tag.innerText = `${cat}・${dist}`;
    title.innerText = `${landmark.code} ${landmark.name}`;
    desc.innerText = landmark.description;

    // 手繪插圖
    const iconPath = `assets/icons/site_${landmark.code}.png`;
    img.src = iconPath;
    img.onerror = () => { imgWrap.style.display = 'none'; };
    img.onload = () => { imgWrap.style.display = 'block'; };

    if (this.visitedSet.has(landmark.id)) {
      btnCollect.innerText = '✓ 已收錄到圖鑑';
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
    this.visitedSet.add(landmark.id);
    this.saveProgress();
    this.updateAlbumStats();

    const btnCollect = document.getElementById('btn-collect-landmark');
    btnCollect.innerText = '✓ 已成功收錄！';
    btnCollect.classList.add('collected');

    // 觸發音效或畫面光效
    setTimeout(() => {
      this.closeStoryModal();
    }, 400);
  }

  openChiefModal() {
    document.getElementById('modal-chief').classList.remove('hidden');
  }

  closeChiefModal() {
    document.getElementById('modal-chief').classList.add('hidden');
  }

  openAlbumModal() {
    this.renderAlbumList();
    document.getElementById('modal-album').classList.remove('hidden');
  }

  closeAlbumModal() {
    document.getElementById('modal-album').classList.add('hidden');
  }

  closeAllModals() {
    document.getElementById('modal-story').classList.add('hidden');
    document.getElementById('modal-album').classList.add('hidden');
    document.getElementById('modal-chief').classList.add('hidden');
  }

  updateAlbumStats() {
    const count = this.visitedSet.size;
    const total = 30;
    const pct = Math.round((count / total) * 100);

    const counter = document.getElementById('album-counter');
    if (counter) counter.innerText = `${count}/${total}`;

    const progBar = document.getElementById('album-progress-bar');
    if (progBar) progBar.style.width = `${pct}%`;

    const progText = document.getElementById('album-progress-text');
    if (progText) progText.innerText = `已收錄 ${count} / ${total} 處地標`;
  }

  renderAlbumList() {
    const listScroll = document.getElementById('album-list-scroll');
    if (!listScroll) return;

    listScroll.innerHTML = '';

    // 依分區分組
    const districts = [
      { key: 'central', title: '中央・山仔后生活核心' },
      { key: 'north', title: '北區・草山歷史官舍' },
      { key: 'east', title: '東區・美軍眷舍與文化聚落' },
      { key: 'west', title: '西區・文化大學學園' },
      { key: 'south', title: '南區・花卉試驗中心與愛富街區' }
    ];

    districts.forEach(dist => {
      const distLandmarks = LANDMARKS.filter(item => {
        if (dist.key === 'central') return item.district === 'central';
        if (dist.key === 'north') return item.district === 'north';
        if (dist.key === 'east') return item.district === 'east';
        if (dist.key === 'west') return item.district === 'west';
        if (dist.key === 'south') return item.district === 'south';
        return true;
      });

      if (distLandmarks.length === 0) return;

      const groupDiv = document.createElement('div');
      groupDiv.className = 'voxel-album-group';

      // 分區標題膠囊
      const titleDiv = document.createElement('div');
      titleDiv.className = 'voxel-album-dist-title';
      titleDiv.innerText = dist.title;
      groupDiv.appendChild(titleDiv);

      // 條目列表
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

        // 點擊項目時彈出詳細故事或快速前往
        itemRow.addEventListener('click', () => {
          this.closeAlbumModal();
          this.openStoryModal(item);
        });

        groupDiv.appendChild(itemRow);
      });

      listScroll.appendChild(groupDiv);
    });
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

    // 視角模式定義 (斜俯視 45°、沉浸平視、上空俯視)
    this.viewModes = [
      {
        id: 'iso',
        name: '45° 斜俯視',
        shortName: '斜視',
        icon: '📐',
        offset: new THREE.Vector3(0, 11, 13),
        lookAtOffsetY: 1.2
      },
      {
        id: 'eye',
        name: '沉浸平視',
        shortName: '平視',
        icon: '👀',
        offset: new THREE.Vector3(0, 2.5, 5.0),
        lookAtOffsetY: 1.6
      },
      {
        id: 'top',
        name: '上空俯視',
        shortName: '俯視',
        icon: '🦅',
        offset: new THREE.Vector3(0, 36, 4),
        lookAtOffsetY: 0
      }
    ];
    this.currentViewIndex = 0;
    this.targetOffset = this.viewModes[0].offset.clone();
    this.cameraOffset = this.targetOffset.clone();
    this.currentLookAtY = this.viewModes[0].lookAtOffsetY;
    this.cameraTarget = new THREE.Vector3();
    this.cameraYaw = 0; // 水平視角偏角

    this.initScene();
    this.initLights();
    this.initWorld();
    this.initControls();
    this.initRaycaster();

    // 初始鏡頭立刻精準對準主角小人
    this.cameraTarget.copy(this.player.group.position);
    this.camera.position.copy(this.cameraTarget).add(this.cameraOffset);
    this.camera.lookAt(this.cameraTarget.x, this.cameraTarget.y + this.currentLookAtY, this.cameraTarget.z);

    this.ui = new VoxelUI(this);

    // 啟動主迴圈
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initScene() {
    this.scene = new THREE.Scene();
    // 溫暖明亮的陽明山天藍色背景與遠景柔霧 (近處無霧干擾)
    this.scene.background = new THREE.Color(0xa7d8ff);
    this.scene.fog = new THREE.Fog(0xa7d8ff, 35, 120);

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
    // 柔和自然環境光 (避免過曝死白)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    this.scene.add(ambientLight);

    // 太陽斜射光
    this.sunLight = new THREE.DirectionalLight(0xfff8eb, 0.65);
    this.sunLight.position.set(30, 45, 25);
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
    this.terrain = new VoxelTerrain(this.scene);

    // 2. 30 處地標與特色體素建築 (麥當勞、派出所、7-11、美軍宿舍群等)
    this.buildings = new VoxelBuildings(this.scene);

    // 3. 玩家主角方塊小人 (青綠色上衣、深藍長褲，還原截圖 4)
    this.player = new VoxelCharacter({
      shirtColor: 0x2a9d8f,
      pantsColor: 0x264653,
      isNpc: false
    });
    // 起點位置：開闊草地前庭，視野通透 (如截圖 4 與 5)
    this.player.group.position.set(-8, 0, 15);
    this.scene.add(this.player.group);

    // 4. 里長 NPC (棕色外套、深色長褲，站在主角身邊歡迎玩家，還原截圖 5)
    this.chiefNpc = new VoxelCharacter({
      shirtColor: 0x6b4226,
      pantsColor: 0x333333,
      isNpc: true,
      name: '里長 黃裕倉'
    });
    this.chiefNpc.group.position.set(-5.5, 0, 14.2);
    this.chiefNpc.group.rotation.y = -Math.PI / 3;
    this.scene.add(this.chiefNpc.group);
  }

  initControls() {
    // 鍵盤移動監聽
    window.addEventListener('keydown', (e) => {
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
          this.ui.triggerViewModeCycle();
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

    // 拖曳旋轉視野 (滑鼠右鍵或手機單指橫向拖曳)
    let isDragging = false;
    let lastX = 0;

    const onPointerDown = (e) => {
      if (e.button === 2 || e.touches) {
        isDragging = true;
        lastX = e.clientX || (e.touches && e.touches[0].clientX);
      }
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const currentX = e.clientX || (e.touches && e.touches[0].clientX);
      const deltaX = currentX - lastX;
      lastX = currentX;
      this.cameraYaw -= deltaX * 0.006;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    this.canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  initRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const planeHit = new THREE.Vector3();

    // 點擊地面移動 (Tap to move - 還原提示「用手指點一下地面，小人就會走過去」)
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerStartTime = 0;

    const handlePointerTap = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);

      let hitX = null;
      let hitZ = null;

      // 1. 透過 y=0 地面數學平面相交 (覆蓋整座大地，保證 100% 瞬時精準響應)
      if (this.raycaster.ray.intersectPlane(groundPlane, planeHit)) {
        hitX = THREE.MathUtils.clamp(planeHit.x, -135, 135);
        hitZ = THREE.MathUtils.clamp(planeHit.z, -135, 135);
      } else {
        // 2. Mesh 保底相交
        const intersects = this.raycaster.intersectObjects(this.terrain.clickableObjects, true);
        if (intersects.length > 0) {
          hitX = intersects[0].point.x;
          hitZ = intersects[0].point.z;
        }
      }

      if (hitX !== null && hitZ !== null) {
        // 小人平滑轉向並走向目標位置
        this.player.moveTo(hitX, hitZ);
        // 地面擴散青綠色光圈漣漪
        this.terrain.spawnRipple(hitX, hitZ);
      }
    };

    // 監聽 PointerDown 記錄起始座標
    window.addEventListener('pointerdown', (e) => {
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      pointerStartTime = Date.now();
    });

    // 監聽 PointerUp 判斷輕點尋路
    window.addEventListener('pointerup', (e) => {
      // 若點擊到 UI 按鈕或卡片元件，不觸發尋路
      if (e.target && e.target.closest('button, .voxel-action-btn, .voxel-story-card, .voxel-album-card, .voxel-circle-stat, .voxel-btn-view, .voxel-badge-title')) {
        return;
      }

      // 滑鼠左鍵 (button 0) 或觸控才觸發移動 (右鍵 button 2 用於旋轉鏡頭)
      if (e.pointerType === 'mouse' && e.button !== 0) {
        return;
      }

      const dx = e.clientX - pointerStartX;
      const dy = e.clientY - pointerStartY;
      const dist = Math.hypot(dx, dy);
      const duration = Date.now() - pointerStartTime;

      // 位移小於 12px 且時間在 600ms 內，視為點擊地面漫步
      if (dist < 12 && duration < 600) {
        handlePointerTap(e.clientX, e.clientY);
      }
    });

    // 支援標準 click 事件保底
    this.canvas.addEventListener('click', (e) => {
      if (e.button === 0) {
        handlePointerTap(e.clientX, e.clientY);
      }
    });
  }

  teleportToEntrance() {
    // 快速傳送回起點入口
    this.player.stop();
    this.player.group.position.set(-8, 0, 15);
    this.player.group.rotation.y = 0;
    this.cameraYaw = 0;
    this.terrain.spawnRipple(-8, 15);
  }

  teleportToLandmark(landmark) {
    const item = this.buildings.landmarksWith3D.find(l => l.data.id === landmark.id);
    if (item) {
      this.player.stop();
      this.player.group.position.set(item.worldX, 0, item.worldZ + 4);
      this.player.group.rotation.y = Math.PI;
      this.terrain.spawnRipple(item.worldX, item.worldZ + 4);
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
    this.targetOffset.copy(currentMode.offset);
    return currentMode;
  }

  getCurrentViewMode() {
    return this.viewModes[this.currentViewIndex];
  }

  updateCamera() {
    // 平滑鏡頭越肩跟隨主角
    const playerPos = this.player.group.position;
    this.cameraTarget.lerp(playerPos, 0.08);

    // 平滑過渡視角 Offset 與 LookAt 高度
    const curMode = this.viewModes[this.currentViewIndex];
    this.cameraOffset.lerp(this.targetOffset, 0.08);
    this.currentLookAtY = THREE.MathUtils.lerp(this.currentLookAtY, curMode.lookAtOffsetY, 0.08);

    // 根據視角偏角計算鏡頭 offset
    const rotatedOffset = this.cameraOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);
    const targetCameraPos = this.cameraTarget.clone().add(rotatedOffset);

    this.camera.position.lerp(targetCameraPos, 0.08);
    this.camera.lookAt(this.cameraTarget.x, this.cameraTarget.y + this.currentLookAtY, this.cameraTarget.z);

    // 讓陽光平行跟隨主角，保證陰影精緻細膩
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
    this.handleKeyboardMove(delta);

    // 角色動畫更新
    this.player.update(delta);
    this.chiefNpc.update(delta);

    // 地景與建築更新 (漣漪淡出、引導晶石浮動)
    this.terrain.update(delta);
    this.buildings.update(delta, time);

    // 距離感測
    this.updateProximity();

    // 鏡頭跟隨
    this.updateCamera();

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
