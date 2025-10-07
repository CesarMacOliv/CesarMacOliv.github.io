// Função para gerar sextas alternadas
function gerarSextasAlternadas(inicio, fim, primeiraUCB = true) {
    const datas = [];
    let data = new Date(inicio);
    let ucb = primeiraUCB;

    while (data <= new Date(fim)) {
        if (data.getDay() === 5) { // sexta = 5
            const yyyy = data.getFullYear();
            const mm = String(data.getMonth() + 1).padStart(2, '0');
            const dd = String(data.getDate()).padStart(2, '0');

            datas.push({
                title: ucb ? 'UCB' : 'LIPP',
                start: `${yyyy}-${mm}-${dd}`,
                allDay: true,
                backgroundColor: ucb ? '#1E90FF' : '#32CD32',
                borderColor: ucb ? '#1E90FF' : '#32CD32'
            });

            ucb = !ucb; // alterna
        }
        data.setDate(data.getDate() + 1);
    }
    return datas;
}

const sextas = gerarSextasAlternadas('2025-10-10', '2065-12-31');

document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');

    // ----------------------
    // Criar modal (sem cor fixa)
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
    modal.style.zIndex = '99999'; // garante que fique acima do calendário

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
            <h2 id="modalTitle" style="
                font-size: 1.2rem;
                margin: 0 0 6px 0;
            "></h2>
            <p id="modalDate" style="
                font-size: 0.95rem;
                margin: 0 0 10px 0;
                opacity: 0.95;
            "></p>
            <p id="modalDescription" style="
                font-size: 1rem;
                line-height: 1.4;
                white-space: pre-line;
                margin: 0;
            "></p>
        </div>
    `;
    document.body.appendChild(modal);

    // referências
    const modalContent = document.getElementById('modalContent');
    const closeBtn = document.getElementById('closeModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalDescription = document.getElementById('modalDescription');

    // animação de abrir/fechar
    function openModal() {
        modal.style.display = 'flex';
        // força frame para a transição funcionar
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
    // Helpers de cor/contraste
    // ----------------------
    function parseColorToRgba(color, alphaOverride = 0.9) {
        if (!color) return `rgba(255,0,183,${alphaOverride})`; // fallback

        color = color.trim();

        // rgb(...) or rgba(...)
        if (color.startsWith('rgb')) {
            const nums = color.match(/rgba?\(([^)]+)\)/);
            if (nums) {
                const parts = nums[1].split(',').map(p => parseFloat(p.trim()));
                const r = parts[0], g = parts[1], b = parts[2];
                return `rgba(${r}, ${g}, ${b}, ${alphaOverride})`;
            }
        }

        // hex forms: #rgb, #rgba, #rrggbb, #rrggbbaa
        if (color.startsWith('#')) {
            let hex = color.slice(1);
            if (hex.length === 3) {
                hex = hex.split('').map(c => c + c).join('');
            }
            if (hex.length === 4) { // rgba short
                const r = parseInt(hex[0] + hex[0], 16);
                const g = parseInt(hex[1] + hex[1], 16);
                const b = parseInt(hex[2] + hex[2], 16);
                const a = parseInt(hex[3] + hex[3], 16) / 255;
                return `rgba(${r}, ${g}, ${b}, ${alphaOverride * a})`;
            }
            if (hex.length === 6) {
                const r = parseInt(hex.slice(0, 2), 16);
                const g = parseInt(hex.slice(2, 4), 16);
                const b = parseInt(hex.slice(4, 6), 16);
                return `rgba(${r}, ${g}, ${b}, ${alphaOverride})`;
            }
            if (hex.length === 8) {
                const r = parseInt(hex.slice(0, 2), 16);
                const g = parseInt(hex.slice(2, 4), 16);
                const b = parseInt(hex.slice(4, 6), 16);
                const a = parseInt(hex.slice(6, 8), 16) / 255;
                return `rgba(${r}, ${g}, ${b}, ${alphaOverride * a})`;
            }
        }

        // fallback: let browser parse named colors
        const temp = document.createElement('div');
        temp.style.color = color;
        document.body.appendChild(temp);
        const cs = getComputedStyle(temp).color;
        document.body.removeChild(temp);
        if (cs && cs.startsWith('rgb')) {
            const parts = cs.match(/rgba?\(([^)]+)\)/)[1].split(',').map(p => parseFloat(p));
            return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alphaOverride})`;
        }

        return `rgba(255,0,183,${alphaOverride})`;
    }

    function getContrastFromRgba(rgbaStr) {
        const m = rgbaStr.match(/rgba?\(([^)]+)\)/);
        if (!m) return 'black';
        const parts = m[1].split(',').map(p => parseFloat(p));
        const r = parts[0], g = parts[1], b = parts[2];
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 150 ? 'black' : 'white';
    }

    // ----------------------
    // FullCalendar init
    // ----------------------
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        height: 'auto',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        buttonText: {
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
            list: 'Lista'
        },
        googleCalendarApiKey: 'AIzaSyC1lY4vSzRAZxX_rA9MumBR2XvBYMQJWnk',
        events: [
            {
                title: 'UCB',
                daysOfWeek: [1, 3],
                allDay: true,
                startRecur: '2025-10-06',
                endRecur: '2025-12-31',
                backgroundColor: '#1E90FF',
                borderColor: '#1E90FF'
            },
            {
                title: 'LIPP',
                daysOfWeek: [2, 4],
                allDay: true,
                startRecur: '2025-10-07',
                endRecur: '2025-12-31',
                backgroundColor: '#32CD32',
                borderColor: '#32CD32'
            },
            ...sextas
        ],
        eventSources: [
            {
                googleCalendarId: 'c_e0e83e91a25f037c6008b4fb7c81c3eb6e3fb1586704c37cc7cbeb90859e3353@group.calendar.google.com',
                color: '#ac0dfcff'
            },
            {
                googleCalendarId: 'c_0717255d9662397d4eb92b5189bbfd8405ec8df8ad7edaa31b62c98ae1c7375b@group.calendar.google.com',
                color: '#FFA500'
            },
            {
                googleCalendarId: 'c_b0ade61e1b07fb52e8a6c04d0f1297de4faa16794796e381739e169f92e383e9@group.calendar.google.com',
                color: '#ff0000ff'
            }
        ],

        eventClick: function (info) {
            // impede redirecionamento para o Google Calendar
            info.jsEvent.preventDefault();

            const event = info.event;
            const start = event.start;
            const end = event.end || null;
            const isAllDay = event.allDay;

            // formatos de data
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

            // Detecta a cor do evento de forma robusta:
            // tenta propriedades do evento, depois o estilo do elemento, depois computedStyle, senão fallback
            let rawColor = event.backgroundColor || event.borderColor || '';
            if (!rawColor && info.el) {
                rawColor = info.el.style.backgroundColor || window.getComputedStyle(info.el).backgroundColor || '';
            }
            if (!rawColor) rawColor = '#e0e0e0ff'; // fallback

            // transforma para rgba com alpha menor (menos saturado/mais translúcido)
            const bgRgba = parseColorToRgba(rawColor, 0.96);
            const textColor = getContrastFromRgba(bgRgba);

            // aplica cor e texto no modal
            modalContent.style.background = bgRgba;
            modalContent.style.color = textColor;
            closeBtn.style.color = textColor;

            modalTitle.textContent = event.title || 'Evento';
            modalDate.textContent = dateText;
            modalDescription.textContent = event.extendedProps && event.extendedProps.description ? event.extendedProps.description : 'Sem descrição disponível.';

            // ajusta cores específicas dos elementos (se quiser separar)
            modalTitle.style.color = textColor;
            modalDate.style.color = textColor;
            modalDescription.style.color = textColor;

            openModal();
        }
    });

    calendar.render();
});
