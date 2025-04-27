<?php
namespace AdvancedPrint;

class AP_AdminDesign {
    public function __construct() {
        // Add the meta box on add_meta_boxes
        add_action( 'add_meta_boxes', [ $this, 'add_meta_box' ] );
        // Enqueue your editor scripts/styles
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
    }
    public function init() {
      // if there’s nothing to do at init, you can leave this blank
      // OR you can move your constructor logic into here
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
        // Use a container that your JS will hook into
        echo '<div id="advanced-print-editor">Loading design editor…</div>';
    }

    public function enqueue_assets( $hook_suffix ) {
        // Only enqueue on the product edit screen
        if ( $hook_suffix !== 'post.php' && $hook_suffix !== 'post-new.php' ) {
            return;
        }
        if ( get_post_type() !== 'product' ) {
            return;
        }

        // Where your built JS lives
        $asset_url = plugin_dir_url( __DIR__ ) . 'build/editor.js';
        wp_enqueue_script(
            'advanced-print-editor',
            $asset_url,
            [ 'wp-element', 'wp-data', 'wp-api-fetch' ], // adjust deps if needed
            filemtime( plugin_dir_path( __DIR__ ) . 'build/editor.js' ),
            true
        );

        // Pass REST API nonce + endpoints
        global $post;
        wp_localize_script( 'advanced-print-editor', 'APConfig', [
            'rest_url'  => rest_url( 'advanced-print/v1/' ),
            'nonce'     => wp_create_nonce( 'wp_rest' ),
            'post_id'   => $post ? $post->ID : 0, // <-- Add this!
        ] );
              
    }
}