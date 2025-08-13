import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        isCorrect: { type: Boolean, default: false },
    },
    { _id: false }
);

const questionSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        options: {
            type: [optionSchema],
            validate: {
                validator: function (arr) {
                    return Array.isArray(arr) && arr.length === 4;
                },
                message: 'Exactly 4 options are required',
            },
            required: true,
        },
    },
    { timestamps: true }
);

questionSchema.methods.getCorrectIndex = function () {
    return this.options.findIndex((o) => o.isCorrect === true);
};

export default mongoose.model('Question', questionSchema);


