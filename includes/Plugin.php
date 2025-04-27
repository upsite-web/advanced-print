<?php
namespace AdvancedPrint;

class Plugin {
    private static $instance = null;

    public static function instance() {
        if ( self::$instance === null ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->setup_hooks();
    }

    private function setup_hooks() {
        // Initialize Admin Design
        new AP_AdminDesign();
        
        // Initialize Router (you'll create AP_Router later)
        if ( class_exists( 'AdvancedPrint\AP_Router' ) ) {
            new AP_Router();
        }
    }
}
