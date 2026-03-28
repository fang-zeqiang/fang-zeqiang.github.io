(function () {
  "use strict";

  function updateMindfulButtonColor() {
    var buttons = document.querySelectorAll("button");
    buttons.forEach(function (button) {
      var text = (button.textContent || "").replace(/\s+/g, "");
      if (text.includes("正念")) {
        button.style.color = "#000000";
      }
    });
  }

  var root = document.getElementById("root");
  if (!root) return;

  var observer = new MutationObserver(updateMindfulButtonColor);
  observer.observe(root, { childList: true, subtree: true });

  updateMindfulButtonColor();
})();
