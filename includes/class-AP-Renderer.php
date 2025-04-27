<?php
namespace AdvancedPrint;

defined( 'ABSPATH' ) || exit;

// Adjust the path if your tcpdf folder is elsewhere:
require_once plugin_dir_path( __FILE__ ) . 'tcpdf/tcpdf.php';

class AP_Renderer {

    /**
     * Example: generate a PDF using TCPDF
     */
    public static function generate_pdf( $content, $filename = 'output.pdf' ) {
        $pdf = new \TCPDF();
        $pdf->AddPage();
        $pdf->writeHTML( $content );
        $pdf->Output( $filename, 'D' );  // force download
        exit;
    }
}