#!/usr/bin/env python3
"""
Test script to validate backend code changes.
This doesn't require Docker - it just validates imports and basic structure.
"""

import sys
sys.path.insert(0, 'apps/api/app')

def test_imports():
    """Test that all modules can be imported."""
    print("✓ Testing imports...")
    try:
        from models.user import VerificationCode
        print("  ✓ VerificationCode model imported")
        
        from core.dependencies import ensure_guest_cart_ownership, ensure_user_cart_ownership
        print("  ✓ Authorization dependencies imported")
        
        from repositories.carts import CartRepository
        print("  ✓ CartRepository imported")
        
        from repositories.verification_codes import VerificationCodeRepository
        print("  ✓ VerificationCodeRepository imported")
        
        from services.otp import OTPService
        print("  ✓ OTPService imported")
        
        from api.routes.cart import router as cart_router
        print("  ✓ Cart router imported")
        
        from api.routes.auth import router as auth_router
        print("  ✓ Auth router imported")
        
        from schemas.auth import SendOTPRequest, VerifyOTPRequest
        print("  ✓ OTP schemas imported")
        
        print("\n✓ All imports successful!")
        return True
    except Exception as e:
        print(f"\n✗ Import failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_model_structure():
    """Test that models have expected fields."""
    print("\n✓ Testing model structure...")
    try:
        from models.user import VerificationCode
        
        # Check fields
        required_fields = {'email', 'code', 'is_used', 'expires_at'}
        model_fields = set(VerificationCode.model_fields.keys())
        
        if required_fields.issubset(model_fields):
            print(f"  ✓ VerificationCode has all required fields: {required_fields}")
        else:
            missing = required_fields - model_fields
            print(f"  ✗ Missing fields: {missing}")
            return False
        
        print("\n✓ Model structure valid!")
        return True
    except Exception as e:
        print(f"\n✗ Model structure test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_otp_service():
    """Test OTP service basic functionality."""
    print("\n✓ Testing OTP service...")
    try:
        from services.otp import OTPService
        
        # Check class has required methods
        required_methods = {'generate_otp', 'send_otp', 'verify_otp'}
        class_methods = set(m for m in dir(OTPService) if not m.startswith('_'))
        
        if required_methods.issubset(class_methods):
            print(f"  ✓ OTPService has all required methods: {required_methods}")
        else:
            missing = required_methods - class_methods
            print(f"  ✗ Missing methods: {missing}")
            return False
        
        # Test OTP generation
        service = OTPService.__new__(OTPService)
        otp = service.generate_otp()
        if len(otp) == 6 and otp.isdigit():
            print(f"  ✓ OTP generation works: {otp}")
        else:
            print(f"  ✗ Invalid OTP generated: {otp}")
            return False
        
        print("\n✓ OTP service valid!")
        return True
    except Exception as e:
        print(f"\n✗ OTP service test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("=== Backend Code Validation ===\n")
    
    results = [
        test_imports(),
        test_model_structure(),
        test_otp_service(),
    ]
    
    print(f"\n=== Results: {sum(results)}/{len(results)} tests passed ===")
    
    if all(results):
        print("✓ All validation tests passed! Backend code is ready.")
        sys.exit(0)
    else:
        print("✗ Some tests failed. Please review the output above.")
        sys.exit(1)
