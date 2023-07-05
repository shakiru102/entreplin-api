import { Request, Response } from "express";
import fs from 'fs'

const countries = JSON.parse(fs.readFileSync('./countries.json').toString())

export const getCountries = async (req: Request, res: Response) => {

    try {
        res.status(200).json(countries.data)
    } catch (error: any) {
       res.status(500).send({ error: error.message }); 
    }
}