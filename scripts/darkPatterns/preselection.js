//Looks for possible use cases of preselection dark pattern in the current tab
function detectPreselectionCases(highlightDarkPattern, modifyDarkPattern, domCopy) {
        let foundDarkPatterns = 0;

        //Select all checkboxes which are not disabled and checked by default
        const allCheckboxes = domCopy.querySelectorAll(
                '*:not([aria-hidden="true"] *):not([class*="hidden"] *):not(.hidden *):not([style*="hidden"] *) input[type="checkbox"]:checked:not([disabled]):not([class*="disabled"])'
        );
        foundDarkPatterns += allCheckboxes.length;

        //Select all radio buttons which are not disabled and checked by default
        const allRadioButtons = domCopy.querySelectorAll(
                '*:not([aria-hidden="true"] *):not([class*="hidden"] *):not(.hidden *):not([style*="hidden"] *) button[role="switch"][aria-checked="true"]:not([disabled]):not([class*="disabled"])'
        );
        foundDarkPatterns += allRadioButtons.length;

        if (highlightDarkPattern) {
                highlightPreselectionCases(allCheckboxes, allRadioButtons);
        }

        if (modifyDarkPattern) {
                modifyPreselectionCases(allCheckboxes, allRadioButtons);
        }

        return foundDarkPatterns;
}

function highlightPreselectionCases(allCheckboxes, allRadioButtons) {
        if (allCheckboxes) {
                allCheckboxes.forEach((element) => {
                        element.parentNode.style.border = "3px dashed red";
                });
        }

        if (allRadioButtons) {
                allRadioButtons.forEach((element) => {
                        element.parentNode.style.border = "3px dashed red";
                });
        }
}

function modifyPreselectionCases(allCheckboxes, allRadioButtons) {
        if (allCheckboxes) {
                allCheckboxes.forEach((element) => {
                        element.click();
                        element.parentNode.style.border = "3px dashed green";
                });
        }

        if (allRadioButtons) {
                allRadioButtons.forEach((element) => {
                        element.click();
                        element.parentNode.style.border = "3px dashed green";
                });
        }
}
