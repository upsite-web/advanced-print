<?php
namespace AdvancedPrint;
defined('ABSPATH') || exit;

class AP_AdminDesign {
  public static function init() {
    add_action( 'add_meta_boxes',        [__CLASS__,'add_metabox'] );
    add_action( 'admin_enqueue_scripts', [__CLASS__,'enqueue_assets'] );
  }
  public static function add_metabox() {
    add_meta_box(
      'ap-design-editor',
      __( 'Custom Design', 'advanced-print' ),
      [__CLASS__,'render_metabox'],
      'product','normal','high'
    );
  }
  public static function render_metabox( $post ) {
    echo '<div id="ap-design-editor" style="min-height:300px;border:1px solid #ddd;padding:10px;">';
    echo __( 'Loading design editor…', 'advanced-print' );
    echo '</div>';
  }
  public static function enqueue_assets( $hook ) {
    if ( ! in_array( $hook, ['post.php','post-new.php'], true ) ) return;
    wp_enqueue_script( 'ap-admin-js',
      plugins_url('assets/build/admin.js', __FILE__),
      ['jquery'], null, true
    );
    wp_enqueue_style( 'ap-admin-css',
      plugins_url('assets/build/admin.css', __FILE__),
      [], null
    );
  }
}
