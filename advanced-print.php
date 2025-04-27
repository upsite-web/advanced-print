<?php
/**
 * Plugin Name: Advanced Print for WooCommerce
 * Description: Real-time design editor, PDF/JPG generation, watermarking, and edit flows
 * Version:     1.0.0
 * Author:      You
 * Text Domain: advanced-print
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// 1) (Optional) Composer autoload if you ever get it working
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
    require_once __DIR__ . '/vendor/autoload.php';
}

use AdvancedPrint\Plugin;

// 3) Bootstrap the plugin
\AdvancedPrint\Plugin::instance();
