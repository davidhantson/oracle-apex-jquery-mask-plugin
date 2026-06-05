/* eslint-disable no-undef */
/* global apex, window */

import 'jquery-mask-plugin';  
import 'jquery';
import 'apex';
import './styles.scss';

const $ = window.apex?.jQuery ||
          (() => { throw Error('apex.jQuery ontbreekt'); })();

/**
 * Helper functie om APEX string attributen te evalueren als JavaScript.
 * Biedt ondersteuning voor globale functienamen of inline JS objecten/functies.
 */
function evaluateJs(jsString) {
  if (!jsString) return undefined;
  
  const cleanString = jsString.trim();
  
  try {
    // 1. Is de input simpelweg de naam van een globale variabele/functie?
    // Bijv: "SPMaskBehavior" of "myApp.masks.phone"
    // We resolven dit veilig zonder het uit te voeren (geen eval nodig).
    if (/^[a-zA-Z_$][0-9a-zA-Z_$.]*$/.test(cleanString)) {
        let obj = window;
        const path = cleanString.split('.');
        
        for (let i = 0; i < path.length; i++) {
            obj = obj[path[i]];
            if (obj === undefined) break; // Pad bestaat niet
        }
        
        if (obj !== undefined) {
            return obj;
        }
    }
    
    // 2. Als het geen simpele referentie is, evalueer het als een inline JS expressie.
    // Dit werkt perfect voor "function() { return '*'.repeat(50); }" 
    // of voor complexe objecten "{ translation: { ... } }"
    return new Function('return ' + cleanString)();
    
  } catch (e) {
    apex.debug.error('jQuery Mask Plugin: Fout bij evalueren van expressie:', cleanString, e);
    return null;
  }
}

export function render() {
  // 1. Basis attributen uitlezen
  let maskVal         = this.action.attribute01;
  let reverse         = this.action.attribute02 ? true : false;
  let clearIfNotMatch = this.action.attribute03 ? true : false;
  
  // 2. Geavanceerde attributen uitlezen
  let isAdvanced      = this.action.attribute04 === 'Y';
  let maskExpression  = this.action.attribute05;
  let optionsObject   = this.action.attribute06;

  // Initialiseer defaults
  let finalMask    = maskVal;
  let finalOptions = { 
    reverse, 
    clearIfNotMatch 
  };

  // 3. Overschrijven met geavanceerde logica (indien geactiveerd in APEX)
  if (isAdvanced) {
    // Check op een dynamische mask functie
    if (maskExpression) {
        const evaluatedMask = evaluateJs(maskExpression);
        if (evaluatedMask) {
            finalMask = evaluatedMask;
        }
    }

    // Check op extra opties (zoals onKeyPress, onChange, enz.)
    if (optionsObject) {
        const evaluatedOptions = evaluateJs(optionsObject);
        if (evaluatedOptions && typeof evaluatedOptions === 'object') {
            // Merge de standaard opties met de custom JS opties
            finalOptions = Object.assign(finalOptions, evaluatedOptions);
        }
    }
  }

  // 4. Uitvoeren van de jQuery Mask plugin!
  $(this.affectedElements).mask(finalMask, finalOptions);
}