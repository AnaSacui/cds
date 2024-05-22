import { fetchPlaceholders, getMetadata } from '../../scripts/aem.js';
const placeholders = await fetchPlaceholders(getMetadata('locale'));

const { allSections, business, mps, answer, sNo } = placeholders;

async function createTableHeader(table) {
  let tr = document.createElement('tr');
  let sno = document.createElement('th');
  sno.appendChild(document.createTextNode('sNo'));
  let section = document.createElement('th');
  section.appendChild(document.createTextNode('Sections'));
  let question = document.createElement('th');
  question.appendChild(document.createTextNode('Questions'));
  let answer = document.createElement('th');
  answer.appendChild(document.createTextNode('Answers'));
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
  optionsMap.set('all', 'allSections');
  optionsMap.set('business', 'business');
  optionsMap.set('mps', 'mps');
  optionsMap.set('speaker', "speaker's election");
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
  let pathname = null;
  if (val) {
    pathname = jsonURL;
  } else {
    pathname = new URL(jsonURL);
  }

  const resp = await fetch(pathname);
  const json = await resp.json();
  console.log('=====JSON=====> {} ', json);

  const table = document.createElement('table');
  createTableHeader(table);
  json.data.forEach((row, i) => {
    createTableRow(table, row, i + 1);
  });

  return table;
}

export default async function decorate(block) {
  const faq = block.querySelector('a[href$=".json"]');
  const parientDiv = document.createElement('div');
  parientDiv.classList.add('faq-block');

  if (faq) {
    parientDiv.append(await createSelectMap(faq.href));
    parientDiv.append(await createTable(faq.href, null));
    faq.replaceWith(parientDiv);
  }
  const dropdown = document.getElementById('section');
  dropdown.addEventListener('change', () => {
    let url = faq.href;
    if (dropdown.value != 'all') {
      url = faq.href + '?sheet=' + dropdown.value;
    }
    const tableE = parientDiv.querySelector(':scope > table');
    let promise = Promise.resolve(createTable(url, dropdown.value));
    promise.then(function (val) {
      tableE.replaceWith(val);
    });
  });
}
