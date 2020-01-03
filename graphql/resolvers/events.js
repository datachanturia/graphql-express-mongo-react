const Event = require('../../models/event');
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
    createEvent: async (args) => {
        const { title, description, price, date } = args.eventInput;
        
        const event = new Event({
            title,
            description,
            price,
            date: new Date(date),
            creator: '5e0b64c0ff7afe1cd0c0b81d'
        });
        
        try {
            const result = await event.save();
            const createdEvent = transformEvent(result);
            const creator = await User.findById('5e0b64c0ff7afe1cd0c0b81d');
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