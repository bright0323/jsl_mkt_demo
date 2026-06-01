# 星河帝寶 iPad Demo App 架構說明

本文件提供給後續工程師參考，用於在 iOS 平台復刻目前的智慧建案行銷 Demo。現有版本是一個靜態 Web App，以 iPad 4:3 展示為主要情境，重點不是一般網站瀏覽，而是銷售現場使用的互動式平板展示。

## 1. 專案定位

這個 App 是「星河帝寶」智慧住宅的銷售展示工具。

使用情境：

- 銷售人員在 iPad 上展示建案智慧科技亮點。
- 首頁作為五大主題入口。
- 每個主題頁以 tab 切換不同智慧項目。
- 每個項目包含一個展示區與一個行銷文案說明區。
- 部分項目有補充說明彈窗，供銷售或顧客進一步理解。

主要展示比例：

- 以 iPad 橫式 4:3 為核心。
- 現有 Web App 以固定舞台感設計，不是一般響應式網站。
- iOS 版建議以橫式 iPad 為主體驗，其他比例可做等比縮放或 letterbox 處理。

## 2. 目前檔案結構

主要頁面：

- `index.html`：首頁，五大主題入口。
- `safety.html`：安全主題。
- `efficiency.html`：效率主題。
- `energy.html`：節能主題。
- `happiness.html`：幸福主題。
- `health.html`：健康主題，目前只有總覽。

共用樣式與互動：

- `styles.css`：首頁主視覺與主題入口樣式。
- `safety.css`：所有主題頁共用框架與細部 UI 樣式。雖然命名為 safety，但實際已是 detail page 共用樣式。
- `safety.js`：所有主題頁共用互動邏輯。

素材：

- `星河帝寶夜景0325_0.jpg`：首頁建案夜景主視覺。
- `住戶安全.mp4`：安全主題影片。
- `住戶安全-poster.jpg`：安全影片封面。
- `能源效率.mp4`：目前多個總覽或暫用影片。
- `escape.png`：消防/地震逃生平面圖。
- `car.svg`：充電樁畫面車輛線稿。
- `plant-twin.png.png`：數位雙生澆灌植栽模型圖。

注意：

- `住戶安全.mp4` 與 `能源效率.mp4` 檔案較大。iOS 版如需上架或離線使用，建議改成 App Bundle 資源或串流 CDN。
- `plant-twin.png.png` 目前檔名有雙副檔名。若 iOS 重建，建議改成清楚命名，例如 `plant_twin.png`。

## 3. 導航與頁面模型

首頁有五個主題入口：

1. 安全：`safety.html`
2. 效率：`efficiency.html`
3. 節能：`energy.html`
4. 幸福：`happiness.html`
5. 健康：`health.html`

iOS 版建議資料模型如下：

```swift
struct Theme {
    let id: String
    let title: String
    let subtitle: String
    let route: ThemeRoute
    let items: [SmartItem]
}

struct SmartItem {
    let id: String
    let tabTitle: String
    let title: String
    let tagline: String
    let description: String
    let highlights: [Highlight]
    let infoModal: InfoModal?
    let demo: DemoContent
}

enum DemoContent {
    case overviewVideo(VideoAsset)
    case video(VideoAsset)
    case tablet(TabletDemo)
    case phone(PhoneDemo)
    case slides([ImageAsset])
}
```

目前 Web 版的 tab 行為：

- `.item-tab[data-item="xxx"]` 對應 `.smart-item[data-panel="xxx"]`。
- 點擊 tab 時，切換 `is-active` class。
- 每個主題頁都使用同一套邏輯。
- tab 欄位依項目數均分，不留空白。

iOS 版建議：

- 用 `selectedItemId` 控制目前項目。
- tab bar 依 `items.count` 等分。
- 切換時只替換內容，不要推入新頁面。
- 若支援深連結，可模擬 hash，例如開啟 `theme=energy&item=irrigation`。

## 4. 主題頁版型規則

主題頁共同架構：

1. 背景層：深色建案夜景、科技粒子、低調網格。
2. 工作區：主內容容器。
3. 上方 tab bar。
4. 內容區：展示區 + 文字說明區。
5. 左下返回鍵。
6. 影片彈窗與補充說明彈窗。

版型比例：

- 智慧項目內容通常為左右分欄。
- 展示區約佔 2/3。
- 文字說明區約佔 1/3。
- 文字太長時，文字區可垂直捲動。

總覽頁規則：

- 總覽使用影片 + 行銷文案。
- 總覽不需要跟其他項目完全相同，但要保持同一主題頁框架。
- 總覽文案只保留主題名稱、主標語、簡要說明，不要塞太多內容。

返回鍵：

- 固定於左下角。
- 不應壓到展示框內容。
- iOS 版建議固定於安全區內的左下角。

## 5. Demo Content 類型

目前設計中，展示區主要分三種固定型態。

### 5.1 16:9 影片

用途：

- 總覽影片。
- 無鑰通行、Keyless 門禁等情境影片。

Web 版：

- 使用 `.feature-video` button 包住 `<video>`。
- 點擊後開啟 `.video-modal`，將影片 src 設為 `data-open-video`。
- 關閉時暫停、移除 src、load 重置。

iOS 版：

- 使用 AVPlayer 或 SwiftUI `VideoPlayer`。
- 點擊展示區後進入全螢幕播放。
- 播放結束或關閉後返回原 tab。

### 5.2 平板 Mockup

用途：

- AI 智慧維養
- 雲端對講機
- BEMS 建築節能
- 充電樁能源管理
- 數位雙生澆灌
- Lisa 智慧助理
- 幸福主題後續頁面

規則：

- 外框比例要固定一致。
- 平板內部內容可以垂直捲動。
- 平板內 UI 可依功能不同改版，但視覺語言需一致。
- 不同主題下平板 UI 可以有不同資訊架構，但不能像不同 App 拼貼。

視覺原則：

- 深色高級儀表板。
- 低飽和青綠、霧金、灰藍作重點色。
- 數字字重不可太粗。
- 圖表線條要細緻，避免粗線造成廉價感。
- 圖表必須有清楚語意：哪條線、哪個柱狀、哪個 icon 代表什麼。

### 5.3 手機 Mockup

用途：

- 消防安全指示
- 地震預警連動

規則：

- 所有手機 mockup 必須維持同一比例、大小、位置。
- 只有手機內部畫面內容變化。
- 手機內部可以垂直捲動。
- 不要每一頁各自調整手機大小，會破壞整體精緻度。

## 6. 共用互動邏輯

目前 `safety.js` 負責所有主題頁互動。

### 6.1 Tab 切換

核心邏輯：

```js
function selectItem(item) {
  tabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.item === item);
  });

  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === item);
  });
}
```

iOS 對應：

- `selectedItemId` 為單一狀態來源。
- tab selected state 與內容顯示都由同一狀態控制。

### 6.2 影片彈窗

Web 版：

- 點擊 `[data-open-video]`。
- 開啟 `.video-modal`。
- 設定 video src 並播放。
- 點擊遮罩或關閉按鈕關閉。
- Escape 可關閉。

iOS 對應：

- 影片展示區 tap 後 present full screen player。
- 關閉時停止播放。

### 6.3 補充說明彈窗

Web 版：

- `button.info-trigger` 使用：
  - `data-info-title`
  - `data-info-copy`
- 點擊後填入 modal title/copy。

iOS 對應：

- 每個 `SmartItem` 可有 `InfoModal`。
- 點擊項目標題旁的 `i` icon 後，以 modal/sheet 顯示。
- 不要出現「銷售現場說法」等字眼，補充說明要像使用者可閱讀的正式內容。

## 7. 已完成主題內容摘要

### 7.1 安全

項目：

- 安全總覽
- AI 智慧維養：平板
- Keyless 門禁：影片
- 消防安全指示：手機
- 地震預警連動：手機
- 雲端對講機：平板

特別規則：

- 消防與地震手機位置、比例要完全一致。
- 消防/地震使用 `escape.png` 作為樓層逃生圖。
- 警示卡片有慢速呼吸閃爍，但不可刺眼。

### 7.2 效率

項目：

- 效率總覽
- 無鑰通行
- 配送機器人
- 智取櫃服務
- 智慧訪客體驗

目前效率項目多為影片 + 文案框架，影片暫用 `能源效率.mp4`。

### 7.3 節能

項目：

- 節能總覽
- BEMS 建築節能
- 充電樁能源管理
- 數位雙生澆灌

已移除：

- 智慧節能電梯

BEMS 注意事項：

- 顯示中控室式能源管理 UI。
- 圖表中目前用電為實線，AI 預測為虛線。
- 契約容量上限不能被目前用電超過；AI 預測可接近或超過，用於說明卸載排程。
- 圖表線條要細，不要粗。
- 節能成效需以住戶能理解的換算方式呈現。

充電樁注意事項：

- 使用 `car.svg` 作為車輛主視覺，不要手畫變形車。
- 車輛區與右側資訊欄不可重疊。
- 背景可有綠色充電呼吸光，但不要有多餘黃光或圓點。
- 澆水量等用水相關圖表已統一偏藍色；充電則可使用青綠色。

數位雙生澆灌注意事項：

- 目前使用 `plant-twin.png.png` 作為植栽雙生模型圖。
- UI 聚焦單一區域「中庭樹島」，不要做整個社區大地圖。
- 圖表語意：
  - 藍色長條：澆水量
  - 金色細線：氣溫曲線
  - 天氣狀態：用 icon 呈現，不用再加文字標籤
- 「蒸散量：偏高」為警示資訊，使用黃色。

### 7.4 幸福

項目：

- 幸福總覽
- Lisa 智慧助理
- 公設預約
- 社區公告
- 郵件包裹

幸福主題平板規則：

- 後續平板內容都朝「嵌入網頁」形式設計。
- 不是中控室後台，而是住戶服務入口。
- Lisa 智慧助理為第二個 tab，使用平板 mockup。

### 7.5 健康

目前只有：

- 健康總覽

後續可沿用相同主題頁框架擴充。

## 8. 設計與文案原則

### 8.1 文案原則

所有文案都以住戶視角溝通。

重要原則：

- 優先使用「您」而不是「住戶」。
- 不要寫成工程功能清單。
- 每個功能都要轉成住戶能感受到的價值。
- 主標語要短、有記憶點。
- 亮點標題要精煉有力，通常 2 到 8 字。
- 補充說明可以稍長，但要像正式說明，不像銷售小抄。

### 8.2 視覺原則

整體風格：

- 高雅
- 質感
- 科技
- 深色背景
- 低飽和光感
- 不使用廉價亮色

避免：

- 過度 neon
- 粗線圖表
- 一堆卡片堆疊
- 顏色太 low
- UI 像一般管理後台
- 圖片與 UI 風格不一致
- 平板/手機 mockup 每頁尺寸不同

### 8.3 圖表原則

- 線條要細緻。
- 數據字重不要太粗。
- 圖例必須清楚。
- 長條、曲線、icon 的意義要一眼可理解。
- 不要裝飾性圖表，圖表必須能說明功能價值。

## 9. iOS 復刻建議

### 9.1 技術架構

建議用 SwiftUI 實作：

- `HomeView`
- `ThemeDetailView`
- `ThemeTabBar`
- `SmartItemView`
- `VideoDemoView`
- `TabletMockupView`
- `PhoneMockupView`
- `InfoModalView`
- `FullscreenVideoPlayer`

資料可先以本地 JSON 或 Swift static model 建立，避免把文案硬寫在 view 裡。

### 9.2 Layout 建議

核心外框：

- 使用 `GeometryReader` 取得可用區域。
- 以 4:3 計算主要 stage。
- stage 置中，必要時 letterbox。
- 所有內容基於 stage 比例定位，不要直接依不同 iPad 尺寸亂縮放字體。

主題頁：

- tab bar 高度固定。
- tab 等寬分配。
- content area 固定分為 demo/copy。
- demo/copy 中內容可獨立 scroll。

### 9.3 素材處理

圖片：

- 背景夜景圖可壓縮成多解析度資源。
- `plant-twin.png.png` 建議改名並壓縮。
- `car.svg` 可直接轉成 PDF vector asset 或用 SVGKit / WebView / 自行轉 path。

影片：

- 大影片建議不要直接塞進記憶體。
- iOS Bundle 內影片可使用 AVPlayer。
- 若要線上更新，建議使用 CDN 並做好 preload/loading state。

### 9.4 WebView 選項

如果目標是「最快做出一模一樣」，可直接包 WebView。

如果目標是「原生 iOS 長期維護」，建議用 SwiftUI 重建。

折衷方案：

- 首頁與主題框架用 SwiftUI。
- 複雜平板內 UI 可短期用本地 HTML WebView。
- 等規格穩定後再逐步原生化。

## 10. 目前需注意的技術債

1. `safety.css` 已承載所有主題頁樣式，命名不再準確。
   - iOS 重建時應整理為 shared theme detail styles。

2. `safety.js` 未處理 URL hash 初始化。
   - 目前 `#lisa` 或 `#irrigation` 主要作為連結提示，Web 版未真正讀 hash 自動切 tab。
   - iOS 版建議支援初始 item id。

3. 素材命名需整理。
   - `plant-twin.png.png` 建議改名。
   - 中文檔名影片在部分平台需注意 encoding 與資源引用。

4. 影片暫用素材需替換。
   - 多個功能頁目前仍使用 `能源效率.mp4` 作為暫用影片。

5. 幸福主題尚未完成逐項文案討論。
   - Lisa 已新增框架，但後續文案仍可能調整。

6. 健康主題尚未展開。

## 11. 復刻時最重要的驗收標準

- iPad 橫式第一眼要像高級建案展示工具，不像一般網頁。
- 首頁五大主題入口要清楚、穩定、可觸控。
- 主題頁 tab 切換不可跳動。
- 手機/平板 mockup 尺寸要一致。
- 展示區不能被返回鍵或文字壓到。
- 圖表線條、卡片間距、文字層級要細緻。
- 補充說明 modal 不要像銷售小抄。
- 所有功能語言都要以住戶感受為中心。

