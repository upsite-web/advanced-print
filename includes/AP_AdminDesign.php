<?php
namespace AdvancedPrint;

class AP_AdminDesign {
  public function __construct() {
    add_action( 'add_meta_boxes', [ $this, 'add_meta_box' ] );
    add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
    add_action( 'init', [ $this, 'register_meta' ] ); // ← ADD THIS LINE
}

    public function add_meta_box() {
        add_meta_box(
            'advanced_print_design',
            __( 'Custom Design', 'advanced-print' ),
            [ $this, 'render_meta_box' ],
            'product',
            'normal',
            'high'
        );
    }

    public function render_meta_box( $post ) {
        echo '<div id="advanced-print-editor">Loading design editor…</div>';
    }

    public function enqueue_assets( $hook_suffix ) {
        if ( $hook_suffix !== 'post.php' && $hook_suffix !== 'post-new.php' ) {
            return;
        }
        if ( get_post_type() !== 'product' ) {
            return;
        }

        $asset_url = plugin_dir_url( __DIR__ ) . 'build/editor.js';
        $asset_path = plugin_dir_path( __DIR__ ) . 'build/editor.js';

        wp_enqueue_script(
            'advanced-print-editor',
            $asset_url,
            [ 'wp-element', 'wp-data', 'wp-api-fetch' ],
            file_exists($asset_path) ? filemtime($asset_path) : null,
            true
        );

        wp_localize_script( 'advanced-print-editor', 'APConfig', [
          'rest_url' => rest_url( 'wp/v2/' ),
          'post_id'  => get_the_ID(),
          'nonce'    => wp_create_nonce( 'wp_rest' ),
      ] );
      
    }
    public function register_meta() {
      register_post_meta('product', '_advanced_print_design', [
          'type' => 'string',
          'single' => true,
          'show_in_rest' => true,
          'sanitize_callback' => 'wp_kses_post',
          'auth_callback' => function() {
              return current_user_can('edit_posts');
          }
      ]);
  }
  
}

