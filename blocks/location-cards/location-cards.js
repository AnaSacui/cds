import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  // create list
  const ul = document.createElement('ul');
  // for each row in table
  [...block.children].forEach((row) => {
    // create line item
    const li = document.createElement('li');
    // add each row as li
    while (row.firstElementChild) li.append(row.firstElementChild);
    // for each li
    [...li.children].forEach((div) => {
      // if content div has a picture element
      if (div.children.length === 1 && div.querySelector('picture')) {
        // add this class
        div.className = 'location-card-image';
      }
      // else add this class
      else div.className = 'location-card-body';
    });
    // add li to list
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
  // display list
  block.append(ul);
}
