<?php
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';

// Logout only via POST + CSRF (a GET link could be triggered by another site)
if (!is_post()) {
    redirect('');
}
csrf_check();
logout();
admin_session_start();
flash('success', 'You have been logged out.');
redirect('login.php');
