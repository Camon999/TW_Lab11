export const config = {
    port: process.env.PORT || 3100,
    supportedDevicesNum: 17,
    //databaseUrl: process.env.MONGODB_URI || 'mongodb+srv://twwai:KTp5wYwutrLHPLT@cluster0.ooees.mongodb.net/IoT?retryWrites=true&w=majority',
    databaseUrl: process.env.MONGODB_URI || 'mongodb+srv://37747:37747@cluster0.5mggoir.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',

    JwtSecret: "secret"
 };