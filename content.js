if (!document.getElementById("note-memo-anchor")) {
  const match = window.location.pathname.match(/\/notes\/([^/]+)/);
  const noteId = match ? match[1] : "global";

  const container = document.createElement("div");
    container.id = "note-memo-anchor";
  container.setAttribute("tabindex", "-1");

["mousedown", "mouseup", "click", "focus"].forEach(type => {
  container.addEventListener(type, (e) => {
    if (toggleBtn.contains(e.target)) return;
    e.stopPropagation();
  }, true);
});


  // 折りたたみボタン
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "−";
  toggleBtn.title = "折りたたみ";
  toggleBtn.classList.add("toggle-btn");
  container.appendChild(toggleBtn);

  // 内容部分
  const contentWrap = document.createElement("div");
  contentWrap.classList.add("content-wrap");
  container.appendChild(contentWrap);

  const templates = {
    sbc: {
      label: "序論・本論・結論",
      questions: [
        "なぜこの記事を書くのか？（序論）",
        "主張や根拠は？（本論）",
        "読者に何を残す？（結論）"
      ]
    },
    kishoutenketsu: {
      label: "起承転結",
      questions: [
        "状況（起）",
        "展開（承）",
        "転機や問題（転）",
        "まとめ・学び（結）"
      ]
    },
    qa: {
      label: "Q&A形式",
      questions: [
        "読者が持つ疑問は？（Q）",
        "その答えは？（A）",
        "なぜそれが重要？（深掘り）"
      ]
    },
    free: {
      label: "自由構成",
      questions: [
        "この記事でやりたいことは？",
        "何を書きたい？",
        "ゴールはどこ？"
      ]
    }
  };

  let currentTemplate = localStorage.getItem(`note-template-${noteId}`) || "sbc";

  const select = document.createElement("select");
  select.addEventListener("mousedown", (e) => e.stopPropagation(), true);
  for (const key in templates) {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = templates[key].label;
    if (key === currentTemplate) opt.selected = true;
    select.appendChild(opt);
  }

  // 質問表示
  const questionBlock = document.createElement("div");
  questionBlock.classList.add("question-block");

  function renderQuestions(templateKey) {
    questionBlock.innerHTML = "";
    templates[templateKey].questions.forEach((q, idx) => {
      const label = document.createElement("label");
      label.textContent = q;

      const textarea = document.createElement("textarea");
      textarea.addEventListener("mousedown", (e) => e.stopPropagation(), true);

      const storageKey = `note-memo-${noteId}-${templateKey}-${idx}`;
      textarea.value = localStorage.getItem(storageKey) || "";

      function autoResize() {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }

      textarea.addEventListener("input", () => {
        localStorage.setItem(storageKey, textarea.value);
        autoResize();
      });

      autoResize();

      questionBlock.appendChild(label);
      questionBlock.appendChild(textarea);
    });
  }

  select.addEventListener("change", () => {
    currentTemplate = select.value;
    localStorage.setItem(`note-template-${noteId}`, currentTemplate);
    renderQuestions(currentTemplate);
  });

  // トップバー
  const topControls = document.createElement("div");
  topControls.classList.add("top-controls");
  topControls.appendChild(select);
  contentWrap.appendChild(topControls);
  contentWrap.appendChild(questionBlock);

  function updateToggleState(collapsed) {
    contentWrap.style.display = collapsed ? "none" : "block";
    toggleBtn.textContent = collapsed ? "+" : "−";
    container.classList.toggle("collapsed", collapsed);
    localStorage.setItem(`note-collapsed-${noteId}`, collapsed ? "1" : "0");
  }

  toggleBtn.addEventListener("click", () => {
    const isCollapsed = contentWrap.style.display !== "none";
    updateToggleState(isCollapsed);
  });

  renderQuestions(currentTemplate);

  const wasCollapsed = localStorage.getItem(`note-collapsed-${noteId}`) === "1";
  updateToggleState(wasCollapsed);

  // ← この直後に追加
  container.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  }, true);

  document.body.appendChild(container);

}
