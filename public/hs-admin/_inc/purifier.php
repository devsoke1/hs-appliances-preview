<?php
/**
 * HTMLPurifier for rich-text content (Insights + service content).
 * Allow-list only: headings, paragraphs, lists, links, emphasis, quotes, code, images from this site.
 * Scripts, event handlers, styles, iframes and external images are removed.
 */
declare(strict_types=1);

if (!defined('HS_ADMIN')) {
    http_response_code(403);
    exit;
}

function purify_html(string $html): string
{
    static $purifier = null;
    if ($purifier === null) {
        require_once PUBLIC_ROOT . '/api/_lib/htmlpurifier/HTMLPurifier.auto.php';
        $c = HTMLPurifier_Config::createDefault();
        $c->set('Core.Encoding', 'UTF-8');
        $c->set('HTML.Doctype', 'HTML 4.01 Transitional');
        $c->set('HTML.Allowed', implode(',', [
            'p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup',
            'a[href|title|target|rel]', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'hr',
            'img[src|alt|width|height]',
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
        ]));
        $c->set('URI.AllowedSchemes', ['http' => true, 'https' => true, 'mailto' => true, 'tel' => true]);
        // Images must be hosted here (e.g. /uploads/…) — blocks tracking pixels / hotlinks
        $c->set('URI.DisableExternalResources', true);
        // External links open in a new tab with rel="noopener noreferrer"
        $c->set('HTML.TargetBlank', true);
        $c->set('HTML.TargetNoopener', true);
        $c->set('HTML.TargetNoreferrer', true);
        $c->set('Attr.AllowedFrameTargets', ['_blank']);
        $c->set('AutoFormat.RemoveEmpty', true);
        $c->set('Output.Newline', "\n");
        $c->set('Cache.SerializerPath', hs_storage('htmlpurifier'));
        $purifier = new HTMLPurifier($c);
    }
    // Quill uses non-breaking spaces between words in some cases; normalise them
    $html = str_replace(['&nbsp;', "\u{00A0}"], ' ', $html);
    return trim($purifier->purify($html));
}
