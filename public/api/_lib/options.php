<?php
/**
 * Allowed values for the booking form's "appliance" select.
 * Keep in sync with src/data/services/index.ts (slugs) — the booking form sends the slug.
 */
declare(strict_types=1);

if (!defined('HS_API')) {
    http_response_code(403);
    exit;
}

return [
    'washing-machine-repair' => 'Washing Machine Repair',
    'fridge-freezer-repair' => 'Fridge Freezer Repair',
    'american-fridge-repair' => 'American Fridge Freezer Repair',
    'dishwasher-repair' => 'Dishwasher Repair',
    'electric-cooker-repair' => 'Electric Cooker & Oven Repair',
    'electric-hob-repair' => 'Electric & Induction Hob Repair',
    'gas-cooker-repair' => 'Gas Cooker Repair',
    'gas-hob-repair' => 'Gas Hob Repair',
    'microwave-repair' => 'Microwave Repair',
    'air-conditioning-repair' => 'Air Conditioning Repair & Servicing',
    'cold-room-repair' => 'Cold Room Repair & Maintenance',
    'dairy-cabinet-repair' => 'Dairy Cabinet Repair',
    'display-fridge-repair' => 'Display Fridge Repair',
    'bar-cooler-repair' => 'Bar Cooler Repair',
    'cellar-cooler-repair' => 'Cellar Cooler Repair',
    'ice-machine-repair' => 'Ice Machine Repair',
    'other' => 'Other / not sure',
];
