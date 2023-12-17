const agg = [
  {
    $match: {
      product: new ObjectId('657dc813e94ecfeff438443f'),
    },
  },
  {
    $group: {
      _id: null,
      averageRating: {
        $avg: '$rating',
      },
      numOfReviews: {
        $sum: 1,
      },
    },
  },
];
