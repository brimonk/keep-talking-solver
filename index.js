// Keep Talking and Nobody Explodes - Helper
// Module management

let moduleCounter = 0;

document.addEventListener('DOMContentLoaded', function() {
    const modulesContainer = document.getElementById('modules-container');
    const moduleButtons = document.querySelectorAll('.module-btn');
    
    // Strike counter functionality
    const strikeCounter = document.getElementById('strikes');
    if (strikeCounter) {
        strikeCounter.addEventListener('click', function() {
            const currentStrikes = parseInt(this.getAttribute('data-strikes') || '0');
            const newStrikes = (currentStrikes + 1) % 3; // Cycle 0 -> 1 -> 2 -> 0
            this.setAttribute('data-strikes', newStrikes);
            this.querySelector('.strike-number').textContent = newStrikes;
            
            // Re-solve any active Simon Says modules when strikes change
            document.querySelectorAll('[id^="simon-solution-"]').forEach(solution => {
                const moduleId = solution.id.replace('simon-solution-', '');
                const moduleCard = document.getElementById(`module-${moduleId}`);
                if (moduleCard && moduleCard.querySelector('h3').textContent === 'Simon Says') {
                    solveSimonSays(moduleId);
                }
            });
        });
    }
    
    // Battery counter functionality
    const batteryCounter = document.getElementById('battery-count');
    if (batteryCounter) {
        batteryCounter.addEventListener('click', function() {
            const currentBatteries = this.getAttribute('data-batteries');
            let newBatteries;
            
            // Cycle through ?, 0, 1, 2+
            if (currentBatteries === '?') {
                newBatteries = '0';
            } else if (currentBatteries === '0') {
                newBatteries = '1';
            } else if (currentBatteries === '1') {
                newBatteries = '2+';
            } else {
                newBatteries = '?';
            }
            
            this.setAttribute('data-batteries', newBatteries);
            this.querySelector('.battery-number').textContent = newBatteries;
            
            // Update all Complicated Wires modules when battery count changes
            for (let i = 1; i <= moduleCounter; i++) {
                if (window[`updateComplicatedWires_${i}`]) {
                    window[`updateComplicatedWires_${i}`]();
                }
            }
            
            // Update all Button modules when battery count changes
            document.querySelectorAll('[id^="button-solution-"]').forEach(solution => {
                const moduleId = solution.id.replace('button-solution-', '');
                const moduleCard = document.getElementById(`module-${moduleId}`);
                if (moduleCard && moduleCard.querySelector('h3').textContent === 'Button') {
                    solveButton(moduleId);
                }
            });
        });
    }
    
    // Add module when button is clicked
    moduleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const moduleName = this.getAttribute('data-module');
            addModule(moduleName);
        });
    });
    
    function addModule(moduleName) {
        moduleCounter++;
        
        const moduleCard = document.createElement('div');
        moduleCard.className = 'module-card';
        moduleCard.id = `module-${moduleCounter}`;
        
        let moduleContent = '';
        
        // Generate specific content based on module type
        if (moduleName === 'Wires') {
            moduleContent = createWiresModule(moduleCounter);
        } else if (moduleName === 'Button') {
            moduleContent = createButtonModule(moduleCounter);
        } else if (moduleName === 'Passwords') {
            moduleContent = createPasswordsModule(moduleCounter);
        } else if (moduleName === 'Sequential Wires') {
            moduleContent = createSequentialWiresModule(moduleCounter);
        } else if (moduleName === 'Simon Says') {
            moduleContent = createSimonSaysModule(moduleCounter);
        } else if (moduleName === 'Memory') {
            moduleContent = createMemoryModule(moduleCounter);
        } else if (moduleName === 'Morse Code') {
            moduleContent = createMorseCodeModule(moduleCounter);
        } else if (moduleName === 'Complicated Wires') {
            moduleContent = createComplicatedWiresModule(moduleCounter);
        } else {
            moduleContent = `
                <button class="toggle-btn" onclick="toggleModule(${moduleCounter})" title="Minimize module">▲</button>
                <button class="complete-btn" onclick="completeModule(${moduleCounter})" title="Mark as complete">✓</button>
                <button class="close-btn" onclick="removeModule(${moduleCounter})" title="Remove module">×</button>
                <h3>${moduleName}</h3>
                <div class="module-content">
                    Module not yet implemented
                </div>
            `;
        }
        
        moduleCard.innerHTML = moduleContent;
        modulesContainer.appendChild(moduleCard);
        
        // Setup modules based on type
        if (moduleName === 'Wires') {
            setupWiresModule(moduleCounter);
        } else if (moduleName === 'Button') {
            setupButtonModule(moduleCounter);
        } else if (moduleName === 'Passwords') {
            setupPasswordsModule(moduleCounter);
        } else if (moduleName === 'Sequential Wires') {
            setupSequentialWiresModule(moduleCounter);
        } else if (moduleName === 'Simon Says') {
            setupSimonSaysModule(moduleCounter);
        } else if (moduleName === 'Memory') {
            setupMemoryModule(moduleCounter);
        } else if (moduleName === 'Morse Code') {
            setupMorseCodeModule(moduleCounter);
        } else if (moduleName === 'Complicated Wires') {
            setupComplicatedWiresModule(moduleCounter);
        }
    }
    
    // Make removeModule function globally available
    window.removeModule = function(moduleId) {
        const moduleCard = document.getElementById(`module-${moduleId}`);
        if (moduleCard) {
            moduleCard.remove();
        }
    };
    
    // Toggle module minimize/expand
    window.toggleModule = function(moduleId) {
        const moduleCard = document.getElementById(`module-${moduleId}`);
        if (moduleCard) {
            moduleCard.classList.toggle('minimized');
            const toggleBtn = moduleCard.querySelector('.toggle-btn');
            if (moduleCard.classList.contains('minimized')) {
                toggleBtn.textContent = '▼';
                toggleBtn.title = 'Expand module';
            } else {
                toggleBtn.textContent = '▲';
                toggleBtn.title = 'Minimize module';
            }
        }
    };
    
    // Mark module as complete
    window.completeModule = function(moduleId) {
        const moduleCard = document.getElementById(`module-${moduleId}`);
        if (moduleCard) {
            moduleCard.classList.toggle('completed');
            const completeBtn = moduleCard.querySelector('.complete-btn');
            if (moduleCard.classList.contains('completed')) {
                completeBtn.textContent = '↺';
                completeBtn.title = 'Mark as incomplete';
                // Auto-minimize when completed
                if (!moduleCard.classList.contains('minimized')) {
                    toggleModule(moduleId);
                }
            } else {
                completeBtn.textContent = '✓';
                completeBtn.title = 'Mark as complete';
            }
        }
    };
    
    // Wires Module Functions
    function createWiresModule(moduleId) {
        return `
            <button class="toggle-btn" onclick="toggleModule(${moduleId})" title="Minimize module">▲</button>
            <button class="complete-btn" onclick="completeModule(${moduleId})" title="Mark as complete">✓</button>
            <button class="close-btn" onclick="removeModule(${moduleId})" title="Remove module">×</button>
            <h3>Wires</h3>
            <div class="module-content">
                <div class="wires-controls">
                    <div class="color-picker-buttons">
                        <button class="color-pick-btn color-pick-red" data-color="red" title="Red">R</button>
                        <button class="color-pick-btn color-pick-blue" data-color="blue" title="Blue">B</button>
                        <button class="color-pick-btn color-pick-yellow" data-color="yellow" title="Yellow">Y</button>
                        <button class="color-pick-btn color-pick-white" data-color="white" title="White">W</button>
                        <button class="color-pick-btn color-pick-black" data-color="black" title="Black">K</button>
                    </div>
                </div>
                <div class="wires-list" id="wires-list-${moduleId}">
                    <div class="no-wires-message">Add wires using the color buttons above</div>
                </div>
                <div class="solution-box" id="solution-${moduleId}">
                    Add 3-6 wires to see solution
                </div>
            </div>
        `;
    }
    
    function setupWiresModule(moduleId) {
        const wiresList = document.getElementById(`wires-list-${moduleId}`);
        const colorButtons = document.querySelectorAll(`#module-${moduleId} .color-pick-btn`);
        let wires = []; // Array to store wire colors
        
        colorButtons.forEach(button => {
            button.addEventListener('click', function() {
                const color = this.getAttribute('data-color');
                if (wires.length < 6) {
                    addWire(color);
                }
            });
        });
        
        function addWire(color) {
            wires.push(color);
            updateWiresList();
            solveWires(moduleId);
        }
        
        function removeWire(index) {
            wires.splice(index, 1);
            updateWiresList();
            solveWires(moduleId);
        }
        
        function updateWiresList() {
            if (wires.length === 0) {
                wiresList.innerHTML = '<div class="no-wires-message">Add wires using the color buttons above</div>';
                updateColorButtons();
                return;
            }
            
            wiresList.innerHTML = '';
            wires.forEach((color, index) => {
                const wireDiv = document.createElement('div');
                wireDiv.className = 'wire-item';
                wireDiv.innerHTML = `
                    <span class="wire-color-badge wire-${color}">${color.charAt(0).toUpperCase() + color.slice(1)}</span>
                    <button class="remove-wire-btn" data-index="${index}">×</button>
                `;
                wiresList.appendChild(wireDiv);
            });
            
            // Add click listeners to remove buttons
            wiresList.querySelectorAll('.remove-wire-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    removeWire(index);
                });
            });
            
            updateColorButtons();
        }
        
        function updateColorButtons() {
            // Disable all color buttons if we have 6 wires
            colorButtons.forEach(button => {
                button.disabled = wires.length >= 6;
            });
        }
        
        window[`getWires_${moduleId}`] = () => wires;
    }
    
    function solveWires(moduleId) {
        const solutionBox = document.getElementById(`solution-${moduleId}`);
        const evenSerial = document.getElementById('even-serial');
        
        const wires = window[`getWires_${moduleId}`]();
        const count = wires.length;
        
        // Need at least 3 wires and at most 6
        if (count < 3) {
            solutionBox.textContent = `Add ${3 - count} more wire${3 - count > 1 ? 's' : ''} (need 3-6 total)`;
            solutionBox.className = 'solution-box';
            return;
        }
        
        if (count > 6) {
            solutionBox.textContent = 'Too many wires! Maximum is 6.';
            solutionBox.className = 'solution-box';
            return;
        }
        
        const serialState = evenSerial.getAttribute('data-state');
        const serialIsOdd = serialState === 'false';
        const serialIsUnknown = serialState === 'unknown';
        let wireToCut = null;
        
        // Count wire colors
        const countColor = (color) => wires.filter(w => w === color).length;
        const redCount = countColor('red');
        const blueCount = countColor('blue');
        const yellowCount = countColor('yellow');
        const whiteCount = countColor('white');
        const blackCount = countColor('black');
        
        // Last wire color
        const lastWire = wires[wires.length - 1];
        
        if (count === 3) {
            if (redCount === 0) {
                wireToCut = 2;
            } else if (lastWire === 'white') {
                wireToCut = 3;
            } else if (blueCount > 1) {
                wireToCut = wires.lastIndexOf('blue') + 1;
            } else {
                wireToCut = 3;
            }
        } else if (count === 4) {
            if (redCount > 1) {
                if (serialIsUnknown) {
                    solutionBox.textContent = 'Need to know: Is the last digit of the serial number odd?';
                    solutionBox.className = 'solution-box';
                    return;
                }
                if (serialIsOdd) {
                    wireToCut = wires.lastIndexOf('red') + 1;
                } else if (lastWire === 'yellow' && redCount === 0) {
                    wireToCut = 1;
                } else if (blueCount === 1) {
                    wireToCut = 1;
                } else if (yellowCount > 1) {
                    wireToCut = 4;
                } else {
                    wireToCut = 2;
                }
            } else if (lastWire === 'yellow' && redCount === 0) {
                wireToCut = 1;
            } else if (blueCount === 1) {
                wireToCut = 1;
            } else if (yellowCount > 1) {
                wireToCut = 4;
            } else {
                wireToCut = 2;
            }
        } else if (count === 5) {
            if (lastWire === 'black') {
                if (serialIsUnknown) {
                    solutionBox.textContent = 'Need to know: Is the last digit of the serial number odd?';
                    solutionBox.className = 'solution-box';
                    return;
                }
                if (serialIsOdd) {
                    wireToCut = 4;
                } else if (redCount === 1 && yellowCount > 1) {
                    wireToCut = 1;
                } else if (blackCount === 0) {
                    wireToCut = 2;
                } else {
                    wireToCut = 1;
                }
            } else if (redCount === 1 && yellowCount > 1) {
                wireToCut = 1;
            } else if (blackCount === 0) {
                wireToCut = 2;
            } else {
                wireToCut = 1;
            }
        } else if (count === 6) {
            if (yellowCount === 0) {
                if (serialIsUnknown) {
                    solutionBox.textContent = 'Need to know: Is the last digit of the serial number odd?';
                    solutionBox.className = 'solution-box';
                    return;
                }
                if (serialIsOdd) {
                    wireToCut = 3;
                } else if (yellowCount === 1 && whiteCount > 1) {
                    wireToCut = 4;
                } else if (redCount === 0) {
                    wireToCut = 6;
                } else {
                    wireToCut = 4;
                }
            } else if (yellowCount === 1 && whiteCount > 1) {
                wireToCut = 4;
            } else if (redCount === 0) {
                wireToCut = 6;
            } else {
                wireToCut = 4;
            }
        }
        
        if (wireToCut) {
            solutionBox.textContent = `✂️ Cut wire ${wireToCut}`;
            solutionBox.className = 'solution-box solved';
        } else {
            solutionBox.textContent = 'Unable to determine solution';
            solutionBox.className = 'solution-box';
        }
    }
    
    // Button Module Functions
    function createButtonModule(moduleId) {
        return `
            <button class="toggle-btn" onclick="toggleModule(${moduleId})" title="Minimize module">▲</button>
            <button class="complete-btn" onclick="completeModule(${moduleId})" title="Mark as complete">✓</button>
            <button class="close-btn" onclick="removeModule(${moduleId})" title="Remove module">×</button>
            <h3>Button</h3>
            <div class="module-content">
                <div class="button-controls">
                    <div class="button-input-group">
                        <label>Button Color:</label>
                        <select class="button-select" id="button-color-${moduleId}">
                            <option value="">-- Select --</option>
                            <option value="blue">Blue</option>
                            <option value="white">White</option>
                            <option value="yellow">Yellow</option>
                            <option value="red">Red</option>
                        </select>
                    </div>
                    <div class="button-input-group">
                        <label>Button Text:</label>
                        <select class="button-select" id="button-text-${moduleId}">
                            <option value="">-- Select --</option>
                            <option value="abort">Abort</option>
                            <option value="detonate">Detonate</option>
                            <option value="hold">Hold</option>
                            <option value="press">Press</option>
                        </select>
                    </div>
                </div>
                <div class="solution-box" id="button-solution-${moduleId}">
                    Select button color and text to see solution
                </div>
            </div>
        `;
    }
    
    function setupButtonModule(moduleId) {
        const colorSelect = document.getElementById(`button-color-${moduleId}`);
        const textSelect = document.getElementById(`button-text-${moduleId}`);
        
        const selects = [colorSelect, textSelect];
        
        selects.forEach(select => {
            select.addEventListener('change', () => solveButton(moduleId));
        });
        
        // Solve immediately in case battery counter is already set
        solveButton(moduleId);
    }
    
    function solveButton(moduleId) {
        const colorSelect = document.getElementById(`button-color-${moduleId}`);
        const textSelect = document.getElementById(`button-text-${moduleId}`);
        const solutionBox = document.getElementById(`button-solution-${moduleId}`);
        
        const litCar = document.getElementById('lit-car');
        const litFrk = document.getElementById('lit-frk');
        const batteryCounter = document.getElementById('battery-count');
        
        const color = colorSelect.value;
        const text = textSelect.value;
        const carState = litCar.getAttribute('data-state');
        const frkState = litFrk.getAttribute('data-state');
        const batteryValue = batteryCounter.getAttribute('data-batteries');
        
        // Parse battery count from the global counter
        let batteries = 0;
        if (batteryValue === '0') {
            batteries = 0;
        } else if (batteryValue === '1') {
            batteries = 1;
        } else if (batteryValue === '2+') {
            batteries = 2; // Treat 2+ as 2 for the logic
        }
        // If '?', batteries remains 0
        
        // Check if all required fields are selected
        if (!color || !text) {
            solutionBox.textContent = 'Select button color and text to see solution';
            solutionBox.className = 'solution-box';
            return;
        }
        
        let action = null;
        let needsInfo = null;
        
        // Rule 1: Blue button + "Abort"
        if (color === 'blue' && text === 'abort') {
            action = 'hold';
        }
        // Rule 2: More than 1 battery + "Detonate"
        else if (batteries > 1 && text === 'detonate') {
            action = 'press';
        }
        // Rule 3: White button + lit CAR
        else if (color === 'white') {
            if (carState === 'unknown') {
                needsInfo = 'Need to know: Does the bomb have a lit CAR indicator?';
            } else if (carState === 'true') {
                action = 'hold';
            }
        }
        
        // Only continue if we haven't found an action and don't need info
        if (!action && !needsInfo) {
            // Rule 4: More than 2 batteries + lit FRK
            if (batteries > 2) {
                if (frkState === 'unknown') {
                    needsInfo = 'Need to know: Does the bomb have a lit FRK indicator?';
                } else if (frkState === 'true') {
                    action = 'press';
                }
            }
        }
        
        // Only continue if we haven't found an action and don't need info
        if (!action && !needsInfo) {
            // Rule 5: Yellow button
            if (color === 'yellow') {
                action = 'hold';
            }
            // Rule 6: Red button + "Hold"
            else if (color === 'red' && text === 'hold') {
                action = 'press';
            }
            // Rule 7: Default
            else {
                action = 'hold';
            }
        }
        
        if (needsInfo) {
            solutionBox.textContent = needsInfo;
            solutionBox.className = 'solution-box';
        } else if (action === 'press') {
            solutionBox.innerHTML = '👆 <strong>Press and immediately release</strong>';
            solutionBox.className = 'solution-box solved';
        } else {
            // Hold action - show strip instructions
            solutionBox.innerHTML = `
                <div style="margin-bottom: 10px;"><strong>✋ Hold the button down</strong></div>
                <div style="font-size: 0.95em; line-height: 1.6;">
                    <div style="background: #2196f3; color: white; padding: 5px 8px; margin: 3px 0; border-radius: 3px;">
                        <strong>Blue strip:</strong> Release at <strong>4</strong>
                    </div>
                    <div style="background: #ffc107; color: #333; padding: 5px 8px; margin: 3px 0; border-radius: 3px;">
                        <strong>Yellow strip:</strong> Release at <strong>5</strong>
                    </div>
                    <div style="background: #e0e0e0; color: #333; padding: 5px 8px; margin: 3px 0; border-radius: 3px;">
                        <strong>White/Other strip:</strong> Release at <strong>1</strong>
                    </div>
                </div>
            `;
            solutionBox.className = 'solution-box solved';
        }
    }
    
    // Passwords Module Functions
    const PASSWORD_LIST = [
        'about', 'after', 'again', 'below', 'could', 'every', 'first', 'found',
        'great', 'house', 'large', 'learn', 'never', 'other', 'place', 'plant',
        'point', 'right', 'small', 'sound', 'spell', 'still', 'study', 'their',
        'there', 'these', 'thing', 'think', 'three', 'water', 'where', 'which',
        'world', 'would', 'write'
    ];
    
    function createPasswordsModule(moduleId) {
        return `
            <button class="toggle-btn" onclick="toggleModule(${moduleId})" title="Minimize module">▲</button>
            <button class="complete-btn" onclick="completeModule(${moduleId})" title="Mark as complete">✓</button>
            <button class="close-btn" onclick="removeModule(${moduleId})" title="Remove module">×</button>
            <h3>Passwords</h3>
            <div class="module-content">
                <div class="password-inputs">
                    ${[0, 1, 2, 3, 4].map(pos => `
                        <div class="password-column">
                            <label>Position ${pos + 1}:</label>
                            <input type="text" class="password-letters" id="password-pos-${moduleId}-${pos}" 
                                   placeholder="ABC..." maxlength="10" data-pos="${pos}">
                        </div>
                    `).join('')}
                </div>
                <div class="solution-box" id="password-solution-${moduleId}">
                    Enter possible letters for each position
                </div>
            </div>
        `;
    }
    
    function setupPasswordsModule(moduleId) {
        const inputs = [];
        for (let i = 0; i < 5; i++) {
            const input = document.getElementById(`password-pos-${moduleId}-${i}`);
            inputs.push(input);
            input.addEventListener('input', () => solvePassword(moduleId));
        }
    }
    
    function solvePassword(moduleId) {
        const solutionBox = document.getElementById(`password-solution-${moduleId}`);
        const positions = [];
        let hasAnyInput = false;
        
        // Get letters for each position
        for (let i = 0; i < 5; i++) {
            const input = document.getElementById(`password-pos-${moduleId}-${i}`);
            const letters = input.value.toLowerCase().trim();
            if (letters) {
                hasAnyInput = true;
                // Only apply constraint if we have 6 letters (all possible letters entered)
                if (letters.length === 6) {
                    positions.push(letters.split(''));
                } else {
                    positions.push(null); // Not enough info, treat as unknown
                }
            } else {
                positions.push(null); // No constraint for this position
            }
        }
        
        if (!hasAnyInput) {
            solutionBox.textContent = 'Enter possible letters for each position';
            solutionBox.className = 'solution-box';
            return;
        }
        
        // Find matching passwords with partial match scoring
        const matchesWithScore = PASSWORD_LIST.map(word => {
            let score = 0;
            let hardMatch = true;
            
            for (let i = 0; i < 5; i++) {
                if (positions[i]) {
                    // Hard constraint (6 letters entered)
                    if (!positions[i].includes(word[i])) {
                        hardMatch = false;
                        break;
                    }
                    score += 10; // Bonus for matching hard constraint
                } else {
                    // Soft matching - check if any entered letters match
                    const input = document.getElementById(`password-pos-${moduleId}-${i}`);
                    const letters = input.value.toLowerCase().trim();
                    if (letters && letters.includes(word[i])) {
                        score += 1; // Small bonus for partial match
                    }
                }
            }
            
            return hardMatch ? { word, score } : null;
        }).filter(x => x !== null);
        
        // Sort by score (descending)
        matchesWithScore.sort((a, b) => b.score - a.score);
        const matches = matchesWithScore.map(x => x.word);
        
        if (matches.length === 0) {
            solutionBox.textContent = '❌ No matching passwords found';
            solutionBox.className = 'solution-box';
        } else if (matches.length === 1) {
            solutionBox.innerHTML = `<strong>✅ Password:</strong> <span style="font-size: 1.3em; letter-spacing: 2px;">${matches[0].toUpperCase()}</span>`;
            solutionBox.className = 'solution-box solved';
        } else {
            const displayMatches = matches.slice(0, 3);
            const remaining = matches.length - 3;
            let html = `<strong>Possible passwords (${matches.length}):</strong><br>`;
            html += displayMatches.map(w => `<span style="font-size: 1.1em; font-weight: bold;">${w.toUpperCase()}</span>`).join(', ');
            if (remaining > 0) {
                html += ` <span style="color: #999;">+${remaining} more</span>`;
            }
            solutionBox.innerHTML = html;
            solutionBox.className = 'solution-box';
        }
    }
    
    // Sequential Wires Module Functions
    const SEQUENTIAL_RULES = {
        red: ['C', 'B', 'A', 'AC', 'B', 'AC', 'ABC', 'AB', 'B'],
        blue: ['B', 'AC', 'B', 'A', 'B', 'BC', 'C', 'AC', 'A'],
        black: ['ABC', 'AC', 'B', 'AC', 'B', 'BC', 'AB', 'C', 'C']
    };
    
    function createSequentialWiresModule(moduleId) {
        return `
            <button class="toggle-btn" onclick="toggleModule(${moduleId})" title="Minimize module">▲</button>
            <button class="complete-btn" onclick="completeModule(${moduleId})" title="Mark as complete">✓</button>
            <button class="close-btn" onclick="removeModule(${moduleId})" title="Remove module">×</button>
            <h3>Sequential Wires</h3>
            <div class="module-content">
                <div class="seq-wire-add">
                    <div class="seq-controls">
                        <label>Add Wire:</label>
                        <div class="seq-buttons">
                            <button class="seq-color-btn seq-red" data-color="red">Red</button>
                            <button class="seq-color-btn seq-blue" data-color="blue">Blue</button>
                            <button class="seq-color-btn seq-black" data-color="black">Black</button>
                        </div>
                    </div>
                    <div class="seq-connection">
                        <label>Connected to:</label>
                        <div class="seq-buttons">
                            <button class="seq-conn-btn" data-conn="A">A</button>
                            <button class="seq-conn-btn" data-conn="B">B</button>
                            <button class="seq-conn-btn" data-conn="C">C</button>
                        </div>
                    </div>
                </div>
                <div class="seq-wires-list" id="seq-wires-${moduleId}">
                    <div class="no-wires-message">Add wires with their connections</div>
                </div>
                <button class="reset-seq-btn" id="reset-seq-${moduleId}">🔄 Reset All</button>
            </div>
        `;
    }
    
    function setupSequentialWiresModule(moduleId) {
        const wiresList = document.getElementById(`seq-wires-${moduleId}`);
        const colorButtons = document.querySelectorAll(`#module-${moduleId} .seq-color-btn`);
        const connButtons = document.querySelectorAll(`#module-${moduleId} .seq-conn-btn`);
        const resetBtn = document.getElementById(`reset-seq-${moduleId}`);
        
        let wires = []; // Array of {color, connection}
        let counts = { red: 0, blue: 0, black: 0 };
        let selectedColor = null;
        let selectedConnection = null;
        
        colorButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                colorButtons.forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
                selectedColor = this.getAttribute('data-color');
                checkAndAddWire();
            });
        });
        
        connButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                connButtons.forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
                selectedConnection = this.getAttribute('data-conn');
                checkAndAddWire();
            });
        });
        
        function checkAndAddWire() {
            if (selectedColor && selectedConnection) {
                addWire(selectedColor, selectedConnection);
                // Clear selections
                colorButtons.forEach(b => b.classList.remove('selected'));
                connButtons.forEach(b => b.classList.remove('selected'));
                selectedColor = null;
                selectedConnection = null;
            }
        }
        
        function addWire(color, connection) {
            const occurrence = counts[color] + 1;
            const rule = SEQUENTIAL_RULES[color][counts[color]];
            const shouldCut = rule.includes(connection);
            
            wires.push({ color, connection, occurrence, shouldCut });
            counts[color]++;
            updateWiresList();
        }
        
        function removeWire(index) {
            const wire = wires[index];
            wires.splice(index, 1);
            
            // Recalculate counts and rules
            counts = { red: 0, blue: 0, black: 0 };
            wires.forEach((w, i) => {
                w.occurrence = counts[w.color] + 1;
                const rule = SEQUENTIAL_RULES[w.color][counts[w.color]];
                w.shouldCut = rule.includes(w.connection);
                counts[w.color]++;
            });
            
            updateWiresList();
        }
        
        function updateWiresList() {
            if (wires.length === 0) {
                wiresList.innerHTML = '<div class="no-wires-message">Add wires with their connections</div>';
                return;
            }
            
            wiresList.innerHTML = '';
            wires.forEach((wire, index) => {
                const wireDiv = document.createElement('div');
                wireDiv.className = `seq-wire-item ${wire.shouldCut ? 'should-cut' : 'dont-cut'}`;
                wireDiv.innerHTML = `
                    <span class="seq-wire-number">#${index + 1}</span>
                    <span class="seq-wire-color seq-${wire.color}">${wire.color.toUpperCase()}</span>
                    <span class="seq-wire-conn">→ ${wire.connection}</span>
                    <span class="seq-wire-occur">(${wire.occurrence}${getOrdinal(wire.occurrence)})</span>
                    <span class="seq-wire-action">${wire.shouldCut ? '✂️ CUT' : '✋ LEAVE'}</span>
                    <button class="remove-wire-btn" data-index="${index}">×</button>
                `;
                wiresList.appendChild(wireDiv);
            });
            
            // Add click listeners to remove buttons
            wiresList.querySelectorAll('.remove-wire-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    removeWire(index);
                });
            });
        }
        
        function getOrdinal(n) {
            const s = ['th', 'st', 'nd', 'rd'];
            const v = n % 100;
            return s[(v - 20) % 10] || s[v] || s[0];
        }
        
        resetBtn.addEventListener('click', function() {
            wires = [];
            counts = { red: 0, blue: 0, black: 0 };
            updateWiresList();
        });
    }
    
    // Store bomb indicators state when they change
    const batteries = document.getElementById('batteries');
    const parallelPort = document.getElementById('parallel-port');
    const evenSerial = document.getElementById('even-serial');
    const serialVowel = document.getElementById('serial-vowel');
    const litCar = document.getElementById('lit-car');
    const litFrk = document.getElementById('lit-frk');
    
    const indicators = [batteries, parallelPort, evenSerial, serialVowel, litCar, litFrk];
    
    // Setup three-state checkbox behavior
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const currentState = this.getAttribute('data-state');
            let newState, newIcon;
            
            // Cycle through states: unknown -> true -> false -> unknown
            switch(currentState) {
                case 'unknown':
                    newState = 'true';
                    newIcon = '✓';
                    break;
                case 'true':
                    newState = 'false';
                    newIcon = '✗';
                    break;
                case 'false':
                    newState = 'unknown';
                    newIcon = '?';
                    break;
            }
            
            this.setAttribute('data-state', newState);
            this.querySelector('.checkbox-icon').textContent = newIcon;
            
            // Re-solve any active Wires modules when serial number state changes
            if (this.id === 'even-serial') {
                document.querySelectorAll('[id^="solution-"]').forEach(solution => {
                    const moduleId = solution.id.replace('solution-', '');
                    const moduleCard = document.getElementById(`module-${moduleId}`);
                    if (moduleCard && moduleCard.querySelector('h3').textContent === 'Wires') {
                        solveWires(moduleId);
                    }
                });
            }
            
            // Re-solve any active Button modules when CAR or FRK state changes
            if (this.id === 'lit-car' || this.id === 'lit-frk') {
                document.querySelectorAll('[id^="button-solution-"]').forEach(solution => {
                    const moduleId = solution.id.replace('button-solution-', '');
                    const moduleCard = document.getElementById(`module-${moduleId}`);
                    if (moduleCard && moduleCard.querySelector('h3').textContent === 'Button') {
                        solveButton(moduleId);
                    }
                });
            }
            
            // Re-solve any active Simon Says modules when serial vowel state changes
            if (this.id === 'serial-vowel') {
                document.querySelectorAll('[id^="simon-solution-"]').forEach(solution => {
                    const moduleId = solution.id.replace('simon-solution-', '');
                    const moduleCard = document.getElementById(`module-${moduleId}`);
                    if (moduleCard && moduleCard.querySelector('h3').textContent === 'Simon Says') {
                        solveSimonSays(moduleId);
                    }
                });
            }
            
            // Log the current state of all indicators
            console.log('Bomb indicators updated:', {
                batteries: batteries.getAttribute('data-state'),
                parallelPort: parallelPort.getAttribute('data-state'),
                evenSerial: evenSerial.getAttribute('data-state'),
                serialVowel: serialVowel.getAttribute('data-state'),
                litCar: litCar.getAttribute('data-state'),
                litFrk: litFrk.getAttribute('data-state')
            });
        });
    });
});

// Simon Says Module Functions
function createSimonSaysModule(moduleId) {
    return `
        <button class="toggle-btn" onclick="toggleModule(${moduleId})" title="Minimize module">▲</button>
        <button class="complete-btn" onclick="completeModule(${moduleId})" title="Mark as complete">✓</button>
        <button class="close-btn" onclick="removeModule(${moduleId})" title="Remove module">×</button>
        <h3>Simon Says</h3>
        <div class="module-content">
            <div class="simon-controls">
                <p style="margin: 0 0 10px 0; font-size: 14px;">Click the colors as they flash:</p>
                <div class="simon-color-buttons">
                    <button class="simon-color-btn simon-red" data-color="red">Red</button>
                    <button class="simon-color-btn simon-blue" data-color="blue">Blue</button>
                    <button class="simon-color-btn simon-yellow" data-color="yellow">Yellow</button>
                    <button class="simon-color-btn simon-green" data-color="green">Green</button>
                </div>
                <div class="simon-sequence" id="simon-sequence-${moduleId}">
                    <strong>Sequence:</strong> <span class="sequence-display" id="simon-display-${moduleId}">None yet</span>
                </div>
                <div class="simon-solution" id="simon-solution-${moduleId}">
                    <strong>Press:</strong> <span class="solution-text">Enter sequence above</span>
                </div>
            </div>
        </div>
    `;
}

function setupSimonSaysModule(moduleId) {
    const colorButtons = document.querySelectorAll(`#module-${moduleId} .simon-color-btn`);
    let sequence = [];
    
    // Store sequence for this module
    window[`simonSequence_${moduleId}`] = sequence;
    
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            sequence.push(color);
            updateSimonDisplay(moduleId);
        });
    });
    
    // Initial solve
    solveSimonSays(moduleId);
}

function updateSimonDisplay(moduleId) {
    const sequence = window[`simonSequence_${moduleId}`];
    const display = document.getElementById(`simon-display-${moduleId}`);
    
    if (sequence.length === 0) {
        display.textContent = 'None yet';
        display.style.color = '#666';
    } else {
        // Display sequence with colored dots or text
        const colorMap = {
            'red': '🔴',
            'blue': '🔵',
            'yellow': '🟡',
            'green': '🟢'
        };
        display.innerHTML = sequence.map(c => colorMap[c]).join(' ');
    }
    
    solveSimonSays(moduleId);
}

function solveSimonSays(moduleId) {
    const sequence = window[`simonSequence_${moduleId}`] || [];
    const solutionDiv = document.getElementById(`simon-solution-${moduleId}`);
    const solutionText = solutionDiv.querySelector('.solution-text');
    
    if (sequence.length === 0) {
        solutionText.textContent = 'Enter sequence above';
        solutionText.style.color = '#666';
        return;
    }
    
    // Get serial number vowel state
    const serialVowel = document.getElementById('serial-vowel');
    const hasVowel = serialVowel.getAttribute('data-state');
    
    // Get strikes
    const strikesBtn = document.getElementById('strikes');
    const strikes = parseInt(strikesBtn.getAttribute('data-strikes') || '0');
    
    // Define mapping tables
    const mappingWithVowel = {
        0: { red: 'blue', blue: 'red', yellow: 'green', green: 'yellow' },
        1: { red: 'yellow', blue: 'green', yellow: 'red', green: 'blue' },
        2: { red: 'green', blue: 'red', yellow: 'blue', green: 'yellow' }
    };
    
    const mappingWithoutVowel = {
        0: { red: 'blue', blue: 'yellow', yellow: 'red', green: 'green' },
        1: { red: 'red', blue: 'blue', yellow: 'green', green: 'yellow' },
        2: { red: 'yellow', blue: 'green', yellow: 'red', green: 'blue' }
    };
    
    if (hasVowel === 'unknown') {
        solutionText.innerHTML = '<span style="color: orange;">⚠️ Need to know: Does serial have vowel?</span>';
        return;
    }
    
    const mapping = hasVowel === 'true' ? mappingWithVowel[strikes] : mappingWithoutVowel[strikes];
    
    // Convert sequence to solution
    const solution = sequence.map(color => mapping[color]);
    
    // Display solution with colored indicators
    const colorMap = {
        'red': '🔴',
        'blue': '🔵',
        'yellow': '🟡',
        'green': '🟢'
    };
    
    solutionText.innerHTML = solution.map(c => colorMap[c]).join(' ');
    solutionText.style.color = '#000';
}

// Memory Module Functions
function createMemoryModule(moduleId) {
    return `
        <button class="toggle-btn" onclick="toggleModule(${moduleId})" title="Minimize module">▲</button>
        <button class="complete-btn" onclick="completeModule(${moduleId})" title="Mark as complete">✓</button>
        <button class="close-btn" onclick="removeModule(${moduleId})" title="Remove module">×</button>
        <h3>Memory</h3>
        <div class="module-content">
            <div class="memory-controls">
                <div class="memory-stage-info">
                    <strong>Stage:</strong> <span id="memory-stage-${moduleId}">1</span> of 5
                </div>
                <div class="memory-display-section">
                    <p style="margin: 0 0 10px 0;"><strong>Display shows:</strong></p>
                    <div class="memory-display-buttons">
                        <button class="memory-display-btn" data-value="1">1</button>
                        <button class="memory-display-btn" data-value="2">2</button>
                        <button class="memory-display-btn" data-value="3">3</button>
                        <button class="memory-display-btn" data-value="4">4</button>
                    </div>
                </div>
                <div class="memory-solution" id="memory-solution-${moduleId}">
                    <strong>Press:</strong> <span class="solution-text">Select display number</span>
                </div>
                <div class="memory-input-section" id="memory-input-${moduleId}" style="display:none;">
                    <p id="memory-input-label-${moduleId}" style="margin: 0 0 10px 0; font-weight: bold;">Enter the label on that button:</p>
                    <div class="memory-input-buttons">
                        <button class="memory-input-btn" data-value="1">1</button>
                        <button class="memory-input-btn" data-value="2">2</button>
                        <button class="memory-input-btn" data-value="3">3</button>
                        <button class="memory-input-btn" data-value="4">4</button>
                    </div>
                </div>
                <div class="memory-history" id="memory-history-${moduleId}">
                    <strong>History:</strong>
                    <div class="history-list"></div>
                </div>
                <button class="memory-reset-btn" id="memory-reset-${moduleId}">Reset Module</button>
            </div>
        </div>
    `;
}

function setupMemoryModule(moduleId) {
    const displayButtons = document.querySelectorAll(`#module-${moduleId} .memory-display-btn`);
    const resetBtn = document.getElementById(`memory-reset-${moduleId}`);
    const inputSection = document.getElementById(`memory-input-${moduleId}`);
    const inputLabel = document.getElementById(`memory-input-label-${moduleId}`);
    
    // Initialize memory state for this module
    window[`memoryState_${moduleId}`] = {
        stage: 1,
        history: [], // Will store {position, label} for each stage
        waitingForInput: false,
        currentInstruction: null
    };
    
    // Display button listeners
    displayButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const displayValue = parseInt(this.getAttribute('data-value'));
            handleDisplayClick(moduleId, displayValue);
        });
    });
    
    // Input button listeners (added after display click)
    // We'll set this up dynamically when input section is shown
    
    // Reset button
    resetBtn.addEventListener('click', () => {
        window[`memoryState_${moduleId}`] = {
            stage: 1,
            history: [],
            waitingForInput: false,
            currentInstruction: null
        };
        document.getElementById(`memory-stage-${moduleId}`).textContent = '1';
        inputSection.style.display = 'none';
        updateMemoryHistory(moduleId);
        
        const solutionDiv = document.getElementById(`memory-solution-${moduleId}`);
        solutionDiv.querySelector('.solution-text').textContent = 'Select display number';
        solutionDiv.querySelector('.solution-text').style.color = '#666';
        
        // Re-enable display buttons
        displayButtons.forEach(btn => btn.disabled = false);
    });
    
    updateMemoryHistory(moduleId);
}

function handleDisplayClick(moduleId, displayValue) {
    const state = window[`memoryState_${moduleId}`];
    const solutionDiv = document.getElementById(`memory-solution-${moduleId}`);
    const solutionText = solutionDiv.querySelector('.solution-text');
    const inputSection = document.getElementById(`memory-input-${moduleId}`);
    const inputLabel = document.getElementById(`memory-input-label-${moduleId}`);
    const inputValue = document.getElementById(`memory-input-value-${moduleId}`);
    const stage = state.stage;
    
    let instruction = '';
    let needsInput = false;
    let inputPrompt = '';
    
    // Implement the memory rules for each stage
    if (stage === 1) {
        if (displayValue === 1) instruction = { type: 'position', value: 2 };
        else if (displayValue === 2) instruction = { type: 'position', value: 2 };
        else if (displayValue === 3) instruction = { type: 'position', value: 3 };
        else if (displayValue === 4) instruction = { type: 'position', value: 4 };
    } else if (stage === 2) {
        if (displayValue === 1) instruction = { type: 'label', value: 4 };
        else if (displayValue === 2) instruction = { type: 'position', value: state.history[0].position };
        else if (displayValue === 3) instruction = { type: 'position', value: 1 };
        else if (displayValue === 4) instruction = { type: 'position', value: state.history[0].position };
    } else if (stage === 3) {
        if (displayValue === 1) instruction = { type: 'label', value: state.history[1].label };
        else if (displayValue === 2) instruction = { type: 'label', value: state.history[0].label };
        else if (displayValue === 3) instruction = { type: 'position', value: 3 };
        else if (displayValue === 4) instruction = { type: 'label', value: 4 };
    } else if (stage === 4) {
        if (displayValue === 1) instruction = { type: 'position', value: state.history[0].position };
        else if (displayValue === 2) instruction = { type: 'position', value: 1 };
        else if (displayValue === 3) instruction = { type: 'position', value: state.history[1].position };
        else if (displayValue === 4) instruction = { type: 'position', value: state.history[1].position };
    } else if (stage === 5) {
        if (displayValue === 1) instruction = { type: 'label', value: state.history[0].label };
        else if (displayValue === 2) instruction = { type: 'label', value: state.history[1].label };
        else if (displayValue === 3) instruction = { type: 'label', value: state.history[3].label };
        else if (displayValue === 4) instruction = { type: 'label', value: state.history[2].label };
    }
    
    // Display the instruction
    if (instruction.type === 'position') {
        solutionText.innerHTML = `<strong>Position ${instruction.value}</strong>`;
        solutionText.style.color = '#000';
        needsInput = true;
        inputPrompt = `Enter the label on button ${instruction.value}:`;
        state.currentInstruction = { ...instruction, position: instruction.value };
    } else if (instruction.type === 'label') {
        solutionText.innerHTML = `<strong>Labeled "${instruction.value}"</strong>`;
        solutionText.style.color = '#000';
        needsInput = true;
        inputPrompt = `Enter the position of button labeled "${instruction.value}":`;
        state.currentInstruction = { ...instruction, label: instruction.value };
    }
    
    // Show input if needed
    if (needsInput) {
        inputLabel.textContent = inputPrompt;
        inputSection.style.display = 'block';
        state.waitingForInput = true;
        
        // Set up input button listeners
        const inputButtons = document.querySelectorAll(`#module-${moduleId} .memory-input-btn`);
        inputButtons.forEach(btn => {
            // Remove old listeners by cloning
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', function() {
                const value = parseInt(this.getAttribute('data-value'));
                completeStage(moduleId, value);
            });
        });
    }
}

function completeStage(moduleId, inputVal) {
    const state = window[`memoryState_${moduleId}`];
    const inputSection = document.getElementById(`memory-input-${moduleId}`);
    const solutionDiv = document.getElementById(`memory-solution-${moduleId}`);
    const solutionText = solutionDiv.querySelector('.solution-text');
    
    if (!state.waitingForInput || !state.currentInstruction) return;
    
    let position, label;
    
    if (state.currentInstruction.type === 'position') {
        // We told them position, they give us label
        position = state.currentInstruction.position;
        label = inputVal;
    } else {
        // We told them label, they give us position
        position = inputVal;
        label = state.currentInstruction.label;
    }
    
    // Save to history
    state.history.push({ position, label });
    
    // Update history display
    updateMemoryHistory(moduleId);
    
    // Hide input
    inputSection.style.display = 'none';
    state.waitingForInput = false;
    state.currentInstruction = null;
    
    // Advance stage
    state.stage++;
    
    if (state.stage > 5) {
        // Module complete!
        document.getElementById(`memory-stage-${moduleId}`).textContent = '✓ COMPLETE';
        solutionText.innerHTML = '<span style="color: #4caf50; font-weight: bold;">✓ Module Disarmed!</span>';
        
        // Disable display buttons
        const displayButtons = document.querySelectorAll(`#module-${moduleId} .memory-display-btn`);
        displayButtons.forEach(btn => btn.disabled = true);
    } else {
        document.getElementById(`memory-stage-${moduleId}`).textContent = state.stage;
        solutionText.textContent = 'Select display number';
        solutionText.style.color = '#666';
    }
}

function updateMemoryHistory(moduleId) {
    const state = window[`memoryState_${moduleId}`];
    const historyList = document.querySelector(`#memory-history-${moduleId} .history-list`);
    
    if (state.history.length === 0) {
        historyList.innerHTML = '<em style="color: #999;">No stages completed yet</em>';
    } else {
        historyList.innerHTML = state.history.map((h, idx) => 
            `<div class="history-item">Stage ${idx + 1}: Position ${h.position}, Label ${h.label}</div>`
        ).join('');
    }
}

// Morse Code Module Functions
const MORSE_CODE_MAP = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
    '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
    '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
    '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
    '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
    '--..': 'Z'
};

const MORSE_WORDS = {
    'shell': '3.505',
    'halls': '3.515',
    'slick': '3.522',
    'trick': '3.532',
    'boxes': '3.535',
    'leaks': '3.542',
    'strobe': '3.545',
    'bistro': '3.552',
    'flick': '3.555',
    'bombs': '3.565',
    'break': '3.572',
    'brick': '3.575',
    'steak': '3.582',
    'sting': '3.592',
    'vector': '3.595',
    'beats': '3.600'
};

function createMorseCodeModule(moduleId) {
    return `
        <button class="toggle-btn" onclick="toggleModule(${moduleId})" title="Minimize module">▲</button>
        <button class="complete-btn" onclick="completeModule(${moduleId})" title="Mark as complete">✓</button>
        <button class="close-btn" onclick="removeModule(${moduleId})" title="Remove module">×</button>
        <h3>Morse Code</h3>
        <div class="module-content">
            <div class="morse-controls">
                <div class="morse-input-section">
                    <p style="margin: 0 0 10px 0;"><strong>Enter morse code for each letter:</strong></p>
                    <div class="morse-input-buttons">
                        <button class="morse-input-btn morse-dot">· DOT</button>
                        <button class="morse-input-btn morse-dash">— DASH</button>
                        <button class="morse-input-btn morse-space">SPACE</button>
                        <button class="morse-input-btn morse-clear">CLEAR</button>
                    </div>
                </div>
                <div class="morse-display" id="morse-display-${moduleId}">
                    <div class="morse-raw"><strong>Morse:</strong> <span class="morse-raw-text"></span></div>
                    <div class="morse-decoded"><strong>Word:</strong> <span class="morse-decoded-text">—</span></div>
                </div>
                <div class="morse-solution" id="morse-solution-${moduleId}">
                    <strong>Frequency:</strong> <span class="solution-text">Enter morse code to decode</span>
                </div>
            </div>
        </div>
    `;
}

function setupMorseCodeModule(moduleId) {
    const dotBtn = document.querySelector(`#module-${moduleId} .morse-dot`);
    const dashBtn = document.querySelector(`#module-${moduleId} .morse-dash`);
    const spaceBtn = document.querySelector(`#module-${moduleId} .morse-space`);
    const clearBtn = document.querySelector(`#module-${moduleId} .morse-clear`);
    const rawText = document.querySelector(`#module-${moduleId} .morse-raw-text`);
    const decodedText = document.querySelector(`#module-${moduleId} .morse-decoded-text`);
    
    // Initialize state
    window[`morseState_${moduleId}`] = {
        currentLetter: '',
        letters: [],
        morseInput: ''
    };
    
    dotBtn.addEventListener('click', () => {
        const state = window[`morseState_${moduleId}`];
        state.currentLetter += '.';
        state.morseInput += '.';
        updateMorseDisplay(moduleId);
    });
    
    dashBtn.addEventListener('click', () => {
        const state = window[`morseState_${moduleId}`];
        state.currentLetter += '-';
        state.morseInput += '-';
        updateMorseDisplay(moduleId);
    });
    
    spaceBtn.addEventListener('click', () => {
        const state = window[`morseState_${moduleId}`];
        if (state.currentLetter) {
            // Decode current letter
            const letter = MORSE_CODE_MAP[state.currentLetter];
            if (letter) {
                state.letters.push(letter);
                state.morseInput += ' ';
            }
            state.currentLetter = '';
            updateMorseDisplay(moduleId);
        }
    });
    
    clearBtn.addEventListener('click', () => {
        window[`morseState_${moduleId}`] = {
            currentLetter: '',
            letters: [],
            morseInput: ''
        };
        updateMorseDisplay(moduleId);
    });
    
    updateMorseDisplay(moduleId);
}

function updateMorseDisplay(moduleId) {
    const state = window[`morseState_${moduleId}`];
    const rawText = document.querySelector(`#module-${moduleId} .morse-raw-text`);
    const decodedText = document.querySelector(`#module-${moduleId} .morse-decoded-text`);
    const solutionDiv = document.getElementById(`morse-solution-${moduleId}`);
    const solutionText = solutionDiv.querySelector('.solution-text');
    
    // Show morse input
    let displayMorse = state.morseInput;
    if (state.currentLetter) {
        displayMorse += state.currentLetter + ' (?)';
    }
    rawText.textContent = displayMorse || '—';
    
    // Show decoded word
    let word = state.letters.join('');
    if (state.currentLetter) {
        const possibleLetter = MORSE_CODE_MAP[state.currentLetter];
        if (possibleLetter) {
            word += possibleLetter + '?';
        }
    }
    decodedText.textContent = word || '—';
    
    // Check if word matches
    const finalWord = state.letters.join('').toLowerCase();
    if (finalWord && MORSE_WORDS[finalWord]) {
        solutionText.innerHTML = `<strong>${MORSE_WORDS[finalWord]} MHz</strong>`;
        solutionText.style.color = '#000';
        solutionDiv.style.backgroundColor = '#e8f5e9';
        solutionDiv.style.borderColor = '#4caf50';
    } else if (finalWord) {
        // Check for partial matches
        const matches = Object.keys(MORSE_WORDS).filter(w => w.startsWith(finalWord));
        if (matches.length === 1) {
            // Only one possible answer - show it with the frequency
            solutionText.innerHTML = `<strong>${MORSE_WORDS[matches[0]]} MHz</strong>`;
            solutionText.style.color = '#000';
            solutionDiv.style.backgroundColor = '#e8f5e9';
            solutionDiv.style.borderColor = '#4caf50';
        } else if (matches.length > 1) {
            solutionText.textContent = `Possible: ${matches.join(', ')}`;
            solutionText.style.color = '#666';
            solutionDiv.style.backgroundColor = '#fff3cd';
            solutionDiv.style.borderColor = '#ffc107';
        } else {
            solutionText.textContent = 'No match found';
            solutionText.style.color = '#999';
            solutionDiv.style.backgroundColor = '#f5f5f5';
            solutionDiv.style.borderColor = '#ddd';
        }
    } else {
        solutionText.textContent = 'Enter morse code to decode';
        solutionText.style.color = '#666';
        solutionDiv.style.backgroundColor = '#f5f5f5';
        solutionDiv.style.borderColor = '#ddd';
    }
}


// ==================== COMPLICATED WIRES MODULE ====================

function createComplicatedWiresModule(moduleId) {
    return `
        <button class="toggle-btn" onclick="toggleModule(${moduleId})" title="Minimize module">▲</button>
        <button class="complete-btn" onclick="completeModule(${moduleId})" title="Mark as complete">✓</button>
        <button class="close-btn" onclick="removeModule(${moduleId})" title="Remove module">×</button>
        <h3>Complicated Wires</h3>
        <div class="module-content">
            <div class="complicated-wires-controls">
                <button class="add-wire-btn" id="add-wire-btn-${moduleId}">+ Add Wire</button>
            </div>
            <div class="complicated-wires-list" id="complicated-wires-list-${moduleId}">
                <div class="no-wires-message">Click "Add Wire" to begin</div>
            </div>
        </div>
    `;
}

function setupComplicatedWiresModule(moduleId) {
    const wiresList = document.getElementById(`complicated-wires-list-${moduleId}`);
    const addWireBtn = document.getElementById(`add-wire-btn-${moduleId}`);
    let wires = []; // Array to store wire objects
    let wireIdCounter = 0;
    
    addWireBtn.addEventListener('click', function() {
        addWire();
    });
    
    function addWire() {
        wireIdCounter++;
        const wireId = wireIdCounter;
        const wire = {
            id: wireId,
            hasRed: false,
            hasBlue: false,
            hasStar: false,
            ledOn: false
        };
        wires.unshift(wire); // Add to the beginning of the array
        updateWiresList();
    }
    
    function removeWire(wireId) {
        wires = wires.filter(w => w.id !== wireId);
        updateWiresList();
    }
    
    function updateWire(wireId, property, value) {
        const wire = wires.find(w => w.id === wireId);
        if (wire) {
            wire[property] = value;
            updateWiresList();
        }
    }
    
    function updateWiresList() {
        if (wires.length === 0) {
            wiresList.innerHTML = '<div class="no-wires-message">Click "Add Wire" to begin</div>';
            return;
        }
        
        wiresList.innerHTML = '';
        wires.forEach((wire, index) => {
            const wireDiv = document.createElement('div');
            wireDiv.className = 'complicated-wire-item';
            
            const result = evaluateComplicatedWire(wire);
            const resultClass = result.shouldCut ? 'cut-decision' : 'no-cut-decision';
            
            wireDiv.innerHTML = `
                <div class="wire-header">
                    <span class="wire-number">Wire ${index + 1}</span>
                    <button class="remove-wire-btn" data-wire-id="${wire.id}">×</button>
                </div>
                <div class="wire-attributes">
                    <label class="checkbox-label">
                        <input type="checkbox" class="wire-checkbox" data-wire-id="${wire.id}" data-property="hasRed" ${wire.hasRed ? 'checked' : ''}>
                        <span class="checkbox-text red-text">Red</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" class="wire-checkbox" data-wire-id="${wire.id}" data-property="hasBlue" ${wire.hasBlue ? 'checked' : ''}>
                        <span class="checkbox-text blue-text">Blue</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" class="wire-checkbox" data-wire-id="${wire.id}" data-property="hasStar" ${wire.hasStar ? 'checked' : ''}>
                        <span class="checkbox-text">★ Star</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" class="wire-checkbox" data-wire-id="${wire.id}" data-property="ledOn" ${wire.ledOn ? 'checked' : ''}>
                        <span class="checkbox-text">💡 LED On</span>
                    </label>
                </div>
                <div class="wire-result ${resultClass}">
                    <div class="result-instruction">Instruction: <strong>${result.instruction}</strong></div>
                    <div class="result-decision"><strong>${result.shouldCut ? 'CUT' : 'DO NOT CUT'}</strong></div>
                    <div class="result-explanation">${result.explanation}</div>
                </div>
            `;
            wiresList.prepend(wireDiv); // Add to the top of the list
        });
        
        // Add event listeners
        wiresList.querySelectorAll('.remove-wire-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const wireId = parseInt(this.getAttribute('data-wire-id'));
                removeWire(wireId);
            });
        });
        
        wiresList.querySelectorAll('.wire-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const wireId = parseInt(this.getAttribute('data-wire-id'));
                const property = this.getAttribute('data-property');
                updateWire(wireId, property, this.checked);
            });
        });
    }
    
    // Store reference for potential updates from bomb-level inputs
    window[`updateComplicatedWires_${moduleId}`] = updateWiresList;
}

// Decision logic for Complicated Wires
function evaluateComplicatedWire(wire) {
    // Get bomb-level inputs
    const evenSerialElement = document.getElementById('even-serial');
    const parallelPortElement = document.getElementById('parallel-port');
    const batteryCountElement = document.getElementById('battery-count');
    
    const serialState = evenSerialElement.getAttribute('data-state');
    const parallelState = parallelPortElement.getAttribute('data-state');
    const batteryValue = batteryCountElement.getAttribute('data-batteries');
    
    // Parse battery count
    let batteryCount = 0;
    if (batteryValue === '0') {
        batteryCount = 0;
    } else if (batteryValue === '1') {
        batteryCount = 1;
    } else if (batteryValue === '2+') {
        batteryCount = 2;
    }
    // If '?', batteryCount remains 0
    
    const serialLastDigitEven = serialState === 'true';
    const hasParallelPort = parallelState === 'true';
    const hasTwoOrMoreBatteries = batteryCount >= 2;
    
    // Determine instruction letter using the authoritative table
    const instruction = getComplicatedWireInstruction(
        wire.hasRed,
        wire.hasBlue,
        wire.hasStar,
        wire.ledOn
    );
    
    // Determine if wire should be cut
    let shouldCut = false;
    let explanation = '';
    
    switch (instruction) {
        case 'C':
            shouldCut = true;
            explanation = 'Instruction C: Always cut the wire.';
            break;
        case 'D':
            shouldCut = false;
            explanation = 'Instruction D: Do not cut the wire.';
            break;
        case 'S':
            if (serialState === 'unknown') {
                explanation = 'Instruction S: Need serial number last digit status.';
                shouldCut = false;
            } else if (serialLastDigitEven) {
                shouldCut = true;
                explanation = 'Instruction S: Cut (serial last digit is even).';
            } else {
                shouldCut = false;
                explanation = 'Instruction S: Do not cut (serial last digit is odd).';
            }
            break;
        case 'P':
            if (parallelState === 'unknown') {
                explanation = 'Instruction P: Need parallel port status.';
                shouldCut = false;
            } else if (hasParallelPort) {
                shouldCut = true;
                explanation = 'Instruction P: Cut (parallel port is present).';
            } else {
                shouldCut = false;
                explanation = 'Instruction P: Do not cut (no parallel port).';
            }
            break;
        case 'B':
            if (hasTwoOrMoreBatteries) {
                shouldCut = true;
                explanation = `Instruction B: Cut (${batteryCount} batteries ≥ 2).`;
            } else {
                shouldCut = false;
                explanation = `Instruction B: Do not cut (${batteryCount} batteries < 2).`;
            }
            break;
    }
    
    return {
        instruction,
        shouldCut,
        explanation
    };
}

// The authoritative decision table
function getComplicatedWireInstruction(hasRed, hasBlue, hasStar, ledOn) {
    // This table is the complete Venn diagram logic
    // Red, Blue, Star, LED -> Instruction
    const key = `${hasRed ? 1 : 0}${hasBlue ? 1 : 0}${hasStar ? 1 : 0}${ledOn ? 1 : 0}`;
    
    const instructionTable = {
        '0000': 'C', // no red, no blue, no star, no LED
        '0001': 'D', // no red, no blue, no star, LED on
        '0010': 'C', // no red, no blue, star, no LED
        '0011': 'D', // no red, no blue, star, LED on
        '0100': 'S', // no red, blue, no star, no LED
        '0101': 'P', // no red, blue, no star, LED on
        '0110': 'C', // no red, blue, star, no LED
        '0111': 'P', // no red, blue, star, LED on
        '1000': 'S', // red, no blue, no star, no LED
        '1001': 'B', // red, no blue, no star, LED on
        '1010': 'C', // red, no blue, star, no LED
        '1011': 'B', // red, no blue, star, LED on
        '1100': 'S', // red, blue, no star, no LED
        '1101': 'S', // red, blue, no star, LED on
        '1110': 'D', // red, blue, star, no LED
        '1111': 'D'  // red, blue, star, LED on
    };
    
    return instructionTable[key] || 'C'; // Default to C if somehow invalid
}

// Add event listeners to bomb-level inputs to update all Complicated Wires modules
document.addEventListener('DOMContentLoaded', function() {
    const evenSerialElement = document.getElementById('even-serial');
    const parallelPortElement = document.getElementById('parallel-port');
    const batteryCountElement = document.getElementById('battery-count');
    
    function updateAllComplicatedWires() {
        // Find all complicated wires modules and update them
        for (let i = 1; i <= moduleCounter; i++) {
            if (window[`updateComplicatedWires_${i}`]) {
                window[`updateComplicatedWires_${i}`]();
            }
        }
    }
    
    if (evenSerialElement) {
        evenSerialElement.addEventListener('click', function() {
            setTimeout(updateAllComplicatedWires, 10);
        });
    }
    
    if (parallelPortElement) {
        parallelPortElement.addEventListener('click', function() {
            setTimeout(updateAllComplicatedWires, 10);
        });
    }
    
    // Battery count is now handled in the main DOMContentLoaded listener above
});




