#!/usr/bin/env python3
"""
Simple syntax validation without triggering SQLModel re-registration issues.
"""

import ast
import sys

def check_syntax(filepath):
    """Check a Python file for syntax errors."""
    try:
        with open(filepath, 'r') as f:
            ast.parse(f.read())
        return True, None
    except SyntaxError as e:
        return False, str(e)

files_to_check = [
    'apps/api/app/services/otp.py',
    'apps/api/app/repositories/verification_codes.py',
    'apps/api/app/api/routes/cart.py',
    'apps/api/app/api/routes/auth.py',
    'apps/api/app/core/dependencies.py',
    'apps/api/app/models/user.py',
    'apps/api/app/schemas/auth.py',
]

print("=== Syntax Validation ===\n")
all_valid = True

for filepath in files_to_check:
    valid, error = check_syntax(filepath)
    if valid:
        print(f"✓ {filepath}")
    else:
        print(f"✗ {filepath}: {error}")
        all_valid = False

print(f"\n=== Results ===")
if all_valid:
    print("✓ All files have valid Python syntax!")
    sys.exit(0)
else:
    print("✗ Some files have syntax errors.")
    sys.exit(1)
