import { Schema } from 'mongoose';
import { ICalendar } from '../../interface/calender.interface';

export const CalendarSchema = new Schema<ICalendar>(
    {
        events: {
            type: Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);
