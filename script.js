let cursor_dot = document.querySelector('.cursor');
let cursor_outline = document.querySelector('.cursor-outline');


window.addEventListener('mousemove', (e) => {
    let hori = e.clientX;
    let verti = e.clientY;

    cursor_dot.style.left = `${hori}px`;
    cursor_dot.style.top = `${verti}px`;

    cursor_outline.style.left = `${hori}px`;
    cursor_outline.style.top = `${verti}px`;

    

})







let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');

let pointer = {
    x: 0.5 * window.innerWidth,
    y: 0.5 * window.innerHeight,
};

let param = {
    pointsNumber: 80,
    widthFactor: 120, // Increase the width for a larger circle
    spring: 0.25,
    friction: 0.5
};

let trail = new Array(param.pointsNumber).fill().map(() => ({
    x: pointer.x,
    y: pointer.y,
    dx: 0,
    dy: 0
}));

window.addEventListener('mousemove', (e) => {
    pointer.x = e.pageX;
    pointer.y = e.pageY;
});

window.addEventListener('touchmove', (e) => {
    pointer.x = e.targetTouches[0].pageX;
    pointer.y = e.targetTouches[0].pageY;
});

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    trail.forEach((p, pIdx) => {
        let prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        p.dx += (prev.x - p.x) * param.spring;
        p.dy += (prev.y - p.y) * param.spring;
        p.dx *= param.friction;
        p.dy *= param.friction;
        p.x += p.dx;
        p.y += p.dy;
    });

    // Create a radial gradient with multiple colors
    let gradient = ctx.createRadialGradient(
        pointer.x, pointer.y, 0, 
        pointer.x, pointer.y, 300 // Adjust the size of the gradient
    );
    gradient.addColorStop(0, "skyblue");
    // gradient.addColorStop(0.5, "rgb(61, 91, 122)")
    // gradient.addColorStop(0.3, "plum");
    gradient.addColorStop(1, "skyblue")

    ctx.strokeStyle = gradient;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);

    for (let i = 0; i < trail.length - 1; i++) {
        let xc = 0.5 * (trail[i].x + trail[i + 1].x);
        let yc = 0.5 * (trail[i].y + trail[i + 1].y);
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        ctx.lineWidth = param.widthFactor * (param.pointsNumber - i) / param.pointsNumber;
        ctx.stroke();
    }

    ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
    ctx.stroke();

    window.requestAnimationFrame(update);
}

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

setupCanvas();
window.addEventListener('resize', setupCanvas);
update();
