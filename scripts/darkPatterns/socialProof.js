const socialProofPatternEng =
  /\d*\s*(?:other)?\s*(?:customers?|clients?|buyers?|users?|shoppers?|purchasers?|people)?\s*(?:have\s+|just\s+)\s*(?:(?:also\s*)?(?:bought|purchased|ordered)|(?:rated|reviewed))\s*(?:this|the\s*following)?\s*(?:product|article|item)?s?/i;
const socialProofPatternLt =
  /(?:(?:iš)?parduotas?|įsigijo|įsigytas|(?:nu|nusi)pirko)\s*\d*\s*(?:kart(?:ą|ų|us)|pirkėj(?:as|ų|ai))?/i;

function detectSocialProofCases(highlight, modify, domCopy) {
  let darkPatternsCount = 0;

  const elements = domCopy.querySelectorAll("body *");

  elements.forEach((element) => {
    if (
      textTags.includes(element.tagName.toLowerCase()) &&
      (socialProofPatternEng.test(element.innerText) ||
        socialProofPatternLt.test(element.innerText))
    ) {
      darkPatternsCount++;

      if (highlight) {
        highlightSocialProofPattern(element);
      }

      if (modify) {
        const parentStyle = getComputedStyle(element.parentNode);
        const parentBorder = parentStyle.getPropertyValue("border");

        if (parentBorder && parentBorder.includes("rgb(255, 0, 0)")) {
          element.parentNode.style.border = "3px dashed green";
          element.style.opacity = "0.2";
        }

        if (parentBorder && parentBorder.includes("none")) {
          const div = document.createElement("div");

          element.parentNode.insertBefore(div, element);
          div.appendChild(element);

          div.style.border = "3px dashed green";
          element.style.opacity = "0.2";
        }
      }
    }
  });

  return darkPatternsCount;
}

function highlightSocialProofPattern(element) {
  if (element.parentNode) {
    const parentStyle = getComputedStyle(element.parentNode);
    const parentBorder = parentStyle.getPropertyValue("border");

    if (parentBorder && parentBorder.includes("none")) {
      const div = document.createElement("div");
      div.classList.add("dark-pattern");

      element.parentNode.insertBefore(div, element);
      div.appendChild(element);

      div.style.border = "3px dashed red";
    }
  }
}
