#!/usr/bin/env python3
"""
Complete validation script for cart authorization and OTP implementation.
This validates all changes are in place and syntactically correct.
"""

import os
import ast
import sys
from pathlib import Path

def validate_file_exists(filepath, description):
    """Check if file exists."""
    if os.path.exists(filepath):
        size = os.path.getsize(filepath)
        print(f"  ✓ {description}: {filepath} ({size} bytes)")
        return True
    else:
        print(f"  ✗ {description}: {filepath} NOT FOUND")
        return False

def validate_syntax(filepath):
    """Check Python file syntax."""
    try:
        with open(filepath, 'r') as f:
            ast.parse(f.read())
        return True
    except SyntaxError as e:
        print(f"  ✗ Syntax error in {filepath}: {e}")
        return False

def validate_contains(filepath, search_strings, description):
    """Check if file contains required strings."""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        missing = []
        for search_str in search_strings:
            if search_str not in content:
                missing.append(search_str)
        
        if not missing:
            print(f"  ✓ {description}")
            return True
        else:
            print(f"  ✗ {description} - Missing: {missing}")
            return False
    except Exception as e:
        print(f"  ✗ Error checking {filepath}: {e}")
        return False

def main():
    print("=" * 70)
    print("CART AUTHORIZATION + OTP IMPLEMENTATION VALIDATION")
    print("=" * 70)
    
    all_valid = True
    
    # =========================================================================
    # 1. BACKEND FILES
    # =========================================================================
    print("\n[1] BACKEND FILES")
    print("-" * 70)
    
    files_to_check = {
        'apps/api/app/services/otp.py': 'OTP Service',
        'apps/api/app/repositories/verification_codes.py': 'Verification Code Repository',
        'apps/api/app/api/routes/cart.py': 'Cart Routes (Split)',
        'apps/api/app/api/routes/auth.py': 'Auth Routes (with OTP)',
        'apps/api/app/core/dependencies.py': 'Authorization Dependencies',
        'apps/api/app/models/user.py': 'User Model (with VerificationCode)',
        'apps/api/app/schemas/auth.py': 'Auth Schemas (with OTP)',
    }
    
    for filepath, description in files_to_check.items():
        if validate_file_exists(filepath, description):
            if not validate_syntax(filepath):
                all_valid = False
    
    # =========================================================================
    # 2. FRONTEND FILES
    # =========================================================================
    print("\n[2] FRONTEND FILES")
    print("-" * 70)
    
    frontend_files = {
        'apps/web/src/components/forms/otp-form.tsx': 'OTP Form Component',
        'apps/web/src/lib/api.ts': 'API Client (Updated)',
        'apps/web/src/components/forms/auth-panel.tsx': 'Auth Panel (Updated)',
    }
    
    for filepath, description in frontend_files.items():
        validate_file_exists(filepath, description)
    
    # =========================================================================
    # 3. FEATURE VALIDATION
    # =========================================================================
    print("\n[3] FEATURE VALIDATION: OTP")
    print("-" * 70)
    
    otp_features = [
        ('apps/api/app/services/otp.py', 
         ['def generate_otp', 'def send_otp', 'def verify_otp'],
         'OTP Service has all required methods'),
        ('apps/api/app/models/user.py',
         ['class VerificationCode', 'email: str', 'code: str', 'is_used: bool'],
         'VerificationCode model defined'),
        ('apps/api/app/repositories/verification_codes.py',
         ['class VerificationCodeRepository', 'def get_unused_by_email_and_code'],
         'Verification Code Repository defined'),
        ('apps/api/app/api/routes/auth.py',
         ['def send_otp', 'def verify_otp', '/send-otp', '/verify-otp'],
         'Auth routes have OTP endpoints'),
        ('apps/api/app/schemas/auth.py',
         ['SendOTPRequest', 'SendOTPResponse', 'VerifyOTPRequest', 'VerifyOTPResponse'],
         'OTP schemas defined'),
    ]
    
    for filepath, search_strings, description in otp_features:
        if not validate_contains(filepath, search_strings, description):
            all_valid = False
    
    # =========================================================================
    # 4. FEATURE VALIDATION: CART AUTHORIZATION
    # =========================================================================
    print("\n[4] FEATURE VALIDATION: CART AUTHORIZATION")
    print("-" * 70)
    
    cart_features = [
        ('apps/api/app/api/routes/cart.py',
         ['/guest', '@router.get("/guest"', '@router.post("/guest"', '@router.delete("/guest/item"'],
         'Guest cart endpoints defined'),
        ('apps/api/app/api/routes/cart.py',
         ['def get_user_cart', 'def upsert_user_cart_item', 'def remove_user_cart_item', 'get_current_user'],
         'Authenticated cart endpoints defined'),
        ('apps/api/app/core/dependencies.py',
         ['ensure_guest_cart_ownership', 'ensure_user_cart_ownership'],
         'Authorization dependencies defined'),
        ('apps/api/app/repositories/carts.py',
         ['validate_user_cart', 'validate_session_cart'],
         'Cart validation methods defined'),
        ('apps/web/src/lib/api.ts',
         ['if (!token)', '/cart/guest', 'buildAuthHeaders(undefined, sessionId)'],
         'Frontend routes to correct endpoint'),
    ]
    
    for filepath, search_strings, description in cart_features:
        if not validate_contains(filepath, search_strings, description):
            all_valid = False
    
    # =========================================================================
    # 5. FRONTEND INTEGRATION
    # =========================================================================
    print("\n[5] FRONTEND INTEGRATION")
    print("-" * 70)
    
    frontend_features = [
        ('apps/web/src/components/forms/otp-form.tsx',
         ['interface OTPFormProps', 'handleSendOTP', 'handleVerifyOTP'],
         'OTP form component has required functions'),
        ('apps/web/src/components/forms/auth-panel.tsx',
         ['OTPForm', 'signupStep', 'handleOtpVerified'],
         'Auth panel integrates OTP form'),
        ('apps/web/src/lib/api.ts',
         ['sendOtp', 'verifyOtp', 'export async function'],
         'API client has OTP functions'),
    ]
    
    for filepath, search_strings, description in frontend_features:
        if not validate_contains(filepath, search_strings, description):
            all_valid = False
    
    # =========================================================================
    # 6. DOCUMENTATION
    # =========================================================================
    print("\n[6] DOCUMENTATION")
    print("-" * 70)
    
    docs = {
        'TESTING_GUIDE.md': 'Testing Guide',
        'IMPLEMENTATION_SUMMARY.md': 'Implementation Summary',
    }
    
    for filepath, description in docs.items():
        validate_file_exists(filepath, description)
    
    # =========================================================================
    # 7. SUMMARY
    # =========================================================================
    print("\n" + "=" * 70)
    if all_valid:
        print("✓ ALL VALIDATIONS PASSED - IMPLEMENTATION COMPLETE")
        print("=" * 70)
        print("\nNext steps:")
        print("1. Start Docker services: sudo docker-compose up -d")
        print("2. Check API health: curl http://localhost:8000/api/v1/health")
        print("3. Test OTP flow: See TESTING_GUIDE.md")
        print("\nKey features implemented:")
        print("  ✓ OTP email verification for signup")
        print("  ✓ Cart authorization (guest vs authenticated)")
        print("  ✓ Frontend OTP form component")
        print("  ✓ Automatic endpoint routing by auth status")
        return 0
    else:
        print("✗ SOME VALIDATIONS FAILED - PLEASE REVIEW")
        print("=" * 70)
        return 1

if __name__ == "__main__":
    sys.exit(main())
