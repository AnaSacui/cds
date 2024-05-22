import { fetchPlaceholders, getMetadata } from '../../scripts/aem.js';
const placeholders = await fetchPlaceholders(getMetadata('locale'));

const { africa, america, asia, australia, europe, sNo } = placeholders;

async function createTableHeader(table) {
  let tr = document.createElement('tr');
  let sno = document.createElement('th');
  sno.appendChild(document.createTextNode(sno));
  let section = document.createElement('th');
  section.appendChild(document.createTextNode(section));
  let question = document.createElement('th');
  question.appendChild(document.createTextNode(question));
  let answer = document.createElement('th');
  answer.appendChild(document.createTextNode(answer));
  tr.append(sno);
  tr.append(section);
  tr.append(question);
  tr.append(answer);
  table.append(tr);
}

async function createTableRow(table, row, i) {
  let tr = document.createElement('tr');
  let sno = document.createElement('td');
  sno.appendChild(document.createTextNode(i));
  let section = document.createElement('td');
  section.appendChild(document.createTextNode(row.Section));
  let question = document.createElement('td');
  question.appendChild(document.createTextNode(row.Question));
  let answer = document.createElement('td');
  answer.appendChild(document.createTextNode(row.Answer));
  tr.append(sno);
  tr.append(section);
  tr.append(question);
  tr.append(answer);
  table.append(tr);
}

async function createSelectMap(jsonURL) {
  const optionsMap = new Map();
  const { pathname } = new URL(jsonURL);

  const resp = await fetch(pathname);
  optionsMap.set('all', allQuestions);
  optionsMap.set('asia', asia);
  optionsMap.set('europe', europe);
  optionsMap.set('africa', africa);
  optionsMap.set('america', america);
  optionsMap.set('australia', australia);
  const select = document.createElement('select');
  select.id = 'section';
  select.name = 'section';
  optionsMap.forEach((val, key) => {
    const option = document.createElement('option');
    option.textContent = val;
    option.value = key;
    select.append(option);
  });

  const div = document.createElement('div');
  div.classList.add('section-select');
  div.append(select);
  return div;
}

async function createTable(jsonURL, val) {
  let pathName = null;

  console.log('jsonURL: ', jsonURL);
  console.log('val: ', val);

  if (val) {
    pathName = jsonURL;
  } else {
    pathName = new URL(jsonURL);
  }

  console.log('pathName: ', pathName);

  const resp = await fetch(pathName);
  const json = resp.json;
  console.log('JSON: {}', json);

  const table = document.createElement('table');
  createTableHeader(table);
  json.data.forEach((row, i) => {
    createTableRow(table, row, i + 1);
  });

  return table;
}

export default async function decorate(block) {
  const faq = block.querySelector('p');
  console.log(faq);
  const parentDiv = document.createElement('div');
  parentDiv.classList.add('faq-block');

  if (faq) {
    parentDiv.append(await createTable(faq.innerText, 'helix-default'));
    faq.replaceWith(parentDiv);
  }
}
