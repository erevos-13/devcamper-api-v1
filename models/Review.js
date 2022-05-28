const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, 'Please add some text'],
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: 1,
    max: 10,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    if (obj[0]) {
      await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
        averageRating: obj[0].averageRating,
      });
    } else {
      await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
        averageRating: undefined,
      });
    }
  } catch (err) {
    console.error(err);
  }
};
ReviewSchema.post('save', function (next) {
  this.constructor.getAverageRating(this.bootcamp);
});

ReviewSchema.pre('remove', function (next) {
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);
