const env = require('../../env.js')
// let sqlite3 = require('sqlite3').verbose();

 const { GoogleGenAI,Type } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: "" });

const schemaYogaDisciplines = {
  description:"List of different Yoga disciplines",
  type:Type.ARRAY,
  items:{
    type:Type.OBJECT,
    properties:{
      title:{
        type:Type.STRING,
        description:"Name of the discipline",
        nullable:false
      },
      description:{
        type:Type.STRING,
        description:"Description of the discipline in no more than 20 lines",
        nullable:false
      }
    },
    required:["title","description"]
  }
}

async function main() {
  
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Give me a list of 10 displines derivated from YOGA",
    config:{
    responseMimeType:"application/json",
    responseSchema: schemaYogaDisciplines
  }
  });
  console.log(response.text)
  
  return response
}





class PageOneExample{
    
    constructor(){}

    async yogaDisciplines(req,res){    
        main()
        let _response = await main()   
        res.json(_response.text)
    }

}

module.exports = PageOneExample