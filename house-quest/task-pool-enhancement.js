(function () {
  "use strict";

  var USERS_KEY = "hq-users";
  var TASKS_KEY = "hq-tasks";
  var CURRENT_USER_KEY = "hq-current-user";
  var CONTAINER_ID = "hq-task-pool-panel";

  function safeJsonParse(raw, fallback) {
    try {
      return raw ? JSON.parse(raw) : fallback;
    } catch (_err) {
      return fallback;
    }
  }

  function getUsers() {
    return safeJsonParse(localStorage.getItem(USERS_KEY), []);
  }

  function getTasks() {
    return safeJsonParse(localStorage.getItem(TASKS_KEY), []);
  }

  function getCurrentUserId() {
    return localStorage.getItem(CURRENT_USER_KEY) || "";
  }

  function getUserName(users, id) {
    var user = users.find(function (u) {
      return u.id === id;
    });
    return user ? user.name : "未指派";
  }

  function normalizeTasks(tasks) {
    var users = getUsers();
    var currentUser = getCurrentUserId();
    var fallbackUserId = users[0] ? users[0].id : currentUser;

    var nextTasks = tasks.map(function (task) {
      var creatorId = task.creatorId || task.ownerId || fallbackUserId || "";
      var assigneeId = task.assigneeId || task.ownerId || "";
      return {
        ...task,
        creatorId: creatorId,
        assigneeId: assigneeId,
        // 与旧逻辑兼容：ownerId 始终映射当前跟进人
        ownerId: assigneeId,
      };
    });

    localStorage.setItem(TASKS_KEY, JSON.stringify(nextTasks));
    return nextTasks;
  }

  function saveTasks(tasks) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }

  function setAssignee(taskId, assigneeId) {
    var tasks = getTasks();
    var next = tasks.map(function (task) {
      if (task.id !== taskId) return task;
      var creatorId = task.creatorId || task.ownerId || "";
      return {
        ...task,
        creatorId: creatorId,
        assigneeId: assigneeId,
        ownerId: assigneeId,
      };
    });
    saveTasks(next);
    renderTaskPool();
  }

  function setStatus(taskId, status) {
    var tasks = getTasks();
    var next = tasks.map(function (task) {
      if (task.id !== taskId) return task;
      return {
        ...task,
        status: status,
      };
    });
    saveTasks(next);
    renderTaskPool();
  }

  function buildStats(tasks) {
    var stats = { todo: 0, "in-progress": 0, completed: 0 };
    tasks.forEach(function (task) {
      var state = task.status || "todo";
      if (stats[state] === undefined) stats[state] = 0;
      stats[state] += 1;
    });
    return stats;
  }

  function statusLabel(status) {
    if (status === "completed") return "已完成";
    if (status === "in-progress") return "进行中";
    return "待办";
  }

  function createTaskItem(task, users, currentUserId) {
    var item = document.createElement("div");
    item.className = "hq-pool-item";

    var top = document.createElement("div");
    top.className = "hq-pool-item-top";

    var title = document.createElement("div");
    title.className = "hq-pool-item-title";
    title.textContent = task.title || "未命名任务";

    var meta = document.createElement("div");
    meta.className = "hq-pool-item-meta";
    meta.textContent = "状态：" + statusLabel(task.status) + " · 创建人：" + getUserName(users, task.creatorId) + " · 跟进人：" + getUserName(users, task.assigneeId);

    top.appendChild(title);
    item.appendChild(top);
    item.appendChild(meta);

    var actions = document.createElement("div");
    actions.className = "hq-pool-actions";

    var claimBtn = document.createElement("button");
    claimBtn.type = "button";
    claimBtn.className = "hq-pool-btn";
    claimBtn.textContent = "由我跟进";
    claimBtn.addEventListener("click", function () {
      setAssignee(task.id, currentUserId);
    });
    actions.appendChild(claimBtn);

    var select = document.createElement("select");
    select.className = "hq-pool-select";
    users.forEach(function (u) {
      var option = document.createElement("option");
      option.value = u.id;
      option.textContent = "由" + (u.name || u.id) + "跟进";
      if ((task.assigneeId || "") === u.id) option.selected = true;
      select.appendChild(option);
    });
    actions.appendChild(select);

    var assignBtn = document.createElement("button");
    assignBtn.type = "button";
    assignBtn.className = "hq-pool-btn";
    assignBtn.textContent = "指派";
    assignBtn.addEventListener("click", function () {
      setAssignee(task.id, select.value);
    });
    actions.appendChild(assignBtn);

    var progressBtn = document.createElement("button");
    progressBtn.type = "button";
    progressBtn.className = "hq-pool-btn";
    progressBtn.textContent = "标记进行中";
    progressBtn.addEventListener("click", function () {
      setStatus(task.id, "in-progress");
    });
    actions.appendChild(progressBtn);

    var doneBtn = document.createElement("button");
    doneBtn.type = "button";
    doneBtn.className = "hq-pool-btn";
    doneBtn.textContent = "标记完成";
    doneBtn.addEventListener("click", function () {
      setStatus(task.id, "completed");
    });
    actions.appendChild(doneBtn);

    item.appendChild(actions);
    return item;
  }

  function renderTaskPool() {
    var root = document.getElementById("root");
    if (!root) return;

    var users = getUsers();
    var currentUserId = getCurrentUserId();
    var tasks = normalizeTasks(getTasks());
    var stats = buildStats(tasks);

    var container = document.getElementById(CONTAINER_ID);
    if (!container) {
      container = document.createElement("section");
      container.id = CONTAINER_ID;
      container.className = "hq-pool-card";
      root.appendChild(container);
    }

    container.innerHTML = "";

    var header = document.createElement("div");
    header.className = "hq-pool-header";

    var left = document.createElement("div");
    left.innerHTML = [
      '<h3 class="hq-pool-title">公共任务资源池</h3>',
      '<p class="hq-pool-subtitle">全员可见 · 自由认领 · 任意指派</p>',
    ].join("");
    header.appendChild(left);

    var statWrap = document.createElement("div");
    statWrap.className = "hq-pool-stats";
    statWrap.innerHTML = [
      '<span class="hq-pool-chip">总数 ' + tasks.length + "</span>",
      '<span class="hq-pool-chip">待办 ' + (stats.todo || 0) + "</span>",
      '<span class="hq-pool-chip">进行中 ' + (stats["in-progress"] || 0) + "</span>",
      '<span class="hq-pool-chip">已完成 ' + (stats.completed || 0) + "</span>",
    ].join("");
    header.appendChild(statWrap);

    container.appendChild(header);

    var list = document.createElement("div");
    list.className = "hq-pool-list";

    if (!tasks.length) {
      var empty = document.createElement("div");
      empty.className = "hq-pool-empty";
      empty.textContent = "任务池当前为空，先添加任务后即可全员认领与协作。";
      list.appendChild(empty);
    } else {
      tasks.forEach(function (task) {
        list.appendChild(createTaskItem(task, users, currentUserId));
      });
    }

    container.appendChild(list);
  }

  function init() {
    var root = document.getElementById("root");
    if (!root) return;

    renderTaskPool();

    var observer = new MutationObserver(function () {
      renderTaskPool();
    });
    observer.observe(root, { childList: true, subtree: true });

    window.addEventListener("storage", renderTaskPool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
