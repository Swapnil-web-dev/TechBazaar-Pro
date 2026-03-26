# 🛠️ TechBazaar Pro - Technical Implementation Guide

## 📋 SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  React + TypeScript + Tailwind CSS + React Router           │
│  (Customer Interface + Vendor Dashboard)                     │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ REST API / GraphQL
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                        BACKEND                               │
│  Django (Python) OR Laravel (PHP)                            │
│  - User Authentication (JWT)                                 │
│  - Product Management                                        │
│  - Order Processing                                          │
│  - Payment Gateway Integration                               │
│  - Vendor Management                                         │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                      DATABASE                                │
│  PostgreSQL (Production) / SQLite (Development)              │
└──────────────────────────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                 EXTERNAL SERVICES                            │
│  • Razorpay (Payment Gateway)                                │
│  • Shiprocket (Logistics API)                                │
│  • AWS S3 / Cloudinary (Image Storage)                       │
│  • SendGrid (Email Notifications)                            │
│  • Firebase (Push Notifications)                             │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔧 TECH STACK BREAKDOWN

### OPTION 1: Django (Python) - RECOMMENDED

**Why Django?**
- Built-in admin panel (vendor management without writing code)
- Django REST Framework (API in 5 minutes)
- Large community (StackOverflow has 1M+ Django questions)
- Secure by default (prevents SQL injection, XSS)
- Scalable (Instagram, Pinterest use Django)

**Stack:**
```
Frontend:     React 18 + TypeScript + Tailwind CSS
Backend:      Django 5.0 + Django REST Framework
Database:     PostgreSQL (Production), SQLite (Dev)
Auth:         Django-allauth + JWT
Payment:      Razorpay Python SDK
Image Upload: Pillow + Cloudinary
Search:       Django-filters + Elasticsearch (later)
Caching:      Redis
Task Queue:   Celery (for emails, notifications)
Hosting:      AWS EC2 / DigitalOcean / Heroku
```

**Budget:**
- **Development**: ₹0 (open source)
- **Hosting**: ₹500-₹2,000/month (DigitalOcean Droplet)
- **Domain**: ₹800/year
- **SSL Certificate**: ₹0 (Let's Encrypt)
- **Total Year 1**: ₹7,000-₹25,000

---

### OPTION 2: Laravel (PHP) - ALTERNATIVE

**Why Laravel?**
- Easier to find cheap hosting (shared hosting ₹150/month)
- Laravel Nova (beautiful admin panel)
- Blade templates (faster than React for simple UI)
- Large freelancer pool (easier to hire help)

**Stack:**
```
Frontend:     Laravel Blade + Alpine.js + Tailwind CSS
Backend:      Laravel 11
Database:     MySQL
Auth:         Laravel Breeze / Sanctum
Payment:      Razorpay PHP SDK
Image Upload: Laravel Media Library + AWS S3
Search:       Laravel Scout + Algolia
Caching:      Redis
Queue:        Laravel Queues
Hosting:      Shared Hosting / AWS
```

**Budget:**
- **Development**: ₹0 (open source)
- **Hosting**: ₹150-₹500/month (Hostinger/Namecheap)
- **Domain**: ₹800/year
- **Total Year 1**: ₹2,600-₹6,800

---

## 📦 DATABASE SCHEMA (CORE TABLES)

### 1. Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(15),
    user_type VARCHAR(20) CHECK (user_type IN ('customer', 'vendor', 'admin')),
    is_verified BOOLEAN DEFAULT FALSE,
    college_name VARCHAR(255), -- for students
    student_id_proof VARCHAR(255), -- for 5% discount
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Vendors Table
```sql
CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    store_name VARCHAR(255) NOT NULL,
    store_description TEXT,
    gst_number VARCHAR(15),
    pan_number VARCHAR(10),
    bank_account VARCHAR(20),
    ifsc_code VARCHAR(11),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(6),
    commission_rate DECIMAL(4,2) DEFAULT 8.00, -- percentage
    subscription_plan VARCHAR(20) DEFAULT 'free', -- free, pro, business
    is_verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_sales INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Products Table
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER REFERENCES vendors(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    category VARCHAR(100),
    sub_category VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2), -- for showing discounts
    stock_quantity INTEGER DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    specifications JSONB, -- {"voltage": "5V", "current": "500mA"}
    tags TEXT[], -- {arduino, microcontroller, beginner}
    images TEXT[], -- array of image URLs
    tutorial_video_url VARCHAR(255),
    datasheet_url VARCHAR(255),
    sample_code_url VARCHAR(255),
    total_sales INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating);
```

### 4. Product Bundles Table
```sql
CREATE TABLE product_bundles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    category VARCHAR(100),
    difficulty_level VARCHAR(20), -- beginner, intermediate, advanced
    project_duration VARCHAR(50), -- "2-3 weeks"
    price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2), -- for margin calculation
    images TEXT[],
    includes TEXT[], -- {"ESP32 Board", "5 Sensors", "Relay Module"}
    learning_outcomes TEXT[], -- {"IoT Fundamentals", "MQTT Protocol"}
    documentation_url VARCHAR(255),
    video_tutorial_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    total_sales INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Bundle Items (Many-to-Many with Products)
```sql
CREATE TABLE bundle_items (
    id SERIAL PRIMARY KEY,
    bundle_id INTEGER REFERENCES product_bundles(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER DEFAULT 1
);
```

### 6. Orders Table
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE, -- ORD-20260325-1234
    customer_id INTEGER REFERENCES users(id),
    vendor_id INTEGER REFERENCES vendors(id),
    total_amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2),
    vendor_payout DECIMAL(10,2),
    payment_method VARCHAR(20), -- cod, upi, card, netbanking
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, refunded
    payment_id VARCHAR(255), -- Razorpay payment ID
    order_status VARCHAR(20) DEFAULT 'placed', -- placed, confirmed, shipped, delivered, cancelled
    shipping_address TEXT,
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_pincode VARCHAR(6),
    shipping_phone VARCHAR(15),
    tracking_number VARCHAR(100),
    courier_partner VARCHAR(50),
    estimated_delivery DATE,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_vendor ON orders(vendor_id);
CREATE INDEX idx_orders_status ON orders(order_status);
```

### 7. Order Items Table
```sql
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    bundle_id INTEGER REFERENCES product_bundles(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL
);
```

### 8. Reviews Table
```sql
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    customer_id INTEGER REFERENCES users(id),
    order_id INTEGER REFERENCES orders(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    images TEXT[], -- customer can upload photos
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
```

### 9. Vendor Payouts Table
```sql
CREATE TABLE vendor_payouts (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER REFERENCES vendors(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_cycle_start DATE,
    payment_cycle_end DATE,
    orders_included INTEGER[],
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, paid
    paid_at TIMESTAMP,
    transaction_reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 10. Cart Table (Optional - can use localStorage)
```sql
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    bundle_id INTEGER REFERENCES product_bundles(id),
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 AUTHENTICATION FLOW

### Registration Flow:

```
1. User enters: email, password, full_name, phone
2. Backend validates: unique email, strong password
3. Send verification email (OTP or link)
4. User clicks link → is_verified = TRUE
5. If user_type = "vendor" → redirect to vendor onboarding
6. If user_type = "customer" → redirect to homepage
```

**Django Code (Simplified):**
```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from .models import User

class RegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        full_name = request.data.get('full_name')
        user_type = request.data.get('user_type', 'customer')
        
        # Validate
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Create user
        user = User.objects.create(
            email=email,
            password_hash=make_password(password),
            full_name=full_name,
            user_type=user_type
        )
        
        # Send verification email (using SendGrid)
        send_verification_email(user.email)
        
        return Response({
            'message': 'Registration successful. Check email for verification.',
            'user_id': user.id
        }, status=status.HTTP_201_CREATED)
```

---

## 💳 RAZORPAY INTEGRATION

### Step 1: Create Razorpay Account
- Go to razorpay.com → Sign up
- Get API Key ID and Secret Key (free, no charges until transaction)

### Step 2: Backend Order Creation

**Django Code:**
```python
import razorpay
from django.conf import settings
from rest_framework.views import APIView

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_SECRET))

class CreateOrderView(APIView):
    def post(self, request):
        cart_total = request.data.get('amount')  # in rupees
        
        # Create Razorpay order
        razorpay_order = client.order.create({
            'amount': int(cart_total * 100),  # Razorpay uses paise
            'currency': 'INR',
            'payment_capture': 1  # auto-capture
        })
        
        # Save order to database
        order = Order.objects.create(
            customer_id=request.user.id,
            total_amount=cart_total,
            payment_status='pending',
            payment_id=razorpay_order['id']
        )
        
        return Response({
            'order_id': razorpay_order['id'],
            'amount': razorpay_order['amount'],
            'currency': razorpay_order['currency'],
            'key': settings.RAZORPAY_KEY_ID
        })
```

### Step 3: Frontend Payment Handling

**React Code:**
```typescript
import axios from 'axios';

const handlePayment = async () => {
  // Step 1: Create order on backend
  const response = await axios.post('/api/orders/create', {
    amount: 1899,
    items: cartItems
  });
  
  const { order_id, amount, currency, key } = response.data;
  
  // Step 2: Open Razorpay checkout
  const options = {
    key: key,
    amount: amount,
    currency: currency,
    name: 'TechBazaar Pro',
    description: 'Purchase Order',
    order_id: order_id,
    handler: function (response: any) {
      // Step 3: Verify payment on backend
      axios.post('/api/payments/verify', {
        order_id: response.razorpay_order_id,
        payment_id: response.razorpay_payment_id,
        signature: response.razorpay_signature
      }).then(() => {
        alert('Payment successful!');
        window.location.href = '/order-success';
      });
    },
    prefill: {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      contact: '9876543210'
    },
    theme: {
      color: '#9333ea' // purple-600
    }
  };
  
  const razorpay = new (window as any).Razorpay(options);
  razorpay.open();
};
```

### Step 4: Payment Verification (Backend)

```python
import hmac
import hashlib
from django.conf import settings

class VerifyPaymentView(APIView):
    def post(self, request):
        order_id = request.data.get('order_id')
        payment_id = request.data.get('payment_id')
        signature = request.data.get('signature')
        
        # Generate signature
        message = f"{order_id}|{payment_id}"
        generated_signature = hmac.new(
            settings.RAZORPAY_SECRET.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if generated_signature == signature:
            # Payment verified
            order = Order.objects.get(payment_id=order_id)
            order.payment_status = 'paid'
            order.order_status = 'confirmed'
            order.save()
            
            # Send confirmation email
            send_order_confirmation_email(order)
            
            # Notify vendor
            notify_vendor(order.vendor_id)
            
            return Response({'status': 'success'})
        else:
            return Response({'error': 'Invalid signature'}, 
                          status=status.HTTP_400_BAD_REQUEST)
```

**Razorpay Fees**: 2% + GST (₹1,000 order = ₹23.60 fee)

---

## 📦 PRODUCT SEARCH & FILTERS

### Basic Search (SQL)

```python
class ProductSearchView(APIView):
    def get(self, request):
        query = request.GET.get('q', '')
        category = request.GET.get('category')
        min_price = request.GET.get('min_price')
        max_price = request.GET.get('max_price')
        min_rating = request.GET.get('min_rating')
        sort_by = request.GET.get('sort', 'popularity')
        
        products = Product.objects.filter(is_active=True)
        
        # Search in name and description
        if query:
            products = products.filter(
                Q(name__icontains=query) | Q(description__icontains=query)
            )
        
        # Filters
        if category:
            products = products.filter(category=category)
        if min_price:
            products = products.filter(price__gte=min_price)
        if max_price:
            products = products.filter(price__lte=max_price)
        if min_rating:
            products = products.filter(rating__gte=min_rating)
        
        # Sorting
        if sort_by == 'price_low':
            products = products.order_by('price')
        elif sort_by == 'price_high':
            products = products.order_by('-price')
        elif sort_by == 'rating':
            products = products.order_by('-rating')
        else:  # popularity
            products = products.order_by('-total_sales')
        
        return Response(ProductSerializer(products, many=True).data)
```

### Advanced Search (Elasticsearch) - Phase 2

When you have 10,000+ products, switch to Elasticsearch:

```python
# requirements: elasticsearch, elasticsearch-dsl

from elasticsearch_dsl import Document, Text, Integer, Float, Keyword

class ProductDocument(Document):
    name = Text()
    description = Text()
    category = Keyword()
    price = Float()
    rating = Float()
    total_sales = Integer()
    
    class Index:
        name = 'products'
    
    def save(self, **kwargs):
        return super().save(**kwargs)

# Search with typo tolerance, relevance scoring
def search_products(query):
    s = ProductDocument.search()
    s = s.query("multi_match", query=query, fields=['name^2', 'description'])
    s = s.filter('range', price={'gte': 0, 'lte': 10000})
    response = s.execute()
    return response
```

---

## 📧 EMAIL NOTIFICATIONS

### SendGrid Integration

```python
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_order_confirmation_email(order):
    message = Mail(
        from_email='noreply@techbazaarpro.in',
        to_emails=order.customer.email,
        subject=f'Order Confirmed - {order.order_number}',
        html_content=f'''
        <h1>Thank you for your order!</h1>
        <p>Your order {order.order_number} has been confirmed.</p>
        <p><strong>Total Amount:</strong> ₹{order.total_amount}</p>
        <p><strong>Expected Delivery:</strong> {order.estimated_delivery}</p>
        <p>Track your order: <a href="https://techbazaarpro.in/orders/{order.id}">Click here</a></p>
        '''
    )
    
    try:
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        response = sg.send(message)
        return response.status_code == 202
    except Exception as e:
        print(f"Email error: {e}")
        return False
```

**SendGrid Free Tier**: 100 emails/day (enough for MVP)

---

## 🚀 DEPLOYMENT OPTIONS

### OPTION 1: DigitalOcean (Recommended)

**Why?**
- Simple setup (1-click Django droplet)
- ₹500/month for 1GB RAM (enough for 1,000 users)
- Easy scaling (add more droplets)

**Steps:**
1. Create DigitalOcean account
2. Choose "Django" droplet (₹500/month)
3. SSH into server:
   ```bash
   ssh root@your-droplet-ip
   ```
4. Clone your repo:
   ```bash
   git clone https://github.com/yourusername/techbazaar-pro.git
   cd techbazaar-pro
   ```
5. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
6. Set environment variables:
   ```bash
   export SECRET_KEY="your-secret-key"
   export RAZORPAY_KEY_ID="your-key"
   export RAZORPAY_SECRET="your-secret"
   ```
7. Run migrations:
   ```bash
   python manage.py migrate
   python manage.py collectstatic
   ```
8. Start with Gunicorn:
   ```bash
   gunicorn techbazaar.wsgi:application --bind 0.0.0.0:8000
   ```
9. Set up Nginx (reverse proxy)
10. Get SSL certificate (Let's Encrypt - free)

**Total Time**: 2-3 hours

---

### OPTION 2: Heroku (Easiest)

**Why?**
- Deploy in 5 minutes (git push)
- Auto-scaling
- Free SSL certificate

**Steps:**
1. Install Heroku CLI
2. Create `Procfile`:
   ```
   web: gunicorn techbazaar.wsgi
   ```
3. Create `runtime.txt`:
   ```
   python-3.11
   ```
4. Deploy:
   ```bash
   heroku create techbazaar-pro
   git push heroku main
   heroku run python manage.py migrate
   ```

**Cost**: ₹700/month (Hobby tier)

---

### OPTION 3: AWS EC2 (Scalable)

**Why?**
- Most scalable (can handle 1M+ users)
- Free tier for 1 year (t2.micro)

**Steps**: (Similar to DigitalOcean but more complex)

---

## 🔒 SECURITY BEST PRACTICES

### 1. Environment Variables (Never hardcode secrets)

```python
# settings.py
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID')
RAZORPAY_SECRET = os.getenv('RAZORPAY_SECRET')
```

### 2. SQL Injection Prevention

```python
# ❌ BAD
query = f"SELECT * FROM products WHERE name = '{user_input}'"

# ✅ GOOD (Django ORM auto-escapes)
products = Product.objects.filter(name=user_input)
```

### 3. XSS Prevention

```python
# Django templates auto-escape by default
{{ product.name }}  # Safe

# If you need raw HTML (be careful!)
{{ product.description|safe }}  # Only for trusted content
```

### 4. HTTPS Only

```python
# settings.py
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

### 5. Rate Limiting (Prevent abuse)

```python
from django_ratelimit.decorators import ratelimit

@ratelimit(key='ip', rate='10/m')  # 10 requests per minute per IP
def api_view(request):
    return Response({'data': 'something'})
```

---

## 📊 ANALYTICS & MONITORING

### Google Analytics (Free)

```html
<!-- Add to base.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA-XXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA-XXXXXX');
</script>
```

**Track:**
- Page views
- Product clicks
- Add to cart events
- Purchases

---

### Sentry (Error Tracking)

```python
import sentry_sdk

sentry_sdk.init(
    dsn="https://xxxxx@sentry.io/xxxxx",
    traces_sample_rate=1.0,
)
```

**Sentry Free Tier**: 5,000 errors/month

---

## 🚀 PERFORMANCE OPTIMIZATION

### 1. Database Indexing

```sql
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_orders_customer ON orders(customer_id);
```

**Result**: 10x faster queries

---

### 2. Caching (Redis)

```python
from django.core.cache import cache

def get_featured_products():
    # Check cache first
    products = cache.get('featured_products')
    if products is None:
        # Query database
        products = Product.objects.filter(is_featured=True)[:10]
        # Cache for 1 hour
        cache.set('featured_products', products, 3600)
    return products
```

**Result**: 50x faster for homepage

---

### 3. Image Optimization (Cloudinary)

```python
from cloudinary.uploader import upload

def upload_product_image(image_file):
    result = upload(
        image_file,
        folder="products",
        transformation=[
            {'width': 800, 'height': 800, 'crop': 'limit'},
            {'quality': 'auto'},
            {'fetch_format': 'auto'}
        ]
    )
    return result['secure_url']
```

**Result**: Images load 5x faster, reduce bandwidth costs

---

## 📱 MOBILE APP (Phase 2)

### React Native (Cross-Platform)

**Why?**
- Write once, deploy to Android + iOS
- Reuse React knowledge
- 70% code sharing with web app

**Tech Stack:**
```
Framework:    React Native + TypeScript
Navigation:   React Navigation
State:        Redux Toolkit
API Calls:    Axios
Payments:     Razorpay React Native SDK
Push:         Firebase Cloud Messaging
Maps:         React Native Maps (for vendor locations)
```

**Budget:**
- **Development**: ₹0 (DIY) or ₹50K-₹1.5L (hire developer)
- **Play Store**: $25 one-time
- **App Store**: $99/year

**Timeline**: 2-3 months

---

## 🧪 TESTING

### Unit Tests (Django)

```python
from django.test import TestCase
from .models import Product

class ProductTestCase(TestCase):
    def setUp(self):
        Product.objects.create(
            name="Arduino Uno",
            price=1200,
            stock_quantity=50
        )
    
    def test_product_creation(self):
        arduino = Product.objects.get(name="Arduino Uno")
        self.assertEqual(arduino.price, 1200)
    
    def test_out_of_stock(self):
        arduino = Product.objects.get(name="Arduino Uno")
        arduino.stock_quantity = 0
        self.assertFalse(arduino.is_available())
```

Run tests:
```bash
python manage.py test
```

---

## 📈 SCALING ROADMAP

### Phase 1: MVP (Month 1-3)
- Single server
- SQLite → PostgreSQL
- 100-500 users
- 10-20 vendors
- **Cost**: ₹1,000/month

### Phase 2: Growth (Month 4-12)
- Load balancer + 2 servers
- Redis caching
- CDN for images (Cloudinary)
- 1,000-10,000 users
- 50-200 vendors
- **Cost**: ₹5,000/month

### Phase 3: Scale (Year 2)
- 5-10 servers
- Elasticsearch
- Microservices (separate vendor dashboard)
- 50,000+ users
- 500+ vendors
- **Cost**: ₹25,000/month

---

## 🎯 NEXT STEPS FOR DEVELOPERS

### Week 1: Setup
- [ ] Install Python + Django (or PHP + Laravel)
- [ ] Create virtual environment
- [ ] Install dependencies (`pip install django djangorestframework`)
- [ ] Initialize Git repo

### Week 2: Core Models
- [ ] Create User, Vendor, Product models
- [ ] Set up admin panel
- [ ] Create sample data (fixtures)

### Week 3: API Development
- [ ] Product listing API
- [ ] Cart API
- [ ] Order creation API
- [ ] Razorpay integration

### Week 4: Frontend
- [ ] Set up React + TypeScript
- [ ] Build homepage
- [ ] Product listing page
- [ ] Checkout flow

### Week 5: Vendor Dashboard
- [ ] Vendor login
- [ ] Add product form
- [ ] View orders
- [ ] Sales analytics

### Week 6: Testing & Deployment
- [ ] Write tests
- [ ] Fix bugs
- [ ] Deploy to DigitalOcean/Heroku
- [ ] Set up domain + SSL

**By Week 6, you have a live MVP!**

---

## 🛠️ USEFUL LIBRARIES

### Django
- `djangorestframework` - Build APIs
- `django-cors-headers` - Allow React to call APIs
- `django-allauth` - User authentication
- `django-filters` - Product filtering
- `celery` - Background tasks
- `pillow` - Image processing
- `razorpay` - Payment gateway

### React
- `axios` - API calls
- `react-query` - Data fetching
- `zustand` - State management
- `react-hook-form` - Forms
- `react-hot-toast` - Notifications
- `lucide-react` - Icons

---

## 💡 DEVELOPMENT TIPS

1. **Start Simple**: Don't build everything at once. MVP first.
2. **Use Templates**: Bootstrap, Tailwind templates save time
3. **Copy, Don't Invent**: Study Robu.in, ElectronicComp.in, replicate features
4. **Test on Mobile**: 80% users will browse on phones
5. **Deploy Early**: Launch MVP in 2 weeks, improve later
6. **Ask for Help**: StackOverflow, Reddit, Discord communities

---

## 📞 SUPPORT RESOURCES

- **Django Docs**: docs.djangoproject.com
- **Django REST Framework**: django-rest-framework.org
- **Razorpay Docs**: razorpay.com/docs
- **React Docs**: react.dev
- **StackOverflow**: stackoverflow.com
- **YouTube**: Search "Django E-commerce Tutorial"

---

**This is your complete technical blueprint. Now go build! 🚀**

---

*Questions? Stuck somewhere? Comment in the code, ask on forums, or hire a freelance developer for ₹15K-₹25K to build the MVP.*

**Good luck, Developer!** 👨‍💻👩‍💻
