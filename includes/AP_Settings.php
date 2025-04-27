<?php
namespace AdvancedPrint;
defined('ABSPATH') || exit;

class AP_Settings {
  public static function register() {
    add_filter( 'woocommerce_settings_tabs_array', [__CLASS__,'add_tab'], 50 );
    add_action( 'woocommerce_settings_tabs_advanced_print', [__CLASS__,'tab_content'] );
    add_action( 'woocommerce_update_options_advanced_print', [__CLASS__,'save'] );
  }
  public static function add_tab($tabs) {
    $tabs['advanced_print'] = __( 'Advanced Print', 'advanced-print' );
    return $tabs;
  }
  public static function tab_content() {
    woocommerce_admin_fields( self::get_fields() );
  }
  public static function save() {
    woocommerce_update_options( self::get_fields() );
  }
  private static function get_fields() {
    return [
      ['name'=>'Watermark & Defaults','type'=>'title','id'=>'advanced_print_section_title'],
      ['name'=>'Watermark Logo','type'=>'file','id'=>'advanced_print_watermark_image','desc'=>'Tile watermark/logo over designs.'],
      ['name'=>'Opacity (%)','type'=>'number','id'=>'advanced_print_watermark_opacity','default'=>20,
       'custom_attributes'=>['min'=>0,'max'=>100,'step'=>1]],
      ['type'=>'sectionend','id'=>'advanced_print_section_end'],
    ];
  }
}
