<?php
/*
Plugin Name: Playgorund Markdown loader
Description: A plugin that loads markdown files into WordPress
Version: 1.0
Author: WordPress community
*/

function playground_markdown_scripts() {
    global $markdown_parsed;

    wp_register_script('playground-markdown', plugin_dir_url(__FILE__) . 'playground-markdown.js', array('wp-api', 'wp-blocks'));
    $dir = '/wordpress/wp-content/uploads/markdown';
    $files = array();
    $attachments = array();

    if (is_dir($dir)) {
        if ($dh = opendir($dir)) {
            while (($file = readdir($dh)) !== false) {
                if ($file === "." || $file === "..") {
                    continue;
                }

                $filePath = $dir . '/' . $file;
                if (str_ends_with($file, '.md')) {
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
                } else if (!$markdown_parsed){
                    $wp_filetype = wp_check_filetype(basename($filePath), null);
                    $attachment = array(
                        'post_mime_type' => $wp_filetype['type'],
                        'post_title' => preg_replace('/\.[^.]+$/', '', basename($filePath)),
                        'post_content' => '',
                        'post_status' => 'inherit'
                    );
                    $attach_id = wp_insert_attachment($attachment, $filePath);
                    $attach_url = wp_get_attachment_url($attach_id);
                    $attachments[] = array(
                        'path' => $filePath,
                        'local_path' => $file,
                        'name' => $file,
                        'url' => $attach_url,
                    );
                }
            }
            closedir($dh);
            $markdown_parsed = true;
        }
    }
    $data = array(
        'markdown' => $files,
        'attachments' => $attachments,
    );
    wp_localize_script('playground-markdown', 'playgroundMarkdown', $data);
    wp_enqueue_script('playground-markdown');

    wp_enqueue_style('playground-markdown', plugin_dir_url(__FILE__) . 'playground-markdown.css');
}
add_action('wp_enqueue_scripts', 'playground_markdown_scripts');


function playground_markdown_loader($classes) {
    $classes[] = 'playground-markdown-loading';
    return $classes;
}
add_filter('body_class', 'playground_markdown_loader');