// ----------------------
// Tema claro/escuro
// ----------------------
const toggleBtn = document.getElementById("themeToggle");
const body = document.body;

// Verifica preferência salva
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    body.classList.add("manual-dark");
    toggleBtn.textContent = "☀️ Alternar Tema";
} else if (savedTheme === "light") {
    body.classList.add("manual-light");
    toggleBtn.textContent = "🌙 Alternar Tema";
}

toggleBtn.addEventListener("click", () => {
    if (body.classList.contains("manual-dark")) {
        body.classList.remove("manual-dark");
        body.classList.add("manual-light");
        localStorage.setItem("theme", "light");
        toggleBtn.textContent = "🌙 Alternar Tema";
    } else if (body.classList.contains("manual-light")) {
        body.classList.remove("manual-light");
        body.classList.add("manual-dark");
        localStorage.setItem("theme", "dark");
        toggleBtn.textContent = "☀️ Alternar Tema";
    } else {
        body.classList.add("manual-dark");
        localStorage.setItem("theme", "dark");
        toggleBtn.textContent = "☀️ Alternar Tema";
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');

    // ----------------------
    // Modal
    // ----------------------
    const modal = document.createElement('div');
    modal.id = 'eventModal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.38)';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '99999';

    modal.innerHTML = `
        <div id="modalContent" style="
            background: #ffffff;
            border-radius: 16px;
            padding: 20px;
            max-width: 420px;
            width: 90%;
            text-align: center;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            position: relative;
            font-family: 'Segoe UI', system-ui, sans-serif;
            transform: translateY(-8px);
            opacity: 0;
            transition: transform 0.18s ease, opacity 0.18s ease;
        ">
            <button id="closeModal" style="
                position: absolute;
                top: 8px;
                right: 12px;
                border: none;
                background: transparent;
                font-size: 20px;
                cursor: pointer;
                color: #555;
            ">✖</button>
            <h2 id="modalTitle" style="font-size: 1.2rem; margin: 0 0 6px 0;"></h2>
            <p id="modalDate" style="font-size: 0.95rem; margin: 0 0 10px 0; opacity: 0.95;"></p>
            <p id="modalDescription" style="font-size: 1rem; line-height: 1.4; white-space: pre-line; margin: 0;"></p>
        </div>
    `;
    document.body.appendChild(modal);

    const modalContent = document.getElementById('modalContent');
    const closeBtn = document.getElementById('closeModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalDescription = document.getElementById('modalDescription');

    function openModal() {
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modalContent.style.transform = 'translateY(0)';
            modalContent.style.opacity = '1';
        });
    }
    function closeModal() {
        modalContent.style.transform = 'translateY(-8px)';
        modalContent.style.opacity = '0';
        setTimeout(() => { modal.style.display = 'none'; }, 180);
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // ----------------------
    // Helpers para cor/contraste
    // ----------------------
    function parseColorToRgba(color, alphaOverride = 0.96) {
        if (!color) return `rgba(255,0,183,${alphaOverride})`;

        color = color.trim();

        if (color.startsWith('rgb')) {
            const nums = color.match(/rgba?\(([^)]+)\)/);
            if (nums) {
                const parts = nums[1].split(',').map(p => parseFloat(p.trim()));
                return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alphaOverride})`;
            }
        }

        if (color.startsWith('#')) {
            let hex = color.slice(1);
            if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
            if (hex.length === 6) {
                const r = parseInt(hex.slice(0, 2), 16);
                const g = parseInt(hex.slice(2, 4), 16);
                const b = parseInt(hex.slice(4, 6), 16);
                return `rgba(${r}, ${g}, ${b}, ${alphaOverride})`;
            }
        }
        return `rgba(255,0,183,${alphaOverride})`;
    }

    function getContrastFromRgba(rgbaStr) {
        const m = rgbaStr.match(/rgba?\(([^)]+)\)/);
        if (!m) return 'black';
        const parts = m[1].split(',').map(p => parseFloat(p));
        const brightness = (parts[0] * 299 + parts[1] * 587 + parts[2] * 114) / 1000;
        return brightness > 150 ? 'black' : 'white';
    }

    // ----------------------
    // FullCalendar
    // ----------------------
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        height: 'auto',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'none'
        },
        buttonText: { today: 'Hoje' },

        googleCalendarApiKey: 'AIzaSyC1lY4vSzRAZxX_rA9MumBR2XvBYMQJWnk',

        // 🔥 APENAS EVENTOS REAIS
        eventSources: [
            {
                googleCalendarId: 'c_e0e83e91a25f037c6008b4fb7c81c3eb6e3fb1586704c37cc7cbeb90859e3353@group.calendar.google.com',
                color: '#ac0dfc'
            },
            {
                googleCalendarId: 'c_0717255d9662397d4eb92b5189bbfd8405ec8df8ad7edaa31b62c98ae1c7375b@group.calendar.google.com',
                color: '#FFA500'
            },
            {
                googleCalendarId: 'c_b0ade61e1b07fb52e8a6c04d0f1297de4faa16794796e381739e169f92e383e9@group.calendar.google.com',
                color: '#ff0000'
            }
        ],

        eventClick: function (info) {
            info.jsEvent.preventDefault();

            const event = info.event;
            const start = event.start;
            const end = event.end || null;
            const isAllDay = event.allDay;

            const dateOptionsDateOnly = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const dateOptionsDateTime = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };

            let dateText = '';
            if (isAllDay) {
                dateText = start.toLocaleDateString('pt-BR', dateOptionsDateOnly) +
                    (end ? ` até ${end.toLocaleDateString('pt-BR', dateOptionsDateOnly)}` : '');
            } else {
                dateText = start.toLocaleDateString('pt-BR', dateOptionsDateTime) +
                    (end ? ` até ${end.toLocaleDateString('pt-BR', dateOptionsDateTime)}` : '');
            }

            let rawColor = event.backgroundColor || event.borderColor || '';
            if (!rawColor && info.el) {
                rawColor = info.el.style.backgroundColor || window.getComputedStyle(info.el).backgroundColor || '';
            }
            if (!rawColor) rawColor = '#e0e0e0';

            const bgRgba = parseColorToRgba(rawColor, 0.96);
            const textColor = getContrastFromRgba(bgRgba);

            modalContent.style.background = bgRgba;
            modalContent.style.color = textColor;
            closeBtn.style.color = textColor;

            modalTitle.textContent = event.title || 'Evento';
            modalDate.textContent = dateText;
            modalDescription.textContent = event.extendedProps?.description || 'Sem descrição disponível.';

            modalTitle.style.color = textColor;
            modalDate.style.color = textColor;
            modalDescription.style.color = textColor;

            openModal();
        },

        // ----------------------
        // Legenda real
        // ----------------------
        datesSet: function () {
            const toolbar = calendarEl.querySelector('.fc-toolbar');
            if (toolbar && !toolbar.querySelector('.calendar-legend')) {
                const legend = document.createElement('div');
                legend.className = 'calendar-legend';
                legend.innerHTML = `
                    <div class="legend-item"><span style="background-color:#ac0dfc"></span>Servidor</div>
                    <div class="legend-item"><span style="background-color:#FFA500"></span>Requisições</div>
                    <div class="legend-item"><span style="background-color:#ff0000"></span>Doutorado</div>
                `;
                const centerSection = toolbar.querySelector('.fc-toolbar-chunk:nth-child(2)');
                if (centerSection) centerSection.appendChild(legend);
            }
        }
    });

    calendar.render();
});
