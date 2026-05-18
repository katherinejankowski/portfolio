(function () {
  "use strict";

  const tabs = Array.from(document.querySelectorAll(".sidebar-tab"));
  const panels = tabs.map(function (tab) {
    const id = tab.getAttribute("aria-controls");
    return id ? document.getElementById(id) : null;
  });

  function selectTab(index, options) {
    options = options || {};
    tabs.forEach(function (tab, i) {
      const selected = i === index;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
      const panel = panels[i];
      if (panel) {
        panel.hidden = !selected;
        panel.classList.toggle("is-hidden", !selected);
      }
    });
    if (options.focus !== false) {
      tabs[index].focus();
    }
  }

  function tabIndexFromHash() {
    const raw = location.hash.replace(/^#/, "").toLowerCase();
    const names = ["home", "projects", "classes", "matlab"];
    const idx = names.indexOf(raw);
    return idx >= 0 ? idx : 0;
  }

  function isReload() {
    const entry = performance.getEntriesByType("navigation")[0];
    if (entry && entry.type === "reload") {
      return true;
    }
    if (
      typeof performance.navigation !== "undefined" &&
      performance.navigation.type === performance.navigation.TYPE_RELOAD
    ) {
      return true;
    }
    return false;
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      selectTab(index);
    });

    tab.addEventListener("keydown", function (e) {
      let next = index;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        next = (index + 1) % tabs.length;
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        next = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        next = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        next = tabs.length - 1;
      } else {
        return;
      }
      selectTab(next);
    });
  });

  if (isReload()) {
    selectTab(0, { focus: false });
    if (location.hash) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  } else {
    selectTab(tabIndexFromHash(), { focus: false });
  }

  window.addEventListener("hashchange", function () {
    selectTab(tabIndexFromHash(), { focus: false });
  });
})();
