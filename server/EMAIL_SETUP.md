# Email Setup Guide for Invoice App

## Overview
This application now includes complete email functionality to send invoices as PDF attachments to clients. The system uses Gmail SMTP for sending emails and Puppeteer for PDF generation.

## Features Added

### 1. Email Functionality
- ✅ Send invoices via email with PDF attachment
- ✅ Professional HTML email templates
- ✅ Automatic status updates (Draft → Pending when sent)
- ✅ Email validation and error handling

### 2. PDF Generation
- ✅ Generate professional PDF invoices
- ✅ Download invoices as PDF files
- ✅ Automatic PDF cleanup (24-hour retention)

### 3. New API Endpoints
- `POST /api/invoices/:invoiceId/send` - Send invoice via email
- `GET /api/invoices/:invoiceId/download` - Download invoice as PDF
- `PUT /api/invoices/:invoiceId/mark-paid` - Mark invoice as paid

### 4. Frontend Features
- ✅ Email modal for sending invoices
- ✅ Download PDF button
- ✅ Mark as paid functionality
- ✅ Success/error notifications

## Setup Instructions

### 1. Email Configuration

#### For Gmail:
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Update your `.env` file:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   ```

#### For Other Email Providers:
Update the `createTransporter` function in `services/emailService.js`:
```javascript
// For Outlook
service: 'outlook',
auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD,
}

// For Yahoo
service: 'yahoo',
auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD,
}
```

### 2. Environment Variables
Add these to your `.env` file:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ACCESS_TOKEN_SECERT=your-access-token-secret
REFRESH_ACCESS_TOKEN_SECERT=your-refresh-token-secret
CONNECTION_STRING=your-mongodb-connection-string
NODE_ENV=development
```

### 3. Dependencies
The following packages have been added:
- `nodemailer` - Email sending
- `puppeteer` - PDF generation
- `handlebars` - Template engine (optional)

## Usage

### Sending an Invoice via Email
1. Navigate to an invoice detail page
2. Click the "Send Email" button
3. Enter the recipient's email address
4. Click "Send Invoice"

### Downloading an Invoice as PDF
1. Navigate to an invoice detail page
2. Click the "Download PDF" button
3. The PDF will automatically download

### Marking an Invoice as Paid
1. Navigate to an invoice detail page
2. Click the "Mark as Paid" button (only available for pending invoices)

## Email Template Features

### Professional Design
- Responsive HTML email template
- Brand colors matching the app theme
- Clean, professional layout
- Itemized invoice details
- Company and client information

### Content Includes
- Invoice number and date
- Sender and recipient addresses
- Item list with quantities and prices
- Total amount
- Payment terms and due date

## PDF Generation Features

### High-Quality Output
- A4 format with proper margins
- Print-optimized layout
- Professional styling
- Automatic file naming

### File Management
- Temporary storage in `uploads/` directory
- Automatic cleanup after 24 hours
- Unique filenames to prevent conflicts

## Error Handling

### Email Errors
- Invalid email addresses
- SMTP connection issues
- Authentication failures
- Network timeouts

### PDF Generation Errors
- Browser launch failures
- Memory issues
- File system errors
- Template rendering problems

## Security Considerations

### Email Security
- Use app passwords instead of regular passwords
- Enable 2FA on email accounts
- Validate email addresses
- Rate limiting (implement if needed)

### File Security
- Temporary file storage only
- Automatic cleanup
- No sensitive data in filenames
- Secure file permissions

## Troubleshooting

### Common Issues

1. **Email not sending**
   - Check email credentials in `.env`
   - Verify app password is correct
   - Check Gmail security settings

2. **PDF generation fails**
   - Ensure Puppeteer dependencies are installed
   - Check available system memory
   - Verify file permissions on uploads directory

3. **Authentication errors**
   - Verify JWT tokens are properly configured
   - Check token expiration settings
   - Ensure user is logged in

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
```

## Performance Optimization

### Email Optimization
- Async email sending
- Connection pooling
- Error retry logic
- Queue system (future enhancement)

### PDF Optimization
- Headless browser optimization
- Memory management
- Concurrent generation limits
- Caching (future enhancement)

## Future Enhancements

### Planned Features
- Email templates customization
- Bulk email sending
- Email tracking and analytics
- Advanced PDF customization
- Email scheduling
- Invoice reminders

### Technical Improvements
- Redis queue for email processing
- PDF caching system
- Email template editor
- Advanced error reporting
- Performance monitoring

## Support

For issues or questions:
1. Check the error logs in the console
2. Verify all environment variables are set
3. Test email credentials manually
4. Check system resources (memory, disk space)

## License

This email functionality is part of the Invoice App project and follows the same licensing terms.

