# tracker-alcohol

Проект представляет собой трекер алкоголя. Календарь для отметки дней, в которые было употреблено спиртное. Сайт хвалит пользователя за достижения каждого круглого числа непрерывной работы: за день, за неделю, за месяц, за два месяца и так далее.

## script.js
### функции
**load**               - загружат календарь на выбранный месяц. по умолчанию текущий.  
**eventHandler**       - обработчик клика на выбранную дату.  
**initButtons**        - инициализация кнопок вперед/назад для переключения месяцев.  
**getFirstWeekDay**    - определяет день недели первого дня месяца.  
**getMonthName**       - возвращает название месяца.  
**sortDates**          - сортировка дат по возрастанию.  
**daysOfSober**        - определяет и выводит количество дней без алкоголя.  
**affirmations**       - выводит похвалу за достижение "круглых" дат трезвости.

### load
Определяю текущие данные о дате.
```javascript
const date = new Date;

if (nav) {
  date.setMonth(new Date().getMonth() + nav);
}

const day = date.getDate();
const year  = date.getFullYear();
const month = date.getMonth();
```
Определяю количество дней в месяце, а также номер первого дня недели месяца, он же и количество "пустых" клеток календаря перед первым днем. Вывожу информацию о месяце и годе. Очищаю поле, чтобы календари за определенный месяц выводились отдельно.
```javascript
const daysInMonth = new Date(year, month + 1, 0).getDate();
const paddingDays = getFirstWeekDay(year, month);

document.getElementById('info').innerText = getMonthName(month) + ' ' + year;
calendar.innerHTML = '';
```
Для всех ячеек календаря определяю, какие они должны быть. **currDate** - i-ый день. **eventForDay** - ищет в масссиве **events** текущий день. **currentDay** - обозначение текущего дня, он выделяется цветом. Класс **selected** добавляется всем дням, которые пользователь выбрал как дни, в которые принял алкоголь. Класс **'future'** нужен, чтобы пользователь не мог отмечать дни, которые еще не настали.
```javascript
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
```

### eventHandler
Если элемент имеет класс **selected**, то добавляем его в массив **events**. Если элемент не имеет класса  **selected**, то проверяю, есть ли он в массиве, и если есть, то удаляю. Сортирую даты, кладу их в localStorage и вывожу количество трезвых дней.
```javascript
elementClicked.classList.toggle("selected");
                    
if (elementClicked.classList.contains('selected')) {
  events.push(currDate.toDateString());  
}
    
eventForDay = events.find(e => e === currDate.toDateString());
if (!elementClicked.classList.contains('selected') && eventForDay) {
  let ind = events.indexOf(currDate.toDateString());
  events.splice(ind, 1);
}
    
sortDates(events)
localStorage.setItem('events', JSON.stringify(events));
daysOfSober(events.length);
```

### daysOfSober
Определяю разницу (**result**) в днях между сегодня и последней датой, которая имееет класс **selected**. Вывожу информацию о днях и с помощью функции **affirmations** проверяю, не является ли дата круглой.
```javascript
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
```
