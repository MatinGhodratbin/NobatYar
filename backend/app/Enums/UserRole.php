<?php

namespace App\Enums;

enum UserRole: string
{
    case Customer = 'customer';
    case BusinessOwner = 'business_owner';
    case Employee = 'employee';
    case Admin = 'admin';
}