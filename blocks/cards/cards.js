import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  // create list element
  const ul = document.createElement('ul');
  // for each row in block
  [...block.children].forEach((row) => {
    // create list item
    const li = document.createElement('li');
    // while table has rows, add row to list item
    while (row.firstElementChild) li.append(row.firstElementChild);

    // for each div in a list item
    [...li.children].forEach((div) => {
      // target the image and add the class
      if (div.children.length === 1 && div.querySelector('picture'))
        div.className = 'cards-card-image';
      // else add the body class
      else div.className = 'cards-card-body';
    });

    // add list item to list
    ul.append(li);
  });
  // optimise images
  ul.querySelectorAll('img').forEach((img) =>
    img
      .closest('picture')
      .replaceWith(
        createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])
      )
  );
  block.textContent = '';

  // render list
  block.append(ul);
}
