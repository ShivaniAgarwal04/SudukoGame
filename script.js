document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('sudoku-board');
    const boardWrapper = document.querySelector('.sudoku-board-wrapper');
    let selectedCell = null;
    
    // Minimal mock Sudoku puzzle (0 means empty)
    // For demo purposes, we define a small given map and correct solution mock map.
    const puzzles = {
        easy: [
            5,3,0,0,7,0,0,0,0,
            6,0,0,1,9,5,0,0,0,
            0,9,8,0,0,0,0,6,0,
            8,0,0,0,6,0,0,0,3,
            4,0,0,8,0,3,0,0,1,
            7,0,0,0,2,0,0,0,6,
            0,6,0,0,0,0,2,8,0,
            0,0,0,4,1,9,0,0,5,
            0,0,0,0,8,0,0,7,9
        ],
        medium: [
            0,2,0,6,0,8,0,0,0,
            5,8,0,0,0,9,7,0,0,
            0,0,0,0,4,0,0,0,0,
            3,7,0,0,0,0,5,0,0,
            6,0,0,0,0,0,0,0,4,
            0,0,8,0,0,0,0,1,3,
            0,0,0,0,2,0,0,0,0,
            0,0,9,8,0,0,0,3,6,
            0,0,0,3,0,6,0,9,0
        ],
        hard: [
            0,0,0,6,0,0,4,0,0,
            7,0,0,0,0,3,6,0,0,
            0,0,0,0,9,1,0,8,0,
            0,0,0,0,0,0,0,0,0,
            0,5,0,1,8,0,0,0,3,
            0,0,0,3,0,6,0,4,5,
            0,4,0,2,0,0,0,6,0,
            9,0,3,0,0,0,0,0,0,
            0,2,0,0,0,0,1,0,0
        ]
    };

    // Mock correct answers for a few empty spots just to show animations
    // (In a real game, this would evaluate full rules)
    // Let's say any random number usually shakes, but if we have a hardcoded answer we pulse it.
    // We'll simulate correct if cell empty and entered valid logic conceptually:
    const mockAnsMap = {
        2: 4, 3: 6, 80: 4 // e.g. cell index 2 should be 4
    };

    // 1. Generate Board Cells Function
    function loadPuzzle(difficulty) {
        board.innerHTML = '';
        selectedCell = null;
        let puzzle = puzzles[difficulty];
        
        for (let i = 0; i < 81; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            
            const valSpan = document.createElement('span');
            valSpan.classList.add('value');

            if (puzzle[i] !== 0) {
                valSpan.textContent = puzzle[i];
                cell.classList.add('given');
            }

            valSpan.style.animationDelay = `-${Math.random() * 4}s`;
            
            cell.appendChild(valSpan);
            cell.addEventListener('click', () => selectCell(cell));
            board.appendChild(cell);
        }
    }

    // Load default Level
    loadPuzzle('easy');

    // Level buttons logic
    const lvlBtns = document.querySelectorAll('.level-btn');
    lvlBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            lvlBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            let level = e.target.dataset.level;
            loadPuzzle(level);
        });
    });

    // 2. Select Cell Logic
    function selectCell(cell) {
        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }
        selectedCell = cell;
        selectedCell.classList.add('selected');
    }

    // 3. Handle Input (Panel clicks)
    const numBtns = document.querySelectorAll('.num-btn');
    numBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (selectedCell && !selectedCell.classList.contains('given')) {
                const val = btn.dataset.val;
                inputNumber(selectedCell, val);
            }
        });
    });
    
    document.getElementById('erase-btn').addEventListener('click', () => {
        if (selectedCell && !selectedCell.classList.contains('given')) {
            const valSpan = selectedCell.querySelector('.value');
            if (valSpan.textContent !== '') {
                valSpan.textContent = '';
                selectedCell.classList.remove('animate-correct', 'animate-incorrect');
            }
        }
    });

    // Handle Keyboard Input
    document.addEventListener('keydown', (e) => {
        if (selectedCell && !selectedCell.classList.contains('given')) {
            if (e.key >= '1' && e.key <= '9') {
                inputNumber(selectedCell, e.key);
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                document.getElementById('erase-btn').click();
            }
        }
    });

    // 4. Input validation and Animation triggers
    function inputNumber(cell, val) {
        const valSpan = cell.querySelector('.value');
        valSpan.textContent = val;
        
        // Remove old animation classes to re-trigger
        cell.classList.remove('animate-correct', 'animate-incorrect');
        // Small timeout to allow DOM to register removal before adding again
        setTimeout(() => {
            const idx = cell.dataset.index;
            // Simple mock behavior: 20% chance of WRONG to show shake effect
            let isCorrect = Math.random() > 0.3; 
            // override for specific test cells if needed, but random is fine for demo
            
            if (isCorrect) {
                cell.classList.add('animate-correct');
            } else {
                cell.classList.add('animate-incorrect');
                // Could increment mistakes here
            }
        }, 10);
    }

    // 5. Parallax Anti-Gravity Effect based on mouse move
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 10; // Max rotation 5deg
        const y = (e.clientY / window.innerHeight - 0.5) * -10; 
        
        // Apply rotation to the wrapper via CSS variables using a smooth transition
        boardWrapper.style.setProperty('--rot-y', `${x}deg`);
        boardWrapper.style.setProperty('--rot-x', `${y}deg`);
    });
});
