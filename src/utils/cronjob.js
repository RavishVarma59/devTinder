const cronNode = require("node-cron");
const {subDays, endOfDay, startOfDay} = require("date-fns");
const UserRequest = require("../models/userRequest");
const sendEmail = require("./ses-sendEmail");

 cronNode.schedule("0 8 * * *", async ()=>{
    try {
        const yesterday = subDays(new Date(),0);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequestOfYesterday = await UserRequest.find({
            status : 'interested',
            createdAt : {
                $gte : yesterdayStart,
                $lt: yesterdayEnd
            }
        }).populate("fromUserId toUserId");

        const allRequestRecieverEmails = new Set();

        const emails = pendingRequestOfYesterday.map(res => allRequestRecieverEmails.add(res.toUserId.email));

        const arrayOfAllRecieversEmail = [...allRequestRecieverEmails];
        // console.log("set ",allRequestRecieverEmails)
        // console.log("array ",arrayOfAllRecieversEmail)

        arrayOfAllRecieversEmail.forEach(async (value,i) => {
           
            try{
                //  console.log("value ",value);
            // await sendEmail.run(
            //     "New Friend Request Pending From "+value,
            //     "Please login to devTinder and accept or reject pending request"
            // )
            } catch(err){
                console.log(err)
            }

        });


    } catch (err) {
        console.log(err);
    }
})