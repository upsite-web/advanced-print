<?php
namespace AdvancedPrint;

use Mpdf\Mpdf;

class Renderer {
  public function generatePdf($html) {
    // instantiate mPDF
    $mpdf = new Mpdf([
      'mode'       => 'utf-8',
      'format'     => 'A4',
      'margin_top'    => 16,
      'margin_bottom' => 16,
    ]);

    // write your HTML
    $mpdf->WriteHTML($html);

    // output directly to browser, or save to file:
    return $mpdf->Output('', \Mpdf\Output\Destination::STRING_RETURN);
  }
}