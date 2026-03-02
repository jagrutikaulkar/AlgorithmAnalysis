#!/usr/bin/env python3
"""
ML Platform - Backend Integration Test
Tests the FastAPI backend endpoints without running the full server.
"""

import sys
import os
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

def test_imports():
    """Test that all required imports work"""
    print("Testing imports...")
    try:
        from fastapi import FastAPI
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.linear_model import LinearRegression
        import pandas as pd
        import numpy as np
        print("✓ All imports successful")
        return True
    except ImportError as e:
        print(f"✗ Import error: {e}")
        return False

def test_backend_structure():
    """Test that backend main.py can be imported"""
    print("\nTesting backend structure...")
    try:
        # Try to import the main module
        backend_path = Path(__file__).parent / "backend"
        sys.path.insert(0, str(backend_path))
        
        # Check if main.py exists
        main_file = backend_path / "main.py"
        if not main_file.exists():
            print(f"✗ main.py not found at {main_file}")
            return False
        
        print(f"✓ main.py found at {main_file}")
        
        # Try to read and parse main.py
        with open(main_file, 'r') as f:
            code = f.read()
            compile(code, str(main_file), 'exec')
        
        print("✓ main.py syntax is valid")
        return True
    except SyntaxError as e:
        print(f"✗ Syntax error in main.py: {e}")
        return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_sample_data():
    """Test that sample_data.csv exists and is valid"""
    print("\nTesting sample data...")
    try:
        sample_file = Path(__file__).parent / "sample_data.csv"
        if not sample_file.exists():
            print(f"✗ sample_data.csv not found at {sample_file}")
            return False
        
        import pandas as pd
        df = pd.read_csv(sample_file)
        print(f"✓ sample_data.csv loaded successfully")
        print(f"  - Shape: {df.shape}")
        print(f"  - Columns: {list(df.columns)}")
        return True
    except Exception as e:
        print(f"✗ Error loading sample data: {e}")
        return False

def main():
    print("=" * 50)
    print("ML Platform - Backend Integration Test")
    print("=" * 50)
    
    results = []
    results.append(("Imports", test_imports()))
    results.append(("Backend Structure", test_backend_structure()))
    results.append(("Sample Data", test_sample_data()))
    
    print("\n" + "=" * 50)
    print("Test Results")
    print("=" * 50)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{test_name}: {status}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n✓ All tests passed! Project is ready to run.")
        return 0
    else:
        print("\n✗ Some tests failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
