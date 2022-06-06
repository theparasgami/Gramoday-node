const app = require("./app");
const request = require("supertest");
const mongoose = require("mongoose");

afterAll( done => {
    // Closing the DB connection allows Jest to exit successfully.
       mongoose.connection.close()
       .then(()=>done())
       .catch((err)=>console.log(err));
});


describe("Api testing :",()=>{
    
    var reportId;

    test("Testing Post Api's", async() => {
        const report1 = {
            user_ID: "user-1",
            market_ID: "market-1",
            market_Name: "Vashi Navi Mumbai",
            cmdty_ID: "cmdty-1",
            market_Type: "Mandi",
            cmdty_Name: "Potato",
            price_Unit: "Pack",
            conv_Fctr: 50,
            price_o: 700
        };
        const report2 = {
            user_ID: "user-2",
            market_ID: "market-1",
            market_Name: "Vashi Navi Mumbai",
            cmdty_ID: "cmdty-1",
            cmdty_Name: "Potato",
            price_Unit: "Quintal",
            conv_Fctr: 100,
            price_o: 1600
        };
        try {
            const response1=await request(app).post('/reports').send(report1);
            const response2=await request(app).post('/reports').send(report2);
            
            console.log("Response -1: ", response1.body);
            console.log("Response -2: ", response2.body);
            expect(response1.statusCode).toBe(201);
            expect(response1.body).toHaveProperty("reportID");
            expect(response1.body.status).toBe("success");
            expect(response2.statusCode).toBe(201);
            expect(response2.body).toHaveProperty("reportID");
            expect(response2.body.status).toBe("success");
            
            reportId=response1.body.reportID;
            
        } catch (err) {
            console.log(`Error ${err}`)
        }
        
    });


    test("Testing Get Api",async()=>{

        try{
            const response = await request(app).get(`/reports?reportID=${reportId}`);
            console.log("Response : ", response.body);
            expect(response.statusCode).toBe(200);
        }catch (err) {
            console.log(`Error ${err}`)
        }

    })
})
    
