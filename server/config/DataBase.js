const mongoose = require('mongoose');

const DataBase = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DataBase is successfylly connected");
    } catch (error) {
        console.log("DataBase is not connected");
    }
}

module.exports=DataBase