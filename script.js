const MAIN_WEBHOOK_URL = "https://hook.us2.make.com/xksghlaxkbekqxtrtu3cjabx09ftab5f";

const authPage = document.getElementById("authPage");
const app = document.getElementById("app");
const authTabs = document.querySelectorAll(".auth-tab");
const authForms = document.querySelectorAll(".auth-form");
const authFeedback = document.getElementById("authFeedback");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const logoutBtn = document.getElementById("logoutBtn");

const menuButtons = document.querySelectorAll(".menu-btn");
const sections = document.querySelectorAll(".section");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const sidebar = document.querySelector(".sidebar");

const checkinForm = document.getElementById("checkinForm");

const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeSubtitle = document.getElementById("welcomeSubtitle");
const todayDate = document.getElementById("todayDate");

const waterValue = document.getElementById("waterValue");
const sleepValue = document.getElementById("sleepValue");
const workoutValue = document.getElementById("workoutValue");
const foodValue = document.getElementById("foodValue");

const waterMeta = document.getElementById("waterMeta");
const sleepMeta = document.getElementById("sleepMeta");

const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const progressText = document.getElementById("progressText");
const motivationText = document.getElementById("motivationText");

const historyList = document.getElementById("historyList");
const copyReminderNumberBtn = document.getElementById("copyReminderNumberBtn");
const copyReminderMessageBtn = document.getElementById("copyReminderMessageBtn");
const reminderFeedback = document.getElementById("reminderFeedback");

const motivationalMessages = [
  "Pequenos hábitos constroem grandes resultados.",
  "Cuidar da saúde hoje é investir no seu futuro.",
  "Disciplina vale mais do que motivação momentânea.",
  "Um passo por dia já é progresso.",
  "Seu bem-estar merece atenção diária."
];

let currentUser = null;
let currentHistory = [];

function formatDateBR(date = new Date()) {
  return date.toLocaleDateString("pt-BR");
}

function getTodayKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function setSession(user) {
  sessionStorage.setItem("healthSession", JSON.stringify(user));
  currentUser = user;
}

function getSession() {
  return JSON.parse(sessionStorage.getItem("healthSession")) || null;
}

function clearSession() {
  sessionStorage.removeItem("healthSession");
  currentUser = null;
  currentHistory = [];
}

function updateDate() {
  todayDate.textContent = formatDateBR();
}

function setAuthFeedback(message = "", isError = true) {
  authFeedback.textContent = message;
  authFeedback.style.color = isError ? "#ffcf70" : "#8ff0b3";
}

function setReminderFeedback(message = "", isError = false) {
  if (!reminderFeedback) return;
  reminderFeedback.textContent = message;
  reminderFeedback.style.color = isError ? "#ffcf70" : "#8ff0b3";
}

async function copyToClipboard(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    setReminderFeedback(successMessage);
  } catch (error) {
    console.error("Erro ao copiar conteúdo:", error);
    setReminderFeedback("Não foi possível copiar automaticamente.", true);
  }
}

function switchAuthTab(tab) {
  authTabs.forEach(button => {
    button.classList.toggle("active", button.dataset.auth === tab);
  });

  authForms.forEach(form => {
    const shouldShow =
      (tab === "login" && form.id === "loginForm") ||
      (tab === "register" && form.id === "registerForm");

    form.classList.toggle("active", shouldShow);
  });

  setAuthFeedback("");
}

authTabs.forEach(button => {
  button.addEventListener("click", () => switchAuthTab(button.dataset.auth));
});

function showApp() {
  authPage.classList.add("hidden");
  app.classList.remove("hidden");
}

function showAuth() {
  app.classList.add("hidden");
  authPage.classList.remove("hidden");
}

function updateWelcome() {
  if (currentUser) {
    welcomeTitle.textContent = `Olá, ${currentUser.name}!`;
    welcomeSubtitle.textContent = "Acompanhe seus hábitos e metas diárias.";
  } else {
    welcomeTitle.textContent = "Olá!";
    welcomeSubtitle.textContent = "Faça login para continuar.";
  }
}

function getTodayCheckin() {
  return currentHistory.find(item => item.dateKey === getTodayKey()) || null;
}

function calculateProgress(user, checkin) {
  if (!user || !checkin) return 0;

  let points = 0;
  const total = 4;

  if (Number(checkin.waterIntake) >= Number(user.waterGoal)) points++;
  if (Number(checkin.sleepHours) >= Number(user.sleepGoal)) points++;
  if (checkin.workoutDone === "Sim") points++;
  if (checkin.foodQuality === "Boa") points++;

  return Math.round((points / total) * 100);
}

function updateDashboard() {
  const checkin = getTodayCheckin();

  waterMeta.textContent = `Meta: ${currentUser ? currentUser.waterGoal : 0} L`;
  sleepMeta.textContent = `Meta: ${currentUser ? currentUser.sleepGoal : 0} h`;

  if (!checkin) {
    waterValue.textContent = "0 L";
    sleepValue.textContent = "0 h";
    workoutValue.textContent = "Não";
    foodValue.textContent = "-";

    progressFill.style.width = "0%";
    progressPercent.textContent = "0%";
    progressText.textContent = "Faça seu check-in de hoje.";
    motivationText.textContent =
      motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    return;
  }

  waterValue.textContent = `${checkin.waterIntake || 0} L`;
  sleepValue.textContent = `${checkin.sleepHours || 0} h`;
  workoutValue.textContent = checkin.workoutDone || "-";
  foodValue.textContent = checkin.foodQuality || "-";

  const progress = calculateProgress(currentUser, checkin);
  progressFill.style.width = `${progress}%`;
  progressPercent.textContent = `${progress}%`;

  if (progress === 100) {
    progressText.textContent = "Excelente. Você bateu todas as metas de hoje.";
  } else if (progress >= 75) {
    progressText.textContent = "Ótimo desempenho hoje. Você está quase batendo tudo.";
  } else if (progress >= 50) {
    progressText.textContent = "Bom progresso. Continue melhorando seus hábitos.";
  } else {
    progressText.textContent = "Hoje ainda pode melhorar. Foque nas metas principais.";
  }

  motivationText.textContent =
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
}

function renderHistory() {
  if (!currentHistory.length) {
    historyList.innerHTML = `<p class="empty-text">Nenhum registro encontrado.</p>`;
    return;
  }

  historyList.innerHTML = currentHistory
    .map(item => {
      return `
        <div class="history-item">
          <h4>${item.date || "-"}</h4>
          <p><strong>Água:</strong> ${item.waterIntake || "0"} L</p>
          <p><strong>Sono:</strong> ${item.sleepHours || "0"} h</p>
          <p><strong>Treino:</strong> ${item.workoutDone || "-"}</p>
          <p><strong>Alimentação:</strong> ${item.foodQuality || "-"}</p>
          <p><strong>Humor/observação:</strong> ${item.mood || "Não informado"}</p>
        </div>
      `;
    })
    .join("");
}

function showSection(sectionId) {
  sections.forEach(section => {
    section.classList.toggle("active", section.id === sectionId);
  });

  menuButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.section === sectionId);
  });

  if (window.innerWidth <= 860) {
    sidebar.classList.remove("open");
  }
}

menuButtons.forEach(button => {
  button.addEventListener("click", () => {
    showSection(button.dataset.section);
  });
});

mobileMenuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

async function postJSON(payload) {
  const response = await fetch(MAIN_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      success: response.ok,
      raw: text
    };
  }
}

function normalizeHistoryRecord(item) {
  if (!item || typeof item !== "object") return null;

  return {
    date: item.date || item["2"] || "",
    dateKey: item.dateKey || item["3"] || "",
    waterIntake: item.waterIntake || item["4"] || "",
    sleepHours: item.sleepHours || item["5"] || "",
    workoutDone: item.workoutDone || item["6"] || "",
    foodQuality: item.foodQuality || item["7"] || "",
    mood: item.mood || item["8"] || ""
  };
}

function normalizeHistory(result) {
  if (!result) return [];

  let history = result.history;

  if (!history && result.raw) {
    try {
      const parsedRaw = JSON.parse(result.raw);
      history = parsedRaw.history;
    } catch {
      return [];
    }
  }

  if (typeof history === "string") {
    try {
      history = JSON.parse(history);
    } catch {
      return [];
    }
  }

  if (history && typeof history === "object" && Array.isArray(history.array)) {
    history = history.array;
  }

  if (Array.isArray(history)) {
    return history.map(normalizeHistoryRecord).filter(Boolean);
  }

  if (history && typeof history === "object") {
    return [normalizeHistoryRecord(history)].filter(Boolean);
  }

  return [];
}

async function loadHistory() {
  if (!currentUser) return;

  try {
    const result = await postJSON({
      action: "history",
      phone: currentUser.phone
    });

    console.log("Resposta history:", result);

    currentHistory = normalizeHistory(result);

    currentHistory.sort((a, b) => {
      const dateA = a?.dateKey || "";
      const dateB = b?.dateKey || "";
      return dateB.localeCompare(dateA);
    });

    renderHistory();
    updateDashboard();
  } catch (error) {
    console.error("Erro ao carregar histórico:", error);
    currentHistory = [];
    renderHistory();
    updateDashboard();
  }
}

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const payload = {
    action: "login",
    phone: document.getElementById("loginPhone").value.trim(),
    password: document.getElementById("loginPassword").value.trim()
  };

  setAuthFeedback("Validando login...", false);
  console.log("Enviando login:", payload);

  try {
    const result = await postJSON(payload);
    console.log("Resposta login:", result);

    if (!result.success || !result.user) {
      setAuthFeedback(result.message || "Telefone ou senha inválidos.");
      return;
    }

    setSession(result.user);
    updateWelcome();
    showApp();
    await loadHistory();
    showSection("dashboard");
    setAuthFeedback("");
    loginForm.reset();
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    setAuthFeedback("Erro ao realizar login.");
  }
});

registerForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const payload = {
    action: "register",
    name: document.getElementById("registerName").value.trim(),
    phone: document.getElementById("registerPhone").value.trim(),
    password: document.getElementById("registerPassword").value.trim(),
    waterGoal: document.getElementById("registerWaterGoal").value,
    sleepGoal: document.getElementById("registerSleepGoal").value,
    workoutGoal: document.getElementById("registerWorkoutGoal").value
  };

  setAuthFeedback("Criando conta...", false);
  console.log("Enviando cadastro:", payload);

  try {
    const result = await postJSON(payload);
    console.log("Resposta cadastro:", result);

    if (!result.success) {
      setAuthFeedback(result.message || "Não foi possível criar a conta.");
      return;
    }

    setAuthFeedback("Conta criada com sucesso. Agora faça login.", false);
    registerForm.reset();
    switchAuthTab("login");
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    setAuthFeedback("Erro ao cadastrar.");
  }
});

checkinForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (!currentUser) {
    alert("Faça login para continuar.");
    return;
  }

  const payload = {
    action: "checkin",
    phone: currentUser.phone,
    name: currentUser.name,
    date: formatDateBR(),
    dateKey: getTodayKey(),
    waterIntake: document.getElementById("waterIntake").value,
    sleepHours: document.getElementById("sleepHours").value,
    workoutDone: document.getElementById("workoutDone").value,
    foodQuality: document.getElementById("foodQuality").value,
    mood: document.getElementById("mood").value.trim()
  };

  console.log("Enviando check-in:", payload);

  try {
    const result = await postJSON(payload);
    console.log("Resposta check-in:", result);

    if (!result.success) {
      alert(result.message || "Erro ao salvar check-in.");
      return;
    }

    checkinForm.reset();
    await loadHistory();
    showSection("dashboard");
    alert("Check-in diário salvo com sucesso.");
  } catch (error) {
    console.error("Erro ao enviar check-in:", error);
    alert("Erro ao enviar os dados para o Make.");
  }
});

if (copyReminderNumberBtn) {
  copyReminderNumberBtn.addEventListener("click", () => {
    copyToClipboard("+14155238886", "Número copiado com sucesso.");
  });
}

if (copyReminderMessageBtn) {
  copyReminderMessageBtn.addEventListener("click", () => {
    copyToClipboard("gravity-itself", "Mensagem copiada com sucesso.");
  });
}

logoutBtn.addEventListener("click", () => {
  clearSession();
  showAuth();
  switchAuthTab("login");
  renderHistory();
  updateDashboard();
});

function restoreSession() {
  const session = getSession();

  if (!session) {
    showAuth();
    return;
  }

  currentUser = session;
  updateWelcome();
  showApp();
  loadHistory();
}

updateDate();
restoreSession();
renderHistory();
updateDashboard();