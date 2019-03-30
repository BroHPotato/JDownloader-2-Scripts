/*
  Author: BroHPotato
  Email:giuseppevitobitetti@libero.it

  Event script : RenameFile

  Change the name of all the file in the package with the name of the download folder
  like "name of the folder - sXXeYY.type";
  if there's subfolder in "name of the folder" named Season XX OR Specials
  (see subdirSeason AND subdirSpecials) the script uses the name of the parent folder.

  Requirements:
    Trigger "Package Finished".

  Warnings:
    Adjust the regular expression(see regex) based on your typical download file name.
*/

//globals
var mypackage = package; //get the package
var links = mypackage.getDownloadLinks(); //get all the downloaded link
var env = getEnvironment();
var firstregex = /(e|ep)(-|_| )?[0-9][0-9]/i; //ensure that the "ep" OR "e" string
                                              //followed by the number of the episode
                                              //is present
var secondregex = /[0-9][0-9]/i;  //needed to parse the number of the episode

//name of the possible subdirectory
var subdirSeason = "Season ";
var subdirSpecials = "Specials";

if(env.isWindows()) {   //Enviroment check
    var pathsep = "\\";
}
else {
    var pathsep = "/";
}

if (mypackage.isFinished()) {
    var dir = mypackage.getDownloadFolder(); //get the package directory
    if (dir.indexOf(subdirSeason) != -1 || dir.indexOf(subdirSpecials) != -1) { //checks if there's a subdirectory
        if (dir.indexOf(subdirSpecials) != -1) { //if it's "Specials"
            var nsea = "00";
            dir = dir.substring(0, dir.length - subdirSpecials.length - 1); //get the parent directory
        } else { //if it's "Season xx"
            var nsea = dir.substring(dir.length - 2);
            dir = dir.substring(0, dir.length - subdirSeason.length - 3); //get the parent directory
        }
    } else {
        sea = "01";
    }
    dir = dir.substring(dir.lastIndexOf(pathsep) + 1); //remove the path and leave only the string with the name of the directory
    for (var k = 0; k < links.length; k++) { //for each download
        var name = links[k].getName();
        var type = name.substring(name.lastIndexOf(".")); //get the extention
        var nep = firstregex.exec(name); //parse the download to extract the episode
        nep = secondregex.exec(nep);
        if (!nep) {
          alert("Wrong episode number");
        }
        links[k].setName(dir + " - s" + nsea + "e" + nep + type); //change the download name in "name of the folder - sXXeYY.type"
    }
}

