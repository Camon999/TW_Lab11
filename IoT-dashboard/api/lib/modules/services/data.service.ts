import DataModel from '../schemas/data.schema';
import { IData, Query } from "../models/data.model";
import { config } from '../../config';

export default class DataService {

    public async createData(dataParams: IData) {
        try {
            const dataModel = new DataModel(dataParams);
            await dataModel.save();
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }

    public async query(deviceID: string) {
        try {
            const data = await DataModel.find({ deviceId: deviceID }, { __v: 0, _id: 0 });
            return data;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async get(deviceID: number) {
        try {
            const latestEntry = await DataModel.find({ deviceId: deviceID }, { __v: 0, _id: 0 })
                .limit(1)
                .sort({ $natural: -1 });
            return latestEntry.length ? latestEntry[0] : null;
        } catch (error) {
            throw new Error(`Błąd podczas pobierania najnowszych danych: ${error}`);
        }
    }


    public async getAllNewest() {
        const latestData: any[] = [];

        await Promise.all(
            Array.from({ length: config.supportedDevicesNum }, async (_, i) => {
                try {
                    const latestEntry = await DataModel.find({ deviceId: i }, { __v: 0, _id: 0 })
                        .limit(1)
                        .sort({ $natural: -1 });
                    latestData.push(latestEntry.length ? latestEntry[0] : { deviceId: i });
                } catch (error) {
                    console.error(`Błąd przy pobieraniu danych dla urządzenia ${i}: ${error.message}`);
                    latestData.push({ deviceId: i });
                }
            })
        );

        return latestData;
    }

    public async deleteData(deviceID: number) {
        try {
            await DataModel.deleteMany({ deviceId: deviceID });
        } catch (error) {
            throw new Error(`Błąd podczas usuwania danych: ${error}`);
        }
    }


}
