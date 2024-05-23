function detectDisguisedAdCases(highlight, modify, domCopy) {
  let darkPatternsCount = 0;

  const elementsWithAds = domCopy.querySelectorAll('[id*=tadsb], [class*=tadsb]');

  elementsWithAds.forEach(element => {
    darkPatternsCount++;
    
    if (highlight) {
      highlightDisguisedAdPattern(element);
    }
    
    if (modify) {
      const parentStyle = getComputedStyle(element.parentNode);
      const parentBorder = parentStyle.getPropertyValue('border');

      if(parentBorder && parentBorder.includes('rgb(255, 0, 0)')) {
        element.parentNode.style.border = '3px dashed green';
        element.style.opacity = '0.2';
      }

      if (parentBorder && parentBorder.includes('none')) {
        const div = document.createElement('div');

        element.parentNode.insertBefore(div, element);
        div.appendChild(element);

        div.style.border = '3px dashed green';
        element.style.opacity = '0.2';
      }
    }
  });

  return darkPatternsCount;
}

function highlightDisguisedAdPattern(element) {
  if (element.parentNode) {
    const parentStyle = getComputedStyle(element.parentNode);
    const parentBorder = parentStyle.getPropertyValue('border');

    if (parentBorder && parentBorder.includes('none')) {
      const div = document.createElement('div');
      div.classList.add('dark-pattern');
      
      const darkPatternTitle = document.createElement('span');
      darkPatternTitle.classList.add('tooltiptext');
      div.appendChild(darkPatternTitle);

      element.parentNode.insertBefore(div, element);
      div.appendChild(element);

      div.style.border = '3px dashed red';

      addTooltipEvents(div, darkPatternTitle);
    }
  }
}