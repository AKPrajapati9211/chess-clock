let isClockRunning = false; // Track if the clock is running

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateClocks(data) {
    const player1Clock = document.getElementById('player1-clock');
    const player2Clock = document.getElementById('player2-clock');

    // Update time display
    player1Clock.querySelector('.time').textContent = formatTime(data.player1_time);
    player2Clock.querySelector('.time').textContent = formatTime(data.player2_time);

    // Update click counters
    player1Clock.querySelector('.clicks').textContent = `Moves: ${data.player1_clicks}`;
    player2Clock.querySelector('.clicks').textContent = `Moves: ${data.player2_clicks}`;

    // Highlight the active player's clock
    player1Clock.classList.toggle('active', data.current_player === 1);
    player2Clock.classList.toggle('active', data.current_player === 2);

    // Disable buttons if time runs out
    if (data.player1_time <= 0 || data.player2_time <= 0) {
        player1Clock.classList.add('disabled');
        player2Clock.classList.add('disabled');
        if (data.player1_time <= 0) {
            player1Clock.classList.add('timeout'); // Turn red
        }
        if (data.player2_time <= 0) {
            player2Clock.classList.add('timeout'); // Turn red
        }
    } else {
        // If the clock is running, disable the inactive player's button
        if (data.is_running) {
            if (data.current_player === 1) {
                player1Clock.classList.remove('disabled');
                player2Clock.classList.add('disabled');
            } else {
                player1Clock.classList.add('disabled');
                player2Clock.classList.remove('disabled');
            }
        } else {
            // If the clock is paused or reset, enable both buttons
            player1Clock.classList.remove('disabled');
            player2Clock.classList.remove('disabled');
        }
    }
}

async function fetchTime() {
    const response = await fetch('/get_time');
    const data = await response.json();
    updateClocks(data);
}

async function switchPlayer() {
    // Only switch if the clock is running and the button is not disabled
    const player1Clock = document.getElementById('player1-clock');
    const player2Clock = document.getElementById('player2-clock');

    if (player1Clock.classList.contains('active') && !player1Clock.classList.contains('disabled')) {
        await fetch('/switch_player');
    } else if (player2Clock.classList.contains('active') && !player2Clock.classList.contains('disabled')) {
        await fetch('/switch_player');
    }
}

// Start/Pause button functionality
document.getElementById('start-pause-btn').addEventListener('click', async () => {
    const startPauseBtn = document.getElementById('start-pause-btn');
    if (isClockRunning) {
        // Pause the clock
        await fetch('/pause');
        startPauseBtn.textContent = 'Start';
    } else {
        // Start the clock
        await fetch('/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                player1_minutes: parseInt(document.getElementById('player1-minutes').value),
                player1_seconds: parseInt(document.getElementById('player1-seconds').value),
                player2_minutes: parseInt(document.getElementById('player2-minutes').value),
                player2_seconds: parseInt(document.getElementById('player2-seconds').value),
                increment: parseInt(document.getElementById('increment').value)
            }),
        });
        startPauseBtn.textContent = 'Pause';
    }
    isClockRunning = !isClockRunning; // Toggle the state
});

document.getElementById('reset-btn').addEventListener('click', async () => {
    // Reset the clock
    await fetch('/reset');
    document.getElementById('start-pause-btn').textContent = 'Start';
    isClockRunning = false;
});

document.getElementById('set-time-btn').addEventListener('click', () => {
    // Show the time control popup
    document.getElementById('time-control-popup').style.display = 'block';
});

document.getElementById('close-popup').addEventListener('click', () => {
    // Hide the time control popup
    document.getElementById('time-control-popup').style.display = 'none';
});

document.getElementById('apply-settings').addEventListener('click', async () => {
    // Get custom time settings
    const player1Minutes = parseInt(document.getElementById('player1-minutes').value);
    const player1Seconds = parseInt(document.getElementById('player1-seconds').value);
    const player2Minutes = parseInt(document.getElementById('player2-minutes').value);
    const player2Seconds = parseInt(document.getElementById('player2-seconds').value);
    const increment = parseInt(document.getElementById('increment').value);

    // Send settings to the backend (does not start the clock)
    await fetch('/update_settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            player1_minutes: player1Minutes,
            player1_seconds: player1Seconds,
            player2_minutes: player2Minutes,
            player2_seconds: player2Seconds,
            increment: increment
        }),
    });

    // Hide the popup
    document.getElementById('time-control-popup').style.display = 'none';
});

// Fetch time every 100ms
setInterval(fetchTime, 100);