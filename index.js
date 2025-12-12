// Keep Talking and Nobody Explodes - Helper
// Module management

let moduleCounter = 0;

document.addEventListener('DOMContentLoaded', function() {
    const modulesContainer = document.getElementById('modules-container');
    const moduleButtons = document.querySelectorAll('.module-btn');
    
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
