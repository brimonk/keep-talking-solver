// Keep Talking and Nobody Explodes - Helper
// Module management

let moduleCounter = 0;

document.addEventListener('DOMContentLoaded', function() {
    const moduleSelect = document.getElementById('module-select');
    const modulesContainer = document.getElementById('modules-container');
    
    // Add module when selected from dropdown
    moduleSelect.addEventListener('change', function() {
        const selectedModule = moduleSelect.value;
        
        if (selectedModule) {
            addModule(selectedModule);
            // Reset select to default
            moduleSelect.value = '';
        }
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
                    <label>Add wire:</label>
                    <select class="add-wire-select" id="add-wire-${moduleId}">
                        <option value="">-- Select color --</option>
                        <option value="red">Red</option>
                        <option value="blue">Blue</option>
                        <option value="yellow">Yellow</option>
                        <option value="white">White</option>
                        <option value="black">Black</option>
                    </select>
                </div>
                <div class="wires-list" id="wires-list-${moduleId}">
                    <div class="no-wires-message">Add wires using the dropdown above</div>
                </div>
                <div class="solution-box" id="solution-${moduleId}">
                    Add 3-6 wires to see solution
                </div>
            </div>
        `;
    }
    
    function setupWiresModule(moduleId) {
        const addWireSelect = document.getElementById(`add-wire-${moduleId}`);
        const wiresList = document.getElementById(`wires-list-${moduleId}`);
        let wires = []; // Array to store wire colors
        
        addWireSelect.addEventListener('change', function() {
            const color = this.value;
            if (color && wires.length < 6) {
                addWire(color);
                this.value = ''; // Reset dropdown
            }
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
                wiresList.innerHTML = '<div class="no-wires-message">Add wires using the dropdown above</div>';
                return;
            }
            
            wiresList.innerHTML = '';
            wires.forEach((color, index) => {
                const wireDiv = document.createElement('div');
                wireDiv.className = 'wire-item';
                wireDiv.innerHTML = `
                    <span class="wire-number">Wire ${index + 1}:</span>
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
            
            // Enable/disable add wire select based on wire count
            addWireSelect.disabled = wires.length >= 6;
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
                    <div class="button-input-group">
                        <label>Lit CAR Indicator:</label>
                        <select class="button-select" id="button-car-${moduleId}">
                            <option value="">-- Select --</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    <div class="button-input-group">
                        <label>Lit FRK Indicator:</label>
                        <select class="button-select" id="button-frk-${moduleId}">
                            <option value="">-- Select --</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>
                <div class="solution-box" id="button-solution-${moduleId}">
                    Select all button properties to see solution
                </div>
                <div class="strip-section" id="strip-section-${moduleId}" style="display: none;">
                    <div class="strip-input-group">
                        <label>Strip Color When Held:</label>
                        <select class="button-select" id="button-strip-${moduleId}">
                            <option value="">-- Select --</option>
                            <option value="blue">Blue</option>
                            <option value="white">White</option>
                            <option value="yellow">Yellow</option>
                            <option value="other">Other (Red/Green/etc)</option>
                        </select>
                    </div>
                    <div class="solution-box" id="strip-solution-${moduleId}">
                        Select strip color to see when to release
                    </div>
                </div>
            </div>
        `;
    }
    
    function setupButtonModule(moduleId) {
        const colorSelect = document.getElementById(`button-color-${moduleId}`);
        const textSelect = document.getElementById(`button-text-${moduleId}`);
        const batteriesSelect = document.getElementById(`button-batteries-${moduleId}`);
        const carSelect = document.getElementById(`button-car-${moduleId}`);
        const frkSelect = document.getElementById(`button-frk-${moduleId}`);
        const stripSelect = document.getElementById(`button-strip-${moduleId}`);
        
        const selects = [colorSelect, textSelect, batteriesSelect, carSelect, frkSelect];
        
        selects.forEach(select => {
            select.addEventListener('change', () => solveButton(moduleId));
        });
        
        stripSelect.addEventListener('change', () => solveButtonStrip(moduleId));
    }
    
    function solveButton(moduleId) {
        const colorSelect = document.getElementById(`button-color-${moduleId}`);
        const textSelect = document.getElementById(`button-text-${moduleId}`);
        const batteriesSelect = document.getElementById(`button-batteries-${moduleId}`);
        const carSelect = document.getElementById(`button-car-${moduleId}`);
        const frkSelect = document.getElementById(`button-frk-${moduleId}`);
        const solutionBox = document.getElementById(`button-solution-${moduleId}`);
        const stripSection = document.getElementById(`strip-section-${moduleId}`);
        
        const color = colorSelect.value;
        const text = textSelect.value;
        const batteries = parseInt(batteriesSelect.value);
        const hasCar = carSelect.value === 'yes';
        const hasFrk = frkSelect.value === 'yes';
        
        // Check if all fields are selected
        if (!color || !text || batteriesSelect.value === '' || carSelect.value === '' || frkSelect.value === '') {
            solutionBox.textContent = 'Select all button properties to see solution';
            solutionBox.className = 'solution-box';
            stripSection.style.display = 'none';
            return;
        }
        
        let action = null;
        
        // Rule 1: Blue button + "Abort"
        if (color === 'blue' && text === 'abort') {
            action = 'hold';
        }
        // Rule 2: More than 1 battery + "Detonate"
        else if (batteries > 1 && text === 'detonate') {
            action = 'press';
        }
        // Rule 3: White button + lit CAR
        else if (color === 'white' && hasCar) {
            action = 'hold';
        }
        // Rule 4: More than 2 batteries + lit FRK
        else if (batteries > 2 && hasFrk) {
            action = 'press';
        }
        // Rule 5: Yellow button
        else if (color === 'yellow') {
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
        
        if (action === 'press') {
            solutionBox.textContent = '👆 Press and immediately release';
            solutionBox.className = 'solution-box solved';
            stripSection.style.display = 'none';
        } else {
            solutionBox.textContent = '✋ Hold the button down';
            solutionBox.className = 'solution-box solved';
            stripSection.style.display = 'block';
            solveButtonStrip(moduleId);
        }
    }
    
    function solveButtonStrip(moduleId) {
        const stripSelect = document.getElementById(`button-strip-${moduleId}`);
        const stripSolution = document.getElementById(`strip-solution-${moduleId}`);
        
        const stripColor = stripSelect.value;
        
        if (!stripColor) {
            stripSolution.textContent = 'Select strip color to see when to release';
            stripSolution.className = 'solution-box';
            return;
        }
        
        let releaseInstruction = '';
        
        if (stripColor === 'blue') {
            releaseInstruction = 'Release when timer has a 4 in any position';
        } else if (stripColor === 'white') {
            releaseInstruction = 'Release when timer has a 1 in any position';
        } else if (stripColor === 'yellow') {
            releaseInstruction = 'Release when timer has a 5 in any position';
        } else if (stripColor === 'other') {
            releaseInstruction = 'Release when timer has a 1 in any position';
        }
        
        stripSolution.textContent = `⏱️ ${releaseInstruction}`;
        stripSolution.className = 'solution-box solved';
    }
    
    // Store bomb indicators state when they change
    const batteries = document.getElementById('batteries');

    const parallelPort = document.getElementById('parallel-port');
    const evenSerial = document.getElementById('even-serial');
    const serialVowel = document.getElementById('serial-vowel');
    
    const indicators = [batteries, parallelPort, evenSerial, serialVowel];
    
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
            
            // Log the current state of all indicators
            console.log('Bomb indicators updated:', {
                batteries: batteries.getAttribute('data-state'),
                parallelPort: parallelPort.getAttribute('data-state'),
                evenSerial: evenSerial.getAttribute('data-state'),
                serialVowel: serialVowel.getAttribute('data-state')
            });
        });
    });
});
