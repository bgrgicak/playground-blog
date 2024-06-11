<?php
/*
Plugin Name: Playgorund Markdown loader
Description: A plugin that loads markdown files into WordPress
Version: 1.0
Author: WordPress community
*/

function playground_markdown_scripts() {
    wp_register_script('playground-markdown', plugin_dir_url(__FILE__) . 'playground-markdown.js', array('wp-api', 'wp-blocks'));
    $dir = '/wordpress/wp-content/uploads/markdown';
    $files = array();

    if (is_dir($dir)) {
        if ($dh = opendir($dir)) {
            while (($file = readdir($dh)) !== false) {
                if ($file != "." && $file != "..") {
                    $filePath = $dir . '/' . $file;
                    $fileContent = file_get_contents($filePath);

                    // Check if the file is already in the database
                    $post = get_page_by_title($file, OBJECT, 'post');
                    if ($post) {
                        continue;
                    }

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

    wp_enqueue_style('playground-markdown', plugin_dir_url(__FILE__) . 'playground-markdown.css');
}
add_action('wp_enqueue_scripts', 'playground_markdown_scripts');
