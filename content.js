// 監聽來自 background.js 的訊息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchBahamutNotifications") {
    fetchBahamutNotifications(sendResponse);
    return true; // 必須回傳 true 以保持通訊開啟
  }
});

// 透過網頁環境的 `fetch` 來繞過 CORS 限制
function fetchBahamutNotifications(callback) {
  fetch("https://api.gamer.com.tw/ajax/common/topBar.php?type=light_0", {
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => callback({ success: true, data }))
    .catch((error) => callback({ success: false, error: error.message }));
}
