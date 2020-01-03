const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => transformEvent(event));
        } catch(err){
            throw err;
        }
    },
    createEvent: async (args, req) => {
        if(!req.isAuth){
            throw new Error('Unauthenticated!');
        }

        const { title, description, price, date } = args.eventInput;
        
        const event = new Event({
            title,
            description,
            price,
            date: new Date(date),
            creator: req.userId,
        });
        
        try {
            const result = await event.save();
            const createdEvent = transformEvent(result);
            const creator = await User.findById(req.userId);
            if (!creator){
                throw new Error('User not found.');
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        } catch(err) {
            throw err;
        }
    },
};