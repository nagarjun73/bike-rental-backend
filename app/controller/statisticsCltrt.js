const Payment = require("../model/paymentModel")
const Trip = require("../model/tripModel")
const User = require("../model/userModel")
const Vehicle = require("../model/vehicleModel")


const statisticsCltr = {}

statisticsCltr.get = async (req, res) => {
  try {
    const usrCount = await User.count()
    const countByRole = await User.aggregate([{
      $group: { _id: "$role", count: { $sum: 1 } }
    }])


    const vclCount = await Vehicle.count()
    const countByType = await Vehicle.aggregate([{
      $group: { _id: "$vehicleType", count: { $sum: 1 } }
    }])

    const tripCount = await Trip.count()
    const countByStatus = await Trip.aggregate([{
      $group: { _id: "$tripStatus", count: { $sum: 1 } }
    }])

    const totalExpenses = await Payment.aggregate([{
      $group: { _id: null, totalExpenses: { $sum: { $toInt: "$amount" } } }
    }])

    const totalExpensesByMonth = await Payment.aggregate([
      {
        $project: {
          //take month from createdAt
          month: { $month: "$createdAt" },
        }
      },
      {
        $group: {
          _id: "$month",
          expenseaOfMonth: { $sum: 1 },
        }
      },
      {
        $project: {
          _id: 0, // Exclude the default _id field from the output
          month: "$_id",
          expenseaOfMonth: 1,
        }
      },
      {
        $sort: {
          month: 1, // Sort by month in ascending order
        },
      }
    ])

    res.json({
      users: {
        usersCount: usrCount,
        userCountByRole: countByRole
      },
      vehicles: {
        vehicleCount: vclCount,
        vehicleTypeCount: countByType
      },
      trips: {
        tripCount: tripCount,
        tripCountbyStatus: countByStatus
      },
      expenses: {
        totalExpenses: totalExpenses,
        totalExpensesByMonth: totalExpensesByMonth
      }
    })
  } catch (e) {
    res.status(400).json(e)
  }
}

module.exports = statisticsCltr