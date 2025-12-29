const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const optionInput = document.getElementById('option-input');
const addOptionBtn = document.getElementById('add-option-btn');
const optionsList = document.getElementById('options');
const cheatSelect = document.getElementById('cheat-select');
const ctx = wheel.getContext('2d');

let options = [];
let startAngle = 0;
let arc = Math.PI / (options.length / 2);
let spinTimeout = null;
let spinAngleStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;

function drawWheel() {
    ctx.clearRect(0, 0, 400, 400);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    arc = Math.PI / (options.length / 2);

    for (let i = 0; i < options.length; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = getPastelColor(i);

        ctx.beginPath();
        ctx.arc(200, 200, 190, angle, angle + arc, false);
        ctx.arc(200, 200, 0, angle + arc, angle, true);
        ctx.stroke();
        ctx.fill();

        ctx.save();
        ctx.fillStyle = '#000';
        ctx.translate(200 + Math.cos(angle + arc / 2) * 160, 200 + Math.sin(angle + arc / 2) * 160);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        const text = options[i];
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
    }
}

function getPastelColor(i) {
    const hue = (i * 137.508) % 360;
    return `hsl(${hue}, 80%, 90%)`;
}

function addOption() {
    const optionText = optionInput.value;
    if (optionText) {
        options.push(optionText);
        renderOptions();
        drawWheel();
        optionInput.value = '';
    }
}

function renderOptions() {
    optionsList.innerHTML = '';
    cheatSelect.innerHTML = '<option value="">None</option>';
    options.forEach((option, i) => {
        // Add to list
        const li = document.createElement('li');
        li.textContent = option;
        optionsList.appendChild(li);

        // Add to cheat select
        const cheatOption = document.createElement('option');
        cheatOption.value = i;
        cheatOption.textContent = option;
        cheatSelect.appendChild(cheatOption);
    });
}

function spin() {
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 4 * 1000;
    rotateWheel();
}

function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI) / 180;
    drawWheel();
    spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    const degrees = (startAngle * 180) / Math.PI + 90;
    const arcd = (arc * 180) / Math.PI;
    const index = Math.floor((360 - (degrees % 360)) / arcd);
    ctx.save();
    ctx.font = 'bold 30px sans-serif';
    const text = options[index];
    ctx.fillText(text, 200 - ctx.measureText(text).width / 2, 200 + 10);
    ctx.restore();
}

function easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

addOptionBtn.addEventListener('click', addOption);
spinBtn.addEventListener('click', () => {
    const cheatValue = cheatSelect.value;
    if (cheatValue !== "") {
        const cheatIndex = parseInt(cheatValue);
        const arc = Math.PI / (options.length / 2);
        const targetAngle = -(cheatIndex * arc + arc / 2);
        const currentAngle = startAngle % (2 * Math.PI);
        const rotation = targetAngle - currentAngle + 2 * Math.PI * 5; // Spin 5 times
        spinTimeTotal = 5000;
        spinAngleStart = (rotation * 180) / Math.PI / (spinTimeTotal / 30);
        rotateWheel();

    } else {
        spin();
    }
});

drawWheel();
