import * as path from 'path';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';
Handlebars.registerHelper('increment', function (value) {
  return parseInt(value) + 1;
});

export function readFile(fileName: string) {
  const pathFile = path.join(process.cwd(), 'templates', fileName);
  const data = fs.readFileSync(pathFile, 'utf-8');
  return data.toString();
}

export function getTemplate(fileName: string, data: any) {
  const source = readFile(fileName);
  const template = Handlebars.compile(source);

  return template(data);
}

export async function generatePDF(fileName: any, data: any) {
  // Đọc nội dung HTML từ file
  const htmlContent = getTemplate(fileName, data);

  // Khởi tạo Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Đưa nội dung HTML vào trang
  await page.setContent(htmlContent);

  // Xuất PDF
  const pdfBuffer = await page.pdf({ format: 'A4' });

  // Đóng trình duyệt
  await browser.close();

  console.log('PDF created successfully!');
  return pdfBuffer;
}
