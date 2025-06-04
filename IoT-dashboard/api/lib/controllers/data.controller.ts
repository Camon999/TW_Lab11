import Controller from "../interfaces/controller.interface";
import { Request, Response, NextFunction, Router } from "express";
import { checkIdParam } from "../middlewares/deviceIdParam.middleware";
import DataService from "../modules/services/data.service";
import Joi = require("joi");

let testArr = [4, 5, 6, 3, 5, 3, 7, 5, 13, 5, 6, 4, 3, 6, 3, 6];

class DataController implements Controller {
  public path = "/api/data";
  public router = Router();
  private dataService: DataService;

  constructor() {
    this.dataService = new DataService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/:id/latest`,
      checkIdParam,
      this.getLatestEntryById
    );

    this.router.get(`${this.path}/latest/all`, this.getAllDevicesLatestData);
    this.router.get(`${this.path}/:id`, checkIdParam, this.getEntryById);
    this.router.post(`${this.path}/:id`, checkIdParam, this.addData);
    this.router.delete(`${this.path}/:id`, checkIdParam, this.deleteDeviceData);
    this.router.delete(`${this.path}/all`, this.deleteAllEntries);
  }



  private getLatestReadingsFromAllDevices = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    response.status(200).json(testArr);
  };

  private getEntryById = async (request: Request, response: Response) => {
    const { id } = request.params;
    const entry = testArr[parseInt(id)];

    if (entry === undefined) {
      return response
        .status(404)
        .json({ error: "Nie znaleziono wpisu o podanym ID" });
    }

    response.status(200).json({ id, value: entry });
  };

  private getLatestEntryById = async (request: Request, response: Response) => {
    const { id } = request.params;
    const filteredEntries = testArr.filter(
      (_, index) => index.toString() === id
    );

    if (filteredEntries.length === 0) {
      return response
        .status(404)
        .json({ error: "Nie znaleziono wpisu o podanym ID" });
    }

    const latestEntry = Math.max(...filteredEntries);
    response.status(200).json({ id, latestValue: latestEntry });
  };

  private getEntriesByRange = async (request: Request, response: Response) => {
    const { id, num } = request.params;
    const startIndex = parseInt(id);
    const count = parseInt(num);

    if (isNaN(startIndex) || isNaN(count) || startIndex < 0 || count <= 0) {
      return response
        .status(400)
        .json({ error: "Nieprawidłowe wartości parametrów" });
    }

    const entries = testArr.slice(startIndex, startIndex + count);
    response.status(200).json({ id, requestedEntries: entries });
  };

  private deleteAllEntries = async (request: Request, response: Response) => {
    testArr = [];
    response.status(200).json({ message: "Wszystkie dane zostały usunięte" });
  };

  private deleteEntryById = async (request: Request, response: Response) => {
    const { id } = request.params;
    const index = parseInt(id);

    if (index < 0 || index >= testArr.length) {
      return response
        .status(404)
        .json({ error: "Nie znaleziono wpisu o podanym ID" });
    }

    testArr.splice(index, 1);
    response
      .status(200)
      .json({ message: "Usunięto wpis", updatedArray: testArr });
  };

  private getAllDeviceData = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { id } = request.params;
    const allData = await this.dataService.query(id);
    response.status(200).json(allData);
  };

  private addData = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { air } = request.body;
    const { id } = request.params;

    const schema = Joi.object({
        air: Joi.array()
            .items(
                Joi.object({
                    id: Joi.number().integer().positive().required(),
                    value: Joi.number().positive().required()
                })
            )
            .unique((a, b) => a.id === b.id),
        deviceId: Joi.number().integer().positive().valid(parseInt(id, 10)).required()
     });

    if (!Array.isArray(air) || air.length < 3) {
      return response
        .status(400)
        .json({ message: "Prosze podac temperature, cisnienie i wilgotnosc!" });
    }

    const numericDeviceId = parseInt(id, 10);
    if (isNaN(numericDeviceId)) {
      return response.status(400).json({ message: "Bledne ID urzadzenia." });
    }

    const data = {
      temperature: air[0].value,
      pressure: air[1].value,
      humidity: air[2].value,
      deviceId: numericDeviceId,
      readingDate: new Date(),
    };

    try {
      await this.dataService.createData(data);
      response.status(200).json(data);
    } catch (error: any) {
      console.error(`Validation Error: ${error.message}`);
      response.status(400).json({ error: "Invalid input data." });
    }
  };

  private getLatestData = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { id } = request.params;
    const numericDeviceId = parseInt(id, 10);

    if (isNaN(numericDeviceId)) {
      return response
        .status(400)
        .json({ error: "Nieprawidłowy ID urządzenia (musi być liczbą)" });
    }

    try {
      const latestData = await this.dataService.get(numericDeviceId);
      response.status(200).json(latestData);
    } catch (error) {
      response
        .status(500)
        .json({ error: "Błąd podczas pobierania najnowszych danych" });
    }
  };

  private getAllDevicesLatestData = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const latestData = await this.dataService.getAllNewest();
      response.status(200).json(latestData);
    } catch (error) {
      response
        .status(500)
        .json({
          error: "Błąd podczas pobierania wszystkich najnowszych danych",
        });
    }
  };

  private deleteDeviceData = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { id } = request.params;
    const numericDeviceId = parseInt(id, 10);

    if (isNaN(numericDeviceId)) {
      return response
        .status(400)
        .json({ error: "Nieprawidłowy ID urządzenia (musi być liczbą)" });
    }

    try {
      await this.dataService.deleteData(numericDeviceId);
      response
        .status(200)
        .json({
          message: `Dane dla urządzenia ${numericDeviceId} zostały usunięte`,
        });
    } catch (error) {
      response.status(500).json({ error: "Błąd podczas usuwania danych" });
    }
  };
}

export default DataController;
