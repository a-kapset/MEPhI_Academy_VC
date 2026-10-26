const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const lines = rl[Symbol.asyncIterator]();

async function ask(question) {
  process.stdout.write(question);
  const { value, done } = await lines.next();
  return done ? '' : value;
}

// Возвращает неотрицательное число или null, если ввод пустой, не число или меньше нуля
async function askNumber(question) {
  const text = (await ask(question)).trim();
  const number = Number(text);
  if (text === '' || Number.isNaN(number) || number < 0) {
    return null;
  }
  return number;
}

// 1. Билетная касса

function ticketPrice(category) {
  switch (category) {
    case 1:
      return 300;
    case 2:
      return 500;
    case 3:
      return 900;
    default:
      return 0;
  }
}

function maxTickets(budget, price) {
  let count = 0;
  let rest = budget;
  while (rest >= price) {
    rest -= price;
    count++;
  }
  return count;
}

function printTicketResult(category, budget) {
  const price = ticketPrice(category);
  if (price === 0) {
    console.log('неизвестная категория');
    return;
  }
  const count = maxTickets(budget, price);
  console.log(`Категория ${category}, билет ${price} руб., бюджет ${budget} руб.: можно купить ${count} шт.`);
}

// 2. Доставка заказа

function deliveryPrice(distance, total) {
  if (total >= 3000) {
    return 0;
  }
  if (distance <= 3) {
    return 0;
  }
  if (distance <= 10) {
    return 200;
  }
  return 200 + (distance - 10) * 25;
}

function printDelivery(distance, total) {
  const price = deliveryPrice(distance, total);
  console.log(`Расстояние ${distance} км, заказ ${total} руб.: доставка ${price} руб.`);
}

// 3. Лестница

function printSteps(height) {
  let built = 0;
  for (let step = 1; step <= height; step++) {
    if (step === 4) {
      continue;
    }
    if (step > 10) {
      console.log('Дальше лестница не построена');
      break;
    }
    console.log(`Ступень ${step}`);
    built++;
  }
  console.log(`Всего построено: ${built}`);
}

async function main() {
  console.log('Выберите задачу:');
  console.log('1 — билетная касса');
  console.log('2 — доставка заказа');
  console.log('3 — лестница');
  const choice = (await ask('Ваш выбор: ')).trim();

  if (choice === '1') {
    const category = Number(await ask('Категория билета: '));
    const budget = await askNumber('Бюджет: ');
    if (budget === null) {
      console.log('некорректный ввод');
    } else {
      printTicketResult(category, budget);
    }
  } else if (choice === '2') {
    const distance = await askNumber('Расстояние: ');
    const total = distance === null ? null : await askNumber('Сумма заказа: ');
    if (total === null) {
      console.log('некорректный ввод');
    } else {
      printDelivery(distance, total);
    }
  } else if (choice === '3') {
    const height = await askNumber('Высота лестницы: ');
    if (height === null) {
      console.log('некорректный ввод');
    } else {
      printSteps(height);
    }
  } else {
    console.log('такой задачи нет');
  }

  rl.close();
}

main();
