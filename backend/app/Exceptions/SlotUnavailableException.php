<?php

namespace App\Exceptions;

use Exception;

class SlotUnavailableException extends Exception
{
    public function __construct(string $message = 'این بازه زمانی دیگر در دسترس نیست. لطفاً زمان دیگری انتخاب کنید.')
    {
        parent::__construct($message);
    }
}