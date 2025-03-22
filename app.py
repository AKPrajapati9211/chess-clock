from flask import Flask, render_template, jsonify, request
from datetime import datetime, timedelta

app = Flask(__name__)

# Global variables
player1_time = timedelta(minutes=10)
player2_time = timedelta(minutes=10)
current_player = 1
is_running = False
last_update_time = datetime.now()
increment = timedelta(seconds=0)
player1_clicks = 0
player2_clicks = 0

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_time')
def get_time():
    global player1_time, player2_time, last_update_time, is_running

    if is_running:
        now = datetime.now()
        elapsed = now - last_update_time
        last_update_time = now

        if current_player == 1:
            player1_time -= elapsed
        else:
            player2_time -= elapsed

    return jsonify({
        'player1_time': max(player1_time.total_seconds(), 0),
        'player2_time': max(player2_time.total_seconds(), 0),
        'current_player': current_player,
        'is_running': is_running,
        'player1_clicks': player1_clicks,
        'player2_clicks': player2_clicks
    })

@app.route('/switch_player')
def switch_player():
    global current_player, last_update_time, player1_time, player2_time, player1_clicks, player2_clicks

    if current_player == 1:
        player1_time += increment
        player1_clicks += 1
    else:
        player2_time += increment
        player2_clicks += 1

    current_player = 3 - current_player
    last_update_time = datetime.now()
    return jsonify({'status': 'success'})

@app.route('/start', methods=['POST'])
def start():
    global is_running, last_update_time, player1_time, player2_time, increment

    data = request.json
    player1_time = timedelta(minutes=int(data['player1_minutes']), seconds=int(data['player1_seconds']))
    player2_time = timedelta(minutes=int(data['player2_minutes']), seconds=int(data['player2_seconds']))
    increment = timedelta(seconds=int(data['increment']))

    is_running = True
    last_update_time = datetime.now()
    return jsonify({'status': 'started'})

@app.route('/pause')
def pause():
    global is_running
    is_running = False
    return jsonify({'status': 'paused'})

@app.route('/update_settings', methods=['POST'])
def update_settings():
    global player1_time, player2_time, increment

    data = request.json
    player1_time = timedelta(minutes=int(data['player1_minutes']), seconds=int(data['player1_seconds']))
    player2_time = timedelta(minutes=int(data['player2_minutes']), seconds=int(data['player2_seconds']))
    increment = timedelta(seconds=int(data['increment']))

    return jsonify({'status': 'settings updated'})


@app.route('/reset')
def reset():
    global player1_time, player2_time, current_player, is_running, player1_clicks, player2_clicks
    player1_time = timedelta(minutes=10)
    player2_time = timedelta(minutes=10)
    increment = timedelta(seconds=0)
    current_player = 1
    is_running = False
    player1_clicks = 0
    player2_clicks = 0
    return jsonify({'status': 'reset'})

if __name__ == '__main__':
    app.run(debug=True)