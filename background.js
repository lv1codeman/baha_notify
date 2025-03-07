// 每 1 分鐘執行一次
// chrome.alarms.create("checkBahamut", { periodInMinutes: 1 });

// 每20秒執行一次
chrome.alarms.create("checkBahamut", { periodInMinutes: 20 / 60 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "checkBahamut") {
    await checkBahamutNotifications();
  }
});

// 檢查巴哈姆特通知
async function checkBahamutNotifications() {
  try {
    console.log("開始獲取巴哈通知...");
    // 向巴哈姆特 API 發送請求
    let response = await fetch(
      "https://api.gamer.com.tw/ajax/common/topBar.php?type=light_0"
    );
    console.log("已獲取巴哈通知...");
    // 解析返回的 HTML
    let text = await response.text();
    console.log("text...", text);
    // 解析 HTML 中的通知數量
    let newCount = (text.match(/<span class="link">[^<]+<\/span>/g) || [])
      .length;

    console.log("newCount...", newCount);
    // 讀取上次通知數量
    chrome.storage.local.get(["bahamutLastCount"], (result) => {
      let lastCount = result.bahamutLastCount || 0;

      // 如果新的通知數量大於之前的通知數量，則發送通知
      if (newCount > lastCount) {
        sendNotification("巴哈姆特通知", `你有 ${newCount} 則新通知！`);
      }
      //   sendNotification("巴哈姆特通知", `你有 ${newCount} 則新通知！`);

      // 更新通知數量
      chrome.storage.local.set({ bahamutLastCount: newCount });
    });
  } catch (error) {
    console.error("獲取巴哈通知失敗:", error);
  }
}

// 發送桌面通知
function sendNotification(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon.png",
    title: title,
    message: message,
  });
}
