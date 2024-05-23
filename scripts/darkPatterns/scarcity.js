const scarcityPatternEng = /\d+\s*(?:\%|pieces?|pcs\.?|pc\.?|ct\.?|items?)?\s*(?:available|sold|claimed|redeemed)|(?:last|final)\s*(?:article|item)/i;
const scarcityPatternLt = /(?:sandėlyje)?(?:liko|likutis)?\s*(?:tik|mažiau)?(?:nei)?:?\s*[<>]?\s*\d+\+\s*(vnt\.)?/i;
const textTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'a', 'li'];

function detectScarcityCases(highlight, modify, domCopy){
  let darkPatternsCount = 0;

  const elements = domCopy.querySelectorAll('body *');
  
  elements.forEach(element => {
    if (textTags.includes(element.tagName.toLowerCase()) && 
      (scarcityPatternEng.test(element.innerText) || scarcityPatternLt.test(element.innerText))) {
      darkPatternsCount++;

      if (highlight) {
        highlightScarcityPattern(element);
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
    }
  });

  return darkPatternsCount;
}

function highlightScarcityPattern(element) {
  if (element.parentNode) {
    const parentStyle = getComputedStyle(element.parentNode);
    const parentBorder = parentStyle.getPropertyValue('border');

    if (parentBorder && parentBorder.includes('none')) {
      const div = document.createElement('div');
      div.classList.add('dark-pattern');
      
      element.parentNode.insertBefore(div, element);
      div.appendChild(element);

      div.style.border = '3px dashed red';
    }
  }
}