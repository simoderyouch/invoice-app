const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;
const { createEmailTemplate } = require('./emailService');

// Generate PDF from invoice data
const generateInvoicePDF = async (invoice, user) => {
  try {
    // Create HTML content for PDF
    const htmlContent = createEmailTemplate(invoice, user);
    
    // Launch browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set content and wait for it to load
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    await browser.close();
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../uploads');
    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }
    
    // Save PDF to file
    const pdfPath = path.join(uploadsDir, `Invoice-${invoice.id}-${Date.now()}.pdf`);
    await fs.writeFile(pdfPath, pdfBuffer);
    
    console.log(`PDF generated successfully: ${pdfPath}`);
    return pdfPath;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

// Generate PDF and return as buffer (for direct download)
const generateInvoicePDFBuffer = async (invoice, user) => {
  try {
    const htmlContent = createEmailTemplate(invoice, user);
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    await browser.close();
    return pdfBuffer;
    
  } catch (error) {
    console.error('Error generating PDF buffer:', error);
    throw new Error(`Failed to generate PDF buffer: ${error.message}`);
  }
};

// Clean up old PDF files (optional)
const cleanupOldPDFs = async (maxAge = 24 * 60 * 60 * 1000) => { // 24 hours default
  try {
    const uploadsDir = path.join(__dirname, '../uploads');
    const files = await fs.readdir(uploadsDir);
    const now = Date.now();
    
    for (const file of files) {
      if (file.endsWith('.pdf')) {
        const filePath = path.join(uploadsDir, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await fs.unlink(filePath);
          console.log(`Deleted old PDF: ${file}`);
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up PDFs:', error);
  }
};

module.exports = {
  generateInvoicePDF,
  generateInvoicePDFBuffer,
  cleanupOldPDFs
};

