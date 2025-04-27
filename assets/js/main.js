// Custom JS for Jaime Areheart Portfolio
// Simple PS3/PSP-inspired background
var canvas = document.getElementById('bg-canvas');
var ctx = canvas.getContext('2d');

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

var mouse = { x: undefined, y: undefined };
window.addEventListener('mousemove', function(e) {
    mouse.x = e.x;
    mouse.y = e.y;
});

var waves = [];
for (var i = 0; i < 3; i++) {
    waves.push({
        y: canvas.height - (i * 50) - 100,
        amplitude: 10 + Math.random() * 20,
        speed: 0.02 + Math.random() * 0.05,
        offset: Math.random() * 100,
        frequency: 0.005 + Math.random() * 0.005,
        mouseEffect: 0,
        colorStart: i === 0 ? 'rgba(125, 95, 255, 0.2)' : i === 1 ? 'rgba(126, 255, 245, 0.2)' : 'rgba(200, 180, 255, 0.15)',
        colorEnd: i === 0 ? 'rgba(125, 95, 255, 0)' : i === 1 ? 'rgba(126, 255, 245, 0)' : 'rgba(200, 180, 255, 0)'
    });
}

var particles = [];
var particleColors = ['#7d5fff', '#7efff5', '#ffffff'];
for (var j = 0; j < 50; j++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 1 + Math.random() * 3,
        speed: 0.5 + Math.random() * 1,
        opacity: 0.1 + Math.random() * 0.5,
        color: particleColors[Math.floor(Math.random() * particleColors.length)]
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < waves.length; i++) {
        var wave = waves[i];
        wave.offset += wave.speed;
        if (mouse.x && mouse.y) {
            wave.mouseEffect = Math.min(1, wave.mouseEffect + 0.05);
        } else {
            wave.mouseEffect = Math.max(0, wave.mouseEffect - 0.05);
        }
        ctx.beginPath();
        var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, wave.colorStart);
        gradient.addColorStop(1, wave.colorEnd);
        ctx.fillStyle = gradient;
        ctx.moveTo(0, canvas.height);
        for (var x = 0; x < canvas.width; x += 5) {
            var mouseDistance = 0;
            if (mouse.x && mouse.y) {
                var dx = x - mouse.x;
                var dy = wave.y - mouse.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                mouseDistance = Math.max(0, Math.min(40, 4000 / distance)) * wave.mouseEffect;
            }
            var y = wave.y + Math.sin(x * wave.frequency + wave.offset) * wave.amplitude + Math.sin(x * wave.frequency * 2 + wave.offset) * (wave.amplitude / 2) - mouseDistance;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
    }
    for (var j = 0; j < particles.length; j++) {
        var particle = particles[j];
        particle.y -= particle.speed;
        particle.x += Math.sin(particle.y / 50) * 0.5;
        if (mouse.x && mouse.y) {
            var pdx = mouse.x - particle.x;
            var pdy = mouse.y - particle.y;
            var pdistance = Math.sqrt(pdx * pdx + pdy * pdy);
            if (pdistance < 100) {
                particle.x += (pdx / pdistance) * 0.3;
                particle.y += (pdy / pdistance) * 0.3;
                particle.opacity = Math.min(0.8, particle.opacity + 0.01);
            }
        }
        if (particle.y < -10) {
            particle.y = canvas.height + 10;
            particle.x = Math.random() * canvas.width;
            particle.opacity = 0.1 + Math.random() * 0.5;
        }
        ctx.beginPath();
        ctx.globalAlpha = particle.opacity;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    requestAnimationFrame(animate);
}
animate();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});
