# Chess Clock

A web-based chess clock application built with **Flask**, **HTML**, **CSS**, and **JavaScript**. This project allows two players to manage their time during a chess game with features like start/pause, reset, and custom time controls.

---

## **Features**
- **Dual Timers**: Two big buttons for Player 1 and Player 2.
- **Start/Pause**: A single button to start or pause the clock.
- **Reset**: Resets the timers to the default or custom time.
- **Set Time Control**: A popup to set custom time and increment for both players.
- **Timeout Handling**: When a player's time reaches `00:00`, their button turns red and both buttons are disabled.
- **Mobile-Friendly Design**: Responsive layout that works on smartphones and desktops.

---

## **Technologies Used**
- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Flexbox for responsive design
- **Deployment**: GitHub Pages (for static version) or Heroku (for Flask version)

---

## **How to Run Locally**

### **Prerequisites**
1. **Python 3.x**: Ensure Python is installed on your system.
2. **Git**: To clone the repository.

### **Steps**
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AKPrajapati9211/chess-clock.git
   cd chess-clock
   
2. **Install Dependencies**:
    ```bash
    pip install -r requirements.txt

3. **Run the Application**:
    ```bash
    python app.py

4. **Open in Browser**:
    Go to http://127.0.0.1:5000 in your browser.