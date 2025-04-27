<?php
namespace AdvancedPrint;

class AP_Router {
    public function __construct() {
        add_action( 'rest_api_init', [ $this, 'register_routes' ] );
    }

    public function register_routes() {
        register_rest_route( 'advanced-print/v1', '/design', [
            [
                'methods'             => 'GET',
                'callback'            => [ $this, 'get_design' ],
                'permission_callback' => function() {
                    return current_user_can( 'edit_products' );
                },
            ],
            [
                'methods'             => 'POST',
                'callback'            => [ $this, 'save_design' ],
                'permission_callback' => function() {
                    return current_user_can( 'edit_products' );
                },
                'args'                => [
                    'designData' => [
                        'required' => true,
                        'type'     => 'array',
                    ],
                ],
            ],
        ] );
    }

    public function get_design( $request ) {
        $post_id = $request->get_param( 'post_id' );
        // load meta, etc.
        return rest_ensure_response( [ /* your design JSON here */ ] );
    }

    public function save_design( $request ) {
        $post_id    = $request->get_param( 'post_id' );
        $designData = $request->get_param( 'designData' );
        update_post_meta( $post_id, '_advanced_print_design', $designData );
        return rest_ensure_response( [ 'success' => true ] );
    }
}