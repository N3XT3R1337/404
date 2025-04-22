document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    const progressBar = document.getElementById('progress-bar');
    const loadingPercentage = document.getElementById('loading-percentage');
    const loadStatus = document.getElementById('load-status');
    const statusContainer = document.getElementById('load-status');
    const logEntries = document.querySelectorAll('.system-log .log-entry');
    const warningLine = document.getElementById('warning-line');
    const glitchTextElement = document.querySelector('.glitch-text.static-glitch');
    const mainTitle = document.querySelector('.main-title');
    const titleSpans = mainTitle.querySelectorAll('span');
    const matrixCanvas = document.getElementById('matrix-canvas');
    const ctx = matrixCanvas.getContext('2d');
    const footerSystemStatus = document.getElementById('system-status');
    const footerSessionStatus = document.getElementById('session-status');
    const digitalClockElement = document.getElementById('digital-clock');
    const mouseGlow = document.getElementById('mouse-glow');

    const glitchChars = '▓▒░><!/\\*$#@%^&?;:_=+-[]{}()サイバパンクCyberPunk';

    const statuses = [
        "CHECKING NEURAL INTERFACE...",
        "CALIBRATING OPTICS...",
        "SYNCING CHROME...",
        "CONNECTING TO THE NET...",
        "DECRYPTING DATA SHARDS...",
        "COMPILING UI KERNEL...",
        "OPTIMIZING CORE ROUTINES...",
        "SYSTEM READY"
    ];

    let currentProgress = 0;
    let statusIndex = 0;
    let logIndex = 0;
    let loaderInterval;
    let clockInterval;
    let footerUpdateInterval;
    let matrixIntervalId;

    function showNextLogEntry() {
        if (logIndex < logEntries.length) {
            if (logEntries[logIndex] !== warningLine) {
                logEntries[logIndex].style.opacity = '1';
                logEntries[logIndex].style.transform = 'translateY(0)';
            }
            logIndex++;
        }
    }
    logEntries.forEach((entry, index) => {
        if (entry !== warningLine) {
           entry.style.transitionDelay = `${index * 0.15}s`;
        }
    });

    function randomChar() {
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
    }

    function statusGlitchEffect(element, baseText) {
        let progress = 0;
        const intervalId = setInterval(() => {
            element.textContent = baseText
                .split('')
                .map((char, index) => {
                     if(index < progress || char === ' ') {
                         return char;
                     }
                     return randomChar();
                })
                .join('');
            progress += 0.5;
            if (progress >= baseText.length) {
                 element.textContent = baseText;
                clearInterval(intervalId);
            }
        }, 30);
    }

     function updateLoader() {
        let progressIncrement = Math.random() * 2.5 + 0.5;
        currentProgress += progressIncrement;
        currentProgress = Math.min(currentProgress, 100);

        progressBar.style.width = currentProgress + '%';
        loadingPercentage.textContent = Math.floor(currentProgress) + '%';

        if (currentProgress > (logIndex * (100 / logEntries.length)) * 0.8) {
            showNextLogEntry();
        }

        const statusThreshold = (statusIndex + 1) * (100 / statuses.length);
        if (currentProgress >= statusThreshold && statusIndex < statuses.length - 1) {
            statusIndex++;
            const nextStatus = statuses[statusIndex];
            statusGlitchEffect(statusContainer, nextStatus);
        }

        if (currentProgress > 30 && currentProgress < 80 && Math.random() < 0.01 && warningLine.style.display === 'none') {
             warningLine.style.opacity = '0';
             warningLine.style.transform = 'translateY(10px)';
             warningLine.style.display = 'block';
             setTimeout(() => {
                 warningLine.style.opacity = '1';
                 warningLine.style.transform = 'translateY(0)';
             }, 50);
             setTimeout(() => {
                warningLine.style.opacity = '0';
                warningLine.style.transform = 'translateY(10px)';
                 setTimeout(() => warningLine.style.display = 'none', 500);
            }, 2000 + Math.random() * 3000);
        }

        if (glitchTextElement && Math.random() > 0.8) {
            const baseText = glitchTextElement.getAttribute('data-text');
            glitchTextElement.textContent = Array.from(baseText).map(char => Math.random() > 0.7 ? randomChar() : char).join('');
            setTimeout(() => {
                 if(glitchTextElement) glitchTextElement.textContent = baseText;
            }, 70);
        }

        if (currentProgress >= 100) {
            clearInterval(loaderInterval);
            statusContainer.textContent = statuses[statuses.length - 1];
            loadingPercentage.textContent = '100%';
             if(glitchTextElement) {
                glitchTextElement.textContent = "INTERFACE ONLINE";
                glitchTextElement.setAttribute('data-text', "INTERFACE ONLINE");
                setTimeout(() => {
                   glitchTextElement.classList.remove('static-glitch');
                   glitchTextElement.textContent = "";
                }, 500);
            }
             loader.classList.add('hidden');

            setTimeout(() => {
                loader.style.display = 'none';
                mainContent.classList.add('visible');
                startMatrix();
                startTitleAnimation();
                startClock();
                startFooterUpdates();
                 if(matrixCanvas) matrixCanvas.style.opacity = '0.15';
                 document.querySelectorAll('.corner-element').forEach(el => el.style.opacity = '1');
                 document.querySelector('.grid-overlay').style.opacity = '0.3';
            }, 1700);
        }
    }

    function startTitleAnimation() {
        titleSpans.forEach((span, index) => {
            span.style.animationDelay = `${0.1 + index * 0.05}s`;
        });
        const totalTitleAnimTime = 0.1 + titleSpans.length * 0.05 + 0.5;
        setTimeout(() => {
             mainTitle.classList.add('active-glitch');
        }, totalTitleAnimTime * 1000);
    }


    let columns;
    let drops;
    let fontSize = 16;
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍサイバーパンク01:?=/+*%^$#@!<>';

    function setupMatrix() {
        if (!matrixCanvas) return;
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;

        fontSize = matrixCanvas.width < 600 ? 10 : (matrixCanvas.width < 1200 ? 14 : 16);
        columns = Math.floor(matrixCanvas.width / fontSize);
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * matrixCanvas.height / fontSize;
        }
    }

    function drawMatrix() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(3, 5, 8, 0.07)`;
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        ctx.font = fontSize + 'px "Share Tech Mono", monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = characters[Math.floor(Math.random() * characters.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

             if(Math.random() > 0.985) {
                 ctx.fillStyle = `#fff`;
                 ctx.shadowColor = `rgba(255, 255, 255, 0.8)`;
                 ctx.shadowBlur = 10;
             } else {
                 ctx.fillStyle = `rgba(0, 240, 255, ${0.3 + Math.random() * 0.5})`;
                 ctx.shadowColor = `rgba(0, 240, 255, 0.5)`;
                 ctx.shadowBlur = 5;
             }

            ctx.fillText(text, x, y);
            ctx.shadowBlur = 0;

            if (y > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

     function startMatrix() {
        if (!matrixCanvas) return;
        setupMatrix();
        clearInterval(matrixIntervalId);
        matrixIntervalId = setInterval(drawMatrix, 60);

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(setupMatrix, 250);
        });
    }

     const systemMessages = [
         "online // interface_ver: CP-UI_v8.1",
         "monitoring // network traffic nominal",
         "idle // awaiting input...",
         "processing background tasks...",
         "security protocols active",
         "heat levels optimal",
         "firewall status: ACTIVE",
         "bandwidth usage: low"
     ];
     const sessionMessages = [
         "NEURAL LINK STABLE",
         "CONNECTION SECURE",
         "ICE BREAKER ACTIVE",
         "SYNC: 99.8%",
         "SYSTEM STATUS: GREEN",
         "LATENCY: <10ms",
         "DATA STREAM: ENCRYPTED"
     ];

     function updateFooterText() {
         if (footerSystemStatus && Math.random() < 0.1) {
             let newStatus = systemMessages[Math.floor(Math.random() * systemMessages.length)];
             footerSystemStatus.textContent = `<system_status: ${newStatus}>`;
         }

         if (footerSessionStatus && Math.random() < 0.05) {
              let newSession = sessionMessages[Math.floor(Math.random() * sessionMessages.length)];
              footerSessionStatus.textContent = `SESSION ACTIVE :: ${newSession}`;
              if (newSession.includes("UNSTABLE") || Math.random() < 0.02) {
                  footerSessionStatus.classList.add("unstable");
                  setTimeout(() => footerSessionStatus.classList.remove("unstable"), 3000);
              } else {
                  footerSessionStatus.classList.remove("unstable");
              }
         }
     }
    function startFooterUpdates(){
        clearInterval(footerUpdateInterval);
        footerUpdateInterval = setInterval(updateFooterText, 4500);
    }

    function updateClock() {
        if (!digitalClockElement) return;
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        digitalClockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
    function startClock(){
         clearInterval(clockInterval);
         updateClock();
         clockInterval = setInterval(updateClock, 1000);
    }

    if (mouseGlow && window.matchMedia('(pointer: fine)').matches) {
         window.addEventListener('mousemove', (e) => {
             mouseGlow.style.left = `${e.clientX}px`;
             mouseGlow.style.top = `${e.clientY}px`;
         });
         document.body.style.cursor = 'none';
    } else {
         if (mouseGlow) mouseGlow.style.display = 'none';
         document.body.style.cursor = 'auto';
    }

    logEntries[0].style.opacity = '1';
    logEntries[0].style.transform = 'translateY(0)';
    logIndex = 1;
    loaderInterval = setInterval(updateLoader, 70);

});