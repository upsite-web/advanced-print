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

// 1) Load Composer Autoload (only!)
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
    require_once __DIR__ . '/vendor/autoload.php';
}

// 2) Bootstrap main plugin
\AdvancedPrint\Plugin::instance();
