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
        } else {
            moduleContent = `
                <button class="close-btn" onclick="removeModule(${moduleCounter})" title="Remove module">×</button>
                <h3>${moduleName}</h3>
                <div class="module-content">
                    Module not yet solved
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
        }
    }
    
    // Make removeModule function globally available
    window.removeModule = function(moduleId) {
        const moduleCard = document.getElementById(`module-${moduleId}`);
        if (moduleCard) {
            moduleCard.remove();
        }
    };
    
    // Wires Module Functions
    function createWiresModule(moduleId) {
        return `
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
                    <div class="button-input-group">
                        <label>Number of Batteries:</label>
                        <select class="button-select" id="button-batteries-${moduleId}">
                            <option value="">-- Select --</option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4+</option>
                        </select>
                    </div>
                </div>
                <div class="solution-box" id="button-solution-${moduleId}">
                    Select all button properties to see solution
                </div>
            </div>
        `;
    }
    
    function setupButtonModule(moduleId) {
        const colorSelect = document.getElementById(`button-color-${moduleId}`);
        const textSelect = document.getElementById(`button-text-${moduleId}`);
        const batteriesSelect = document.getElementById(`button-batteries-${moduleId}`);
        
        const selects = [colorSelect, textSelect, batteriesSelect];
        
        selects.forEach(select => {
            select.addEventListener('change', () => solveButton(moduleId));
        });
    }
    
    function solveButton(moduleId) {
        const colorSelect = document.getElementById(`button-color-${moduleId}`);
        const textSelect = document.getElementById(`button-text-${moduleId}`);
        const batteriesSelect = document.getElementById(`button-batteries-${moduleId}`);
        const solutionBox = document.getElementById(`button-solution-${moduleId}`);
        
        const litCar = document.getElementById('lit-car');
        const litFrk = document.getElementById('lit-frk');
        
        const color = colorSelect.value;
        const text = textSelect.value;
        const batteries = parseInt(batteriesSelect.value);
        const carState = litCar.getAttribute('data-state');
        const frkState = litFrk.getAttribute('data-state');
        
        // Check if all required fields are selected
        if (!color || !text || batteriesSelect.value === '') {
            solutionBox.textContent = 'Select all button properties to see solution';
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
        1: { red: 'yellow', blue: 'green', yellow: 'blue', green: 'red' },
        2: { red: 'green', blue: 'red', yellow: 'yellow', green: 'blue' }
    };
    
    const mappingWithoutVowel = {
        0: { red: 'blue', blue: 'yellow', yellow: 'green', green: 'red' },
        1: { red: 'red', blue: 'blue', yellow: 'yellow', green: 'green' },
        2: { red: 'yellow', blue: 'green', yellow: 'blue', green: 'red' }
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

