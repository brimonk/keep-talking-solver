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
                    <label>Number of wires:</label>
                    <select class="wire-count-select" id="wire-count-${moduleId}">
                        <option value="3">3 wires</option>
                        <option value="4">4 wires</option>
                        <option value="5">5 wires</option>
                        <option value="6">6 wires</option>
                    </select>
                </div>
                <div class="wires-list" id="wires-list-${moduleId}">
                    <!-- Wire selectors will be added here -->
                </div>
                <div class="solution-box" id="solution-${moduleId}">
                    Select wire colors to see solution
                </div>
            </div>
        `;
    }
    
    function setupWiresModule(moduleId) {
        const wireCountSelect = document.getElementById(`wire-count-${moduleId}`);
        const wiresList = document.getElementById(`wires-list-${moduleId}`);
        
        function updateWiresList() {
            const count = parseInt(wireCountSelect.value);
            wiresList.innerHTML = '';
            
            for (let i = 1; i <= count; i++) {
                const wireDiv = document.createElement('div');
                wireDiv.className = 'wire-item';
                wireDiv.innerHTML = `
                    <label>Wire ${i}:</label>
                    <select class="wire-color-select" data-wire="${i}">
                        <option value="">--</option>
                        <option value="red">Red</option>
                        <option value="blue">Blue</option>
                        <option value="yellow">Yellow</option>
                        <option value="white">White</option>
                        <option value="black">Black</option>
                    </select>
                `;
                wiresList.appendChild(wireDiv);
            }
            
            // Add change listeners to all wire selects
            wiresList.querySelectorAll('.wire-color-select').forEach(select => {
                select.addEventListener('change', () => solveWires(moduleId));
            });
            
            solveWires(moduleId);
        }
        
        wireCountSelect.addEventListener('change', updateWiresList);
        updateWiresList(); // Initialize with 3 wires
    }
    
    function solveWires(moduleId) {
        const wireCountSelect = document.getElementById(`wire-count-${moduleId}`);
        const wiresList = document.getElementById(`wires-list-${moduleId}`);
        const solutionBox = document.getElementById(`solution-${moduleId}`);
        const evenSerial = document.getElementById('even-serial');
        
        const count = parseInt(wireCountSelect.value);
        const wires = [];
        
        // Get all wire colors
        wiresList.querySelectorAll('.wire-color-select').forEach(select => {
            wires.push(select.value);
        });
        
        // Check if all wires are selected
        if (wires.some(w => w === '')) {
            solutionBox.textContent = 'Select all wire colors to see solution';
            solutionBox.className = 'solution-box';
            return;
        }
        
        const serialIsOdd = evenSerial.getAttribute('data-state') === 'false';
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
            if (redCount > 1 && serialIsOdd) {
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
        } else if (count === 5) {
            if (lastWire === 'black' && serialIsOdd) {
                wireToCut = 4;
            } else if (redCount === 1 && yellowCount > 1) {
                wireToCut = 1;
            } else if (blackCount === 0) {
                wireToCut = 2;
            } else {
                wireToCut = 1;
            }
        } else if (count === 6) {
            if (yellowCount === 0 && serialIsOdd) {
                wireToCut = 3;
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
