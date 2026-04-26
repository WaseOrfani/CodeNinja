#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime

class OriaFreshAPITester:
    def __init__(self, base_url="https://food-order-php.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json() if response.text else {}
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "endpoint": endpoint,
                    "response": response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "error": str(e),
                "endpoint": endpoint
            })
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_get_products(self):
        """Test get all products"""
        success, response = self.run_test("Get Products", "GET", "products", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} products")
            return True, response
        return False, []

    def test_get_categories(self):
        """Test get all categories"""
        success, response = self.run_test("Get Categories", "GET", "categories", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} categories")
            return True, response
        return False, []

    def test_get_bestsellers(self):
        """Test get bestseller products"""
        success, response = self.run_test("Get Bestsellers", "GET", "bestsellers", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} bestsellers")
            return True, response
        return False, []

    def test_get_settings(self):
        """Test get settings"""
        return self.run_test("Get Settings", "GET", "settings", 200)

    def test_get_product_by_id(self, product_id):
        """Test get specific product"""
        return self.run_test(f"Get Product {product_id[:8]}", "GET", f"products/{product_id}", 200)

    def test_admin_login(self, email="admin@oriafresh.de", password="admin123"):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "admin/login",
            200,
            data={"email": email, "password": password}
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_admin_me(self):
        """Test admin me endpoint (requires auth)"""
        if not self.token:
            print("❌ No token available for admin/me test")
            return False
        return self.run_test("Admin Me", "GET", "admin/me", 200)[0]

    def test_admin_dashboard(self):
        """Test admin dashboard (requires auth)"""
        if not self.token:
            print("❌ No token available for admin dashboard test")
            return False
        return self.run_test("Admin Dashboard", "GET", "admin/dashboard", 200)[0]

    def test_admin_orders(self):
        """Test admin orders (requires auth)"""
        if not self.token:
            print("❌ No token available for admin orders test")
            return False
        return self.run_test("Admin Orders", "GET", "admin/orders", 200)[0]

    def test_create_order(self):
        """Test order creation"""
        order_data = {
            "items": [
                {
                    "product_id": "test-product-id",
                    "product_name": "Test Product",
                    "variant": "Single",
                    "variant_price": 8.90,
                    "quantity": 1,
                    "extras": [],
                    "total": 8.90
                }
            ],
            "customer_name": "Test Customer",
            "customer_phone": "+49 123 456789",
            "customer_email": "test@example.com",
            "pickup_time": "sofort",
            "notes": "Test order",
            "payment_method": "pickup",
            "subtotal": 8.90,
            "total": 8.90
        }
        return self.run_test("Create Order", "POST", "orders", 200, data=order_data)

def main():
    print("🍔 ORIA FRESH API Testing Suite")
    print("=" * 50)
    
    tester = OriaFreshAPITester()
    
    # Test public endpoints
    print("\n📋 Testing Public Endpoints...")
    tester.test_root_endpoint()
    
    products_success, products = tester.test_get_products()
    categories_success, categories = tester.test_get_categories()
    tester.test_get_bestsellers()
    tester.test_get_settings()
    
    # Test specific product if products exist
    if products_success and products:
        first_product = products[0]
        tester.test_get_product_by_id(first_product['id'])
    
    # Test order creation
    print("\n📦 Testing Order Creation...")
    tester.test_create_order()
    
    # Test admin endpoints
    print("\n🔐 Testing Admin Endpoints...")
    if tester.test_admin_login():
        tester.test_admin_me()
        tester.test_admin_dashboard()
        tester.test_admin_orders()
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for test in tester.failed_tests:
            error_msg = test.get('error', f"Status {test.get('actual')} != {test.get('expected')}")
            print(f"   - {test['test']}: {error_msg}")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"\n🎯 Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())