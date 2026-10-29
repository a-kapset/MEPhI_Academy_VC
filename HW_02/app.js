const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

const showProgramButton = document.querySelector('#show-program');
const program = document.querySelector('#program');
const form = document.querySelector('#service-form');
const guideCheckbox = document.querySelector('#guide');
const audioCheckbox = document.querySelector('#audio');
const catalogCheckbox = document.querySelector('#catalog');
const choiceError = document.querySelector('#choice-error');
const dataError = document.querySelector('#data-error');
const result = document.querySelector('#result');
const reportJson = document.querySelector('#report-json');

let data = null;

try {
  data = JSON.parse(sourceJson);
} catch (error) {
  data = null;
}

// Собирает отчёт по выбранным услугам, не изменяя исходный массив
function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selected = {
    guide: guideChecked,
    audio: audioChecked,
    catalog: catalogChecked,
  };

  const items = services
    .filter((service) => selected[service.id])
    .map((service) => {
      const { title, price } = service;
      return { title: title.trim(), price };
    });

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return { count: items.length, total, items };
}

function hideResult() {
  result.hidden = true;
  reportJson.hidden = true;
}

function handleShowProgram() {
  if (data === null) {
    return;
  }
  program.innerHTML = data.event.meeting;
  program.hidden = false;
}

function handleSubmit(event) {
  event.preventDefault();

  const report = buildReport(
    data.services,
    guideCheckbox.checked,
    audioCheckbox.checked,
    catalogCheckbox.checked,
  );

  if (report.count === 0) {
    hideResult();
    choiceError.textContent = 'Выберите хотя бы одну услугу.';
    choiceError.hidden = false;
    return;
  }

  const reportString = JSON.stringify(report);

  try {
    JSON.parse(reportString);
  } catch (error) {
    hideResult();
    dataError.textContent = 'Ошибка данных.';
    dataError.hidden = false;
    return;
  }

  choiceError.hidden = true;

  const titles = report.items.map((item) => item.title);
  result.innerHTML = [
    `Выбрано услуг: ${report.count}`,
    `Итого: ${report.total} руб.`,
    ...titles,
  ].join('<br>');
  result.hidden = false;

  reportJson.textContent = reportString;
  reportJson.hidden = false;
}

if (data === null) {
  dataError.textContent = 'Ошибка данных.';
  dataError.hidden = false;
} else {
  form.hidden = false;
}

showProgramButton.addEventListener('click', handleShowProgram);
form.addEventListener('submit', handleSubmit);
