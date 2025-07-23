/* eslint-disable no-undef */
/* global apex, $ */

import 'jquery-mask-plugin';  
import 'jquery';
import 'apex';
import './styles.scss';

const $ = window.apex?.jQuery ||
          (() => { throw Error('apex.jQuery ontbreekt'); })();

function mask(params) {
  const { affectedElements, mask, reverse, clearIfNotMatch } = params;

  apex.jQuery(affectedElements).mask(mask, { 
    reverse, 
    clearIfNotMatch 
  });
}

export function render() {
  mask({
    affectedElements: this.affectedElements,
    mask:             this.action.attribute01,
    reverse:          this.action.attribute02 ? true : false,
    clearIfNotMatch:  this.action.attribute03 ? true : false
  });
}