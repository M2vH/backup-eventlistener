/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, browser: true */
/*global $, define, brackets, Mustache */

// Changes made when in branch `master`.
// Added line in master

//DESCRIPTION:Add an EventListener on Document.afterSave().

define(function (require, exports, module) {
    "use strict";
    var File = brackets.getModule("file/FileUtils");
    var Document = brackets.getModule("document/Documents");
    var DocumentManager = brackets.getModule("document/DocumentManager");
    var Directory = brackets.getModule("filesystem/Directory");
    var FileSystem = brackets.getModule("filesystem/FileSystem");
    
    var doc = DocumentManager.getCurrentDocument();
    
    //var desktop_path = Folder.desktop.toString();
    var doc_path = File.getDirectoryPath(doc.fullName);
    var backup_path = doc_path + "/backup";
    var backup_dir = Directory.create(backup_path);
    if (FileSystem.resolve(backup_dir.fullPath) === false) {
	    FileSystem.create(backup_dir.fullPath);
    }
    
    function my_main() {
        window.alert("reached my_main.");
        doc.addEventListener('afterSave', function (theEvent) {

            // Put the rest of your code here
            // Code from http://www.indesign-faq.de/en/save-with-backup
            function two_digit(n) {
                if (n < 10) {
                    return "0" + n.toString();
                } else {
                    return n.toString();
                }
            }

            try {
                if (doc.saved === true) {
                    var doc_file = doc.fullName;
                    var doc_name = doc.name;
                    var now = new Date();
                    var datestamp = now.getFullYear().toString() + " " + two_digit(now.getMonth() + 1) + " " + two_digit(now.getDate());
                    var timestamp =  two_digit(now.getHours()) + two_digit(now.getMinutes()) + two_digit(now.getSeconds());
                    var target_folder = Directory.create(backup_path + "/" + datestamp);
                    if (target_folder.exists === false) {target_folder.create(); }
                    var target_file = target_folder.toString() + "/" + timestamp + "_" + doc_name;
                    if (doc_file.copy(target_file) === false) {
                        alert("Backup error\rCould not create backup copy.");
                    }
                }
            } catch (e) {
                alert(e);
            }
            doc.save();

             /// End of CodeSnippet

        });



    }

    // check, if there is document
    if (doc !== null) {
        my_main();
    }
    
}); // End of define







// Script from http://stackoverflow.com/a/23270797/4886503
// 
// #targetengine "session"
// 
// (function(){
//   // Keep track of the files where we've updated
//   // the user's name onto the pasteboard.
//   var isUserNameUpdated = {};
// 
//   app.addEventListener('afterSave', function(theEvent) {
//     var filename = theEvent.fullName;
//     if (isUserNameUpdated[filename] === true) {
//       return;
//     }
//     isUserNameUpdated[filename] = true;
// 
//     // Put the rest of your code here
//   });
// 
//   app.addEventListener('afterOpen', function(theEvent) {
//     // afterOpen fires twice: once when the document opens
//     // and once when the window loads. Only the first event
//     // has the fullName property. So don't run the second time,
//     // to avoid causing an error.
//     //
//     // See: http://forums.adobe.com/message/5410190
//     if (theEvent.target.constructor.name !== 'Document') {
//       return;
//     }
// 
//     // If we've previously saved the file, closed it,
//     // then opened it again, then forget that we had 
//     // saved it previously.
//     var filename = theEvent.properties.fullName;
//     isUserNameUpdated[filename] = false;
//   });
// })();
// 
