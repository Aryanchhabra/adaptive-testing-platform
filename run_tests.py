#!/usr/bin/env python3
"""
Quick Test Execution Script for Adaptive Testing Platform
Run this script to execute comprehensive tests and generate presentation metrics
"""

import subprocess
import sys
import os
from pathlib import Path

def main():
    print("🎯 Adaptive Testing Platform - Test Suite Executor")
    print("=" * 50)
    
    # Ensure we're in the right directory
    if not os.path.exists("tests"):
        print("❌ Tests directory not found. Please run from project root.")
        return
    
    # Run the comprehensive test suite
    try:
        result = subprocess.run([
            sys.executable, "tests/run_comprehensive_tests.py"
        ], cwd=".")
        
        if result.returncode == 0:
            print("\n🎉 Test execution completed successfully!")
            print("📊 Check 'tests/reports/' directory for results")
        else:
            print("\n⚠️  Test execution completed with some issues")
            print("📊 Check 'tests/reports/' directory for details")
            
    except Exception as e:
        print(f"❌ Error running tests: {e}")
        print("Trying to run tests directly...")
        
        # Fallback: run individual components
        try:
            from tests.run_comprehensive_tests import TestRunner
            runner = TestRunner()
            runner.run_all()
        except Exception as e2:
            print(f"❌ Fallback also failed: {e2}")

if __name__ == "__main__":
    main() 