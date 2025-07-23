PROCEDURE load_libraries(
  p_plugin IN apex_plugin.t_plugin
) IS
BEGIN
  ---------------------------------------  VENDOR  ---------------------------------------
  apex_javascript.add_library(
    p_name                    => 'jquery.mask.min',       -- jquery.mask.min.js
    p_directory               => p_plugin.file_prefix    -- ≙ #PLUGIN_FILES#
  );

  ---------------------------------------  PLUGIN  ---------------------------------------
  apex_javascript.add_library(
    p_name                    => 'apex.jquery.mask',      -- apex.jquery.mask.js
    p_directory               => p_plugin.file_prefix    -- ≙ #PLUGIN_FILES#
  );

  apex_css.add_file(
    p_name       => 'apex.jquery.mask',                   -- apex.jquery.mask.css
    p_directory  => p_plugin.file_prefix                 -- ≙ #PLUGIN_FILES#
  );
END load_libraries;



FUNCTION render(
  p_dynamic_action IN apex_plugin.t_dynamic_action,
  p_plugin         IN apex_plugin.t_plugin 
) RETURN apex_plugin.t_dynamic_action_render_result
IS
  l_result apex_plugin.t_dynamic_action_render_result; 
BEGIN
  l_result.attribute_01 := p_dynamic_action.attribute_01; -- Set Mask
  l_result.attribute_02 := p_dynamic_action.attribute_02; -- Set Reverse 1 or NULL
  l_result.attribute_03 := p_dynamic_action.attribute_03; -- Set Clear if not matched 1 or NULL

  load_libraries(p_plugin);

  l_result.javascript_function := 'apexJQueryMask.render';

  RETURN l_result;
EXCEPTION
  WHEN OTHERS then
    htp.p( SQLERRM );
    return l_result;
END render;