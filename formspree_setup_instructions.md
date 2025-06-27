# Formspree Setup Instructions for E_roots Order Notifications

## Step-by-Step Setup Guide

### Step 1: Create a Formspree Account

1. Go to [https://formspree.io](https://formspree.io)
2. Click "Sign Up" and create a free account
3. Verify your email address when prompted

### Step 2: Create a New Form for Order Notifications

1. After logging in, click "New Form" or the "+" button
2. Give your form a descriptive name like "E_roots Order Notifications"
3. Choose your preferred settings:
   - **Form Name**: E_roots Order Notifications
   - **Notification Email**: Your business email address where you want to receive order notifications
   - **Redirect URL**: Leave blank (we'll handle this in JavaScript)

### Step 3: Get Your Form Endpoint

1. After creating the form, you'll see a form endpoint URL that looks like:
   `https://formspree.io/f/YOUR_FORM_ID`
2. Copy this URL - you'll need it for the next step

### Step 4: Update Your JavaScript Code

1. Open your `scripts.js` file
2. Find the line that says:
   ```javascript
   const response = await fetch('https://formspree.io/f/YOUR_ORDER_FORM_ID', {
   ```
3. Replace `YOUR_ORDER_FORM_ID` with your actual form ID from Step 3

For example, if your form endpoint is `https://formspree.io/f/abc123def`, then update the line to:
```javascript
const response = await fetch('https://formspree.io/f/abc123def', {
```

### Step 5: Test Your Setup

1. Upload your website files to your hosting provider
2. Add a few items to your cart
3. Click the "Checkout" button
4. Fill in the customer information when prompted
5. Check your email - you should receive an order notification

### Step 6: Customize Email Notifications (Optional)

In your Formspree dashboard, you can:
- Customize the email subject line
- Set up auto-reply emails to customers
- Configure spam protection
- Set up webhooks for advanced integrations

## What Happens When an Order is Placed

1. **Customer Experience**:
   - Customer adds items to cart
   - Clicks "Checkout" button
   - Enters their name, email, phone, and address
   - Receives order confirmation with order number

2. **Store Owner Experience**:
   - Receives email notification with:
     - Customer contact information
     - Complete order details
     - Order total
     - Timestamp
     - Unique order number

## Email Content Example

When an order is placed, you'll receive an email like this:

```
Subject: New Order #ER1703123456789 - E_roots

NEW ORDER RECEIVED - ER1703123456789

Customer Information:
Name: John Doe
Email: john.doe@example.com
Phone: +91 9876543210
Address: 123 Main Street, City, State 12345

Order Details:
- ESP8266 NodeMCU CP2102 x1 @ ₹289 each = ₹289
- DHT11 Temperature & Humidity Sensor x2 @ ₹96 each = ₹192

Total Amount: ₹481
Order Date: 21/12/2023, 3:45:30 pm

Please contact the customer to confirm payment and delivery details.
```

## Troubleshooting

**If emails are not being received:**
1. Check your spam/junk folder
2. Verify the form endpoint URL in your JavaScript
3. Ensure your website is hosted online (Formspree doesn't work with local files)
4. Check the Formspree dashboard for submission logs

**If the checkout process fails:**
1. Open browser developer tools (F12) and check the Console tab for errors
2. Verify your internet connection
3. Make sure all required customer information is being entered

## Free vs Paid Plans

**Formspree Free Plan includes:**
- 50 submissions per month
- Basic email notifications
- Spam protection

**Paid Plans offer:**
- Unlimited submissions
- Custom email templates
- Advanced integrations
- Priority support

For a small electronics store, the free plan should be sufficient to start with.

## Security Considerations

- Customer email addresses are automatically set as reply-to addresses
- All data is transmitted securely via HTTPS
- Formspree complies with GDPR and other privacy regulations
- No sensitive payment information is transmitted (payment is handled separately via WhatsApp/phone)

This setup provides a simple, reliable way to receive order notifications without needing to set up your own email server or backend infrastructure.

