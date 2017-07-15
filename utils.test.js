var expect = require('expect');
var request = require('request');
var parser = require('xml2json');
var sampleArr = []
var sampleJson = {
    "id": "0001"
    , "type": "donut"
    , "name": "Cake"
    , "ppu": 0.55
    , "batters": {
        "batter": [
            {
                "id": "1001"
                , "type": "Regular"
            }
            , {
                "id": "1002"
                , "type": "Chocolate"
            }
            , {
                "id": "1003"
                , "type": "Blueberry"
            }
            , {
                "id": "1004"
                , "type": "Devil's Food"
            }
				]
    }
    , "topping": [
        {
            "id": "5001"
            , "type": "None"
        }
        , {
            "id": "5002"
            , "type": "Glazed"
        }
        , {
            "id": "5005"
            , "type": "Sugar"
        }
        , {
            "id": "5007"
            , "type": "Powdered Sugar"
        }
        , {
            "id": "5006"
            , "type": "Chocolate with Sprinkles"
        }
        , {
            "id": "5003"
            , "type": "Chocolate"
        }
        , {
            "id": "5004"
            , "type": "Maple"
        }
		]
}
describe('GET/ Request', () => {
    it('should bring back data via a GET request', (done) => {
        var res = request('http://www.google.com');
        expect(res).toExist();
        done();
    })
})
describe('Correct Data Format', (done) => {
    it('should parse the XML data to JSON data', () => {
        var xml = "<foo attr=\"value\">bar</foo>";
        var json = parser.toJson(xml);
        expect(json).toBeA('string');
    });
})
describe('JSON format', () => {
    it('should allow the json data to be looped over', () => {
        expect(sampleJson.topping[0].id).toBe('5001');
    })
    it('should return an object that we can pick properties from', () => {
        expect(sampleJson.batters.batter[0].id).toBeA('string');
    })
})
describe('Extract Data', () => {
    it('should be able to extract data from JSON format and append it to array', () => {
        sampleArr.push(sampleJson.batters.batter[0]);
        sampleArr.push(sampleJson.batters.batter[1]);
        expect(sampleArr.length).toEqual(2);
    })
})