// make an HTML table using tabletop.js

// this seems not to work in jsFiddle
// window.onload = function() { init() };

var public_spreadsheet_url_1 = '1m5qgqnXrqyeBLocPuo1q9XGWH9g2ebXHoT3EVty_bIY';
var public_spreadsheet_url_2 = '1QSph_eaVJTDyh3TnoichchuJf5qipYkaxGWZ9VcAeTE';

// https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AmYzu_s7QHsmdDNZUzRlYldnWTZCLXdrMXlYQzVxSFE&output=html 

// Note - in a newer Google Sheets URL, the "key" is between the slashes 
// 1ReMXiz9K7p70yglhq1BAFsaIfUalSzq30wiXtT61GFw is the "key" from:  https://docs.google.com/spreadsheets/d/1ReMXiz9K7p70yglhq1BAFsaIfUalSzq30wiXtT61GFw/pubhtml


function init() {
  Tabletop.init({
    key: public_spreadsheet_url_1,
    callback: showInfo1,
    simpleSheet: true
  });
  Tabletop.init( { key: public_spreadsheet_url_2,
    callback: showInfo2,
    simpleSheet: true } );
}

function showInfo1(data) {

  var categories = new Set()
  for (line = 1; line < data.length; line++) {
    cat = data[line].Categories

    if (categories[cat] != null) {
      //categories[cat].push("test")
      obj = { "exg": data[line]["Exigences"], "subcat": data[line]["Subcategorie"] }
      categories[cat]["exigences"].push(obj)
    } else {
      exg = new Array()
      obj = { "exg": data[line]["Exigences"], "subcat": data[line]["Subcategorie"] }
      exg.push(obj)
      categories[cat] = { "exigences": exg };
    }
  }

  // loop over categories to create headers
  var html = "<tr>";
  for (var key in categories) {
    html += "<th>" + key + "</th>"
  }
  html += "</tr>"
  html += "<tr>"
  for (var key in categories) {
    // check if the property/key is defined in the object itself, not in parent
    if (categories.hasOwnProperty(key)) {
      html += "<td><ul>"
      for (exidx in categories[key].exigences) {
        
        if(validURL(categories[key].exigences[exidx]["exg"])) {
          html += "<li class=\"exg\"><a target=\"_blank\" href="+categories[key].exigences[exidx]["exg"]+">" + categories[key].exigences[exidx]["exg"].slice(0,20) + "...</a></li>"
        } else {
          html += "<li class=\"exg\">" + categories[key].exigences[exidx]["exg"] + "</li>"
        }
        if(categories[key].exigences[exidx]["subcat"]) {
          html += "<ol><li class=\"subcat\">" + categories[key].exigences[exidx]["subcat"] + "</li></ol>"
        }
      }
      html += "</ul></td>"
    }
  }
  html += "</tr>"


  document.getElementById("table1").innerHTML = html;
  split($("#table1"), 6)
}

function showInfo2(data) {
  var html = "<tr><th>this relation</th><th></th><th>this one</th></tr>";

  // double for-loops to do rows, cells in a table
  for (i = 0; i < data.length; i++) {
    for (prop in data[i]) {
      if(prop == "Relation") {

          html += "<td class=\"tdrelation\">" + data[i][prop] + "</td>";
        
      } else {
        if (validURL(data[i][prop])) {
          html += "<td><a target=\"_blank\" href=" + data[i][prop] + ">" + data[i][prop] + "<a></td>";
        } else {
          html += "<td>" + data[i][prop] + "</td>";
        }
      }
    }
    html += "</tr><tr>";
  }
  document.getElementById("table2").innerHTML = html;

}

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

function split($table, chunkSize) {
  var cols = $("th", $table).length - 1;
  var n = cols / chunkSize;

  for (var i = 1; i <= n; i++) {
     $("<br/>").appendTo(".exigences");
     var $newTable = $table.clone().appendTo(".exigences");
     for (var j = cols + 1; j > 1; j--) {
         if (j + chunkSize - 1 <= chunkSize * i || j > chunkSize * i + 1) {
             $('td:nth-child(' + j + '),th:nth-child(' + j + ')', $newTable).remove();
         }
     }
  }  
}

// call the function 
init();

