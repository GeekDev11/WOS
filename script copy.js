window.addEventListener('load', () => {
    const currentSelect = document.getElementById('currentLevel');
    const targetSelect = document.getElementById('targetLevel');
    
    for (let i = 1; i <= 80; i++) {
      // Decide how to label each level
      let label;
      if (i <= 30) {
        // Levels 1..30 → "F1", "F2", ..., "F30"
        label = `F${i}`;
      } else {
        // Levels 31..80 → "FCx y"
        // e.g., 31..35 => FC1 1..5, 36..40 => FC2 1..5, etc.
        const group = Math.floor((i - 31) / 5) + 1; // 1..10
        const subLevel = ((i - 31) % 5) + 1;       // 1..5
        label = `FC${group} ${subLevel}`;
      }

      // Create an <option> with numeric value but custom label
      const option = document.createElement('option');
      option.value = i;
      option.textContent = label;

      // Append to each <select> (using cloneNode)
      currentSelect.appendChild(option.cloneNode(true));
      targetSelect.appendChild(option);
    }
    
    // Default selections
    currentSelect.value = 1;
    targetSelect.value = 2;
  });

  // ======================================================
  // 2) DUMMY LEVEL DATA (FILL IN WITH REAL 1..80)
  // ======================================================
  const levelData = {
    1: { meat: 0, wood: 0, coal: 0, iron: 0, fireCrystals: 0, time: 0, rfc: 0 },
    2: { meat: 0, wood: 180, coal: 0, iron: 0, fireCrystals: 0, time: 6, rfc: 0 },
    3: { meat: 0, wood: 805, coal: 0, iron: 0, fireCrystals: 0, time: 60, rfc: 0 },
    4: { meat: 0, wood: 1800, coal: 360, iron: 0, fireCrystals: 0, time: 180, rfc: 0 },
    5: { meat: 0, wood: 7600, coal: 1500, iron: 0, fireCrystals: 0, time: 600, rfc: 0 },
    6: { meat: 0, wood: 19000, coal: 3800, iron: 960, fireCrystals: 0, time: 1800, rfc: 0 },
    7: { meat: 0, wood: 69000, coal: 13000, iron: 3400, fireCrystals: 0, time: 3600, rfc: 0 },
    8: { meat: 0, wood: 120000, coal: 25000, iron: 6300, fireCrystals: 0, time: 9000, rfc: 0 },
    9: { meat: 0, wood: 260000, coal: 52000, iron: 13000, fireCrystals: 0, time: 16200, rfc: 0 },
    10: { meat: 0, wood: 460000, coal: 92000, iron: 23000, fireCrystals: 0, time: 21600, rfc: 0 },
    11: { meat: 1300000, wood: 1300000, coal: 260000, iron: 65000, fireCrystals: 0, time: 27000, rfc: 0 },
    12: { meat: 1600000, wood: 1600000, coal: 330000, iron: 84000, fireCrystals: 0, time: 32400, rfc: 0 },
    13: { meat: 2300000, wood: 2300000, coal: 470000, iron: 110000, fireCrystals: 0, time: 39600, rfc: 0 },
    14: { meat: 3100000, wood: 3100000, coal: 630000, iron: 150000, fireCrystals: 0, time: 50400, rfc: 0 },
    15: { meat: 4600000, wood: 4600000, coal: 930000, iron: 230000, fireCrystals: 0, time: 64800, rfc: 0 },
    16: { meat: 5900000, wood: 5900000, coal: 1100000, iron: 290000, fireCrystals: 0, time: 109680, rfc: 0 },
    17: { meat: 9300000, wood: 9300000, coal: 1800000, iron: 460000, fireCrystals: 0, time: 131640, rfc: 0 },
    18: { meat: 12000000, wood: 12000000, coal: 2500000, iron: 620000, fireCrystals: 0, time: 157980, rfc: 0 },
    19: { meat: 15000000, wood: 15000000, coal: 3100000, iron: 780000, fireCrystals: 0, time: 237000, rfc: 0 },
    20: { meat: 21000000, wood: 21000000, coal: 4300000, iron: 1000000, fireCrystals: 0, time: 296280, rfc: 0 },
    21: { meat: 27000000, wood: 27000000, coal: 5400000, iron: 1300000, fireCrystals: 0, time: 385140, rfc: 0 },
    22: { meat: 36000000, wood: 36000000, coal: 7200000, iron: 1800000, fireCrystals: 0, time: 577740, rfc: 0 },
    23: { meat: 44000000, wood: 44000000, coal: 8900000, iron: 2200000, fireCrystals: 0, time: 808800, rfc: 0 },
    24: { meat: 60000000, wood: 60000000, coal: 12000000, iron: 3000000, fireCrystals: 0, time: 1132380, rfc: 0 },
    25: { meat: 81000000, wood: 81000000, coal: 16000000, iron: 4000000, fireCrystals: 0, time: 1585320, rfc: 0 },
    26: { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5200000, fireCrystals: 0, time: 1823160, rfc: 0 },
    27: { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7400000, fireCrystals: 0, time: 2187780, rfc: 0 },
    28: { meat: 190000000, wood: 190000000, coal: 39000000, iron: 9900000, fireCrystals: 0, time: 2515920, rfc: 0 },
    29: { meat: 240000000, wood: 240000000, coal: 49000000, iron: 12000000, fireCrystals: 0, time: 2893320, rfc: 0 },
    30: { meat: 300000000, wood: 300000000, coal: 60000000, iron: 15000000, fireCrystals: 0, time: 3472020, rfc: 0 },
    31: { meat: 67000000, wood: 67000000, coal: 13000000, iron: 3300000, fireCrystals: 132, time: 604800, rfc: 0 },
    32: { meat: 67000000, wood: 67000000, coal: 13000000, iron: 3300000, fireCrystals: 132, time: 604800, rfc: 0 },
    33: { meat: 67000000, wood: 67000000, coal: 13000000, iron: 3300000, fireCrystals: 132, time: 604800, rfc: 0 },
    34: { meat: 67000000, wood: 67000000, coal: 13000000, iron: 3300000, fireCrystals: 132, time: 604800, rfc: 0 },
    35: { meat: 67000000, wood: 67000000, coal: 13000000, iron: 3300000, fireCrystals: 132, time: 604800, rfc: 0 },
    36: { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000, fireCrystals: 158, time: 777600, rfc: 0 },
    37: { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000, fireCrystals: 158, time: 777600, rfc: 0 },
    38: { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000, fireCrystals: 158, time: 777600, rfc: 0 },
    39: { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000, fireCrystals: 158, time: 777600, rfc: 0 },
    40: { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000, fireCrystals: 158, time: 777600, rfc: 0 },
    41: { meat: 79000000, wood: 79000000, coal: 15000000, iron: 3900000, fireCrystals: 238, time: 950400, rfc: 0 },
    42: { meat: 79000000, wood: 79000000, coal: 15000000, iron: 3900000, fireCrystals: 238, time: 950400, rfc: 0 },
    43: { meat: 79000000, wood: 79000000, coal: 15000000, iron: 3900000, fireCrystals: 238, time: 950400, rfc: 0 },
    44: { meat: 79000000, wood: 79000000, coal: 15000000, iron: 3900000, fireCrystals: 238, time: 950400, rfc: 0 },
    45: { meat: 79000000, wood: 79000000, coal: 15000000, iron: 3900000, fireCrystals: 238, time: 950400, rfc: 0 },
    46: { meat: 82000000, wood: 82000000, coal: 16000000, iron: 4100000, fireCrystals: 280, time: 1036800, rfc: 0 },
    47: { meat: 82000000, wood: 82000000, coal: 16000000, iron: 4100000, fireCrystals: 280, time: 1036800, rfc: 0 },
    48: { meat: 82000000, wood: 82000000, coal: 16000000, iron: 4100000, fireCrystals: 280, time: 1036800, rfc: 0 },
    49: { meat: 82000000, wood: 82000000, coal: 16000000, iron: 4100000, fireCrystals: 280, time: 1036800, rfc: 0 },
    50: { meat: 82000000, wood: 82000000, coal: 16000000, iron: 4100000, fireCrystals: 280, time: 1036800, rfc: 0 },
    51: { meat: 84000000, wood: 84000000, coal: 16000000, iron: 4200000, fireCrystals: 335, time: 1209600, rfc: 0 },
    52: { meat: 84000000, wood: 84000000, coal: 16000000, iron: 4200000, fireCrystals: 335, time: 1209600, rfc: 0 },
    53: { meat: 84000000, wood: 84000000, coal: 16000000, iron: 4200000, fireCrystals: 335, time: 1209600, rfc: 0 },
    54: { meat: 84000000, wood: 84000000, coal: 16000000, iron: 4200000, fireCrystals: 335, time: 1209600, rfc: 0 },
    55: { meat: 84000000, wood: 84000000, coal: 16000000, iron: 4200000, fireCrystals: 335, time: 1209600, rfc: 0 },
    56: { meat: 96000000, wood: 96000000, coal: 19000000, iron: 4800000, fireCrystals: 200, time: 1296000, rfc: 10 },
    57: { meat: 96000000, wood: 96000000, coal: 19000000, iron: 4800000, fireCrystals: 200, time: 1296000, rfc: 10 },
    58: { meat: 96000000, wood: 96000000, coal: 19000000, iron: 4800000, fireCrystals: 200, time: 1296000, rfc: 10 },
    59: { meat: 96000000, wood: 96000000, coal: 19000000, iron: 4800000, fireCrystals: 200, time: 1296000, rfc: 10 },
    60: { meat: 96000000, wood: 96000000, coal: 19000000, iron: 4800000, fireCrystals: 100, time: 1296000, rfc: 20 },
    61: { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5400000, fireCrystals: 240, time: 1555200, rfc: 15 },
    62: { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5400000, fireCrystals: 240, time: 1555200, rfc: 15 },
    63: { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5400000, fireCrystals: 240, time: 1555200, rfc: 15 },
    64: { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5400000, fireCrystals: 240, time: 1555200, rfc: 15 },
    65: { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5400000, fireCrystals: 120, time: 1555200, rfc: 30 },
    66: { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000, fireCrystals: 240, time: 1728000, rfc: 20 },
    67: { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000, fireCrystals: 240, time: 1728000, rfc: 20 },
    68: { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000, fireCrystals: 240, time: 1728000, rfc: 20 },
    69: { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000, fireCrystals: 240, time: 1728000, rfc: 20 },
    70: { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000, fireCrystals: 120, time: 1728000, rfc: 40 },
    71: { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000, fireCrystals: 280, time: 1123200, rfc: 30 },
    72: { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000, fireCrystals: 280, time: 1123200, rfc: 30 },
    73: { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000, fireCrystals: 280, time: 1123200, rfc: 30 },
    74: { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000, fireCrystals: 280, time: 1123200, rfc: 30 },
    75: { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000, fireCrystals: 140, time: 1123200, rfc: 60 },
    76: { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8400000, fireCrystals: 350, time: 1728000, rfc: 70 },
    77: { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8400000, fireCrystals: 350, time: 1728000, rfc: 70 },
    78: { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8400000, fireCrystals: 350, time: 1728000, rfc: 70 },
    79: { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8400000, fireCrystals: 350, time: 1728000, rfc: 70 },
    80: { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8400000, fireCrystals: 174, time: 1728000, rfc: 140 }
};

  // ======================================================
  // 3) MAIN CALCULATION
  // ======================================================
  function calculateResources() {
    // -- Grab user inputs --
    const currentLevel = parseInt(document.getElementById('currentLevel').value);
    const targetLevel  = parseInt(document.getElementById('targetLevel').value);
    const zinmanSkill  = parseInt(document.getElementById('zinmanSkill').value) || 0;
    
    // Buffs that reduce TIME (except Double Down):
    const presidentBuff       = document.getElementById('presidentBuff').checked; // 10%
    const constructionSpeed   = parseFloat(document.getElementById('constructionSpeed').value) || 0; 
    const petBuff             = parseFloat(document.getElementById('petBuff').value) || 0; 
    const vpBuff              = parseFloat(document.getElementById('vpBuff').value) || 0;
    
    // Double Down is a separate step
    const doubleDown          = document.getElementById('doubleDown').checked;

    const errorElement   = document.getElementById('error');
    const resultsElement = document.getElementById('results');

    errorElement.textContent = '';
    resultsElement.innerHTML = '';

    // Validation
    if (currentLevel >= targetLevel) {
      errorElement.textContent = 'Target level must be greater than current level!';
      return;
    }
    if (currentLevel < 1 || targetLevel > 80) {
      errorElement.textContent = 'Levels must be between 1 and 80!';
      return;
    }

    // ================================================
    // 4) AGGREGATE RESOURCES (currentLevel+1..target)
    // ================================================
    let totals = { meat: 0, wood: 0, coal: 0, iron: 0, fireCrystals: 0, time: 0, rfc: 0 };
    
    for (let lvl = currentLevel + 1; lvl <= targetLevel; lvl++) {
      const data = levelData[lvl];
      if (!data) {
        errorElement.textContent = `Missing data for level ${lvl}!`;
        return;
      }
      totals.meat         += data.meat;
      totals.wood         += data.wood;
      totals.coal         += data.coal;
      totals.iron         += data.iron;
      totals.fireCrystals += data.fireCrystals;
      totals.time         += data.time;
      totals.rfc         += data.rfc;
    }

    // Track active modifiers for display
    const modifiers = [];

    // =========================================
    // 5) ZINMAN SKILL → Resource discount
    // =========================================
    if (zinmanSkill > 0) {
      const resourceDiscountPct = zinmanSkill * 3; // e.g., skill=2 => 6%
      const factor = 1 - (resourceDiscountPct / 100);

      totals.meat = Math.floor(totals.meat * factor);
      totals.wood = Math.floor(totals.wood * factor);
      totals.coal = Math.floor(totals.coal * factor);
      totals.iron = Math.floor(totals.iron * factor);

      modifiers.push(`Zinman Skill: Level ${zinmanSkill} (Resource discount: ${resourceDiscountPct}%)`);
    }

    // ================================================
    // 6) TIME CALCULATION (EXCLUDING Double Down)
    //    finalTime = baseTime * [1 / (1 + sumOfBuffs)]
    // ================================================
    const baseTime = totals.time;
    let sumOfBuffs = 0;

    if (presidentBuff) {
      sumOfBuffs += 0.10;
      modifiers.push('President Buff: 10% speed');
    }
    if (constructionSpeed > 0) {
      sumOfBuffs += (constructionSpeed / 100);
      modifiers.push(`Construction Speed: ${constructionSpeed}%`);
    }
    if (petBuff > 0) {
      sumOfBuffs += (petBuff / 100);
      modifiers.push(`Pet Buff: ${petBuff}%`);
    }
    if (vpBuff > 0) {
      sumOfBuffs += (vpBuff / 100);
      modifiers.push(`VP Buff: ${vpBuff}%`);
    }

    // Compute time after additive buffs
    const afterAdditiveBuffs = baseTime * (1 / (1 + sumOfBuffs));

    // =========================================
    // 7) APPLY DOUBLE DOWN SEPARATELY
    //    finalTime = afterAdditiveBuffs * 0.80
    // =========================================
    let finalTime = afterAdditiveBuffs;
    let finalTimeLabel = 'Modified Time'; // Default label

    if (doubleDown) {
      finalTime *= 0.8;  // 20% less
      finalTimeLabel = 'Time with Double Down';
      modifiers.push('Double Down: 20% (applied after all other buffs)');
    }

    // Round down the final time
    const modifiedTime = Math.floor(finalTime);

    // =========================================
    // 8) HELPER FUNCTIONS
    // =========================================
    const formatNumber = num => num.toLocaleString();
    const formatTime = (seconds) => {
      const days = Math.floor(seconds / 86400);
      seconds %= 86400;
      const hours = Math.floor(seconds / 3600);
      seconds %= 3600;
      const minutes = Math.floor(seconds / 60);
      return `${days}d ${hours}h ${minutes}m`;
    };

    // =========================================
    // 9) DISPLAY RESULTS
    // =========================================
    resultsElement.innerHTML = `
      <h3>Total Resources Required:</h3>
      <p>Meat: ${formatNumber(totals.meat)}</p>
      <p>Wood: ${formatNumber(totals.wood)}</p>
      <p>Coal: ${formatNumber(totals.coal)}</p>
      <p>Iron: ${formatNumber(totals.iron)}</p>
      <p>Fire Crystals: ${formatNumber(totals.fireCrystals)}</p>
      <p>RFC: ${formatNumber(totals.rfc)}</p>
      
      <h3>Time Calculation:</h3>
      <p>Base Time: ${formatTime(baseTime)}</p>
      <p>${finalTimeLabel}: ${formatTime(modifiedTime)}</p>
      
      <h3>Active Modifiers:</h3>
      <ul>${modifiers.map(m => `<li>${m}</li>`).join('')}</ul>
      
      <p><strong>Total Additive Buff (excluding Double Down):</strong> ${(sumOfBuffs*100).toFixed(1)}%</p>
      
    `;
  }
