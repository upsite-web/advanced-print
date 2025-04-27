<?php
namespace AdvancedPrint;
defined('ABSPATH') || exit;

class Plugin {
  private static $instance = null;
  public static function instance() {
    if ( self::$instance === null ) {
      self::$instance = new self();
      self::$instance->setup_hooks();
    }
    return self::$instance;
  }
  private function setup_hooks() {
    AP_Settings::register();
    AP_AdminDesign::init();
  }
}
