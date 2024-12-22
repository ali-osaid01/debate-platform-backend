import * as yup from "yup";


const createChatValidator = yup.object().shape({
    name: yup.string().optional(),
    lastMessage: yup.mixed().optional().nullable(),
    event: yup.string().required(),
    creator: yup.string().required(),
    participants: yup.array().of(yup.string().optional()).required(),

  });

export {createChatValidator}