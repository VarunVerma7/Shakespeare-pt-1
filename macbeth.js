var request = require('request');
var parser = require('xml2json');
var peopleArr = [];
var peopleArrWithCount = [];
var expect = require('expect');
// Make a HTTP get request to the data
request('http://www.ibiblio.org/xml/examples/shakespeare/macbeth.xml', function (err, response, xml) {
    // Tell the client if an answer occurs during GET request
    if (err) {
        console.log('err occured during requesting the file');
        return;
    }
    else {
        // Convert the XML Data to JSON
        var jsonString = parser.toJson(xml);
        var realJson = JSON.parse(jsonString);
        // Make an array of all the people
        createPeopleArray(realJson);
        // Now add the line counts for all the speakers
        addLineCount(realJson);
        // Sort the array in ascending order
        peopleArrWithCount.sort(function (a, b) {
                return b.count - a.count
            })
            // Remove the person 'ALL'
        peopleArrWithCount = peopleArrWithCount.filter((item) => {
            return item.person !== 'ALL'
        })
        peopleArrWithCount.forEach((personObj) => {
            console.log(`${personObj.count} ${personObj.person.toLowerCase()}`)
        })
    }
});

function createPeopleArray(realJson) {
    realJson.PLAY.ACT.map((act) => {
            act.SCENE.map((scene) => {
                // Create the array of speakers
                scene.SPEECH.map((speech) => {
                    // If speakers is an array (multiple speakers), deal with them individually and not the array 
                    if (Array.isArray(speech.SPEAKER)) {
                        speech.SPEAKER.map((speaker) => {
                            // With just one speaker, check if it exists in the array. If not add, add it to the list of speakers
                            if (!(peopleArr.includes(speaker))) {
                                peopleArr.push(speaker)
                            }
                        })
                        return;
                    }
                    // With just one speaker, check if it exists in the array. If not add, add it to the list of speakers
                    if (!(peopleArr.includes(speech.SPEAKER))) {
                        peopleArr.push(speech.SPEAKER)
                    }
                })
            })
        })
        // Now add the count property to the array
    for (var i = 0; i < peopleArr.length; i++) {
        peopleArrWithCount[i] = {
            person: peopleArr[i]
            , count: 0
        }
    }
}

function addLineCount(realJson) {
    realJson.PLAY.ACT.map((act) => {
        act.SCENE.map((scene) => {
            scene.SPEECH.map((speech) => {
                // If speakers is an array (multiple speakers), deal with them individually and not the array 
                if (Array.isArray(speech.SPEAKER)) {
                    peopleArrWithCount.forEach((obj) => {
                        speech.SPEAKER.map((speaker) => {
                            if (obj.person === speaker) {
                                // If there are multiple speakers, add the amount of lines to count
                                obj.count++
                            }
                        })
                    })
                }
                else {
                    // If there are multiple lines (hence the utilization of an array), add the line length property to the count of the respective person
                    if (Array.isArray(speech.LINE)) {
                        peopleArrWithCount.forEach((obj) => {
                            if (obj.person === speech.SPEAKER) {
                                obj.count += speech.LINE.length;
                            }
                        })
                    }
                    // If the line is String (hence only one line), add one to the property count of the respective person
                    else {
                        peopleArrWithCount.forEach((obj) => {
                            if (obj.person == speech.SPEAKER) {
                                obj.count++
                            }
                        })
                    }
                }
            })
        })
    })
}