const cron = require("node-cron");
const config = require("../configs/globalConfig");
const { Task } = require("../models/taskModel");
const { User } = require("../models/userModel");

const accountSid = config.twilio.accountSid;
const authToken = config.twilio.authToken;
const twilioNumber = config.twilio.twilioPhoneNumber;

const client = require("twilio")(accountSid, authToken);

const scheduleVoiceCall = async (phoneNumber) => {
    console.log(`Scheduling voice call with +91${phoneNumber} from ${twilioNumber} at ${new Date()}`);

    try{
        const call = await client.calls.create({
            url: "http://demo.twilio.com/docs/voice.xml",
            to: `+91${phoneNumber}`,
            from: twilioNumber,
        });

        console.log("call sid:", call.sid);
        return true;
    } 
    catch(err){
        console.log("Error in call:", err);
        return false;
    }
};

const scheduleOverDueTasks = () => {
    cron.schedule("0 */9 * * *", async () => {
        try{
            const tasks = await Task.findAll({
                where: {
                    priority: 0,
                    status: ["TODO", "IN PROGRESS"],
                },
                include: [
                    {
                        model: User,
                        as: "User",
                    },
                ],
                order: [
                    [{ model: User, as: 'User' }, 'priority', 'ASC'],
                    ['due_date', 'ASC'],
                ],
            });

            for(const task of tasks) {
                const user = await task.getUser();
                const phoneNumber = user.phone_number;

                const isCallSuccessful = await scheduleVoiceCall(phoneNumber);

                if(isCallSuccessful) {
                    break;
                }
            }
        } 
        catch(error){
            console.error("Error in scheduling overdue tasks:", error);
        }
    }, { timezone: "Asia/Kolkata", scheduled: true });
};

module.exports = {
    scheduleOverDueTasks,
};
