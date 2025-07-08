#REF
tauri sql: https://v2.tauri.app/zh-cn/plugin/sql/
react: https://react.dev/learn
sql: https://hackmd.io/@HongLing1013/ryKuyFOv9
html ul li: https://steam.oxxostudio.tw/category/html/tags/ul-li.html

#log
---
##1
參考https://v2.tauri.app/zh-cn/plugin/sql/ 實作todo list的sql ,在builder的部分卡了一段時間，後來發現lib.rs那邊就有寫了(應該是加入插件的時候就自動更改了)，應該是因為我一開始找到的是tauri1的教學

第一次跟者官方文件實作 還滿有趣的 之前都是直接找教學影片或問AI ，一步步實作雖然比較花時間但也讓我覺得滿新鮮的

我用rust完成了todo sql的function 但我用的是tauri 1.0的方法 難怪我一直對不上官方教學 我會在下一個session更正

!:我使用了AI來確認我是否應該加入某些程式以及提供修正建議，但我沒有使用AI生成程式碼
---
##2
status先完成 0 1的部分 2之後再加
const database = await Database.load('sqlite:lifehacker.db'); 這行出現問題 dattabase沒有被正常載入
=>找到本地的.db 確認todos有被建立成功
=>刪掉本地的 lifehacker.db後再重新執行就正常運作了!!! AI說可能是本地檔案已經損壞 (在這邊卡了很久 :( 
---
##3
元件開頭要大寫
簡單畫了一下UI(UI.jpg)
calendar使用"FullCalendar" https://fullcalendar.io/docs/react
不知道為什麼"FullCalendar"不能占滿整個div
=>不能用inline-flex 要用inline-block 
跟者官方範例加入日曆跟事件功能
---
##4
把calendar events用sql存
=>好像沒這個必要，用JSON存比較方便
=>用SQL存之後加功能比較方便 所以還是用SQL吧
看不太懂官方文件 用AI幫我整理資料 並提供範例程式
變更檔案結構
---
##5
events有bug 拖動事件後移動事件的話原本被拖動的事件會跑回原本的位置
=>新增handleEventDrag
=>updateEvents時資料庫沒有更新
=>修正sql語法 但問題還是在 而且現在拖動後不能放下了
=>info沒加.event

使用font awesome icon 做header [text](https://fontawesome.com/license/free)
修正margin 
---
##6
修正todo list input的CSS
新增pain point
複數tagx,possible solutions需要一對多 多對多SQL 之後有需要再加
調整UI(字型、排版)