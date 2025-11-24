# Testing Checklist for New Features

## Pre-Deployment Checks

### Database Setup
- [ ] Run migrations or enable `DB_SYNCHRONIZE=true` in development
- [ ] Verify PostgreSQL is running
- [ ] Check all 7 new entity tables are created
- [ ] Verify entity relationships are working

### Backend API Tests

#### 1. Messages API
- [ ] POST `/api/v1/messages` - Send message
- [ ] GET `/api/v1/messages/conversations` - List conversations
- [ ] GET `/api/v1/messages/conversations/:id` - Get messages
- [ ] PATCH `/api/v1/messages/:id/read` - Mark as read
- [ ] GET `/api/v1/messages/unread/count` - Get unread count

#### 2. Lost & Found API
- [ ] POST `/api/v1/lost-found` - Create post
- [ ] GET `/api/v1/lost-found` - List all posts
- [ ] GET `/api/v1/lost-found/lost-pets` - Filter lost pets
- [ ] POST `/api/v1/lost-found/:id/sightings` - Add sighting
- [ ] PATCH `/api/v1/lost-found/:id/reunited` - Mark reunited

#### 3. Recommendations API
- [ ] POST `/api/v1/recommendations` - Create recommendation
- [ ] GET `/api/v1/recommendations` - List recommendations
- [ ] GET `/api/v1/recommendations/search?q=plumber` - Search
- [ ] POST `/api/v1/recommendations/:id/reviews` - Add review

#### 4. Lending API
- [ ] POST `/api/v1/lending/items` - Create item
- [ ] GET `/api/v1/lending/items` - List available items
- [ ] POST `/api/v1/lending/items/:id/borrow` - Request to borrow
- [ ] PATCH `/api/v1/lending/requests/:id/approve` - Approve request
- [ ] PATCH `/api/v1/lending/requests/:id/return` - Return item

#### 5. Pets API
- [ ] POST `/api/v1/pets` - Create pet profile
- [ ] GET `/api/v1/pets` - List pets
- [ ] GET `/api/v1/pets/user/my-pets` - Get my pets
- [ ] POST `/api/v1/pets/playdates` - Create playdate
- [ ] GET `/api/v1/pets/playdates/upcoming` - List playdates

#### 6. Volunteers API
- [ ] POST `/api/v1/volunteers/opportunities` - Create opportunity
- [ ] GET `/api/v1/volunteers/opportunities` - List opportunities
- [ ] POST `/api/v1/volunteers/opportunities/:id/signup` - Sign up
- [ ] POST `/api/v1/volunteers/signups/:id/hours` - Log hours
- [ ] GET `/api/v1/volunteers/leaderboard` - Get leaderboard

### Frontend Tests

#### Dark Mode
- [ ] Toggle between light/dark/system modes
- [ ] Verify theme persists on page reload
- [ ] Check all pages render correctly in dark mode
- [ ] Verify system preference detection works

#### Navigation
- [ ] Dashboard shows all 10 quick links
- [ ] All links navigate to correct pages
- [ ] Theme toggle visible in header
- [ ] Messages icon visible in header

#### Pages Functionality

**Messages Page**
- [ ] Conversation list loads
- [ ] Click conversation to view messages
- [ ] Send new message
- [ ] Messages display with correct alignment (sent vs received)
- [ ] Timestamps display correctly

**Lost & Found Page**
- [ ] Filter by type (Lost Pet, Found Pet, Lost Item, Found Item)
- [ ] Create new post
- [ ] View post details
- [ ] Add sighting report

**Recommendations Page**
- [ ] Search functionality
- [ ] Filter by category
- [ ] Create recommendation
- [ ] Add review
- [ ] Star ratings display

**Lending Page**
- [ ] Browse available items
- [ ] View my items
- [ ] Create new item
- [ ] Request to borrow
- [ ] See borrow requests

**Pets Page**
- [ ] View pet directory
- [ ] Filter by pet type
- [ ] Add pet profile
- [ ] View playdates
- [ ] Create playdate

**Volunteers Page**
- [ ] View opportunities
- [ ] Filter by category
- [ ] Sign up for opportunity
- [ ] View my signups
- [ ] See leaderboard and badges

### UI Components Dark Mode
- [ ] Card component - dark background
- [ ] Input component - dark background and text
- [ ] Button component - all variants work in dark mode
- [ ] Theme toggle - icon changes with theme

## Known Issues to Monitor

1. **Authentication**: All endpoints require valid JWT token
2. **User Context**: Ensure user object has `id` field from auth
3. **Image Uploads**: File upload endpoints not yet implemented (placeholders exist)
4. **Real-time Updates**: WebSocket integration for messages not yet implemented
5. **Notifications**: Push notifications not yet connected to new features

## Performance Considerations

- [ ] Test with 100+ messages in a conversation
- [ ] Test with 50+ pets in directory
- [ ] Test volunteer leaderboard with many users
- [ ] Check pagination on list endpoints
- [ ] Monitor database query performance

## Security Checklist

- [ ] All endpoints have JwtAuthGuard
- [ ] User can only edit/delete their own posts
- [ ] Sensitive data (passwords, tokens) not exposed
- [ ] Input validation on all forms
- [ ] XSS protection on user-generated content

## Deployment Steps

1. **Backend**
   ```bash
   cd apps/backend
   npm install
   npm run build
   npm run migration:run  # or set DB_SYNCHRONIZE=true
   npm start
   ```

2. **Frontend**
   ```bash
   cd apps/frontend
   npm install
   npm run build
   npm start
   ```

3. **Environment Variables**
   - Set `DATABASE_URL` or individual DB_* variables
   - Set `JWT_SECRET`
   - Set `NEXT_PUBLIC_API_URL` to backend URL

## Manual Testing Workflow

1. **Register/Login** - Get authentication token
2. **Test Dark Mode** - Toggle and verify persistence
3. **Send Message** - Create conversation
4. **Report Lost Pet** - Create post and add sighting
5. **Recommend Service** - Add recommendation and review
6. **Add Lending Item** - Create item and test borrow flow
7. **Create Pet Profile** - Add pet and schedule playdate
8. **Volunteer** - Create opportunity and sign up

## Success Criteria

✅ All API endpoints return 200/201 for valid requests
✅ All pages load without errors
✅ Dark mode works across all pages
✅ User can complete full workflow for each feature
✅ Data persists correctly in database
✅ Authentication works properly
✅ UI is responsive on mobile/tablet/desktop
