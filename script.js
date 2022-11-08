(() => {
    const canvas = document.querySelector('canvas');
    const config = {
        particleSize: 10,
        width: 800,
        height: 600,
        delay: 50,
    };
    canvas.width = config.width;
    canvas.height = config.height; 
    const c = canvas.getContext('2d');
    c.strokeStyle = 'grey'
    let interval = 0;
    let interationCounter = 0;
    const stepBtn = document.querySelector('#step');
    const startBtn = document.querySelector('#start');
    const stopBtn = document.querySelector('#stop');
    const output = document.querySelector('#output');
    const delayInput = document.querySelector('#delay');
    const delayOutput = document.querySelector('#delayOutput');
    delayInput.value = config.delay
    delayOutput.innerHTML = config.delay


    particles = init();
    neighbours = JSON.parse(JSON.stringify(particles));
    let isMousePressed = false;

    draw();


    stepBtn.onclick = () => {
        step()
    }

    startBtn.onclick = () => {
        loop()
    }

    stopBtn.onclick = () => {
        stop()
    }

    canvas.onclick = (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const i = Math.floor(x / config.particleSize);
        const j = Math.floor(y / config.particleSize);
        particles[i][j] = particles[i][j] ? 0 : 1;
        draw();
    }

    canvas.onmousedown = () => {
        isMousePressed = true;
    }

    canvas.onmouseup = () => {
        isMousePressed = false;
    }

    canvas.onmouseout = () => {
        isMousePressed && (isMousePressed = false);
    }
    
    canvas.onmousemove = (e) => {
        if (isMousePressed) {
            const x = e.clientX;
            const y = e.clientY;
            const i = Math.floor(x / config.particleSize);
            const j = Math.floor(y / config.particleSize);
            particles[i][j] = 1;
            draw();
        }
    }

    delayInput.addEventListener('input', (e) => {
        delayOutput.innerHTML = e.target.value;
    })

    delayInput.addEventListener('change', (e) => {
        config.delay = e.target.value;
        if (interval) {
            clearInterval(interval);
            loop();
        }
    })

    function init() {
        const particlesW = config.width / config.particleSize;
        const particlesH = config.height / config.particleSize;
        const particles = [];
        for(let i = 0; i < particlesW; i++) {
            for (let j = 0; j < particlesH; j++) {
                if (!particles[i]) {
                    particles[i] = [];
                }
                
                particles[i][j] = Math.round(Math.random() * 5 / 9); 
            }
        }

        output.innerHTML = interationCounter;
    
        return particles;
    }
    
    function draw() {
        c.clearRect(0, 0, config.width, config.height)
        for(let i = 0; i < particles.length; i++) {
            for (let j = 0; j < particles[i].length; j++) {
                if (particles[i][j]) {
                    c.fillRect(i * config.particleSize, j * config.particleSize, config.particleSize, config.particleSize);
                } else {
                    c.strokeRect(i * config.particleSize, j * config.particleSize, config.particleSize, config.particleSize);
                }
            }
        }
    }

    function checkNeighbour(i, j) {
        if (i < 0 || i >= particles.length || j < 0 || j >= particles[i].length) {
            return false;
        }

        return !!particles[i][j];
    }
    
    function countNeighbours(i, j) {
        let counter = 0;

        for (let _i = i-1; _i <= i+1; _i++) {
            for (let _j = j - 1; _j <= j+1; _j++) {
                if (i === _i && j === _j) {
                    continue;
                }

                if (checkNeighbour(_i, _j)) {
                    counter++;
                }
            }
        }
    
        return counter;
    }
    
    function step() {
        for(let i = 0; i < particles.length; i++) {
            for (let j = 0; j < particles[i].length; j++) {
                const count = countNeighbours(i, j);
                neighbours[i][j] = count;
            }
        }

        for(let i = 0; i < particles.length; i++) {
            for (let j = 0; j < particles[i].length; j++) {
                const currentParticle = particles[i][j];
                const currentNeighbour = neighbours[i][j];
                if (currentParticle) {
                    if (currentNeighbour < 2 || currentNeighbour > 3) {
                        particles[i][j] = 0;
                    }
                } else if (currentNeighbour === 3){
                    particles[i][j] = 1;
                }
            }
        }

        draw();
        output.innerHTML = interationCounter++;
    }

    function loop() {
        startBtn.disabled = true;
        stepBtn.disabled = true;
        stopBtn.disabled = false;
        step();
        interval = setInterval(() => {
            step();
        }, config.delay);
    }

    function stop() {
        if (interval) {
            clearInterval(interval);
            interval = 0;
            startBtn.disabled = false;
            stepBtn.disabled = false;
            stopBtn.disabled = true;
            output.innerHTML = interationCounter = 0;
        }
    }
})();