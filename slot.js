const symbols = ["🦁", "👨", "🌳", "🌟", "💥", "🎰"];
// 🦁 = Lion, 👨 = Man, 🌳 = Tree, 🌟 = Wild, 💥 = Multiplier, 🎰 = Free Spin

const weights = {
  "🦁": 35,  // Common
  "👨": 30,  // Common
  "🌳": 25,  // Common
  "🌟": 5,   // Wild - rare
  "💥": 4,   // Multiplier - rare
  "🎰": 1    // Free Spin - very rare
};

let freeSpins = 0;

function getSymbol() {
  const rand = Math.random() * 100;
  let sum = 0;
  for (let sym in weights) {
    sum += weights[sym];
    if (rand <= sum) return sym;
  }
  return "🦁";
}

function spin() {
  const bet = parseFloat(document.getElementById("betAmount").value);
  let grid = [];
  let freeSpinCount = 0;
  let wildCount = 0;
  let multiplierCount = 0;

  const gridElement = document.getElementById("grid");
  gridElement.innerHTML = "";

  // Generate grid
  for (let i = 0; i < 6 * 6; i++) {
    let sym = getSymbol();
    if (sym === "🎰") freeSpinCount++;
    if (sym === "🌟") wildCount++;
    if (sym === "💥") multiplierCount++;
    grid.push(sym);
    const cell = document.createElement("div");
    cell.innerText = sym;
    gridElement.appendChild(cell);
  }

  // Simple payout: base 0 → chance to win ~30% (force win)
  let win = Math.random() < 0.3;

  let payout = 0;
  if (win) {
    payout = bet * (Math.random() * (5 - 0.7) + 0.7); // Random payout between 0.7x - 5x

    // 1 in 100 spins: Big win 23x
    if (Math.random() < 0.01) {
      payout = bet * 23;
    }

    // Apply wild: +50% boost per wild
    payout *= 1 + wildCount * 0.5;

    // Apply multiplier: x2 per 💥
    payout *= Math.pow(2, multiplierCount);
  }

  if (freeSpinCount >= 4) {
    freeSpins += 5; // +5 free spins
    document.getElementById("bonus").innerText = `You won ${freeSpins} Free Spins!`;
  }

  if (freeSpins > 0) {
    freeSpins--;
    document.getElementById("bonus").innerText = `Free Spins Remaining: ${freeSpins}`;
    spin();
    return;
  }

  document.getElementById("result").innerText = `You ${win ? `win ${payout.toFixed(2)}!` : "lose!"}`;
}
