// 每 20 秒執行一次
chrome.alarms.create("checkBahamut", { periodInMinutes: 20 / 60 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "checkBahamut") {
    await checkBahamutNotifications();
  }
});

// 檢查巴哈姆特通知
async function checkBahamutNotifications() {
  try {
    console.log("[巴哈通知] 開始獲取通知...");

    // 向巴哈姆特 API 發送請求
    let response = await fetch(
      "https://api.gamer.com.tw/ajax/common/topBar.php?type=light_0"
    );
    let text = await response.text();

    console.log("[巴哈通知] API 回應成功，開始解析通知數量...");

    // 解析 HTML 內的通知數量
    let newCount = (text.match(/<span class="link">[^<]+<\/span>/g) || [])
      .length;
    console.log(`[巴哈通知] 目前通知數量: ${newCount}`);

    // 讀取上次通知數量
    chrome.storage.local.get(["bahamutLastCount"], (result) => {
      let lastCount = result.bahamutLastCount || 0;

      // 如果新通知數量增加，則發送通知
      if (newCount > lastCount) {
        sendNotification(newCount);
      }

      // 更新儲存的通知數量
      chrome.storage.local.set({ bahamutLastCount: newCount });
    });
  } catch (error) {
    console.error("[巴哈通知] 獲取通知失敗:", error);
  }
}

// 發送桌面通知
function sendNotification(newCount) {
  let notificationId = "bahamutNotification";

  chrome.notifications.create(notificationId, {
    type: "basic",
    iconUrl: "icon.png",
    title: "巴哈姆特通知",
    message: `你有 ${newCount} 則新通知，點擊查看！`,
  });

  // 確保 `onClicked` 監聽器只添加一次
  if (!chrome.notifications.onClicked.hasListener(handleNotificationClick)) {
    chrome.notifications.onClicked.addListener(handleNotificationClick);
  }
}

// 點擊通知後開啟巴哈討論區
function handleNotificationClick(notificationId) {
  if (notificationId === "bahamutNotification") {
    chrome.tabs.create({ url: "https://forum.gamer.com.tw/B.php?bsn=74934" });
  }
}
