#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  ORIA FRESH E-Commerce Food Ordering Platform - QR Marketing & Bonus System Implementation
  Complete the QR Bonus feature that automatically applies a bonus (e.g., "Free Extra Sauce") 
  to orders placed via QR code. Includes admin controls to enable/disable and configure the bonus.
  Also fix Cookie Banner overlap issue and incorrect product images.

backend:
  - task: "QR Bonus Order Application"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "Implemented QR bonus logic in create_order endpoint. When source='qr' and qr_bonus.enabled=true in settings, bonus is automatically applied to order. Tested via curl - Order ID 6aab6929 shows qr_bonus_applied with name, value, and type."

  - task: "QR Bonus Dashboard Stats"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "Added qr_bonus_orders_today count to admin dashboard endpoint. Counts orders where qr_bonus_applied is not null."

  - task: "Settings QR Bonus Persistence"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "QRBonus model already existed. Added logic to ensure qr_bonus is always present in settings response. Admin can update via PUT /api/admin/settings."

frontend:
  - task: "Admin QR Bonus Settings UI"
    implemented: true
    working: true
    file: "/app/frontend/src/pages/admin/AdminSettingsPage.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "Added QR-Bonus System card with toggle switch, bonus type dropdown (extra_sauce, free_drink, discount_10), bonus name input, value input, and preview. Purple-themed design with Gift icon."

  - task: "Admin Dashboard QR Bonus Stats"
    implemented: true
    working: true
    file: "/app/frontend/src/pages/admin/AdminDashboardPage.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "Added 'QR-Bonus vergeben' stat card showing qr_bonus_orders_today count. Uses pink color scheme with Gift icon."

  - task: "Admin Orders QR BONUS Label"
    implemented: true
    working: true
    file: "/app/frontend/src/pages/admin/AdminOrdersPage.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "Added green 'BONUS' badge next to 'QR' badge for orders with qr_bonus_applied. Also added purple QR-Bonus section in order detail dialog showing bonus name and value."

  - task: "QR Checkout Bonus Banner"
    implemented: true
    working: true
    file: "/app/frontend/src/pages/QRCheckoutPage.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "Added purple gradient banner at top of checkout showing the active bonus. Displays bonus name with Gift and Sparkles icons. Only shown when qr_bonus is enabled in settings."

  - task: "Cookie Banner Overlap Fix"
    implemented: true
    working: true
    file: "/app/frontend/src/components/CookieBanner.js"
    stuck_count: 0
    priority: "low"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "Fixed banner positioning. Added detection for QR pages with higher bottom offset (bottom-36) to avoid overlap with fixed order button. Reduced padding and text size for more compact appearance. Updated z-index to 60."

  - task: "Product Images Fix"
    implemented: true
    working: true
    file: "Database update via script"
    stuck_count: 0
    priority: "low"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Updated 15 products in MongoDB with correct Unsplash food images. Burger, fries, salad, drinks all now show appropriate images."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: true

test_plan:
  current_focus:
    - "QR Bonus Order Application"
    - "Admin QR Bonus Settings UI"
    - "QR Checkout Bonus Banner"
    - "Admin Orders QR BONUS Label"
  stuck_tasks: []
  test_all: true
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Implemented complete QR Marketing & Bonus System:
      
      BACKEND CHANGES:
      1. Modified /api/orders POST to apply bonus when source='qr' and bonus is enabled
      2. Added qr_bonus_orders_today stat to /api/admin/dashboard
      3. QRBonus model and settings persistence working
      
      FRONTEND CHANGES:
      1. AdminSettingsPage: New QR-Bonus System card with toggle, type selection, name/value inputs
      2. AdminDashboardPage: New 'QR-Bonus vergeben' stat card
      3. AdminOrdersPage: BONUS label badge + QR-Bonus section in order details
      4. QRCheckoutPage: Bonus banner showing active bonus to customer
      5. CookieBanner: Fixed overlap issue with better positioning
      
      DATABASE UPDATES:
      1. Updated qr_bonus field in settings collection
      2. Fixed product images with correct food URLs
      
      TEST CREDENTIALS:
      - Admin: admin@oriafresh.de / admin123
      
      TEST SCENARIOS:
      1. Create QR order (source='qr') and verify qr_bonus_applied is set
      2. Check dashboard shows QR-Bonus vergeben count
      3. Verify orders page shows QR + BONUS labels
      4. Test settings page - toggle bonus, change type, save
      5. Verify QR checkout shows bonus banner when enabled
