document.addEventListener('DOMContentLoaded', function() {
    const maxLevel = 80; // Maximum level for most buildings
    const warAcademyMaxLevel = 46; // War Academy stops at level 46
    const buildings = ['furnace', 'embassy', 'infantry', 'lancer', 'marksmen', 'warAcademy'];

    buildings.forEach(building => {
        const currentSelect = document.querySelector(`.current-level[data-building="${building}"]`);
        const desiredSelect = document.querySelector(`.desired-level[data-building="${building}"]`);

        // Define max level per building type
        let buildingMaxLevel = (building === 'warAcademy') ? warAcademyMaxLevel : maxLevel;

        for (let level = 1; level <= buildingMaxLevel; level++) {
            let label;

            if (building === 'warAcademy') {
                // War Academy follows FC structure from level 1 to 46
                if (level === 1) {
                    label = `FC1`;
                } else {
                    let fcGroup = Math.ceil(level / 5); // Determines FC group
                    let fcIndex = (level - 1) % 5; // Determines FCX 1, FCX 2, etc.

                    if (fcIndex === 0) {
                        label = `FC${fcGroup}`; // Main FC level (FC1, FC2, ...)
                    } else {
                        label = `FC${fcGroup} ${fcIndex}`; // Sub-levels (FC1 1, FC1 2, ...)
                    }
                }
            } else {
                // Normal Buildings: F1 to F30, then follow FC structure from level 31 to 80
                if (level <= 30) {
                    label = `F${level}`; // Standard F1 to F30
                } else {
                    let groupNum = Math.floor((level - 31) / 5) + 1;
                    let subIndex = ((level - 31) % 5) + 1;

                    // Check for the specific levels 76-80
                    if (level >= 76 && level <= 79) {
                        label = `FC9 ${subIndex}`; // Specific to levels 76-79 as FC9 1, FC9 2, FC9 3, FC9 4
                    } else if (level === 80) {
                        label = 'FC10'; // Specific to level 80
                    } else {
                        label = `FC${groupNum} ${subIndex}`; // General case for levels 31-75 and not directly mapping to 76-80
                    }
                }
            }

            // Create options for both current and desired dropdowns
            let optionCurrent = new Option(label, level);
            let optionDesired = new Option(label, level);

            currentSelect.appendChild(optionCurrent);
            desiredSelect.appendChild(optionDesired);
        }
    });
});











/* document.addEventListener('DOMContentLoaded', function() {
    const maxLevel = 80;
    const warAcademyMaxLevel = 46; // War Academy stops at 46
    const buildings = ['furnace', 'embassy', 'infantry', 'lancer', 'marksmen', 'warAcademy'];

    buildings.forEach(building => {
        const currentSelect = document.querySelector(`.current-level[data-building="${building}"]`);
        const desiredSelect = document.querySelector(`.desired-level[data-building="${building}"]`);

        let buildingMaxLevel = (building === 'warAcademy') ? warAcademyMaxLevel : maxLevel;

        for (let level = 1; level <= buildingMaxLevel; level++) {

            let label = level <= 30 ? `F${level}` : `FC${Math.floor((level - 31) / 5) + 1} ${(level - 31) % 5 + 1}`;
            let optionCurrent = new Option(label, level);
            let optionDesired = new Option(label, level);
            currentSelect.appendChild(optionCurrent);
            desiredSelect.appendChild(optionDesired);
        }
    });
});   */

/*function calculateResources() {
    const buildings = ['furnace', 'embassy', 'infantry', 'lancer', 'marksmen', 'warAcademy'];
    let results = buildings.map(building => {
        const currentLevel = parseInt(document.querySelector(`.current-level[data-building="${building}"]`).value);
        const desiredLevel = parseInt(document.querySelector(`.desired-level[data-building="${building}"]`).value);

        if (desiredLevel <= currentLevel) {
            return `${building} upgrade from level ${currentLevel} to ${desiredLevel} is not possible.`;
        } else {
            return `${building} can be upgraded from level ${currentLevel} to ${desiredLevel}.`;
        }
    }).join('<br>');

    document.getElementById('results').innerHTML = results;
}
 */

function calculateResources() {
    const zinmanMultipliers = {
        0: 1.00, // No reduction
        1: 0.97,
        2: 0.94,
        3: 0.91,
        4: 0.88,
        5: 0.85
    };
    const results = {
        meat: 0, wood: 0, coal: 0, iron: 0, fireCrystals: 0, time: 0, rfc: 0
    };

    
    const zinmanSkill = parseInt(document.getElementById('zinmanSkill').value) || 0; // Default to 0 if invalid
    const presidentBuff = document.getElementById('presidentBuff').checked;
    const constructionSpeed = parseInt(document.getElementById('constructionSpeed').value);
    const doubleDown = document.getElementById('doubleDown').checked;
    const petBuff = parseInt(document.getElementById('petBuff').value);
    const vpBuff = parseInt(document.getElementById('vpBuff').value);


    const modifiers = [];


    // Iterate through each building in the buildings object
    Object.keys(buildings).forEach(buildingKey => {
        const building = buildings[buildingKey];
        const currentLevel = parseInt(document.querySelector(`.current-level[data-building="${buildingKey}"]`).value);
        const desiredLevel = parseInt(document.querySelector(`.desired-level[data-building="${buildingKey}"]`).value);
     
    const doubleDown          = document.getElementById('doubleDown').checked; //20%

        if (desiredLevel > currentLevel) {
            for (let level = currentLevel + 1; level <= desiredLevel; level++) {
                building.resources.forEach(resource => {
                    if (building.data[level][resource] !== undefined) {
                        results[resource] += building.data[level][resource];
                    }
                });
            }
        }
    });


    // Ensure the Zinman skill level is within the allowed range
    const factor = zinmanMultipliers[zinmanSkill] ?? 1.00; // Default to 1 if out of range

    // Apply the reduction factor to all relevant resources
    results.meat *= factor;
    results.wood *= factor;
    results.coal *= factor;
    results.iron *= factor;
    results.fireCrystals *= factor;

    modifiers.push(`Zinman Skill: Level ${zinmanSkill} (Resource discount applied: ${(1 - factor) * 100}%)`);

    // Calculate time with buffs
    let sumOfBuffs = 0;
    if (presidentBuff) {
      sumOfBuffs += 0.10;
      modifiers.push('President Buff: 10% time reduction');
    }
    if (constructionSpeed > 0) {
      sumOfBuffs += constructionSpeed / 100;
      modifiers.push(`Construction Speed: ${constructionSpeed}% increase`);
    }
    if (petBuff > 0) {
      sumOfBuffs += petBuff / 100;
      modifiers.push(`Pet Buff: ${petBuff}% speed increase`);
    }
    if (vpBuff > 0) {
        sumOfBuffs += (vpBuff / 100);
        modifiers.push(`VP Buff: ${vpBuff}%`);
      }

    const afterAdditiveBuffs = results.time * (1 / (1 + sumOfBuffs));
    let finalTime = afterAdditiveBuffs;
    
    if (doubleDown) {
      finalTime *= 0.8;
      modifiers.push('Double Down: 20% time reduction (applied last)');
    }

    results.adjustedTime = Math.floor(finalTime);
   
    displayResults(results, modifiers);

}


function formatTime(seconds) {
    const days = Math.floor(seconds / 86400);
    seconds %= 86400;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    return `${days}d ${hours}h ${minutes}m`;
}



function displayResults(resources, modifiers) {
    const resultsDiv = document.getElementById('results');
    const resourceEntries = Object.entries(resources)
        .map(([key, value]) => {
            if (key === 'time' || key === 'adjustedTime') {
                return `${key.charAt(0).toUpperCase() + key.slice(1)}: ${formatTime(value)}`;
            }
            return `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value.toFixed(2)}`;
        })
        .join('<br>');

    resultsDiv.innerHTML = resourceEntries + '<br><br>Modifiers Applied:<br>' + modifiers.join('<br>');
}



const buildings = {
    furnace: {
        name: "Furnace",
        resources: ["meat", "wood", "coal", "iron", "fireCrystals", "time","rfc" ],
        data: {
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
    35: { meat: 67000000, wood: 67000000, coal: 13000000, iron: 3300000, fireCrystals: 132, time: 604800, rfc: 0 },   // FC1
    36: { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000, fireCrystals: 158, time: 777600, rfc: 0 },
    37: { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000, fireCrystals: 158, time: 777600, rfc: 0 },
    38: { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000, fireCrystals: 158, time: 777600, rfc: 0 },
    39: { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000, fireCrystals: 158, time: 777600, rfc: 0 },
    40: { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000, fireCrystals: 158, time: 777600, rfc: 0 },      // FC2
    41: { meat: 79000000, wood: 79000000, coal: 15000000, iron: 3900000, fireCrystals: 238, time: 950400, rfc: 0 },
    42: { meat: 79000000, wood: 79000000, coal: 15000000, iron: 3900000, fireCrystals: 238, time: 950400, rfc: 0 },
    43: { meat: 79000000, wood: 79000000, coal: 15000000, iron: 3900000, fireCrystals: 238, time: 950400, rfc: 0 },
    44: { meat: 79000000, wood: 79000000, coal: 15000000, iron: 3900000, fireCrystals: 238, time: 950400, rfc: 0 },
    45: { meat: 79000000, wood: 79000000, coal: 15000000, iron: 3900000, fireCrystals: 238, time: 950400, rfc: 0 },      // FC3
    46: { meat: 82000000, wood: 82000000, coal: 16000000, iron: 4100000, fireCrystals: 280, time: 1036800, rfc: 0 },
    47: { meat: 82000000, wood: 82000000, coal: 16000000, iron: 4100000, fireCrystals: 280, time: 1036800, rfc: 0 },
    48: { meat: 82000000, wood: 82000000, coal: 16000000, iron: 4100000, fireCrystals: 280, time: 1036800, rfc: 0 },
    49: { meat: 82000000, wood: 82000000, coal: 16000000, iron: 4100000, fireCrystals: 280, time: 1036800, rfc: 0 },
    50: { meat: 82000000, wood: 82000000, coal: 16000000, iron: 4100000, fireCrystals: 280, time: 1036800, rfc: 0 },     // FC4
    51: { meat: 84000000, wood: 84000000, coal: 16000000, iron: 4200000, fireCrystals: 335, time: 1209600, rfc: 0 },
    52: { meat: 84000000, wood: 84000000, coal: 16000000, iron: 4200000, fireCrystals: 335, time: 1209600, rfc: 0 },
    53: { meat: 84000000, wood: 84000000, coal: 16000000, iron: 4200000, fireCrystals: 335, time: 1209600, rfc: 0 },
    54: { meat: 84000000, wood: 84000000, coal: 16000000, iron: 4200000, fireCrystals: 335, time: 1209600, rfc: 0 },
    55: { meat: 84000000, wood: 84000000, coal: 16000000, iron: 4200000, fireCrystals: 335, time: 1209600, rfc: 0 },    // FC5
    56: { meat: 96000000, wood: 96000000, coal: 19000000, iron: 4800000, fireCrystals: 200, time: 1296000, rfc: 10 },
    57: { meat: 96000000, wood: 96000000, coal: 19000000, iron: 4800000, fireCrystals: 200, time: 1296000, rfc: 10 },
    58: { meat: 96000000, wood: 96000000, coal: 19000000, iron: 4800000, fireCrystals: 200, time: 1296000, rfc: 10 },
    59: { meat: 96000000, wood: 96000000, coal: 19000000, iron: 4800000, fireCrystals: 200, time: 1296000, rfc: 10 },
    60: { meat: 96000000, wood: 96000000, coal: 19000000, iron: 4800000, fireCrystals: 100, time: 1296000, rfc: 20 },   //FC6
    61: { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5400000, fireCrystals: 240, time: 1555200, rfc: 15 },
    62: { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5400000, fireCrystals: 240, time: 1555200, rfc: 15 },
    63: { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5400000, fireCrystals: 240, time: 1555200, rfc: 15 },
    64: { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5400000, fireCrystals: 240, time: 1555200, rfc: 15 },
    65: { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5400000, fireCrystals: 120, time: 1555200, rfc: 30 }, //FC7
    66: { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000, fireCrystals: 240, time: 1728000, rfc: 20 },
    67: { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000, fireCrystals: 240, time: 1728000, rfc: 20 },
    68: { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000, fireCrystals: 240, time: 1728000, rfc: 20 },
    69: { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000, fireCrystals: 240, time: 1728000, rfc: 20 },
    70: { meat: 130000000, wood: 130000000, coal: 26000000, iron: 6600000, fireCrystals: 120, time: 1728000, rfc: 40 }, // FC8
    71: { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000, fireCrystals: 280, time: 1123200, rfc: 30 },
    72: { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000, fireCrystals: 280, time: 1123200, rfc: 30 },
    73: { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000, fireCrystals: 280, time: 1123200, rfc: 30 },
    74: { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000, fireCrystals: 280, time: 1123200, rfc: 30 },
    75: { meat: 140000000, wood: 140000000, coal: 29000000, iron: 7200000, fireCrystals: 140, time: 1123200, rfc: 60 }, //FC9
    76: { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8400000, fireCrystals: 350, time: 1728000, rfc: 70 },
    77: { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8400000, fireCrystals: 350, time: 1728000, rfc: 70 },
    78: { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8400000, fireCrystals: 350, time: 1728000, rfc: 70 },
    79: { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8400000, fireCrystals: 350, time: 1728000, rfc: 70 },
    80: { meat: 160000000, wood: 160000000, coal: 33000000, iron: 8400000, fireCrystals: 174, time: 1728000, rfc: 140 } //FC10
        }
    },
    embassy: {
        name: "Embassy",
        resources: ["meat", "wood", "coal", "iron", "fireCrystals", "time","rfc" ],
        data: {
        
        
                1: { meat: 0, wood: 60, coal: 0, iron: 0, fireCrystals: 0, time: 2, rfc: 0 },
                2: { meat: 0, wood: 90, coal: 0, iron: 0, fireCrystals: 0, time: 10, rfc: 0 },
                3: { meat: 0, wood: 400, coal: 0, iron: 0, fireCrystals: 0, time: 60, rfc: 0 },
                4: { meat: 0, wood: 900, coal: 180, iron: 0, fireCrystals: 0, time: 120, rfc: 0 },
                5: { meat: 0, wood: 3800, coal: 760, iron: 0, fireCrystals: 0, time: 400, rfc: 0 },
                6: { meat: 0, wood: 9600, coal: 1900, iron: 0, fireCrystals: 0, time: 800, rfc: 0 },
                7: { meat: 0, wood: 34000, coal: 6900, iron: 1700, fireCrystals: 0, time: 1500, rfc: 0 },
                8: { meat: 0, wood: 63000, coal: 12000, iron: 3100, fireCrystals: 0, time: 2700, rfc: 0 },
                9: { meat: 0, wood: 130000, coal: 26000, iron: 6500, fireCrystals: 0, time: 7200, rfc: 0 },
                10: { meat: 0, wood: 230000, coal: 46000, iron: 11000, fireCrystals: 0, time: 14250, rfc: 0 },
                11: { meat: 260000, wood: 260000, coal: 52000, iron: 13000, fireCrystals: 0, time: 17820, rfc: 0 },
                12: { meat: 330000, wood: 330000, coal: 67000, iron: 16000, fireCrystals: 0, time: 21360, rfc: 0 },
                13: { meat: 470000, wood: 470000, coal: 95000, iron: 23000, fireCrystals: 0, time: 26130, rfc: 0 },
                14: { meat: 630000, wood: 630000, coal: 120000, iron: 31000, fireCrystals: 0, time: 33240, rfc: 0 },
                15: { meat: 930000, wood: 930000, coal: 180000, iron: 46000, fireCrystals: 0, time: 42750, rfc: 0 },
                16: { meat: 1100000, wood: 1100000, coal: 230000, iron: 59000, fireCrystals: 0, time: 72420, rfc: 0 },
                17: { meat: 1800000, wood: 1800000, coal: 370000, iron: 93000, fireCrystals: 0, time: 86880, rfc: 0 },
                18: { meat: 2500000, wood: 2500000, coal: 500000, iron: 120000, fireCrystals: 0, time: 104280, rfc: 0 },
                19: { meat: 3100000, wood: 3100000, coal: 620000, iron: 150000, fireCrystals: 0, time: 156420, rfc: 0 },
                20: { meat: 4300000, wood: 4300000, coal: 860000, iron: 210000, fireCrystals: 0, time: 195540, rfc: 0 },
                21: { meat: 5400000, wood: 5400000, coal: 1000000, iron: 270000, fireCrystals: 0, time: 254160, rfc: 0 },
                22: { meat: 7200000, wood: 7200000, coal: 1400000, iron: 360000, fireCrystals: 0, time: 381300, rfc: 0 },
                23: { meat: 8900000, wood: 8900000, coal: 1700000, iron: 440000, fireCrystals: 0, time: 533820, rfc: 0 },
                24: { meat: 12000000, wood: 12000000, coal: 2400000, iron: 600000, fireCrystals: 0, time: 747360, rfc: 0 },
                25: { meat: 16000000, wood: 16000000, coal: 3200000, iron: 810000, fireCrystals: 0, time: 1046280, rfc: 0 },
                26: { meat: 21000000, wood: 21000000, coal: 4200000, iron: 1000000, fireCrystals: 0, time: 1203240, rfc: 0 },
                27: { meat: 29000000, wood: 29000000, coal: 5900000, iron: 1400000, fireCrystals: 0, time: 1443900, rfc: 0 },
                28: { meat: 39000000, wood: 39000000, coal: 7900000, iron: 1900000, fireCrystals: 0, time: 1660500, rfc: 0 },
                29: { meat: 49000000, wood: 49000000, coal: 9800000, iron: 2400000, fireCrystals: 0, time: 1909560, rfc: 0 },
                30: { meat: 60000000, wood: 60000000, coal: 12000000, iron: 3000000, fireCrystals: 0, time: 2291520, rfc: 0 },
                31: { meat: 13000000, wood: 13000000, coal: 2700000, iron: 670000, fireCrystals: 33, time: 399120, rfc: 0 },
                32: { meat: 13000000, wood: 13000000, coal: 2700000, iron: 670000, fireCrystals: 33, time: 399120, rfc: 0 },
                33: { meat: 13000000, wood: 13000000, coal: 2700000, iron: 670000, fireCrystals: 33, time: 399120, rfc: 0 },
                34: { meat: 13000000, wood: 13000000, coal: 2700000, iron: 670000, fireCrystals: 33, time: 399120, rfc: 0 },
                35: { meat: 13000000, wood: 13000000, coal: 2700000, iron: 670000, fireCrystals: 33, time: 399120, rfc: 0 },
                36: { meat: 14000000, wood: 14000000, coal: 2900000, iron: 720000, fireCrystals: 39, time: 513180, rfc: 0 },
                37: { meat: 14000000, wood: 14000000, coal: 2900000, iron: 720000, fireCrystals: 39, time: 513180, rfc: 0 },
                38: { meat: 14000000, wood: 14000000, coal: 2900000, iron: 720000, fireCrystals: 39, time: 513180, rfc: 0 },
                39: { meat: 14000000, wood: 14000000, coal: 2900000, iron: 720000, fireCrystals: 39, time: 513180, rfc: 0 },
                40: { meat: 14000000, wood: 14000000, coal: 2900000, iron: 720000, fireCrystals: 39, time: 513180, rfc: 0 },
                41: { meat: 15000000, wood: 15000000, coal: 3100000, iron: 790000, fireCrystals: 59, time: 627240, rfc: 0 },
                42: { meat: 15000000, wood: 15000000, coal: 3100000, iron: 790000, fireCrystals: 59, time: 627240, rfc: 0 },
                43: { meat: 15000000, wood: 15000000, coal: 3100000, iron: 790000, fireCrystals: 59, time: 627240, rfc: 0 },
                44: { meat: 15000000, wood: 15000000, coal: 3100000, iron: 790000, fireCrystals: 59, time: 627240, rfc: 0 },
                45: { meat: 15000000, wood: 15000000, coal: 3100000, iron: 790000, fireCrystals: 59, time: 627240, rfc: 0 },
                46: { meat: 16000000, wood: 16000000, coal: 3200000, iron: 820000, fireCrystals: 70, time: 684240, rfc: 0 },
                47: { meat: 16000000, wood: 16000000, coal: 3200000, iron: 820000, fireCrystals: 70, time: 684240, rfc: 0 },
                48: { meat: 16000000, wood: 16000000, coal: 3200000, iron: 820000, fireCrystals: 70, time: 684240, rfc: 0 },
                49: { meat: 16000000, wood: 16000000, coal: 3200000, iron: 820000, fireCrystals: 70, time: 684240, rfc: 0 },
                50: { meat: 16000000, wood: 16000000, coal: 3200000, iron: 820000, fireCrystals: 70, time: 684240, rfc: 0 },
                51: { meat: 16000000, wood: 16000000, coal: 3300000, iron: 840000, fireCrystals: 83, time: 798300, rfc: 0 },
                52: { meat: 16000000, wood: 16000000, coal: 3300000, iron: 840000, fireCrystals: 83, time: 798300, rfc: 0 },
                53: { meat: 16000000, wood: 16000000, coal: 3300000, iron: 840000, fireCrystals: 83, time: 798300, rfc: 0 },
                54: { meat: 16000000, wood: 16000000, coal: 3300000, iron: 840000, fireCrystals: 83, time: 798300, rfc: 0 },
                55: { meat: 16000000, wood: 16000000, coal: 3300000, iron: 840000, fireCrystals: 83, time: 798300, rfc: 0 },
                56: { meat: 19000000, wood: 19000000, coal: 38000000, iron: 960000, fireCrystals: 50, time: 855360, rfc: 2 },
                57: { meat: 19000000, wood: 19000000, coal: 38000000, iron: 960000, fireCrystals: 50, time: 855360, rfc: 2 },
                58: { meat: 19000000, wood: 19000000, coal: 38000000, iron: 960000, fireCrystals: 50, time: 855360, rfc: 2 },
                59: { meat: 19000000, wood: 19000000, coal: 38000000, iron: 960000, fireCrystals: 50, time: 855360, rfc: 2 },
                60: { meat: 19000000, wood: 19000000, coal: 38000000, iron: 960000, fireCrystals: 25, time: 855360, rfc: 5 },
                61: { meat: 21000000, wood: 21000000, coal: 4300000, iron: 1000000, fireCrystals: 60, time: 1026420, rfc: 3 },
                62: { meat: 21000000, wood: 21000000, coal: 4300000, iron: 1000000, fireCrystals: 60, time: 1026420, rfc: 3 },
                63: { meat: 21000000, wood: 21000000, coal: 4300000, iron: 1000000, fireCrystals: 60, time: 1026420, rfc: 3 },
                64: { meat: 21000000, wood: 21000000, coal: 4300000, iron: 1000000, fireCrystals: 60, time: 1026420, rfc: 3 },
                65: { meat: 21000000, wood: 21000000, coal: 4300000, iron: 1000000, fireCrystals: 30, time: 1026420, rfc: 7 },
                66: { meat: 26000000, wood: 26000000, coal: 5300000, iron: 1300000, fireCrystals: 60, time: 1140480, rfc: 5 },
                67: { meat: 26000000, wood: 26000000, coal: 5300000, iron: 1300000, fireCrystals: 60, time: 1140480, rfc: 5 },
                68: { meat: 26000000, wood: 26000000, coal: 5300000, iron: 1300000, fireCrystals: 60, time: 1140480, rfc: 5 },
                69: { meat: 26000000, wood: 26000000, coal: 5300000, iron: 1300000, fireCrystals: 60, time: 1140480, rfc: 5 },
                70: { meat: 26000000, wood: 26000000, coal: 5300000, iron: 1300000, fireCrystals: 30, time: 1140480, rfc: 10 },
                71: { meat: 29000000, wood: 29000000, coal: 5800000, iron: 1400000, fireCrystals: 70, time: 741300, rfc: 7 },
                72: { meat: 29000000, wood: 29000000, coal: 5800000, iron: 1400000, fireCrystals: 70, time: 741300, rfc: 7 },
                73: { meat: 29000000, wood: 29000000, coal: 5800000, iron: 1400000, fireCrystals: 70, time: 741300, rfc: 7 },
                74: { meat: 29000000, wood: 29000000, coal: 5800000, iron: 1400000, fireCrystals: 70, time: 741300, rfc: 7 },
                75: { meat: 29000000, wood: 29000000, coal: 5800000, iron: 1400000, fireCrystals: 35, time: 741300, rfc: 15 },
                76: { meat: 33000000, wood: 33000000, coal: 6700000, iron: 1600000, fireCrystals: 87, time: 1140480, rfc: 17 },
                77: { meat: 33000000, wood: 33000000, coal: 6700000, iron: 1600000, fireCrystals: 87, time: 1140480, rfc: 17 },
                78: { meat: 33000000, wood: 33000000, coal: 6700000, iron: 1600000, fireCrystals: 87, time: 1140480, rfc: 17 },
                79: { meat: 33000000, wood: 33000000, coal: 6700000, iron: 1600000, fireCrystals: 87, time: 1140480, rfc: 17 },
                80: { meat: 33000000, wood: 33000000, coal: 6700000, iron: 1600000, fireCrystals: 43, time: 1140480, rfc: 35 }
           
            
        }
    },
    infantry: {
        name: "Infantry Camp",
        resources: ["meat", "wood", "coal", "iron", "fireCrystals", "time","rfc" ],
        data: {
          
                1: { meat: 0, wood: 95, coal: 0, iron: 0, fireCrystals: 0, time: 2, rfc: 0 },
                2: { meat: 0, wood: 140, coal: 0, iron: 0, fireCrystals: 0, time: 9, rfc: 0 },
                3: { meat: 0, wood: 645, coal: 0, iron: 0, fireCrystals: 0, time: 45, rfc: 0 },
                4: { meat: 0, wood: 1400, coal: 285, iron: 0, fireCrystals: 0, time: 135, rfc: 0 },
                5: { meat: 0, wood: 6000, coal: 1200, iron: 0, fireCrystals: 0, time: 270, rfc: 0 },
                6: { meat: 0, wood: 15000, coal: 3000, iron: 765, fireCrystals: 0, time: 540, rfc: 0 },
                7: { meat: 0, wood: 55000, coal: 11000, iron: 2700, fireCrystals: 0, time: 1080, rfc: 0 },
                8: { meat: 0, wood: 100000, coal: 20000, iron: 5000, fireCrystals: 0, time: 1620, rfc: 0 },
                9: { meat: 0, wood: 200000, coal: 41000, iron: 10000, fireCrystals: 0, time: 2430, rfc: 0 },
                10: { meat: 0, wood: 360000, coal: 73000, iron: 18000, fireCrystals: 0, time: 3240, rfc: 0 },
                11: { meat: 460000, wood: 460000, coal: 92000, iron: 23000, fireCrystals: 0, time: 4050, rfc: 0 },
                12: { meat: 580000, wood: 580000, coal: 110000, iron: 29000, fireCrystals: 0, time: 4860, rfc: 0 },
                13: { meat: 830000, wood: 830000, coal: 160000, iron: 41000, fireCrystals: 0, time: 5940, rfc: 0 },
                14: { meat: 1100000, wood: 1100000, coal: 220000, iron: 55000, fireCrystals: 0, time: 7560, rfc: 0 },
                15: { meat: 1600000, wood: 1600000, coal: 320000, iron: 81000, fireCrystals: 0, time: 9720, rfc: 0 },
                16: { meat: 2000000, wood: 2000000, coal: 410000, iron: 100000, fireCrystals: 0, time: 16440, rfc: 0 },
                17: { meat: 3200000, wood: 3200000, coal: 650000, iron: 160000, fireCrystals: 0, time: 19740, rfc: 0 },
                18: { meat: 4300000, wood: 4300000, coal: 870000, iron: 210000, fireCrystals: 0, time: 23700, rfc: 0 },
                19: { meat: 5400000, wood: 5400000, coal: 1000000, iron: 270000, fireCrystals: 0, time: 35550, rfc: 0 },
                20: { meat: 7500000, wood: 7500000, coal: 1500000, iron: 370000, fireCrystals: 0, time: 44430, rfc: 0 },
                21: { meat: 9500000, wood: 9500000, coal: 1900000, iron: 470000, fireCrystals: 0, time: 57750, rfc: 0 },
                22: { meat: 12000000, wood: 12000000, coal: 2500000, iron: 630000, fireCrystals: 0, time: 86640, rfc: 0 },
                23: { meat: 15000000, wood: 15000000, coal: 3100000, iron: 780000, fireCrystals: 0, time: 121320, rfc: 0 },
                24: { meat: 21000000, wood: 21000000, coal: 4200000, iron: 1000000, fireCrystals: 0, time: 169860, rfc: 0 },
                25: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000, fireCrystals: 0, time: 237780, rfc: 0 },
                26: { meat: 36000000, wood: 36000000, coal: 7300000, iron: 1800000, fireCrystals: 0, time: 273420, rfc: 0 },
                27: { meat: 52000000, wood: 52000000, coal: 10000000, iron: 2600000, fireCrystals: 0, time: 328140, rfc: 0 },
                28: { meat: 69000000, wood: 69000000, coal: 13000000, iron: 3400000, fireCrystals: 0, time: 377340, rfc: 0 },
                29: { meat: 86000000, wood: 86000000, coal: 17000000, iron: 4300000, fireCrystals: 0, time: 433980, rfc: 0 },
                30: { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5200000, fireCrystals: 0, time: 520800, rfc: 0 },
                31: { meat: 23000000, wood: 23000000, coal: 4700000, iron: 1100000, fireCrystals: 59, time: 90720, rfc: 0 },
                32: { meat: 23000000, wood: 23000000, coal: 4700000, iron: 1100000, fireCrystals: 59, time: 90720, rfc: 0 },
                33: { meat: 23000000, wood: 23000000, coal: 4700000, iron: 1100000, fireCrystals: 59, time: 90720, rfc: 0 },
                34: { meat: 23000000, wood: 23000000, coal: 4700000, iron: 1100000, fireCrystals: 59, time: 90720, rfc: 0 },
                35: { meat: 23000000, wood: 23000000, coal: 4700000, iron: 1100000, fireCrystals: 59, time: 90720, rfc: 0 },
                36: { meat: 25000000, wood: 25000000, coal: 5000000, iron: 1200000, fireCrystals: 71, time: 116640, rfc: 0 },
                37: { meat: 25000000, wood: 25000000, coal: 5000000, iron: 1200000, fireCrystals: 71, time: 116640, rfc: 0 },
                38: { meat: 25000000, wood: 25000000, coal: 5000000, iron: 1200000, fireCrystals: 71, time: 116640, rfc: 0 },
                39: { meat: 25000000, wood: 25000000, coal: 5000000, iron: 1200000, fireCrystals: 71, time: 116640, rfc: 0 },
                40: { meat: 25000000, wood: 25000000, coal: 5000000, iron: 1200000, fireCrystals: 71, time: 116640, rfc: 0 },
                41: { meat: 27000000, wood: 27000000, coal: 5500000, iron: 1300000, fireCrystals: 107, time: 142560, rfc: 0 },
                42: { meat: 27000000, wood: 27000000, coal: 5500000, iron: 1300000, fireCrystals: 107, time: 142560, rfc: 0 },
                43: { meat: 27000000, wood: 27000000, coal: 5500000, iron: 1300000, fireCrystals: 107, time: 142560, rfc: 0 },
                44: { meat: 27000000, wood: 27000000, coal: 5500000, iron: 1300000, fireCrystals: 107, time: 142560, rfc: 0 },
                45: { meat: 27000000, wood: 27000000, coal: 5500000, iron: 1300000, fireCrystals: 107, time: 142560, rfc: 0 },
                46: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000, fireCrystals: 126, time: 155520, rfc: 0 },
                47: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000, fireCrystals: 126, time: 155520, rfc: 0 },
                48: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000, fireCrystals: 126, time: 155520, rfc: 0 },
                49: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000, fireCrystals: 126, time: 155520, rfc: 0 },
                50: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000, fireCrystals: 126, time: 155520, rfc: 0 },
                51: { meat: 29000000, wood: 29000000, coal: 5900000, iron: 1400000, fireCrystals: 150, time: 181440, rfc: 0 },
                52: { meat: 29000000, wood: 29000000, coal: 5900000, iron: 1400000, fireCrystals: 150, time: 181440, rfc: 0 },
                53: { meat: 29000000, wood: 29000000, coal: 5900000, iron: 1400000, fireCrystals: 150, time: 181440, rfc: 0 },
                54: { meat: 29000000, wood: 29000000, coal: 5900000, iron: 1400000, fireCrystals: 150, time: 181440, rfc: 0 },
                55: { meat: 29000000, wood: 29000000, coal: 5900000, iron: 1400000, fireCrystals: 150, time: 181440, rfc: 0 },
                56: { meat: 33000000, wood: 33000000, coal: 6700000, iron: 1600000, fireCrystals: 90, time: 194400, rfc: 4 },
                57: { meat: 33000000, wood: 33000000, coal: 6700000, iron: 1600000, fireCrystals: 90, time: 194400, rfc: 4 },
                58: { meat: 33000000, wood: 33000000, coal: 6700000, iron: 1600000, fireCrystals: 90, time: 194400, rfc: 4 },
                59: { meat: 33000000, wood: 33000000, coal: 6700000, iron: 1600000, fireCrystals: 90, time: 194400, rfc: 4 },
                60: { meat: 33000000, wood: 33000000, coal: 6700000, iron: 1600000, fireCrystals: 45, time: 194400, rfc: 9 },
                61: { meat: 38000000, wood: 38000000, coal: 7600000, iron: 1900000, fireCrystals: 108, time: 233280, rfc: 6 },
                62: { meat: 38000000, wood: 38000000, coal: 7600000, iron: 1900000, fireCrystals: 108, time: 233280, rfc: 6 },
                63: { meat: 38000000, wood: 38000000, coal: 7600000, iron: 1900000, fireCrystals: 108, time: 233280, rfc: 6 },
                64: { meat: 38000000, wood: 38000000, coal: 7600000, iron: 1900000, fireCrystals: 108, time: 233280, rfc: 6 },
                65: { meat: 38000000, wood: 38000000, coal: 7600000, iron: 1900000, fireCrystals: 54, time: 233280, rfc: 13 },
                66: { meat: 46000000, wood: 46000000, coal: 9300000, iron: 2300000, fireCrystals: 108, time: 259200, rfc: 9 },
                67: { meat: 46000000, wood: 46000000, coal: 9300000, iron: 2300000, fireCrystals: 108, time: 259200, rfc: 9 },
                68: { meat: 46000000, wood: 46000000, coal: 9300000, iron: 2300000, fireCrystals: 108, time: 259200, rfc: 9 },
                69: { meat: 46000000, wood: 46000000, coal: 9300000, iron: 2300000, fireCrystals: 108, time: 259200, rfc: 9 },
                70: { meat: 46000000, wood: 46000000, coal: 9300000, iron: 2300000, fireCrystals: 54, time: 259200, rfc: 18 },
                71: { meat: 50000000, wood: 50000000, coal: 10000000, iron: 2500000, fireCrystals: 126, time: 168480, rfc: 13 },
                72: { meat: 50000000, wood: 50000000, coal: 10000000, iron: 2500000, fireCrystals: 126, time: 168480, rfc: 13 },
                73: { meat: 50000000, wood: 50000000, coal: 10000000, iron: 2500000, fireCrystals: 126, time: 168480, rfc: 13 },
                74: { meat: 50000000, wood: 50000000, coal: 10000000, iron: 2500000, fireCrystals: 126, time: 168480, rfc: 13 },
                75: { meat: 50000000, wood: 50000000, coal: 10000000, iron: 2500000, fireCrystals: 63, time: 168480, rfc: 27 },
                76: { meat: 59000000, wood: 59000000, coal: 11000000, iron: 2900000, fireCrystals: 157, time: 259200, rfc: 31 },
                77: { meat: 59000000, wood: 59000000, coal: 11000000, iron: 2900000, fireCrystals: 157, time: 259200, rfc: 31 },
                78: { meat: 59000000, wood: 59000000, coal: 11000000, iron: 2900000, fireCrystals: 157, time: 259200, rfc: 31 },
                79: { meat: 59000000, wood: 59000000, coal: 11000000, iron: 2900000, fireCrystals: 157, time: 259200, rfc: 31 },
                80: { meat: 59000000, wood: 59000000, coal: 11000000, iron: 2900000, fireCrystals: 78, time: 259200, rfc: 63 }
            
         
            
        }
    },
    lancer: {
        name: "Lancer Camp",
        resources: ["meat", "wood", "coal", "iron", "fireCrystals", "time","rfc" ],
        data: {
            1: { meat: 0, wood: 95, coal: 0, iron: 0, fireCrystals: 0, time: 2, rfc: 0 },
            2: { meat: 0, wood: 140, coal: 0, iron: 0, fireCrystals: 0, time: 9, rfc: 0 },
            3: { meat: 0, wood: 645, coal: 0, iron: 0, fireCrystals: 0, time: 45, rfc: 0 },
            4: { meat: 0, wood: 1400, coal: 285, iron: 0, fireCrystals: 0, time: 135, rfc: 0 },
            5: { meat: 0, wood: 6000, coal: 1200, iron: 0, fireCrystals: 0, time: 270, rfc: 0 },
            6: { meat: 0, wood: 15000, coal: 3000, iron: 765, fireCrystals: 0, time: 540, rfc: 0 },
            7: { meat: 0, wood: 55000, coal: 11000, iron: 2700, fireCrystals: 0, time: 1080, rfc: 0 },
            8: { meat: 0, wood: 100000, coal: 20000, iron: 5000, fireCrystals: 0, time: 1620, rfc: 0 },
            9: { meat: 0, wood: 200000, coal: 41000, iron: 10000, fireCrystals: 0, time: 2430, rfc: 0 },
            10: { meat: 0, wood: 360000, coal: 73000, iron: 18000, fireCrystals: 0, time: 3240, rfc: 0 },
            11: { meat: 460000, wood: 460000, coal: 92000, iron: 23000, fireCrystals: 0, time: 4050, rfc: 0 },
            12: { meat: 580000, wood: 580000, coal: 110000, iron: 29000, fireCrystals: 0, time: 4860, rfc: 0 },
            13: { meat: 830000, wood: 830000, coal: 160000, iron: 41000, fireCrystals: 0, time: 5940, rfc: 0 },
            14: { meat: 1100000, wood: 1100000, coal: 220000, iron: 55000, fireCrystals: 0, time: 7560, rfc: 0 },
            15: { meat: 1600000, wood: 1600000, coal: 320000, iron: 81000, fireCrystals: 0, time: 9720, rfc: 0 },
            16: { meat: 2000000, wood: 2000000, coal: 410000, iron: 100000, fireCrystals: 0, time: 16440, rfc: 0 },
            17: { meat: 3200000, wood: 3200000, coal: 650000, iron: 160000, fireCrystals: 0, time: 19740, rfc: 0 },
            18: { meat: 4300000, wood: 4300000, coal: 870000, iron: 210000, fireCrystals: 0, time: 23700, rfc: 0 },
            19: { meat: 5400000, wood: 5400000, coal: 1000000, iron: 270000, fireCrystals: 0, time: 35550, rfc: 0 },
            20: { meat: 7500000, wood: 7500000, coal: 1500000, iron: 370000, fireCrystals: 0, time: 44430, rfc: 0 },
            21: { meat: 9500000, wood: 9500000, coal: 1900000, iron: 470000, fireCrystals: 0, time: 57750, rfc: 0 },
            22: { meat: 12000000, wood: 12000000, coal: 2500000, iron: 630000, fireCrystals: 0, time: 86640, rfc: 0 },
            23: { meat: 15000000, wood: 15000000, coal: 3100000, iron: 780000, fireCrystals: 0, time: 121320, rfc: 0 },
            24: { meat: 21000000, wood: 21000000, coal: 4200000, iron: 1000000, fireCrystals: 0, time: 169860, rfc: 0 },
            25: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000, fireCrystals: 0, time: 237780, rfc: 0 },
            26: { meat: 36000000, wood: 36000000, coal: 7300000, iron: 1800000, fireCrystals: 0, time: 273420, rfc: 0 },
            27: { meat: 52000000, wood: 52000000, coal: 10000000, iron: 2600000, fireCrystals: 0, time: 328140, rfc: 0 },
            28: { meat: 69000000, wood: 69000000, coal: 13000000, iron: 3400000, fireCrystals: 0, time: 377340, rfc: 0 },
            29: { meat: 86000000, wood: 86000000, coal: 17000000, iron: 4300000, fireCrystals: 0, time: 433980, rfc: 0 },
            30: { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5200000, fireCrystals: 0, time: 520800, rfc: 0 },
            31: { meat: 23000000, wood: 23000000, coal: 4700000, iron: 1100000, fireCrystals: 59, time: 90720, rfc: 0 },
            32: { meat: 23000000, wood: 23000000, coal: 4700000, iron: 1100000, fireCrystals: 59, time: 90720, rfc: 0 },
            33: { meat: 23000000, wood: 23000000, coal: 4700000, iron: 1100000, fireCrystals: 59, time: 90720, rfc: 0 },
            34: { meat: 23000000, wood: 23000000, coal: 4700000, iron: 1100000, fireCrystals: 59, time: 90720, rfc: 0 },
            35: { meat: 23000000, wood: 23000000, coal: 4700000, iron: 1100000, fireCrystals: 59, time: 90720, rfc: 0 },
            36: { meat: 25000000, wood: 25000000, coal: 5000000, iron: 1200000, fireCrystals: 71, time: 116640, rfc: 0 },
            37: { meat: 25000000, wood: 25000000, coal: 5000000, iron: 1200000, fireCrystals: 71, time: 116640, rfc: 0 },
            38: { meat: 25000000, wood: 25000000, coal: 5000000, iron: 1200000, fireCrystals: 71, time: 116640, rfc: 0 },
            39: { meat: 25000000, wood: 25000000, coal: 5000000, iron: 1200000, fireCrystals: 71, time: 116640, rfc: 0 },
            40: { meat: 25000000, wood: 25000000, coal: 5000000, iron: 1200000, fireCrystals: 71, time: 116640, rfc: 0 },
            41: { meat: 27000000, wood: 27000000, coal: 5500000, iron: 1300000, fireCrystals: 107, time: 142560, rfc: 0 },
            42: { meat: 27000000, wood: 27000000, coal: 5500000, iron: 1300000, fireCrystals: 107, time: 142560, rfc: 0 },
            43: { meat: 27000000, wood: 27000000, coal: 5500000, iron: 1300000, fireCrystals: 107, time: 142560, rfc: 0 },
            44: { meat: 27000000, wood: 27000000, coal: 5500000, iron: 1300000, fireCrystals: 107, time: 142560, rfc: 0 },
            45: { meat: 27000000, wood: 27000000, coal: 5500000, iron: 1300000, fireCrystals: 107, time: 142560, rfc: 0 },
            46: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000, fireCrystals: 126, time: 155520, rfc: 0 },
            47: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000, fireCrystals: 126, time: 155520, rfc: 0 },
            48: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000, fireCrystals: 126, time: 155520, rfc: 0 },
            49: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000, fireCrystals: 126, time: 155520, rfc: 0 },
            50: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000, fireCrystals: 126, time: 155520, rfc: 0 },
            51: { meat: 29000000, wood: 29000000, coal: 5900000, iron: 1400000, fireCrystals: 150, time: 181440, rfc: 0 },
            52: { meat: 29000000, wood: 29000000, coal: 5900000, iron: 1400000, fireCrystals: 150, time: 181440, rfc: 0 },
            53: { meat: 29000000, wood: 29000000, coal: 5900000, iron: 1400000, fireCrystals: 150, time: 181440, rfc: 0 },
            54: { meat: 29000000, wood: 29000000, coal: 5900000, iron: 1400000, fireCrystals: 150, time: 181440, rfc: 0 },
            55: { meat: 29000000, wood: 29000000, coal: 5900000, iron: 1400000, fireCrystals: 150, time: 181440, rfc: 0 },
            56: { meat: 33000000, wood: 33000000, coal: 6700000, iron: 1600000, fireCrystals: 90, time: 194400, rfc: 4 },
            57: { meat: 33000000, wood: 33000000, coal: 6700000, iron: 1600000, fireCrystals: 90, time: 194400, rfc: 4 },
            58: { meat: 33000000, wood: 33000000, coal: 6700000, iron: 1600000, fireCrystals: 90, time: 194400, rfc: 4 },
            59: { meat: 33000000, wood: 33000000, coal: 6700000, iron: 1600000, fireCrystals: 90, time: 194400, rfc: 4 },
            60: { meat: 33000000, wood: 33000000, coal: 6700000, iron: 1600000, fireCrystals: 45, time: 194400, rfc: 9 },
            61: { meat: 38000000, wood: 38000000, coal: 7600000, iron: 1900000, fireCrystals: 108, time: 233280, rfc: 6 },
            62: { meat: 38000000, wood: 38000000, coal: 7600000, iron: 1900000, fireCrystals: 108, time: 233280, rfc: 6 },
            63: { meat: 38000000, wood: 38000000, coal: 7600000, iron: 1900000, fireCrystals: 108, time: 233280, rfc: 6 },
            64: { meat: 38000000, wood: 38000000, coal: 7600000, iron: 1900000, fireCrystals: 108, time: 233280, rfc: 6 },
            65: { meat: 38000000, wood: 38000000, coal: 7600000, iron: 1900000, fireCrystals: 54, time: 233280, rfc: 13 },
            66: { meat: 46000000, wood: 46000000, coal: 9300000, iron: 2300000, fireCrystals: 108, time: 259200, rfc: 9 },
            67: { meat: 46000000, wood: 46000000, coal: 9300000, iron: 2300000, fireCrystals: 108, time: 259200, rfc: 9 },
            68: { meat: 46000000, wood: 46000000, coal: 9300000, iron: 2300000, fireCrystals: 108, time: 259200, rfc: 9 },
            69: { meat: 46000000, wood: 46000000, coal: 9300000, iron: 2300000, fireCrystals: 108, time: 259200, rfc: 9 },
            70: { meat: 46000000, wood: 46000000, coal: 9300000, iron: 2300000, fireCrystals: 54, time: 259200, rfc: 18 },
            71: { meat: 50000000, wood: 50000000, coal: 10000000, iron: 2500000, fireCrystals: 126, time: 168480, rfc: 13 },
            72: { meat: 50000000, wood: 50000000, coal: 10000000, iron: 2500000, fireCrystals: 126, time: 168480, rfc: 13 },
            73: { meat: 50000000, wood: 50000000, coal: 10000000, iron: 2500000, fireCrystals: 126, time: 168480, rfc: 13 },
            74: { meat: 50000000, wood: 50000000, coal: 10000000, iron: 2500000, fireCrystals: 126, time: 168480, rfc: 13 },
            75: { meat: 50000000, wood: 50000000, coal: 10000000, iron: 2500000, fireCrystals: 63, time: 168480, rfc: 27 },
            76: { meat: 59000000, wood: 59000000, coal: 11000000, iron: 2900000, fireCrystals: 157, time: 259200, rfc: 31 },
            77: { meat: 59000000, wood: 59000000, coal: 11000000, iron: 2900000, fireCrystals: 157, time: 259200, rfc: 31 },
            78: { meat: 59000000, wood: 59000000, coal: 11000000, iron: 2900000, fireCrystals: 157, time: 259200, rfc: 31 },
            79: { meat: 59000000, wood: 59000000, coal: 11000000, iron: 2900000, fireCrystals: 157, time: 259200, rfc: 31 },
            80: { meat: 59000000, wood: 59000000, coal: 11000000, iron: 2900000, fireCrystals: 78, time: 259200, rfc: 63 }
     
        }
    },
    marksmen: {
        name: "Marksmen Camp",
        resources: ["meat", "wood", "coal", "iron", "fireCrystals", "time","rfc" ],
        data: {
            
            1: { meat: 0, wood: 95, coal: 0, iron: 0, fireCrystals: 0, time: 2, rfc: 0 },
            2: { meat: 0, wood: 140, coal: 0, iron: 0, fireCrystals: 0, time: 9, rfc: 0 },
            3: { meat: 0, wood: 645, coal: 0, iron: 0, fireCrystals: 0, time: 45, rfc: 0 },
            4: { meat: 0, wood: 1400, coal: 285, iron: 0, fireCrystals: 0, time: 135, rfc: 0 },
            5: { meat: 0, wood: 6000, coal: 1200, iron: 0, fireCrystals: 0, time: 270, rfc: 0 },
            6: { meat: 0, wood: 15000, coal: 3000, iron: 765, fireCrystals: 0, time: 540, rfc: 0 },
            7: { meat: 0, wood: 55000, coal: 11000, iron: 2700, fireCrystals: 0, time: 1080, rfc: 0 },
            8: { meat: 0, wood: 100000, coal: 20000, iron: 5000, fireCrystals: 0, time: 1620, rfc: 0 },
            9: { meat: 0, wood: 200000, coal: 41000, iron: 10000, fireCrystals: 0, time: 2430, rfc: 0 },
            10: { meat: 0, wood: 360000, coal: 73000, iron: 18000, fireCrystals: 0, time: 3240, rfc: 0 },
            11: { meat: 460000, wood: 460000, coal: 92000, iron: 23000, fireCrystals: 0, time: 4050, rfc: 0 },
            12: { meat: 580000, wood: 580000, coal: 110000, iron: 29000, fireCrystals: 0, time: 4860, rfc: 0 },
            13: { meat: 830000, wood: 830000, coal: 160000, iron: 41000, fireCrystals: 0, time: 5940, rfc: 0 },
            14: { meat: 1100000, wood: 1100000, coal: 220000, iron: 55000, fireCrystals: 0, time: 7560, rfc: 0 },
            15: { meat: 1600000, wood: 1600000, coal: 320000, iron: 81000, fireCrystals: 0, time: 9720, rfc: 0 },
            16: { meat: 2000000, wood: 2000000, coal: 410000, iron: 100000, fireCrystals: 0, time: 16440, rfc: 0 },
            17: { meat: 3200000, wood: 3200000, coal: 650000, iron: 160000, fireCrystals: 0, time: 19740, rfc: 0 },
            18: { meat: 4300000, wood: 4300000, coal: 870000, iron: 210000, fireCrystals: 0, time: 23700, rfc: 0 },
            19: { meat: 5400000, wood: 5400000, coal: 1000000, iron: 270000, fireCrystals: 0, time: 35550, rfc: 0 },
            20: { meat: 7500000, wood: 7500000, coal: 1500000, iron: 370000, fireCrystals: 0, time: 44430, rfc: 0 },
            21: { meat: 9500000, wood: 9500000, coal: 1900000, iron: 470000, fireCrystals: 0, time: 57750, rfc: 0 },
            22: { meat: 12000000, wood: 12000000, coal: 2500000, iron: 630000, fireCrystals: 0, time: 86640, rfc: 0 },
            23: { meat: 15000000, wood: 15000000, coal: 3100000, iron: 780000, fireCrystals: 0, time: 121320, rfc: 0 },
            24: { meat: 21000000, wood: 21000000, coal: 4200000, iron: 1000000, fireCrystals: 0, time: 169860, rfc: 0 },
            25: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000, fireCrystals: 0, time: 237780, rfc: 0 },
            26: { meat: 36000000, wood: 36000000, coal: 7300000, iron: 1800000, fireCrystals: 0, time: 273420, rfc: 0 },
            27: { meat: 52000000, wood: 52000000, coal: 10000000, iron: 2600000, fireCrystals: 0, time: 328140, rfc: 0 },
            28: { meat: 69000000, wood: 69000000, coal: 13000000, iron: 3400000, fireCrystals: 0, time: 377340, rfc: 0 },
            29: { meat: 86000000, wood: 86000000, coal: 17000000, iron: 4300000, fireCrystals: 0, time: 433980, rfc: 0 },
            30: { meat: 100000000, wood: 100000000, coal: 21000000, iron: 5200000, fireCrystals: 0, time: 520800, rfc: 0 },
            31: { meat: 23000000, wood: 23000000, coal: 4700000, iron: 1100000, fireCrystals: 59, time: 90720, rfc: 0 },
            32: { meat: 23000000, wood: 23000000, coal: 4700000, iron: 1100000, fireCrystals: 59, time: 90720, rfc: 0 },
            33: { meat: 23000000, wood: 23000000, coal: 4700000, iron: 1100000, fireCrystals: 59, time: 90720, rfc: 0 },
            34: { meat: 23000000, wood: 23000000, coal: 4700000, iron: 1100000, fireCrystals: 59, time: 90720, rfc: 0 },
            35: { meat: 23000000, wood: 23000000, coal: 4700000, iron: 1100000, fireCrystals: 59, time: 90720, rfc: 0 },
            36: { meat: 25000000, wood: 25000000, coal: 5000000, iron: 1200000, fireCrystals: 71, time: 116640, rfc: 0 },
            37: { meat: 25000000, wood: 25000000, coal: 5000000, iron: 1200000, fireCrystals: 71, time: 116640, rfc: 0 },
            38: { meat: 25000000, wood: 25000000, coal: 5000000, iron: 1200000, fireCrystals: 71, time: 116640, rfc: 0 },
            39: { meat: 25000000, wood: 25000000, coal: 5000000, iron: 1200000, fireCrystals: 71, time: 116640, rfc: 0 },
            40: { meat: 25000000, wood: 25000000, coal: 5000000, iron: 1200000, fireCrystals: 71, time: 116640, rfc: 0 },
            41: { meat: 27000000, wood: 27000000, coal: 5500000, iron: 1300000, fireCrystals: 107, time: 142560, rfc: 0 },
            42: { meat: 27000000, wood: 27000000, coal: 5500000, iron: 1300000, fireCrystals: 107, time: 142560, rfc: 0 },
            43: { meat: 27000000, wood: 27000000, coal: 5500000, iron: 1300000, fireCrystals: 107, time: 142560, rfc: 0 },
            44: { meat: 27000000, wood: 27000000, coal: 5500000, iron: 1300000, fireCrystals: 107, time: 142560, rfc: 0 },
            45: { meat: 27000000, wood: 27000000, coal: 5500000, iron: 1300000, fireCrystals: 107, time: 142560, rfc: 0 },
            46: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000, fireCrystals: 126, time: 155520, rfc: 0 },
            47: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000, fireCrystals: 126, time: 155520, rfc: 0 },
            48: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000, fireCrystals: 126, time: 155520, rfc: 0 },
            49: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000, fireCrystals: 126, time: 155520, rfc: 0 },
            50: { meat: 28000000, wood: 28000000, coal: 5700000, iron: 1400000, fireCrystals: 126, time: 155520, rfc: 0 },
            51: { meat: 29000000, wood: 29000000, coal: 5900000, iron: 1400000, fireCrystals: 150, time: 181440, rfc: 0 },
            52: { meat: 29000000, wood: 29000000, coal: 5900000, iron: 1400000, fireCrystals: 150, time: 181440, rfc: 0 },
            53: { meat: 29000000, wood: 29000000, coal: 5900000, iron: 1400000, fireCrystals: 150, time: 181440, rfc: 0 },
            54: { meat: 29000000, wood: 29000000, coal: 5900000, iron: 1400000, fireCrystals: 150, time: 181440, rfc: 0 },
            55: { meat: 29000000, wood: 29000000, coal: 5900000, iron: 1400000, fireCrystals: 150, time: 181440, rfc: 0 },
            56: { meat: 33000000, wood: 33000000, coal: 6700000, iron: 1600000, fireCrystals: 90, time: 194400, rfc: 4 },
            57: { meat: 33000000, wood: 33000000, coal: 6700000, iron: 1600000, fireCrystals: 90, time: 194400, rfc: 4 },
            58: { meat: 33000000, wood: 33000000, coal: 6700000, iron: 1600000, fireCrystals: 90, time: 194400, rfc: 4 },
            59: { meat: 33000000, wood: 33000000, coal: 6700000, iron: 1600000, fireCrystals: 90, time: 194400, rfc: 4 },
            60: { meat: 33000000, wood: 33000000, coal: 6700000, iron: 1600000, fireCrystals: 45, time: 194400, rfc: 9 },
            61: { meat: 38000000, wood: 38000000, coal: 7600000, iron: 1900000, fireCrystals: 108, time: 233280, rfc: 6 },
            62: { meat: 38000000, wood: 38000000, coal: 7600000, iron: 1900000, fireCrystals: 108, time: 233280, rfc: 6 },
            63: { meat: 38000000, wood: 38000000, coal: 7600000, iron: 1900000, fireCrystals: 108, time: 233280, rfc: 6 },
            64: { meat: 38000000, wood: 38000000, coal: 7600000, iron: 1900000, fireCrystals: 108, time: 233280, rfc: 6 },
            65: { meat: 38000000, wood: 38000000, coal: 7600000, iron: 1900000, fireCrystals: 54, time: 233280, rfc: 13 },
            66: { meat: 46000000, wood: 46000000, coal: 9300000, iron: 2300000, fireCrystals: 108, time: 259200, rfc: 9 },
            67: { meat: 46000000, wood: 46000000, coal: 9300000, iron: 2300000, fireCrystals: 108, time: 259200, rfc: 9 },
            68: { meat: 46000000, wood: 46000000, coal: 9300000, iron: 2300000, fireCrystals: 108, time: 259200, rfc: 9 },
            69: { meat: 46000000, wood: 46000000, coal: 9300000, iron: 2300000, fireCrystals: 108, time: 259200, rfc: 9 },
            70: { meat: 46000000, wood: 46000000, coal: 9300000, iron: 2300000, fireCrystals: 54, time: 259200, rfc: 18 },
            71: { meat: 50000000, wood: 50000000, coal: 10000000, iron: 2500000, fireCrystals: 126, time: 168480, rfc: 13 },
            72: { meat: 50000000, wood: 50000000, coal: 10000000, iron: 2500000, fireCrystals: 126, time: 168480, rfc: 13 },
            73: { meat: 50000000, wood: 50000000, coal: 10000000, iron: 2500000, fireCrystals: 126, time: 168480, rfc: 13 },
            74: { meat: 50000000, wood: 50000000, coal: 10000000, iron: 2500000, fireCrystals: 126, time: 168480, rfc: 13 },
            75: { meat: 50000000, wood: 50000000, coal: 10000000, iron: 2500000, fireCrystals: 63, time: 168480, rfc: 27 },
            76: { meat: 59000000, wood: 59000000, coal: 11000000, iron: 2900000, fireCrystals: 157, time: 259200, rfc: 31 },
            77: { meat: 59000000, wood: 59000000, coal: 11000000, iron: 2900000, fireCrystals: 157, time: 259200, rfc: 31 },
            78: { meat: 59000000, wood: 59000000, coal: 11000000, iron: 2900000, fireCrystals: 157, time: 259200, rfc: 31 },
            79: { meat: 59000000, wood: 59000000, coal: 11000000, iron: 2900000, fireCrystals: 157, time: 259200, rfc: 31 },
            80: { meat: 59000000, wood: 59000000, coal: 11000000, iron: 2900000, fireCrystals: 78, time: 259200, rfc: 63 }
     
        }
    },
    warAcademy: {
        name: "War Academy",
        resources: ["meat", "wood", "coal", "iron", "fireCrystals", "time","rfc" ],
        data: {
           
                1: { meat: 0, wood: 0, coal: 0, iron: 0, fireCrystals: 0, time: 2, rfc: 0 }, // fc1
                2: { meat: 36000000, wood: 36000000, coal: 7200000, iron: 1800000, fireCrystals: 71, time: 155520, rfc: 0 },
                3: { meat: 36000000, wood: 36000000, coal: 7200000, iron: 1800000, fireCrystals: 71, time: 155520, rfc: 0 },
                4: { meat: 36000000, wood: 36000000, coal: 7200000, iron: 1800000, fireCrystals: 71, time: 155520, rfc: 0 },
                5: { meat: 36000000, wood: 36000000, coal: 7200000, iron: 1800000, fireCrystals: 71, time: 155520, rfc: 0 },
                6: { meat: 36000000, wood: 36000000, coal: 7200000, iron: 1800000, fireCrystals: 71, time: 155520, rfc: 0 }, // fc 2
                7: { meat: 39000000, wood: 39000000, coal: 7900000, iron: 1900000, fireCrystals: 107, time: 190080, rfc: 0 },
                8: { meat: 39000000, wood: 39000000, coal: 7900000, iron: 1900000, fireCrystals: 107, time: 190080, rfc: 0 },
                9: { meat: 39000000, wood: 39000000, coal: 7900000, iron: 1900000, fireCrystals: 107, time: 190080, rfc: 0 },
                10: { meat: 39000000, wood: 39000000, coal: 7900000, iron: 1900000, fireCrystals: 107, time: 190080, rfc: 0 },
                11: { meat: 39000000, wood: 39000000, coal: 7900000, iron: 1900000, fireCrystals: 107, time: 190080, rfc: 0 }, //fc3
                12: { meat: 41000000, wood: 41000000, coal: 8200000, iron: 2000000, fireCrystals: 126, time: 207360, rfc: 0 },
                13: { meat: 41000000, wood: 41000000, coal: 8200000, iron: 2000000, fireCrystals: 126, time: 207360, rfc: 0 },
                14: { meat: 41000000, wood: 41000000, coal: 8200000, iron: 2000000, fireCrystals: 126, time: 207360, rfc: 0 },
                15: { meat: 41000000, wood: 41000000, coal: 8200000, iron: 2000000, fireCrystals: 126, time: 207360, rfc: 0 },
                16: { meat: 41000000, wood: 41000000, coal: 8200000, iron: 2000000, fireCrystals: 126, time: 207360, rfc: 0 }, // fc4
                17: { meat: 42000000, wood: 42000000, coal: 8400000, iron: 2100000, fireCrystals: 150, time: 241920, rfc: 0 },
                18: { meat: 42000000, wood: 42000000, coal: 8400000, iron: 2100000, fireCrystals: 150, time: 241920, rfc: 0 },
                19: { meat: 42000000, wood: 42000000, coal: 8400000, iron: 2100000, fireCrystals: 150, time: 241920, rfc: 0 },
                20: { meat: 42000000, wood: 42000000, coal: 8400000, iron: 2100000, fireCrystals: 150, time: 241920, rfc: 0 },
                21: { meat: 42000000, wood: 42000000, coal: 8400000, iron: 2100000, fireCrystals: 150, time: 241920, rfc: 0 }, //fc5
                22: { meat: 48000000, wood: 48000000, coal: 9600000, iron: 2400000, fireCrystals: 90, time: 259200, rfc: 4 },
                23: { meat: 48000000, wood: 48000000, coal: 9600000, iron: 2400000, fireCrystals: 90, time: 259200, rfc: 4 },
                24: { meat: 48000000, wood: 48000000, coal: 9600000, iron: 2400000, fireCrystals: 90, time: 259200, rfc: 4 },
                25: { meat: 48000000, wood: 48000000, coal: 9600000, iron: 2400000, fireCrystals: 90, time: 259200, rfc: 4 },
                26: { meat: 48000000, wood: 48000000, coal: 9600000, iron: 2400000, fireCrystals: 45, time: 259200, rfc: 9 },  // fc6
                27: { meat: 54000000, wood: 54000000, coal: 10000000, iron: 2700000, fireCrystals: 108, time: 311040, rfc: 6 },
                28: { meat: 54000000, wood: 54000000, coal: 10000000, iron: 2700000, fireCrystals: 108, time: 311040, rfc: 6 },
                29: { meat: 54000000, wood: 54000000, coal: 10000000, iron: 2700000, fireCrystals: 108, time: 311040, rfc: 6 },
                30: { meat: 54000000, wood: 54000000, coal: 10000000, iron: 2700000, fireCrystals: 108, time: 311040, rfc: 6 },
                31: { meat: 54000000, wood: 54000000, coal: 10000000, iron: 2700000, fireCrystals: 54, time: 311040, rfc: 13 }, //fc7
                32: { meat: 66000000, wood: 66000000, coal: 13000000, iron: 3300000, fireCrystals: 108, time: 345600, rfc: 9 },
                33: { meat: 66000000, wood: 66000000, coal: 13000000, iron: 3300000, fireCrystals: 108, time: 345600, rfc: 9 },
                34: { meat: 66000000, wood: 66000000, coal: 13000000, iron: 3300000, fireCrystals: 108, time: 345600, rfc: 9 },
                35: { meat: 66000000, wood: 66000000, coal: 13000000, iron: 3300000, fireCrystals: 108, time: 345600, rfc: 9 },
                36: { meat: 66000000, wood: 66000000, coal: 13000000, iron: 3300000, fireCrystals: 54, time: 345600, rfc: 18 }, //fc8
                37: { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000, fireCrystals: 126, time: 224640, rfc: 13 },
                38: { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000, fireCrystals: 126, time: 224640, rfc: 13 },
                39: { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000, fireCrystals: 126, time: 224640, rfc: 13 },
                40: { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000, fireCrystals: 126, time: 224640, rfc: 13 },
                41: { meat: 72000000, wood: 72000000, coal: 14000000, iron: 3600000, fireCrystals: 63, time: 224640, rfc: 27 },  //fc9
                42: { meat: 84000000, wood: 84000000, coal: 16000000, iron: 4200000, fireCrystals: 157, time: 345600, rfc: 31 },
                43: { meat: 84000000, wood: 84000000, coal: 16000000, iron: 4200000, fireCrystals: 157, time: 345600, rfc: 31 },
                44: { meat: 84000000, wood: 84000000, coal: 16000000, iron: 4200000, fireCrystals: 157, time: 345600, rfc: 31 },
                45: { meat: 84000000, wood: 84000000, coal: 16000000, iron: 4200000, fireCrystals: 157, time: 345600, rfc: 31 },
                46: { meat: 84000000, wood: 84000000, coal: 16000000, iron: 4200000, fireCrystals: 78, time: 345600, rfc: 63 } // fc10
           
        }
    }
};
