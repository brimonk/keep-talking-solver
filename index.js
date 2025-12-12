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
        
        // Setup wire module if it's a Wires module
        if (moduleName === 'Wires') {
            setupWiresModule(moduleCounter);
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
