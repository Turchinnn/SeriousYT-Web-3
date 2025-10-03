# Supabase Removal Guide

## ⚠️ Important Warning

Removing Supabase will break the following functionality in your application:
- User authentication (login/signup)
- Profile management
- Product management
- Shopping cart persistence
- Order management
- File storage (avatars)

You'll need to replace these with your own backend services.

## Files that Currently Use Supabase

### Core Integration Files
- `src/integrations/supabase/client.ts` - Main Supabase client
- `src/integrations/supabase/types.ts` - Database types
- `.env` - Supabase credentials

### Components Using Supabase
- `src/components/MyAccount.tsx` - Profile management
- `src/components/Cart.tsx` - Cart functionality
- `src/components/Navbar.tsx` - Authentication state
- `src/pages/Auth.tsx` - Login/signup
- `src/pages/Webshop.tsx` - Product fetching
- `src/pages/Checkout.tsx` - Order creation
- `src/hooks/useCart.tsx` - Cart persistence

## Quick Removal Steps (If You Want to Remove Supabase Immediately)

### Option 1: Quick Disable (Recommended First Step)
If you want to quickly disable Supabase functionality while keeping the code intact:

1. **Comment out Supabase imports** in key files:
   - Comment out all `supabase` imports in components
   - Replace Supabase calls with mock data or local storage
   - This allows you to test your app without Supabase while planning your migration

2. **Use Local Storage for Testing**:
   ```typescript
   // Temporary replacement for cart functionality
   const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
   ```

### Option 2: Complete Removal Process

## Step-by-Step Removal Process

### 1. Remove Supabase Dependencies
```bash
npm uninstall @supabase/supabase-js
```

### 2. Replace Authentication
You'll need to implement:
- Login/signup endpoints
- JWT token management
- Session persistence
- User context provider

**Example replacement structure:**
```typescript
// src/lib/auth.ts
export interface User {
  id: string;
  email: string;
  // other user fields
}

export const auth = {
  login: async (email: string, password: string) => {
    // Call your login API
  },
  signup: async (email: string, password: string) => {
    // Call your signup API
  },
  logout: async () => {
    // Clear tokens and redirect
  },
  getUser: () => {
    // Get current user from token
  }
};
```

### 3. Replace Database Calls
Replace all `supabase.from()` calls with your API endpoints:

**Before:**
```typescript
const { data } = await supabase
  .from("products")
  .select("*")
  .eq("is_active", true);
```

**After:**
```typescript
const response = await fetch('/api/products?active=true');
const data = await response.json();
```

### 4. Replace File Storage
Replace Supabase storage with:
- AWS S3
- Cloudinary
- Your own file server
- Local storage solution

**Example replacement:**
```typescript
// src/lib/storage.ts
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`/api/upload/${path}`, {
    method: 'POST',
    body: formData,
  });
  
  const { url } = await response.json();
  return url;
};
```

### 5. Create API Endpoints
You'll need to create these backend endpoints:

#### Authentication
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/logout`
- `GET /api/auth/me`

#### Products
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

#### Cart
- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/:id`
- `DELETE /api/cart/items/:id`
- `DELETE /api/cart/clear`

#### Orders
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/:id`

#### Profile
- `GET /api/profile`
- `PUT /api/profile`
- `POST /api/profile/avatar`

#### File Upload
- `POST /api/upload/:path`

### 6. Update Environment Variables
Replace Supabase variables with your own:

```env
# Remove these
# VITE_SUPABASE_URL=
# VITE_SUPABASE_PUBLISHABLE_KEY=
# VITE_SUPABASE_PROJECT_ID=

# Add your own
VITE_API_BASE_URL=https://your-api.com
VITE_JWT_SECRET=your-jwt-secret
```

### 7. Files to Delete
After completing the migration:
- `src/integrations/` (entire folder)
- `.env` (Supabase credentials)

### 8. Files to Modify
Update all components to use your new API instead of Supabase calls.

## Recommended Backend Technologies

### Node.js/Express
```javascript
// Example Express setup
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Example route
app.get('/api/products', async (req, res) => {
  // Fetch from your database
  const products = await db.products.findMany({
    where: { is_active: true }
  });
  res.json(products);
});
```

### Python/FastAPI
```python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer
import jwt

app = FastAPI()
security = HTTPBearer()

async def get_current_user(token: str = Depends(security)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/api/products")
async def get_products():
    # Fetch from your database
    return await db.fetch_products()
```

## Migration Timeline

1. **Day 1-2**: Set up your backend API with basic CRUD operations
2. **Day 3-4**: Implement authentication system
3. **Day 5-6**: Set up file storage solution
4. **Day 7-8**: Update frontend to use new API
5. **Day 9-10**: Test all functionality and fix issues
6. **Day 11**: Remove Supabase dependencies and deploy

## Testing Checklist

Before removing Supabase completely, ensure:
- [ ] User registration works
- [ ] User login works
- [ ] Profile updates work
- [ ] Avatar upload works
- [ ] Product listing works
- [ ] Cart operations work
- [ ] Order creation works
- [ ] All API endpoints respond correctly
- [ ] Authentication tokens work properly
- [ ] File uploads work

## Support

This is a complex migration. Consider:
- Starting with a staging environment
- Keeping Supabase temporarily while testing
- Having rollback plans ready
- Testing thoroughly before going live

The database schema I provided earlier will help you set up your own database structure to match the current functionality.
