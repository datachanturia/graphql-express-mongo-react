const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

const events = eventIds => {
    return Event.find({ _id: {$in: eventIds} })
        .then(events => {
            return events.map(event => {
                return { 
                    ...event._doc, 
                    _id: event.id, 
                    creator: user.bind(this, event.creator) 
                };
            });
        })
        .catch(err => {
            throw err;
        });
}

const user = userId => {
    return User.findById(userId)
        .then(user => {
            return { 
                ...user._doc, 
                id: user.id, 
                createdEvents: events.bind(this, user._doc.createdEvents) 
            };
        })
        .catch(err => {
            throw err;
        });
};

module.exports = {
    events: () => {
        return Event.find()
            .then(events => {
                return events.map(event => { 
                    return { 
                        ...event._doc, 
                        _id: event._doc._id.toString() ,
                        creator: user.bind(this, event._doc.creator)
                    };
                });
            })
            .catch(err => {
                throw err;
            });
    },
    createEvent: (args) => {
        const { title, description, price, date } = args.eventInput;

        const event = new Event({
            title,
            description,
            price,
            date: new Date(date),
            creator: '5e0b64c0ff7afe1cd0c0b81d'
        });
        let createdEvent;

        return event.save()
            .then(result => {
                createdEvent = { ...result._doc, _id: result._doc._id.toString(), creator: user.bind(this, result._doc.creator) };
                return User.findById('5e0b64c0ff7afe1cd0c0b81d');
            })
            .then(user => {
                if(!user) {
                    throw new Error('User not found.');
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then(result => {
                return createdEvent;
            })
            .catch(err => {
                throw err;
            });
    },
    createUser: args => {
        const { email, password } = args.userInput;
        return User.findOne({ email })
            .then(user => {
                if (user) {
                    throw new Error('User exists already.')
                }
                return bcrypt.hash(password, 12);
            })
            .then(hashedPassword => {
                const user = new User({
                    email,
                    password: hashedPassword,
                });
                return user.save();
            })
            .then(result => {
                return { ...result._doc, password: null, _id: result.id };
            })
            .catch(err => {
                throw err;
            });
    },
};