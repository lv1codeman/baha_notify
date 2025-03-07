document.getElementById("check").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "manualCheck" });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "notify") {
    alert("你有新通知！");
  }
});
