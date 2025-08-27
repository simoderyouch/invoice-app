# 📄 Invoice Management System

A full-stack invoice management application built with React, Node.js, and MongoDB. This application allows users to create, manage, and track invoices with email notifications, payment proof uploads, and comprehensive tracking features.

![Invoice App](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-yellow)
![Express](https://img.shields.io/badge/Express-4.18.0-red)

## 🚀 Features

### ✨ Core Features
- **Invoice Management**: Create, edit, delete, and view invoices
- **Email Integration**: Send invoices via email with PDF attachments
- **Payment Tracking**: Track payment status and proof uploads
- **Email Tracking**: Monitor email opens and engagement
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Mobile-friendly interface

### 📧 Email & Communication
- **Automated Email Sending**: Send invoices automatically when created
- **PDF Generation**: Convert invoices to PDF for email attachments
- **Email Tracking**: Webhook-based email open tracking
- **Resend Functionality**: Resend invoices with updated tracking
- **Email History**: Track all email communications

### 💳 Payment System
- **Payment Proof Upload**: Clients can upload payment proofs
- **Payment Token System**: Secure public access to payment pages
- **Admin Review**: Review and approve/reject payment proofs
- **Status Tracking**: Real-time payment status updates
- **File Management**: Secure file upload and storage

### 🎨 User Interface
- **Modern Design**: Clean, intuitive interface with dark theme
- **Advanced Filtering**: Filter invoices by status, date, and amount
- **Search Functionality**: Search across client names, emails, and IDs
- **Sorting Options**: Multiple sorting criteria
- **Progress Tracking**: Form completion progress indicators
- **Animations**: Smooth Framer Motion animations

### 🔐 Security Features
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Role-based access control
- **File Validation**: Secure file upload validation
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Comprehensive form validation

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0**: Modern React with hooks and context
- **React Router DOM**: Client-side routing
- **Framer Motion**: Smooth animations and transitions
- **React Hook Form**: Form management and validation
- **Yup**: Schema validation
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls

### Backend
- **Node.js 18.0.0**: JavaScript runtime
- **Express.js 4.18.0**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token authentication
- **Multer**: File upload handling
- **Nodemailer**: Email sending functionality
- **Puppeteer**: PDF generation

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Nodemon**: Development server with auto-restart

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd invoice-app
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
cd server
npm install
```

#### Frontend Dependencies
```bash
cd ../client
npm install
```

### 3. Environment Configuration

#### Backend Environment (.env)
Create a `.env` file in the `server` directory:

```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Secrets
ACCESS_TOKEN_SECERT=your_access_token_secret
REFRESH_ACCESS_TOKEN_SECERT=your_refresh_token_secret

# Email Configuration (Gmail example)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com

# Application Configuration
BASE_URL=http://localhost:5000
NODE_ENV=development
PORT=5000
```

#### Frontend Environment
The frontend uses proxy configuration in `package.json` to connect to the backend.

### 4. Database Setup

#### MongoDB Atlas (Recommended)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Add it to your `.env` file

#### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/invoice-app`

### 5. Email Configuration

#### Gmail Setup
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in your `.env` file

#### Other Email Providers
Update the email configuration in `server/services/emailService.js` for your provider.

## 🚀 Running the Application

### Development Mode

#### Start Backend Server
```bash
cd server
npm start
```
The server will run on `http://localhost:5000`

#### Start Frontend Development Server
```bash
cd client
npm start
```
The frontend will run on `http://localhost:3000`

### Production Mode

#### Build Frontend
```bash
cd client
npm run build
```

#### Start Production Server
```bash
cd server
NODE_ENV=production npm start
```

## 📁 Project Structure

```
invoice-app/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── assets/        # Images and icons
│   │   ├── components/    # Reusable React components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   ├── App.js         # Main App component
│   │   └── index.js       # Entry point
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind CSS configuration
├── server/                # Backend Node.js application
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   ├── uploads/          # File upload directory
│   ├── package.json      # Backend dependencies
│   └── server.js         # Server entry point
└── README.md             # Project documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Invoices
- `GET /api/invoices` - Get all invoices (with filters)
- `POST /api/invoices` - Create new invoice
- `GET /api/invoices/:id` - Get specific invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `POST /api/invoices/send` - Send invoice via email
- `POST /api/invoices/resend` - Resend invoice
- `GET /api/invoices/download/:id` - Download invoice PDF
- `PUT /api/invoices/mark-paid/:id` - Mark invoice as paid

### Payment Proof
- `GET /api/payment-proof/invoice/:token` - Get invoice by payment token
- `POST /api/payment-proof/upload/:token` - Upload payment proof
- `GET /api/payment-proof/status/:token` - Get payment proof status
- `GET /api/payment-proof/download/:id` - Download payment proof
- `PUT /api/payment-proof/review/:id` - Review payment proof (admin)

### Webhooks
- `GET /api/webhook/email-opened/:trackingId` - Email open tracking

## 🎯 Usage Guide

### Creating an Invoice
1. Click "New Invoice" button
2. Fill in sender and client information
3. Add invoice items and quantities
4. Set payment terms and due date
5. Save as draft or send immediately

### Sending Invoices
1. Create or edit an invoice
2. Click "Save & Send" to send via email
3. Track email opens and engagement
4. Resend if needed

### Payment Proof Management
1. Clients receive payment link via email
2. Upload payment proof on payment page
3. Admins review and approve/reject proofs
4. Status updates automatically

### Email Tracking
- Monitor email opens in real-time
- Track engagement metrics
- View email history for each invoice

## 🔒 Security Considerations

### Authentication
- JWT tokens with refresh mechanism
- Secure token storage
- Automatic token refresh
- Protected route middleware

### File Uploads
- File type validation
- Size limits (10MB)
- Secure file storage
- Virus scanning recommended

### Data Protection
- Input validation and sanitization
- CORS configuration
- Rate limiting (recommended)
- HTTPS in production

## 🚀 Deployment

### Backend Deployment (Heroku Example)
```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
git push heroku main
```

### Frontend Deployment (Netlify Example)
```bash
# Build the application
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=build
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
EMAIL_USER=your_production_email
EMAIL_PASS=your_production_email_password
BASE_URL=https://your-domain.com
```

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

#### Email Not Sending
- Check email credentials in `.env`
- Verify app password for Gmail
- Check email provider settings

#### Database Connection Issues
- Verify MongoDB connection string
- Check network connectivity
- Ensure MongoDB service is running

#### File Upload Issues
- Check upload directory permissions
- Verify file size limits
- Ensure proper file types

### Getting Help
- Create an issue on GitHub
- Check existing issues for solutions
- Review the documentation

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Core invoice management
- Email integration
- Payment proof system
- Email tracking
- Modern UI/UX

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the database
- Express.js for the backend framework
- Tailwind CSS for the styling framework
- Framer Motion for animations

---

**Made with ❤️ by Mohamed Ed Deryouch**

For questions and support, please open an issue on GitHub.

