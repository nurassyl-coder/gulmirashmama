function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Parse the incoming JSON data
  var data = JSON.parse(e.postData.contents);
  
  // Get current date and time
  var timestamp = new Date();
  
  // Append the data to the sheet
  // Columns: Timestamp, Name, Choice
  sheet.appendRow([timestamp, data.name, data.attendance]);
  
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}

function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // Set up header row
  sheet.getRange(1, 1, 1, 3).setValues([["Уақыты", "Аты-жөні", "Жауабы"]]);
  sheet.setFrozenRows(1);
}
