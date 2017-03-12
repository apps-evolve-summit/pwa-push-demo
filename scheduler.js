const schedule = require('node-schedule'); 

module.exports = (expression) => {
    var rule = new schedule.RecurrenceRule();
    rule.second = 13;

    var job = schedule.scheduleJob(rule, () => {
        expression();
    });

    var date = new Date(2017, 2, 09, 14, 39, 0);
    var job2 = schedule.scheduleJob(date, () => {
        console.log('2nd message');
    });
    console.log(schedule.scheduledJobs);   
};