// Função para gerar sextas alternadas
function gerarSextasAlternadas(inicio, fim, primeiraUCB = true) {
    const datas = [];
    let data = new Date(inicio);
    let ucb = primeiraUCB;

    while (data <= new Date(fim)) {
        if (data.getDay() === 5) { // sexta = 5
            // Criar string YYYY-MM-DD sem timezone
            const yyyy = data.getFullYear();
            const mm = String(data.getMonth() + 1).padStart(2, '0');
            const dd = String(data.getDate()).padStart(2, '0');

            datas.push({
                title: ucb ? 'UCB' : 'LIPP',
                start: `${yyyy}-${mm}-${dd}`,
                allDay: true,
                backgroundColor: ucb ? '#1E90FF' : '#32CD32', // azul para UCB, verde para LIPP
                borderColor: ucb ? '#1E90FF' : '#32CD32'
            });

            ucb = !ucb; // alterna
        }
        data.setDate(data.getDate() + 1);
    }
    return datas;
}

const sextas = gerarSextasAlternadas('2025-10-10', '2065-12-31'); // ajustar datas

document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
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
            list: 'Lista',
            this: 'Este'
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
            // Sextas alternadas com cores corretas
            ...sextas
        ],
        eventSources: [
            {
                googleCalendarId: 'c_e0e83e91a25f037c6008b4fb7c81c3eb6e3fb1586704c37cc7cbeb90859e3353@group.calendar.google.com',
                color: '#FF1493'
            }
        ]
    });

    calendar.render();
});