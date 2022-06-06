const express = require("express");
const router = express.Router();

const { Report , AggregateReport } = require("../Database/schema")

router.post("/reports",(req,res)=>{
   
    try{
        const { user_ID,
                market_ID,
                market_Name,
                cmdty_ID,
                market_Type ,
                cmdty_Name,
                price_Unit,
                conv_Fctr,
                price_o
            } = req.body; 

        const price_InKg = price_Unit!=="Kg"?price_o/conv_Fctr:price_o;

        const report = new  Report({
            userID  : user_ID,
            marketID: market_ID,
            marketName : market_Name,
            cmdtyID :  cmdty_ID,
            marketType : market_Type,
            cmdtyName : cmdty_Name ,
            priceUnit : price_Unit ,
            convFctr : conv_Fctr,
            price : price_o,
            priceInKg : price_InKg
        });
        
        Report.findOne({userID:user_ID,marketID:market_ID,cmdtyID:cmdty_ID},async(err,exist_report)=>{
             
            if(!exist_report){

                await report.save(()=>{

                    // Now Update the aggregated report
                    AggregateReport.findOne({
                        marketID:market_ID,cmdtyID:cmdty_ID
                    })
                    .then((aggr_report)=>{
                        if(!aggr_report){
            
                            aggr_report = new AggregateReport({
                                cmdtyName : cmdty_Name,
                                cmdtyID : cmdty_ID,
                                marketID : market_ID,
                                marketName : market_Name,
                                users : user_ID ,
                                priceUnit : "Kg",
                                aggrPrice :  price_InKg
                            });
            
                            aggr_report.save();
                                
                            console.log(".... Aggregated Report Saved ....");   
                            return res.status(201).json({
                                    status: "success",
                                    reportID: aggr_report._id    
                            });   
            
                        }else{
            
                            const currUsers=aggr_report.users.length;
                            const newAggr_price = ((aggr_report.aggrPrice*currUsers)+price_InKg)/(currUsers+1); 
                            
                            AggregateReport.updateOne({
                                marketID:market_ID,cmdtyID:cmdty_ID
                            },
                            { $push: { users: user_ID },aggrPrice:newAggr_price})
                            .then((data)=>{
                                
                                console.log(".... Aggregated Report Saved ....");
                                return res.status(201).json({
                                        status: "success",
                                        reportID: aggr_report._id
                                });
                            })
                            
                        }
                    })
                });
            }
            else{
                // if there is existing report same then it should not update the agrregate report
                 AggregateReport.findOne({
                    marketID:market_ID,cmdtyID:cmdty_ID
                 },(err,aggr_report)=>{
                    console.log(".... Same data  already exist in Database ....");
                    return res.status(201).json({
                        status: "success",
                        reportID: aggr_report._id
                    });
                 })
            }
        });    

    }
    catch(err){
        return res.status(422).json(err);
    }
})


router.get("/reports",(req,res)=>{
    
    try{
        const report_id =  req.query.reportID;
        
        AggregateReport.findOne({ _id : report_id},(err,aggr_report)=>{

            if(!aggr_report){
                return  res.status(422).json("Invalid Report Id");
            }
            else{
                return res.status(200).json({
                    _id: aggr_report._id,
                    cmdtyName: aggr_report.cmdtyName,
                    cmdtyId: aggr_report.cmdtyID,
                    marketName: aggr_report.marketName,
                    marketId: aggr_report.marketID,
                    users: aggr_report.users,
                    timestamp: aggr_report.updatedAt,
                    priceUnit: aggr_report.priceUnit,
                    price: (aggr_report.aggrPrice)
                });
            }
        });
    }
    catch(err){
        return res.status(422).json(err);
    }

})


module.exports = router;