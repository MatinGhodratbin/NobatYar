<?php

namespace App\Exceptions;

use Exception;

class BusinessAlreadyExistsException extends Exception
{
    public function __construct(string $message = 'شما قبلاً یک کسب‌وکار ثبت کرده‌اید. سیستم فعلاً از چند کسب‌وکار برای هر مالک پشتیبانی نمی‌کند.')
    {
        parent::__construct($message);
    }
}