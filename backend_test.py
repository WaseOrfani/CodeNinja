#!/usr/bin/env python3
"""
AfghanFood.de Backend API Testing Suite
Tests all API endpoints for the Afghan food platform
"""

import requests
import sys
import json
from datetime import datetime

class AfghanFoodAPITester:
    def __init__(self, base_url="https://afghanfood.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.passed_tests = []

    def log_result(self, test_name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            self.passed_tests.append(test_name)
            print(f"✅ {test_name} - PASSED")
        else:
            self.failed_tests.append({"test": test_name, "details": details})
            print(f"❌ {test_name} - FAILED: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, auth_required=False):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            
            if success:
                self.log_result(name, True)
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_detail = response.json()
                    error_msg += f" - {error_detail}"
                except:
                    error_msg += f" - {response.text[:200]}"
                self.log_result(name, False, error_msg)
                return False, {}

        except requests.exceptions.RequestException as e:
            error_msg = f"Request failed: {str(e)}"
            self.log_result(name, False, error_msg)
            return False, {}

    def test_health_endpoints(self):
        """Test basic health and info endpoints"""
        print("\n" + "="*50)
        print("TESTING HEALTH & INFO ENDPOINTS")
        print("="*50)
        
        # Test root endpoint
        self.run_test("API Root", "GET", "", 200)
        
        # Test health endpoint
        self.run_test("Health Check", "GET", "health", 200)

    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        print("\n" + "="*50)
        print("TESTING AUTHENTICATION")
        print("="*50)
        
        # Test login with correct credentials
        login_data = {
            "email": "admin@afghanfood.de",
            "password": "Admin123!"
        }
        
        success, response = self.run_test(
            "Admin Login", 
            "POST", 
            "auth/login", 
            200, 
            data=login_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            print(f"   ✅ Token obtained: {self.token[:20]}...")
            
            # Test get current user
            self.run_test("Get Current User", "GET", "auth/me", 200, auth_required=True)
        else:
            print("   ❌ Failed to get authentication token")
            
        # Test login with wrong credentials
        wrong_login = {
            "email": "admin@afghanfood.de", 
            "password": "wrongpassword"
        }
        self.run_test("Invalid Login", "POST", "auth/login", 401, data=wrong_login)

    def test_recipe_endpoints(self):
        """Test recipe-related endpoints"""
        print("\n" + "="*50)
        print("TESTING RECIPE ENDPOINTS")
        print("="*50)
        
        # Test get all recipes
        success, recipes = self.run_test("Get All Recipes", "GET", "recipes", 200)
        
        if success and isinstance(recipes, list):
            print(f"   📊 Found {len(recipes)} recipes")
            
            # Check if we have the expected 3 recipes
            expected_recipes = ["qabuli-palaw", "mantu", "bolani"]
            found_recipes = [r.get('slug', '') for r in recipes if isinstance(r, dict)]
            
            for expected in expected_recipes:
                if expected in found_recipes:
                    print(f"   ✅ Found expected recipe: {expected}")
                else:
                    print(f"   ⚠️  Missing expected recipe: {expected}")
            
            # Test get specific recipe if available
            if recipes and len(recipes) > 0:
                first_recipe = recipes[0]
                if isinstance(first_recipe, dict) and 'slug' in first_recipe:
                    self.run_test(
                        f"Get Recipe Detail ({first_recipe['slug']})", 
                        "GET", 
                        f"recipes/{first_recipe['slug']}", 
                        200
                    )
        
        # Test get recipes with category filter
        self.run_test("Get Recipes by Category", "GET", "recipes?category=hauptgerichte", 200)
        
        # Test get non-existent recipe
        self.run_test("Get Non-existent Recipe", "GET", "recipes/non-existent-recipe", 404)

    def test_blog_endpoints(self):
        """Test blog-related endpoints"""
        print("\n" + "="*50)
        print("TESTING BLOG ENDPOINTS")
        print("="*50)
        
        # Test get all blog posts
        success, posts = self.run_test("Get All Blog Posts", "GET", "blog", 200)
        
        if success and isinstance(posts, list):
            print(f"   📊 Found {len(posts)} blog posts")
            
            # Test get specific blog post if available
            if posts and len(posts) > 0:
                first_post = posts[0]
                if isinstance(first_post, dict) and 'slug' in first_post:
                    self.run_test(
                        f"Get Blog Post Detail ({first_post['slug']})", 
                        "GET", 
                        f"blog/{first_post['slug']}", 
                        200
                    )
        
        # Test get non-existent blog post
        self.run_test("Get Non-existent Blog Post", "GET", "blog/non-existent-post", 404)

    def test_blog_categories_endpoint(self):
        """Test blog categories endpoint"""
        print("\n" + "="*50)
        print("TESTING BLOG CATEGORIES ENDPOINT")
        print("="*50)
        
        success, categories = self.run_test("Get Blog Categories", "GET", "blog-categories", 200)
        
        if success and isinstance(categories, list):
            print(f"   📊 Found {len(categories)} blog categories")
            expected_categories = ["kultur", "rezept-tipps", "zutaten", "feste", "reisen"]
            found_categories = [c.get('id', '') for c in categories if isinstance(c, dict)]
            
            for expected in expected_categories:
                if expected in found_categories:
                    print(f"   ✅ Found expected blog category: {expected}")
                else:
                    print(f"   ⚠️  Missing expected blog category: {expected}")

    def test_upload_endpoint(self):
        """Test file upload endpoint (requires authentication)"""
        if not self.token:
            print("\n⚠️  Skipping upload tests - no authentication token")
            return
            
        print("\n" + "="*50)
        print("TESTING UPLOAD ENDPOINT")
        print("="*50)
        
        # Test upload endpoint without file (should fail)
        self.run_test("Upload Without File", "POST", "upload", 422, auth_required=True)

    def test_page_endpoints(self):
        """Test static page endpoints"""
        print("\n" + "="*50)
        print("TESTING STATIC PAGE ENDPOINTS")
        print("="*50)
        
        # Test get all pages
        success, pages = self.run_test("Get All Pages", "GET", "pages", 200)
        
        if success and isinstance(pages, list):
            print(f"   📊 Found {len(pages)} static pages")
        
        # Test specific static pages
        static_pages = [
            "afghanische-esskultur",
            "zutaten-gewuerze", 
            "kuechenhelfer",
            "ueber-uns",
            "impressum",
            "datenschutz"
        ]
        
        for page_slug in static_pages:
            self.run_test(f"Get Page: {page_slug}", "GET", f"pages/{page_slug}", 200)

    def test_category_endpoints(self):
        """Test category endpoints"""
        print("\n" + "="*50)
        print("TESTING CATEGORY ENDPOINTS")
        print("="*50)
        
        success, categories = self.run_test("Get Categories", "GET", "categories", 200)
        
        if success and isinstance(categories, list):
            print(f"   📊 Found {len(categories)} categories")
            expected_categories = ["hauptgerichte", "vorspeisen", "beilagen", "suppen", "desserts", "getraenke"]
            found_categories = [c.get('id', '') for c in categories if isinstance(c, dict)]
            
            for expected in expected_categories:
                if expected in found_categories:
                    print(f"   ✅ Found expected category: {expected}")
                else:
                    print(f"   ⚠️  Missing expected category: {expected}")

    def test_sitemap_endpoint(self):
        """Test sitemap endpoint"""
        print("\n" + "="*50)
        print("TESTING SITEMAP ENDPOINT")
        print("="*50)
        
        success, sitemap = self.run_test("Get Sitemap", "GET", "sitemap", 200)
        
        if success and isinstance(sitemap, dict):
            print(f"   📊 Sitemap contains:")
            if 'static_pages' in sitemap:
                print(f"      - {len(sitemap['static_pages'])} static pages")
            if 'recipes' in sitemap:
                print(f"      - {len(sitemap['recipes'])} recipe pages")
            if 'blog_posts' in sitemap:
                print(f"      - {len(sitemap['blog_posts'])} blog posts")

    def test_admin_operations(self):
        """Test admin-only operations (if authenticated)"""
        if not self.token:
            print("\n⚠️  Skipping admin tests - no authentication token")
            return
            
        print("\n" + "="*50)
        print("TESTING ADMIN OPERATIONS")
        print("="*50)
        
        # Test creating a new recipe (admin only)
        test_recipe = {
            "title": "Test Rezept",
            "slug": "test-rezept-" + str(int(datetime.now().timestamp())),
            "description": "Ein Test-Rezept für die API",
            "image_url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800",
            "category": "hauptgerichte",
            "difficulty": "Einfach",
            "prep_time": "15 Minuten",
            "cook_time": "30 Minuten",
            "servings": 4,
            "ingredients": [
                {"name": "Reis", "amount": "2 Tassen"},
                {"name": "Wasser", "amount": "4 Tassen"}
            ],
            "instructions": [
                "Reis waschen",
                "Wasser zum Kochen bringen",
                "Reis hinzufügen und kochen"
            ],
            "tips": "Reis vor dem Kochen einweichen",
            "tags": ["test", "einfach"]
        }
        
        success, created_recipe = self.run_test(
            "Create Test Recipe", 
            "POST", 
            "recipes", 
            201, 
            data=test_recipe, 
            auth_required=True
        )
        
        if success and isinstance(created_recipe, dict) and 'id' in created_recipe:
            recipe_id = created_recipe['id']
            print(f"   ✅ Created recipe with ID: {recipe_id}")
            
            # Test updating the recipe
            updated_recipe = test_recipe.copy()
            updated_recipe['title'] = "Updated Test Rezept"
            
            self.run_test(
                "Update Test Recipe", 
                "PUT", 
                f"recipes/{recipe_id}", 
                200, 
                data=updated_recipe, 
                auth_required=True
            )
            
            # Test deleting the recipe
            self.run_test(
                "Delete Test Recipe", 
                "DELETE", 
                f"recipes/{recipe_id}", 
                200, 
                auth_required=True
            )

        # Test Blog CRUD operations (NEW FUNCTIONALITY)
        print("\n   🆕 TESTING BLOG CRUD OPERATIONS")
        
        # Test creating a new blog post
        test_blog_post = {
            "title": "Test Blog Artikel",
            "slug": "test-blog-artikel-" + str(int(datetime.now().timestamp())),
            "excerpt": "Dies ist ein Test-Artikel für die Blog-Funktionalität",
            "content": "# Test Artikel\n\nDies ist der Inhalt des Test-Artikels.\n\n## Abschnitt 1\n\nHier steht mehr Text.",
            "image_url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800",
            "category": "kultur",
            "meta_title": "Test Blog Artikel | AfghanFood.de",
            "meta_description": "Ein Test-Artikel für die Blog-Funktionalität der AfghanFood.de Website",
            "tags": ["test", "blog", "funktionalität"]
        }
        
        success, created_post = self.run_test(
            "Create Test Blog Post", 
            "POST", 
            "blog", 
            201, 
            data=test_blog_post, 
            auth_required=True
        )
        
        if success and isinstance(created_post, dict) and 'id' in created_post:
            post_id = created_post['id']
            print(f"   ✅ Created blog post with ID: {post_id}")
            
            # Verify meta fields were auto-generated if not provided
            if 'meta_title' in created_post:
                print(f"   ✅ Meta title: {created_post['meta_title']}")
            if 'meta_description' in created_post:
                print(f"   ✅ Meta description: {created_post['meta_description'][:50]}...")
            
            # Test updating the blog post
            updated_post = test_blog_post.copy()
            updated_post['title'] = "Updated Test Blog Artikel"
            updated_post['meta_title'] = "Updated Test Blog Artikel | AfghanFood.de"
            
            self.run_test(
                "Update Test Blog Post", 
                "PUT", 
                f"blog/{post_id}", 
                200, 
                data=updated_post, 
                auth_required=True
            )
            
            # Test deleting the blog post
            self.run_test(
                "Delete Test Blog Post", 
                "DELETE", 
                f"blog/{post_id}", 
                200, 
                auth_required=True
            )
        
        # Test blog post creation without meta fields (should auto-generate)
        test_blog_minimal = {
            "title": "Minimal Test Artikel",
            "slug": "minimal-test-artikel-" + str(int(datetime.now().timestamp())),
            "excerpt": "Minimaler Test ohne Meta-Felder",
            "content": "Einfacher Inhalt ohne Meta-Felder",
            "image_url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800",
            "category": "rezept-tipps",
            "tags": ["minimal", "test"]
        }
        
        success, minimal_post = self.run_test(
            "Create Blog Post (Auto Meta Fields)", 
            "POST", 
            "blog", 
            201, 
            data=test_blog_minimal, 
            auth_required=True
        )
        
        if success and isinstance(minimal_post, dict) and 'id' in minimal_post:
            post_id = minimal_post['id']
            print(f"   ✅ Auto-generated meta_title: {minimal_post.get('meta_title', 'N/A')}")
            print(f"   ✅ Auto-generated meta_description: {minimal_post.get('meta_description', 'N/A')}")
            
            # Clean up
            self.run_test(
                "Delete Minimal Test Blog Post", 
                "DELETE", 
                f"blog/{post_id}", 
                200, 
                auth_required=True
            )

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting AfghanFood.de API Testing Suite")
        print(f"📍 Testing against: {self.base_url}")
        print("="*70)
        
        # Run all test suites
        self.test_health_endpoints()
        self.test_auth_endpoints()
        self.test_recipe_endpoints()
        self.test_blog_endpoints()
        self.test_page_endpoints()
        self.test_category_endpoints()
        self.test_sitemap_endpoint()
        self.test_admin_operations()
        
        # Print final results
        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*70)
        print("📊 TEST SUMMARY")
        print("="*70)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for failure in self.failed_tests:
                print(f"   - {failure['test']}: {failure['details']}")
        
        if self.passed_tests:
            print(f"\n✅ PASSED TESTS ({len(self.passed_tests)}):")
            for test in self.passed_tests:
                print(f"   - {test}")
        
        return len(self.failed_tests) == 0

def main():
    """Main test runner"""
    tester = AfghanFoodAPITester()
    success = tester.run_all_tests()
    
    # Save results to JSON for reporting
    results = {
        "timestamp": datetime.now().isoformat(),
        "total_tests": tester.tests_run,
        "passed_tests": tester.tests_passed,
        "failed_tests": len(tester.failed_tests),
        "success_rate": (tester.tests_passed/tester.tests_run*100) if tester.tests_run > 0 else 0,
        "failures": tester.failed_tests,
        "passed": tester.passed_tests
    }
    
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Results saved to: /app/backend_test_results.json")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())