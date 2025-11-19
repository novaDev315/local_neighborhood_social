# Manual Testing Guide & User Documentation

**Project:** Local Neighborhood Social Network
**Version:** 1.0.0 MVP
**Date:** November 19, 2025
**Status:** Production Ready

---

## Table of Contents

1. [Setup & Environment](#setup--environment)
2. [Feature Overview](#feature-overview)
3. [User Roles & Personas](#user-roles--personas)
4. [Manual Test Cases](#manual-test-cases)
5. [Use Case Scenarios](#use-case-scenarios)
6. [API Testing Guide](#api-testing-guide)
7. [Bug Reporting Template](#bug-reporting-template)

---

## Setup & Environment

### Prerequisites Checklist

- [ ] Docker and Docker Compose installed
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Web browser (Chrome, Firefox, Safari, or Edge)
- [ ] Postman or similar API testing tool (optional)

### Initial Setup

1. **Clone and Start the Application**
   ```bash
   # Navigate to project directory
   cd local_neighborhood_social

   # Start development environment
   docker-compose up -d

   # Wait for services to be ready (30-60 seconds)
   docker-compose ps
   ```

2. **Verify Services Running**
   - [ ] PostgreSQL: `localhost:5432`
   - [ ] Redis: `localhost:6379`
   - [ ] Backend API: `http://localhost:3001`
   - [ ] Frontend: `http://localhost:3000`
   - [ ] API Docs: `http://localhost:3001/api`

3. **Create Test Data**
   - Create at least 3 test user accounts
   - Use different email addresses
   - Use different neighborhood addresses

---

## Feature Overview

### 1. Address Verification System

**Purpose:** Verify users actually live in their claimed neighborhood
**Key Features:**
- 4 verification methods: Postcard, Utility Bill, Property Records, Lease
- Manual admin approval
- Verification status tracking

**How It Works:**
1. User registers with their home address
2. System determines which neighborhood they belong to
3. User selects verification method
4. System processes verification
5. User gains "Verified" status

### 2. Community Feed & Posts

**Purpose:** Share updates, photos, and information with neighbors
**Key Features:**
- Rich text and image posts
- 4 reaction types (like, love, helpful, thanks)
- Threaded comments
- Post categories (General, Safety, Events, Recommendations, News)
- Visibility controls (Block, Street, Neighborhood, Public)

**How It Works:**
1. User creates post with category
2. Post appears in neighborhood feed
3. Neighbors can react and comment
4. Pin important posts to top

### 3. Events Calendar

**Purpose:** Organize and attend neighborhood events
**Key Features:**
- Event creation with date/time/location
- RSVP system (Going, Interested, Can't Go)
- Recurring events
- Max attendees limit
- Event reminders

**How It Works:**
1. User creates event with details
2. Event appears in calendar
3. Neighbors RSVP
4. Organizer tracks attendance
5. System sends reminders

### 4. Safety Alerts System

**Purpose:** Share real-time safety information
**Key Features:**
- Alert types (Crime, Fire, Weather, Traffic, Utility, Health)
- Severity levels (Low, Medium, High, Critical)
- Authority verification
- Geographic targeting
- Auto-expiration
- Update threads

**How It Works:**
1. User creates safety alert
2. Alert broadcasts to nearby residents
3. System displays with appropriate severity
4. Updates can be added
5. Alert resolves or expires

### 5. Local Marketplace

**Purpose:** Buy, sell, and trade items with neighbors
**Key Features:**
- Item listings with photos
- Categories (For Sale, Free, Services, Wanted)
- Condition tracking
- Price display
- Geographic proximity search
- Save/favorite items
- Mark as sold

**How It Works:**
1. User lists item with photos and price
2. Item appears in marketplace
3. Interested buyers contact seller
4. Transaction occurs offline
5. Seller marks item as sold

### 6. Business Directory

**Purpose:** Discover and review local businesses
**Key Features:**
- Business profiles
- Categories (Restaurant, Retail, Services, Healthcare, etc.)
- Reviews and ratings
- Verified business badges
- Contact information
- Hours of operation
- Claim business

**How It Works:**
1. Business creates profile (or user creates listing)
2. Business appears in directory
3. Customers leave reviews
4. Business can claim and manage profile
5. Ratings aggregate automatically

### 7. Groups & Communities

**Purpose:** Connect with neighbors who share interests
**Key Features:**
- Create/join groups
- Privacy levels (Public, Private, Secret)
- Member roles (Admin, Moderator, Member)
- Group-specific feeds
- Member management

**How It Works:**
1. User creates group with topic
2. Sets privacy level
3. Invites or approves members
4. Members post in group feed
5. Admins moderate content

### 8. Neighbor Directory & Profiles

**Purpose:** Connect with specific neighbors
**Key Features:**
- User profiles with photos
- Bio and interests
- Contact information
- Privacy controls
- Verification badges
- Notification preferences

**How It Works:**
1. User completes profile
2. Sets privacy preferences
3. Profile appears in directory
4. Neighbors can view and connect
5. Direct messaging (future feature)

---

## User Roles & Personas

### Test User Personas

Create these test accounts for comprehensive testing:

#### 1. Sarah - Community Builder (Primary User)
- **Email:** sarah.builder@test.com
- **Address:** 123 Main Street, City, State 12345
- **Role:** Active resident, event organizer
- **Use Cases:**
  - Create events
  - Post frequently
  - Join multiple groups
  - Leave reviews

#### 2. Michael - Safety Conscious (Primary User)
- **Email:** michael.safety@test.com
- **Address:** 456 Oak Avenue, City, State 12345
- **Role:** Homeowner, security focused
- **Use Cases:**
  - Create safety alerts
  - Monitor alerts daily
  - Report suspicious activity
  - Join safety groups

#### 3. Lisa - Business Owner (Secondary User)
- **Email:** lisa.business@test.com
- **Address:** 789 Elm Street, City, State 12345
- **Role:** Local business owner
- **Use Cases:**
  - Create business profile
  - Post promotions
  - Respond to reviews
  - Join business groups

---

## Manual Test Cases

### Test Case Template
```
TC-XXX: Test Case Title
Priority: [Critical/High/Medium/Low]
Module: [Feature Name]
Prerequisites: [Required setup]

Steps:
1. Step one
2. Step two
3. Step three

Expected Result:
- What should happen

Actual Result:
- What actually happened

Status: [Pass/Fail/Blocked]
Notes: [Additional observations]
```

---

### Authentication & Registration Tests

#### TC-001: User Registration - Happy Path
**Priority:** Critical
**Module:** Authentication

**Prerequisites:**
- Application is running
- No existing account with test email

**Steps:**
1. Navigate to `http://localhost:3000/auth/register`
2. Fill in registration form:
   - Name: "Sarah Builder"
   - Email: "sarah.builder@test.com"
   - Password: "SecurePass123!"
   - Confirm Password: "SecurePass123!"
   - Address: "123 Main Street, City, State 12345"
   - Phone: "+1 (555) 123-4567"
3. Check "I agree to Terms of Service" checkbox
4. Click "Create account" button

**Expected Result:**
- [ ] Form validation passes
- [ ] Loading spinner appears
- [ ] User is redirected to `/dashboard`
- [ ] Welcome message displays user's name
- [ ] Address verification status shows "Not Verified"

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

#### TC-002: User Login - Valid Credentials
**Priority:** Critical
**Module:** Authentication

**Prerequisites:**
- Account exists (use account from TC-001)

**Steps:**
1. Navigate to `http://localhost:3000/auth/login`
2. Enter email: "sarah.builder@test.com"
3. Enter password: "SecurePass123!"
4. Click "Sign in" button

**Expected Result:**
- [ ] Login successful
- [ ] Redirected to `/dashboard`
- [ ] User name appears in header
- [ ] Notification bell icon visible

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

#### TC-003: User Login - Invalid Credentials
**Priority:** High
**Module:** Authentication

**Steps:**
1. Navigate to `http://localhost:3000/auth/login`
2. Enter email: "sarah.builder@test.com"
3. Enter password: "WrongPassword123!"
4. Click "Sign in" button

**Expected Result:**
- [ ] Error message displays: "Invalid email or password"
- [ ] User stays on login page
- [ ] Form clears password field
- [ ] No redirect occurs

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

#### TC-004: Registration - Email Already Exists
**Priority:** High
**Module:** Authentication

**Steps:**
1. Navigate to `/auth/register`
2. Use same email from TC-001
3. Fill other fields with valid data
4. Submit form

**Expected Result:**
- [ ] Error message: "Email already exists"
- [ ] User stays on registration page
- [ ] Can modify email and retry

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

#### TC-005: Registration - Password Validation
**Priority:** Medium
**Module:** Authentication

**Steps:**
1. Navigate to `/auth/register`
2. Enter password: "short"
3. Enter confirm password: "short"
4. Try to submit

**Expected Result:**
- [ ] Error displays: "Password must be at least 8 characters"
- [ ] Submit button disabled or validation prevents submit

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### Address Verification Tests

#### TC-006: Address Verification - Postcard Method
**Priority:** High
**Module:** Address Verification

**Prerequisites:**
- User logged in
- Address not yet verified

**Steps:**
1. Navigate to `/profile`
2. Click on "Verify Address" or similar button
3. Select "Postcard Verification"
4. Click "Send Postcard"
5. Check console/logs for verification code
6. Enter the code
7. Submit

**Expected Result:**
- [ ] Postcard sent confirmation appears
- [ ] Verification code generated (check backend logs)
- [ ] Code entry form displays
- [ ] Correct code marks address as verified
- [ ] "✓ Address Verified" badge appears on profile

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### Community Feed & Posts Tests

#### TC-007: Create Post - Text Only
**Priority:** Critical
**Module:** Posts

**Prerequisites:**
- User logged in

**Steps:**
1. Go to `/dashboard`
2. Click "Create Post" button
3. Enter title: "Welcome to the neighborhood!"
4. Enter content: "Hi everyone, just moved in. Looking forward to meeting you all!"
5. Select category: "General"
6. Select visibility: "Neighborhood"
7. Click "Post" button

**Expected Result:**
- [ ] Post appears at top of feed
- [ ] Post shows author name
- [ ] Post shows timestamp
- [ ] Category badge displays "General"
- [ ] Reaction buttons visible (👍 ❤️ 🙏 ✓)
- [ ] Comment button visible

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

#### TC-008: React to Post
**Priority:** High
**Module:** Posts

**Prerequisites:**
- At least one post exists in feed

**Steps:**
1. Go to `/dashboard`
2. Click 👍 (like) button on a post
3. Observe reaction count
4. Click same button again
5. Try different reaction button

**Expected Result:**
- [ ] Like count increases by 1
- [ ] Button highlights/changes color
- [ ] Clicking again removes reaction
- [ ] Count decreases by 1
- [ ] Can switch to different reaction type
- [ ] Only one reaction type active at a time

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

#### TC-009: Comment on Post
**Priority:** High
**Module:** Posts

**Prerequisites:**
- At least one post exists

**Steps:**
1. Go to `/dashboard`
2. Click comment button/icon on a post
3. Enter comment: "Great to have you here!"
4. Submit comment
5. Verify comment appears

**Expected Result:**
- [ ] Comment form appears
- [ ] Comment submits successfully
- [ ] Comment appears under post
- [ ] Comment shows author name
- [ ] Comment shows timestamp
- [ ] Comment count increases

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### Events Calendar Tests

#### TC-010: Create Event
**Priority:** Critical
**Module:** Events

**Prerequisites:**
- User logged in

**Steps:**
1. Navigate to `/events`
2. Click "Create Event" button
3. Fill in form:
   - Title: "Neighborhood BBQ"
   - Description: "Join us for a fun summer BBQ!"
   - Start Date: [Tomorrow's date]
   - Start Time: "18:00"
   - End Time: "21:00"
   - Location: "Community Park"
   - Max Attendees: "50"
4. Click "Create Event"

**Expected Result:**
- [ ] Event creation successful
- [ ] Redirected to event details or events list
- [ ] Event appears in events grid
- [ ] Event shows correct date and time
- [ ] "0 attending" displays initially
- [ ] "RSVP" button visible

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

#### TC-011: RSVP to Event
**Priority:** High
**Module:** Events

**Prerequisites:**
- At least one event exists
- User logged in

**Steps:**
1. Go to `/events`
2. Click on an event card
3. Click "RSVP" or "Going" button
4. Confirm RSVP

**Expected Result:**
- [ ] RSVP status updates to "Going"
- [ ] Attendee count increases by 1
- [ ] User's name appears in attendee list
- [ ] Button changes to "Cancel RSVP" or similar

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

#### TC-012: View Upcoming Events
**Priority:** Medium
**Module:** Events

**Steps:**
1. Go to `/dashboard`
2. Check "Upcoming Events" widget in sidebar
3. Click "See all" link
4. Verify on `/events` page

**Expected Result:**
- [ ] Widget shows up to 3 upcoming events
- [ ] Events sorted by date (soonest first)
- [ ] Each event shows date, location, title
- [ ] "See all" link navigates to `/events`
- [ ] Full events page shows all upcoming events

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### Safety Alerts Tests

#### TC-013: Create Safety Alert
**Priority:** Critical
**Module:** Safety Alerts

**Prerequisites:**
- User logged in

**Steps:**
1. Navigate to `/safety`
2. Click "Report Alert" button
3. Fill in form:
   - Title: "Suspicious Vehicle"
   - Description: "White van driving slowly through neighborhood"
   - Type: "Crime"
   - Severity: "Medium"
   - Location: "Main Street and Oak Avenue"
4. Submit alert

**Expected Result:**
- [ ] Alert created successfully
- [ ] Alert appears in safety alerts list
- [ ] Alert shows "ACTIVE" status
- [ ] Severity displays with correct color (Medium = Yellow)
- [ ] Alert type icon shows 🚔 (Crime)
- [ ] Reporter name shows current user
- [ ] Timestamp shows current time

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

#### TC-014: View Safety Alerts - Auto Refresh
**Priority:** High
**Module:** Safety Alerts

**Prerequisites:**
- At least one active alert exists

**Steps:**
1. Navigate to `/safety`
2. Note current alert count
3. In another browser/tab, create new alert (TC-013)
4. Wait 30 seconds on original page
5. Observe if new alert appears

**Expected Result:**
- [ ] Page shows "Automatically refreshes every 30 seconds"
- [ ] After 30 seconds, new alert appears without manual refresh
- [ ] Alert count updates
- [ ] No page reload/flicker

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

#### TC-015: Safety Alert Severity Display
**Priority:** Medium
**Module:** Safety Alerts

**Steps:**
1. Create alerts with different severities:
   - Low severity alert
   - Medium severity alert
   - High severity alert
   - Critical severity alert
2. View all on `/safety` page

**Expected Result:**
- [ ] Low: Blue background, ℹ️ icon
- [ ] Medium: Yellow background, ⚠️ icon
- [ ] High: Orange background, 🚨 icon
- [ ] Critical: Red background, 🆘 icon
- [ ] Each has appropriate color coding
- [ ] Severity badge displays clearly

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### Marketplace Tests

#### TC-016: Create Marketplace Listing
**Priority:** Critical
**Module:** Marketplace

**Prerequisites:**
- User logged in

**Steps:**
1. Navigate to `/marketplace`
2. Click "List Item" button
3. Fill in form:
   - Title: "Barely Used Bicycle"
   - Description: "Great condition, perfect for neighborhood rides"
   - Price: "150"
   - Category: "FOR_SALE"
   - Condition: "LIKE_NEW"
4. Upload image (if available)
5. Submit listing

**Expected Result:**
- [ ] Listing created successfully
- [ ] Item appears in marketplace grid
- [ ] Price displays as "$150.00"
- [ ] Condition shows "LIKE_NEW"
- [ ] Category badge visible
- [ ] Seller name shows current user
- [ ] "View Details" button present

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

#### TC-017: Filter Marketplace by Category
**Priority:** High
**Module:** Marketplace

**Prerequisites:**
- Multiple items exist with different categories

**Steps:**
1. Go to `/marketplace`
2. Click "FREE" category button
3. Observe items shown
4. Click "FOR_SALE" category button
5. Observe items shown
6. Click "All Items" button

**Expected Result:**
- [ ] FREE filter shows only free items (price = $0)
- [ ] Free items have "FREE" badge
- [ ] FOR_SALE filter shows only for-sale items
- [ ] All Items shows all categories
- [ ] Active filter button highlighted

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

#### TC-018: Mark Item as Sold
**Priority:** High
**Module:** Marketplace

**Prerequisites:**
- User has created at least one listing

**Steps:**
1. Go to `/marketplace`
2. Click on user's own listing
3. Click "Mark as Sold" button
4. Confirm action

**Expected Result:**
- [ ] Item status changes to "SOLD"
- [ ] "SOLD" badge appears on item card
- [ ] Item grayed out or visually distinct
- [ ] "View Details" button shows "Sold" state

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### Business Directory Tests

#### TC-019: Create Business Profile
**Priority:** Critical
**Module:** Businesses

**Prerequisites:**
- User logged in

**Steps:**
1. Navigate to `/businesses`
2. Click "Claim Your Business" button
3. Fill in form:
   - Name: "Joe's Coffee Shop"
   - Description: "Best coffee in the neighborhood!"
   - Category: "RESTAURANT"
   - Address: "123 Main St"
   - Phone: "(555) 123-4567"
   - Email: "joe@coffeeshop.com"
   - Website: "https://joescoffee.com"
4. Submit

**Expected Result:**
- [ ] Business profile created
- [ ] Appears in business directory
- [ ] Category shows "RESTAURANT"
- [ ] Contact info displays correctly
- [ ] 0 reviews initially
- [ ] No verified badge (unless verified)

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

#### TC-020: Leave Business Review
**Priority:** High
**Module:** Businesses

**Prerequisites:**
- At least one business exists

**Steps:**
1. Go to `/businesses`
2. Click on a business
3. Click "Leave Review" or similar
4. Fill in review:
   - Rating: 5 stars
   - Title: "Excellent Service!"
   - Content: "Great coffee and friendly staff"
5. Submit review

**Expected Result:**
- [ ] Review submits successfully
- [ ] Review appears on business page
- [ ] Rating contributes to average
- [ ] Average rating updates
- [ ] Review count increases by 1
- [ ] Reviewer name displays

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

#### TC-021: Filter Businesses by Category
**Priority:** Medium
**Module:** Businesses

**Steps:**
1. Go to `/businesses`
2. Click "RESTAURANT" category
3. Verify only restaurants show
4. Click "RETAIL" category
5. Click "All" category

**Expected Result:**
- [ ] RESTAURANT filter shows only restaurants
- [ ] RETAIL filter shows only retail businesses
- [ ] All shows all categories
- [ ] Filter button highlights when active

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### Groups & Communities Tests

#### TC-022: Create Group
**Priority:** Critical
**Module:** Groups

**Prerequisites:**
- User logged in

**Steps:**
1. Navigate to `/groups`
2. Click "Create Group" button
3. Fill in form:
   - Name: "Book Club"
   - Description: "Monthly book discussions for neighbors"
   - Privacy: "PUBLIC"
   - Category: "HOBBY"
4. Submit

**Expected Result:**
- [ ] Group created successfully
- [ ] Group appears in groups list
- [ ] Privacy shows "PUBLIC" badge
- [ ] Member count shows "1" (creator)
- [ ] Creator shown as group creator
- [ ] 🌐 icon for public group

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

#### TC-023: Join Group
**Priority:** High
**Module:** Groups

**Prerequisites:**
- At least one public group exists
- User not already member

**Steps:**
1. Go to `/groups`
2. Click on a public group
3. Click "Join Group" button
4. Confirm joining

**Expected Result:**
- [ ] User joins group successfully
- [ ] Member count increases by 1
- [ ] Group appears in "My Groups" section
- [ ] Button changes to "Leave Group"

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

#### TC-024: Filter Groups by Privacy
**Priority:** Medium
**Module:** Groups

**Steps:**
1. Go to `/groups`
2. Click "Public" filter
3. Verify only public groups show
4. Click "Private" filter
5. Click "All Groups"

**Expected Result:**
- [ ] Public filter shows only public groups
- [ ] Private filter shows only private groups
- [ ] All Groups shows all visible groups
- [ ] Filter button highlights when active

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### Profile & Settings Tests

#### TC-025: Update Profile Information
**Priority:** High
**Module:** Profile

**Prerequisites:**
- User logged in

**Steps:**
1. Navigate to `/profile`
2. Click "Edit Profile" button
3. Update fields:
   - Name: "Sarah M. Builder"
   - Phone: "+1 (555) 987-6543"
   - Bio: "Community organizer and gardening enthusiast"
4. Click "Save Changes"

**Expected Result:**
- [ ] Changes save successfully
- [ ] Success message appears
- [ ] Profile exits edit mode
- [ ] Updated information displays
- [ ] Changes persist on page reload

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

#### TC-026: Privacy Settings
**Priority:** High
**Module:** Profile

**Steps:**
1. Go to `/profile`
2. Scroll to "Privacy Settings" section
3. Toggle "Show email address" checkbox
4. Toggle "Show phone number" checkbox
5. Save or observe auto-save

**Expected Result:**
- [ ] Toggles respond to clicks
- [ ] Settings save (auto-save or manual)
- [ ] Privacy settings persist
- [ ] Public profile respects settings

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

#### TC-027: Notification Preferences
**Priority:** Medium
**Module:** Profile

**Steps:**
1. Go to `/profile`
2. Scroll to "Notification Preferences"
3. Toggle various notification types
4. Save settings

**Expected Result:**
- [ ] All toggles functional
- [ ] Settings save successfully
- [ ] Preferences persist on reload
- [ ] Future notifications respect settings

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

### Navigation & UI Tests

#### TC-028: Dashboard Navigation
**Priority:** Medium
**Module:** Navigation

**Prerequisites:**
- User logged in

**Steps:**
1. From `/dashboard`, click each navigation link:
   - Events link (sidebar)
   - Marketplace link (sidebar)
   - Groups link (sidebar)
   - Businesses link (sidebar)
   - Safety Alerts link (sidebar)
2. Verify each page loads

**Expected Result:**
- [ ] All links functional
- [ ] Pages load without errors
- [ ] Navigation persists across pages
- [ ] Active page highlighted in nav

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

#### TC-029: Protected Routes
**Priority:** Critical
**Module:** Authentication

**Steps:**
1. Log out (or use incognito window)
2. Try to access `/dashboard` directly
3. Try to access `/events` directly
4. Try to access `/profile` directly

**Expected Result:**
- [ ] All protected pages redirect to `/auth/login`
- [ ] No protected content visible
- [ ] After login, redirects to originally requested page

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

#### TC-030: Logout Functionality
**Priority:** High
**Module:** Authentication

**Steps:**
1. While logged in on `/dashboard`
2. Click "Logout" button in header
3. Verify logout behavior

**Expected Result:**
- [ ] User logged out successfully
- [ ] Redirected to landing page `/`
- [ ] Auth token cleared
- [ ] Cannot access protected pages
- [ ] Must login again to access dashboard

**Actual Result:** ___________

**Status:** [ ] Pass [ ] Fail [ ] Blocked

---

## Use Case Scenarios

### Scenario 1: New Resident Onboarding

**Persona:** Sarah - Just moved into the neighborhood

**Goal:** Get connected with the neighborhood community

**Steps:**
1. **Register Account**
   - Navigate to `/auth/register`
   - Create account with home address
   - Verify email (if implemented)

2. **Verify Address**
   - Go to profile
   - Initiate postcard verification
   - Wait for postcard (or use test code)
   - Enter verification code
   - Achieve "Verified" status

3. **Complete Profile**
   - Add profile photo
   - Write bio: "New to the neighborhood, love gardening and hiking!"
   - Add contact preferences
   - Set privacy settings

4. **Explore Community**
   - Browse community feed
   - Read recent posts
   - React to welcome posts
   - Leave introduction comment

5. **Join Groups**
   - Navigate to `/groups`
   - Browse available groups
   - Join "Gardening Club"
   - Join "Hiking Group"

6. **Attend First Event**
   - View `/events`
   - Find "Welcome New Neighbors" event
   - RSVP as "Going"
   - Add to personal calendar

**Success Criteria:**
- [ ] Account created and verified
- [ ] Profile complete with photo and bio
- [ ] Joined at least 2 groups
- [ ] RSVP'd to at least 1 event
- [ ] Made first post or comment

---

### Scenario 2: Organizing a Block Party

**Persona:** Sarah - Community organizer

**Goal:** Plan and execute a neighborhood block party

**Steps:**
1. **Create Event**
   - Navigate to `/events`
   - Click "Create Event"
   - Fill details:
     - Title: "Annual Summer Block Party"
     - Date: [3 weeks from now]
     - Time: 2:00 PM - 7:00 PM
     - Location: "Main Street (closed section)"
     - Max attendees: 100
   - Add description with activities planned

2. **Announce Event**
   - Create post in `/dashboard`
   - Category: "Events"
   - Content: Details about block party
   - Include event link
   - Pin post to top of feed

3. **Coordinate Volunteers**
   - Create group: "Block Party Planning Committee"
   - Set privacy: Private
   - Invite key volunteers
   - Post planning updates in group

4. **Track RSVPs**
   - Monitor event attendees
   - Check RSVP count regularly
   - Send reminders as date approaches

5. **Day-of Updates**
   - Post updates about setup
   - Share photos during event
   - Thank participants after

**Success Criteria:**
- [ ] Event created with all details
- [ ] Announcement post visible and pinned
- [ ] Planning group active with members
- [ ] At least 30 RSVPs
- [ ] Event successfully executed

---

### Scenario 3: Reporting a Safety Concern

**Persona:** Michael - Safety-conscious resident

**Goal:** Alert neighbors about suspicious activity

**Steps:**
1. **Observe Incident**
   - Notice suspicious vehicle
   - Note details (time, location, description)

2. **Create Safety Alert**
   - Go to `/safety`
   - Click "Report Alert"
   - Fill in form:
     - Title: "Suspicious Vehicle"
     - Type: "Crime"
     - Severity: "Medium"
     - Description: Detailed account
     - Location: Specific intersection

3. **Monitor Responses**
   - Check for updates from neighbors
   - Add updates if vehicle seen again
   - Coordinate with other residents

4. **Resolution**
   - Mark as resolved when appropriate
   - Post update about outcome
   - Thank community for awareness

**Success Criteria:**
- [ ] Alert created with accurate info
- [ ] Alert visible to nearby neighbors
- [ ] Community responds appropriately
- [ ] Situation resolved
- [ ] Alert marked resolved

---

### Scenario 4: Selling Items on Marketplace

**Persona:** Sarah - Moving to larger home

**Goal:** Sell furniture and items to neighbors

**Steps:**
1. **Create Listings**
   - Navigate to `/marketplace`
   - Create listing for couch:
     - Photos from multiple angles
     - Detailed description
     - Fair price: $200
     - Condition: Good
     - Category: For Sale

2. **Manage Inquiries**
   - Respond to interested buyers
   - Answer questions about items
   - Schedule viewings

3. **Complete Sales**
   - Coordinate pickup time
   - Receive payment
   - Mark item as sold

4. **Give Away Items**
   - Create "Free Stuff" listings
   - List items for free pickup
   - Update quickly as claimed

**Success Criteria:**
- [ ] All items listed with photos
- [ ] Multiple inquiries received
- [ ] Items sold/given away
- [ ] Listings marked as sold
- [ ] Positive experience for buyers

---

### Scenario 5: Running a Local Business

**Persona:** Lisa - Coffee shop owner

**Goal:** Promote business and engage with customers

**Steps:**
1. **Create Business Profile**
   - Navigate to `/businesses`
   - Click "Claim Your Business"
   - Complete profile:
     - Business name and category
     - Contact information
     - Hours of operation
     - Description and photos

2. **Engage Community**
   - Post weekly specials in community feed
   - Share behind-the-scenes content
   - Announce new menu items

3. **Manage Reviews**
   - Monitor new reviews
   - Respond to feedback
   - Address concerns professionally
   - Thank positive reviewers

4. **Host Events**
   - Create "Coffee & Community" event
   - Offer discounts to attendees
   - Build regular customer base

**Success Criteria:**
- [ ] Business profile complete and verified
- [ ] At least 10 positive reviews
- [ ] Regular posts to community
- [ ] Hosted at least 2 events
- [ ] Growing customer base

---

## API Testing Guide

### Using Postman or Similar Tools

#### Setup
1. Import API base URL: `http://localhost:3001/api/v1`
2. View Swagger docs: `http://localhost:3001/api`

#### Authentication Flow

**1. Register User**
```
POST /api/v1/auth/register
Body (JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "SecurePass123!",
  "address": "123 Main St, City, State 12345"
}

Expected Response: 201 Created
{
  "user": {...},
  "access_token": "eyJhbG..."
}
```

**2. Login**
```
POST /api/v1/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "SecurePass123!"
}

Expected Response: 200 OK
{
  "user": {...},
  "access_token": "eyJhbG..."
}
```

**3. Use Token**
```
For all authenticated requests, add header:
Authorization: Bearer eyJhbG...
```

#### Test Endpoints

**Posts**
```
GET /api/v1/posts
GET /api/v1/posts/:id
POST /api/v1/posts
PATCH /api/v1/posts/:id
DELETE /api/v1/posts/:id
POST /api/v1/posts/:id/reactions
POST /api/v1/posts/:id/comments
```

**Events**
```
GET /api/v1/events
GET /api/v1/events/upcoming
POST /api/v1/events
POST /api/v1/events/:id/rsvp
```

**Safety Alerts**
```
GET /api/v1/safety-alerts
GET /api/v1/safety-alerts/active
POST /api/v1/safety-alerts
```

For complete API documentation, visit: `http://localhost:3001/api`

---

## Bug Reporting Template

### Bug Report Format

```
BUG-XXX: [Brief Description]

Severity: [Critical/High/Medium/Low]
Module: [Feature Name]
Environment: [Development/Staging/Production]

Steps to Reproduce:
1.
2.
3.

Expected Behavior:
- What should happen

Actual Behavior:
- What actually happened

Screenshots/Videos:
[Attach if available]

Browser/Device:
- Browser: Chrome 119
- OS: macOS 14
- Screen size: 1920x1080

Console Errors:
[Paste any console errors]

Network Errors:
[Paste any network request failures]

Additional Context:
[Any other relevant information]

Reproducibility:
[ ] Always
[ ] Sometimes
[ ] Rare

Workaround:
[If known]
```

---

## Testing Checklist Summary

### Pre-Launch Testing Checklist

#### Functionality
- [ ] All 8 MVP features functional
- [ ] Authentication works correctly
- [ ] Authorization prevents unauthorized access
- [ ] All forms validate properly
- [ ] All buttons and links work
- [ ] Search and filters work
- [ ] Pagination works (if implemented)

#### User Experience
- [ ] Pages load quickly (< 3 seconds)
- [ ] No broken images
- [ ] Responsive on mobile devices
- [ ] Clear error messages
- [ ] Loading states display
- [ ] Success confirmations show

#### Data Integrity
- [ ] Data saves correctly
- [ ] Data updates properly
- [ ] Data deletes work
- [ ] No data loss on refresh
- [ ] Proper validation prevents bad data

#### Security
- [ ] Passwords are hidden
- [ ] Protected routes redirect
- [ ] Users can only edit own content
- [ ] SQL injection prevented
- [ ] XSS attacks prevented

#### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Sufficient color contrast
- [ ] Alt text on images

---

## Test Execution Tracking

### Test Summary Report Template

```
Date: __________
Tester: __________
Environment: __________

Total Test Cases: __________
Passed: __________
Failed: __________
Blocked: __________
Not Run: __________

Pass Rate: __________%

Critical Issues Found: __________
High Priority Issues: __________
Medium Priority Issues: __________
Low Priority Issues: __________

Overall Status: [Ready for Production / Needs Work / Not Ready]

Notes:
___________________________________________
___________________________________________
```

---

## Conclusion

This manual testing guide provides comprehensive coverage of all features in the Local Neighborhood Social Network application. Follow each test case systematically, document results, and report any issues using the bug report template.

**Happy Testing! 🧪**

For questions or support, refer to the main README.md or API documentation.
