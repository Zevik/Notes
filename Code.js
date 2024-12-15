// Google Sheets ID - יש להחליף ל-ID של הגיליון שלך
const SHEET_ID = '1fLGaAxAoYihFeczg6bWqOylqADq0_b-u3fBN2lfSreQ';
const SHEET_NAME = 'Notes';

// פונקציה ליצירת ממשק המשתמש
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('מערכת פתקים')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// פונקציה לשמירת פתק חדש
function saveNote(noteText, labels) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    const date = new Date().toLocaleDateString('he-IL');
    sheet.appendRow([date, noteText, labels]);
    
    return { success: true, message: 'הפתק נשמר בהצלחה' };
  } catch (error) {
    return { success: false, message: 'שגיאה בשמירת הפתק: ' + error.toString() };
  }
}

// פונקציה לקבלת כל הפתקים
function getAllNotes() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    // מסיר את שורת הכותרות אם קיימת
    if (data.length > 0) {
      data.shift();
    }
    
    return data;
  } catch (error) {
    throw new Error('שגיאה בטעינת הפתקים: ' + error.toString());
  }
}

// פונקציית חיפוש פתקים
function searchNotes(searchText, label) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    // מסיר את שורת הכותרות אם קיימת
    if (data.length > 0) {
      data.shift();
    }
    
    return data.filter(row => {
      const noteText = row[1].toString().toLowerCase();
      const noteLabels = row[2].toString().toLowerCase();
      const searchLower = searchText.toLowerCase();
      
      // אם יש תווית לחיפוש, בודק גם אותה
      if (label) {
        return noteText.includes(searchLower) && 
               noteLabels.includes(label.toLowerCase());
      }
      
      // אחרת, מחפש רק בטקסט
      return noteText.includes(searchLower);
    });
  } catch (error) {
    throw new Error('שגיאה בחיפוש פתקים: ' + error.toString());
  }
}

// פונקציה לקבלת כל התוויות הקיימות
function getExistingLabels() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    const data = sheet.getRange('C2:C').getValues();
    
    // מסנן תאים ריקים ומשטח את המערך של התוויות
    const allLabels = data
      .flat()
      .filter(label => label !== '')
      .reduce((acc, curr) => {
        // מפצל תוויות מרובות (אם יש)
        const labels = curr.split(',').map(l => l.trim());
        return [...acc, ...labels];
      }, []);
    
    // מסיר כפילויות
    return [...new Set(allLabels)].sort();
  } catch (error) {
    throw new Error('שגיאה בטעינת התוויות: ' + error.toString());
  }
}