// ================= SESSION =================
function requireLogin(){
  if(!localStorage.getItem("session")){
    window.location.href="index.html";
  }
}

// login
function createSession(){
  localStorage.setItem("session","active");
}

// logout (balance NOT cleared)
function logout(){
  localStorage.removeItem("session");
  window.location.href="index.html";
}

// ================= THEME =================
function applyTheme(){
  const theme = localStorage.getItem("theme") || "dark";
  document.body.classList.remove("dark","light");
  document.body.classList.add(theme);
}

function toggleTheme(){
  const current = document.body.classList.contains("dark") ? "light":"dark";
  localStorage.setItem("theme",current);
  applyTheme();
}

document.addEventListener("DOMContentLoaded",()=>{
  applyTheme();
  const btn=document.getElementById("themeToggle");
  if(btn) btn.addEventListener("click",toggleTheme);
});

// ================= BALANCE =================
function getBalance(){
  return parseFloat(localStorage.getItem("balance")) || 500;
}

function setBalance(val){
  localStorage.setItem("balance",val);
}

function updateBalanceUI(){
  const el=document.getElementById("balance");
  if(el) el.innerText="$"+getBalance().toFixed(2);
}

// ================= HISTORY =================
function addHistory(text){
  let h=JSON.parse(localStorage.getItem("history"))||[];
  h.push(text+" | "+new Date().toLocaleTimeString());
  localStorage.setItem("history",JSON.stringify(h));
}

function loadHistory(){
  const el=document.getElementById("history");
  if(!el) return;
  el.innerHTML="";
  let h=JSON.parse(localStorage.getItem("history"))||[];
  h.forEach(i=>el.innerHTML+=`<li>${i}</li>`);
}

// ================= TRADING =================
let trading=true;

function startStopTrade(){
  trading=!trading;
}

function cancelTrade(){
  setBalance(500);
  updateBalanceUI();
  addHistory("Trade CANCELLED - Balance Reset");
}

function liveTrade(){
  if(!trading) return;
  let bal=getBalance();
  let move=(Math.random()-0.5)*bal*0.01;
  bal+=move;
  setBalance(bal);
  updateBalanceUI();
}

setInterval(liveTrade,2000);

// ================= WITHDRAWAL (20s) =================
function withdrawProcess(amount){
  let bal=getBalance();
  if(amount<=0 || amount>bal) return false;

  let countdown=20;
  const bar=document.getElementById("withdrawProgressBar");

  const interval=setInterval(()=>{
    countdown--;
    bar.style.width=((20-countdown)/20*100)+"%";
    bar.textContent=countdown>0?countdown+"s":"Processing...";
    if(countdown<=0){
      clearInterval(interval);
      bal-=amount;
      setBalance(bal);
      updateBalanceUI();
      addHistory("Withdrawal - $"+amount);
      bar.textContent="Completed";
    }
  },1000);
}
