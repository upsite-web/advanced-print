<?php
namespace AdvancedPrint;

class AP_Meta {
    public function __construct() {
        add_action( 'init', [ $this, 'register_meta' ] );
    }

    public function register_meta() {
        register_post_meta( 'product', '_advanced_print_text', [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
        ] );

        register_post_meta( 'product', '_advanced_print_image', [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
        ] );
    }
}
