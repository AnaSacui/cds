async function listSectionQuestions(sectionContainer, row) {
  let questionContainer = document.createElement('div');
  let question = document.createElement('h4');
  question.appendChild(document.createTextNode(row.Question));
  let answer = document.createElement('p');
  answer.appendChild(document.createTextNode(row.Answer));
  questionContainer.append(question);
  questionContainer.append(answer);
  sectionContainer.append(questionContainer);
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

  /*
  const table = document.createElement('table');
  json.data.forEach((row, i) => {
    createTableRow(table, row, i + 1);
  });
*/
  const sectionContainer = document.createElement('div');
  let sectionText = '';

  json.data.forEach((row, i) => {
    if (sectionText != row.Section) {
      let section = document.createElement('h2');
      console.log('sectionText --- ', sectionText);
      section.appendChild(document.createTextNode(row.Section));
      sectionContainer.appendChild(section);

      sectionText = row.Section;
    }

    listSectionQuestions(sectionContainer, row);
  });

  return sectionContainer;
}

export default async function decorate(block) {
  const faqs = block.querySelector('a[href$=".json"]');
  const parientDiv = document.createElement('div');
  parientDiv.classList.add('display-faqs');

  if (faqs) {
    parientDiv.append(await createTable(faqs.href, null));
    faqs.replaceWith(parientDiv);
  }
}
