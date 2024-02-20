let nav = 0;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const weekdays = ['пoнедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];

load();
initButtons();
daysOfSober(events.length);


function load() {
    const date = new Date;

    if (nav) {
        date.setMonth(new Date().getMonth() + nav);
    }

    const day = date.getDate();
    const year  = date.getFullYear();
    const month = date.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const paddingDays = getFirstWeekDay(year, month);

    document.getElementById('info').innerText = getMonthName(month) + ' ' + year;
    calendar.innerHTML = '';

    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;

            let currDate = new Date(year, month, i - paddingDays);
            let eventForDay = events.find(e => e === currDate.toDateString());

            if (i - paddingDays === day && nav === 0) {
                daySquare.id = 'currentDay';
            }        
            if (eventForDay) {
                daySquare.classList.add("selected");
            }
            if (i > day + paddingDays) {
                daySquare.classList.add('future');
            }

            if (!daySquare.classList.contains('future')) {
                daySquare.addEventListener('click', function (event) {
                    const elementClicked = event.target;
                    eventHandler(elementClicked, currDate, events);
                });
            }
        } else {
            daySquare.classList.add('padding');
        }
        calendar.appendChild(daySquare);
    }
}

function eventHandler(elementClicked, currDate, events) {
    elementClicked.classList.toggle("selected");
                    
    if (elementClicked.classList.contains('selected')) {
        events.push(currDate.toDateString());  
    }
    
    eventForDay = events.find(e => e === currDate.toDateString());
    if (!elementClicked.classList.contains('selected') && eventForDay) {
        let ind = events.indexOf(currDate.toDateString());
        events.splice(ind, 1);
    }
    
    sortDates(events);
    localStorage.setItem('events', JSON.stringify(events));
    daysOfSober(events.length);
}

function initButtons() {
    let next = document.getElementById('next');
    next.addEventListener('click', () => {
        nav++;
        load();
    });
    
    let prev = document.getElementById('prev');
    prev.addEventListener('click', () => {
        nav--;
        load();
    });
}

function getFirstWeekDay(year, month) {
    let date = new Date(year, month, 1);
    let num  = date.getDay();
            
    if (num == 0) {
        return 6;
    } else {
        return num - 1;
    }
}

function getMonthName(num) {
    var monthes = [
        'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
        'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
    ];
                
    return monthes[num];
}

function sortDates(events) {
    events.sort(function (a, b) {
        a = new Date(a);
        b = new Date(b);
        return a - b;
    });
}

function daysOfSober(num) {
    let show = document.getElementById('quantity');
    show.innerText = '';

    
    let today = new Date;
    let lastDayWithAlco = new Date (events[events.length - 1]);
    let timeDiff = Math.abs(today.getTime() - lastDayWithAlco.getTime());
    let result = Math.ceil(timeDiff / (1000 * 3600 * 24)) - 1;

    if (num > 0) {
        show.innerText = result;
    }
    affirmations(result, lastDayWithAlco, today);
}

function affirmations(result, lastDayWithAlco, today) {
    let showCheers = document.getElementById('cheer');
    showCheers.innerText = '';

    let day1 = today.getDate();
    let month1 = today.getMonth();
    let year1 = today.getFullYear();

    let day2 = lastDayWithAlco.getDate();
    let month2 = lastDayWithAlco.getMonth();
    let year2 = lastDayWithAlco.getFullYear();
    
    if (result == 1) {
        showCheers.innerText = 'Первый день без алкоголя! Начало положено!';
    } else if (result == 7) {
        showCheers.innerText = 'Твоя первая неделя без алкоголя! Так держать!';
    } else if (month1 != month2 && day1 == day2) {
        if (year2 == year1) {
            result = month1 - month2;
        } else {
            result = 12 - (month2 - month1);
        }
        if (result == 1) {
            showCheers.innerText = 'Первый месяц трезвости. Не сбавляй темп!';
        } else if (result == 2 || result == 3 || result == 4) {
            showCheers.innerText = result + ' ' + 'месяца без алкоголя! Ты молодей!';
        } else {
            showCheers.innerText = result + ' ' + 'месяцев без алкоголя! Ты все сможешь!';
        }
    } else if (year2 != year1 && month1 == month2 && day2 == day1) {
        result = year1 - year2;

        if (result == 1) {
            showCheers.innerText = 'Ты продержался целый год! Дальше больше, не сдавайся!';
        } else if (result == 2 || result == 3 || result == 4) {
            showCheers.innerText = result + ' ' + 'года без алкоголя! Невероятный результат!';
        } else {
            showCheers.innerText = result + ' ' + 'лет без алкоголя! Тебе есть чем гордиться!';
        }
    } else {
        showCheers.innerText = '';
    }
}