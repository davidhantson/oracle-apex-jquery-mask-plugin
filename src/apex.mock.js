/**
 * A super-light mock of the Oracle APEX JavaScript API
 * ----------------------------------------------------
 *  • apex.event.trigger()
 *  • apex.item.{getValue,setValue,setFocus,node}
 *  • apex.actions.createContext().add()
 *  • apex.jQuery   → re-export real jQuery
 *
 *  Only loaded in DEV. Production gets the real APEX runtime.
 */
import $ from 'jquery';

if (!window.apex) {                       /* avoid double-inject in APEX */
  console.info('[apexMock] APEX JS API not found – injecting mock.');

  /* ---------- event -------------------------------------------------- */
  const event = {
    trigger(selector, eventName, data) {
      console.log(`[apexMock] trigger "${eventName}" on "${selector}"`, data);
      $(selector).trigger(eventName, data);
    }
  };

  /* ---------- item --------------------------------------------------- */
  function item(name) {
    const $node = $('#' + name);
    return {
      node     : $node,                  // jQuery wrapper
      getValue : () => $node.val(),
      setValue : v  => $node.val(v),
      setFocus : () => $node[0]?.focus()
    };
  }

  /* ---------- actions ------------------------------------------------ */
  function createContext(ctxName, rootEl) {
    const $root = $(rootEl);
    return {
      context: rootEl,
      add(actions) {
        actions.forEach(({ name, action }) => {
          $root.on('click', `[data-action="${name}"]`,
            function (evt) { action(evt, this, {}); });
        });
      }
    };
  }

  window.apex = {
    jQuery : $,
    event,
    item,
    actions: { createContext }
  };
}

export default window.apex; // so you can `import 'apex'`