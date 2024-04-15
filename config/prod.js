export default {
    // dbURL: 'mongodb+srv://sabbanran:ran123@cluster2.4yz9axr.mongodb.net/?retryWrites=true&w=majority&appName=cluster2',
    dbURL: process.env.MONGO_URL || 'mongodb+srv://sabbanran:ran123@cluster2.4yz9axr.mongodb.net/?retryWrites=true&w=majority&appName=cluster2',
    dbName : process.env.DB_NAME || 'oneday'
  }
  
  
