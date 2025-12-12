// Keep Talking and Nobody Explodes - Helper
// Module management

let moduleCounter = 0;

document.addEventListener('DOMContentLoaded', function() {
    const moduleSelect = document.getElementById('module-select');
    const addModuleBtn = document.getElementById('add-module-btn');
    const modulesContainer = document.getElementById('modules-container');
    
    // Add module when button is clicked
    addModuleBtn.addEventListener('click', function() {
        const selectedModule = moduleSelect.value;
        
        if (selectedModule) {
            addModule(selectedModule);
            // Reset select to default
            moduleSelect.value = '';
        }
    });
    
    // Also allow adding module by pressing Enter
    moduleSelect.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addModuleBtn.click();
        }
    });
    
    function addModule(moduleName) {
        moduleCounter++;
        
        const moduleCard = document.createElement('div');
        moduleCard.className = 'module-card';
        moduleCard.id = `module-${moduleCounter}`;
        
        moduleCard.innerHTML = `
            <button class="close-btn" onclick="removeModule(${moduleCounter})" title="Remove module">×</button>
            <h3>${moduleName}</h3>
            <div class="module-content">
                Module not yet solved
            </div>
        `;
        
        modulesContainer.appendChild(moduleCard);
    }
    
    // Make removeModule function globally available
    window.removeModule = function(moduleId) {
        const moduleCard = document.getElementById(`module-${moduleId}`);
        if (moduleCard) {
            moduleCard.remove();
        }
    };
    
    // Store bomb indicators state when they change
    const batteries = document.getElementById('batteries');
    const parallelPort = document.getElementById('parallel-port');
    const evenSerial = document.getElementById('even-serial');
    
    [batteries, parallelPort, evenSerial].forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // This could be used later for module-specific logic
            console.log('Bomb indicators updated:', {
                batteries: batteries.checked,
                parallelPort: parallelPort.checked,
                evenSerial: evenSerial.checked
            });
        });
    });
});
