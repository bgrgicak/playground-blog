<?php
/*
Plugin Name: Playgorund Markdown loader
Description: A plugin that loads markdown files into WordPress
Version: 1.0
Author: WordPress community
*/

function my_custom_plugin_scripts() {
    wp_register_script('playground-markdown', plugin_dir_url(__FILE__) . 'playground-markdown.js', array('wp-api'));
    $dir = '/wordpress/wp-content/uploads/markdown';
    $files = array();

    if (is_dir($dir)) {
        if ($dh = opendir($dir)) {
            while (($file = readdir($dh)) !== false) {
                if ($file != "." && $file != "..") {
                    $filePath = $dir . '/' . $file;
                    $fileContent = file_get_contents($filePath);
                    $files[] = array(
                        'path' => $filePath,
                        'name' => $file,
                        'content' => $fileContent,
                    );
                }
            }
            closedir($dh);
        }
    }
    $data = array(
      'markdown' => $files
    );
    wp_localize_script('playground-markdown', 'playgroundMarkdown', $data);
    wp_enqueue_script('playground-markdown');
}
add_action('wp_enqueue_scripts', 'my_custom_plugin_scripts');